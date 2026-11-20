import { afterEach, describe, expect, it, vi } from 'vitest';
import { bucketize, bucketizeMean } from '../src/buckets';
import '../src/index';
import type { ConstantPowermeterCard } from '../src/card';
import type { HassEntity, HomeAssistant } from '../src/types/ha';
import { mockConnection, type MockConnection } from './mocks';

// Wrap the real resamplers so the test can count how often the card calls them.
vi.mock('../src/buckets', async (importOriginal) => {
  const orig = await importOriginal<typeof import('../src/buckets')>();
  return { ...orig, bucketize: vi.fn(orig.bucketize), bucketizeMean: vi.fn(orig.bucketizeMean) };
});

const FAKE = [
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'Date',
  'requestAnimationFrame',
  'cancelAnimationFrame',
] as const;

function entity(id: string, state: string): HassEntity {
  return { entity_id: id, state, last_updated: '2026-11-20T00:00:00Z', attributes: {} };
}

function makeHass(states: Record<string, HassEntity>, conn: MockConnection): HomeAssistant {
  return {
    states,
    entities: {},
    themes: { darkMode: false },
    locale: { language: 'en' },
    connection: conn,
  };
}

const resamples = () =>
  vi.mocked(bucketize).mock.calls.length + vi.mocked(bucketizeMean).mock.calls.length;

const topLabel = (el: HTMLElement) =>
  Number(el.shadowRoot!.querySelector('.chart .label.top')!.textContent!.replace(/[^\d.-]/g, ''));

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.mocked(bucketize).mockClear();
  vi.mocked(bucketizeMean).mockClear();
});

describe('bucket cache', () => {
  it('reuses resampled history on tween frames, and resamples on new history or a new bucket period', async () => {
    vi.useFakeTimers({ toFake: [...FAKE] });
    // 30 s into a minute, so the 60 s buckets of a 1 h window do not roll over by accident.
    vi.setSystemTime(new Date('2026-11-20T12:00:30Z'));
    const conn = mockConnection();
    const el = document.createElement('constant-powermeter-card') as ConstantPowermeterCard;
    el.setConfig({
      type: 'custom:constant-powermeter-card',
      chart: 'stacked',
      meters: ['sensor.a'],
    });
    el.hass = makeHass({ 'sensor.a': entity('sensor.a', '100') }, conn);
    document.body.append(el);
    await el.updateComplete;
    await vi.advanceTimersByTimeAsync(1000); // the debounced subscribe
    const now = Date.now();
    conn.push({ states: { 'sensor.a': [{ s: '100', lu: (now - 30 * 60_000) / 1000 }] } });
    await el.updateComplete;
    expect(vi.mocked(bucketizeMean)).toHaveBeenCalled(); // the stacked chart
    expect(vi.mocked(bucketize)).toHaveBeenCalled(); // the sparkline

    // A new reading starts a tween: frames re-render, but reuse the buckets.
    vi.mocked(bucketize).mockClear();
    vi.mocked(bucketizeMean).mockClear();
    const render = vi.spyOn(el as unknown as { render: () => unknown }, 'render');
    el.hass = { ...el.hass!, states: { 'sensor.a': entity('sensor.a', '200') } };
    await el.updateComplete;
    for (let i = 0; i < 10; i++) {
      await vi.advanceTimersByTimeAsync(16);
      await el.updateComplete;
    }
    expect(render.mock.calls.length).toBeGreaterThan(2);
    expect(resamples()).toBe(0);
    // The live last bucket still follows the current state: 200 W padded 5%.
    expect(topLabel(el)).toBe(210);

    // New history invalidates the cache.
    conn.push({ states: { 'sensor.a': [{ s: '150', lu: (Date.now() - 10 * 60_000) / 1000 }] } });
    await el.updateComplete;
    expect(vi.mocked(bucketizeMean)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(bucketize)).toHaveBeenCalledTimes(1);

    // So does a new bucket period, when the refresh timer re-renders.
    vi.mocked(bucketize).mockClear();
    vi.mocked(bucketizeMean).mockClear();
    await vi.advanceTimersByTimeAsync(61_000);
    await el.updateComplete;
    expect(vi.mocked(bucketizeMean)).toHaveBeenCalled();
    expect(vi.mocked(bucketize)).toHaveBeenCalled();
  });
});
