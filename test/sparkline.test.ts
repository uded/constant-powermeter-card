import { render } from 'lit';
import { describe, expect, it } from 'vitest';
import { renderSparkline } from '../src/sparkline';

function draw(twoSided: boolean): HTMLElement {
  const el = document.createElement('div');
  render(
    renderSparkline(
      [1, null, 3, 4],
      ['red', 'green', 'blue', 'black'],
      { lo: -2, hi: 5 },
      twoSided,
      'abc',
    ),
    el,
  );
  return el;
}

describe('renderSparkline gradient', () => {
  it('uses user space units spanning the viewBox', () => {
    const grad = draw(false).querySelector('linearGradient');
    expect(grad?.getAttribute('gradientUnits')).toBe('userSpaceOnUse');
    expect(grad?.getAttribute('x1')).toBe('0');
    expect(grad?.getAttribute('x2')).toBe('60');
  });
  it('renders flat and single-point runs with round caps', () => {
    const el = document.createElement('div');
    render(
      renderSparkline(
        [null, 3, null, 2, 2],
        ['a', 'b', 'c', 'd', 'e'],
        { lo: 0, hi: 4 },
        false,
        'f',
      ),
      el,
    );
    const lines = el.querySelectorAll('path.line');
    expect(lines).toHaveLength(2);
    expect(lines[0].getAttribute('stroke-linecap')).toBe('round');
    expect(lines[0].getAttribute('d')).toBe('M15 6 L15 6');
  });
  it('bases stop offsets on bucket count even if colors mismatch', () => {
    const el = document.createElement('div');
    render(renderSparkline([1, 2, 3], ['a'], { lo: 0, hi: 4 }, false, 'm'), el);
    expect(el.querySelectorAll('stop')).toHaveLength(3);
  });
});

describe('renderSparkline', () => {
  it('defines gradient cpm-grad-<id> with one stop per bucket', () => {
    const el = draw(false);
    const grad = el.querySelector('linearGradient');
    expect(grad?.getAttribute('id')).toBe('cpm-grad-abc');
    expect(grad?.querySelectorAll('stop')).toHaveLength(4);
  });
  it('draws a zero line only when two-sided', () => {
    expect(draw(false).querySelector('line.zero')).toBeNull();
    expect(draw(true).querySelector('line.zero')).not.toBeNull();
  });
});
