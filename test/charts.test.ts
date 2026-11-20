import { render } from 'lit';
import type { SVGTemplateResult, TemplateResult } from 'lit';
import { describe, expect, it } from 'vitest';
import { renderDonut, renderLegend, renderLines, renderStacked } from '../src/charts';

function draw(t: SVGTemplateResult | TemplateResult): HTMLElement {
  const el = document.createElement('div');
  render(t, el);
  return el;
}

describe('renderStacked', () => {
  it('draws one area per band with colors in style, not attributes', () => {
    const el = draw(
      renderStacked(
        [{ key: 'a', color: 'var(--graph-color-1, #4e79a7)', lower: [0, 0], upper: [1, 2] }],
        { lo: 0, hi: 2 },
      ),
    );
    const area = el.querySelector('path.band')!;
    expect(area.getAttribute('fill')).toBeNull();
    expect(area.getAttribute('style')).toContain('var(--graph-color-1');
    expect(area.getAttribute('d')).not.toContain('NaN');
  });
  it('splits a band at gaps', () => {
    const el = draw(
      renderStacked([{ key: 'a', color: 'red', lower: [0, null, 0], upper: [1, null, 1] }], {
        lo: 0,
        hi: 1,
      }),
    );
    expect(el.querySelectorAll('path.band')).toHaveLength(2);
  });
  it('draws a zero line only when the range goes below zero', () => {
    expect(draw(renderStacked([], { lo: 0, hi: 1 })).querySelector('.zero')).toBeNull();
    expect(draw(renderStacked([], { lo: -1, hi: 1 })).querySelector('.zero')).not.toBeNull();
  });
  it('never uses the class line', () => {
    const el = draw(
      renderStacked([{ key: 'a', color: 'red', lower: [0, 0], upper: [1, 2] }], { lo: -1, hi: 2 }),
    );
    expect(el.querySelector('.line')).toBeNull();
  });
});

describe('renderLines', () => {
  it('draws lines per series and nothing for all-null series', () => {
    const el = draw(
      renderLines(
        [
          { key: 'a', name: 'a', color: 'red', buckets: [1, 2] },
          { key: 'b', name: 'b', color: 'blue', buckets: [null, null] },
        ],
        { lo: 0, hi: 2 },
      ),
    );
    expect(el.querySelectorAll('path.series')).toHaveLength(1);
    expect(el.querySelector('path.series')!.getAttribute('stroke')).toBeNull();
  });
  it('dashes the untracked series', () => {
    const el = draw(
      renderLines([{ key: '__untracked', name: 'u', color: 'grey', buckets: [1, 2] }], {
        lo: 0,
        hi: 2,
      }),
    );
    expect(el.querySelector('path.series')!.getAttribute('style')).toContain('dasharray');
  });
});

describe('renderDonut', () => {
  it('draws a full ring for a single 360° slice and an empty ring with —', () => {
    const full = draw(
      renderDonut([{ key: 'a', name: 'A', color: 'red', value: 1, start: 0, end: 360 }], '1 W'),
    );
    expect(full.querySelectorAll('.slice').length).toBeGreaterThan(0);
    expect(full.innerHTML).not.toContain('NaN');
    const empty = draw(renderDonut([], '—'));
    expect(empty.querySelector('.empty-ring')).not.toBeNull();
    expect(empty.textContent).toContain('—');
  });
  it('draws one arc per slice with a gap, colors in style', () => {
    const el = draw(
      renderDonut(
        [
          { key: 'a', name: 'A', color: 'var(--x, red)', value: 1, start: 0, end: 90 },
          { key: 'b', name: 'B', color: 'blue', value: 3, start: 90, end: 360 },
        ],
        '4 W',
      ),
    );
    const slices = el.querySelectorAll('.slice');
    expect(slices).toHaveLength(2);
    expect(slices[0].getAttribute('style')).toContain('var(--x');
    expect(slices[0].getAttribute('stroke')).toBeNull();
    expect(el.innerHTML).not.toContain('NaN');
  });
});

describe('renderLegend', () => {
  it('renders a legend entry per item', () => {
    const el = draw(renderLegend([{ key: 'a', name: 'Kitchen', color: 'red' }]));
    expect(el.textContent).toContain('Kitchen');
    expect(el.querySelector('.swatch')!.getAttribute('style')).toContain('red');
  });
});
