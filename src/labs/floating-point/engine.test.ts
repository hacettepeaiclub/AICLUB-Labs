import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  FORMATS,
  addFloats,
  allNonNegative,
  classify,
  decode,
  equal,
  exactDecimal,
  floatsEqual,
  fromBits,
  fromDouble,
  gapAbove,
  largestFinite,
  nextDown,
  nextUp,
  parseNumber,
  pow2,
  rational,
  round,
  sameFloat,
  scientific,
  shortest,
  smallestNormal,
  smallestSubnormal,
  stepsBetween,
  toBits,
  toDouble,
  toyFormat,
  type Float,
  type Parsed,
} from "./engine";

/**
 * The lab's arithmetic is held to independent references.
 *
 * Every value the lab shows comes from `engine.ts`, which never touches a
 * floating-point number. That is only worth something if its answers are the
 * right ones, so each format is checked against a second implementation that
 * shares no code with it:
 *
 * - float64 against the browser engine itself: `parseFloat`, which ECMA-262
 *   requires to round correctly, and `String(n)`, which it requires to print
 *   the shortest round-tripping decimal.
 * - float32 against `Math.fround`.
 * - bfloat16 and float16 against the classic bit-twiddling conversions from a
 *   float32, written below from their definitions. float16 was additionally
 *   checked against V8's own `Math.f16round` (`node --js-float16array`) when
 *   this file was written; the comparison runs here whenever that function
 *   exists.
 *
 * Inputs are seeded, so a failure names a case that can be reproduced.
 */

const rng = createRng(754);

const parse = (s: string): Parsed => {
  const parsed = parseNumber(s);
  if (!parsed) throw new Error(`unparseable: ${s}`);
  return parsed;
};

/** A double drawn from its bits, so every exponent is as likely as any other. */
function randomDouble(): number {
  const view = new DataView(new ArrayBuffer(8));
  view.setUint32(0, Math.floor(rng() * 2 ** 32));
  view.setUint32(4, Math.floor(rng() * 2 ** 32));
  return view.getFloat64(0);
}

/** A double near the float32 / float16 ranges, including their edges. */
function randomNear(minExp: number, maxExp: number): number {
  const e = minExp + Math.floor(rng() * (maxExp - minExp + 1));
  return (rng() < 0.5 ? -1 : 1) * (1 + rng()) * 2 ** e;
}

const f32Bits = (x: number): number => {
  const view = new DataView(new ArrayBuffer(4));
  view.setFloat32(0, x);
  return view.getUint32(0);
};

const bitsAsCode = (x: Float): number =>
  toBits(x).reduce<number>((acc, bit) => acc * 2 + bit, 0);

// ---------------------------------------------------------------------------

describe("parsing what people type", () => {
  it("reads decimals exactly, not as the nearest double", () => {
    const tenth = parse("0.1");
    expect(tenth.kind === "finite" && equal(tenth.value, rational(1n, 10n))).toBe(true);
  });

  it("accepts a decimal comma, because that is how a tenth is written in Turkish", () => {
    const comma = parse("0,1");
    expect(comma.kind === "finite" && equal(comma.value, rational(1n, 10n))).toBe(true);
  });

  it("reads fractions, signs, exponents and the special values", () => {
    const third = parse("1/3");
    expect(third.kind === "finite" && equal(third.value, rational(1n, 3n))).toBe(true);
    const small = parse("-2.5e-3");
    expect(small.kind === "finite" && equal(small.value, rational(-1n, 400n))).toBe(true);
    expect(parse("-0")).toMatchObject({ kind: "finite", negative: true });
    expect(parse("Infinity")).toEqual({ kind: "infinity", negative: false });
    expect(parse("-inf")).toEqual({ kind: "infinity", negative: true });
    expect(parse("NaN")).toEqual({ kind: "nan" });
  });

  it("rejects what is not a number", () => {
    for (const s of ["", "abc", ".", "1..2", "1/0", "1e", "0x10"]) expect(parseNumber(s), s).toBeNull();
  });

  it("judges size by the value, not by the exponent alone", () => {
    expect(parse("1e5000")).toEqual({ kind: "infinity", negative: false });
    const tiny = parse("1e-5000");
    expect(tiny.kind === "finite" && tiny.value.num === 0n).toBe(true);
    const one = parse(`1${"0".repeat(1500)}e-1500`);
    expect(one.kind === "finite" && equal(one.value, rational(1n))).toBe(true);
  });
});

