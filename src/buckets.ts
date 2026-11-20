import type { Sample } from './types/sample';

export interface BucketOptions {
  start: number;
  end: number;
  count: number;
  twoSided: boolean;
}

/**
 * Downsamples time-sorted samples into `count` equal buckets over [start, end).
 * Each bucket holds the peak of the value carried in (last sample with
 * t <= bucket start) and every sample with bucket start < t < bucket end.
 * A bucket is null only when it has no non-null candidate.
 */
export function bucketize(samples: Sample[], o: BucketOptions): (number | null)[] {
  const out: (number | null)[] = new Array(o.count);
  const w = (o.end - o.start) / o.count;
  const better = (a: number, b: number): boolean =>
    o.twoSided ? Math.abs(b) > Math.abs(a) : b > a;

  let i = 0;
  let carried: number | null = null;
  for (let b = 0; b < o.count; b++) {
    const bStart = o.start + b * w;
    const bEnd = b === o.count - 1 ? o.end : o.start + (b + 1) * w;
    while (i < samples.length && samples[i].t <= bStart) carried = samples[i++].v;
    let peak = carried;
    while (i < samples.length && samples[i].t < bEnd) {
      const v = samples[i].v;
      if (v !== null && (peak === null || better(peak, v))) peak = v;
      carried = v;
      i++;
    }
    out[b] = peak;
  }
  return out;
}
