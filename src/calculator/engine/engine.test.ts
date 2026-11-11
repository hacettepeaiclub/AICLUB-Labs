import { describe, expect, it } from "vitest";
import { differentiate, integrate, newtonSolve } from "./calculus";
import { solveLinear, solvePolynomial } from "./equations";
import { evaluate, type EvalContext, type Tok } from "./expression";
import { display, initialState, press, pressAll, type CalcState } from "./machine";
import { determinant, inverse, multiply } from "./matrix";
import { formatComplex, formatDecimal, formatFraction, formatNumber, toFraction } from "./numbers";
import {
  binomialCd,
  binomialPd,
  inverseNormal,
  normalBetween,
  normalCdf,
  poissonPd,
  probP,
  probR,
} from "./probability";
import { oneVariable, twoVariable } from "./stats";
import type { KeyId, ModelId } from "./types";

const ctx: EvalContext = {
  angle: "deg",
  ans: 0,
  matrices: {},
  matAns: null,
  vars: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, M: 0, X: 0, Y: 0 },
  stat: () => NaN,
  estimate: () => NaN,
  normalise: () => NaN,
};

/** Type an expression on a model and read the answer as the display shows it. */
function run(keys: KeyId[], start: CalcState | ModelId = "fx991ex"): string {
  const s0 = typeof start === "string" ? initialState(start) : start;
  const body = display(pressAll(s0, [...keys, "eq"])).body;
  if (body.kind === "error") return body.title;
  if (body.kind !== "calc" || body.result?.kind !== "number")
    throw new Error("no number on screen");
  return body.result.text;
}

describe("the display", () => {
  it("shows ten significant digits and hides float noise", () => {
    expect(formatDecimal(0.1 + 0.2)).toBe("0.3");
    expect(formatDecimal(1 / 3)).toBe("0.3333333333");
    expect(formatDecimal(2 / 3)).toBe("0.6666666667");
    expect(formatDecimal(-12)).toBe("−12");
  });

  it("switches to scientific notation outside 10⁻² ≤ |x| < 10¹⁰", () => {
    expect(formatDecimal(0.0015)).toBe("1.5×10⁻³");
    expect(formatDecimal(12345678901)).toBe("1.23456789×10¹⁰");
    expect(formatDecimal(9999999999)).toBe("9999999999");
    expect(formatDecimal(0.01)).toBe("0.01");
  });

  it("recognises fractions, and only fractions that fit", () => {
    expect(toFraction(1 / 3)).toEqual({ n: 1, d: 3 });
    expect(toFraction(-0.75)).toEqual({ n: -3, d: 4 });
    expect(toFraction(0.1 + 0.2)).toEqual({ n: 3, d: 10 });
    expect(toFraction(Math.SQRT2)).toBeNull();
    expect(toFraction(Math.PI)).toBeNull();
    expect(toFraction(5)).toBeNull();
    expect(formatNumber(20 / 3)).toBe("20⁄3");
    expect(formatNumber(20 / 3, true)).toBe("6.666666667");
  });

  it("writes MS fractions with ┘, mixed when larger than one", () => {
    expect(formatFraction({ n: 5, d: 6 }, "ms")).toBe("5┘6");
    expect(formatFraction({ n: 7, d: 6 }, "ms")).toBe("1┘1┘6");
    expect(formatFraction({ n: -7, d: 2 }, "ms")).toBe("−3┘1┘2");
  });

  it("writes complex roots as a ± bi", () => {
    expect(formatComplex(1, 2)).toBe("1+2i");
    expect(formatComplex(0.25, -0.75)).toBe("1⁄4−3⁄4i");
    expect(formatComplex(0, 1)).toBe("i");
    expect(formatComplex(3, 0)).toBe("3");
  });
});

