/**
 * How a scientific calculator shows a number.
 *
 * Both models this simulates (Casio fx-991EX and fx-991ES PLUS) work to ten
 * significant digits on screen, switch to scientific notation outside
 * 10⁻² ≤ |x| < 10¹⁰ (the factory "Norm 1" setting), and, in their default
 * Math output, show a result as a fraction when it is one. `S⇔D` swaps the
 * fraction for its decimal.
 *
 * The arithmetic underneath is ordinary floating point. Ten digits on screen
 * is what hides its noise: 0.1 + 0.2 is 0.30000000000000004 in memory and
 * 0.3, or 3⁄10, on the display, exactly as on the real device.
 */

/** Digits shown on the display. */
export const DISPLAY_DIGITS = 10;

/** Largest magnitude the calculators accept before a Math ERROR. */
export const OVERFLOW = 1e100;

/** The minus sign used on screen, so it never reads as a hyphen. */
export const MINUS = "−";

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

const superscript = (text: string) => [...text].map((c) => SUPERSCRIPT[c] ?? c).join("");

/** `x` rounded to the digits the display holds, with negative zero made zero. */
export function displayRound(x: number): number {
  if (x === 0 || !Number.isFinite(x)) return x === 0 ? 0 : x;
  return Number(x.toPrecision(DISPLAY_DIGITS));
}

/**
 * A decimal, as the display writes it: "0.5", "−12", "1.5×10⁻³".
 *
 * `zeroTakesADigit`: on the MS the 0 before the point uses one of the ten
 * digit places, so a number below 1 is rounded to ten significant digits and
 * then shows only nine. The MS manual's own examples read that way:
 * r = 0.982607368 and t = −0.284747398, where the values to ten digits are
 * 0.9826073689 and −0.2847473987.
 */
export function formatDecimal(x: number, zeroTakesADigit = false): string {
  const r = displayRound(x);
  if (r === 0) return "0";
  const sign = r < 0 ? MINUS : "";
  const abs = Math.abs(r);
  if (abs >= 1e10 || abs < 1e-2) {
    const [mantissa = "0", exponent = "0"] = abs.toExponential(DISPLAY_DIGITS - 1).split("e");
    const trimmed = mantissa.includes(".") ? mantissa.replace(/\.?0+$/, "") : mantissa;
    return `${sign}${trimmed}×10${superscript(String(Number(exponent)))}`;
  }
  const text = String(abs);
  if (zeroTakesADigit && abs < 1) return sign + text.slice(0, 11).replace(/.?0+$/, "");
  return sign + text;
}

export interface Fraction {
  /** Signed numerator. */
  n: number;
  /** Positive denominator, never 1. */
  d: number;
}

/**
 * The fraction a value is, if it is one the display would show.
 *
 * Found by continued fractions, and accepted only when it matches the value to
 * within float noise and fits the display: numerator and denominator together
 * in ten digits, as on the device. An irrational value has no such fraction,
 * because every convergent close enough to it is far too long to show.
 */
export function toFraction(x: number): Fraction | null {
  if (!Number.isFinite(x) || Number.isInteger(x)) return null;
  const sign = x < 0 ? -1 : 1;
  const v = Math.abs(x);
  const tolerance = 1e-12 * Math.max(1, v);
  // h, k: the latest convergent; h1, k1: the one before it.
  let h = 1;
  let h1 = 0;
  let k = 0;
  let k1 = 1;
  let rest = v;
  for (let i = 0; i < 64; i++) {
    const a = Math.floor(rest);
    [h, h1] = [a * h + h1, h];
    [k, k1] = [a * k + k1, k];
    if (k > 1e10) return null;
    if (Math.abs(v - h / k) <= tolerance) break;
    const frac = rest - a;
    if (frac < 1e-15) break;
    rest = 1 / frac;
  }
  if (k <= 1 || Math.abs(v - h / k) > tolerance) return null;
  // Numerator, denominator and the fraction mark itself in ten places: the
  // manuals say a longer fraction is shown as a decimal instead.
  if (String(h).length + String(k).length + 1 > DISPLAY_DIGITS) return null;
  return { n: sign * h, d: k };
}

/** How a model writes fractions: 1⁄3 on a natural display, 1┘3 on the MS. */
export type FractionStyle = "slash" | "ms";

/** A fraction as the display writes it: "1⁄3", "−7⁄2"; on the MS "1┘3", "−3┘1┘2". */
export function formatFraction({ n, d }: Fraction, style: FractionStyle = "slash"): string {
  const sign = n < 0 ? MINUS : "";
  const top = Math.abs(n);
  if (style === "slash") return `${sign}${top}⁄${d}`;
  // The MS shows a mixed fraction by default: whole┘numerator┘denominator.
  const whole = Math.floor(top / d);
  const rest = top % d;
  return whole ? `${sign}${whole}┘${rest}┘${d}` : `${sign}${rest}┘${d}`;
}

/**
 * A number as the display shows it: as a fraction where it is one and the
 * fraction is wanted, as a decimal otherwise.
 */
export function formatNumber(x: number, decimal = false, style: FractionStyle = "slash"): string {
  if (!decimal) {
    const fraction = toFraction(x);
    if (fraction) {
      const text = formatFraction(fraction, style);
      // A mixed fraction on the MS has a second mark and a whole part to fit.
      if (text.replace(MINUS, "").length <= DISPLAY_DIGITS) return text;
    }
  }
  // The MS style is the MS display, where the leading zero takes a digit.
  return formatDecimal(x, style === "ms");
}

/** A complex root as the solution screens write it: "1+2i", "0.25−0.75i". */
export function formatComplex(re: number, im: number, decimal = false): string {
  if (im === 0) return formatNumber(re, decimal);
  const imag = formatNumber(Math.abs(im), decimal);
  const unit = imag === "1" ? "i" : `${imag}i`;
  const sign = im < 0 ? MINUS : "+";
  return re === 0 ? `${im < 0 ? MINUS : ""}${unit}` : `${formatNumber(re, decimal)}${sign}${unit}`;
}
