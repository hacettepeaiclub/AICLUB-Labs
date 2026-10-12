/** Formatting helpers for lab UI (stats, counters, big-O style output). */

export const formatNumber = (n: number, maxFractionDigits = 2): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: maxFractionDigits }).format(n);

export const formatPercent = (fraction: number, digits = 0): string =>
  `${(fraction * 100).toFixed(digits)}%`;