describe("the order of operations is Casio's", () => {
  const n = (v: string): Tok => ({ t: "num", v });
  const op = (v: "+" | "-" | "*" | "/"): Tok => ({ t: "op", v });

  it("multiplies before it adds", () => {
    expect(evaluate([n("2"), op("+"), n("3"), op("*"), n("4")], ctx)).toBe(14);
  });

  it("squares before it negates", () => {
    expect(evaluate([{ t: "neg" }, n("3"), { t: "post", v: "sq" }], ctx)).toBe(-9);
    expect(
      evaluate([{ t: "lp" }, { t: "neg" }, n("3"), { t: "rp" }, { t: "post", v: "sq" }], ctx),
    ).toBe(9);
  });

  it("puts implied multiplication before × and ÷", () => {
    // 6 ÷ 2(1 + 2) = 6 ÷ 6, as Casio's priority table says.
    const toks: Tok[] = [
      n("6"),
      op("/"),
      n("2"),
      { t: "lp" },
      n("1"),
      op("+"),
      n("2"),
      { t: "rp" },
    ];
    expect(evaluate(toks, ctx)).toBe(1);
  });

  it("closes brackets left open at the end", () => {
    expect(evaluate([{ t: "fn", v: "sqrt" }, n("1"), n("6")], ctx)).toBe(4);
  });

  it("reads ×10ⁿ as part of the number", () => {
    expect(evaluate([n("2"), { t: "e10" }, n("3")], ctx)).toBe(2000);
    expect(evaluate([n("5"), { t: "e10" }, { t: "neg" }, n("1")], ctx)).toBe(0.5);
  });

  it("reads variables", () => {
    const withA = { ...ctx, vars: { ...ctx.vars, A: 8 } };
    expect(evaluate([{ t: "var", v: "A" }, op("*"), n("2")], withA)).toBe(16);
    expect(evaluate([n("3"), { t: "var", v: "A" }], withA)).toBe(24);
  });
});

describe("the keys", () => {
  it("does the sums a student types", () => {
    expect(run(["2", "plus", "3", "times", "4"])).toBe("14");
    expect(run(["1", "divide", "3"])).toBe("1⁄3");
    expect(run(["sin", "3", "0"])).toBe("1⁄2");
    expect(run(["sqrt", "2"])).toBe("1.414213562");
    expect(run(["shift", "exp10"])).toBe("3.141592654");
    expect(run(["5", "shift", "inv"])).toBe("120");
    expect(run(["5", "shift", "divide", "2"])).toBe("10");
    expect(run(["2", "pow", "1", "0"])).toBe("1024");
    expect(run(["1", "frac", "2", "plus", "1", "frac", "3"])).toBe("5⁄6");
  });

  it("answers in the angle unit it is set to", () => {
    const radians = pressAll(initialState("fx991ex"), ["shift", "menu", "2", "2"]);
    expect(radians.angle).toBe("rad");
    expect(display(radians).angle).toBe("R");
    expect(run(["sin", "3", "0"], radians)).toBe("−0.9880316241");
    expect(pressAll(initialState("fx991esplus"), ["shift", "mode", "4"]).angle).toBe("rad");
    expect(pressAll(initialState("fx570ms"), ["mode", "mode", "mode", "mode", "2"]).angle).toBe(
      "rad",
    );
  });

  it("reports the errors the device reports", () => {
    expect(run(["1", "divide", "0"])).toBe("Math ERROR");
    expect(run(["sqrt", "neg", "1"])).toBe("Math ERROR");
    expect(run(["2", "plus", "times", "3"])).toBe("Syntax ERROR");
    expect(run(["tan", "9", "0"])).toBe("Math ERROR");
    expect(run(["1", "rp"])).toBe("Syntax ERROR");
  });

  it("continues from the last answer when an operator comes first", () => {
    const s = pressAll(initialState("fx991ex"), ["6", "eq", "times", "7"]);
    expect(display(s).body).toMatchObject({ kind: "calc", input: ["Ans", "×", "7"] });
    expect(run(["times", "7"], pressAll(initialState("fx991ex"), ["6", "eq"]))).toBe("42");
  });

  it("starts a new line when a number comes first", () => {
    const s = pressAll(initialState("fx991ex"), ["6", "eq", "8"]);
    expect(display(s).body).toMatchObject({ kind: "calc", input: ["8"] });
  });

  it("removes a whole function with one DEL", () => {
    const s = pressAll(initialState("fx991ex"), ["2", "sin", "del"]);
    expect(display(s).body).toMatchObject({ kind: "calc", input: ["2"] });
  });

  it("goes back to editing from an error", () => {
    const s = pressAll(initialState("fx991ex"), ["1", "divide", "0", "eq", "left"]);
    expect(s.screen.s).toBe("calc");
    expect(s.input).toHaveLength(3);
  });

  it("says when a key or menu item is not part of the simulation", () => {
    expect(press(initialState("fx991ex"), "calc").notice).toBe("unsupported");
    const complex = pressAll(initialState("fx991ex"), ["menu", "2"]);
    expect(complex.notice).toBe("unsupported");
    expect(complex.screen.s).toBe("calc");
  });

  it("forgets SHIFT after one key", () => {
    const s = pressAll(initialState("fx991ex"), ["shift", "sin"]);
    expect(s.shift).toBe(false);
    expect(display(s).body).toMatchObject({ input: ["sin⁻¹("] });
  });

  it("answers in decimals on the MS unless a fraction was typed", () => {
    expect(run(["1", "divide", "3"], "fx570ms")).toBe("0.333333333");
    expect(run(["2", "frac", "3", "plus", "1", "frac", "2"], "fx570ms")).toBe("1┘1┘6");
    const toggled = pressAll(initialState("fx570ms"), ["1", "divide", "4", "eq", "frac"]);
    expect(display(toggled).body).toMatchObject({ result: { text: "1┘4" } });
  });

  it("turns the MS MODE menu's pages with MODE", () => {
    const s = pressAll(initialState("fx570ms"), ["mode", "mode", "mode"]);
    expect(display(s).body).toMatchObject({
      kind: "menu",
      items: [{ label: "EQN" }, { label: "MAT" }, { label: "VCT" }],
    });
  });
});

