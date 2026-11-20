import {
  defaultThresholds,
  normalizeConfig,
  type CardConfig,
  type DisplayMode,
  type MeterConfig,
  type ResolvedCard,
  type ResolvedMeter,
  type TapAction,
} from './config';

/** FormData is the flat object an `ha-form` edits. */
export type FormData = Record<string, unknown>;

/** FormSchema is one `ha-form` field. */
export interface FormSchema {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

export type ColorLevel = 'normal' | 'warning' | 'critical';
export type Threshold = ColorLevel;

export const COLOR_LEVELS: readonly ColorLevel[] = ['normal', 'warning', 'critical'];
const THRESHOLDS: readonly Threshold[] = COLOR_LEVELS;
const PLAIN_METER_FIELDS = [
  'entity',
  'name',
  'unit',
  'precision',
  'min',
  'max',
  'normal',
  'warning',
  'critical',
] as const;
const DEFAULT_MIN = 0;

/** Panel defaults, taken from normalizeConfig so there is one source of truth. */
export const PANEL_DEFAULTS: ResolvedCard = normalizeConfig({ type: '', meters: ['sensor.x'] });
const DEFAULT_MAX = PANEL_DEFAULTS.meters[0].max;

export const MESSAGES = {
  order: 'Normal ≤ Warning ≤ Critical',
  negative: 'Use a positive value: two-sided thresholds apply to |value|',
  range: 'Max must be above Min',
  twoSided: 'Two-sided: thresholds apply to |value|',
};

export const LABELS: Record<string, string> = {
  title: 'Title',
  display: 'Display',
  hours: 'Window (hours)',
  sparkline_scale: 'Sparkline scale',
  blend: 'Blend between levels',
  entity: 'Entity',
  name: 'Name',
  unit: 'Unit',
  precision: 'Precision',
  min: 'Min',
  max: 'Max',
  normal: 'Normal',
  warning: 'Warning',
  critical: 'Critical',
  tap_action: 'Tap action',
  navigation_path: 'Navigation path',
  url_path: 'URL',
};

export const COLOR_LABELS: Record<ColorLevel, string> = {
  normal: 'Normal color',
  warning: 'Warning color',
  critical: 'Critical color',
};

function isEmpty(v: unknown): boolean {
  return v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
}

/** withPatch copies obj and applies patch; empty values (undefined, '', []) delete the key. */
function withPatch<T extends object>(obj: T, patch: Partial<T>): T {
  const out = { ...obj } as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch)) {
    if (isEmpty(v)) delete out[k];
    else out[k] = v;
  }
  return out as T;
}

function toMeterObject(raw: string | MeterConfig): MeterConfig {
  return typeof raw === 'string' ? { entity: raw } : { ...raw };
}

function validIndex(c: CardConfig, i: number): boolean {
  return Number.isInteger(i) && i >= 0 && i < c.meters.length;
}

/** addMeter appends a meter with only its entity set; thresholds stay derived. */
export function addMeter(c: CardConfig, entity: string): CardConfig {
  return { ...c, meters: [...c.meters, { entity }] };
}

/** removeMeter drops meter i; an out-of-range index returns c unchanged. */
export function removeMeter(c: CardConfig, i: number): CardConfig {
  if (!validIndex(c, i)) return c;
  return { ...c, meters: c.meters.filter((_, j) => j !== i) };
}

/** moveMeter swaps meter i with its neighbour in direction dir; edge moves return c. */
export function moveMeter(c: CardConfig, i: number, dir: -1 | 1): CardConfig {
  const j = i + dir;
  if (!validIndex(c, i) || !validIndex(c, j)) return c;
  const meters = [...c.meters];
  [meters[i], meters[j]] = [meters[j], meters[i]];
  return { ...c, meters };
}

/** patchMeter expands a bare id to an object and applies patch; undefined or '' deletes a key. */
export function patchMeter(c: CardConfig, i: number, patch: Partial<MeterConfig>): CardConfig {
  if (!validIndex(c, i)) return c;
  const meters = [...c.meters];
  meters[i] = withPatch(toMeterObject(c.meters[i]), patch);
  return { ...c, meters };
}

/** patchCard applies a panel-level patch; empty values delete the key. */
export function patchCard(c: CardConfig, patch: Partial<CardConfig>): CardConfig {
  return withPatch(c, patch);
}

