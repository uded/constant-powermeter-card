import { html, nothing, svg, type SVGTemplateResult, type TemplateResult } from 'lit';
import { valueY } from './geometry';
import { UNTRACKED_KEY, type Band, type Series, type Slice } from './types/chart';

const W = 60;
const H = 24;
const GAP_DEG = 1;
const RING = { c: 50, r: 38, w: 14 };

const fmt = (n: number): string => String(Math.round(n * 100) / 100);

type Pt = { x: number; y: number };
type Range = { lo: number; hi: number };

const isNum = (v: number | null | undefined): v is number =>
  typeof v === 'number' && Number.isFinite(v);

const xAt = (i: number, count: number): number => (count > 1 ? (i / (count - 1)) * W : W / 2);

/** runsOf returns the contiguous index runs for which ok(i) holds. */
function runsOf(count: number, ok: (i: number) => boolean): number[][] {
  const runs: number[][] = [];
  let run: number[] = [];
  for (let i = 0; i < count; i++) {
    if (ok(i)) {
      run.push(i);
    } else if (run.length > 0) {
      runs.push(run);
      run = [];
    }
  }
  if (run.length > 0) runs.push(run);
  return runs;
}

// A lone point becomes a zero-length segment so caps and fills can draw it.
const pad = (pts: Pt[]): Pt[] => (pts.length === 1 ? [pts[0], pts[0]] : pts);
const poly = (pts: Pt[], first = 'M'): string =>
  pts.map((p, k) => `${k === 0 ? first : 'L'}${fmt(p.x)} ${fmt(p.y)}`).join(' ');

function zeroLine(range: Range): SVGTemplateResult | string {
  if (!(range.lo < 0)) return '';
  const y = fmt(valueY(0, range, H));
  return svg`<path class="zero" d="M0 ${y} L${W} ${y}" fill="none" style="stroke: currentColor; stroke-opacity: 0.3" vector-effect="non-scaling-stroke"></path>`;
}

/** renderStacked draws one shaded area with a top edge per band; label names it for screen readers. */
export function renderStacked(bands: Band[], range: Range, label?: string): SVGTemplateResult {
  return svg`
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label=${label ?? nothing}>
      ${zeroLine(range)}
      ${bands.map((b) => {
        const count = Math.min(b.lower.length, b.upper.length);
        const runs = runsOf(count, (i) => isNum(b.lower[i]) && isNum(b.upper[i]));
        return runs.map((run) => {
          const top = pad(
            run.map((i) => ({ x: xAt(i, count), y: valueY(b.upper[i] as number, range, H) })),
          );
          const bottom = pad(
            run.map((i) => ({ x: xAt(i, count), y: valueY(b.lower[i] as number, range, H) })),
          ).reverse();
          const area = `${poly(top)} ${poly(bottom, 'L')} Z`;
          return svg`
            <path class="band" d=${area} style="fill: ${b.color}; fill-opacity: 0.6"></path>
            <path class="edge" d=${poly(top)} fill="none" style="stroke: ${b.color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`;
        });
      })}
    </svg>
  `;
}

/** renderLines draws one 2 px line per series; the untracked series is dashed. */
export function renderLines(series: Series[], range: Range, label?: string): SVGTemplateResult {
  return svg`
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label=${label ?? nothing}>
      ${zeroLine(range)}
      ${series.map((s) => {
        const count = s.buckets.length;
        const dash = s.key === UNTRACKED_KEY ? '; stroke-dasharray: 3 2' : '';
        return runsOf(count, (i) => isNum(s.buckets[i])).map((run) => {
          const pts = pad(
            run.map((i) => ({ x: xAt(i, count), y: valueY(s.buckets[i] as number, range, H) })),
          );
          return svg`<path class="series" d=${poly(pts)} fill="none" style="stroke: ${s.color}${dash}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`;
        });
      })}
    </svg>
  `;
}

function polar(deg: number): Pt {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: RING.c + RING.r * Math.cos(a), y: RING.c + RING.r * Math.sin(a) };
}

/** arcPath draws a clockwise arc from start to end degrees (0 = top); spans stay below 360. */
function arcPath(start: number, end: number): string {
  const a = polar(start);
  const b = polar(end);
  const large = end - start > 180 ? 1 : 0;
  return `M${fmt(a.x)} ${fmt(a.y)} A${RING.r} ${RING.r} 0 ${large} 1 ${fmt(b.x)} ${fmt(b.y)}`;
}

function slicePaths(s: Slice, gap: number): string[] {
  const start = s.start + gap / 2;
  const end = s.end - gap / 2;
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];
  // A full circle cannot be one arc (its end point equals its start), so draw two halves.
  if (end - start >= 359.99) {
    return [arcPath(start, start + 180), arcPath(start + 180, start + 359.99)];
  }
  return [arcPath(start, end)];
}

/** renderDonut draws the ring with a text in the middle; no slices gives a grey empty ring. */
export function renderDonut(slices: Slice[], centerText: string, label?: string): TemplateResult {
  const gap = slices.length > 1 ? GAP_DEG : 0;
  return html`
    <svg viewBox="0 0 100 100" role="img" aria-label=${label ?? nothing}>
      ${
        slices.length === 0
          ? svg`<circle class="empty-ring" cx=${RING.c} cy=${RING.c} r=${RING.r} fill="none" style="stroke: var(--divider-color, #e0e0e0)" stroke-width=${RING.w}></circle>`
          : slices.map((s) =>
              slicePaths(s, gap).map(
                (d) =>
                  svg`<path class="slice" data-key=${s.key} d=${d} fill="none" style="stroke: ${s.color}" stroke-width=${RING.w}></path>`,
              ),
            )
      }
      <text
        class="center"
        x=${RING.c}
        y=${RING.c}
        text-anchor="middle"
        dominant-baseline="central"
        style="fill: currentColor"
      >
        ${centerText}
      </text>
    </svg>
  `;
}

/** renderLegend lists a colored swatch and a name per item. */
export function renderLegend(
  items: { key: string; name: string; color: string }[],
): TemplateResult {
  return html`<div class="legend">
    ${items.map(
      (i) =>
        html`<span class="legend-item"
          ><span class="swatch" style="background: ${i.color}"></span>${i.name}</span
        >`,
    )}
  </div>`;
}
