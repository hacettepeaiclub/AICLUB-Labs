import { differentiate, integrate } from "./calculus";
import {
  add,
  determinant,
  identity,
  inverse,
  isMatrix,
  multiply,
  scale,
  sub,
  transpose,
  type Matrix,
} from "./matrix";
import { OVERFLOW } from "./numbers";
import { probP, probQ, probR } from "./probability";

/**
 * What a keypress puts on the input line, and how a line is worked out.
 *
 * A calculator does not store text. Each key inserts a *token* — `sin(` is one
 * token, so one DEL removes all of it, exactly as on the device — and `=`
 * hands the token list to the parser below.
 *
 * ## The order of operations is Casio's, not the textbook's
 *
 * Casio publishes its priority sequence, and two places in it surprise
 * students, which is why it is reproduced faithfully here:
 *
 * - The negative sign (−) binds *looser* than x² and powers, so `(−)3x²` is
 *   −(3²) = −9. Squaring a negative number needs brackets: `((−)3)x²` = 9.
 * - Multiplication with the sign left out binds *tighter* than × and ÷, so
 *   `6÷2(1+2)` is 6 ÷ 6 = 1.
 *
 * From tightest to loosest: brackets and functions; x², x³, x⁻¹, x!, ^, and
 * the estimate commands x̂, ŷ and ▶t; fractions; the negative sign; implied
 * multiplication; nPr and nCr; × and ÷; + and −. A bracket left open at the
 * end of the line is closed for you.
 *
 * ## ∫ and d/dx
 *
 * Their first argument is a function of X, not a number, so it is kept as
 * tokens and worked out again for every X the integration or the derivative
 * needs (`lazyArgs`).
 */

export type MatName = "A" | "B" | "C" | "D";

/** The nine memories every model here has. */
export type VarName = "A" | "B" | "C" | "D" | "E" | "F" | "M" | "X" | "Y";

export const VAR_NAMES: VarName[] = ["A", "B", "C", "D", "E", "F", "M", "X", "Y"];

export type StatVar =
  | "mean"
  | "n"
  | "popSd"
  | "sampleSd"
  | "sumX"
  | "sumX2"
  | "min"
  | "max"
  | "meanY"
  | "popSdY"
  | "sampleSdY"
  | "sumY"
  | "sumY2"
  | "sumXY"
  | "minY"
  | "maxY"
  | "a"
  | "b"
  | "r";

export type Fn =
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "sqrt"
  | "cbrt"
  | "ln"
  | "log"
  | "logb"
  | "exp"
  | "tenpow"
  | "det"
  | "trn"
  | "identity"
  | "abs"
  | "integral"
  | "deriv"
  | "normP"
  | "normQ"
  | "normR";

/** Functions written as a template with boxes to move between with ▶. */
export const TEMPLATE_SLOTS: Partial<Record<Fn, number>> = { integral: 3, deriv: 2, logb: 2 };

export type Tok =
  | { t: "num"; v: string }
  | { t: "op"; v: "+" | "-" | "*" | "/" | "P" | "C" }
  | { t: "neg" }
  | { t: "lp" }
  | { t: "rp" }
  | { t: "comma" }
  | { t: "fn"; v: Fn }
  | { t: "post"; v: "sq" | "cube" | "inv" | "fact" | "tnorm" }
  | { t: "est"; v: "xhat" | "yhat" }
  | { t: "pow" }
  | { t: "frac" }
  | { t: "e10" }
  | { t: "const"; v: "pi" | "e" }
  | { t: "ans" }
  | { t: "var"; v: VarName }
  | { t: "equals" }
  | { t: "mat"; v: MatName | "Ans" }
  | { t: "stat"; v: StatVar }
  /** Shown after STO: "Ans→A". Never parsed. */
  | { t: "storeTo"; v: VarName };

export type Value = number | Matrix;

export type CalcErrorKind = "syntax" | "math" | "dimension";

export class CalcError extends Error {
  constructor(readonly kind: CalcErrorKind) {
    super(kind);
  }
}

