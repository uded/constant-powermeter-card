import { afterEach, describe, expect, it, vi } from 'vitest';
import { runTapAction } from '../src/actions';

describe('runTapAction', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('more-info fires hass-more-info, composed and bubbling', () => {
    const el = document.createElement('div');
    const spy = vi.fn();
    document.body.append(el);
    document.addEventListener('hass-more-info', spy);
    runTapAction(el, { action: 'more-info' }, 'sensor.a');
    document.removeEventListener('hass-more-info', spy);
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent;
    expect(ev.detail).toEqual({ entityId: 'sensor.a' });
    expect(ev.composed).toBe(true);
    expect(ev.bubbles).toBe(true);
  });

  it('navigate pushes state and fires location-changed', () => {
    const push = vi.spyOn(window.history, 'pushState');
    const spy = vi.fn();
    window.addEventListener('location-changed', spy);
    runTapAction(document.body, { action: 'navigate', navigation_path: '/energy' }, 'sensor.a');
    window.removeEventListener('location-changed', spy);
    expect(push).toHaveBeenCalledWith(null, '', '/energy');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('url opens a new tab', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    runTapAction(document.body, { action: 'url', url_path: 'https://example.com' }, 'sensor.a');
    expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener');
  });

  it('none does nothing', () => {
    const el = document.createElement('div');
    document.body.append(el);
    const push = vi.spyOn(window.history, 'pushState');
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const more = vi.fn();
    const loc = vi.fn();
    document.addEventListener('hass-more-info', more);
    window.addEventListener('location-changed', loc);
    runTapAction(el, { action: 'none' }, 'sensor.a');
    document.removeEventListener('hass-more-info', more);
    window.removeEventListener('location-changed', loc);
    expect(push).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(more).not.toHaveBeenCalled();
    expect(loc).not.toHaveBeenCalled();
  });
});
