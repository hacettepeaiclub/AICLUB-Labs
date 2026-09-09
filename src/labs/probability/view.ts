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
