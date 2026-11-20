import { describe, expect, it } from 'vitest';
import { normalizeConfig, type CardConfig, type MeterConfig } from '../src/config';
import {
  addMeter,
  bandStops,
  configEqual,
  formDiff,
  meterErrors,
  meterFormData,
  meterHelper,
  meterPatch,
  meterSchema,
  entitySelector,
  usedEntities,
  meterTitle,
  moveMeter,
  panelFormData,
  panelPatch,
  panelSchema,
  panelWarnings,
  MESSAGES,
  patchCard,
  patchColor,
  patchMeter,
  pendingTapAction,
  rekeyMeters,
  removeMeter,
} from '../src/editor-model';
import { seriesColor } from '../src/series';

describe('rekeyMeters', () => {
  const old = ['sensor.a', { entity: 'sensor.b' }, 'sensor.c'];
  const keys = [0, 1, 2];
  it('keeps keys when nothing changes', () => {
    expect(rekeyMeters(old, keys, old, 3)).toEqual({ keys: [0, 1, 2], nextKey: 3 });
  });
  it('moves a key with its meter', () => {
    const moved = [old[1], old[0], old[2]];
    expect(rekeyMeters(old, keys, moved, 3).keys).toEqual([1, 0, 2]);
  });
  it('drops the removed meter key and gives an added meter a fresh one', () => {
    expect(rekeyMeters(old, keys, [old[0], old[2]], 3).keys).toEqual([0, 2]);
    expect(rekeyMeters(old, keys, [...old, 'sensor.d'], 3)).toEqual({
      keys: [0, 1, 2, 3],
      nextKey: 4,
    });
  });
  it('keeps the key when a meter changes entity in place', () => {
    const changed = [old[0], { entity: 'sensor.x' }, old[2]];
    expect(rekeyMeters(old, keys, changed, 3).keys).toEqual([0, 1, 2]);
  });
  it('follows a YAML reorder and handles duplicate entities', () => {
    expect(rekeyMeters(old, keys, ['sensor.c', 'sensor.a', 'sensor.b'], 3).keys).toEqual([2, 0, 1]);
    expect(rekeyMeters(['sensor.a', 'sensor.a'], [0, 1], ['sensor.a', 'sensor.a'], 2).keys).toEqual(
      [0, 1],
    );
  });
});

const resolve = (m: string | MeterConfig) => normalizeConfig({ type: 'x', meters: [m] }).meters[0];

describe('meter list', () => {
  it('patchMeter expands a bare id and deletes cleared keys', () => {
    const c = { type: 'x', meters: ['sensor.a'] };
    expect(patchMeter(c, 0, { max: 3000 }).meters[0]).toEqual({ entity: 'sensor.a', max: 3000 });
    expect(
      patchMeter({ type: 'x', meters: [{ entity: 'sensor.a', max: 3000 }] }, 0, { max: undefined })
        .meters[0],
    ).toEqual({ entity: 'sensor.a' });
    expect(
      patchMeter({ type: 'x', meters: [{ entity: 'sensor.a', name: 'A' }] }, 0, { name: '' })
        .meters[0],
    ).toEqual({ entity: 'sensor.a' });
  });

  it('patchMeter does not mutate its input and ignores bad indexes', () => {
    const meter = { entity: 'sensor.a', max: 3000 };
    const c: CardConfig = Object.freeze({ type: 'x', meters: Object.freeze([meter]) as never });
    const next = patchMeter(c, 0, { max: 4000 });
    expect(meter.max).toBe(3000);
    expect(next.meters[0]).toEqual({ entity: 'sensor.a', max: 4000 });
    expect(patchMeter(c, 5, { max: 1 })).toBe(c);
    expect(patchMeter(c, 0, { max: 3000, name: undefined })).toBe(c);
    const bare: CardConfig = { type: 'x', meters: ['sensor.a'] };
    expect(patchMeter(bare, 0, { name: '' })).toBe(bare);
  });

  it('does not write derived thresholds', () => {
    expect(addMeter({ type: 'x', meters: [] }, 'sensor.b').meters[0]).toEqual({
      entity: 'sensor.b',
    });
  });

  it('removeMeter drops the entry and ignores bad indexes', () => {
    const c = { type: 'x', meters: ['sensor.a', 'sensor.b'] };
    expect(removeMeter(c, 0).meters).toEqual(['sensor.b']);
    expect(removeMeter(c, 2)).toBe(c);
  });

  it('moveMeter swaps and ignores out-of-range moves', () => {
    const c = { type: 'x', meters: ['sensor.a', 'sensor.b'] };
    expect(moveMeter(c, 0, 1).meters).toEqual(['sensor.b', 'sensor.a']);
    expect(moveMeter(c, 1, -1).meters).toEqual(['sensor.b', 'sensor.a']);
    expect(moveMeter(c, 0, -1)).toBe(c);
    expect(moveMeter(c, 1, 1)).toBe(c);
  });
});

