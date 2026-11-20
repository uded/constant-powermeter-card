import {
  UNTRACKED_COLOR,
  UNTRACKED_KEY,
  UNTRACKED_NAME,
  type Band,
  type Series,
  type Slice,
} from './types/chart';

const PAD = 0.05;
const EMPTY_RANGE = { lo: 0, hi: 1 };

const isNum = (v: number | null | undefined): v is number =>
  typeof v === 'number' && Number.isFinite(v);

const emptyColumn = (n: number): (number | null)[] => new Array<number | null>(n).fill(null);

/** untrackedBuckets is the part of the total no series accounts for, per bucket, clamped at 0. */
export function untrackedBuckets(total: (number | null)[], series: Series[]): number[] {
  return total.map((t, i) => {
    if (!isNum(t)) return 0;
    let positive = 0;
    for (const sr of series) {
      const v = sr.buckets[i];
      if (isNum(v) && v > 0) positive += v;
    }
    return Math.max(0, t - positive);
  });
}

/**
 * stackBands stacks series in config order: positives upward, negatives downward.
 * A missing meter counts as 0; a bucket where every series is missing is a gap.
 * Untracked, when given, sits on top of the positive stack.
 */
export function stackBands(series: Series[], untracked?: number[]): Band[] {
  const n = Math.max(0, ...series.map((x) => x.buckets.length), untracked?.length ?? 0);
  const bands: Band[] = series.map((sr) => ({
    key: sr.key,
    color: sr.color,
    lower: emptyColumn(n),
    upper: emptyColumn(n),
  }));
  const top: Band | null = untracked
    ? { key: UNTRACKED_KEY, color: UNTRACKED_COLOR, lower: emptyColumn(n), upper: emptyColumn(n) }
    : null;

  for (let i = 0; i < n; i++) {
    const u = untracked?.[i] ?? 0;
    if (series.every((sr) => !isNum(sr.buckets[i])) && !(u > 0)) continue;
    let pos = 0;
    let neg = 0;
    series.forEach((sr, k) => {
      const v = sr.buckets[i];
      const x = isNum(v) ? v : 0;
      if (x >= 0) {
        bands[k].lower[i] = pos;
        pos += x;
        bands[k].upper[i] = pos;
      } else {
        bands[k].lower[i] = neg;
        neg += x;
        bands[k].upper[i] = neg;
      }
    });
    if (top) {
      top.lower[i] = pos;
      top.upper[i] = pos + u;
    }
  }
  return top ? [...bands, top] : bands;
}

function padded(values: Iterable<number | null>): { lo: number; hi: number } {
  let lo = 0;
  let hi = 0;
  for (const v of values) {
    if (!isNum(v)) continue;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const span = hi - lo;
  if (!(span > 0)) return { ...EMPTY_RANGE };
  return { lo: lo < 0 ? lo - span * PAD : lo, hi: hi > 0 ? hi + span * PAD : hi };
}

/** stackRange is the y-range covering all bands and zero, padded 5% on the non-zero sides. */
export function stackRange(bands: Band[]): { lo: number; hi: number } {
  return padded(bands.flatMap((b) => [...b.lower, ...b.upper]));
}

/** linesRange is the y-range covering all series values and zero, padded like stackRange. */
export function linesRange(series: Series[]): { lo: number; hi: number } {
  return padded(series.flatMap((sr) => sr.buckets));
}

/** donutSlices turns positive values (plus Untracked) into angle slices and a center value. */
export function donutSlices(
  items: { key: string; name: string; color: string; value: number | null }[],
  total: number | null,
): { slices: Slice[]; center: number | null } {
  const parts: { key: string; name: string; color: string; value: number }[] = [];
  for (const it of items) {
    if (isNum(it.value) && it.value > 0) {
      parts.push({ key: it.key, name: it.name, color: it.color, value: it.value });
    }
  }
  const tracked = parts.reduce((a, p) => a + p.value, 0);
  const usable = isNum(total) ? total : null;
  if (usable !== null && usable > tracked) {
    parts.push({
      key: UNTRACKED_KEY,
      name: UNTRACKED_NAME,
      color: UNTRACKED_COLOR,
      value: usable - tracked,
    });
  }
  const sum = parts.reduce((a, p) => a + p.value, 0);
  if (!(sum > 0)) return { slices: [], center: usable };

  let angle = 0;
  const slices = parts.map((p, i) => {
    const start = angle;
    angle = i === parts.length - 1 ? 360 : angle + (p.value / sum) * 360;
    return { ...p, start, end: angle };
  });
  return { slices, center: usable ?? sum };
}

/** shares is each value as a whole percent of the total, or of the positive sum without one. */
export function shares(values: (number | null)[], total: number | null): (number | null)[] {
  const positive = values.reduce<number>((a, v) => (isNum(v) && v > 0 ? a + v : a), 0);
  const denom = isNum(total) && total > 0 ? total : positive;
  if (!(denom > 0)) return values.map(() => null);
  return values.map((v) => (isNum(v) && v >= 0 ? Math.round((v / denom) * 100) : null));
}
