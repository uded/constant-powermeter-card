import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import type { CardConfig } from '../src/config';
import { ConstantPowermeterCardEditor, loadHaEditorElements } from '../src/editor';
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

  it('writes chart, rows and total from the panel form', async () => {
    const { el, events } = await mount(base);
    const form = q(el, 'ha-form.panel');
    expect(form.computeLabel({ name: 'rows' })).toBe('Show rows');
    expect(form.computeLabel({ name: 'total' })).toBe('Total meter (optional)');
    change(form, { ...form.data, chart: ['stacked'], rows: false, total: 'sensor.t' });
    expect(events[0].detail.config).toEqual({
      ...base,
      chart: ['stacked'],
      rows: false,
      total: 'sensor.t',
    });
  });

  it('shows config warnings above the panel form', async () => {
    const { el } = await mount(base);
    expect(el.shadowRoot!.querySelector('.warning')).toBeNull();
    el.setConfig({ ...base, chart: ['stacked', 'lines'] });
    await el.updateComplete;
    const alerts = el.shadowRoot!.querySelectorAll('.warning');
    expect(alerts).toHaveLength(1);
    expect(alerts[0].textContent).toContain('Stacked and Lines');
    // Outside HA there is no ha-alert, so a plain element carries the text.
    expect(alerts[0].tagName.toLowerCase()).toBe('div');
    expect(alerts[0].nextElementSibling?.matches('ha-form.panel')).toBe(true);
  });

  it('uses ha-alert for warnings when HA defines it', async () => {
    if (!customElements.get('ha-alert')) {
      customElements.define('ha-alert', class extends HTMLElement {});
    }
    const { el } = await mount({ ...base, chart: ['stacked', 'lines'] });
    const alert = q<HTMLElement>(el, '.warning');
    expect(alert.tagName.toLowerCase()).toBe('ha-alert');
    expect(alert.getAttribute('alert-type')).toBe('warning');
  });

  it('writes a meter color and shows its swatch and palette default', async () => {
    const { el, events } = await mount(base);
    const form = q(el, 'ha-form.meter');
    expect(form.computeHelper({ name: 'color' })).toBe('Default: var(--graph-color-1, #44739e)');
    expect(q<HTMLElement>(el, '.meter-swatch').getAttribute('style')).toContain(
      'var(--graph-color-1, #44739e)',
    );
    change(form, { ...form.data, color: '#123456' });
    expect(events[0].detail.config.meters[0]).toEqual({ entity: 'sensor.a', color: '#123456' });
    await el.updateComplete;
    expect(q<HTMLElement>(el, '.meter-swatch').getAttribute('style')).toContain('#123456');
  });

  it('hides the total from the meter pickers', async () => {
    const { el } = await mount({ ...base, total: 'sensor.t' });
    const entity = q(el, 'ha-form.meter').schema[0] as { selector?: unknown };
    expect(entity.selector).toEqual({
      entity: { filter: { domain: 'sensor' }, exclude_entities: ['sensor.t'] },
    });
    const add = q(el, 'ha-form.add').schema[0] as { selector?: unknown };
    expect(add.selector).toEqual({
      entity: { filter: { domain: 'sensor' }, exclude_entities: ['sensor.a', 'sensor.t'] },
    });
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

  it('keeps an open panel with its meter when meters are moved', async () => {
    const { el } = await mount({ ...base, meters: ['sensor.a', 'sensor.b', 'sensor.c'] });
    const panels = () => [
      ...el.shadowRoot!.querySelectorAll<HTMLElement & { expanded?: boolean }>(
        'ha-expansion-panel',
      ),
    ];
    const openPanel = panels()[0];
    openPanel.expanded = true;

    q<HTMLElement>(el, '[data-index="0"] .down').click();
    await el.updateComplete;

    // The same element (still open) now sits second, showing meter A.
    expect(panels()[1]).toBe(openPanel);
    expect(openPanel.expanded).toBe(true);
    expect(openPanel.dataset.index).toBe('1');
    expect(panels()[0].expanded).toBeFalsy();
  });

  it('keeps a pending Navigate choice with its meter when meters are moved', async () => {
    const { el } = await mount({ ...base, meters: ['sensor.a', 'sensor.b'] });
    const formOf = (i: number) => q(el, `[data-index="${i}"] ha-form.meter`);
    change(formOf(0), { ...formOf(0).data, tap_action: 'navigate' });
    await el.updateComplete;
    q<HTMLElement>(el, '[data-index="0"] .down').click();
    await el.updateComplete;
    expect(formOf(1).data.tap_action).toBe('navigate');
    expect(formOf(0).data.tap_action).not.toBe('navigate');
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

// Runs last: the final test defines ha-form and ha-expansion-panel for the rest of the file.
describe('loading the lazy HA editor elements', () => {
  type W = { loadCardHelpers?: () => Promise<unknown> };
  afterEach(() => {
    delete (window as W).loadCardHelpers;
  });

  function stubHelpers() {
    const getConfigElement = vi.fn(() => Promise.resolve(document.createElement('div')));
    class FakeEntitiesCard extends HTMLElement {
      static getConfigElement = getConfigElement;
    }
    customElements.define(
      `fake-entities-card-${Math.random().toString(36).slice(2)}`,
      FakeEntitiesCard,
    );
    const createCardElement = vi.fn(() => new FakeEntitiesCard());
    const loadCardHelpers = vi.fn(() => Promise.resolve({ createCardElement }));
    (window as W).loadCardHelpers = loadCardHelpers;
    return { loadCardHelpers, createCardElement, getConfigElement };
  }

  it('asks HA to load them when ha-form is missing, then re-renders', async () => {
    const h = stubHelpers();
    const { el } = await mount(base);
    const update = vi.spyOn(el, 'requestUpdate');
    await vi.waitFor(() => expect(h.getConfigElement).toHaveBeenCalledTimes(1));
    expect(h.loadCardHelpers).toHaveBeenCalledTimes(1);
    expect(h.createCardElement).toHaveBeenCalledWith({ type: 'entities', entities: [] });
    await vi.waitFor(() => expect(update).toHaveBeenCalled());
  });

  it('only tries once per editor, even when reattached', async () => {
    const h = stubHelpers();
    const { el } = await mount(base);
    el.remove();
    document.body.append(el);
    await vi.waitFor(() => expect(h.getConfigElement).toHaveBeenCalled());
    expect(h.loadCardHelpers).toHaveBeenCalledTimes(1);
  });

  it('never throws outside HA', async () => {
    await expect(loadHaEditorElements()).resolves.toBe(false);
    (window as W).loadCardHelpers = () => Promise.reject(new Error('nope'));
    await expect(loadHaEditorElements()).resolves.toBe(false);
  });

  it('skips the loader when the elements are already defined', async () => {
    const h = stubHelpers();
    customElements.define('ha-form', class extends HTMLElement {});
    customElements.define('ha-expansion-panel', class extends HTMLElement {});
    await expect(loadHaEditorElements()).resolves.toBe(false);
    await mount(base);
    await Promise.resolve();
    expect(h.loadCardHelpers).not.toHaveBeenCalled();
  });
});
