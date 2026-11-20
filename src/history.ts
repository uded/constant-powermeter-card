import type { HaConnection } from './types/ha';
import type { Sample } from './types/sample';

export type SampleStore = Map<string, Sample[]>;

export interface StreamMessage {
  states?: Record<string, { s: string; lu?: number; lc?: number }[]>;
}

const DEBOUNCE_MS = 1000;
const TRIM_INTERVAL_MS = 60_000;
const HOUR_MS = 3_600_000;
/** home-assistant-js-websocket's ERR_CONNECTION_LOST. */
const ERR_CONNECTION_LOST = 3;

/** isConnectionLost matches both shapes the HA websocket library rejects with on a dropped socket. */
export function isConnectionLost(err: unknown): boolean {
  if (err === ERR_CONNECTION_LOST) return true;
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: unknown }).code === ERR_CONNECTION_LOST
  );
}

function parseValue(s: string): number | null {
  if (s.trim() === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Index of the first sample with t >= target. */
function lowerBound(arr: Sample[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid].t < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function insertSample(arr: Sample[], sample: Sample): void {
  const i = lowerBound(arr, sample.t);
  if (i < arr.length && arr[i].t === sample.t) arr[i] = sample;
  else arr.splice(i, 0, sample);
}

/** Merge a history/stream message into the store, keeping each series sorted by t with unique t. */
export function applyStreamMessage(store: SampleStore, msg: StreamMessage): void {
  if (!msg.states) return;
  for (const [entityId, states] of Object.entries(msg.states)) {
    let arr = store.get(entityId);
    for (const st of states) {
      const seconds = st.lu ?? st.lc;
      if (seconds === undefined) continue;
      if (!arr) {
        arr = [];
        store.set(entityId, arr);
      }
      insertSample(arr, { t: seconds * 1000, v: parseValue(st.s) });
    }
  }
}

/** Drop samples older than cutoffMs, keeping the last one before it so the series still has a start value. */
export function trimStore(store: SampleStore, cutoffMs: number): void {
  for (const arr of store.values()) {
    const firstKept = lowerBound(arr, cutoffMs);
    if (firstKept > 1) arr.splice(0, firstKept - 1);
  }
}

export interface HistorySource {
  /** Debounced (re)subscribe for the given entities and window. */
  update(entityIds: string[], hours: number): void;
  close(): void;
  readonly store: SampleStore;
}

/** History source backed by the HA `history/stream` websocket subscription. */
export class StreamHistorySource implements HistorySource {
  readonly store: SampleStore = new Map();

  private activeKey: string | undefined;
  private hours = 0;
  /** Bumped on every (re)subscribe and close; stale callbacks and late resolutions compare against it. */
  private generation = 0;
  private unsub: (() => Promise<void>) | undefined;
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private trimTimer: ReturnType<typeof setInterval> | undefined;
  private pendingKey: string | undefined;
  private activeIds: string[] = [];
  private listening = false;

  /**
   * Runs when the connection comes back after a drop. The subscription is made with
   * resubscribe: false, so the library does not replay a start_time frozen at the first
   * subscribe; subscribe again here with a fresh window. This also retries a failed one.
   */
  private readonly onReady = (): void => {
    // The old subscription died with the socket and its id may be reused on the new one,
    // so drop it without sending an unsubscribe.
    this.unsub = undefined;
    if (this.debounceTimer !== undefined) {
      // A pending debounce subscribes fresh; make sure it is not cancelled as a no-op.
      this.activeKey = undefined;
      return;
    }
    if (this.activeKey === undefined || this.activeIds.length === 0) return;
    this.subscribe(this.activeIds, this.hours, this.activeKey);
  };

  constructor(
    private readonly conn: HaConnection,
    private readonly onChange: () => void,
    private readonly now: () => number = Date.now,
  ) {}

  update(entityIds: string[], hours: number): void {
    const ids = [...new Set(entityIds)].sort();
    const key = `${ids.join(',')}|${hours}`;
    if (key === (this.debounceTimer ? this.pendingKey : this.activeKey)) return;
    this.clearDebounce();
    if (key === this.activeKey) return;
    this.pendingKey = key;
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = undefined;
      this.subscribe(ids, hours, key);
    }, DEBOUNCE_MS);
  }

  close(): void {
    this.clearDebounce();
    this.generation++;
    this.teardown();
    this.activeKey = undefined;
    this.activeIds = [];
    if (this.listening) this.conn.removeEventListener('ready', this.onReady);
    this.listening = false;
  }

  private clearDebounce(): void {
    if (this.debounceTimer !== undefined) clearTimeout(this.debounceTimer);
    this.debounceTimer = undefined;
    this.pendingKey = undefined;
  }

  private teardown(): void {
    if (this.trimTimer !== undefined) clearInterval(this.trimTimer);
    this.trimTimer = undefined;
    const unsub = this.unsub;
    this.unsub = undefined;
    if (unsub) void unsub().catch(() => {});
    this.store.clear();
  }

  private subscribe(ids: string[], hours: number, key: string): void {
    const hadData = this.store.size > 0;
    this.teardown();
    if (hadData) this.onChange();
    const gen = ++this.generation;
    this.activeKey = key;
    this.activeIds = ids;
    this.hours = hours;
    if (ids.length === 0) return;
    if (!this.listening) {
      this.conn.addEventListener('ready', this.onReady);
      this.listening = true;
    }

    const startMs = this.now() - hours * HOUR_MS;
    this.trimTimer = setInterval(
      () => trimStore(this.store, this.now() - this.hours * HOUR_MS),
      TRIM_INTERVAL_MS,
    );

    this.conn
      .subscribeMessage<StreamMessage>(
        (msg) => {
          if (gen !== this.generation) return;
          applyStreamMessage(this.store, msg);
          this.onChange();
        },
        {
          type: 'history/stream',
          entity_ids: ids,
          start_time: new Date(startMs).toISOString(),
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: false,
        },
        { resubscribe: false },
      )
      .then((unsub) => {
        if (gen === this.generation) this.unsub = unsub;
        else void unsub().catch(() => {});
      })
      .catch((err: unknown) => {
        // A socket that drops mid-subscribe is routine: the `ready` handler resubscribes.
        if (gen === this.generation && !isConnectionLost(err))
          console.error('powermeter-card: history/stream subscription failed', err);
      });
  }
}
