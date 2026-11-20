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

const POWER_FACTORS: Readonly<Record<string, number>> = { W: 1, kW: 1000, MW: 1_000_000 };

/** Converts a power value to watts; other units pass through unchanged. */
export function toWatts(value: number, unit: string | undefined): number {
  const factor = unit === undefined ? undefined : POWER_FACTORS[unit];
  return factor === undefined ? value : value * factor;
}

/** True when all units are power units (W, kW, MW) or all are identical and defined. */
export function unitsCompatible(units: (string | undefined)[]): boolean {
  if (units.length === 0) return true;
  if (units.every((u) => u !== undefined && u in POWER_FACTORS)) return true;
  return units[0] !== undefined && units.every((u) => u === units[0]);
}

/** Returns the explicit color, or the HA graph color for the index with a fallback. */
export function seriesColor(index: number, explicit?: string): string {
  if (explicit) return explicit;
  const slot = index % FALLBACK_SERIES.length;
  return `var(--graph-color-${slot + 1}, ${FALLBACK_SERIES[slot]})`;
}
