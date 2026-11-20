/** Fallback series colors, readable on light and dark themes. */
export const FALLBACK_SERIES: readonly string[] = [
  '#44739e',
  '#e45e65',
  '#39c07f',
  '#f0a30a',
  '#9c6fb6',
  '#2bb5c9',
  '#d9822b',
  '#7a8f3a',
  '#c2549a',
  '#8a8f98',
];

// Exact spellings first, so MW (mega) is never read as mW (milli); any case only for w and kw.
const EXACT_FACTORS: Readonly<Record<string, number>> = { W: 1, kW: 1000, MW: 1_000_000 };
const LOOSE_FACTORS: Readonly<Record<string, number>> = { w: 1, kw: 1000 };

/**
 * wattFactor is the multiplier from a unit to watts, or null for a unit that is not power.
 * A meter without a unit counts as watts: this is a power card.
 */
export function wattFactor(unit: string | undefined): number | null {
  const u = unit?.trim() ?? '';
  if (u === '') return 1;
  if (Object.hasOwn(EXACT_FACTORS, u)) return EXACT_FACTORS[u];
  const l = u.toLowerCase();
  return Object.hasOwn(LOOSE_FACTORS, l) ? LOOSE_FACTORS[l] : null;
}

/** True for units the combined charts accept: W, kW, MW (w and kw in any case) or none. */
export function isPowerUnit(unit: string | undefined): boolean {
  return wattFactor(unit) !== null;
}

/** Converts a power value to watts; other units pass through unchanged. */
export function toWatts(value: number, unit: string | undefined): number {
  return value * (wattFactor(unit) ?? 1);
}

/** Returns the explicit color, or the HA graph color for the index with a fallback. */
export function seriesColor(index: number, explicit?: string): string {
  if (explicit) return explicit;
  const slot = index % FALLBACK_SERIES.length;
  return `var(--graph-color-${slot + 1}, ${FALLBACK_SERIES[slot]})`;
}
