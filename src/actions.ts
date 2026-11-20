import type { TapAction } from './config';

/** runTapAction performs a meter's tap action, dispatching from el so events reach HA. */
export function runTapAction(el: HTMLElement, action: TapAction, entityId: string): void {
  switch (action.action) {
    case 'more-info':
      el.dispatchEvent(
        new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }),
      );
      return;
    case 'navigate':
      window.history.pushState(null, '', action.navigation_path);
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
      return;
    case 'url':
      window.open(action.url_path, '_blank', 'noopener');
      return;
    case 'none':
      return;
  }
}
