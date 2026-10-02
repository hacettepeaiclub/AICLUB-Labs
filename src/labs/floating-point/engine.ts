/**
 * Binary floating point, computed exactly.
 *
 * ## Why nothing in here uses a floating-point number
 *
 * A lab about rounding error cannot compute its answers with arithmetic that
 * rounds. Every value in this file is an exact rational — a pair of BigInts —
 * and every float is a sign, an exponent field and a fraction field, decoded
 * to the exact number it stands for. So when the lab says "0.1 is stored as
 * 0.1000000000000000055511151231257827021181583404541015625", every one of
 * those digits is the true value, not a printout of a double.
 *
 * That also makes the formats parameters rather than special cases. float64,
 * float32, float16, bfloat16 and the lab's toy formats are all "this many
 * exponent bits, this many fraction bits", and one rounding routine serves all
 * of them. That routine is IEEE 754's default, round to nearest with ties to
 * even, applied once to the exact value — which is also how a correct
 * conversion from a decimal string behaves, and why it can be checked against
 * the browser's own `parseFloat` and `Math.fround` (see the tests).
 *
 * ## What the formats are
 *
 * A format with E exponent bits and F fraction bits stores, for a finite
 * non-zero number:
 *
 *     normal      (−1)^s × (1 + f / 2^F) × 2^(e − bias)    e = 1 … 2^E − 2
 *     subnormal   (−1)^s × (f / 2^F) × 2^(1 − bias)         e = 0, f > 0
 *
 * with bias = 2^(E−1) − 1. An exponent field of all ones is infinity (f = 0)
 * or NaN (f ≠ 0). This is the binary interchange format of IEEE 754-2019;
 * bfloat16 is the same layout with float32's exponent and seven fraction bits.
 */

// ---------------------------------------------------------------- formats ---

export interface FloatFormat {
  readonly id: string;
  readonly exponentBits: number;
  readonly fractionBits: number;
}

export const FORMATS = {
  float64: { id: "float64", exponentBits: 11, fractionBits: 52 },
  float32: { id: "float32", exponentBits: 8, fractionBits: 23 },
  float16: { id: "float16", exponentBits: 5, fractionBits: 10 },
  bfloat16: { id: "bfloat16", exponentBits: 8, fractionBits: 7 },
} as const satisfies Record<string, FloatFormat>;

export type FormatId = keyof typeof FORMATS;

/** A small format of the same shape, for drawing every value it can hold. */
export const toyFormat = (exponentBits: number, fractionBits: number): FloatFormat => ({
  id: `toy-${exponentBits}-${fractionBits}`,
  exponentBits,
  fractionBits,
});

export const bias = (format: FloatFormat): number => 2 ** (format.exponentBits - 1) - 1;
export const totalBits = (format: FloatFormat): number =>
  1 + format.exponentBits + format.fractionBits;
const maxField = (format: FloatFormat): number => 2 ** format.exponentBits - 1;

// -------------------------------------------------------------- rationals ---

/** An exact number: `num / den`, with `den > 0` and the fraction reduced. */
export interface Rational {
  readonly num: bigint;
  readonly den: bigint;
}

const abs = (n: bigint): bigint => (n < 0n ? -n : n);

