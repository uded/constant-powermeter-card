import { describe, expect, it } from 'vitest';
import { barGeometry, sparklinePaths, sparklineRange } from '../src/geometry';

describe('barGeometry', () => {
  it('one-sided bar starts at 0%', () => {
    expect(barGeometry(2500, 0, 5000)).toEqual({ left: 0, width: 50, zero: null });
    expect(barGeometry(9999, 0, 5000).width).toBe(100);
  });
  it('two-sided bar grows from zero', () => {
    expect(barGeometry(-1000, -3000, 7000)).toEqual({ left: 20, width: 10, zero: 30 });
    expect(barGeometry(2000, -3000, 7000)).toEqual({ left: 30, width: 20, zero: 30 });
  });
});

describe('sparklineRange', () => {
  it('fixed range uses min..max; auto includes zero for two-sided and pads flat data', () => {
    expect(sparklineRange([1, 2], { min: 0, max: 10, twoSided: false }, 'fixed')).toEqual({
      lo: 0,
      hi: 10,
    });
    expect(
      sparklineRange([5, 8], { min: -10, max: 10, twoSided: true }, 'auto').lo,
    ).toBeLessThanOrEqual(0);
    const flat = sparklineRange([4, 4], { min: 0, max: 10, twoSided: false }, 'auto');
    expect(flat.hi).toBeGreaterThan(flat.lo);
  });
});

describe('sparklinePaths', () => {
  it('splits paths at gaps', () => {
    const p = sparklinePaths([1, 2, null, 3, 4], { lo: 0, hi: 4 }, { w: 60, h: 24 });
    expect(p.lines).toHaveLength(2);
    expect(p.areas).toHaveLength(2);
  });
});
