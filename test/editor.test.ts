import { afterEach, describe, expect, it } from 'vitest';
import '../src/index';
import type { CardConfig } from '../src/config';
import { ConstantPowermeterCardEditor } from '../src/editor';
import type { HomeAssistant } from '../src/types/ha';
import { mockConnection } from './mocks';

type Form = HTMLElement & {
  data: Record<string, unknown>;
  schema: { name: string }[];
  error?: Record<string, string>;
  computeLabel: (s: { name: string }) => string;
  computeHelper: (s: { name: string }) => string | undefined;
};

const hass: HomeAssistant = {
  states: {
    'sensor.a': {
      entity_id: 'sensor.a',
      state: '10',
      last_updated: '2026-11-20T00:00:00Z',
      attributes: { friendly_name: 'Kitchen', unit_of_measurement: 'W' },
    },
  },
  themes: { darkMode: false },
  connection: mockConnection(),
};

async function mount(config: CardConfig) {
  const el = document.createElement(
    'constant-powermeter-card-editor',
  ) as ConstantPowermeterCardEditor;
  el.hass = hass;
  el.setConfig(config);
  document.body.append(el);
  await el.updateComplete;
  const events: CustomEvent<{ config: CardConfig }>[] = [];
  el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));
  return { el, events };
}

function q<T extends Element = Form>(el: HTMLElement, sel: string): T {
  const found = el.shadowRoot!.querySelector<T>(sel);
  if (!found) throw new Error(`missing ${sel}`);
  return found;
}

function change(form: Form, value: Record<string, unknown>) {
  form.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
}

const base: CardConfig = { type: 'custom:constant-powermeter-card', meters: ['sensor.a'] };

afterEach(() => document.body.replaceChildren());