describe("variables", () => {
  it("stores with STO on the EX and SHIFT RCL elsewhere, and recalls with ALPHA", () => {
    for (const [model, sto] of [
      ["fx991ex", ["sto"]],
      ["fx991esplus", ["shift", "rcl"]],
      ["fx570ms", ["shift", "rcl"]],
      ["fx82esplus", ["shift", "rcl"]],
    ] as [ModelId, KeyId[]][]) {
      const s = pressAll(initialState(model), ["7", "eq", ...sto, "neg"]);
      expect(s.vars.A, model).toBe(7);
      expect(display(s).body, model).toMatchObject({ input: ["Ans", "→A"] });
      expect(run(["alpha", "neg", "times", "2"], s), model).toBe("14");
    }
  });

  it("reads a variable back with RCL", () => {
    const s = pressAll(initialState("fx991esplus"), [
      "5",
      "eq",
      "shift",
      "rcl",
      "dms",
      "rcl",
      "dms",
    ]);
    expect(s.vars.B).toBe(5);
    expect(s.result).toBe(5);
  });
});

describe("statistics", () => {
  it("gives both standard deviations and both variances", () => {
    const r = oneVariable([2, 4, 4, 4, 5, 5, 7, 9])!;
    expect(r.mean).toBe(5);
    expect(r.popSd).toBe(2);
    expect(r.popVar).toBe(4);
    expect(r.sampleVar).toBeCloseTo(32 / 7, 12);
    expect(r.sampleSd).toBeCloseTo(2.138089935, 9);
  });

  it("finds quartiles by halves, leaving the median out of both when n is odd", () => {
    const r = oneVariable([1, 2, 3, 4, 5, 6, 7])!;
    expect([r.q1, r.median, r.q3]).toEqual([2, 4, 6]);
    const even = oneVariable([1, 2, 3, 4, 5, 6, 7, 8])!;
    expect([even.q1, even.median, even.q3]).toEqual([2.5, 4.5, 6.5]);
  });

  it("has no sample variance for a single value", () => {
    expect(Number.isNaN(oneVariable([3])!.sampleVar)).toBe(true);
  });

  it("fits the least-squares line", () => {
    // The MS manual's example: temperature against air pressure.
    const t = twoVariable(
      [
        [10, 1003],
        [15, 1005],
        [20, 1010],
        [25, 1011],
        [30, 1014],
      ].map(([x, y]) => ({ x: x!, y: y! })),
    )!;
    expect(t.a).toBeCloseTo(997.4, 10);
    expect(t.b).toBeCloseTo(0.56, 12);
    expect(formatDecimal(t.r)).toBe("0.9826073689");
    // On the MS the leading 0 takes a digit place: the manual shows 0.982607368.
    expect(formatDecimal(t.r, true)).toBe("0.982607368");
  });

  it("lists the EX's thirteen results in the device's order", () => {
    const s = pressAll(initialState("fx991ex"), [
      "menu",
      "6",
      "1",
      "3",
      "eq",
      "5",
      "eq",
      "optn",
      "3",
    ]);
    const body = display(s).body;
    if (body.kind !== "list") throw new Error("expected the results list");
    expect(body.rows.map((row) => row.label)).toEqual([
      "x̄",
      "Σx",
      "Σx²",
      "σ²x",
      "σx",
      "s²x",
      "sx",
      "n",
      "min(x)",
      "Q₁",
      "Med",
      "Q₃",
      "max(x)",
    ]);
    expect(body.rows[0]).toEqual({ label: "x̄", value: "4" });
  });

  it("lets a value in the editor be changed and deleted", () => {
    let s = pressAll(initialState("fx991esplus"), ["mode", "3", "1", "2", "eq", "4", "eq"]);
    s = pressAll(s, ["up", "up", "9", "eq"]);
    expect(s.stat.rows.map((r) => r.x)).toEqual([9, 4]);
    s = pressAll(s, ["up", "del"]);
    expect(s.stat.rows.map((r) => r.x)).toEqual([4]);
  });

  it("empties the data when you leave STAT", () => {
    const s = pressAll(initialState("fx991esplus"), ["mode", "3", "1", "2", "eq", "mode", "1"]);
    expect(s.stat.rows).toEqual([]);
  });

  it("takes data with DT on the MS and counts it", () => {
    const s = pressAll(initialState("fx570ms"), ["mode", "mode", "1", "5", "mplus", "7", "mplus"]);
    expect(s.stat.rows.map((r) => r.x)).toEqual([5, 7]);
    expect(display(s).body).toMatchObject({ kind: "calc", label: "n=", result: { text: "2" } });
    expect(display(s).mode).toBe("SD");
  });

  it("gives the MS manual's normal-distribution example", () => {
    const data = [55, 54, 51, 55, 53, 53, 54, 52].flatMap((v) => [
      ...String(v).split(""),
      "mplus",
    ]) as KeyId[];
    const s = pressAll(initialState("fx570ms"), ["mode", "mode", "1", ...data]);
    expect(run(["5", "3", "shift", "3", "4"], s)).toBe("−0.284747398");
    expect(run(["shift", "3", "1", "neg", "0", "dot", "2", "8", "rp"], s)).toBe("0.38974");
  });
});

