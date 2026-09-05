/** Formatting helpers for lab UI (stats, counters, big-O style output). */

export const formatNumber = (n: number, maxFractionDigits = 2): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: maxFractionDigits }).format(n);

/** 1234567 → "1.2M" — for counters and stat tiles. */
export const formatCompact = (n: number): string =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const formatPercent = (fraction: number, digits = 0): string =>
  `${(fraction * 100).toFixed(digits)}%`;

/** Milliseconds → human duration ("1.2s", "340ms"). */
export const formatMs = (ms: number): string =>
  ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
