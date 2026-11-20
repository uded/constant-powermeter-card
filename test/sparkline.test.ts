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