export interface EvalContext {
  angle: "deg" | "rad";
  ans: Value;
  matrices: Partial<Record<MatName, Matrix | null>>;
  matAns: Matrix | null;
  vars: Record<VarName, number>;
  /** A statistics variable, or NaN when it has no value (no data yet). */
  stat: (v: StatVar) => number;
  /** x̂ for a y, or ŷ for an x, from the current regression; NaN without one. */
  estimate: (kind: "xhat" | "yhat", v: number) => number;
  /** The normalised variate (x − x̄) ÷ σx of the current data; NaN without data. */
  normalise: (x: number) => number;
}

export interface TextStyle {
  /** The EX writes the variables x and y in lower case. */
  lowerXY?: boolean;
  /** The MS writes a fraction as 1┘3. */
  msFraction?: boolean;
}

const FN_TEXT: Record<Fn, string> = {
  sin: "sin(",
  cos: "cos(",
  tan: "tan(",
  asin: "sin⁻¹(",
  acos: "cos⁻¹(",
  atan: "tan⁻¹(",
  sqrt: "√(",
  cbrt: "∛(",
  ln: "ln(",
  log: "log(",
  logb: "log(",
  exp: "e^(",
  tenpow: "10^(",
  det: "det(",
  trn: "Trn(",
  identity: "Identity(",
  abs: "Abs(",
  integral: "∫(",
  deriv: "d/dx(",
  normP: "P(",
  normQ: "Q(",
  normR: "R(",
};

const STAT_TEXT: Record<StatVar, string> = {
  mean: "x̄",
  n: "n",
  popSd: "σx",
  sampleSd: "sx",
  sumX: "Σx",
  sumX2: "Σx²",
  min: "minX",
  max: "maxX",
  meanY: "ȳ",
  popSdY: "σy",
  sampleSdY: "sy",
  sumY: "Σy",
  sumY2: "Σy²",
  sumXY: "Σxy",
  minY: "minY",
  maxY: "maxY",
  a: "A",
  b: "B",
  r: "r",
};

const OP_TEXT = { "+": "+", "-": "−", "*": "×", "/": "÷", P: "P", C: "C" };
const POST_TEXT = { sq: "²", cube: "³", inv: "⁻¹", fact: "!", tnorm: "▶t" };

/** What a token looks like on the input line. */
export function tokenText(tok: Tok, style: TextStyle = {}): string {
  switch (tok.t) {
    case "num":
      return tok.v;
    case "op":
      return OP_TEXT[tok.v];
    case "neg":
      // Shorter than the minus of subtraction, as on the device's display.
      return "-";
    case "lp":
      return "(";
    case "rp":
      return ")";
    case "comma":
      return ",";
    case "fn":
      return FN_TEXT[tok.v];
    case "post":
      return POST_TEXT[tok.v];
    case "est":
      return tok.v === "xhat" ? "x̂" : "ŷ";
    case "pow":
      return "^(";
    case "frac":
      return style.msFraction ? "┘" : "⁄";
    case "e10":
      return "×10";
    case "const":
      return tok.v === "pi" ? "π" : "e";
    case "ans":
      return "Ans";
    case "var":
      return style.lowerXY && (tok.v === "X" || tok.v === "Y") ? tok.v.toLowerCase() : tok.v;
    case "equals":
      return "=";
    case "mat":
      return `Mat${tok.v}`;
    case "stat":
      return STAT_TEXT[tok.v];
    case "storeTo":
      return `→${style.lowerXY && (tok.v === "X" || tok.v === "Y") ? tok.v.toLowerCase() : tok.v}`;
  }
}

/** Tokens that can begin an operand, and so imply a multiplication after one. */
const startsOperand = (tok: Tok | undefined): boolean =>
  !!tok &&
  (tok.t === "num" ||
    tok.t === "lp" ||
    tok.t === "fn" ||
    tok.t === "const" ||
    tok.t === "ans" ||
    tok.t === "var" ||
    tok.t === "mat" ||
    tok.t === "stat" ||
    tok.t === "e10");

const fail = (kind: CalcErrorKind): never => {
  throw new CalcError(kind);
};

/** Every value that leaves the parser goes through here. */
function checked(v: Value): Value {
  if (isMatrix(v)) {
    for (const x of v.flat()) checked(x);
    return v;
  }
  if (!Number.isFinite(v) || Math.abs(v) >= OVERFLOW) fail("math");
  return Object.is(v, -0) ? 0 : v;
}

