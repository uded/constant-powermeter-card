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
  it('keeps card CSS from hiding the sparkline line', async () => {
    const el = await mount({ meters: ['sensor.a'] }, makeHass({ 'sensor.a': kitchen }));
    const line = el.shadowRoot!.querySelector('path.line')!;
    expect(line).not.toBeNull();
    expect(['none', 'contents']).not.toContain(getComputedStyle(line).display);
  });

  it("formats values with HA's number format setting", async () => {
    const hass = makeHass({ 'sensor.a': kitchen });
    const el = await mount(
      { meters: ['sensor.a'] },
      { ...hass, locale: { language: 'en', number_format: 'decimal_comma' } },
    );
    expect(rows(el)[0].querySelector('.value')!.textContent).toContain('1.240');
  });

  it('sizes itself for sections dashboards', () => {
    const el = document.createElement('constant-powermeter-card') as ConstantPowermeterCard;
    expect(el.getGridOptions()).toEqual({ columns: 12, rows: 'auto', min_columns: 6 });
  });

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

    it('stops re-rendering when a new config arrives mid-transition', async () => {
      vi.useFakeTimers({ toFake: [...FAKE] });
      const el = await mount(
        { chart: 'donut', meters: ['sensor.a'] },
        makeHass({ 'sensor.a': entity('sensor.a', '100') }),
      );
      await set(el, '200');
      // Mid-transition, the editor swaps the meter, so sensor.a is no longer shown.
      el.setConfig({ type: 'custom:constant-powermeter-card', meters: ['sensor.b'] });
      await el.updateComplete;
      await step(el, 50); // the frame already scheduled before the change may still run once
      const spy = vi.spyOn(el as unknown as { render: () => unknown }, 'render');
      await step(el, 2000);
      expect(spy).not.toHaveBeenCalled();
    });

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