function gcd(a: bigint, b: bigint): bigint {
  a = abs(a);
  b = abs(b);
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function rational(num: bigint, den: bigint = 1n): Rational {
  if (den === 0n) throw new RangeError("Rational with a zero denominator.");
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return g > 1n ? { num: num / g, den: den / g } : { num, den };
}

export const ZERO: Rational = { num: 0n, den: 1n };

export const add = (a: Rational, b: Rational): Rational =>
  rational(a.num * b.den + b.num * a.den, a.den * b.den);
export const sub = (a: Rational, b: Rational): Rational =>
  rational(a.num * b.den - b.num * a.den, a.den * b.den);
export const mul = (a: Rational, b: Rational): Rational => rational(a.num * b.num, a.den * b.den);
export const div = (a: Rational, b: Rational): Rational => rational(a.num * b.den, a.den * b.num);
export const neg = (a: Rational): Rational => ({ num: -a.num, den: a.den });
export const absR = (a: Rational): Rational => ({ num: abs(a.num), den: a.den });

/** −1, 0 or 1. */
export const compare = (a: Rational, b: Rational): number => {
  const d = a.num * b.den - b.num * a.den;
  return d < 0n ? -1 : d > 0n ? 1 : 0;
};
export const equal = (a: Rational, b: Rational): boolean => a.num === b.num && a.den === b.den;

/** 2^k exactly, for any integer k. */
export const pow2 = (k: number): Rational =>
  k >= 0 ? { num: 1n << BigInt(k), den: 1n } : { num: 1n, den: 1n << BigInt(-k) };

const bitLength = (n: bigint): number => (n === 0n ? 0 : n.toString(2).length);

/** floor(log2(x)) for x > 0, exactly. */
function floorLog2(x: Rational): number {
  let e = bitLength(x.num) - bitLength(x.den);
  if (compare(x, pow2(e)) < 0) e -= 1;
  if (compare(x, pow2(e + 1)) >= 0) e += 1;
  return e;
}

// ---------------------------------------------------------------- parsing ---

/** What a typed number means, before any format is involved. */
export type Parsed =
  | { readonly kind: "finite"; readonly value: Rational; readonly negative: boolean }
  | { readonly kind: "infinity"; readonly negative: boolean }
  | { readonly kind: "nan" };

/**
 * Past this, a decimal exponent is not worth carrying as an exact BigInt: no
 * format here reaches 10^±330, so 1e5000 is infinity and 1e-5000 is zero in
 * every one of them, and saying so is exact.
 */
const EXPONENT_LIMIT = 1000;

/**
 * Read a number the way a person types it.
 *
 * Accepts `0.1`, `-2.5e-8`, `1/3`, `Infinity` and `NaN`, and a decimal comma
 * when there is no point — `0,1` is how a Turkish reader writes a tenth, and a
 * finder of rounding errors that rejected it would be the first rounding error
 * they met. Returns null for anything else. The value is exact: `0.1` is the
 * rational 1/10, not the double nearest to it.
 */
export function parseNumber(text: string): Parsed | null {
  let s = text.trim().replace(/\s+/g, "").replace(/_/g, "");
  if (s === "") return null;
  if (!s.includes(".") && /^[+-]?\d+,\d+(?:e[+-]?\d+)?$/i.test(s)) s = s.replace(",", ".");

  const lower = s.toLowerCase();
  const negative = lower.startsWith("-");
  const unsigned = lower.replace(/^[+-]/, "");
  if (unsigned === "inf" || unsigned === "infinity" || unsigned === "∞") {
    return { kind: "infinity", negative };
  }
  if (unsigned === "nan") return { kind: "nan" };

  const fraction = /^[+-]?(\d+)\/(\d+)$/.exec(s);
  if (fraction) {
    const den = BigInt(fraction[2] as string);
    if (den === 0n) return null;
    const value = rational(BigInt(fraction[1] as string), den);
    return { kind: "finite", value: negative ? neg(value) : value, negative };
  }

  const decimal = /^[+-]?(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(s);
  if (!decimal) return null;
  const whole = decimal[1] ?? "";
  const frac = decimal[2] ?? "";
  if (whole === "" && frac === "") return null;
  let exponent = decimal[3] === undefined ? 0 : Number(decimal[3]);
  exponent -= frac.length;
  const digits = BigInt(`${whole}${frac}` || "0");

  if (digits === 0n) return { kind: "finite", value: ZERO, negative };
  // The size of the number, not of its exponent: "1" and a thousand zeros
  // with e-1000 is one, and must not be mistaken for something tiny.
  const magnitude = digits.toString().length - 1 + exponent;
  if (magnitude > EXPONENT_LIMIT) return { kind: "infinity", negative };
  if (magnitude < -EXPONENT_LIMIT) return { kind: "finite", value: ZERO, negative };

  const ten = 10n ** BigInt(Math.abs(exponent));
  const value = exponent >= 0 ? rational(digits * ten) : rational(digits, ten);
  return { kind: "finite", value: negative ? neg(value) : value, negative };
}

// ------------------------------------------------------------------ floats ---

/** One stored value: the three fields, exactly as they sit in memory. */
export interface Float {
  readonly format: FloatFormat;
  readonly sign: 0 | 1;
  /** The biased exponent field, 0 … 2^E − 1. */
  readonly exponent: number;
  /** The fraction field, 0 … 2^F − 1. */
  readonly fraction: bigint;
}

export type FloatKind = "zero" | "subnormal" | "normal" | "infinity" | "nan";

export function classify(x: Float): FloatKind {
  if (x.exponent === maxField(x.format)) return x.fraction === 0n ? "infinity" : "nan";
  if (x.exponent === 0) return x.fraction === 0n ? "zero" : "subnormal";
  return "normal";
}

export const isFinite = (x: Float): boolean => {
  const kind = classify(x);
  return kind !== "infinity" && kind !== "nan";
};

/** The exact value a finite float stands for; null for infinity and NaN. */
export function decode(x: Float): Rational | null {
  const kind = classify(x);
  if (kind === "infinity" || kind === "nan") return null;
  const F = x.format.fractionBits;
  const magnitude =
    kind === "normal"
      ? mul(rational((1n << BigInt(F)) + x.fraction), pow2(x.exponent - bias(x.format) - F))
      : mul(rational(x.fraction), pow2(1 - bias(x.format) - F));
  return x.sign === 1 ? neg(magnitude) : magnitude;
}

const special = (format: FloatFormat, kind: "infinity" | "nan", sign: 0 | 1): Float => ({
  format,
  sign,
  exponent: maxField(format),
  // A quiet NaN: the top fraction bit set.
  fraction: kind === "nan" ? 1n << BigInt(format.fractionBits - 1) : 0n,
});

/**
 * The float nearest to `x`, ties to even — IEEE 754's default rounding.
 *
 * Found by scaling `x` so that its significand is an integer-plus-remainder
 * with exactly F fraction bits to the left of the point, then rounding that
 * remainder with an exact comparison against one half. Below the smallest
 * normal exponent the scale stops moving and the significand simply loses
 * bits: that is gradual underflow, and those are the subnormals. A carry out
 * of the top bit moves the exponent up one; past the largest exponent the
 * answer is infinity, which is where round-to-nearest sends anything at or
 * beyond the largest finite value plus half a step.
 */
export function round(x: Parsed | Rational, format: FloatFormat): Float {
  const parsed: Parsed = "kind" in x ? x : { kind: "finite", value: x, negative: x.num < 0n };
  if (parsed.kind === "nan") return special(format, "nan", 0);
  if (parsed.kind === "infinity") return special(format, "infinity", parsed.negative ? 1 : 0);

  const value = parsed.value;
  const sign: 0 | 1 = value.num < 0n || (value.num === 0n && parsed.negative) ? 1 : 0;
  if (value.num === 0n) return { format, sign, exponent: 0, fraction: 0n };

  const F = format.fractionBits;
  const b = bias(format);
  const emin = 1 - b;
  const emax = b;
  const magnitude = absR(value);

  let e = Math.max(floorLog2(magnitude), emin);
  const scaled = mul(magnitude, pow2(F - e));
  let q = scaled.num / scaled.den;
  const remainder = scaled.num - q * scaled.den; // 0 ≤ remainder < den
  const twice = 2n * remainder;
  if (twice > scaled.den || (twice === scaled.den && (q & 1n) === 1n)) q += 1n;

  const hidden = 1n << BigInt(F);
  if (q === hidden << 1n) {
    q = hidden;
    e += 1;
  }
  if (e > emax) return special(format, "infinity", sign);
  if (q < hidden) return { format, sign, exponent: 0, fraction: q }; // subnormal or zero
  return { format, sign, exponent: e + b, fraction: q - hidden };
}

// ------------------------------------------------------------------- bits ---

/** Every bit, most significant first: sign, then exponent, then fraction. */
export function toBits(x: Float): (0 | 1)[] {
  const { exponentBits: E, fractionBits: F } = x.format;
  const bits: (0 | 1)[] = [x.sign];
  for (let i = E - 1; i >= 0; i--) bits.push(((x.exponent >> i) & 1) as 0 | 1);
  for (let i = F - 1; i >= 0; i--) bits.push(((x.fraction >> BigInt(i)) & 1n) === 1n ? 1 : 0);
  return bits;
}

export function fromBits(bits: readonly (0 | 1)[], format: FloatFormat): Float {
  const { exponentBits: E, fractionBits: F } = format;
  if (bits.length !== 1 + E + F) throw new RangeError(`Expected ${1 + E + F} bits.`);
  let exponent = 0;
  for (let i = 1; i <= E; i++) exponent = exponent * 2 + (bits[i] as number);
  let fraction = 0n;
  for (let i = 1 + E; i < bits.length; i++) fraction = fraction * 2n + BigInt(bits[i] as number);
  return { format, sign: bits[0] as 0 | 1, exponent, fraction };
}

/** The fields as one unsigned integer, the way the bits sit in memory. */
const code = (x: Float): bigint =>
  (BigInt(x.exponent) << BigInt(x.format.fractionBits)) | x.fraction;

const fromCode = (format: FloatFormat, sign: 0 | 1, c: bigint): Float => ({
  format,
  sign,
  exponent: Number(c >> BigInt(format.fractionBits)),
  fraction: c & ((1n << BigInt(format.fractionBits)) - 1n),
});

/**
 * The next representable value toward +∞.
 *
 * Because the encoding is ordered, this is "add one to the bits" for a
 * positive number and "subtract one" for a negative one — which is exactly why
 * IEEE 754 put the exponent above the fraction.
 */
export function nextUp(x: Float): Float {
  const kind = classify(x);
  if (kind === "nan") return x;
  if (kind === "infinity") return x.sign === 0 ? x : fromCode(x.format, 1, code(x) - 1n);
  if (kind === "zero") return { format: x.format, sign: 0, exponent: 0, fraction: 1n };
  return x.sign === 0 ? fromCode(x.format, 0, code(x) + 1n) : fromCode(x.format, 1, code(x) - 1n);
}

export function nextDown(x: Float): Float {
  const flipped = nextUp({ ...x, sign: x.sign === 0 ? 1 : 0 });
  return { ...flipped, sign: flipped.sign === 0 ? 1 : 0 };
}

/**
 * The gap from `x` up to the next representable value — one "unit in the last
 * place". Null at the top of the range, where the next value up is infinity.
 */
export function gapAbove(x: Float): Rational | null {
  const here = decode(x);
  const above = decode(nextUp(x));
  return here === null || above === null ? null : sub(above, here);
}

/**
 * How many representable steps apart two finite floats are — 1 for
 * neighbours, 0 for the same value. The encoding is ordered, so within one
 * sign this is the distance between the bit patterns; across zero it is the
 * two distances to zero, with +0 and −0 counted as the one value they equal.
 */
export function stepsBetween(a: Float, b: Float): bigint {
  const ca = code(a);
  const cb = code(b);
  if (a.sign === b.sign) return ca > cb ? ca - cb : cb - ca;
  return ca + cb;
}

// ------------------------------------------------------------- arithmetic ---

/**
 * IEEE 754 addition: the exact sum, rounded once.
 *
 * That is the whole definition — the standard requires every basic operation
 * to behave as if computed to infinite precision and then rounded — so the
 * only work here is the edge cases. Infinity minus infinity is NaN. An exact
 * zero from opposite signs is +0; two negative zeros make −0.
 */
export function addFloats(a: Float, b: Float): Float {
  const format = a.format;
  const ka = classify(a);
  const kb = classify(b);
  if (ka === "nan" || kb === "nan") return special(format, "nan", 0);
  if (ka === "infinity" && kb === "infinity") {
    return a.sign === b.sign ? a : special(format, "nan", 0);
  }
  if (ka === "infinity") return a;
  if (kb === "infinity") return b;

  const sum = add(decode(a) as Rational, decode(b) as Rational);
  if (sum.num === 0n) {
    const sign: 0 | 1 = a.sign === 1 && b.sign === 1 ? 1 : 0;
    return { format, sign, exponent: 0, fraction: 0n };
  }
  return round(sum, format);
}

export const sameFloat = (a: Float, b: Float): boolean =>
  a.sign === b.sign && a.exponent === b.exponent && a.fraction === b.fraction;

/** Numeric equality as `==` means it: NaN equals nothing, +0 equals −0. */
export function floatsEqual(a: Float, b: Float): boolean {
  if (classify(a) === "nan" || classify(b) === "nan") return false;
  if (classify(a) === "zero" && classify(b) === "zero") return true;
  return sameFloat(a, b);
}

// ----------------------------------------------------------------- ranges ---

export const largestFinite = (format: FloatFormat): Rational =>
  decode({
    format,
    sign: 0,
    exponent: maxField(format) - 1,
    fraction: (1n << BigInt(format.fractionBits)) - 1n,
  }) as Rational;

export const smallestNormal = (format: FloatFormat): Rational => pow2(1 - bias(format));

export const smallestSubnormal = (format: FloatFormat): Rational =>
  pow2(1 - bias(format) - format.fractionBits);

/**
 * Every finite value with the sign bit clear, smallest first. Only for the toy
 * formats: float32 alone would be two billion of them.
 */
export function allNonNegative(format: FloatFormat): Float[] {
  const count = BigInt(maxField(format)) << BigInt(format.fractionBits);
  if (count > 4096n) throw new RangeError("Too many values to list.");
  const out: Float[] = [];
  for (let c = 0n; c < count; c++) out.push(fromCode(format, 0, c));
  return out;
}

// --------------------------------------------------------------- printing ---

/**
 * The exact decimal expansion of a rational whose denominator has no prime
 * factor but 2 and 5 — which is every finite binary float. Null otherwise
 * (1/3 has no finite expansion).
 */
export function exactDecimal(x: Rational): string | null {
  let den = x.den;
  let twos = 0;
  let fives = 0;
  while (den % 2n === 0n) {
    den /= 2n;
    twos++;
  }
  while (den % 5n === 0n) {
    den /= 5n;
    fives++;
  }
  if (den !== 1n) return null;
  const places = Math.max(twos, fives);
  const scaled = (abs(x.num) * 10n ** BigInt(places)) / x.den;
  let digits = scaled.toString();
  if (places > 0) {
    digits = digits.padStart(places + 1, "0");
    const point = digits.length - places;
    digits = `${digits.slice(0, point)}.${digits.slice(point)}`.replace(/\.?0+$/, "");
  }
  return `${x.num < 0n ? "-" : ""}${digits}`;
}

/**
 * The decimal digits of `x` to `places` places after the point, rounded half
 * to even — for showing a value that has no finite expansion, like 1/3.
 */
export function decimalTo(x: Rational, places: number): string {
  const scale = 10n ** BigInt(places);
  const scaled = mul(absR(x), rational(scale));
  let q = scaled.num / scaled.den;
  const twice = 2n * (scaled.num - q * scaled.den);
  if (twice > scaled.den || (twice === scaled.den && (q & 1n) === 1n)) q += 1n;
  let digits = q.toString().padStart(places + 1, "0");
  if (places > 0) digits = `${digits.slice(0, -places)}.${digits.slice(-places)}`;
  return `${x.num < 0n ? "-" : ""}${digits}`;
}

/** 10^k exactly, for any integer k. */
const pow10 = (k: number): Rational =>
  k >= 0 ? rational(10n ** BigInt(k)) : rational(1n, 10n ** BigInt(-k));

/**
 * floor(log10(x)) for x > 0, exactly: estimated from the binary logarithm,
 * then corrected against exact powers of ten. Never taken from a rounded
 * mantissa, where 9.6 would round to 1 × 10^1 and report the wrong decade.
 */
export function floorLog10(x: Rational): number {
  const magnitude = absR(x);
  let e = Math.floor(floorLog2(magnitude) * Math.log10(2));
  while (compare(magnitude, pow10(e)) < 0) e--;
  while (compare(magnitude, pow10(e + 1)) >= 0) e++;
  return e;
}

/**
 * `x` in scientific notation with `significant` digits, exactly rounded:
 * `{ mantissa: "5.55", exponent: -17 }`. Zero is `{ "0", 0 }`.
 */
export function scientific(x: Rational, significant = 3): { mantissa: string; exponent: number } {
  if (x.num === 0n) return { mantissa: "0", exponent: 0 };
  const magnitude = absR(x);
  let exponent = floorLog10(magnitude);
  // Rounding can carry into a new digit: 9.996 at three digits is 1.00 × 10^1.
  let digits = decimalTo(div(magnitude, pow10(exponent)), significant - 1);
  if (digits.startsWith("10")) {
    exponent += 1;
    digits = decimalTo(div(magnitude, pow10(exponent)), significant - 1);
  }
  return { mantissa: `${x.num < 0n ? "-" : ""}${digits}`, exponent };
}

/**
 * The shortest decimal that reads back as `x` in its own format — what
 * `String(n)` prints for a float64, generalised to every format here.
 *
 * This follows ECMA-262's `Number::toString` (15th edition, step 5): the
 * fewest significant digits k such that the decimal converts back to the same
 * number, and if more than one k-digit decimal does, the one closest to the
 * exact value — the even one on a tie. At each k the only candidates are the
 * k-digit decimals immediately below and above the exact value, so the search
 * is exact by construction rather than by trusting a printer.
 */
export function shortest(x: Float): string {
  const kind = classify(x);
  if (kind === "nan") return "NaN";
  if (kind === "infinity") return x.sign === 1 ? "-Infinity" : "Infinity";
  if (kind === "zero") return "0"; // ECMA-262 prints −0 as "0" too.

  const value = decode(x) as Rational;
  const magnitude = absR(value);
  const positive: Float = { ...x, sign: 0 };
  const decade = floorLog10(magnitude);

  for (let k = 1; k <= 40; k++) {
    const scale = pow10(k - 1 - decade);
    const scaled = mul(magnitude, scale);
    const low = scaled.num / scaled.den;
    const valid = [low, low + 1n].filter(
      (digits) => digits > 0n && sameFloat(round(div(rational(digits), scale), x.format), positive),
    );
    if (valid.length === 0) continue;
    let pick = valid[0] as bigint;
    if (valid.length === 2) {
      // Closest to the exact value; on an exact tie, the even digit string.
      const dLow = sub(scaled, rational(low));
      const dHigh = sub(rational(low + 1n), scaled);
      const c = compare(dLow, dHigh);
      pick = c < 0 ? low : c > 0 ? low + 1n : low % 2n === 0n ? low : low + 1n;
    }
    return (value.num < 0n ? "-" : "") + jsStyle(pick, decade - k + 1);
  }
  return (value.num < 0n ? "-" : "") + (exactDecimal(magnitude) ?? "?");
}

/**
 * `digits × 10^power` laid out the way ECMA-262 lays
 * out a Number: positional while the decimal exponent stays between −7 and
 * 21, e-notation beyond. Same thresholds, so a float64 prints exactly as
 * JavaScript would print it.
 */
function jsStyle(digits: bigint, power: number): string {
  let s = digits.toString();
  // Trailing zeros carry no information; drop them into the exponent.
  while (s.length > 1 && s.endsWith("0")) {
    s = s.slice(0, -1);
    power += 1;
  }
  const k = s.length;
  const n = power + k; // position of the decimal point, as ECMA-262 counts it
  if (k <= n && n <= 21) return s + "0".repeat(n - k);
  if (0 < n && n <= 21) return `${s.slice(0, n)}.${s.slice(n)}`;
  if (-6 < n && n <= 0) return `0.${"0".repeat(-n)}${s}`;
  const e = n - 1;
  const sign = e < 0 ? "-" : "+";
  return k === 1 ? `${s}e${sign}${Math.abs(e)}` : `${s[0]}.${s.slice(1)}e${sign}${Math.abs(e)}`;
}

// ------------------------------------------------------- native bridges ---

/** The float64 bits of a JavaScript number, read straight out of memory. */
export function fromDouble(n: number): Float {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, n);
  const hi = view.getUint32(0);
  const lo = view.getUint32(4);
  return {
    format: FORMATS.float64,
    sign: (hi >>> 31) as 0 | 1,
    exponent: (hi >>> 20) & 0x7ff,
    fraction: (BigInt(hi & 0xfffff) << 32n) | BigInt(lo),
  };
}

/** A float64 as the JavaScript number it is, bit for bit. */
export function toDouble(x: Float): number {
  if (x.format.exponentBits !== 11 || x.format.fractionBits !== 52) {
    throw new RangeError("toDouble takes a float64.");
  }
  const view = new DataView(new ArrayBuffer(8));
  view.setUint32(0, ((x.sign << 31) | (x.exponent << 20) | Number(x.fraction >> 32n)) >>> 0);
  view.setUint32(4, Number(x.fraction & 0xffffffffn));
  return view.getFloat64(0);
}
