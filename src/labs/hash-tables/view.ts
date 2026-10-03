/**
 * How the lab writes its numbers. Kept apart from the engine, so arithmetic
 * never depends on how a figure happens to be printed.
 */

/** At most `digits` decimals, trailing zeros dropped, never "−0". */
export function formatValue(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "∞";
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  if (rounded === 0) return "0";
  const text = Number.isInteger(rounded)
    ? String(Math.abs(rounded))
    : Math.abs(rounded).toFixed(digits).replace(/0+$/, "");
  return rounded < 0 ? `−${text}` : text;
}

/** A signed 32-bit hash with a real minus sign. */
export const formatHash = (h: number): string => (h < 0 ? `−${-h}` : String(h));
