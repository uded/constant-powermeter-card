import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { runTapAction } from './actions';
import { bucketize } from './buckets';
import { normalizeConfig, type CardConfig, type ResolvedCard, type ResolvedMeter } from './config';
import { barGeometry, sparklineRange } from './geometry';
import { StreamHistorySource } from './history';
import { levelColor, resolvePalette, type Palette } from './levels';
import { renderSparkline } from './sparkline';
import type { HomeAssistant } from './types/ha';

const BUCKETS = 60;
const HOUR_MS = 3_600_000;
const MAX_PRECISION = 10;
const CARD_TYPE = 'custom:constant-powermeter-card';
/** The sparkline window is re-rendered at least this rarely, so a steady sensor still scrolls. */
const MIN_TICK_MS = 15_000;
/** How long the shown number takes to move from the old real value to the new one. */
export const TWEEN_MS = 500;

interface Tween {
  from: number;
  to: number;
  start: number;
}

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** parseState returns the numeric value of an entity state, or null when it is not a number. */
function parseState(s: string | undefined): number | null {
  if (s === undefined || s.trim() === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function clampPrecision(p: number | undefined): number {
  if (p === undefined || !Number.isFinite(p)) return 0;
  return Math.min(MAX_PRECISION, Math.max(0, Math.round(p)));
}

/**
 * bucketColors gives one level color per bucket. A null bucket reuses the previous
 * color, or the first non-null bucket's color when it leads. All-null yields [].
 */
export function bucketColors(
  buckets: (number | null)[],
  meter: Pick<ResolvedMeter, 'normal' | 'warning' | 'critical' | 'twoSided'>,
  palette: Palette,
  blend: boolean,
): string[] {
  const first = buckets.find((b): b is number => b !== null);
  if (first === undefined) return [];
  let prev = levelColor(first, meter, palette, blend);
  return buckets.map((b) => {
    if (b !== null) prev = levelColor(b, meter, palette, blend);
    return prev;
  });
}

/** ConstantPowermeterCard renders several power meters with a sparkline and/or a bar. */
export class ConstantPowermeterCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    preview: { type: Boolean },
    config: { state: true },
  };

  declare hass?: HomeAssistant;
  /** Set by HA on cards shown in the edit dialog preview; disables tap actions. */
  declare preview: boolean;
  declare config?: ResolvedCard;

  private palette?: Palette;
  private history?: StreamHistorySource;
  private tickTimer?: ReturnType<typeof setInterval>;
  private tickMs = 0;
  private readonly formats = new Map<string, Intl.NumberFormat>();
  /** The number currently shown per entity, and its running transition to a new real value. */
  private readonly shown = new Map<string, number>();
  private readonly tweens = new Map<string, Tween>();
  private frame?: number;

  constructor() {
    super();
    this.preview = false;
  }

  /** getConfigElement returns the visual editor; it is registered by src/index.ts. */
  static getConfigElement(): HTMLElement {
    return document.createElement('constant-powermeter-card-editor');
  }

  /** getStubConfig picks a power sensor (or any sensor) for the card picker. */
  static getStubConfig(hass: HomeAssistant): CardConfig {
    const sensors = Object.values(hass.states).filter((e) => e.entity_id.startsWith('sensor.'));
    const power = sensors.find(
      (e) =>
        e.attributes.device_class === 'power' ||
        e.attributes.unit_of_measurement === 'W' ||
        e.attributes.unit_of_measurement === 'kW',
    );
    return { type: CARD_TYPE, meters: [(power ?? sensors[0])?.entity_id ?? 'sensor.power'] };
  }

  /** setConfig validates the config; a ConfigError makes HA show its error card. */
  setConfig(raw: unknown): void {
    this.config = normalizeConfig(raw);
    this.palette = undefined;
    this.syncHistory();
    this.syncTick();
  }

  /** getCardSize estimates the height in 50 px units. */
  getCardSize(): number {
    if (!this.config) return 1;
    const lines = this.config.meters.reduce((n, m) => n + (m.display.includes('bar') ? 2 : 1), 0);
    return (this.config.title ? 1 : 0) + Math.max(1, Math.ceil(lines / 2));
  }

  /**
   * getGridOptions sizes the card in sections dashboards: full width by default,
   * at least half width so the sparkline stays readable, and height from content.
   */
  getGridOptions(): { columns: number; rows: 'auto'; min_columns: number } {
    return { columns: 12, rows: 'auto', min_columns: 6 };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.syncHistory();
    this.syncTick();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.history?.close();
    this.history = undefined;
    this.stopTick();
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = undefined;
  }

  /**
   * shownValue eases the displayed number from the previous real value to the new
   * real value over TWEEN_MS. It never invents values: it only moves between two
   * readings HA reported. Missing data and reduced motion snap immediately.
   */
  private shownValue(entity: string, target: number | null, now: number): number | null {
    if (target === null) {
      this.shown.delete(entity);
      this.tweens.delete(entity);
      return null;
    }
    const prev = this.shown.get(entity);
    if (prev === undefined || reducedMotion()) {
      this.shown.set(entity, target);
      this.tweens.delete(entity);
      return target;
    }
    let t = this.tweens.get(entity);
    if (!t || t.to !== target) {
      if (!t && prev === target) return target;
      t = { from: prev, to: target, start: now };
      this.tweens.set(entity, t);
    }
    const p = Math.min(1, (now - t.start) / TWEEN_MS);
    const v = t.from + (t.to - t.from) * (1 - (1 - p) ** 3);
    this.shown.set(entity, v);
    if (p >= 1) this.tweens.delete(entity);
    return v;
  }

  protected updated(): void {
    // Re-render on the next frame only while a number is still moving.
    if (this.tweens.size === 0 || this.frame !== undefined || !this.isConnected) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      this.requestUpdate();
    });
  }

  /**
   * Re-renders once per bucket width so the sparkline window keeps moving when
   * neither hass.states nor history/stream report anything (a steady sensor).
   */
  private syncTick(): void {
    if (!this.isConnected || !this.config) return;
    const ms = Math.max(MIN_TICK_MS, (this.config.hours * HOUR_MS) / BUCKETS);
    if (this.tickTimer !== undefined && ms === this.tickMs) return;
    this.stopTick();
    this.tickMs = ms;
    this.tickTimer = setInterval(() => this.requestUpdate(), ms);
  }

  private stopTick(): void {
    if (this.tickTimer !== undefined) clearInterval(this.tickTimer);
    this.tickTimer = undefined;
    this.tickMs = 0;
  }

  /** Creates the history source once connected with hass and config, then (re)targets it. */
  private syncHistory(): void {
    if (!this.isConnected || !this.hass || !this.config) return;
    this.history ??= new StreamHistorySource(this.hass.connection, () => this.requestUpdate());
    this.history.update(
      this.config.meters.map((m) => m.entity),
      this.config.hours,
    );
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has('hass') || changed.size > 1) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    const hass = this.hass;
    if (!old || !hass || !this.config) return true;
    if (old.themes !== hass.themes || old.locale !== hass.locale) return true;
    if (old.entities !== hass.entities) return true;
    return this.config.meters.some((m) => old.states[m.entity] !== hass.states[m.entity]);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!changed.has('hass')) return;
    const old = changed.get('hass') as HomeAssistant | undefined;
    if (old && old.themes !== this.hass?.themes) this.palette = undefined;
    if (!this.history) this.syncHistory();
  }

  private format(value: number, precision: number): string {
    const lang = this.hass?.locale?.language;
    const key = `${lang ?? ''}|${precision}`;
    let f = this.formats.get(key);
    if (!f) {
      f = new Intl.NumberFormat(lang, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
      this.formats.set(key, f);
    }
    return f.format(value);
  }

  private clickable(m: ResolvedMeter): boolean {
    return !this.preview && m.tapAction.action !== 'none';
  }

  private act(ev: Event, m: ResolvedMeter): void {
    if (!this.clickable(m)) return;
    runTapAction(ev.currentTarget as HTMLElement, m.tapAction, m.entity);
  }

  private onKey(ev: KeyboardEvent, m: ResolvedMeter): void {
    if ((ev.key !== 'Enter' && ev.key !== ' ') || ev.repeat) return;
    ev.preventDefault();
    this.act(ev, m);
  }

  protected render(): TemplateResult | typeof nothing {
    const cfg = this.config;
    if (!cfg || !this.hass) return nothing;
    // getComputedStyle is empty while disconnected, so only cache a palette resolved when connected.
    const palette = this.palette ?? resolvePalette(this, cfg.colors);
    if (this.isConnected) this.palette = palette;
    const now = Date.now();
    return html`
      <ha-card .header=${cfg.title}>
        <div class="rows">${cfg.meters.map((m, i) => this.renderRow(cfg, m, i, palette, now))}</div>
      </ha-card>
    `;
  }

  private renderRow(
    cfg: ResolvedCard,
    m: ResolvedMeter,
    index: number,
    palette: Palette,
    now: number,
  ): TemplateResult {
    const st = this.hass!.states[m.entity];
    const value = parseState(st?.state);
    const shown = this.shownValue(m.entity, value, now);
    const name = m.name ?? st?.attributes.friendly_name ?? m.entity;
    const unit = m.unit ?? st?.attributes.unit_of_measurement ?? '';
    const precision = clampPrecision(
      m.precision ?? this.hass!.entities?.[m.entity]?.display_precision,
    );
    const clickable = this.clickable(m);

    return html`
      <div
        class="row"
        role=${clickable ? 'button' : nothing}
        tabindex=${clickable ? '0' : nothing}
        @click=${(ev: Event) => this.act(ev, m)}
        @keydown=${(ev: KeyboardEvent) => this.onKey(ev, m)}
      >
        <div class="head">
          <span class="name" title=${name}>${name}</span>
          <span class="spark">
            ${
              m.display.includes('sparkline')
                ? this.renderSpark(cfg, m, value, palette, now, index)
                : nothing
            }
          </span>
          <span class="value"
            >${shown === null ? '—' : this.format(shown, precision)}${
              value !== null && unit ? html`<span class="unit">${unit}</span>` : nothing
            }</span
          >
        </div>
        ${m.display.includes('bar') ? this.renderBar(cfg, m, value, palette) : nothing}
      </div>
    `;
  }

  private renderSpark(
    cfg: ResolvedCard,
    m: ResolvedMeter,
    value: number | null,
    palette: Palette,
    now: number,
    index: number,
  ) {
    const buckets = bucketize(this.history?.store.get(m.entity) ?? [], {
      start: now - cfg.hours * HOUR_MS,
      end: now,
      count: BUCKETS,
      twoSided: m.twoSided,
    });
    // The live state always drives the end point, including a gap when it is not numeric.
    buckets[buckets.length - 1] = value;
    return renderSparkline(
      buckets,
      bucketColors(buckets, m, palette, cfg.blend),
      sparklineRange(buckets, m, cfg.scale),
      m.twoSided,
      String(index),
    );
  }

  private renderBar(
    cfg: ResolvedCard,
    m: ResolvedMeter,
    value: number | null,
    palette: Palette,
  ): TemplateResult {
    const zero = m.twoSided ? barGeometry(0, m.min, m.max).zero : null;
    let fill: TemplateResult | typeof nothing = nothing;
    if (value !== null) {
      const g = barGeometry(value, m.min, m.max);
      const color = levelColor(value, m, palette, cfg.blend);
      fill = html`<div
        class="fill"
        style="left: ${g.left}%; width: ${g.width}%; background: ${color}"
      ></div>`;
    }
    return html`
      <div class="track">
        ${fill}${zero !== null ? html`<div class="zero" style="left: ${zero}%"></div>` : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    /* One grid for the whole panel: every row shares the name, sparkline and value
       columns, so sparklines and values line up across meters. */
    .rows {
      display: grid;
      grid-template-columns: var(--cpm-name-width, 8em) minmax(0, 1fr) auto;
      column-gap: 12px;
      padding: 8px 0;
    }
    .row {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
      align-items: center;
      padding: 6px 16px;
      outline: none;
    }
    .row[role='button'] {
      cursor: pointer;
    }
    .row[role='button']:hover {
      background: var(--secondary-background-color);
    }
    .row[role='button']:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .head {
      display: contents;
    }
    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--primary-text-color);
    }
    .spark {
      min-width: 0;
      height: 24px;
      color: var(--secondary-text-color);
    }
    .spark svg {
      display: block;
      width: 100%;
      height: 24px;
      overflow: visible;
    }
    .spark path.line {
      stroke-width: var(--cpm-line-width, 2px);
    }
    .value {
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      text-align: right;
    }
    .unit {
      margin-left: 0.25em;
    }
    .track {
      grid-column: 1 / -1;
      position: relative;
      height: 6px;
      margin-top: 6px;
      border-radius: 3px;
      background: var(--divider-color, rgba(127, 127, 127, 0.2));
    }
    .fill {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 3px;
      transition:
        width 500ms cubic-bezier(0.33, 1, 0.68, 1),
        left 500ms cubic-bezier(0.33, 1, 0.68, 1);
    }
    .zero {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 1px;
      margin-left: -0.5px;
      background: var(--secondary-text-color);
    }
    @media (prefers-reduced-motion: reduce) {
      .fill {
        transition: none;
      }
    }
  `;
}