describe("probability", () => {
  it("matches the standard normal table", () => {
    expect(normalCdf(0)).toBe(0.5);
    expect(normalCdf(1)).toBeCloseTo(0.8413447460685429, 14);
    expect(normalCdf(-1.96)).toBeCloseTo(0.0249978951482204, 14);
    expect(normalCdf(-6)).toBeCloseTo(9.865876450376946e-10, 20);
    expect(normalBetween(160, 180, 10, 170)).toBeCloseTo(0.6826894921370859, 13);
  });

  it("inverts the normal distribution", () => {
    expect(inverseNormal(0.975, 1, 0)).toBeCloseTo(1.959963984540054, 12);
    // The EX guide's example: the tallest 10% of N(70, 4²) start above 75.1.
    expect(inverseNormal(0.9, 4, 70)).toBeCloseTo(75.12620626, 7);
  });

  it("gives P, Q and R to five decimal places, as the devices do", () => {
    expect(probP(1)).toBe(0.84134);
    expect(probR(1)).toBe(0.15866);
  });

  it("works out binomial and Poisson probabilities", () => {
    expect(binomialPd(2, 5, 0.5)).toBeCloseTo(0.3125, 14);
    // The EX guide's example: at most one six in six rolls.
    expect(binomialCd(1, 6, 1 / 6)).toBeCloseTo(0.7367755, 7);
    expect(poissonPd(2, 3)).toBeCloseTo(0.22404180765538775, 13);
    expect(Number.isNaN(binomialPd(6, 5, 0.5))).toBe(true);
  });

  it("runs the EX Distribution mode", () => {
    const s = pressAll(initialState("fx991ex"), [
      "menu",
      "7",
      "3",
      "0",
      "dot",
      "9",
      "eq",
      "4",
      "eq",
      "7",
      "0",
      "eq",
      "eq",
    ]);
    expect(display(s).body).toMatchObject({ kind: "answer", label: "xInv=", value: "75.12620626" });
  });
});

