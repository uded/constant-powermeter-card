import { html, type TemplateResult } from 'lit';

const HOUR_MS = 3_600_000;

/** TipRow is one line of a tooltip: a series with its value at the hovered step. */
export interface TipRow {
  key: string;
  name: string;
  color: string;
  value: number | null;
}

/** stepAt maps a pointer x within a chart of the given width to the nearest of count steps. */
export function stepAt(x: number, width: number, count: number): number {
  if (!(width > 0) || count <= 1) return 0;
  const i = Math.round((x / width) * (count - 1));
  return Math.min(count - 1, Math.max(0, i));
}

/** stepLeft is the step's position as a percentage of the chart width. */
export function stepLeft(i: number, count: number): number {
  return count > 1 ? (i / (count - 1)) * 100 : 50;
}

/** stepEnd is the end time (ms) of bucket i of count over the last hours before now. */
export function stepEnd(now: number, hours: number, count: number, i: number): number {
  const span = hours * HOUR_MS;
  return now - span + ((i + 1) * span) / count;
}

const swatch = (color: string) => html`<span class="swatch" style="background: ${color}"></span>`;

/**
 * renderTimeTip draws the guide line at left (percent) and a box beside it, on the side
 * with more room, listing each row's value at that step. A missing value shows a dash.
 */
export function renderTimeTip(
  title: string,
  rows: TipRow[],
  fmt: (v: number) => string,
  left: number,
): TemplateResult {
  const side = left < 50 ? 'right' : 'left';
  return html`
    <div class="guide" style="left: ${left}%" aria-hidden="true"></div>
    <div class="tip ${side}" style="left: ${left}%" aria-hidden="true">
      <div class="tip-title">${title}</div>
      ${rows.map(
        (r) =>
          html`<div class="tip-row">
            ${swatch(r.color)}<span class="tip-name">${r.name}</span
            ><span class="tip-value">${r.value === null ? '—' : fmt(r.value)}</span>
          </div>`,
      )}
    </div>
  `;
}

/** renderSliceTip draws the box for one donut slice: its name, value and share. */
export function renderSliceTip(
  name: string,
  color: string,
  value: string,
  share: string,
): TemplateResult {
  return html`<div class="tip slice" aria-hidden="true">
    <div class="tip-row">
      ${swatch(color)}<span class="tip-name">${name}</span><span class="tip-value">${value}</span
      ><span class="tip-share">${share}</span>
    </div>
  </div>`;
}
