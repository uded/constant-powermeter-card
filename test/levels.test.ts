import { afterEach, describe, expect, it, vi } from 'vitest';
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

describe('resolvePalette with any CSS color', () => {
  afterEach(() => vi.restoreAllMocks());

  function shadowHost(): HTMLElement {
    const el = document.createElement('div');
    el.attachShadow({ mode: 'open' });
    document.body.append(el);
    return el;
  }

  /**
   * happy-dom resolves var() and inheritance in getComputedStyle but does not convert named
   * or hsl() colors to rgb() as browsers do, so that conversion is stubbed for those values.
   */
  function stubBrowserColors(map: Record<string, string>): void {
    const real = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
      const style = real(el, pseudo);
      const computed = map[style.color];
      if (computed === undefined) return style;
      return new Proxy(style, {
        get: (target, prop) =>
          prop === 'color' ? computed : (Reflect.get(target, prop) as unknown),
      });
    });
  }

  it('normalises named and hsl() colors through the probe', () => {
    stubBrowserColors({ blue: 'rgb(0, 0, 255)', 'hsl(120, 100%, 25%)': 'rgb(0, 128, 0)' });
    const host = shadowHost();
    const pal = resolvePalette(host, {
      normal: 'hsl(120, 100%, 25%)',
      warning: 'blue',
      critical: '#ff0000',
    });
    expect(pal.normal).toEqual({ r: 0, g: 128, b: 0 });
    expect(pal.warning).toEqual({ r: 0, g: 0, b: 255 });
    expect(pal.critical).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('normalises a theme variable holding a named color', () => {
    stubBrowserColors({ rebeccapurple: 'rgb(102, 51, 153)' });
    const host = shadowHost();
    host.style.setProperty('--warning-color', 'rebeccapurple');
    const pal = resolvePalette(host, {
      normal: '#000',
      warning: 'var(--warning-color)',
      critical: '#000',
    });
    expect(pal.warning).toEqual({ r: 102, g: 51, b: 153 });
  });

  it('uses the inline fallback of var() when the variable is missing', () => {
    const host = shadowHost();
    const pal = resolvePalette(host, {
      normal: 'var(--nope, #abc)',
      warning: '#000',
      critical: '#000',
    });
    expect(pal.normal).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc });
  });

  it('falls back to the level default for unparsable values', () => {
    const host = shadowHost();
    const pal = resolvePalette(host, {
      normal: 'not-a-color',
      warning: 'var(--missing)',
      critical: 'hsl(nope)',
    });
    expect(pal.normal).toEqual({ r: 0x43, g: 0xa0, b: 0x47 });
    expect(pal.warning).toEqual({ r: 0xff, g: 0xa6, b: 0x00 });
    expect(pal.critical).toEqual({ r: 0xdb, g: 0x44, b: 0x37 });
  });

  it('puts one hidden probe in the shadow root and reuses it', () => {
    const host = shadowHost();
    const colors = { normal: 'var(--a, #111)', warning: 'var(--b, #222)', critical: '#333' };
    resolvePalette(host, colors);
    resolvePalette(host, colors);
    const probes = host.shadowRoot!.querySelectorAll('span[aria-hidden="true"]');
    expect(probes).toHaveLength(1);
    expect((probes[0] as HTMLElement).style.display).toBe('none');
    expect(host.childNodes).toHaveLength(0);
  });
});
