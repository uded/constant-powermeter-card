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

/** Points of every sparkline line path in the card, in document order. */
function linePoints(el: HTMLElement): { x: number; y: number }[] {
  return [...el.shadowRoot!.querySelectorAll('path.line')].flatMap((p) =>
    [...p.getAttribute('d')!.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => ({
      x: Number(m[1]),
      y: Number(m[2]),
    })),
  );
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
    const cards = (
      window as unknown as {
        customCards: { type: string; preview: boolean; documentationURL?: string }[];
      }
    ).customCards;
    const entry = cards.find((c) => c.type === 'constant-powermeter-card');
    expect(entry?.preview).toBe(true);
    expect(entry?.documentationURL).toBe('https://github.com/uded/constant-powermeter-card');
  });

  it('logs a version banner that matches package.json', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.resetModules();
    await import('../src/index');
    const { version } = await import('../package.json');
    expect(info).toHaveBeenCalledWith(`constant-powermeter-card v${version}`);
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
    expect(rows(el)[0].hasAttribute('role')).toBe(false);
    expect(rows(el)[0].hasAttribute('tabindex')).toBe(false);
    rows(el)[0].click();
    rows(el)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
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
    active.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', repeat: true, bubbles: true }),
    );
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
  });

  describe('value transitions', () => {
    const FAKE = [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'Date',
      'requestAnimationFrame',
      'cancelAnimationFrame',
    ] as const;
    const shown = (el: HTMLElement) =>
      Number(
        rows(el)[0]
          .querySelector('.value')!
          .textContent!.replace(/[^\d.-]/g, ''),
      );
    const set = async (el: ConstantPowermeterCard, state: string) => {
      el.hass = { ...el.hass!, states: { 'sensor.a': entity('sensor.a', state) } };
      await el.updateComplete;
    };
    const step = async (el: ConstantPowermeterCard, ms: number) => {
      vi.advanceTimersByTime(ms);
      await el.updateComplete;
    };

    it('eases the number between two real readings and lands on the new one', async () => {
      vi.useFakeTimers({ toFake: [...FAKE] });
      const el = await mount(
        { meters: ['sensor.a'] },
        makeHass({ 'sensor.a': entity('sensor.a', '100') }),
      );
      expect(shown(el)).toBe(100);

      await set(el, '200');
      expect(shown(el)).toBe(100);
      await step(el, 250);
      expect(shown(el)).toBeGreaterThan(100);
      expect(shown(el)).toBeLessThan(200);
      await step(el, 300);
      expect(shown(el)).toBe(200);

      // Nothing keeps re-rendering once the number has arrived.
      const spy = vi.spyOn(el as unknown as { render: () => unknown }, 'render');
      await step(el, 1000);
      expect(spy).not.toHaveBeenCalled();
    });

    it('snaps immediately under prefers-reduced-motion', async () => {
      vi.useFakeTimers({ toFake: [...FAKE] });
      vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
      const el = await mount(
        { meters: ['sensor.a'] },
        makeHass({ 'sensor.a': entity('sensor.a', '100') }),
      );
      await set(el, '200');
      expect(shown(el)).toBe(200);
    });

    it('shows — at once when the sensor becomes unavailable, then snaps when it returns', async () => {
      vi.useFakeTimers({ toFake: [...FAKE] });
      const el = await mount(
        { meters: ['sensor.a'] },
        makeHass({ 'sensor.a': entity('sensor.a', '100') }),
      );
      await set(el, 'unavailable');
      expect(rows(el)[0].querySelector('.value')!.textContent).toContain('—');
      await set(el, '300');
      expect(shown(el)).toBe(300);
    });
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

    // Without history only the live value (one point at the right edge) would be drawn.
    expect(linePoints(el).every((p) => p.x === 60)).toBe(true);

    conn.push({ states: { 'sensor.a': [{ s: '100', lu: (Date.now() - 1_800_000) / 1000 }] } });
    await el.updateComplete;
    const pts = linePoints(el);
    expect(el.shadowRoot!.querySelectorAll('path.line')).toHaveLength(2); // one per meter row
    const first = pts[0];
    expect(first.x).toBeGreaterThan(29);
    expect(first.x).toBeLessThan(31);
    expect(pts.length).toBeGreaterThan(20);
  });

  it('ends the sparkline in a gap when the live state is not numeric', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const hass = makeHass({ 'sensor.a': entity('sensor.a', 'unavailable') }, conn);
    const el = await mount({ display: ['sparkline'], meters: ['sensor.a'] }, hass);
    await vi.advanceTimersByTimeAsync(1000);
    conn.push({ states: { 'sensor.a': [{ s: '100', lu: (Date.now() - 1_800_000) / 1000 }] } });
    await el.updateComplete;
    const xs = linePoints(el).map((p) => p.x);
    expect(xs.length).toBeGreaterThan(2);
    expect(Math.max(...xs)).toBeLessThan(60);
  });

  it('scrolls the sparkline window on a steady sensor with no new states', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const hass = makeHass({ 'sensor.a': entity('sensor.a', '100') }, conn);
    const el = await mount({ display: ['sparkline'], hours: 1, meters: ['sensor.a'] }, hass);
    await vi.advanceTimersByTimeAsync(1000);
    const now = Date.now();
    conn.push({
      states: {
        'sensor.a': [
          { s: '4000', lu: (now - 50 * 60_000) / 1000 },
          { s: '100', lu: (now - 49 * 60_000) / 1000 },
        ],
      },
    });
    await el.updateComplete;
    const before = linePoints(el);
    expect(before[0].x).toBeGreaterThan(9); // gap before the first sample
    expect(Math.min(...before.map((p) => p.y))).toBeLessThan(6); // the 4000 W spike

    await vi.advanceTimersByTimeAsync(30 * 60_000);
    await el.updateComplete;
    const after = linePoints(el);
    expect(after[0].x).toBe(0); // the window moved past the first sample
    expect(Math.min(...after.map((p) => p.y))).toBeGreaterThan(20); // spike scrolled out
  });

  it('stops the refresh timer on disconnect', async () => {
    vi.useFakeTimers();
    const el = await mount({ meters: ['sensor.a'] }, makeHass({ 'sensor.a': kitchen }));
    await vi.advanceTimersByTimeAsync(1000);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    const spy = vi.spyOn(el as unknown as { render: () => unknown }, 'render');
    el.remove();
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(5 * 60_000);
    expect(spy).not.toHaveBeenCalled();
  });

  it('subscribes again after being re-attached', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const el = await mount(
      { display: ['sparkline'], meters: ['sensor.a'] },
      makeHass({ 'sensor.a': kitchen }, conn),
    );
    await vi.advanceTimersByTimeAsync(1000);
    el.remove();
    expect(conn.calls[0].unsub).toHaveBeenCalledTimes(1);

    document.body.append(el);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(2);
    conn.push({ states: { 'sensor.a': [{ s: '100', lu: (Date.now() - 1_800_000) / 1000 }] } });
    await el.updateComplete;
    expect(linePoints(el).length).toBeGreaterThan(20);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });

  it('subscribes when hass arrives after the element is connected', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const el = document.createElement('constant-powermeter-card') as ConstantPowermeterCard;
    el.setConfig({ type: 'custom:constant-powermeter-card', meters: ['sensor.a'] });
    document.body.append(el);
    await el.updateComplete;
    expect(rows(el)).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(0);

    el.hass = makeHass({ 'sensor.a': kitchen }, conn);
    await el.updateComplete;
    expect(rows(el)).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(1);
    expect(conn.calls[0].msg.entity_ids).toEqual(['sensor.a']);
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
