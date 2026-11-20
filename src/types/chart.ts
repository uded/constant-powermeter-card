export type ChartKind = 'stacked' | 'lines' | 'donut';

/** Series is one meter's history, resampled to buckets, in watts. */
export interface Series {
  key: string;
  name: string;
  color: string;
  buckets: (number | null)[];
}

/** Band is the shaded area between a lower and an upper bound per bucket. */
export interface Band {
  key: string;
  color: string;
  lower: (number | null)[];
  upper: (number | null)[];
}

/** Slice is one donut segment; start and end are angles in degrees. */
export interface Slice {
  key: string;
  name: string;
  color: string;
  value: number;
  start: number;
  end: number;
}

export const UNTRACKED_KEY = '__untracked';
export const UNTRACKED_NAME = 'Untracked';
export const UNTRACKED_COLOR = 'var(--disabled-color, #bdbdbd)';
