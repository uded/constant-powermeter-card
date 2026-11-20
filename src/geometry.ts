import type { ResolvedMeter } from './config';

/** BarGeometry describes a bar fill in percent of the track (0..100). */
export interface BarGeometry {
  left: number;
  width: number;
  /** Position of the zero marker, or null for one-sided meters. */
  zero: number | null;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** barGeometry computes the fill position; meters with min < 0 grow from zero. */
export function barGeometry(value: number, min: number, max: number): BarGeometry {
  const span = max - min;
  const pct = (v: number): number => ((clamp(v, min, max) - min) * 100) / span;
  if (min >= 0) {
    return { left: 0, width: pct(value), zero: null };
  }
  const zero = pct(0);
  const at = pct(value);
  return { left: Math.min(at, zero), width: Math.abs(at - zero), zero };
}

/** sparklineRange picks the value range mapped to the sparkline height. */
export function sparklineRange(
  buckets: (number | null)[],
  m: Pick<ResolvedMeter, 'min' | 'max' | 'twoSided'>,
  scale: 'fixed' | 'auto',
): { lo: number; hi: number } {
  if (scale === 'fixed') {
    return { lo: m.min, hi: m.max };
  }
  const values = buckets.filter((b): b is number => b !== null);
  if (values.length === 0) {
    return { lo: m.min, hi: m.max };
  }
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  const pad = hi === lo ? 1 : (hi - lo) * 0.05;
  lo -= pad;
  hi += pad;
  if (m.twoSided) {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }
  return { lo, hi };
}

const fmt = (n: number): string => String(Math.round(n * 100) / 100);

/** sparklinePaths builds one line and one closed area path per contiguous run of data. */
export function sparklinePaths(
  buckets: (number | null)[],
  r: { lo: number; hi: number },
  size: { w: number; h: number },
): { lines: string[]; areas: string[] } {
  const span = r.hi - r.lo || 1;
  const x = (i: number): number => (buckets.length > 1 ? (i * size.w) / (buckets.length - 1) : 0);
  const y = (v: number): number => size.h - ((clamp(v, r.lo, r.hi) - r.lo) / span) * size.h;
  const base = y(clamp(0, r.lo, r.hi));

  const lines: string[] = [];
  const areas: string[] = [];
  let run: { x: number; y: number }[] = [];
  const flush = (): void => {
    if (run.length > 0) {
      const line = run.map((p, k) => `${k === 0 ? 'M' : 'L'}${fmt(p.x)} ${fmt(p.y)}`).join(' ');
      const first = run[0];
      const last = run[run.length - 1];
      lines.push(line);
      areas.push(`${line} L${fmt(last.x)} ${fmt(base)} L${fmt(first.x)} ${fmt(base)} Z`);
    }
    run = [];
  };
  buckets.forEach((b, i) => {
    if (b === null) {
      flush();
    } else {
      run.push({ x: x(i), y: y(b) });
    }
  });
  flush();
  return { lines, areas };
}