const num = (v: Value): number => (isMatrix(v) ? fail("math") : v);

function plus(a: Value, b: Value, sign: 1 | -1): Value {
  if (isMatrix(a) && isMatrix(b)) return (sign === 1 ? add(a, b) : sub(a, b)) ?? fail("dimension");
  if (isMatrix(a) || isMatrix(b)) return fail("syntax");
  return a + sign * b;
}

function times(a: Value, b: Value): Value {
  if (isMatrix(a) && isMatrix(b)) return multiply(a, b) ?? fail("dimension");
  if (isMatrix(a)) return scale(a, num(b));
  if (isMatrix(b)) return scale(b, a);
  return a * b;
}

function divide(a: Value, b: Value): Value {
  if (isMatrix(b)) return fail("math");
  if (b === 0) return fail("math");
  return isMatrix(a) ? scale(a, 1 / b) : a / b;
}

function negate(a: Value): Value {
  return isMatrix(a) ? scale(a, -1) : -a;
}

function reciprocal(a: Value): Value {
  if (isMatrix(a)) {
    const inv = inverse(a);
    if (inv === "not-square") return fail("dimension");
    if (inv === "singular") return fail("math");
    return inv;
  }
  return a === 0 ? fail("math") : 1 / a;
}

function power(a: Value, k: number): Value {
  if (isMatrix(a)) {
    if (!Number.isInteger(k) || k < 1) return fail("math");
    let out: Matrix = a;
    for (let i = 1; i < k; i++) out = multiply(out, a) ?? fail("dimension");
    return out;
  }
  const r = a ** k;
  return Number.isNaN(r) ? fail("math") : r;
}

function factorial(x: number): number {
  if (!Number.isInteger(x) || x < 0 || x > 69) return fail("math");
  let r = 1;
  for (let i = 2; i <= x; i++) r *= i;
  return r;
}

function permutation(n: number, r: number, combine: boolean): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || r < 0 || n < r || n >= 1e10) {
    return fail("math");
  }
  let out = 1;
  for (let i = 0; i < r; i++) out *= n - i;
  if (combine) out /= factorial(r);
  return Math.round(out);
}

/** Trig results this close to a round value are that value, as on the device. */
function snap(x: number): number {
  for (const target of [0, 0.5, 1, -0.5, -1]) if (Math.abs(x - target) < 1e-13) return target;
  return x;
}

/** A finite number, or a Math ERROR. */
const real = (x: number): number => (Number.isFinite(x) ? x : fail("math"));