describe("float64 agrees with the browser, value for value", () => {
  it("rounds decimal strings exactly as parseFloat does", () => {
    // At most 17 significant digits: ECMA-262 requires correct rounding there.
    for (let i = 0; i < 3000; i++) {
      const digits = String(1 + Math.floor(rng() * 9)) + String(Math.floor(rng() * 1e15)).padStart(15, "0");
      const exp = Math.floor(rng() * 640) - 340;
      const s = `${rng() < 0.5 ? "-" : ""}${digits.slice(0, 1 + Math.floor(rng() * 16))}e${exp}`;
      const ours = round(parse(s), FORMATS.float64);
      expect({ s, same: sameFloat(ours, fromDouble(parseFloat(s))) }).toEqual({ s, same: true });
    }
  });

  it("decodes every double to itself, exactly", () => {
    for (let i = 0; i < 3000; i++) {
      const d = randomDouble();
      if (Number.isNaN(d)) continue;
      const bits = fromDouble(d);
      const value = decode(bits);
      if (value === null) continue;
      expect(sameFloat(round(value, FORMATS.float64), bits)).toBe(true);
      expect(Object.is(toDouble(bits), d)).toBe(true);
    }
  });

  it("prints the shortest round-tripping decimal, exactly as String(n) does", () => {
    // Fewer than the others: each one is a search over exact rationals as
    // large as 10^308. Run at 3,000 when this was written; all agreed.
    for (let i = 0; i < 400; i++) {
      const d = randomDouble();
      if (!Number.isFinite(d) || Object.is(d, -0)) continue;
      expect({ d, s: shortest(fromDouble(d)) }).toEqual({ d, s: String(d) });
    }
    for (const d of [0.1, 0.30000000000000004, 1e21, 1e-7, 123456789.123, 5e-324, 1.7976931348623157e308]) {
      expect(shortest(fromDouble(d))).toBe(String(d));
    }
  });
});

describe("float32 agrees with Math.fround", () => {
  it("rounds every double to the same float32", () => {
    for (let i = 0; i < 5000; i++) {
      // Across the whole float32 range and past both of its ends.
      const d = randomNear(-160, 135);
      const ours = round(decode(fromDouble(d)) ?? rational(0n), FORMATS.float32);
      const theirs = Math.fround(d);
      if (!Number.isFinite(theirs)) {
        expect({ d, kind: classify(ours) }).toEqual({ d, kind: "infinity" });
        continue;
      }
      expect({ d, code: bitsAsCode(ours) >>> 0 }).toEqual({ d, code: f32Bits(theirs) });
    }
  });
});

describe("bfloat16 agrees with the bit-level definition", () => {
  /** float32 → bfloat16, round to nearest even, on the bits (not NaN). */
  const reference = (u: number): number => (u + 0x7fff + ((u >>> 16) & 1)) >>> 16;

  it("rounds every float32 to the same bfloat16", () => {
    for (let i = 0; i < 5000; i++) {
      const u = Math.floor(rng() * 2 ** 32) >>> 0;
      if (((u >>> 23) & 0xff) === 0xff) continue; // infinities and NaNs
      const view = new DataView(new ArrayBuffer(4));
      view.setUint32(0, u);
      const exact = decode(fromDouble(view.getFloat32(0))) as NonNullable<ReturnType<typeof decode>>;
      const ours = round(exact.num === 0n ? parse(u >>> 31 ? "-0" : "0") : exact, FORMATS.bfloat16);
      expect({ u, code: bitsAsCode(ours) }).toEqual({ u, code: reference(u) });
    }
  });
});

