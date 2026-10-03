import {
  absR,
  decimalTo,
  exactDecimal,
  scientific,
  type FloatFormat,
  type Parsed,
  type Rational,
} from "./engine";

/**
 * How the lab writes numbers for people.
 *
 * Everything here formats an exact rational from the engine; nothing converts
 * to a JavaScript number first, so no figure on the page is itself a rounded
 * float describing rounding.
 */

const SUPERSCRIPT: Record<string, string> = {
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
  "-": "⁻",
};

export const superscript = (n: number): string =>
  String(n)
    .split("")
    .map((c) => SUPERSCRIPT[c] ?? c)
    .join("");

/** `2⁻⁵⁴`: a power of two as it reads in a figure. */
export const powerOfTwo = (k: number): string => `2${superscript(k)}`;

/**
 * A magnitude for a figure: positional while it stays short, otherwise
 * `5.55 × 10⁻¹⁷`. The digits are exact roundings of the exact value.
 */
export function readable(x: Rational, digits = 3): string {
  if (x.num === 0n) return "0";
  const { mantissa, exponent } = scientific(x, digits);
  if (exponent >= -3 && exponent < 6) {
    const places = Math.max(0, digits - 1 - exponent);
    return trimZeros(decimalTo(x, places));
  }
  return `${mantissa.replace("-", "−")} × 10${superscript(exponent)}`;
}

/** The same value for a screen reader, which does not read superscripts. */
export function spoken(x: Rational, digits = 3): string {
  if (x.num === 0n) return "0";
  const { mantissa, exponent } = scientific(x, digits);
  if (exponent >= -3 && exponent < 6)
    return trimZeros(decimalTo(x, Math.max(0, digits - 1 - exponent)));
  return `${mantissa} times 10 to the ${exponent}`;
}

const trimZeros = (s: string): string => (s.includes(".") ? s.replace(/\.?0+$/, "") : s);

/**
 * Where the stored value stops agreeing with what was typed.
 *
 * Both are laid out as plain decimals and compared digit by digit. The typed
 * value is padded with zeros to the stored value's length, because typing
 * "0.1" means 0.1000…0 to every place: the stored value agrees with it until
 * its own first stray digit, and that digit is where the marking starts.
 *
 * A typed value with no finite expansion (1/3) is written to as many places
 * as the stored value has, which is enough to find the first disagreement.
 * Returns the index into `stored`, or null when the two agree throughout.
 */
export function divergence(
  typed: Rational,
  stored: Rational,
): { text: string; from: number | null } {
  const text = exactDecimal(stored) ?? "";
  const places = text.includes(".") ? text.length - text.indexOf(".") - 1 : 0;
  const typedText = exactDecimal(typed) ?? decimalTo(typed, places);

  const [storedWhole = "", storedFrac = ""] = text.split(".");
  const [typedWhole = "", typedFrac = ""] = typedText.split(".");
  if (storedWhole !== typedWhole) {
    // Different integer parts: the first differing digit, aligned from the
    // right so 9007199254740993 and …992 differ in the last place.
    const width = Math.max(storedWhole.length, typedWhole.length);
    const a = storedWhole.padStart(width, " ");
    const b = typedWhole.padStart(width, " ");
    for (let i = 0; i < width; i++) {
      if (a[i] !== b[i]) return { text, from: Math.max(0, i - (width - storedWhole.length)) };
    }
  }
  const length = Math.max(storedFrac.length, typedFrac.length);
  const a = storedFrac.padEnd(length, "0");
  const b = typedFrac.padEnd(length, "0");
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) return { text, from: storedWhole.length + 1 + i };
  }
  return { text, from: null };
}

/** The exact value a typed number stands for, when it has one. */
export const typedValue = (parsed: Parsed | null): Rational | null =>
  parsed?.kind === "finite" ? parsed.value : null;

/** |stored − typed| ÷ |typed|, or null where that means nothing. */
export function relative(error: Rational, typed: Rational): Rational | null {
  if (typed.num === 0n) return null;
  const t = absR(typed);
  return { num: absR(error).num * t.den, den: absR(error).den * t.num };
}

/** Decimal digits a format keeps: (fraction bits + 1) × log10 2. */
export const decimalDigits = (format: FloatFormat): number =>
  (format.fractionBits + 1) * Math.log10(2);