describe("equations", () => {
  it("solves linear systems and names the ones it cannot", () => {
    expect(
      solveLinear([
        [1, 2, 3],
        [2, 3, 4],
      ]),
    ).toEqual([-1, 2]);
    // The MS manual's three-unknown example.
    expect(
      solveLinear([
        [2, 3, -1, 15],
        [3, -2, 2, 4],
        [5, 3, -4, 9],
      ]),
    ).toEqual([2, 5, 4]);
    expect(
      solveLinear([
        [1, 1, 1],
        [2, 2, 3],
      ]),
    ).toBe("none");
    expect(
      solveLinear([
        [1, 1, 1],
        [2, 2, 2],
      ]),
    ).toBe("infinite");
  });

  it("finds real and complex roots", () => {
    expect(solvePolynomial([2, 1, -3])).toEqual([
      { re: 1, im: 0 },
      { re: -1.5, im: 0 },
    ]);
    // The MS manual's example: 8x² − 4x + 5 = 0 has 0.25 ± 0.75i.
    expect(solvePolynomial([8, -4, 5])).toEqual([
      { re: 0.25, im: 0.75 },
      { re: 0.25, im: -0.75 },
    ]);
    const cubic = solvePolynomial([1, -2, -1, 2])!.map((z) => z.re);
    expect(cubic).toEqual([2, 1, -1]);
    expect(solvePolynomial([0, 1, 1])).toBeNull();
  });

  it("shows No Solution on the EX and an error on the ES PLUS", () => {
    const ex = pressAll(initialState("fx991ex"), [
      "menu",
      "neg",
      "1",
      "2",
      "1",
      "eq",
      "1",
      "eq",
      "1",
      "eq",
      "2",
      "eq",
      "2",
      "eq",
      "3",
      "eq",
      "eq",
    ]);
    expect(display(ex).body).toMatchObject({ kind: "answer", value: "No Solution" });
    const es = pressAll(initialState("fx991esplus"), [
      "mode",
      "5",
      "1",
      "1",
      "eq",
      "1",
      "eq",
      "1",
      "eq",
      "2",
      "eq",
      "2",
      "eq",
      "3",
      "eq",
      "eq",
    ]);
    expect(display(es).body).toMatchObject({ kind: "error", title: "Math ERROR" });
  });
});

describe("calculus", () => {
  it("integrates and differentiates to display precision", () => {
    expect(formatDecimal(integrate((x) => x * x, 0, 2))).toBe("2.666666667");
    expect(formatDecimal(integrate((x) => 2 * x * x + 3 * x + 8, 1, 5))).toBe("150.6666667");
    expect(formatDecimal(integrate((x) => Math.log(x), 1, Math.E))).toBe("1");
    expect(formatDecimal(differentiate((x) => 3 * x * x - 5 * x + 2, 2))).toBe("7");
    expect(formatDecimal(differentiate(Math.sin, Math.PI / 2))).toBe("0");
  });

  it("finds a root from a starting value, or says it cannot", () => {
    expect(newtonSolve((x) => x * x - 2, 1)?.x).toBeCloseTo(Math.SQRT2, 14);
    expect(newtonSolve((x) => x * x + 1, 1)).toBeNull();
  });

  it("moves through the ∫ template with ▶ on the EX and ES PLUS", () => {
    const s = pressAll(initialState("fx991ex"), [
      "integral",
      "x",
      "sq",
      "right",
      "0",
      "right",
      "2",
      "right",
    ]);
    expect(display(s).body).toMatchObject({ input: ["∫(", "x", "²", ",", "0", ",", "2", ")"] });
  });

  it("refuses ∫ outside COMP, as the manuals say", () => {
    const s = pressAll(initialState("fx991esplus"), ["mode", "3", "1", "ac", "integral"]);
    expect(s.notice).toBe("unsupported");
  });

  it("runs SOLVE with an equals sign typed in", () => {
    // 2X = 5, typed with ALPHA CALC for =.
    const s = pressAll(initialState("fx991esplus"), [
      "2",
      "alpha",
      "rp",
      "alpha",
      "calc",
      "5",
      "shift",
      "calc",
      "1",
      "eq",
    ]);
    expect(s.screen).toMatchObject({ s: "solveResult" });
    expect(s.vars.X).toBeCloseTo(2.5, 12);
  });
});

