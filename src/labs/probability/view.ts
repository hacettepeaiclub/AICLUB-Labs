/**
 * Presentation helpers, pure and outside the components.
 *
 * The rule this lab needs most: a theoretical value and a simulated one must
 * never be formatted by the same call without saying which is which, because
 * the whole academic position of the lab is that those are different kinds of
 * number. So the components print them in labelled columns, and this file only
 * decides how many digits each gets.
 */

/** Probabilities as whole-tenth percentages: enough to see 50.7 cross 50. */
export const percent = (value: number): string => `${(value * 100).toFixed(1)}%`;

/**
 * A count with its thousands grouped, using the separator the dictionary
 * supplies. Deliberately not `toLocaleString`: that reads the browser's
 * locale, so an English page on a Turkish machine printed "1.000".
 */
export const grouped = (value: number, separator: string): string =>
  String(value).replace(/(\d)(?=(\d{3})+$)/g, `$1${separator}`);

/** Counts inside a fraction, e.g. "273 / 350". */
export const ratio = (part: number, whole: number): string => `${part} / ${whole}`;

/** A day index as a calendar date, so a birthday reads as one. */
const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

export function dayLabel(day: number, months: readonly string[]): string {
  let remaining = ((day % 365) + 365) % 365;
  for (let month = 0; month < MONTH_LENGTHS.length; month++) {
    const length = MONTH_LENGTHS[month]!;
    if (remaining < length) return `${remaining + 1} ${months[month] ?? ""}`.trim();
    remaining -= length;
  }
  return String(day + 1);
}

/**
 * Where each person sits in the room picture.
 *
 * A fixed-width grid rather than a circle: at fifty people a circle puts two
 * dots on top of each other and the collision highlight becomes unreadable,
 * which is the one thing that picture exists to show.
 */
export const COLUMNS = 12;

export const seatOf = (index: number): { row: number; col: number } => ({
  row: Math.floor(index / COLUMNS),
  col: index % COLUMNS,
});

// ------------------------------------------------- the convergence chart ---

/**
 * Trials on a logarithmic axis.
 *
 * Ten to a hundred thousand is four decades, and on a linear axis the first
 * three of them are a smudge against the left edge. The early trials are
 * exactly where the proportion swings hardest, so they get the same room as
 * the late ones.
 */
export const logX = (trials: number, max: number): number =>
  max <= 1 ? 0 : (Math.log10(Math.max(trials, 1)) / Math.log10(max)) * 100;

/** A proportion, placed in a window that the caller sizes from the data. */
export const bandY = (value: number, low: number, high: number): number =>
  high === low ? 50 : ((high - value) / (high - low)) * 100;
