import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import { bucketColors, ConstantPowermeterCard } from '../src/card';
import type { HassEntity, HomeAssistant } from '../src/types/ha';
import { mockConnection, type MockConnection } from './mocks';

function entity(id: string, state: string, attributes: HassEntity['attributes'] = {}): HassEntity {
  return { entity_id: id, state, last_updated: '2026-11-20T00:00:00Z', attributes };
}

function makeHass(
  states: Record<string, HassEntity>,
  conn: MockConnection = mockConnection(),
): HomeAssistant {
  return {
    states,
    entities: {},
    themes: { darkMode: false },
    locale: { language: 'en' },
    connection: conn,
  };
}

const kitchen = entity('sensor.a', '1240', { friendly_name: 'Kitchen', unit_of_measurement: 'W' });

async function mount(config: Record<string, unknown>, hass: HomeAssistant) {
  const el = document.createElement('constant-powermeter-card') as ConstantPowermeterCard;
  el.setConfig({ type: 'custom:constant-powermeter-card', ...config });
  el.hass = hass;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

function rows(el: HTMLElement): HTMLElement[] {
  return [...el.shadowRoot!.querySelectorAll<HTMLElement>('.row')];
}

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('ConstantPowermeterCard', () => {
  it('registers the element and the card picker entry', () => {
    expect(customElements.get('constant-powermeter-card')).toBe(ConstantPowermeterCard);
    const cards = (window as unknown as { customCards: { type: string; preview: boolean }[] })
      .customCards;
    expect(cards.find((c) => c.type === 'constant-powermeter-card')?.preview).toBe(true);
  });

  it('renders one row per meter with value and unit', async () => {
    const hass = makeHass({
      'sensor.a': kitchen,
      'sensor.b': entity('sensor.b', '12.345', { friendly_name: 'Office' }),
    });
    const el = await mount({ meters: ['sensor.a', { entity: 'sensor.b', precision: 2 }] }, hass);
    const r = rows(el);
    expect(r).toHaveLength(2);
    expect(r[0].textContent).toContain('Kitchen');
    expect(r[0].textContent).toContain('1,240');
    expect(r[0].textContent).toContain('W');
    expect(r[1].textContent).toContain('Office');
    expect(r[1].querySelector('.value')!.textContent!.trim()).toBe('12.35');
  });

  it('uses display_precision from the entity registry and clamps precision', async () => {
    const hass = makeHass({ 'sensor.a': entity('sensor.a', '1.23456') });
    hass.entities = { 'sensor.a': { display_precision: 3 } };
    const el = await mount({ meters: ['sensor.a', { entity: 'sensor.a', precision: 99 }] }, hass);
    const [reg, clamped] = rows(el).map((r) => r.querySelector('.value')!.textContent!.trim());
    expect(reg).toBe('1.235');
    expect(clamped).toBe('1.2345600000');
  });

  it('renders the title as the card header', async () => {
    const el = await mount(
      { title: 'Power', meters: ['sensor.a'] },
      makeHass({ 'sensor.a': kitchen }),
    );
    const card = el.shadowRoot!.querySelector('ha-card') as HTMLElement & { header?: string };
    expect(card.header).toBe('Power');
  });

  it('renders only the configured display parts', async () => {
    const hass = makeHass({ 'sensor.a': kitchen });
    const bar = await mount({ display: ['bar'], meters: ['sensor.a'] }, hass);
    expect(bar.shadowRoot!.querySelector('svg')).toBeNull();
    expect(bar.shadowRoot!.querySelector('.track')).not.toBeNull();
    bar.remove();

    const spark = await mount({ display: ['sparkline'], meters: ['sensor.a'] }, hass);
    expect(spark.shadowRoot!.querySelector('svg')).not.toBeNull();
    expect(spark.shadowRoot!.querySelector('.track')).toBeNull();
  });

  it('positions the bar fill and marks zero on two-sided meters', async () => {
    const hass = makeHass({ 'sensor.a': entity('sensor.a', '-1000') });
    const el = await mount({ meters: [{ entity: 'sensor.a', min: -2000, max: 2000 }] }, hass);
    const style = el.shadowRoot!.querySelector('.fill')!.getAttribute('style')!;
    expect(style).toContain('left: 25%');
    expect(style).toContain('width: 25%');
    expect(el.shadowRoot!.querySelector('.track .zero')).not.toBeNull();
  });

  it('shows — and hides the bar fill for unavailable', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', 'unavailable', { unit_of_measurement: 'W' }),
    });
    const el = await mount({ meters: ['sensor.a'] }, hass);
    const row = rows(el)[0];
    expect(row.querySelector('.value')!.textContent).toContain('—');
    expect(row.querySelector('.track')).not.toBeNull();
    expect(row.querySelector('.fill')).toBeNull();
  });

  it('renders a missing entity with its id as name and —', async () => {
    const el = await mount({ meters: ['sensor.gone'] }, makeHass({}));
    const row = rows(el)[0];
    expect(row.querySelector('.name')!.textContent!.trim()).toBe('sensor.gone');
    expect(row.querySelector('.value')!.textContent).toContain('—');
    expect(row.querySelector('.fill')).toBeNull();
  });

  it('clicking a row fires hass-more-info; preview mode does not', async () => {
    const el = await mount({ meters: ['sensor.a'] }, makeHass({ 'sensor.a': kitchen }));
    const spy = vi.fn();
    document.addEventListener('hass-more-info', spy);
    rows(el)[0].click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ entityId: 'sensor.a' });

    el.preview = true;
    await el.updateComplete;
    rows(el)[0].click();
    document.removeEventListener('hass-more-info', spy);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Enter and Space trigger the action; tap_action none removes tabindex', async () => {
    const el = await mount(
      { meters: ['sensor.a', { entity: 'sensor.a', tap_action: { action: 'none' } }] },
      makeHass({ 'sensor.a': kitchen }),
    );
    const [active, inert] = rows(el);
    expect(active.getAttribute('role')).toBe('button');
    expect(active.getAttribute('tabindex')).toBe('0');
    expect(inert.hasAttribute('role')).toBe(false);
    expect(inert.hasAttribute('tabindex')).toBe(false);

    const spy = vi.fn();
    document.addEventListener('hass-more-info', spy);
    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    active.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    inert.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    inert.click();
    document.removeEventListener('hass-more-info', spy);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('skips re-render when unrelated entities change', async () => {
    const hass = makeHass({ 'sensor.a': kitchen, 'sensor.other': entity('sensor.other', '1') });
    const el = await mount({ meters: ['sensor.a'] }, hass);
    const spy = vi.spyOn(el as unknown as { render: () => unknown }, 'render');

    el.hass = { ...hass, states: { ...hass.states, 'sensor.other': entity('sensor.other', '2') } };
    await el.updateComplete;
    expect(spy).not.toHaveBeenCalled();

    el.hass = { ...el.hass, states: { ...el.hass.states, 'sensor.a': entity('sensor.a', '5') } };
    await el.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(rows(el)[0].querySelector('.value')!.textContent).toContain('5');
  });

  it('re-resolves colors when hass.themes changes', async () => {
    const hass = makeHass({ 'sensor.a': entity('sensor.a', '10') });
    const el = document.createElement('constant-powermeter-card') as ConstantPowermeterCard;
    el.style.setProperty('--success-color', '#010203');
    el.setConfig({ type: 'custom:constant-powermeter-card', meters: ['sensor.a'] });
    el.hass = hass;
    document.body.append(el);
    await el.updateComplete;
    const fill = () => el.shadowRoot!.querySelector('.fill')!.getAttribute('style')!;
    expect(fill()).toContain('rgb(1, 2, 3)');

    el.style.setProperty('--success-color', '#040506');
    el.hass = { ...hass, states: { 'sensor.a': entity('sensor.a', '11') } };
    await el.updateComplete;
    expect(fill()).toContain('rgb(1, 2, 3)');

    el.hass = { ...el.hass, themes: { darkMode: true } };
    await el.updateComplete;
    expect(fill()).toContain('rgb(4, 5, 6)');
  });

  it('subscribes to history once and draws the sparkline from it', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const hass = makeHass({ 'sensor.a': entity('sensor.a', '300') }, conn);
    const el = await mount({ display: ['sparkline'], meters: ['sensor.a', 'sensor.a'] }, hass);
    expect(conn.calls).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(1);
    expect(conn.calls[0].msg.entity_ids).toEqual(['sensor.a']);

    conn.push({ states: { 'sensor.a': [{ s: '100', lu: (Date.now() - 1_800_000) / 1000 }] } });
    await el.updateComplete;
    const line = el.shadowRoot!.querySelector('path.line');
    expect(line).not.toBeNull();
  });

  it('resubscribes when the config changes the entity set', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const el = await mount({ meters: ['sensor.a'] }, makeHass({ 'sensor.a': kitchen }, conn));
    await vi.advanceTimersByTimeAsync(1000);
    el.setConfig({ type: 'custom:constant-powermeter-card', meters: ['sensor.a', 'sensor.b'] });
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(2);
    expect(conn.calls[1].msg.entity_ids).toEqual(['sensor.a', 'sensor.b']);
    expect(conn.calls[0].unsub).toHaveBeenCalled();
  });

  it('closes the history subscription on disconnect', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const el = await mount({ meters: ['sensor.a'] }, makeHass({ 'sensor.a': kitchen }, conn));
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(1);
    el.remove();
    expect(conn.calls[0].unsub).toHaveBeenCalledTimes(1);
  });

  it('throws on invalid config', () => {
    const el = document.createElement('constant-powermeter-card') as ConstantPowermeterCard;
    expect(() => el.setConfig({ type: 'x', meters: [] })).toThrow();
  });

  it('provides a stub config and the editor element', () => {
    const hass = makeHass({
      'light.x': entity('light.x', 'on'),
      'sensor.t': entity('sensor.t', '20', { unit_of_measurement: '°C' }),
      'sensor.p': entity('sensor.p', '5', { unit_of_measurement: 'W' }),
    });
    expect(ConstantPowermeterCard.getStubConfig(hass)).toEqual({
      type: 'custom:constant-powermeter-card',
      meters: ['sensor.p'],
    });
    expect(ConstantPowermeterCard.getConfigElement().tagName.toLowerCase()).toBe(
      'constant-powermeter-card-editor',
    );
  });

  it('reports a card size that grows with meters', async () => {
    const hass = makeHass({ 'sensor.a': kitchen });
    const one = await mount({ meters: ['sensor.a'] }, hass);
    const four = await mount(
      { title: 'T', meters: ['sensor.a', 'sensor.a', 'sensor.a', 'sensor.a'] },
      hass,
    );
    expect(four.getCardSize()).toBeGreaterThan(one.getCardSize());
  });
});

describe('bucketColors', () => {
  const meter = { normal: 10, warning: 20, critical: 30, twoSided: false };
  const palette = {
    normal: { r: 0, g: 0, b: 255 },
    warning: { r: 255, g: 128, b: 0 },
    critical: { r: 255, g: 0, b: 0 },
  };
  it('colors null buckets like the previous one, or the first non-null', () => {
    expect(bucketColors([null, 1, null, 50], meter, palette, true)).toEqual([
      'rgb(0, 0, 255)',
      'rgb(0, 0, 255)',
      'rgb(0, 0, 255)',
      'rgb(255, 0, 0)',
    ]);
  });
  it('returns no colors when every bucket is empty', () => {
    expect(bucketColors([null, null], meter, palette, true)).toEqual([]);
  });
});