describe('bandStops', () => {
  it('maps thresholds to percent of min..max', () => {
    const m = resolve({ entity: 'a', max: 1000, normal: 200, warning: 600, critical: 900 });
    expect(bandStops(m)).toEqual({ normal: [0, 20], warning: [20, 60], critical: [60, 100] });
  });

  it('offsets by min and uses derived defaults', () => {
    const m = resolve({ entity: 'a', min: 1000, max: 2000 });
    expect(bandStops(m)).toEqual({ normal: [0, 20], warning: [20, 60], critical: [60, 100] });
  });

  it('uses the |value| axis for two-sided meters', () => {
    const m = resolve({ entity: 'a', min: -2000, max: 1000, normal: 500, warning: 1000 });
    expect(bandStops(m)).toEqual({ normal: [0, 25], warning: [25, 50], critical: [50, 100] });
  });

  it('clamps thresholds outside the range', () => {
    const m = resolve({ entity: 'a', max: 1000, normal: 200, warning: 1500, critical: 2000 });
    expect(bandStops(m)).toEqual({ normal: [0, 20], warning: [20, 100], critical: [100, 100] });
  });
});

describe('meterErrors', () => {
  it('is empty for a valid meter', () => {
    expect(meterErrors(resolve('sensor.a'))).toEqual({});
  });

  it('maps thresholds_order to the warning field', () => {
    const m = resolve({ entity: 'a', normal: 4000, warning: 1000 });
    expect(meterErrors(m)).toEqual({ warning: 'Normal ≤ Warning ≤ Critical' });
  });

  it('marks the explicit threshold that breaks the order when the raw config is given', () => {
    const raw = { entity: 'a', normal: 3000, critical: 2000 };
    expect(meterErrors(resolve(raw), raw)).toEqual({ critical: 'Normal ≤ Warning ≤ Critical' });
    const raw2 = { entity: 'a', normal: 4000, warning: 1000 };
    expect(meterErrors(resolve(raw2), raw2)).toEqual({ warning: 'Normal ≤ Warning ≤ Critical' });
  });

  it('reports no order error when only one explicit threshold is set', () => {
    const raw = { entity: 'a', min: 0, max: 5000, critical: 2500 };
    expect(meterErrors(resolve(raw), raw)).toEqual({});
    const raw2 = { entity: 'a', min: 0, max: 5000, normal: 4000 };
    expect(meterErrors(resolve(raw2), raw2)).toEqual({});
  });

  it('shows the clamped derived default in the helper', () => {
    const raw = { entity: 'a', min: 0, max: 5000, critical: 2500 };
    expect(meterHelper('warning', raw, resolve(raw))).toBe('Default: 2500');
    expect(meterHelper('normal', raw, resolve(raw))).toBe('Default: 1000');
  });

  it('maps thresholds_negative to each negative field', () => {
    const raw = { entity: 'a', min: -1000, max: 1000, normal: -200, critical: -900 };
    expect(meterErrors(resolve(raw), raw)).toEqual({
      normal: 'Use a positive value: two-sided thresholds apply to |value|',
      critical: 'Use a positive value: two-sided thresholds apply to |value|',
    });
  });

  it('maps range to the max field', () => {
    expect(meterErrors(resolve({ entity: 'a', min: 100, max: 50 }))).toEqual({
      max: 'Max must be above Min',
    });
  });
});

