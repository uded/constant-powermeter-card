import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyStreamMessage,
  StreamHistorySource,
  trimStore,
  type SampleStore,
} from '../src/history';
import { mockConnection } from './mocks';

describe('applyStreamMessage', () => {
  it('parses minimal states, using lc when lu is missing', () => {
    const s: SampleStore = new Map();
    applyStreamMessage(s, {
      states: {
        'sensor.a': [
          { s: '5', lu: 10 },
          { s: 'unavailable', lc: 20 },
        ],
      },
    });
    expect(s.get('sensor.a')).toEqual([
      { t: 10000, v: 5 },
      { t: 20000, v: null },
    ]);
  });
  it('maps unknown and empty states to null', () => {
    const s: SampleStore = new Map();
    applyStreamMessage(s, {
      states: {
        'sensor.a': [
          { s: 'unknown', lu: 1 },
          { s: '', lu: 2 },
          { s: '-3.5', lu: 3 },
        ],
      },
    });
    expect(s.get('sensor.a')!.map((x) => x.v)).toEqual([null, null, -3.5]);
  });
  it('keeps the store sorted and deduplicated', () => {
    const s: SampleStore = new Map();
    applyStreamMessage(s, {
      states: {
        'sensor.a': [
          { s: '1', lu: 10 },
          { s: '3', lu: 30 },
        ],
      },
    });
    applyStreamMessage(s, {
      states: {
        'sensor.a': [
          { s: '3', lu: 30 },
          { s: '2', lu: 20 },
        ],
      },
    });
    expect(s.get('sensor.a')!.map((x) => x.t)).toEqual([10000, 20000, 30000]);
  });
  it('replaces the value of a sample with the same timestamp', () => {
    const s: SampleStore = new Map();
    applyStreamMessage(s, { states: { 'sensor.a': [{ s: '1', lu: 10 }] } });
    applyStreamMessage(s, { states: { 'sensor.a': [{ s: '9', lu: 10 }] } });
    expect(s.get('sensor.a')).toEqual([{ t: 10000, v: 9 }]);
  });
  it('handles overlapping, out-of-order batches across messages', () => {
    const s: SampleStore = new Map();
    applyStreamMessage(s, {
      states: {
        'sensor.a': [
          { s: '4', lu: 40 },
          { s: '2', lu: 20 },
          { s: '2', lu: 20 },
        ],
      },
    });
    applyStreamMessage(s, {
      states: {
        'sensor.a': [
          { s: '5', lu: 50 },
          { s: '1', lu: 10 },
          { s: '4', lu: 40 },
        ],
      },
    });
    expect(s.get('sensor.a')).toEqual([
      { t: 10000, v: 1 },
      { t: 20000, v: 2 },
      { t: 40000, v: 4 },
      { t: 50000, v: 5 },
    ]);
  });
  it('ignores messages without states and states without any timestamp', () => {
    const s: SampleStore = new Map();
    applyStreamMessage(s, {});
    applyStreamMessage(s, { states: { 'sensor.a': [{ s: '1' }] } });
    expect(s.get('sensor.a') ?? []).toEqual([]);
  });
});

describe('trimStore', () => {
  it('trims old samples but keeps the last one before the cutoff', () => {
    const s: SampleStore = new Map([
      [
        'sensor.a',
        [
          { t: 1, v: 1 },
          { t: 2, v: 2 },
          { t: 9, v: 9 },
        ],
      ],
    ]);
    trimStore(s, 5);
    expect(s.get('sensor.a')).toEqual([
      { t: 2, v: 2 },
      { t: 9, v: 9 },
    ]);
  });
  it('leaves samples at or after the cutoff untouched', () => {
    const s: SampleStore = new Map([
      [
        'sensor.a',
        [
          { t: 5, v: 1 },
          { t: 9, v: 9 },
        ],
      ],
    ]);
    trimStore(s, 5);
    expect(s.get('sensor.a')).toEqual([
      { t: 5, v: 1 },
      { t: 9, v: 9 },
    ]);
  });
});

