import { svg, type SVGTemplateResult } from 'lit';
import { sparklinePaths, valueY } from './geometry';

const W = 60;
const H = 24;

/** renderSparkline draws the gradient-stroked history sparkline as an SVG template. */
export function renderSparkline(
  buckets: (number | null)[],
  stopColors: string[],
  r: { lo: number; hi: number },
  twoSided: boolean,
  id: string,
): SVGTemplateResult {
  const { lines, areas } = sparklinePaths(buckets, r, { w: W, h: H });
  const gradId = `cpm-grad-${id}`;
  const count = buckets.length;
  const zeroY = valueY(0, r, H);
  // Offsets come from buckets.length; missing colors reuse the last one.
  const stops = buckets.map(
    (_, i) => stopColors[i] ?? stopColors[stopColors.length - 1] ?? 'currentColor',
  );
  return svg`
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${W} y2="0">
          ${stops.map(
            (c, i) => svg`<stop offset=${count > 1 ? i / (count - 1) : 0} stop-color=${c}></stop>`,
          )}
        </linearGradient>
      </defs>
      ${
        twoSided
          ? svg`<line class="zero" x1="0" y1=${zeroY} x2=${W} y2=${zeroY} stroke="currentColor" stroke-opacity="0.3" vector-effect="non-scaling-stroke"></line>`
          : ''
      }
      ${areas.map(
        (d) => svg`<path class="area" d=${d} fill="url(#${gradId})" fill-opacity="0.2"></path>`,
      )}
      ${lines.map(
        (d) =>
          svg`<path class="line" d=${d} fill="none" stroke="url(#${gradId})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`,
      )}
    </svg>
  `;
}