describe('formDiff', () => {
  it('returns changed keys and undefined for removed ones', () => {
    expect(formDiff({ a: 1, b: 2, c: 3 }, { a: 1, b: 5, d: 4 })).toEqual({
      b: 5,
      c: undefined,
      d: 4,
    });
  });

  it('compares arrays by value', () => {
    expect(formDiff({ d: ['bar'] }, { d: ['bar'] })).toEqual({});
  });
});

describe('meter form', () => {
  it('shows only explicit values plus display and tap action choices', () => {
    expect(meterFormData('sensor.a')).toEqual({
      entity: 'sensor.a',
      display: 'default',
      tap_action: 'more-info',
    });
    expect(
      meterFormData({
        entity: 'sensor.a',
        max: 3000,
        display: ['bar'],
        tap_action: { action: 'navigate', navigation_path: '/energy' },
      }),
    ).toEqual({
      entity: 'sensor.a',
      max: 3000,
      display: 'bar',
      tap_action: 'navigate',
      navigation_path: '/energy',
    });
    expect(meterFormData({ entity: 'a', display: ['bar', 'sparkline'] }).display).toBe('both');
  });

  it('maps display choices to arrays', () => {
    const m: MeterConfig = { entity: 'a' };
    expect(meterPatch({ display: 'both' }, m)).toEqual({ display: ['sparkline', 'bar'] });
    expect(meterPatch({ display: 'sparkline' }, m)).toEqual({ display: ['sparkline'] });
    expect(meterPatch({ display: 'default' }, m)).toEqual({ display: undefined });
  });

  it('builds tap actions', () => {
    const m: MeterConfig = { entity: 'a' };
    expect(meterPatch({ tap_action: 'none' }, m)).toEqual({ tap_action: { action: 'none' } });
    expect(meterPatch({ tap_action: 'more-info' }, m)).toEqual({ tap_action: undefined });
    expect(meterPatch({ navigation_path: '/energy' }, m, 'navigate')).toEqual({
      tap_action: { action: 'navigate', navigation_path: '/energy' },
    });
    expect(meterPatch({ tap_action: 'url', url_path: 'https://x' }, m)).toEqual({
      tap_action: { action: 'url', url_path: 'https://x' },
    });
  });

  it('never writes an empty navigate or url path', () => {
    const m: MeterConfig = { entity: 'a' };
    expect(meterPatch({ tap_action: 'navigate' }, m)).toEqual({ tap_action: undefined });
    expect(meterPatch({ tap_action: 'url', url_path: '' }, m)).toEqual({ tap_action: undefined });
    const nav: MeterConfig = {
      entity: 'a',
      tap_action: { action: 'navigate', navigation_path: '/x' },
    };
    expect(meterPatch({ navigation_path: '' }, nav)).toEqual({ tap_action: undefined });
  });

  it('pendingTapAction holds navigate or url until a path is typed', () => {
    expect(pendingTapAction({ tap_action: 'navigate' })).toBe('navigate');
    expect(pendingTapAction({ tap_action: 'url', url_path: '' })).toBe('url');
    expect(pendingTapAction({ tap_action: 'navigate', navigation_path: '/x' })).toBeUndefined();
    expect(pendingTapAction({ tap_action: 'none' })).toBeUndefined();
    expect(meterFormData('a', 'navigate').tap_action).toBe('navigate');
  });

  it('configEqual compares deeply', () => {
    const a: CardConfig = {
      type: 'x',
      colors: { normal: '#0f0' },
      meters: [{ entity: 'a', display: ['bar'] }],
    };
    expect(configEqual(a, structuredClone(a))).toBe(true);
    expect(configEqual(a, { ...a, meters: [{ entity: 'a', display: ['sparkline'] }] })).toBe(false);
    expect(configEqual(a, { ...a, hours: 2 })).toBe(false);
  });

  it('passes plain fields through and never clears the entity', () => {
    const m: MeterConfig = { entity: 'a' };
    expect(meterPatch({ max: 3000, name: '' }, m)).toEqual({ max: 3000, name: undefined });
    expect(meterPatch({ entity: undefined }, m)).toEqual({});
    expect(meterPatch({ entity: 'sensor.b' }, m)).toEqual({ entity: 'sensor.b' });
  });

  it('shows the path field only for navigate and url', () => {
    const names = (a: string) => meterSchema(a).map((s) => s.name);
    expect(names('more-info')).not.toContain('navigation_path');
    expect(names('more-info')).not.toContain('url_path');
    expect(names('navigate')).toContain('navigation_path');
    expect(names('url')).toContain('url_path');
    expect(meterSchema('more-info')[0]).toMatchObject({
      name: 'entity',
      selector: { entity: { filter: { domain: 'sensor' } } },
    });
  });

  it('hides entities already used by other meters', () => {
    const c = { type: 'x', meters: ['sensor.a', { entity: 'sensor.b' }, { entity: '' }] };
    expect(usedEntities(c)).toEqual(['sensor.a', 'sensor.b']);
    expect(usedEntities(c, 0)).toEqual(['sensor.b']);
    expect(entitySelector([])).toEqual({ entity: { filter: { domain: 'sensor' } } });
    expect(meterSchema('more-info', usedEntities(c, 0))[0].selector).toEqual({
      entity: { filter: { domain: 'sensor' }, exclude_entities: ['sensor.b'] },
    });
  });

  it('helpers show derived defaults and the two-sided note', () => {
    const raw: MeterConfig = { entity: 'a', max: 1000, warning: 700 };
    const m = resolve(raw);
    expect(meterHelper('normal', raw, m)).toBe('Default: 200');
    expect(meterHelper('warning', raw, m)).toBeUndefined();
    expect(meterHelper('critical', raw, m)).toBe('Default: 1000');
    expect(meterHelper('max', raw, m)).toBeUndefined();
    expect(meterHelper('min', raw, m)).toBe('Default: 0');

    const two: MeterConfig = { entity: 'a', min: -1000, max: 3000 };
    expect(meterHelper('min', two, resolve(two))).toBe('Two-sided: thresholds apply to |value|');
    expect(meterHelper('normal', two, resolve(two))).toBe(
      'Default: 600 · two-sided, thresholds apply to |value|',
    );
    const twoSet: MeterConfig = { ...two, warning: 2000 };
    expect(meterHelper('warning', twoSet, resolve(twoSet))).toBe(
      'Two-sided: thresholds apply to |value|',
    );
  });

  it('helpers show name and unit from entity attributes', () => {
    const raw: MeterConfig = { entity: 'a' };
    const attrs = { friendly_name: 'Kitchen', unit_of_measurement: 'W' };
    expect(meterHelper('name', raw, resolve(raw), attrs)).toBe('Default: Kitchen');
    expect(meterHelper('unit', raw, resolve(raw), attrs)).toBe('Default: W');
    expect(meterHelper('name', { ...raw, name: 'K' }, resolve(raw), attrs)).toBeUndefined();
  });

  it('shows the palette default for an empty meter color', () => {
    const raw: MeterConfig = { entity: 'a' };
    expect(meterHelper('color', raw, undefined, {}, 0)).toBe(`Default: ${seriesColor(0)}`);
    expect(meterHelper('color', raw, undefined, {}, 3)).toBe(`Default: ${seriesColor(3)}`);
    expect(meterHelper('color', { ...raw, color: '#f00' }, undefined, {}, 0)).toBeUndefined();
  });

  it('reads and writes the meter color', () => {
    expect(meterFormData({ entity: 'a', color: '#f00' })).toMatchObject({ color: '#f00' });
    expect(meterPatch({ color: '#0f0' }, { entity: 'a' })).toEqual({ color: '#0f0' });
    expect(meterPatch({ color: '' }, { entity: 'a', color: '#0f0' })).toEqual({ color: undefined });
    expect(meterSchema('more-info').map((s) => s.name)).toContain('color');
  });

  it('titles a meter by name, friendly name, then entity id', () => {
    expect(meterTitle({ entity: 'a', name: 'K' }, { friendly_name: 'F' })).toBe('K');
    expect(meterTitle('a', { friendly_name: 'F' })).toBe('F');
    expect(meterTitle('a')).toBe('a');
  });
});

