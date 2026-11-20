import { describe, expect, it } from 'vitest';
import {
  donutSlices,
  linesRange,
  shares,
  stackBands,
  stackRange,
  untrackedBuckets,
} from '../src/combine';
import { UNTRACKED_KEY, type Series } from '../src/types/chart';

const s = (key: string, buckets: (number | null)[]): Series => ({
  key,
  name: key,
  color: key,
  buckets,
});

describe('combine math', () => {
  it('stacks positives up and negatives down in config order', () => {
    const bands = stackBands([s('a', [2]), s('b', [-3]), s('c', [5])]);
    expect(bands.map((b) => [b.key, b.lower[0], b.upper[0]])).toEqual([
      ['a', 0, 2],
      ['b', 0, -3],
      ['c', 2, 7],
    ]);
  });
  it('treats a missing meter as 0 and an all-missing bucket as a gap', () => {
    const bands = stackBands([s('a', [null, 1]), s('b', [null, null])]);
    expect(bands[0].upper).toEqual([null, 1]);
    expect(bands[1].lower[1]).toBe(1);
    expect(bands[1].upper[1]).toBe(1);
  });
  it('puts Untracked on top of the positive stack, clamped at 0', () => {
    const series = [s('a', [2, 9]), s('b', [-1, -1])];
    const u = untrackedBuckets([5, 4], series);
    expect(u).toEqual([3, 0]);
    const top = stackBands(series, u).at(-1)!;
    expect(top.key).toBe(UNTRACKED_KEY);
    expect([top.lower[0], top.upper[0]]).toEqual([2, 5]);
    expect(untrackedBuckets([null, 4], [s('a', [1, 1])])).toEqual([0, 3]);
  });
  it('ranges include zero with 5% padding', () => {
    expect(stackRange(stackBands([s('a', [10])]))).toEqual({ lo: 0, hi: 10.5 });
    const r = stackRange(stackBands([s('a', [10]), s('b', [-10])]));
    expect(r.lo).toBeLessThan(-10);
    expect(r.hi).toBeGreaterThan(10);
    expect(linesRange([s('a', [null, null])])).toEqual({ lo: 0, hi: 1 });
  });
  it('returns the empty range for no data or all zeros, never NaN', () => {
    expect(stackRange([])).toEqual({ lo: 0, hi: 1 });
    expect(stackRange(stackBands([s('a', [0, 0])]))).toEqual({ lo: 0, hi: 1 });
    expect(linesRange([])).toEqual({ lo: 0, hi: 1 });
  });
  it('builds donut slices from positive values only, Untracked last', () => {
    const { slices, center } = donutSlices(
      [
        { key: 'a', name: 'A', color: 'a', value: 300 },
        { key: 'b', name: 'B', color: 'b', value: 0 },
        { key: 'c', name: 'C', color: 'c', value: -50 },
        { key: 'd', name: 'D', color: 'd', value: null },
        { key: 'e', name: 'E', color: 'e', value: 100 },
      ],
      500,
    );
    expect(slices.map((x) => x.key)).toEqual(['a', 'e', UNTRACKED_KEY]);
    expect(slices.map((x) => [x.start, x.end])).toEqual([
      [0, 216],
      [216, 288],
      [288, 360],
    ]);
    expect(center).toBe(500);
  });
  it('falls back to the slice sum without a usable total, and is empty with nothing positive', () => {
    expect(donutSlices([{ key: 'a', name: 'A', color: 'a', value: 40 }], null)).toMatchObject({
      center: 40,
    });
    expect(donutSlices([{ key: 'a', name: 'A', color: 'a', value: 0 }], null)).toEqual({
      slices: [],
      center: null,
    });
    expect(donutSlices([], null)).toEqual({ slices: [], center: null });
  });
  it('computes whole-percent shares against total or the positive sum', () => {
    expect(shares([300, 100, -50, null], null)).toEqual([75, 25, null, null]);
    expect(shares([300, 100], 1000)).toEqual([30, 10]);
    expect(shares([0, 0], null)).toEqual([null, null]);
  });
});