describe("matrices", () => {
  it("does the textbook operations", () => {
    expect(
      determinant([
        [2, 1],
        [1, 3],
      ]),
    ).toBe(5);
    expect(
      inverse([
        [2, 1],
        [1, 3],
      ]),
    ).toEqual([
      [0.6, -0.2],
      [-0.2, 0.4],
    ]);
    expect(
      inverse([
        [1, 2],
        [2, 4],
      ]),
    ).toBe("singular");
    expect(multiply([[1, 2, 3]], [[1], [1], [1]])).toEqual([[6]]);
    expect(multiply([[1, 2]], [[1, 2]])).toBeNull();
  });

  it("shows an inverse in fractions", () => {
    const s = pressAll(initialState("fx991ex"), [
      "menu",
      "4",
      "1",
      "2",
      "2",
      "2",
      "eq",
      "1",
      "eq",
      "1",
      "eq",
      "3",
      "eq",
      "ac",
      "optn",
      "3",
      "inv",
      "eq",
    ]);
    expect(display(s).body).toMatchObject({
      kind: "calc",
      result: {
        kind: "matrix",
        cells: [
          ["3⁄5", "−1⁄5"],
          ["−1⁄5", "2⁄5"],
        ],
      },
    });
  });

  it("refuses to multiply matrices whose sizes do not fit", () => {
    const s = pressAll(initialState("fx991esplus"), [
      "mode",
      "6",
      "1",
      "4",
      "1",
      "eq",
      "2",
      "eq",
      "3",
      "eq",
      "4",
      "eq",
      "5",
      "eq",
      "6",
      "eq",
      "ac",
      "shift",
      "4",
      "3",
      "times",
      "shift",
      "4",
      "3",
      "eq",
    ]);
    expect(display(s).body).toMatchObject({ kind: "error", title: "Dimension ERROR" });
  });

  it("knows a singular matrix has no inverse", () => {
    const s = pressAll(initialState("fx991esplus"), [
      "mode",
      "6",
      "1",
      "5",
      "1",
      "eq",
      "2",
      "eq",
      "2",
      "eq",
      "4",
      "eq",
      "ac",
      "shift",
      "4",
      "3",
      "inv",
      "eq",
    ]);
    expect(display(s).body).toMatchObject({ kind: "error", title: "Math ERROR" });
  });

  it("offers the ES PLUS and MS three matrices and the EX four", () => {
    const es = pressAll(initialState("fx991esplus"), ["mode", "6"]);
    const ex = pressAll(initialState("fx991ex"), ["menu", "4"]);
    const ms = pressAll(initialState("fx570ms"), ["mode", "mode", "mode", "2", "shift", "4", "1"]);
    expect(display(es).body).toMatchObject({ kind: "menu", items: [{}, {}, {}] });
    expect(display(ex).body).toMatchObject({ kind: "menu", items: [{}, {}, {}, {}] });
    expect(display(ms).body).toMatchObject({ kind: "menu", items: [{}, {}, {}] });
  });

  it("asks the MS for each element in turn", () => {
    const s = pressAll(initialState("fx570ms"), [
      "mode",
      "mode",
      "mode",
      "2",
      "shift",
      "4",
      "1",
      "1",
      "2",
      "eq",
      "3",
      "eq",
      "7",
      "eq",
    ]);
    expect(display(s).body).toMatchObject({ kind: "prompt", title: "MatA12" });
    expect(s.matrices.A).toEqual([
      [7, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("gives the fx-82ES PLUS no matrix mode", () => {
    const s = pressAll(initialState("fx82esplus"), ["mode"]);
    expect(display(s).body).toMatchObject({
      kind: "menu",
      items: [{ label: "COMP" }, { label: "STAT" }, { label: "TABLE" }],
    });
  });
});

describe("fractions that do not fit", () => {
  it("counts the fraction mark among the ten places, as the manuals do", () => {
    // P(1) = 0.84134 would be 42067⁄50000: eleven places, so a decimal.
    expect(formatNumber(0.84134)).toBe("0.84134");
    expect(formatNumber(32 / 7)).toBe("32⁄7");
  });
});

describe("the fx-82MS, with its own manual's examples", () => {
  const digits = (v: number) =>
    String(v)
      .split("")
      .map((c) => (c === "-" ? "neg" : c === "." ? "dot" : c)) as KeyId[];

  it("is in SD after MODE 2 and in REG Lin after MODE 3 1", () => {
    const sd = pressAll(initialState("fx82ms"), ["mode", "2"]);
    expect([sd.mode, sd.stat.kind, display(sd).mode]).toEqual(["stat", "1var", "SD"]);
    const reg = pressAll(initialState("fx82ms"), ["mode", "3", "1"]);
    expect([reg.mode, reg.stat.kind, display(reg).mode]).toEqual(["stat", "lin", "REG"]);
  });

  it("reaches Deg, Rad, Gra with MODE pressed twice", () => {
    const rad = pressAll(initialState("fx82ms"), ["mode", "mode", "2"]);
    expect(rad.angle).toBe("rad");
    // cos(π/3) = 0.5 in radians, as in the manual.
    expect(run(["cos", "lp", "shift", "exp10", "divide", "3", "rp"], rad)).toBe("0.5");
    const deg = pressAll(rad, ["mode", "mode", "1"]);
    expect(run(["sin", "3", "0"], deg)).toBe("0.5");
  });

  it("gives the SD example: 55, 54, 51, 55, 53, 53, 54, 52", () => {
    const data = [55, 54, 51, 55, 53, 53, 54, 52].flatMap((v) => [...digits(v), "mplus" as KeyId]);
    const s = pressAll(initialState("fx82ms"), ["mode", "2", ...data]);
    expect(run(["shift", "2", "3"], s)).toBe("1.407885953");
    expect(run(["shift", "2", "2"], s)).toBe("1.316956719");
    expect(run(["shift", "2", "1"], s)).toBe("53.375");
    expect(run(["shift", "1", "3"], s)).toBe("8");
    expect(run(["shift", "1", "2"], s)).toBe("427");
    expect(run(["shift", "1", "1"], s)).toBe("22805");
  });

  it("gives the REG example: temperature and air pressure", () => {
    const pairs: [number, number][] = [
      [10, 1003],
      [15, 1005],
      [20, 1010],
      [25, 1011],
      [30, 1014],
    ];
    const data = pairs.flatMap(([x, y]) => [
      ...digits(x),
      "comma" as KeyId,
      ...digits(y),
      "mplus" as KeyId,
    ]);
    const s = pressAll(initialState("fx82ms"), ["mode", "3", "1", ...data]);
    const third: KeyId[] = ["shift", "2", "right", "right"];
    expect(run([...third, "1"], s)).toBe("997.4");
    expect(run([...third, "2"], s)).toBe("0.56");
    expect(run([...third, "3"], s)).toBe("0.982607368");
    // ŷ binds tighter than (−) (the manual's priority table), so the −5 is bracketed.
    expect(run(["lp", "neg", "5", "rp", "shift", "2", "right", "right", "right", "2"], s)).toBe(
      "994.6",
    );
    expect(run(["1", "0", "0", "0", "shift", "2", "right", "right", "right", "1"], s)).toBe(
      "4.642857143",
    );
  });

  it("has nCr on a key of its own, and nPr above it", () => {
    expect(run(["1", "0", "ncr", "4"], "fx82ms")).toBe("210");
    expect(run(["7", "shift", "ncr", "4"], "fx82ms")).toBe("840");
    // SHIFT ÷ is nothing here: it is nCr on the other models.
    expect(pressAll(initialState("fx82ms"), ["5", "shift", "divide"]).notice).toBe("unsupported");
  });

  it("has ∛ above x³, e above ln, and no DISTR", () => {
    expect(run(["shift", "cube", "2", "7"], "fx82ms")).toBe("3");
    expect(run(["alpha", "ln"], "fx82ms")).toBe("2.718281828");
    const sd = pressAll(initialState("fx82ms"), ["mode", "2", "shift", "3"]);
    expect(sd.notice).toBe("unsupported");
  });
});

describe("the fx-991CW, with its own manual's examples", () => {
  const cw = () => initialState("fx991cw");
  /** A number typed on the CW: a minus is SHIFT −. */
  const typedCw = (v: number): KeyId[] =>
    String(v)
      .split("")
      .flatMap((c): KeyId[] =>
        c === "-" ? ["shift", "minus"] : c === "." ? ["dot"] : [c as KeyId],
      );
  const exe = (...values: number[]): KeyId[] =>
    values.flatMap((v) => [...typedCw(v), "eq" as KeyId]);
  const highlighted = (s: CalcState) => {
    const body = display(s).body;
    return body.kind === "menu" && body.selected !== null ? body.items[body.selected]?.label : null;
  };

  it("walks HOME's grid of apps, three to a row, from the app in use", () => {
    expect(highlighted(pressAll(cw(), ["home"]))).toBe("Calculate");
    expect(highlighted(pressAll(cw(), ["home", "right"]))).toBe("Statistics");
    expect(highlighted(pressAll(cw(), ["home", "down", "right", "right"]))).toBe("Equation");
    const stats = pressAll(cw(), ["home", "right", "ok", "ok", "home"]);
    expect(highlighted(stats)).toBe("Statistics");
  });

  it("gives the regression example: a, b and r", () => {
    const xs = [1.0, 1.2, 1.5, 1.6, 1.9, 2.1, 2.4, 2.5, 2.7, 3];
    const ys = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2];
    const s = pressAll(cw(), [
      "home",
      "right",
      "ok",
      "down",
      "ok",
      ...exe(...xs),
      "down",
      "right",
      ...exe(...ys),
      "ok",
      "down",
      "ok",
      "ok",
    ]);
    expect(s.screen.s).toBe("statList");
    const body = display(s).body;
    expect(body.kind === "list" && body.rows.map((r) => r.value)).toEqual([
      "0.5043587805",
      "0.4802217183",
      "0.9952824846",
    ]);
  });

  it("asks μ before σ, and works out Normal PD with OK", () => {
    const s = pressAll(cw(), [
      "home",
      "right",
      "right",
      "ok",
      "down",
      "down",
      "ok",
      ...exe(36, 35, 2),
      "ok",
    ]);
    expect(s.screen.s === "distResult" && formatDecimal(s.screen.value)).toBe("0.1760326634");
  });

  it("integrates ln(x) from 1 to e: ▼ to the lower limit, ▲ to the upper", () => {
    const keys: KeyId[] = [
      "catalog",
      "ok",
      "down",
      "ok",
      "shift",
      "logb",
      "x",
      "rp",
      "down",
      "1",
      "up",
      "shift",
      "8",
    ];
    expect(run(keys, "fx991cw")).toBe("1");
  });

  it("differentiates sin(x) at π/2, in radians", () => {
    const radians = pressAll(cw(), ["settings", "ok", "down", "ok", "down", "ok", "ac"]);
    expect(radians.angle).toBe("rad");
    const keys: KeyId[] = [
      "catalog",
      "ok",
      "ok",
      "sin",
      "x",
      "rp",
      "right",
      "shift",
      "7",
      "divide",
      "2",
    ];
    expect(run(keys, radians)).toBe("0");
  });

  it("solves x² + 2x − 2 = 0 in the Equation app", () => {
    const s = pressAll(cw(), [
      "home",
      "down",
      "right",
      "right",
      "ok",
      "down",
      "ok",
      "ok",
      ...exe(1, 2, -2),
      "eq",
    ]);
    expect(s.screen.s).toBe("eqnResult");
    const roots = s.screen.s === "eqnResult" && Array.isArray(s.screen.roots) ? s.screen.roots : [];
    expect(roots.map((r) => r.re).sort()).toEqual([-1 - Math.sqrt(3), -1 + Math.sqrt(3)].sort());
  });

  it("finds nCr in CATALOG, Probability, the fourth item", () => {
    const keys: KeyId[] = ["1", "0", "catalog", "down", "ok", "down", "down", "down", "ok", "4"];
    expect(run(keys, "fx991cw")).toBe("210");
  });

  it("types variables and (−) with SHIFT, and shows a decimal with FORMAT", () => {
    const stored = { ...cw(), vars: { ...cw().vars, A: 8 } };
    expect(run(["shift", "4", "times", "1", "0"], stored)).toBe("80");
    expect(run(["shift", "minus", "3", "sq"], "fx991cw")).toBe("−9");
    const decimal = pressAll(cw(), ["1", "divide", "3", "eq", "format", "down", "ok"]);
    expect(decimal.decimal).toBe(true);
  });

  it("does not run matrices or Solver yet, and says so", () => {
    expect(pressAll(cw(), ["home", "down", "down", "down", "ok"]).notice).toBe("unsupported");
    const solver = pressAll(cw(), ["home", "down", "right", "right", "ok", "down", "down", "ok"]);
    expect(solver.notice).toBe("unsupported");
  });
});