describe('combined charts', () => {
  /** The top-left range label as a number. */
  const topLabel = (el: HTMLElement) =>
    Number(el.shadowRoot!.querySelector('.chart .label.top')!.textContent!.replace(/[^\d.-]/g, ''));

  it('renders exactly as before without a chart', async () => {
    const el = await mount({ meters: ['sensor.a'] }, makeHass({ 'sensor.a': kitchen }));
    expect(el.shadowRoot!.querySelector('.chart')).toBeNull();
    expect(el.shadowRoot!.querySelector('.row .swatch')).toBeNull();
    expect(el.shadowRoot!.querySelector('.share')).toBeNull();
    expect(rows(el)[0].querySelector('.value')!.textContent).not.toContain('%');
  });

  it('ignores total without a chart', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const hass = makeHass({ 'sensor.a': kitchen, 'sensor.t': entity('sensor.t', '5000') }, conn);
    const el = await mount({ total: 'sensor.t', meters: ['sensor.a'] }, hass);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls[0].msg.entity_ids).toEqual(['sensor.a']);
    expect(el.shadowRoot!.querySelector('.chart')).toBeNull();
    expect(el.shadowRoot!.querySelector('.share')).toBeNull();
  });

  it('shows the chart, swatches and shares with chart set', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '300'),
      'sensor.b': entity('sensor.b', '100'),
    });
    const el = await mount({ chart: ['stacked', 'donut'], meters: ['sensor.a', 'sensor.b'] }, hass);
    expect(el.shadowRoot!.querySelector('.chart .stacked')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.chart .donut')).not.toBeNull();
    expect(rows(el).map((r) => r.querySelector('.share')!.textContent)).toEqual(['75%', '25%']);
    expect(rows(el)[0].querySelector('.swatch')).not.toBeNull();
    expect(rows(el)[0].querySelector('.swatch')!.getAttribute('style')).toContain(
      'var(--graph-color-1',
    );
  });

  it('draws the live value at the right edge of the time chart before history arrives', async () => {
    const el = await mount(
      { chart: 'stacked', meters: ['sensor.a'] },
      makeHass({ 'sensor.a': entity('sensor.a', '300') }),
    );
    const edge = el.shadowRoot!.querySelector('.stacked path.edge')!;
    const xs = [...edge.getAttribute('d')!.matchAll(/[ML](-?[\d.]+) /g)].map((m) => Number(m[1]));
    expect(xs.length).toBeGreaterThan(0);
    expect(xs.every((x) => x === 60)).toBe(true);
  });

  it('renders a lines chart without a donut', async () => {
    const el = await mount(
      { chart: 'lines', meters: ['sensor.a'] },
      makeHass({ 'sensor.a': entity('sensor.a', '300') }),
    );
    expect(el.shadowRoot!.querySelector('.chart .lines path.series')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.chart .stacked')).toBeNull();
    expect(el.shadowRoot!.querySelector('.chart .donut')).toBeNull();
    expect(el.shadowRoot!.querySelector('.chart .label.bottom')!.textContent!.trim()).toBe('1 h');
  });

  it('shows no scale label when no series has any reading', async () => {
    for (const chart of ['stacked', 'lines']) {
      const el = await mount(
        { chart, total: 'sensor.t', meters: ['sensor.a'] },
        makeHass({
          'sensor.a': entity('sensor.a', 'unavailable'),
          'sensor.t': entity('sensor.t', 'unknown'),
        }),
      );
      expect(el.shadowRoot!.querySelector('.chart .label.top')).toBeNull();
      expect(el.shadowRoot!.querySelector('.chart .label.bottom')).not.toBeNull();
    }
  });

  it('labels a sub-hour window in minutes', async () => {
    const el = await mount(
      { chart: 'stacked', hours: 0.5, meters: ['sensor.a'] },
      makeHass({ 'sensor.a': entity('sensor.a', '300') }),
    );
    expect(el.shadowRoot!.querySelector('.chart .label.bottom')!.textContent!.trim()).toBe(
      '30 min',
    );
  });

  it('converts units before computing Untracked and shares', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '500', { unit_of_measurement: 'W' }),
      'sensor.t': entity('sensor.t', '2', { unit_of_measurement: 'kW' }),
    });
    const el = await mount({ chart: 'donut', total: 'sensor.t', meters: ['sensor.a'] }, hass);
    expect(rows(el)[0].querySelector('.share')!.textContent).toBe('25%');
    expect(el.shadowRoot!.querySelectorAll('.donut .slice').length).toBe(2); // a + Untracked
    expect(el.shadowRoot!.querySelector('.donut .center')!.textContent!.trim()).toBe('2,000 W');
  });

  it('keeps non-power meters as plain rows, out of the chart and the shares', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '600', { unit_of_measurement: 'W' }),
      'sensor.b': entity('sensor.b', '0.4', { unit_of_measurement: 'kw' }),
      'sensor.e': entity('sensor.e', '12', { unit_of_measurement: 'kWh' }),
      'sensor.s': entity('sensor.s', '80', { unit_of_measurement: '%' }),
    });
    const el = await mount(
      { chart: 'donut', meters: ['sensor.a', 'sensor.b', 'sensor.e', 'sensor.s'] },
      hass,
    );
    expect(el.shadowRoot!.querySelectorAll('.donut .slice')).toHaveLength(2);
    expect(el.shadowRoot!.querySelector('.donut .center')!.textContent!.trim()).toBe('1,000 W');
    const [a, b, e, s] = rows(el);
    expect(a.querySelector('.share')!.textContent).toBe('60%');
    expect(b.querySelector('.share')!.textContent).toBe('40%');
    for (const row of [e, s]) {
      expect(row.querySelector('.swatch')).toBeNull();
      expect(row.querySelector('.share')).toBeNull();
    }
    expect(e.querySelector('.value')!.textContent).toContain('12');
    expect(e.querySelector('.unit')!.textContent).toBe('kWh');
  });

  it('ignores a total that does not report power', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '500', { unit_of_measurement: 'W' }),
      'sensor.t': entity('sensor.t', '30', { unit_of_measurement: 'kWh' }),
    });
    const el = await mount({ chart: 'stacked', total: 'sensor.t', meters: ['sensor.a'] }, hass);
    expect(el.shadowRoot!.querySelectorAll('.stacked path.edge')).toHaveLength(1); // no Untracked
    expect(rows(el)[0].querySelector('.share')!.textContent).toBe('100%');
  });

  it('shows an empty ring and — when no meter has a positive value', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '0', { unit_of_measurement: 'W' }),
      'sensor.t': entity('sensor.t', '0', { unit_of_measurement: 'W' }),
    });
    const el = await mount({ chart: 'donut', total: 'sensor.t', meters: ['sensor.a'] }, hass);
    expect(el.shadowRoot!.querySelectorAll('.donut .slice')).toHaveLength(0);
    expect(el.shadowRoot!.querySelector('.donut .empty-ring')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.donut .center')!.textContent!.trim()).toBe('—');
  });

  it('subscribes to the total entity too', async () => {
    vi.useFakeTimers();
    const conn = mockConnection();
    const hass = makeHass(
      { 'sensor.a': entity('sensor.a', '300'), 'sensor.t': entity('sensor.t', '1000') },
      conn,
    );
    await mount({ chart: 'stacked', total: 'sensor.t', meters: ['sensor.a'] }, hass);
    await vi.advanceTimersByTimeAsync(1000);
    expect(conn.calls).toHaveLength(1);
    expect(conn.calls[0].msg.entity_ids).toContain('sensor.t');
    expect(conn.calls[0].msg.entity_ids).toContain('sensor.a');
  });

  it('re-renders when only the total entity changes', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '500'),
      'sensor.t': entity('sensor.t', '1000'),
    });
    const el = await mount({ chart: 'donut', total: 'sensor.t', meters: ['sensor.a'] }, hass);
    expect(rows(el)[0].querySelector('.share')!.textContent).toBe('50%');
    el.hass = { ...hass, states: { ...hass.states, 'sensor.t': entity('sensor.t', '2000') } };
    await el.updateComplete;
    expect(rows(el)[0].querySelector('.share')!.textContent).toBe('25%');
  });

  it('adds an Untracked layer to the stack when total is set', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '500'),
      'sensor.t': entity('sensor.t', '1000'),
    });
    const el = await mount({ chart: 'stacked', total: 'sensor.t', meters: ['sensor.a'] }, hass);
    const edges = [...el.shadowRoot!.querySelectorAll('.stacked path.edge')];
    expect(edges).toHaveLength(2);
    expect(edges[1].getAttribute('style')).toContain('var(--disabled-color');
  });

  describe('tooltips', () => {
    const hass = (a = '500') =>
      makeHass({
        'sensor.a': entity('sensor.a', a, { friendly_name: 'Kitchen', unit_of_measurement: 'W' }),
        'sensor.t': entity('sensor.t', '2000', {
          friendly_name: 'House',
          unit_of_measurement: 'W',
        }),
      });
    const cfg = (chart: unknown) => ({ chart, total: 'sensor.t', meters: ['sensor.a'] });
    // happy-dom has no layout, so give the plot a 200 px width at x = 0.
    const hover = async (el: ConstantPowermeterCard, x: number) => {
      const svg = el.shadowRoot!.querySelector('.time svg') as SVGElement;
      svg.getBoundingClientRect = () => ({ left: 0, width: 200 }) as DOMRect;
      const time = el.shadowRoot!.querySelector('.time')!;
      time.dispatchEvent(new MouseEvent('pointermove', { clientX: x, bubbles: true }));
      await el.updateComplete;
    };
    const tipRows = (el: HTMLElement) =>
      [...el.shadowRoot!.querySelectorAll('.time .tip-row')].map((r) => [
        r.querySelector('.tip-name')!.textContent,
        r.querySelector('.tip-value')!.textContent,
      ]);

    it('shows every series at the hovered step, live at the right edge', async () => {
      const el = await mount(cfg('stacked'), hass());
      expect(el.shadowRoot!.querySelector('.time .tip')).toBeNull();
      await hover(el, 200);
      expect(el.shadowRoot!.querySelector('.time .tip-title')!.textContent).toBe('Now');
      expect(tipRows(el)).toEqual([
        ['Kitchen', '500 W'],
        ['Untracked', '1,500 W'],
        ['House', '2,000 W'],
      ]);
      expect(el.shadowRoot!.querySelector('.time .guide')!.getAttribute('style')).toContain(
        'left: 100%',
      );
    });

    it('shows a dash for a step without readings, and a clock time', async () => {
      const el = await mount(cfg('lines'), hass());
      await hover(el, 0);
      expect(el.shadowRoot!.querySelector('.time .tip-title')!.textContent).not.toBe('Now');
      expect(tipRows(el).map(([, v]) => v)).toEqual(['—', '—', '—']);
    });

    it('follows live updates at the same step, and clears on leave or new config', async () => {
      const el = await mount(cfg('stacked'), hass());
      await hover(el, 200);
      el.hass = hass('800');
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 600)); // let the value tween settle
      await el.updateComplete;
      expect(tipRows(el)[0]).toEqual(['Kitchen', '800 W']);
      el.shadowRoot!.querySelector('.time')!.dispatchEvent(new MouseEvent('pointerleave'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.time .tip')).toBeNull();
      await hover(el, 200);
      el.setConfig({ type: 'x', ...cfg('stacked') });
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.time .tip')).toBeNull();
    });

    it('shows a donut slice name, value and share', async () => {
      const el = await mount(cfg('donut'), hass());
      const slice = el.shadowRoot!.querySelector('.donut .slice[data-key="0"]')!;
      slice.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
      await el.updateComplete;
      const tip = el.shadowRoot!.querySelector('.donut .tip.slice')!;
      expect(tip.querySelector('.tip-name')!.textContent).toBe('Kitchen');
      expect(tip.querySelector('.tip-value')!.textContent).toBe('500 W');
      expect(tip.querySelector('.tip-share')!.textContent).toBe('25%');
      el.shadowRoot!.querySelector('.donut')!.dispatchEvent(new MouseEvent('pointerleave'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.donut .tip')).toBeNull();
    });

    it('shows the real slice reading while the ring is still easing', async () => {
      const el = await mount(cfg('donut'), hass());
      const over = async () => {
        el.shadowRoot!.querySelector('.donut .slice[data-key="0"]')!.dispatchEvent(
          new MouseEvent('pointerover', { bubbles: true }),
        );
        await el.updateComplete;
      };
      await over();
      el.hass = hass('800');
      await el.updateComplete;
      await over();
      // No waiting: the ring is mid-tween, the box must already show the new reading.
      const tip = el.shadowRoot!.querySelector('.donut .tip.slice')!;
      expect(tip.querySelector('.tip-value')!.textContent).toBe('800 W');
      expect(tip.querySelector('.tip-share')!.textContent).toBe('40%');
    });

    it('uses the 12 or 24 hour clock set in Home Assistant', async () => {
      const h = hass();
      const el = await mount(cfg('lines'), {
        ...h,
        locale: { ...h.locale, language: 'en', time_format: '24' },
      } as never);
      await hover(el, 0);
      expect(el.shadowRoot!.querySelector('.time .tip-title')!.textContent).not.toMatch(/AM|PM/);
    });

    describe('on touch', () => {
      const touch = (el: ConstantPowermeterCard, type: string) =>
        el
          .shadowRoot!.querySelector('.time')!
          .dispatchEvent(
            Object.assign(new MouseEvent(type, { clientX: 200 }), { pointerType: 'touch' }),
          );
      const tip = (el: HTMLElement) => el.shadowRoot!.querySelector('.time .tip');

      it('keeps the box 3 s after the finger lifts, and a new touch restarts it', async () => {
        const el = await mount(cfg('stacked'), hass());
        vi.useFakeTimers();
        await hover(el, 200);
        touch(el, 'pointerleave');
        await vi.advanceTimersByTimeAsync(2_900);
        expect(tip(el)).not.toBeNull();
        touch(el, 'pointerdown');
        await vi.advanceTimersByTimeAsync(3_000);
        expect(tip(el)).not.toBeNull();
        touch(el, 'pointerleave');
        await vi.advanceTimersByTimeAsync(3_100);
        await el.updateComplete;
        expect(tip(el)).toBeNull();
      });

      it('drops a pending timer when the card is removed', async () => {
        const el = await mount(cfg('stacked'), hass());
        vi.useFakeTimers();
        await hover(el, 200);
        touch(el, 'pointerleave');
        el.remove();
        expect(vi.getTimerCount()).toBe(0);
      });
    });

    it('lets vertical swipes scroll the page', () => {
      const css = (ConstantPowermeterCard.styles as { cssText: string }).cssText;
      expect(css).toMatch(/\.time\s*\{[^}]*touch-action:\s*pan-y/);
    });
  });

  describe('a total that is also listed as a meter', () => {
    const hass = () =>
      makeHass({
        'sensor.t': entity('sensor.t', '1000', { friendly_name: 'House' }),
        'sensor.a': entity('sensor.a', '300', { friendly_name: 'Kitchen' }),
      });
    const config = (chart: unknown, extra: Record<string, unknown> = {}) => ({
      chart,
      total: 'sensor.t',
      meters: ['sensor.t', 'sensor.a'],
      ...extra,
    });

    it('keeps its row with no swatch and no share, and leaves it out of the shares', async () => {
      const el = await mount(config('donut'), hass());
      const [house, kitchen] = rows(el);
      expect(house.querySelector('.name')!.textContent).toContain('House');
      expect(house.querySelector('.value')!.textContent).toContain('1,000');
      expect(house.querySelector('.swatch')).toBeNull();
      expect(house.querySelector('.share')).toBeNull();
      expect(kitchen.querySelector('.swatch')).not.toBeNull();
      expect(kitchen.querySelector('.share')!.textContent).toBe('30%');
    });

    it('is not stacked on the circuits, and Untracked is the real remainder', async () => {
      const el = await mount(config('stacked'), hass());
      const edges = [...el.shadowRoot!.querySelectorAll('.stacked path.edge')];
      expect(edges).toHaveLength(2); // Kitchen + Untracked
      expect(edges[1].getAttribute('style')).toContain('var(--disabled-color');
      // The top of the stack is the total (1000 W, padded 5%), not total + circuits.
      expect(topLabel(el)).toBe(1050);
    });

    it('draws no line of its own on a lines chart', async () => {
      const el = await mount(config('lines'), hass());
      const lines = [...el.shadowRoot!.querySelectorAll('.lines path.series')];
      expect(lines).toHaveLength(2); // Kitchen + Untracked
      expect(topLabel(el)).toBe(735); // max(300, 700) padded 5%
    });

    it('is not a donut slice', async () => {
      const el = await mount(config('donut'), hass());
      expect(el.shadowRoot!.querySelectorAll('.donut .slice')).toHaveLength(2); // Kitchen + Untracked
      expect(el.shadowRoot!.querySelector('.donut .center')!.textContent!.trim()).toBe('1,000 W');
    });

    it('is not in the legend', async () => {
      const el = await mount(config('donut', { rows: false }), hass());
      const items = [...el.shadowRoot!.querySelectorAll('.chart .legend .legend-item')];
      expect(items.map((i) => i.textContent!.trim())).toEqual(['Kitchen', 'Untracked']);
    });
  });

  it('hides rows and shows a legend with rows: false', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '300', { friendly_name: 'Kitchen' }),
      'sensor.b': entity('sensor.b', '100', { friendly_name: 'Office' }),
      'sensor.t': entity('sensor.t', '1000'),
    });
    const el = await mount(
      { chart: 'donut', rows: false, total: 'sensor.t', meters: ['sensor.a', 'sensor.b'] },
      hass,
    );
    expect(rows(el)).toHaveLength(0);
    const items = [...el.shadowRoot!.querySelectorAll('.chart .legend .legend-item')];
    expect(items.map((i) => i.textContent!.trim())).toEqual(['Kitchen', 'Office', 'Untracked']);
    expect(items.every((i) => i.querySelector('.swatch'))).toBe(true);
  });

  it('centres the donut when there is no time chart', async () => {
    const hass = makeHass({ 'sensor.a': entity('sensor.a', '300') });
    const alone = await mount({ chart: 'donut', meters: ['sensor.a'] }, hass);
    expect(alone.shadowRoot!.querySelector('.chart-body')!.classList).toContain('donut-only');
    const both = await mount({ chart: ['stacked', 'donut'], meters: ['sensor.a'] }, hass);
    expect(both.shadowRoot!.querySelector('.chart-body')!.classList).not.toContain('donut-only');
    const css = (ConstantPowermeterCard.styles as unknown as { cssText: string }).cssText;
    expect(css).toMatch(/\.chart-body\.donut-only\s*\{\s*justify-content:\s*center/);
  });

  it('wraps the donut below the time chart at about 360 px card width', () => {
    const css = (ConstantPowermeterCard.styles as unknown as { cssText: string }).cssText;
    // The container is the .chart content box: card width minus 2 x 16 px padding.
    expect(css).toMatch(/\.chart\s*\{[^}]*padding:\s*12px 16px 0/);
    expect(css).toContain('@container (max-width: 328px)');
  });

  it('names the chart drawings for screen readers', async () => {
    const hass = makeHass({
      'sensor.a': entity('sensor.a', '3844', { unit_of_measurement: 'W' }),
      'sensor.b': entity('sensor.b', 'unavailable'),
    });
    const aria = (el: HTMLElement, sel: string) => {
      const svg = el.shadowRoot!.querySelector(sel)!;
      return [svg.getAttribute('role'), svg.getAttribute('aria-label')];
    };
    const stacked = await mount({ chart: ['stacked', 'donut'], meters: ['sensor.a'] }, hass);
    expect(aria(stacked, '.stacked svg')).toEqual(['img', 'Stacked power, last 1 h']);
    expect(aria(stacked, '.donut svg')).toEqual(['img', 'Power split, 3,844 W']);
    const lines = await mount({ chart: 'lines', hours: 0.5, meters: ['sensor.a'] }, hass);
    expect(aria(lines, '.lines svg')).toEqual(['img', 'Power per meter, last 30 min']);
    const empty = await mount({ chart: 'donut', meters: ['sensor.b'] }, hass);
    expect(aria(empty, '.donut svg')).toEqual(['img', 'Power split, no data']);
  });

  it('shows no legend when rows are shown', async () => {
    const el = await mount(
      { chart: 'donut', meters: ['sensor.a'] },
      makeHass({ 'sensor.a': entity('sensor.a', '300') }),
    );
    expect(el.shadowRoot!.querySelector('.legend')).toBeNull();
  });

  it('uses mean buckets for stacked and peak buckets for lines', async () => {
    const spike = 4000;
    const history = async (chart: string) => {
      vi.useFakeTimers();
      const conn = mockConnection();
      const hass = makeHass({ 'sensor.a': entity('sensor.a', '100') }, conn);
      const el = await mount({ chart, hours: 1, meters: ['sensor.a'] }, hass);
      await vi.advanceTimersByTimeAsync(1000);
      const now = Date.now();
      // 100 W, then a 10 s spike in the middle of the window, then 100 W again.
      conn.push({
        states: {
          'sensor.a': [
            { s: '100', lu: (now - 50 * 60_000) / 1000 },
            { s: String(spike), lu: (now - 30 * 60_000) / 1000 },
            { s: '100', lu: (now - 30 * 60_000 + 10_000) / 1000 },
          ],
        },
      });
      await el.updateComplete;
      return el;
    };

    const stacked = await history('stacked');
    // The bucket holding the spike averages to about 750 W, far below the spike.
    expect(topLabel(stacked)).toBeLessThan(spike);
    expect(topLabel(stacked)).toBeGreaterThan(700);
    stacked.remove();
    vi.useRealTimers();

    const lines = await history('lines');
    // Peak buckets keep the spike: the range top is the spike padded by 5%.
    expect(topLabel(lines)).toBe(spike * 1.05);
    const ys = [
      ...lines
        .shadowRoot!.querySelector('.lines path.series')!
        .getAttribute('d')!
        .matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g),
    ].map((m) => Number(m[2]));
    // The highest point of the line sits at the spike value.
    expect(Math.min(...ys)).toBeCloseTo(24 * (1 - spike / (spike * 1.05)), 1);
  });

  it('keeps CSS colors out of fill and stroke attributes', async () => {
    const el = await mount(
      { chart: ['lines', 'donut'], meters: ['sensor.a'] },
      makeHass({ 'sensor.a': entity('sensor.a', '300') }),
    );
    const painted = [...el.shadowRoot!.querySelectorAll('.chart path, .chart circle')];
    expect(painted.length).toBeGreaterThan(0);
    for (const p of painted) {
      expect(p.getAttribute('stroke') ?? '').not.toContain('var(');
      expect(p.getAttribute('fill') ?? '').not.toContain('var(');
    }
  });

  it('grows the card size when a chart is shown', async () => {
    const hass = makeHass({ 'sensor.a': kitchen });
    const plain = await mount({ meters: ['sensor.a'] }, hass);
    const charted = await mount({ chart: 'stacked', meters: ['sensor.a'] }, hass);
    expect(charted.getCardSize()).toBeGreaterThan(plain.getCardSize());
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