/** patchColor sets or clears one level color and drops an empty colors object. */
export function patchColor(
  c: CardConfig,
  level: ColorLevel,
  value: string | undefined,
): CardConfig {
  const colors = withPatch(c.colors ?? {}, { [level]: value });
  return patchCard(c, { colors: Object.keys(colors).length > 0 ? colors : undefined });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * bandStops gives each level's band as [from, to] percent of the meter axis. The axis is
 * min..max, or 0..max(|min|, max) for a two-sided meter since its thresholds apply to |value|.
 */
export function bandStops(m: ResolvedMeter): {
  normal: [number, number];
  warning: [number, number];
  critical: [number, number];
} {
  const lo = m.twoSided ? 0 : m.min;
  const hi = m.twoSided ? Math.max(-m.min, m.max) : m.max;
  const pct = (v: number) => Math.min(100, Math.max(0, round2(((v - lo) * 100) / (hi - lo))));
  const a = pct(m.normal);
  const b = pct(m.warning);
  return { normal: [0, a], warning: [a, b], critical: [b, 100] };
}

/** meterErrors maps a meter's error codes to `ha-form` field messages. */
export function meterErrors(m: ResolvedMeter, raw?: MeterConfig): Record<string, string> {
  const out: Record<string, string> = {};
  if (m.errors.includes('range')) out.max = MESSAGES.range;
  if (m.errors.includes('thresholds_negative')) {
    const negative = THRESHOLDS.filter((t) => (raw?.[t] ?? 0) < 0);
    for (const t of negative.length > 0 ? negative : ['normal']) out[t] = MESSAGES.negative;
  }
  if (m.errors.includes('thresholds_order')) out.warning ??= MESSAGES.order;
  return out;
}

function sameValue(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  return a === b;
}

/** formDiff returns the keys whose value changed; a key that disappeared maps to undefined. */
export function formDiff(before: FormData, after: FormData): FormData {
  const out: FormData = {};
  for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (!sameValue(before[k], after[k])) out[k] = after[k];
  }
  return out;
}

type DisplayChoice = 'default' | 'sparkline' | 'bar' | 'both';

function displayChoice(d: DisplayMode[] | undefined): DisplayChoice {
  const s = d?.includes('sparkline') ?? false;
  const b = d?.includes('bar') ?? false;
  if (s && b) return 'both';
  if (s) return 'sparkline';
  if (b) return 'bar';
  return 'default';
}

const DISPLAY_FROM_CHOICE: Record<DisplayChoice, DisplayMode[] | undefined> = {
  default: undefined,
  sparkline: ['sparkline'],
  bar: ['bar'],
  both: ['sparkline', 'bar'],
};

/** meterFormData flattens a meter config into `ha-form` data; derived values are left out. */
export function meterFormData(raw: string | MeterConfig): FormData {
  const m = toMeterObject(raw);
  const data: FormData = {};
  for (const k of PLAIN_METER_FIELDS) if (m[k] !== undefined) data[k] = m[k];
  data.display = displayChoice(m.display);
  const tap = m.tap_action;
  data.tap_action = tap?.action ?? 'more-info';
  if (tap?.action === 'navigate') data.navigation_path = tap.navigation_path;
  if (tap?.action === 'url') data.url_path = tap.url_path;
  return data;
}

function buildTapAction(action: unknown, nav: unknown, url: unknown): TapAction | undefined {
  if (action === 'none') return { action: 'none' };
  if (action === 'navigate') return { action: 'navigate', navigation_path: String(nav ?? '') };
  if (action === 'url') return { action: 'url', url_path: String(url ?? '') };
  return undefined;
}

/** meterPatch turns a meter form diff into a MeterConfig patch for patchMeter. */
export function meterPatch(diff: FormData, current: MeterConfig): Partial<MeterConfig> {
  const patch: Record<string, unknown> = {};
  for (const k of PLAIN_METER_FIELDS) {
    if (k in diff) patch[k] = isEmpty(diff[k]) ? undefined : diff[k];
  }
  if (patch.entity === undefined) delete patch.entity;
  if ('display' in diff) patch.display = DISPLAY_FROM_CHOICE[diff.display as DisplayChoice];
  if ('tap_action' in diff || 'navigation_path' in diff || 'url_path' in diff) {
    const cur = current.tap_action;
    const pick = (k: 'navigation_path' | 'url_path') =>
      k in diff ? diff[k] : cur && k in cur ? (cur as Record<string, unknown>)[k] : undefined;
    patch.tap_action = buildTapAction(
      'tap_action' in diff ? diff.tap_action : (cur?.action ?? 'more-info'),
      pick('navigation_path'),
      pick('url_path'),
    );
  }
  return patch as Partial<MeterConfig>;
}

const step = { step: 'any', mode: 'box' };

