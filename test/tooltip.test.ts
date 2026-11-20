import { render } from 'lit';
import { describe, expect, it } from 'vitest';
import { renderSliceTip, renderTimeTip, stepAt, stepEnd, stepLeft } from '../src/tooltip';

const mount = (t: ReturnType<typeof renderTimeTip>): HTMLElement => {
  const host = document.createElement('div');
  render(t, host);
  return host;
};

describe('tooltip helpers', () => {
  it('maps a pointer x to a step inside the range', () => {
    expect(stepAt(0, 200, 60)).toBe(0);
    expect(stepAt(200, 200, 60)).toBe(59);
    expect(stepAt(-5, 200, 60)).toBe(0);
    expect(stepAt(250, 200, 60)).toBe(59);
    expect(stepAt(100, 200, 60)).toBe(30);
    expect(stepAt(10, 0, 60)).toBe(0);
    expect(stepAt(10, 200, 1)).toBe(0);
  });

  it('places a step and finds its end time', () => {
    expect(stepLeft(0, 60)).toBe(0);
    expect(stepLeft(59, 60)).toBe(100);
    expect(stepLeft(0, 1)).toBe(50);
    expect(stepEnd(3_600_000, 1, 60, 59)).toBe(3_600_000);
    expect(stepEnd(3_600_000, 1, 60, 0)).toBe(60_000);
  });

  it('renders a time tip on the open side of the guide line', () => {
    const rows = [
      { key: '0', name: 'Kitchen', color: 'red', value: 1240 },
      { key: '1', name: 'Garage', color: 'blue', value: null },
    ];
    const el = mount(renderTimeTip('14:20', rows, (v) => `${v} W`, 10));
    const tip = el.querySelector('.tip')!;
    expect(tip.classList.contains('right')).toBe(true);
    expect(tip.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('.guide')!.getAttribute('style')).toContain('left: 10%');
    expect(el.querySelector('.tip-title')!.textContent).toBe('14:20');
    const values = [...el.querySelectorAll('.tip-row .tip-value')].map((v) => v.textContent);
    expect(values).toEqual(['1240 W', '—']);
    expect(el.querySelector('.tip-row .swatch')!.getAttribute('style')).toContain('red');
    const right = mount(renderTimeTip('Now', rows, String, 70));
    expect(right.querySelector('.tip')!.classList.contains('left')).toBe(true);
  });

  it('renders a slice tip with value and share', () => {
    const host = document.createElement('div');
    render(renderSliceTip('Kitchen', 'red', '1,240 W', '32%'), host);
    const tip = host.querySelector('.tip.slice')!;
    expect(tip.getAttribute('aria-hidden')).toBe('true');
    expect(tip.textContent).toContain('Kitchen');
    expect(tip.querySelector('.tip-value')!.textContent).toBe('1,240 W');
    expect(tip.querySelector('.tip-share')!.textContent).toBe('32%');
  });
});