describe('panel form', () => {
  it('shows defaults for choice fields', () => {
    expect(panelFormData({ type: 'x', meters: ['a'] })).toEqual({
      display: ['sparkline', 'bar'],
      hours: 1,
      sparkline_scale: 'fixed',
      blend: true,
      chart: [],
      rows: true,
    });
    expect(panelFormData({ type: 'x', chart: 'donut', total: 't', meters: ['a'] })).toMatchObject({
      chart: ['donut'],
      total: 't',
    });
  });

  it('writes and clears chart, rows and total', () => {
    expect(panelPatch({ chart: ['stacked', 'donut'] })).toEqual({ chart: ['stacked', 'donut'] });
    expect(panelPatch({ chart: [] })).toEqual({ chart: undefined });
    expect(panelPatch({ rows: true })).toEqual({ rows: undefined }); // default not written
    expect(panelPatch({ rows: false })).toEqual({ rows: false });
    expect(panelPatch({ total: '' })).toEqual({ total: undefined });
    expect(panelPatch({ total: 'sensor.t' })).toEqual({ total: 'sensor.t' });
  });

  it('the total picker hides no meter, so a meter can also be the total', () => {
    const c: CardConfig = {
      type: 'x',
      total: 'sensor.t',
      meters: ['sensor.a', { entity: 'sensor.b' }],
    };
    expect(panelSchema().find((s) => s.name === 'total')?.selector).toEqual({
      entity: { filter: { domain: 'sensor' } },
    });
    expect(panelSchema().find((s) => s.name === 'chart')?.selector).toMatchObject({
      select: { multiple: true },
    });
    expect(usedEntities(c, 0)).toEqual(['sensor.b']);
    expect(usedEntities(c)).toEqual(['sensor.a', 'sensor.b']);
  });

  it('warns on stacked + lines and on incompatible units', () => {
    expect(panelWarnings({ type: 'x', chart: ['stacked', 'lines'], meters: ['a'] })).toHaveLength(
      1,
    );
    const hass = {
      states: {
        a: { attributes: { unit_of_measurement: 'W' } },
        b: { attributes: { unit_of_measurement: 'A' } },
        k: { attributes: { unit_of_measurement: 'kW' } },
      },
    } as never;
    expect(panelWarnings({ type: 'x', chart: 'donut', meters: ['a', 'b'] }, hass)).toEqual([
      MESSAGES.units,
    ]);
    // W and kW convert; a configured unit overrides the entity's; no chart, no warning.
    expect(panelWarnings({ type: 'x', chart: 'donut', meters: ['a', 'k'] }, hass)).toEqual([]);
    const overridden: CardConfig = {
      type: 'x',
      chart: 'donut',
      meters: ['a', { entity: 'b', unit: 'W' }],
    };
    expect(panelWarnings(overridden, hass)).toEqual([]);
    expect(panelWarnings({ type: 'x', meters: ['a', 'b'] }, hass)).toEqual([]);
    // The total joins the combined chart; an entity HA does not know is skipped.
    const withTotal: CardConfig = { type: 'x', chart: 'stacked', total: 'b', meters: ['a', 'z'] };
    expect(panelWarnings(withTotal, hass)).toEqual([MESSAGES.units]);
    expect(panelWarnings({ ...withTotal, total: undefined }, hass)).toEqual([]);
    expect(panelWarnings({ type: 'x', chart: ['lines', 'stacked'], meters: [] })).toEqual([
      MESSAGES.chartConflict,
    ]);
  });

  it('panelPatch clears an empty display selection', () => {
    expect(panelPatch({ display: [] })).toEqual({ display: undefined });
    expect(panelPatch({ hours: 2, title: 'T' })).toEqual({ hours: 2, title: 'T' });
  });

  it('patchCard sets and deletes keys', () => {
    const c: CardConfig = { type: 'x', title: 'T', meters: ['a'] };
    expect(patchCard(c, { title: '', hours: 2 })).toEqual({ type: 'x', hours: 2, meters: ['a'] });
  });

  it('patchColor writes one level and drops an empty colors object', () => {
    const c: CardConfig = { type: 'x', meters: ['a'] };
    const red = patchColor(c, 'critical', '#f00');
    expect(red.colors).toEqual({ critical: '#f00' });
    expect(patchColor(red, 'critical', '')).toEqual(c);
  });
});