describe("float16 agrees with an independent conversion", () => {
  /**
   * float32 → float16, round to nearest even, written from the format's
   * definition: rebias the exponent, then round the dropped fraction bits;
   * below the normal range, shift in the hidden bit and round again; past
   * the top, infinity.
   */
  function reference(u: number): number {
    const sign = (u >>> 16) & 0x8000;
    const exp = (u >>> 23) & 0xff;
    let mant = u & 0x7fffff;
    const e = exp - 127 + 15;
    if (exp === 0 && mant === 0) return sign;
    if (e >= 31) return sign | 0x7c00;
    if (e <= 0) {
      if (e < -10) return sign; // below half the smallest subnormal
      mant = mant | 0x800000; // the hidden bit, now visible
      const shift = 14 - e;
      const half = 1 << (shift - 1);
      const kept = mant >>> shift;
      const dropped = mant & ((1 << shift) - 1);
      const up = dropped > half || (dropped === half && (kept & 1) === 1) ? 1 : 0;
      return sign | (kept + up);
    }
    const kept = mant >>> 13;
    const dropped = mant & 0x1fff;
    const up = dropped > 0x1000 || (dropped === 0x1000 && (kept & 1) === 1) ? 1 : 0;
    let code = (e << 10) | kept;
    code += up; // a carry out of the fraction lands in the exponent, by design
    if (code >= 0x7c00) return sign | 0x7c00;
    return sign | code;
  }

  it("rounds every float32 to the same float16", () => {
    for (let i = 0; i < 5000; i++) {
      const d = Math.fround(randomNear(-28, 18));
      const u = f32Bits(d);
      const ours = round(decode(fromDouble(d)) as NonNullable<ReturnType<typeof decode>>, FORMATS.float16);
      expect({ d, code: bitsAsCode(ours) }).toEqual({ d, code: reference(u) });
    }
  });

  it("matches Math.f16round wherever the runtime has it", () => {
    const f16round = (Math as unknown as { f16round?: (x: number) => number }).f16round;
    if (typeof f16round !== "function") return;
    for (let i = 0; i < 5000; i++) {
      const d = randomNear(-28, 18);
      const ours = round(decode(fromDouble(d)) as NonNullable<ReturnType<typeof decode>>, FORMATS.float16);
      const theirs = f16round(d);
      const value = decode(ours);
      if (value === null) expect(Number.isFinite(theirs)).toBe(false);
      else expect(equal(value, decode(fromDouble(theirs)) as NonNullable<typeof value>)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------

describe("the facts the lab states", () => {
  it("stores 0.1 as exactly this, in float64 and in float32", () => {
    expect(exactDecimal(decode(round(parse("0.1"), FORMATS.float64))!)).toBe(
      "0.1000000000000000055511151231257827021181583404541015625",
    );
    expect(exactDecimal(decode(round(parse("0.1"), FORMATS.float32))!)).toBe(
      "0.100000001490116119384765625",
    );
  });

  it("makes 0.1 + 0.2 the float64 one step above where 0.3 lands", () => {
    const sum = addFloats(round(parse("0.1"), FORMATS.float64), round(parse("0.2"), FORMATS.float64));
    const three = round(parse("0.3"), FORMATS.float64);
    expect(sameFloat(sum, fromDouble(0.1 + 0.2))).toBe(true);
    expect(shortest(sum)).toBe("0.30000000000000004");
    expect(floatsEqual(sum, three)).toBe(false);
    expect(sameFloat(sum, nextUp(three))).toBe(true);
    expect(exactDecimal(decode(sum)!)).toBe("0.3000000000000000444089209850062616169452667236328125");
    expect(exactDecimal(decode(three)!)).toBe("0.299999999999999988897769753748434595763683319091796875");
    // The step between them is 2^-54, and they are exactly one step apart.
    expect(equal(gapAbove(three)!, pow2(-54))).toBe(true);
    expect(stepsBetween(sum, three)).toBe(1n);
    expect(stepsBetween(three, three)).toBe(0n);
  });

  it("loses + 1 in float32 from 16,777,216 = 2^24, and not before", () => {
    const one = round(parse("1"), FORMATS.float32);
    const plusOne = (s: string) => {
      const x = round(parse(s), FORMATS.float32);
      return floatsEqual(addFloats(x, one), x);
    };
    expect(plusOne("16777215")).toBe(false);
    expect(plusOne("16777216")).toBe(true);
    // 2^24 + 1 is not representable and rounds to the even neighbour, 2^24.
    expect(exactDecimal(decode(round(parse("16777217"), FORMATS.float32))!)).toBe("16777216");
  });

  it("knows the edges of every format", () => {
    expect(exactDecimal(largestFinite(FORMATS.float16))).toBe("65504");
    expect(equal(smallestNormal(FORMATS.float16), pow2(-14))).toBe(true);
    expect(equal(smallestSubnormal(FORMATS.float16), pow2(-24))).toBe(true);
    // Half a step above the largest float16 is a tie, and the even way is up.
    expect(exactDecimal(decode(round(parse("65519"), FORMATS.float16))!)).toBe("65504");
    expect(classify(round(parse("65520"), FORMATS.float16))).toBe("infinity");
    expect(String(toDouble(round(largestFinite(FORMATS.float32), FORMATS.float64)))).toBe("3.4028234663852886e+38");
    expect(String(toDouble(round(largestFinite(FORMATS.bfloat16), FORMATS.float64)))).toBe("3.3895313892515355e+38");
  });

  it("stores a decimal exactly only when it is a whole number over a power of two", () => {
    const exact = (s: string) => {
      const p = parse(s);
      const v = decode(round(p, FORMATS.float32));
      return p.kind === "finite" && v !== null && equal(v, p.value);
    };
    for (const s of ["0.5", "0.25", "0.375", "0.875", "0.125"]) expect(exact(s), s).toBe(true);
    for (const s of ["0.1", "0.2", "0.3", "0.6", "0.333"]) expect(exact(s), s).toBe(false);
  });

  it("breaks associativity, which the challenge asks the visitor to find", () => {
    const f = (s: string) => round(parse(s), FORMATS.float64);
    const [a, b, c] = [f("1e16"), f("-1e16"), f("1")];
    const left = addFloats(addFloats(a, b), c);
    const right = addFloats(a, addFloats(b, c));
    expect(shortest(left)).toBe("1");
    expect(shortest(right)).toBe("0");
  });
});

describe("the encoding", () => {
  it("round-trips every bit pattern of a toy format", () => {
    const toy = toyFormat(3, 4);
    for (let code = 0; code < 256; code++) {
      const bits = Array.from({ length: 8 }, (_, i) => ((code >> (7 - i)) & 1) as 0 | 1);
      expect(toBits(fromBits(bits, toy))).toEqual(bits);
    }
  });

  it("lists a toy format's values in order, the same count in every binade", () => {
    const toy = toyFormat(3, 4);
    const values = allNonNegative(toy).map((x) => decode(x)!);
    expect(values).toHaveLength(7 * 16);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]!.num * values[i - 1]!.den > values[i - 1]!.num * values[i]!.den).toBe(true);
    }
    // [1, 2) holds exactly 2^F = 16 of them.
    const inOneToTwo = values.filter((v) => v.num >= v.den && v.num < 2n * v.den);
    expect(inOneToTwo).toHaveLength(16);
  });

  it("steps to the neighbours across zero, subnormals and infinity", () => {
    const f = FORMATS.float16;
    const zero = round(parse("0"), f);
    expect(equal(decode(nextUp(zero))!, smallestSubnormal(f))).toBe(true);
    expect(equal(decode(nextDown(zero))!, rational(-1n, 1n << 24n))).toBe(true);
    const top = round(largestFinite(f), f);
    expect(classify(nextUp(top))).toBe("infinity");
    expect(exactDecimal(decode(nextDown(round(parse("Infinity"), f)))!)).toBe("65504");
  });

  it("counts steps across zero as the values between, with ±0 as one", () => {
    const f = FORMATS.float16;
    const up = nextUp(round(parse("0"), f));
    const down = nextDown(round(parse("0"), f));
    expect(stepsBetween(up, down)).toBe(2n);
    expect(stepsBetween(round(parse("-0"), f), round(parse("0"), f))).toBe(0n);
  });

  it("follows IEEE 754 at the special values", () => {
    const f = FORMATS.float32;
    const inf = round(parse("Infinity"), f);
    const ninf = round(parse("-Infinity"), f);
    expect(classify(addFloats(inf, ninf))).toBe("nan");
    const negZero = round(parse("-0"), f);
    expect(addFloats(negZero, negZero).sign).toBe(1);
    const x = round(parse("3.5"), f);
    const y = round(parse("-3.5"), f);
    expect(addFloats(x, y).sign).toBe(0); // an exact zero from opposite signs is +0
  });
});

describe("printing", () => {
  it("writes a value in scientific notation without rounding it twice", () => {
    expect(scientific(rational(1n, 18014398509481984n), 3)).toEqual({ mantissa: "5.55", exponent: -17 });
    expect(scientific(rational(9996n, 1000n), 3)).toEqual({ mantissa: "1.00", exponent: 1 });
  });

  it("finds float32's own shortest decimal, which is shorter than float64's", () => {
    expect(shortest(round(parse("0.1"), FORMATS.float32))).toBe("0.1");
    expect(shortest(round(parse("16777217"), FORMATS.float32))).toBe("16777216");
    expect(shortest(round(parse("1/3"), FORMATS.float16))).toBe("0.3333");
  });

  it("has no finite expansion for a value that has none", () => {
    expect(exactDecimal(rational(1n, 3n))).toBeNull();
  });
});
