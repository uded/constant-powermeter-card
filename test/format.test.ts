import { describe, expect, it } from 'vitest';
import { numberFormat } from '../src/format';

const fmt = (number_format: string | undefined, language = 'en') => {
  const { locales, useGrouping } = numberFormat({ language, number_format });
  return new Intl.NumberFormat(locales, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping,
  }).format(1234.5);
};

describe('numberFormat', () => {
  it('follows HA number format choices', () => {
    expect(fmt('comma_decimal', 'pl')).toBe('1,234.5');
    expect(fmt('decimal_comma')).toBe('1.234,5');
    expect(fmt('space_comma')).toMatch(/^1\s234,5$/);
    expect(fmt('quote_decimal')).toMatch(/^1.234\.5$/);
    expect(fmt('none', 'de')).toBe('1234.5');
  });
  it('uses the HA language by default and for "language"', () => {
    expect(fmt(undefined, 'de')).toBe('1.234,5');
    expect(fmt('language', 'en')).toBe('1,234.5');
  });
  it('lets the browser decide for "system"', () => {
    expect(numberFormat({ language: 'de', number_format: 'system' }).locales).toBeUndefined();
  });
});
