export type DisplayMode = 'sparkline' | 'bar';

export type TapAction =
  | { action: 'more-info' }
  | { action: 'none' }
  | { action: 'navigate'; navigation_path: string }
  | { action: 'url'; url_path: string };

export interface MeterConfig {
  entity: string;
  name?: string;
  unit?: string;
  precision?: number;
  min?: number;
  max?: number;
  normal?: number;
  warning?: number;
  critical?: number;
  display?: DisplayMode[];
  tap_action?: TapAction;
}

export interface CardConfig {
  type: string;
  title?: string;
  display?: DisplayMode[];
  hours?: number;
  sparkline_scale?: 'fixed' | 'auto';
  colors?: { normal?: string; warning?: string; critical?: string };
  blend?: boolean;
  meters: (string | MeterConfig)[];
}

export interface ResolvedMeter {
  entity: string;
  name?: string;
  unit?: string;
  precision?: number;
  min: number;
  max: number;
  normal: number;
  warning: number;
  critical: number;
  twoSided: boolean;
  display: DisplayMode[];
  tapAction: TapAction;
  errors: string[];
}

export interface ResolvedCard {
  title?: string;
  display: DisplayMode[];
  hours: number;
  scale: 'fixed' | 'auto';
  colors: { normal: string; warning: string; critical: string };
  blend: boolean;
  meters: ResolvedMeter[];
}

/** ConfigError is thrown when the card config cannot be used at all. */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

const DEFAULT_DISPLAY: DisplayMode[] = ['sparkline', 'bar'];
const DEFAULT_COLORS = {
  normal: 'var(--success-color)',
  warning: 'var(--warning-color)',
  critical: 'var(--error-color)',
};
const DEFAULT_MAX = 5000;
const MIN_HOURS = 0.25;
const MAX_HOURS = 24;

type Obj = Record<string, unknown>;

function isObject(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v !== '' ? v : undefined;
}

function parseDisplay(v: unknown, fallback: DisplayMode[]): DisplayMode[] {
  if (!Array.isArray(v)) return fallback;
  const modes = v.filter((m): m is DisplayMode => m === 'sparkline' || m === 'bar');
  return modes.length > 0 ? modes : fallback;
}

function parseTapAction(v: unknown): TapAction {
  if (isObject(v)) {
    if (v.action === 'none') return { action: 'none' };
    if (v.action === 'navigate' && str(v.navigation_path)) {
      return { action: 'navigate', navigation_path: v.navigation_path as string };
    }
    if (v.action === 'url' && str(v.url_path)) {
      return { action: 'url', url_path: v.url_path as string };
    }
  }
  return { action: 'more-info' };
}

/** defaultThresholds derives normal, warning and critical from the meter range. */
export function defaultThresholds(
  min: number,
  max: number,
): { normal: number; warning: number; critical: number } {
  if (min < 0) {
    const span = Math.max(Math.abs(min), max);
    return { normal: 0.2 * span, warning: 0.6 * span, critical: span };
  }
  const range = max - min;
  return { normal: min + 0.2 * range, warning: min + 0.6 * range, critical: max };
}

/**
 * deriveThresholds fills the thresholds the user left out. Each derived value is clamped
 * between the explicit values below and above it, so one explicit threshold never moves
 * another (critical 2500 alone keeps warning at most 2500 instead of sorting past it).
 */
function deriveThresholds(
  explicit: (number | undefined)[],
  derived: { normal: number; warning: number; critical: number },
): number[] {
  const base = [derived.normal, derived.warning, derived.critical];
  return explicit.map((t, i) => {
    if (t !== undefined) return t;
    const below = explicit.slice(0, i).filter((x): x is number => x !== undefined);
    const above = explicit.slice(i + 1).filter((x): x is number => x !== undefined);
    return Math.min(Math.max(base[i], ...below), ...above);
  });
}

function resolveMeter(raw: unknown, panelDisplay: DisplayMode[]): ResolvedMeter {
  const cfg: Obj = typeof raw === 'string' ? { entity: raw } : isObject(raw) ? raw : {};
  const entity = str(cfg.entity);
  if (!entity) throw new ConfigError('Each meter needs an entity id');

  const errors: string[] = [];
  const min = num(cfg.min) ?? 0;
  let max = num(cfg.max) ?? DEFAULT_MAX;
  if (max <= min) {
    errors.push('range');
    max = min + 1;
  }

  const twoSided = min < 0;
  let explicit = [num(cfg.normal), num(cfg.warning), num(cfg.critical)];
  if (twoSided && explicit.some((t) => t !== undefined && t < 0)) {
    errors.push('thresholds_negative');
    explicit = explicit.map((t) => (t === undefined ? t : Math.abs(t)));
  }
  const given = explicit.filter((t): t is number => t !== undefined);
  if (given.some((t, i) => i > 0 && t < given[i - 1])) errors.push('thresholds_order');

  const [normal, warning, critical] = deriveThresholds(explicit, defaultThresholds(min, max)).sort(
    (a, b) => a - b,
  );

  return {
    entity,
    name: str(cfg.name),
    unit: str(cfg.unit),
    precision: num(cfg.precision),
    min,
    max,
    normal,
    warning,
    critical,
    twoSided,
    display: parseDisplay(cfg.display, panelDisplay),
    tapAction: parseTapAction(cfg.tap_action),
    errors,
  };
}

/** normalizeConfig validates raw card YAML and fills in every default. */
export function normalizeConfig(raw: unknown): ResolvedCard {
  if (!isObject(raw)) throw new ConfigError('Invalid configuration');
  if (!Array.isArray(raw.meters) || raw.meters.length === 0) {
    throw new ConfigError('At least one meter is required');
  }

  const display = parseDisplay(raw.display, DEFAULT_DISPLAY);
  const colors = isObject(raw.colors) ? raw.colors : {};
  const hours = Math.min(MAX_HOURS, Math.max(MIN_HOURS, num(raw.hours) ?? 1));

  return {
    title: str(raw.title),
    display,
    hours,
    scale: raw.sparkline_scale === 'auto' ? 'auto' : 'fixed',
    colors: {
      normal: str(colors.normal) ?? DEFAULT_COLORS.normal,
      warning: str(colors.warning) ?? DEFAULT_COLORS.warning,
      critical: str(colors.critical) ?? DEFAULT_COLORS.critical,
    },
    blend: raw.blend !== false,
    meters: raw.meters.map((m) => resolveMeter(m, display)),
  };
}
