import { css, html, LitElement, nothing, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { CardConfig, MeterConfig } from './config';
import {
  addMeter,
  bandStops,
  configEqual,
  COLOR_LABELS,
  COLOR_LEVELS,
  formDiff,
  LABELS,
  meterErrors,
  meterFormData,
  meterHelper,
  meterPatch,
  meterSchema,
  entitySelector,
  usedEntities,
  meterTitle,
  moveMeter,
  PANEL_DEFAULTS,
  PANEL_SCHEMA,
  panelFormData,
  panelPatch,
  patchCard,
  patchColor,
  patchMeter,
  pendingTapAction,
  rekeyMeters,
  removeMeter,
  resolveMeterAt,
  type ColorLevel,
  type FormData,
  type FormSchema,
} from './editor-model';
import type { HomeAssistant } from './types/ha';

const ICON_UP = 'M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z';
const ICON_DOWN = 'M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z';
const ICON_DELETE =
  'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z';

const addSchema = (c: CardConfig): FormSchema[] => [
  { name: 'entity', selector: entitySelector(usedEntities(c)) },
];

type ValueChanged = CustomEvent<{ value: FormData }>;

const label = (s: FormSchema) => LABELS[s.name] ?? s.name;

interface CardHelpers {
  createCardElement(config: Record<string, unknown>): HTMLElement | Promise<HTMLElement>;
}
type CardClass = { getConfigElement?: () => unknown };

const editorElementsReady = () =>
  customElements.get('ha-form') !== undefined &&
  customElements.get('ha-expansion-panel') !== undefined;

/**
 * loadHaEditorElements makes HA load ha-form, ha-expansion-panel and the selectors, which
 * are lazy-loaded and may be missing when a custom card's editor opens first. Creating a
 * built-in card's editor pulls them in. It never throws, so it is safe outside HA.
 */
export async function loadHaEditorElements(): Promise<boolean> {
  if (editorElementsReady()) return false;
  try {
    const w = window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> };
    const helpers = await w.loadCardHelpers?.();
    if (!helpers) return false;
    const card = await helpers.createCardElement({ type: 'entities', entities: [] });
    const cls = (customElements.get('hui-entities-card') ?? card.constructor) as CardClass;
    await cls.getConfigElement?.();
    return true;
  } catch {
    return false;
  }
}