/** meterSchema is the meter form; the path field appears only for navigate and url. */
export function meterSchema(action: string): FormSchema[] {
  const schema: FormSchema[] = [
    { name: 'entity', required: true, selector: { entity: { domain: 'sensor' } } },
    { name: 'name', selector: { text: {} } },
    { name: 'unit', selector: { text: {} } },
    { name: 'precision', selector: { number: { min: 0, max: 10, step: 1, mode: 'box' } } },
    { name: 'min', selector: { number: step } },
    { name: 'max', selector: { number: step } },
    { name: 'normal', selector: { number: step } },
    { name: 'warning', selector: { number: step } },
    { name: 'critical', selector: { number: step } },
    {
      name: 'display',
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'default', label: 'Panel default' },
            { value: 'sparkline', label: 'Sparkline' },
            { value: 'bar', label: 'Bar' },
            { value: 'both', label: 'Both' },
          ],
        },
      },
    },
    {
      name: 'tap_action',
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'more-info', label: 'More info' },
            { value: 'navigate', label: 'Navigate' },
            { value: 'url', label: 'URL' },
            { value: 'none', label: 'None' },
          ],
        },
      },
    },
  ];
  if (action === 'navigate') schema.push({ name: 'navigation_path', selector: { text: {} } });
  if (action === 'url') schema.push({ name: 'url_path', selector: { text: { type: 'url' } } });
  return schema;
}

function fmt(n: number): string {
  return String(round2(n));
}

export interface EntityAttributes {
  friendly_name?: string;
  unit_of_measurement?: string;
}

/** meterHelper is the helper text for one meter field, or undefined for none. */
export function meterHelper(
  field: string,
  raw: MeterConfig,
  m: ResolvedMeter | undefined,
  attrs: EntityAttributes = {},
): string | undefined {
  const value = raw[field as keyof MeterConfig];
  if (field === 'min' && m?.twoSided) return MESSAGES.twoSided;
  if (value !== undefined && value !== '') return undefined;
  if ((THRESHOLDS as readonly string[]).includes(field) && m) {
    return `Default: ${fmt(defaultThresholds(m.min, m.max)[field as Threshold])}`;
  }
  if (field === 'min') return `Default: ${DEFAULT_MIN}`;
  if (field === 'max') return `Default: ${DEFAULT_MAX}`;
  if (field === 'name' && attrs.friendly_name) return `Default: ${attrs.friendly_name}`;
  if (field === 'unit' && attrs.unit_of_measurement) {
    return `Default: ${attrs.unit_of_measurement}`;
  }
  return undefined;
}

/** meterTitle is the expansion panel header: name, then friendly name, then entity id. */
export function meterTitle(raw: string | MeterConfig, attrs: EntityAttributes = {}): string {
  const m = toMeterObject(raw);
  return m.name || attrs.friendly_name || m.entity;
}

/** resolveMeterAt resolves meter i against the panel options, or undefined when it is unusable. */
export function resolveMeterAt(c: CardConfig, i: number): ResolvedMeter | undefined {
  try {
    return normalizeConfig({ ...c, meters: [c.meters[i]] }).meters[0];
  } catch {
    return undefined;
  }
}

/** PANEL_SCHEMA is the panel form (colors have their own forms with swatches). */
export const PANEL_SCHEMA: FormSchema[] = [
  { name: 'title', selector: { text: {} } },
  {
    name: 'display',
    selector: {
      select: {
        multiple: true,
        mode: 'list',
        options: [
          { value: 'sparkline', label: 'Sparkline' },
          { value: 'bar', label: 'Bar' },
        ],
      },
    },
  },
  { name: 'hours', selector: { number: { min: 0.25, max: 24, step: 0.25, mode: 'box' } } },
  {
    name: 'sparkline_scale',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'fixed', label: 'Fixed (min to max)' },
          { value: 'auto', label: 'Auto (data range)' },
        ],
      },
    },
  },
  { name: 'blend', selector: { boolean: {} } },
];

/** panelFormData is the panel form data; choice fields show their defaults. */
export function panelFormData(c: CardConfig): FormData {
  const data: FormData = {};
  if (c.title !== undefined) data.title = c.title;
  data.display = c.display ?? [...PANEL_DEFAULTS.display];
  data.hours = c.hours ?? PANEL_DEFAULTS.hours;
  data.sparkline_scale = c.sparkline_scale ?? PANEL_DEFAULTS.scale;
  data.blend = c.blend ?? PANEL_DEFAULTS.blend;
  return data;
}

/** panelPatch turns a panel form diff into a CardConfig patch for patchCard. */
export function panelPatch(diff: FormData): Partial<CardConfig> {
  const patch: FormData = {};
  for (const k of PANEL_SCHEMA.map((s) => s.name)) {
    if (k in diff) patch[k] = isEmpty(diff[k]) ? undefined : diff[k];
  }
  return patch as Partial<CardConfig>;
}
