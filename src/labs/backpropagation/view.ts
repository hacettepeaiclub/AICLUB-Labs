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

/** A small number readably: 0.0042, or 3.1 × 10⁻⁸ when it is tinier than that. */
export function formatSmall(value: number): string {
  if (!Number.isFinite(value)) return "∞";
  const a = Math.abs(value);
  if (a === 0) return "0";
  if (a >= 0.001 && a < 1e5) return formatValue(value, a >= 1 ? 2 : 4);
  const exponent = Math.floor(Math.log10(a));
  const mantissa = value / 10 ** exponent;
  return `${formatValue(mantissa, 1)} × 10${superscript(exponent)}`;
}

const SUPERSCRIPT: Record<string, string> = {
  "-": "⁻",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

export const superscript = (n: number): string =>
  [...String(n)].map((c) => SUPERSCRIPT[c] ?? c).join("");
