import { describe, expect, it } from 'vitest';
import { ConfigError, normalizeConfig } from '../src/config';

describe('normalizeConfig', () => {
  it('rejects missing or empty meters', () => {
    expect(() => normalizeConfig({ type: 'x' })).toThrow(ConfigError);
    expect(() => normalizeConfig({ type: 'x', meters: [] })).toThrow(ConfigError);
  });

  it('applies card defaults', () => {
    const c = normalizeConfig({ type: 'x', meters: ['sensor.a'] });
    expect(c.display).toEqual(['sparkline', 'bar']);
    expect(c.hours).toBe(1);
    expect(c.scale).toBe('fixed');
    expect(c.blend).toBe(true);
    expect(c.colors).toEqual({
      normal: 'var(--success-color)',
      warning: 'var(--warning-color)',
      critical: 'var(--error-color)',
    });
  });

  it('expands a bare entity id with derived thresholds', () => {
    const m = normalizeConfig({ type: 'x', meters: ['sensor.a'] }).meters[0];
    expect(m).toMatchObject({
      entity: 'sensor.a',
      min: 0,
      max: 5000,
      normal: 1000,
      warning: 3000,
      critical: 5000,
      twoSided: false,
      tapAction: { action: 'more-info' },
      errors: [],
    });
  });

  it('derives two-sided thresholds from max(|min|, max)', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.g', min: -8000, max: 4000 }],
    }).meters[0];
    expect(m.twoSided).toBe(true);
    expect([m.normal, m.warning, m.critical]).toEqual([1600, 4800, 8000]);
  });

  it('sorts unordered thresholds and records an error', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.a', normal: 3000, warning: 1000, critical: 4000 }],
    }).meters[0];
    expect([m.normal, m.warning, m.critical]).toEqual([1000, 3000, 4000]);
    expect(m.errors).toContain('thresholds_order');
  });

  it('clamps derived thresholds below an explicit critical instead of sorting past it', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.a', min: 0, max: 5000, critical: 2500 }],
    }).meters[0];
    expect([m.normal, m.warning, m.critical]).toEqual([1000, 2500, 2500]);
    expect(m.errors).toEqual([]);
  });

  it('raises derived thresholds above an explicit normal set past the derived warning', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.a', min: 0, max: 5000, normal: 4000 }],
    }).meters[0];
    expect([m.normal, m.warning, m.critical]).toEqual([4000, 4000, 5000]);
    expect(m.errors).toEqual([]);
  });

  it('clamps a derived warning between explicit normal and critical', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.a', min: 0, max: 5000, normal: 100, critical: 500 }],
    }).meters[0];
    expect([m.normal, m.warning, m.critical]).toEqual([100, 500, 500]);
    expect(m.errors).toEqual([]);
  });

  it('clamps derived values on two-sided meters against the absolute explicit value', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.g', min: -8000, max: 4000, critical: 3000 }],
    }).meters[0];
    expect([m.normal, m.warning, m.critical]).toEqual([1600, 3000, 3000]);
    expect(m.errors).toEqual([]);
  });

  it('still errors and sorts when explicit thresholds conflict with each other', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.a', min: 0, max: 5000, normal: 3000, critical: 2000 }],
    }).meters[0];
    expect(m.errors).toEqual(['thresholds_order']);
    expect([m.normal, m.warning, m.critical]).toEqual([2000, 2000, 3000]);
  });

  it('rejects negative thresholds on two-sided meters', () => {
    const m = normalizeConfig({
      type: 'x',
      meters: [{ entity: 'sensor.g', min: -100, normal: -5 }],
    }).meters[0];
    expect(m.errors).toContain('thresholds_negative');
    expect(m.normal).toBe(5);
  });

  it('guards max <= min', () => {
    const m = normalizeConfig({ type: 'x', meters: [{ entity: 'sensor.a', min: 10, max: 10 }] })
      .meters[0];
    expect(m.errors).toContain('range');
    expect(m.max).toBe(11);
  });

  it('clamps hours and filters unknown display values', () => {
    const c = normalizeConfig({
      type: 'x',
      hours: 100,
      display: ['bar', 'radial'],
      meters: ['sensor.a'],
    });
    expect(c.hours).toBe(24);
    expect(c.display).toEqual(['bar']);
    expect(
      normalizeConfig({ type: 'x', display: ['radial'], meters: ['sensor.a'] }).display,
    ).toEqual(['sparkline', 'bar']);
  });

  it('meter display overrides panel display', () => {
    const c = normalizeConfig({
      type: 'x',
      display: ['sparkline'],
      meters: [{ entity: 'sensor.a', display: ['bar'] }, 'sensor.b'],
    });
    expect(c.meters.map((m) => m.display)).toEqual([['bar'], ['sparkline']]);
  });

  it('has no chart by default and keeps rows', () => {
    const c = normalizeConfig({ type: 'x', meters: ['sensor.a'] });
    expect(c).toMatchObject({ timeChart: undefined, donut: false, rows: true, warnings: [] });
    expect(c.total).toBeUndefined();
  });

  it('accepts one chart or a list', () => {
    expect(normalizeConfig({ type: 'x', chart: 'donut', meters: ['a'] })).toMatchObject({
      donut: true,
      timeChart: undefined,
    });
    expect(
      normalizeConfig({ type: 'x', chart: ['stacked', 'donut'], meters: ['a'] }),
    ).toMatchObject({ timeChart: 'stacked', donut: true });
  });

  it('keeps the first time chart and warns on stacked + lines', () => {
    const c = normalizeConfig({ type: 'x', chart: ['lines', 'stacked'], meters: ['a'] });
    expect(c.timeChart).toBe('lines');
    expect(c.warnings).toContain('chart_conflict');
  });

  it('drops unknown chart values and forces rows on without a chart', () => {
    expect(normalizeConfig({ type: 'x', chart: ['radial'], meters: ['a'] })).toMatchObject({
      timeChart: undefined,
      donut: false,
    });
    expect(normalizeConfig({ type: 'x', rows: false, meters: ['a'] }).rows).toBe(true);
    expect(normalizeConfig({ type: 'x', chart: 'donut', rows: false, meters: ['a'] }).rows).toBe(
      false,
    );
  });

  it('passes total and meter color through', () => {
    const c = normalizeConfig({
      type: 'x',
      total: 'sensor.t',
      meters: [
        { entity: 'a', color: '#123456' },
        { entity: 'b', color: '' },
      ],
    });
    expect(c.total).toBe('sensor.t');
    expect(c.meters[0].color).toBe('#123456');
    expect(c.meters[1].color).toBeUndefined();
  });
});
