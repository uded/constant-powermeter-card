import { describe, expect, it } from 'vitest';
import { bucketize } from '../src/buckets';

const o = { start: 0, end: 100, count: 10, twoSided: false };

describe('bucketize', () => {
  it('returns gaps before the first sample', () => {
    expect(bucketize([{ t: 50, v: 5 }], o)).toEqual([null, null, null, null, null, 5, 5, 5, 5, 5]);
  });
  it('holds the last value across empty buckets', () => {
    expect(bucketize([{ t: -10, v: 3 }], o)).toEqual(Array(10).fill(3));
  });
  it('takes the peak within a bucket, including the carried value', () => {
    expect(
      bucketize(
        [
          { t: -1, v: 9 },
          { t: 2, v: 1 },
          { t: 5, v: 4 },
        ],
        o,
      )[0],
    ).toBe(9);
    expect(
      bucketize(
        [
          { t: -1, v: 9 },
          { t: 2, v: 1 },
          { t: 5, v: 4 },
        ],
        o,
      )[1],
    ).toBe(4);
  });
  it('breaks the line while unavailable', () => {
    const b = bucketize(
      [
        { t: -1, v: 2 },
        { t: 30, v: null },
        { t: 60, v: 7 },
      ],
      o,
    );
    expect(b).toEqual([2, 2, 2, null, null, null, 7, 7, 7, 7]);
  });
  it('uses largest absolute value on two-sided meters', () => {
    expect(
      bucketize(
        [
          { t: 1, v: 3 },
          { t: 2, v: -8 },
        ],
        { ...o, twoSided: true },
      )[0],
    ).toBe(-8);
  });
});
