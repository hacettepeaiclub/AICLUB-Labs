/**
 * How the lab writes numbers and reads them back.
 *
 * Kept apart from the engine so the arithmetic never depends on how a
 * number happens to be printed.
 */

/** The largest weight a cell accepts. Past this the pictures are all one colour. */
export const WEIGHT_LIMIT = 99;

/**
 * A kernel weight as a person types it: `-1`, `0.5`, `0,5`, `.25`, `1/9`, or
 * with a typographic minus. Null for anything else, and for |value| over
 * the limit.
 */
export function parseWeight(text: string): number | null {
  const s = text.trim().replace(/−/g, "-").replace(",", ".");
  if (s === "") return null;
  const fraction = /^([+-]?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(s);
  let value: number;
  if (fraction) {
    const den = Number(fraction[2]);
    if (den === 0) return null;
    value = Number(fraction[1]) / den;
  } else if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s)) {
    value = Number(s);
  } else {
    return null;
  }
  if (!Number.isFinite(value) || Math.abs(value) > WEIGHT_LIMIT) return null;
  // −0 would print as "−0" in a cell; it is the same weight as 0.
  return value === 0 ? 0 : value;
}

/**
 * A number for a cell or a figure: whole numbers as they are, others to at
 * most `digits` places, with a real minus sign. Anything that rounds to zero
 * is written 0, never −0.
 */
export function formatValue(value: number, digits = 2): string {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  if (rounded === 0) return "0";
  const text = Number.isInteger(rounded)
    ? String(Math.abs(rounded))
    : Math.abs(rounded).toFixed(digits).replace(/0+$/, "");
  return rounded < 0 ? `−${text}` : text;
}

/** A weight in a product, with brackets around a negative one: (−1)·1. */
export const factor = (value: number): string =>
  value < 0 ? `(${formatValue(value)})` : formatValue(value);

/** A small loss, readably: 0.0042 or 3.1 × 10⁻⁸. */
export function formatLoss(value: number): string {
  if (value === 0) return "0";
  if (value >= 0.001) return formatValue(value, value >= 1 ? 2 : 4);
  const exponent = Math.floor(Math.log10(value));
  const mantissa = value / 10 ** exponent;
  return `${mantissa.toFixed(1)} × 10${superscript(exponent)}`;
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

/** 65536 → "65,536" in English, "65.536" in Turkish. */
export const grouped = (n: number, language: "en" | "tr"): string =>
  n.toLocaleString(language === "tr" ? "tr-TR" : "en-US");