describe('StreamHistorySource', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('subscribes once after a 1 s debounce with the spec message', async () => {
    const conn = mockConnection();
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    src.update(['sensor.a', 'sensor.b'], 1);
    await vi.advanceTimersByTimeAsync(999);
    expect(conn.calls).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);
    expect(conn.calls).toHaveLength(1);
    expect(conn.calls[0].msg).toEqual({
      type: 'history/stream',
      entity_ids: ['sensor.a', 'sensor.b'],
      start_time: new Date(0).toISOString(),
      minimal_response: true,
      no_attributes: true,
      significant_changes_only: false,
    });
    src.close();
  });

  it('does not resubscribe when ids and hours are unchanged', async () => {
    const conn = mockConnection();
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.b', 'sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    src.update(['sensor.a', 'sensor.b'], 1);
    await vi.advanceTimersByTimeAsync(2000);
    expect(conn.calls).toHaveLength(1);
    expect(conn.calls[0].unsub).not.toHaveBeenCalled();
    src.close();
  });

  it('applies pushed messages to the store and notifies', async () => {
    const conn = mockConnection();
    const onChange = vi.fn();
    const src = new StreamHistorySource(conn, onChange, () => 3_600_000);
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    conn.push({ states: { 'sensor.a': [{ s: '7', lu: 100 }] } });
    expect(src.store.get('sensor.a')).toEqual([{ t: 100000, v: 7 }]);
    expect(onChange).toHaveBeenCalledTimes(1);
    src.close();
  });

  it('keeps the store sorted and deduplicated across history and pushed updates', async () => {
    const conn = mockConnection();
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    conn.push({
      states: {
        'sensor.a': [
          { s: '1', lu: 10 },
          { s: '3', lu: 30 },
        ],
      },
    });
    conn.push({ states: { 'sensor.a': [{ s: '4', lu: 40 }] } });
    conn.push({
      states: {
        'sensor.a': [
          { s: '3', lu: 30 },
          { s: '2', lu: 20 },
        ],
      },
    });
    expect(src.store.get('sensor.a')!.map((x) => x.t)).toEqual([10000, 20000, 30000, 40000]);
    src.close();
  });

  it('unsubscribes the old subscription and clears the store when ids change', async () => {
    const conn = mockConnection();
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    conn.push({ states: { 'sensor.a': [{ s: '1', lu: 10 }] } });
    src.update(['sensor.b'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(2);
    expect(conn.calls[0].unsub).toHaveBeenCalledTimes(1);
    expect(conn.calls[1].unsub).not.toHaveBeenCalled();
    expect(src.store.size).toBe(0);
    // A late message from the old subscription must not leak into the store.
    conn.push({ states: { 'sensor.a': [{ s: '2', lu: 20 }] } }, 0);
    expect(src.store.size).toBe(0);
    src.close();
  });

  it('resubscribes when hours change', async () => {
    const conn = mockConnection();
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    src.update(['sensor.a'], 2);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(2);
    expect(conn.calls[0].unsub).toHaveBeenCalledTimes(1);
    src.close();
  });

  it('closes the old subscription on close; one live subscription after re-add', async () => {
    const conn = mockConnection();
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    src.close();
    expect(conn.calls[0].unsub).toHaveBeenCalledTimes(1);
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(2);
    expect(conn.calls[0].unsub).toHaveBeenCalledTimes(1);
    expect(conn.calls[1].unsub).not.toHaveBeenCalled();
    const live = conn.calls.filter((c) => c.unsub.mock.calls.length === 0);
    expect(live).toHaveLength(1);
    src.close();
    expect(conn.calls[1].unsub).toHaveBeenCalledTimes(1);
  });

  it('cancels a pending debounce on close', async () => {
    const conn = mockConnection();
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    src.close();
    await vi.advanceTimersByTimeAsync(2000);
    expect(conn.calls).toHaveLength(0);
  });

  it('unsubscribes a subscription that resolves after close()', async () => {
    let resolveSub!: (u: () => Promise<void>) => void;
    const unsub = vi.fn(() => Promise.resolve());
    const conn = {
      subscribeMessage: vi.fn(
        () =>
          new Promise<() => Promise<void>>((r) => {
            resolveSub = r;
          }),
      ),
    };
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    src.close();
    resolveSub(unsub);
    await vi.advanceTimersByTimeAsync(0);
    expect(unsub).toHaveBeenCalledTimes(1);
  });

  it('trims the store every 60 s using the sliding window', async () => {
    const conn = mockConnection();
    let now = 3_600_000;
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => now,
    );
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    conn.push({
      states: {
        'sensor.a': [
          { s: '1', lu: 1 },
          { s: '2', lu: 2 },
          { s: '3', lu: 3000 },
        ],
      },
    });
    now = 3_600_000 + 10_000; // cutoff = 10_000 ms
    await vi.advanceTimersByTimeAsync(60_000);
    expect(src.store.get('sensor.a')!.map((x) => x.t)).toEqual([2000, 3000000]);
    src.close();
  });

  it('logs a failed subscription once and keeps working', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const conn = mockConnection();
    conn.failNext(new Error('boom'));
    const src = new StreamHistorySource(
      conn,
      () => {},
      () => 3_600_000,
    );
    src.update(['sensor.a'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(err).toHaveBeenCalledTimes(1);
    src.update(['sensor.a', 'sensor.b'], 1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(1);
    expect(err).toHaveBeenCalledTimes(1);
    src.close();
  });
});