export function applyFn(fn: Fn, args: Value[], angle: "deg" | "rad"): Value {
  const [first, second] = args;
  if (first === undefined) return fail("syntax");
  if (args.length > (fn === "log" || fn === "logb" ? 2 : 1)) return fail("syntax");
  const toRad = (x: number) => (angle === "deg" ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (angle === "deg" ? (x * 180) / Math.PI : x);

  if (fn === "det") {
    if (!isMatrix(first)) return fail("math");
    return determinant(first) ?? fail("dimension");
  }
  if (fn === "trn") return isMatrix(first) ? transpose(first) : fail("math");
  if (fn === "identity") {
    const n = num(first);
    return Number.isInteger(n) && n >= 1 && n <= 4 ? identity(n) : fail("math");
  }
  if (fn === "abs")
    return isMatrix(first) ? first.map((row) => row.map(Math.abs)) : Math.abs(first);

  const x = num(first);
  switch (fn) {
    case "sin":
      return snap(Math.sin(toRad(x)));
    case "cos":
      return snap(Math.cos(toRad(x)));
    case "tan": {
      const c = Math.cos(toRad(x));
      if (Math.abs(c) < 1e-15) return fail("math");
      return snap(Math.tan(toRad(x)));
    }
    case "asin":
      return Math.abs(x) > 1 ? fail("math") : fromRad(Math.asin(x));
    case "acos":
      return Math.abs(x) > 1 ? fail("math") : fromRad(Math.acos(x));
    case "atan":
      return fromRad(Math.atan(x));
    case "sqrt":
      return x < 0 ? fail("math") : Math.sqrt(x);
    case "cbrt":
      return Math.cbrt(x);
    case "ln":
      return x <= 0 ? fail("math") : Math.log(x);
    case "log":
    case "logb": {
      // log(x) is base ten; log(b, x) is base b.
      if (second === undefined) return x <= 0 ? fail("math") : Math.log10(x);
      const y = num(second);
      if (x <= 0 || x === 1 || y <= 0) return fail("math");
      return Math.log(y) / Math.log(x);
    }
    case "exp":
      return Math.exp(x);
    case "tenpow":
      return 10 ** x;
    case "normP":
      return probP(x);
    case "normQ":
      return probQ(x);
    case "normR":
      return probR(x);
  }
  return fail("syntax");
}

class Parser {
  private i = 0;

  constructor(
    private readonly toks: readonly Tok[],
    private readonly ctx: EvalContext,
  ) {}

  private peek(): Tok | undefined {
    return this.toks[this.i];
  }

  private isOp(...ops: string[]): boolean {
    const tok = this.peek();
    return tok?.t === "op" && ops.includes(tok.v);
  }

  run(): Value {
    if (this.toks.length === 0) fail("syntax");
    const v = this.addsub();
    if (this.i < this.toks.length) fail("syntax");
    return checked(v);
  }

  private addsub(): Value {
    let v = this.muldiv();
    while (this.isOp("+", "-")) {
      const op = (this.toks[this.i++] as { v: string }).v;
      v = checked(plus(v, this.muldiv(), op === "+" ? 1 : -1));
    }
    return v;
  }

  private muldiv(): Value {
    let v = this.permcomb();
    while (this.isOp("*", "/")) {
      const op = (this.toks[this.i++] as { v: string }).v;
      const r = this.permcomb();
      v = checked(op === "*" ? times(v, r) : divide(v, r));
    }
    return v;
  }

  private permcomb(): Value {
    let v = this.implied();
    while (this.isOp("P", "C")) {
      const op = (this.toks[this.i++] as { v: string }).v;
      v = permutation(num(v), num(this.implied()), op === "C");
    }
    return v;
  }

  private implied(): Value {
    let v = this.signed();
    while (startsOperand(this.peek())) v = checked(times(v, this.fraction()));
    return v;
  }

  private signed(): Value {
    if (this.peek()?.t === "neg") {
      this.i++;
      return negate(this.signed());
    }
    return this.fraction();
  }

  private fraction(): Value {
    let v = this.postfix();
    while (this.peek()?.t === "frac") {
      this.i++;
      v = checked(divide(v, this.postfix()));
    }
    return v;
  }

  private postfix(): Value {
    let v = this.primary();
    for (;;) {
      const tok = this.peek();
      if (tok?.t === "post") {
        this.i++;
        if (tok.v === "sq") v = power(v, 2);
        else if (tok.v === "cube") v = power(v, 3);
        else if (tok.v === "inv") v = reciprocal(v);
        else if (tok.v === "fact") v = factorial(num(v));
        else v = real(this.ctx.normalise(num(v)));
      } else if (tok?.t === "est") {
        this.i++;
        v = real(this.ctx.estimate(tok.v, num(v)));
      } else if (tok?.t === "pow") {
        this.i++;
        const k = this.addsub();
        this.close();
        v = power(v, num(k));
      } else return checked(v);
      v = checked(v);
    }
  }

  /** A closing bracket, or the end of the line, which closes it for you. */
  private close(): void {
    const tok = this.peek();
    if (tok?.t === "rp") this.i++;
    else if (tok !== undefined) fail("syntax");
  }

  /**
   * The arguments of a function whose first argument is itself a function of
   * X: each as its own list of tokens, up to the closing bracket or the end.
   */
  private lazyArgs(): Tok[][] {
    const args: Tok[][] = [[]];
    let depth = 0;
    while (this.i < this.toks.length) {
      const tok = this.toks[this.i]!;
      if (tok.t === "rp" && depth === 0) {
        this.i++;
        break;
      }
      if (tok.t === "comma" && depth === 0) {
        args.push([]);
        this.i++;
        continue;
      }
      if (tok.t === "lp" || tok.t === "fn" || tok.t === "pow") depth++;
      if (tok.t === "rp") depth--;
      args[args.length - 1]!.push(tok);
      this.i++;
    }
    return args;
  }

  private calculus(fn: "integral" | "deriv"): number {
    const args = this.lazyArgs();
    const [body, ...rest] = args;
    const needed = fn === "integral" ? 3 : 2;
    // A fourth (∫) or third (d/dx) argument is the device's tolerance or step
    // count; the answer here does not need it, so it is accepted and unused.
    if (!body?.length || rest.length < needed - 1 || rest.length > needed) fail("syntax");
    const f = (x: number) =>
      num(evaluate(body!, { ...this.ctx, vars: { ...this.ctx.vars, X: x } }));
    const at = rest.map((arg) => num(evaluate(arg, this.ctx)));
    try {
      return fn === "integral"
        ? real(integrate(f, at[0]!, at[1]!))
        : real(differentiate(f, at[0]!));
    } catch (error) {
      if (error instanceof CalcError && error.kind === "syntax") throw error;
      return fail("math");
    }
  }

  private primary(): Value {
    const tok = this.peek();
    if (!tok) return fail("syntax");
    switch (tok.t) {
      case "num":
      case "e10":
        return this.number();
      case "lp": {
        this.i++;
        const v = this.addsub();
        this.close();
        return v;
      }
      case "fn": {
        this.i++;
        if (tok.v === "integral" || tok.v === "deriv") return this.calculus(tok.v);
        const args = [this.addsub()];
        while (this.peek()?.t === "comma") {
          this.i++;
          args.push(this.addsub());
        }
        this.close();
        return applyFn(tok.v, args, this.ctx.angle);
      }
      case "const":
        this.i++;
        return tok.v === "pi" ? Math.PI : Math.E;
      case "ans":
        this.i++;
        return this.ctx.ans;
      case "var":
        this.i++;
        return this.ctx.vars[tok.v];
      case "mat": {
        this.i++;
        const m = tok.v === "Ans" ? this.ctx.matAns : this.ctx.matrices[tok.v];
        return m ?? fail("dimension");
      }
      case "stat": {
        this.i++;
        const v = this.ctx.stat(tok.v);
        return Number.isNaN(v) ? fail("math") : v;
      }
      default:
        return fail("syntax");
    }
  }

  /** Digits, an optional point, and an optional ×10ⁿ. */
  private number(): number {
    let text = "";
    while (this.peek()?.t === "num") text += (this.toks[this.i++] as { v: string }).v;
    if (text.split(".").length > 2 || text === ".") fail("syntax");
    let value = text === "" ? 1 : Number(text);
    if (this.peek()?.t === "e10") {
      this.i++;
      let sign = 1;
      if (this.peek()?.t === "neg") {
        this.i++;
        sign = -1;
      }
      let exponent = "";
      while (this.peek()?.t === "num") exponent += (this.toks[this.i++] as { v: string }).v;
      if (!/^\d+$/.test(exponent)) fail("syntax");
      value *= 10 ** (sign * Number(exponent));
    }
    return value;
  }
}

/** Work out an input line. Throws `CalcError`. */
export function evaluate(toks: readonly Tok[], ctx: EvalContext): Value {
  return new Parser(toks, ctx).run();
}

/**
 * An equation as a function of X: left − right, or the whole line when it has
 * no "=" (SOLVE then solves line = 0, as the manuals say).
 */
export function equationOf(toks: readonly Tok[], ctx: EvalContext): (x: number) => number {
  const at = toks.findIndex((tok) => tok.t === "equals");
  if (toks.filter((tok) => tok.t === "equals").length > 1) fail("syntax");
  const left = at < 0 ? toks : toks.slice(0, at);
  const right = at < 0 ? [] : toks.slice(at + 1);
  if (!left.length || (at >= 0 && !right.length)) fail("syntax");
  return (x: number) => {
    const scope = { ...ctx, vars: { ...ctx.vars, X: x } };
    const l = num(evaluate(left, scope));
    return right.length ? l - num(evaluate(right, scope)) : l;
  };
}

/** Whether the line asks for X anywhere: SOLVE needs something to solve for. */
export const mentionsX = (toks: readonly Tok[]): boolean =>
  toks.some((tok) => tok.t === "var" && tok.v === "X");
