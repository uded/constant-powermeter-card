import type { ResolvedCard, ResolvedMeter } from './config';

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  normal: Rgb;
  warning: Rgb;
  critical: Rgb;
}

const FALLBACK: Palette = {
  normal: { r: 0x43, g: 0xa0, b: 0x47 },
  warning: { r: 0xff, g: 0xa6, b: 0x00 },
  critical: { r: 0xdb, g: 0x44, b: 0x37 },
};

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB =
  /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i;
const VAR = /^var\(\s*(--[^,\s)]+)\s*(?:,[^)]*)?\)$/;

function clampChannel(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** parseColor reads #rgb, #rrggbb, rgb() and rgba() strings; anything else is null. */
export function parseColor(css: string): Rgb | null {
  const s = css.trim();
  const hex = HEX.exec(s);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  const rgb = RGB.exec(s);
  if (rgb) {
    return {
      r: clampChannel(Number(rgb[1])),
      g: clampChannel(Number(rgb[2])),
      b: clampChannel(Number(rgb[3])),
    };
  }
  return null;
}

function resolveOne(host: Element, css: string, fallback: Rgb): Rgb {
  let value = css.trim();
  const v = VAR.exec(value);
  if (v) value = getComputedStyle(host).getPropertyValue(v[1]).trim();
  return parseColor(value) ?? fallback;
}

/** resolvePalette resolves configured colors, including theme variables, to RGB. */
export function resolvePalette(host: Element, colors: ResolvedCard['colors']): Palette {
  return {
    normal: resolveOne(host, colors.normal, FALLBACK.normal),
    warning: resolveOne(host, colors.warning, FALLBACK.warning),
    critical: resolveOne(host, colors.critical, FALLBACK.critical),
  };
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function fraction(v: number, from: number, to: number): number {
  return to > from ? (v - from) / (to - from) : 1;
}

function toCss(c: Rgb): string {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

/** levelColor picks the color for a value, blending between levels or stepping. */
export function levelColor(
  value: number,
  m: Pick<ResolvedMeter, 'normal' | 'warning' | 'critical' | 'twoSided'>,
  p: Palette,
  blend: boolean,
): string {
  const v = m.twoSided ? Math.abs(value) : value;
  if (!blend) {
    if (v < m.warning) return toCss(p.normal);
    if (v < m.critical) return toCss(p.warning);
    return toCss(p.critical);
  }
  if (v <= m.normal) return toCss(p.normal);
  if (v >= m.critical) return toCss(p.critical);
  if (v <= m.warning) return toCss(mix(p.normal, p.warning, fraction(v, m.normal, m.warning)));
  return toCss(mix(p.warning, p.critical, fraction(v, m.warning, m.critical)));
}