/** ConstantPowermeterCardEditor is the visual editor; all config logic lives in editor-model. */
export class ConstantPowermeterCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    pending: { state: true },
  };

  declare hass?: HomeAssistant;
  declare config?: CardConfig;
  /** Navigate or url choices per meter key whose path is still empty (not in the config). */
  declare pending: Record<number, string>;

  private loadStarted = false;
  /** One stable key per meter, so panels and pending choices follow their meter. */
  private keys: number[] = [];
  private nextKey = 0;

  constructor() {
    super();
    this.pending = {};
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.loadStarted) return;
    this.loadStarted = true;
    void loadHaEditorElements().then((loaded) => {
      if (loaded) this.requestUpdate();
    });
  }

  /** setConfig is called by HA with the current card config; a missing meters list is []. */
  setConfig(config: CardConfig): void {
    this.apply({ ...config, meters: Array.isArray(config.meters) ? config.meters : [] });
  }

  /** apply stores a new config and carries each meter's key (and pending choice) along. */
  private apply(next: CardConfig): void {
    const { keys, nextKey } = rekeyMeters(
      this.config?.meters ?? [],
      this.keys,
      next.meters,
      this.nextKey,
    );
    this.keys = keys;
    this.nextKey = nextKey;
    const live = new Set(keys);
    const pending = Object.fromEntries(
      Object.entries(this.pending).filter(([k]) => live.has(Number(k))),
    );
    if (Object.keys(pending).length !== Object.keys(this.pending).length) this.pending = pending;
    this.config = next;
  }

  private commit(next: CardConfig): void {
    if (this.config && configEqual(next, this.config)) return;
    this.apply(next);
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private attrs(entity: string | undefined) {
    return (entity && this.hass?.states[entity]?.attributes) || {};
  }

  private onPanelChanged(c: CardConfig, e: ValueChanged): void {
    e.stopPropagation();
    const diff = formDiff(panelFormData(c), e.detail.value);
    this.commit(patchCard(c, panelPatch(diff)));
  }

  private onColorChanged(c: CardConfig, level: ColorLevel, e: ValueChanged): void {
    e.stopPropagation();
    const value = e.detail.value[level];
    this.commit(patchColor(c, level, typeof value === 'string' ? value.trim() : undefined));
  }

  private onMeterChanged(c: CardConfig, i: number, e: ValueChanged): void {
    e.stopPropagation();
    const raw = c.meters[i];
    const current: MeterConfig = typeof raw === 'string' ? { entity: raw } : raw;
    const key = this.keys[i];
    const held = this.pending[key];
    const diff = formDiff(meterFormData(raw, held), e.detail.value);
    if (Object.keys(diff).length === 0) return;
    const pending = pendingTapAction(e.detail.value);
    if (pending !== held) {
      const next = { ...this.pending };
      if (pending) next[key] = pending;
      else delete next[key];
      this.pending = next;
    }
    this.commit(patchMeter(c, i, meterPatch(diff, current, held)));
  }

  private onAdd(c: CardConfig, e: ValueChanged): void {
    e.stopPropagation();
    const entity = e.detail.value.entity;
    if (typeof entity === 'string' && entity !== '') this.commit(addMeter(c, entity));
  }

  private onButton(e: Event, action: () => CardConfig): void {
    e.stopPropagation();
    this.commit(action());
  }

  /** Keeps clicks and Enter/Space on the header buttons from toggling the expansion panel. */
  private stop(e: Event): void {
    e.stopPropagation();
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    return html`
      <div class="section">
        <h3>Panel</h3>
        <ha-form
          class="panel"
          .hass=${this.hass}
          .data=${panelFormData(c)}
          .schema=${PANEL_SCHEMA}
          .computeLabel=${label}
          .computeHelper=${(s: FormSchema) =>
            s.name === 'hours' ? `Default: ${PANEL_DEFAULTS.hours}` : undefined}
          @value-changed=${(e: ValueChanged) => this.onPanelChanged(c, e)}
        ></ha-form>
        ${COLOR_LEVELS.map((level) => this.renderColor(c, level))}
      </div>
      <div class="section">
        <h3>Meters</h3>
        ${repeat(
          c.meters,
          (_, i) => this.keys[i],
          (_, i) => this.renderMeter(c, i),
        )}
        <ha-form
          class="add"
          .hass=${this.hass}
          .data=${{}}
          .schema=${addSchema(c)}
          .computeLabel=${() => 'Add meter'}
          @value-changed=${(e: ValueChanged) => this.onAdd(c, e)}
        ></ha-form>
      </div>
    `;
  }

  private renderColor(c: CardConfig, level: ColorLevel): TemplateResult {
    const value = c.colors?.[level];
    const fallback = PANEL_DEFAULTS.colors[level];
    return html`
      <div class="color-row">
        <span class="swatch swatch-${level}" style="background: ${value || fallback}"></span>
        <ha-form
          class="color-${level}"
          .hass=${this.hass}
          .data=${value === undefined ? {} : { [level]: value }}
          .schema=${[{ name: level, selector: { text: {} } }]}
          .computeLabel=${() => COLOR_LABELS[level]}
          .computeHelper=${() => `Default: ${fallback}`}
          @value-changed=${(e: ValueChanged) => this.onColorChanged(c, level, e)}
        ></ha-form>
      </div>
    `;
  }

  private renderMeter(c: CardConfig, i: number): TemplateResult {
    const raw = c.meters[i];
    const obj: MeterConfig = typeof raw === 'string' ? { entity: raw } : raw;
    const attrs = this.attrs(obj.entity);
    const resolved = resolveMeterAt(c, i);
    const data = meterFormData(raw, this.pending[this.keys[i]]);
    const last = c.meters.length - 1;
    return html`
      <ha-expansion-panel outlined data-index=${i} .header=${meterTitle(raw, attrs)}>
        <div slot="icons" class="buttons" @click=${this.stop} @keydown=${this.stop}>
          <ha-icon-button
            class="up"
            .label=${'Move up'}
            .path=${ICON_UP}
            ?disabled=${i === 0}
            @click=${(e: Event) => this.onButton(e, () => moveMeter(c, i, -1))}
          ></ha-icon-button>
          <ha-icon-button
            class="down"
            .label=${'Move down'}
            .path=${ICON_DOWN}
            ?disabled=${i === last}
            @click=${(e: Event) => this.onButton(e, () => moveMeter(c, i, 1))}
          ></ha-icon-button>
          <ha-icon-button
            class="delete"
            .label=${'Remove meter'}
            .path=${ICON_DELETE}
            ?disabled=${last === 0}
            @click=${(e: Event) => this.onButton(e, () => removeMeter(c, i))}
          ></ha-icon-button>
        </div>
        <ha-form
          class="meter"
          .hass=${this.hass}
          .data=${data}
          .schema=${meterSchema(String(data.tap_action), usedEntities(c, i))}
          .error=${resolved ? meterErrors(resolved, obj) : {}}
          .computeLabel=${label}
          .computeHelper=${(s: FormSchema) => meterHelper(s.name, obj, resolved, attrs)}
          @value-changed=${(e: ValueChanged) => this.onMeterChanged(c, i, e)}
        ></ha-form>
        ${resolved ? this.renderBands(c, resolved) : nothing}
      </ha-expansion-panel>
    `;
  }

  private renderBands(c: CardConfig, m: Parameters<typeof bandStops>[0]): TemplateResult {
    const stops = bandStops(m);
    const color = (l: ColorLevel) => c.colors?.[l] || PANEL_DEFAULTS.colors[l];
    const bands = COLOR_LEVELS.map((l) => `${color(l)} ${stops[l][0]}% ${stops[l][1]}%`).join(', ');
    return html`<div
      class="bands"
      role="img"
      aria-label="Threshold preview"
      style="background: linear-gradient(to right, ${bands})"
    ></div>`;
  }

  static styles = css`
    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    h3 {
      margin: 0;
      font-size: 1em;
      font-weight: 500;
    }
    .color-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-row ha-form {
      flex: 1;
    }
    .swatch {
      width: 24px;
      height: 24px;
      flex: none;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
    }
    .buttons {
      display: flex;
    }
    ha-expansion-panel ha-form {
      display: block;
      padding-top: 8px;
    }
    .bands {
      height: 8px;
      margin: 12px 0 8px;
      border-radius: 4px;
    }
  `;
}
