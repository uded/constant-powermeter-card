import { describe, expect, it } from 'vitest';
import { FALLBACK_SERIES, isPowerUnit, seriesColor, toWatts, wattFactor } from '../src/series';

describe('series', () => {
  it('converts power units to watts', () => {
    expect(toWatts(1.5, 'kW')).toBe(1500);
    expect(toWatts(2, 'MW')).toBe(2_000_000);
    expect(toWatts(40, 'W')).toBe(40);
    expect(toWatts(7, 'A')).toBe(7);
    expect(toWatts(7, undefined)).toBe(7);
    expect(toWatts(2, ' kw ')).toBe(2000);
    expect(toWatts(2, 'KW')).toBe(2000);
    expect(toWatts(5, 'w')).toBe(5);
  });
  it('treats no unit as watts and anything else as not power', () => {
    expect(wattFactor(undefined)).toBe(1);
    expect(wattFactor('')).toBe(1);
    expect(wattFactor('  ')).toBe(1);
    // mw is ambiguous (milli or mega), so only the exact MW spelling counts.
    expect(wattFactor('mw')).toBeNull();
    expect(wattFactor('mW')).toBeNull();
    for (const u of ['VA', 'kVA', 'kWh', 'Wh', 'A', '%', 'constructor']) {
      expect(isPowerUnit(u)).toBe(false);
    }
    for (const u of ['W', 'kW', 'MW', 'w', 'Kw', undefined]) expect(isPowerUnit(u)).toBe(true);
  });
  it('picks palette colors by index unless one is set', () => {
    expect(seriesColor(0)).toBe(`var(--graph-color-1, ${FALLBACK_SERIES[0]})`);
    expect(seriesColor(12)).toBe(`var(--graph-color-3, ${FALLBACK_SERIES[2]})`);
    expect(seriesColor(0, '#abcdef')).toBe('#abcdef');
    expect(FALLBACK_SERIES).toHaveLength(10);
  });
});
