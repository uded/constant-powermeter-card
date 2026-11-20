import { describe, expect, it } from 'vitest';
import { FALLBACK_SERIES, seriesColor, toWatts, unitsCompatible } from '../src/series';

describe('series', () => {
  it('converts power units to watts', () => {
    expect(toWatts(1.5, 'kW')).toBe(1500);
    expect(toWatts(2, 'MW')).toBe(2_000_000);
    expect(toWatts(40, 'W')).toBe(40);
    expect(toWatts(7, 'A')).toBe(7);
    expect(toWatts(7, undefined)).toBe(7);
  });
  it('checks unit compatibility', () => {
    expect(unitsCompatible(['W', 'kW', 'MW'])).toBe(true);
    expect(unitsCompatible(['A', 'A'])).toBe(true);
    expect(unitsCompatible(['W', 'A'])).toBe(false);
    expect(unitsCompatible([undefined, 'W'])).toBe(false);
    expect(unitsCompatible([undefined, undefined])).toBe(true);
    expect(unitsCompatible([])).toBe(true);
    expect(toWatts(5, 'constructor')).toBe(5);
    expect(unitsCompatible(['constructor', 'W'])).toBe(false);
  });
  it('picks palette colors by index unless one is set', () => {
    expect(seriesColor(0)).toBe(`var(--graph-color-1, ${FALLBACK_SERIES[0]})`);
    expect(seriesColor(12)).toBe(`var(--graph-color-3, ${FALLBACK_SERIES[2]})`);
    expect(seriesColor(0, '#abcdef')).toBe('#abcdef');
    expect(FALLBACK_SERIES).toHaveLength(10);
  });
});
