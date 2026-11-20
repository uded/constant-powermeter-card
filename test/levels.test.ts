import { describe, expect, it } from 'vitest';
import { levelColor, parseColor, resolvePalette } from '../src/levels';

const p = {
  normal: { r: 0, g: 0, b: 255 },
  warning: { r: 255, g: 128, b: 0 },
  critical: { r: 255, g: 0, b: 0 },
};
const m = { normal: 100, warning: 200, critical: 300, twoSided: false };

describe('levels', () => {
  it('parses hex and rgb', () => {
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('#43a047')).toEqual({ r: 67, g: 160, b: 71 });
    expect(parseColor('rgb(1, 2, 3)')).toEqual({ r: 1, g: 2, b: 3 });
    expect(parseColor('rgba(1, 2, 3, 0.5)')).toEqual({ r: 1, g: 2, b: 3 });
    expect(parseColor('nonsense')).toBeNull();
  });
  it('clamps below normal and above critical', () => {
    expect(levelColor(0, m, p, true)).toBe('rgb(0, 0, 255)');
    expect(levelColor(999, m, p, true)).toBe('rgb(255, 0, 0)');
  });
  it('blends between levels', () => {
    expect(levelColor(150, m, p, true)).toBe('rgb(128, 64, 128)');
  });
  it('steps when blend is off', () => {
    expect(levelColor(150, m, p, false)).toBe('rgb(0, 0, 255)');
    expect(levelColor(250, m, p, false)).toBe('rgb(255, 128, 0)');
  });
  it('uses absolute value on two-sided meters', () => {
    expect(levelColor(-999, { ...m, twoSided: true }, p, true)).toBe('rgb(255, 0, 0)');
  });
  it('resolves theme variables and falls back', () => {
    const el = document.createElement('div');
    el.style.setProperty('--success-color', '#010203');
    document.body.append(el);
    const pal = resolvePalette(el, {
      normal: 'var(--success-color)',
      warning: 'var(--missing)',
      critical: '#ff0000',
    });
    expect(pal.normal).toEqual({ r: 1, g: 2, b: 3 });
    expect(pal.warning).toEqual({ r: 255, g: 166, b: 0 });
    expect(pal.critical).toEqual({ r: 255, g: 0, b: 0 });
  });
});