describe('ConstantPowermeterCardEditor', () => {
  it('is registered by src/index.ts', () => {
    expect(customElements.get('constant-powermeter-card-editor')).toBe(
      ConstantPowermeterCardEditor,
    );
  });

  it('emits config-changed with the patched config', async () => {
    const { el, events } = await mount(base);
    const form = q(el, 'ha-form.meter');
    change(form, { ...form.data, max: 3000 });
    expect(events).toHaveLength(1);
    expect(events[0].bubbles).toBe(true);
    expect(events[0].composed).toBe(true);
    expect(events[0].detail.config).toEqual({
      ...base,
      meters: [{ entity: 'sensor.a', max: 3000 }],
    });
  });

  it('deletes a cleared field and keeps derived thresholds implicit', async () => {
    const { el, events } = await mount({ ...base, meters: [{ entity: 'sensor.a', max: 3000 }] });
    const form = q(el, 'ha-form.meter');
    expect(form.data).not.toHaveProperty('normal');
    change(form, { ...form.data, max: undefined });
    expect(events[0].detail.config.meters[0]).toEqual({ entity: 'sensor.a' });
  });

  it('wires labels, helpers and errors into the meter form', async () => {
    const { el } = await mount({
      ...base,
      meters: [{ entity: 'sensor.a', max: 1000, normal: 800, warning: 300 }],
    });
    const form = q(el, 'ha-form.meter');
    expect(form.computeLabel({ name: 'normal' })).toBe('Normal');
    expect(form.computeHelper({ name: 'critical' })).toBe('Default: 1000');
    expect(form.computeHelper({ name: 'name' })).toBe('Default: Kitchen');
    expect(form.error).toEqual({ warning: 'Normal ≤ Warning ≤ Critical' });
  });

  it('shows the path field once Navigate is picked', async () => {
    const { el, events } = await mount(base);
    const form = q(el, 'ha-form.meter');
    change(form, { ...form.data, tap_action: 'navigate' });
    expect(events).toHaveLength(0);
    await el.updateComplete;
    const next = q(el, 'ha-form.meter');
    expect(next.data.tap_action).toBe('navigate');
    expect(next.schema.map((s) => s.name)).toContain('navigation_path');

    change(next, { ...next.data, navigation_path: '/energy' });
    expect(events[0].detail.config.meters[0]).toEqual({
      entity: 'sensor.a',
      tap_action: { action: 'navigate', navigation_path: '/energy' },
    });
  });

  it('does not emit when nothing changes', async () => {
    const { el, events } = await mount(base);
    const form = q(el, 'ha-form.meter');
    change(form, { ...form.data, name: '' });
    change(q(el, 'ha-form.color-normal'), { normal: '' });
    expect(events).toHaveLength(0);
  });

  it.each([
    ['an empty meters list', { type: 'custom:constant-powermeter-card', meters: [] }],
    ['a missing meters key', { type: 'custom:constant-powermeter-card' }],
  ])('starts from %s', async (_, config) => {
    const { el, events } = await mount(config as CardConfig);
    expect(config).not.toHaveProperty('meters.0');
    change(q(el, 'ha-form.add'), { entity: 'sensor.b' });
    expect(events[0].detail.config).toEqual({
      type: 'custom:constant-powermeter-card',
      meters: [{ entity: 'sensor.b' }],
    });
  });

  it('keeps button keydown and click from reaching the expansion panel', async () => {
    const { el } = await mount({ ...base, meters: ['sensor.a', 'sensor.b'] });
    const panel = q<HTMLElement>(el, '[data-index="0"]');
    const seen: string[] = [];
    panel.addEventListener('keydown', () => seen.push('keydown'));
    panel.addEventListener('click', () => seen.push('click'));
    const down = q<HTMLElement>(el, '[data-index="0"] .down');
    down.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }),
    );
    down.click();
    expect(seen).toEqual([]);
  });

  it('paints the band preview strip from the thresholds', async () => {
    const { el } = await mount({
      ...base,
      meters: [{ entity: 'sensor.a', max: 1000, normal: 200, warning: 600 }],
    });
    const style = q<HTMLElement>(el, '.bands').getAttribute('style')!;
    expect(style).toContain('var(--success-color) 0% 20%');
    expect(style).toContain('var(--warning-color) 20% 60%');
    expect(style).toContain('var(--error-color) 60% 100%');
  });

  it('patches panel options without writing untouched defaults', async () => {
    const { el, events } = await mount(base);
    const form = q(el, 'ha-form.panel');
    change(form, { ...form.data, hours: 6 });
    expect(events[0].detail.config).toEqual({ ...base, hours: 6 });
  });

  it('writes and clears a panel color', async () => {
    const { el, events } = await mount(base);
    change(q(el, 'ha-form.color-critical'), { critical: '#ff0000' });
    expect(events[0].detail.config).toEqual({ ...base, colors: { critical: '#ff0000' } });
    await el.updateComplete;
    expect(q<HTMLElement>(el, '.swatch-critical').getAttribute('style')).toContain('#ff0000');
    change(q(el, 'ha-form.color-critical'), { critical: '' });
    expect(events[1].detail.config).toEqual(base);
  });

  it('adds, moves and removes meters', async () => {
    const { el, events } = await mount(base);
    change(q(el, 'ha-form.add'), { entity: 'sensor.b' });
    expect(events[0].detail.config.meters).toEqual(['sensor.a', { entity: 'sensor.b' }]);
    await el.updateComplete;

    q<HTMLElement>(el, '[data-index="1"] .up').click();
    expect(events[1].detail.config.meters).toEqual([{ entity: 'sensor.b' }, 'sensor.a']);
    await el.updateComplete;

    q<HTMLElement>(el, '[data-index="0"] .delete').click();
    expect(events[2].detail.config.meters).toEqual(['sensor.a']);
  });

  it('does not offer to delete the only meter', async () => {
    const { el } = await mount(base);
    expect(q<HTMLElement>(el, '[data-index="0"] .delete').hasAttribute('disabled')).toBe(true);
  });
});
