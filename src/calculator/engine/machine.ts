import { newtonSolve } from "./calculus";
import { solveLinear, solvePolynomial, type Complex } from "./equations";
import {
  CalcError,
  TEMPLATE_SLOTS,
  equationOf,
  evaluate,
  mentionsX,
  tokenText,
  type CalcErrorKind,
  type EvalContext,
  type Fn,
  type MatName,
  type StatVar,
  type TextStyle,
  type Tok,
  type Value,
  type VarName,
} from "./expression";
import { isMatrix, zeros, type Matrix } from "./matrix";
import { MODELS, type ModelSpec } from "./models";
import { formatComplex, formatDecimal, formatNumber, toFraction } from "./numbers";
import {
  binomialCd,
  binomialPd,
  inverseNormal,
  normalBetween,
  normalPdf,
  poissonCd,
  poissonPd,
} from "./probability";
import { oneVariable, twoVariable } from "./stats";
import type {
  Action,
  CalcMode,
  DistField,
  DistKind,
  EqnType,
  KeyId,
  Menu,
  ModelId,
  StatKind,
} from "./types";

/**
 * The calculator as a state machine: `press(state, key)` returns the state
 * after that key, and nothing else changes anything.
 *
 * Pure on purpose. A lesson is a list of keys, so it can be replayed in a test
 * and checked against the answer the lesson promises; and a timed game (the
 * planned second version of this page) is the same list with a clock beside
 * it. The interface draws `display(state)` and owns no logic of its own.
 *
 * Where the four models behave differently, the difference is a field of
 * their `ModelSpec` rather than a branch on a model's name, so a fifth model
 * is a new spec, not a change here.
 */

type ErrorKind = CalcErrorKind | "cantSolve";

export type Screen =
  | { s: "calc" }
  | {
      s: "menu";
      menu: Menu;
      page: number;
      back: Screen;
      /** The highlighted item, in a cursor menu. */ index: number;
    }
  | { s: "statEditor"; row: number; col: number; entry: Tok[] }
  | { s: "statList"; list: "oneVar" | "reg"; top: number; back: Screen }
  | { s: "matrixEditor"; name: MatName; cell: number; entry: Tok[] }
  | { s: "dimPrompt"; name: MatName; rows: number | null; entry: Tok[] }
  | { s: "eqnEditor"; cell: number; entry: Tok[] }
  | { s: "eqnResult"; index: number; roots: Complex[] | "none" | "infinite" }
  | { s: "distEditor"; field: number; entry: Tok[] }
  | { s: "distResult"; value: number }
  | { s: "solvePrompt"; entry: Tok[] }
  | { s: "solveResult"; x: number; residual: number }
  | { s: "error"; kind: ErrorKind; back: Screen };

/** Said once, beside the device, after the key that caused it. */
export type Notice = "unsupported" | "full";

export interface CalcState {
  model: ModelId;
  mode: CalcMode;
  shift: boolean;
  alpha: boolean;
  angle: "deg" | "rad";
  input: Tok[];
  cursor: number;
  /** The answer on screen for `input`, or null while typing. */
  result: Value | null;
  /** Written before the result, e.g. "n=" after DT on the MS. */
  resultLabel: string | null;
  /** S⇔D: show the result as a decimal rather than a fraction. */
  decimal: boolean;
  /** The line had a fraction in it: the MS then answers in fractions too. */
  fractionInput: boolean;
  ans: Value;
  /** The input has been worked out; the next key starts a new line. */
  evaluated: boolean;
  screen: Screen;
  stat: { kind: StatKind; rows: { x: number; y: number }[] };
  matrices: Record<MatName, Matrix | null>;
  vars: Record<VarName, number>;
  eqn: { type: EqnType; coefs: number[] };
  dist: { kind: DistKind; values: number[] };
  /** STO or RCL was pressed; the next key names the variable. */
  pending: "sto" | "rcl" | null;
  notice: Notice | null;
}

const NO_VARS: Record<VarName, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, M: 0, X: 0, Y: 0 };

export function initialState(model: ModelId): CalcState {
  return {
    model,
    mode: "calc",
    shift: false,
    alpha: false,
    angle: "deg",
    input: [],
    cursor: 0,
    result: null,
    resultLabel: null,
    decimal: false,
    fractionInput: false,
    ans: 0,
    evaluated: false,
    screen: { s: "calc" },
    stat: { kind: "1var", rows: [] },
    matrices: { A: null, B: null, C: null, D: null },
    vars: { ...NO_VARS },
    eqn: { type: { kind: "linear", n: 2 }, coefs: zeros(1, 6)[0]! },
    dist: { kind: "normalCd", values: [] },
    pending: null,
    notice: null,
  };
}

/** Press keys one after another. */
export const pressAll = (state: CalcState, keys: readonly KeyId[]): CalcState =>
  keys.reduce(press, state);

// ------------------------------------------------------------ the keys ----

const DIGITS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

/** What a key types onto the input line on this model, or null if it types nothing. */
function tokensFor(key: KeyId, shift: boolean, alpha: boolean, model: ModelSpec): Tok[] | null {
  // The CW has no ALPHA: variables, π, e and (−) are SHIFT and a key.
  if (shift && model.shiftLetters) {
    const letter = model.shiftLetters[key];
    if (letter) return [{ t: "var", v: letter }];
    switch (key) {
      case "7":
        return [{ t: "const", v: "pi" }];
      case "8":
        return [{ t: "const", v: "e" }];
      case "minus":
        return [{ t: "neg" }];
      case "pow":
        return [{ t: "post", v: "inv" }];
      case "sq":
        return [{ t: "fn", v: "log" }];
      case "logb":
        return [{ t: "fn", v: "ln" }];
      case "rp":
        return [{ t: "comma" }];
      case "sqrt":
        return [{ t: "fn", v: "cbrt" }];
      case "sin":
      case "cos":
      case "tan":
        break;
      default:
        return null;
    }
  }
  if (DIGITS.has(key)) return [{ t: "num", v: key }];
  switch (key) {
    case "dot":
      return [{ t: "num", v: "." }];
    case "plus":
      return [{ t: "op", v: "+" }];
    case "minus":
      return [{ t: "op", v: "-" }];
    // nPr and nCr are SHIFT × and SHIFT ÷, except where they have a key of their own.
    case "times":
      return shift ? (model.id === "fx82ms" ? null : [{ t: "op", v: "P" }]) : [{ t: "op", v: "*" }];
    case "divide":
      return shift ? (model.id === "fx82ms" ? null : [{ t: "op", v: "C" }]) : [{ t: "op", v: "/" }];
    case "ncr":
      return [{ t: "op", v: shift ? "P" : "C" }];
    case "neg":
      return [{ t: "neg" }];
    case "lp":
      // Abs is SHIFT ( on the EX.
      if (shift) return model.id === "fx991ex" ? [{ t: "fn", v: "abs" }] : null;
      return [{ t: "lp" }];
    case "rp":
      return [shift ? { t: "comma" } : { t: "rp" }];
    case "comma":
      return shift ? null : [{ t: "comma" }];
    case "sin":
      return [{ t: "fn", v: shift ? "asin" : "sin" }];
    case "cos":
      return [{ t: "fn", v: shift ? "acos" : "cos" }];
    case "tan":
      return [{ t: "fn", v: shift ? "atan" : "tan" }];
    // On the fx-82MS ∛ is SHIFT x³, and nothing is printed above √ or x².
    case "sqrt":
      if (shift) return model.id === "fx82ms" ? null : [{ t: "fn", v: "cbrt" }];
      return [{ t: "fn", v: "sqrt" }];
    case "sq":
      if (shift) return model.id === "fx82ms" ? null : [{ t: "post", v: "cube" }];
      return [{ t: "post", v: "sq" }];
    case "cube":
      if (shift) return model.id === "fx82ms" ? [{ t: "fn", v: "cbrt" }] : null;
      return [{ t: "post", v: "cube" }];
    case "abs":
      return [{ t: "fn", v: "abs" }];
    case "hyp":
      // Abs is SHIFT hyp on the fx-991ES PLUS; hyperbolic functions are not modelled.
      return shift && model.id === "fx991esplus" ? [{ t: "fn", v: "abs" }] : null;
    case "inv":
      return [{ t: "post", v: shift ? "fact" : "inv" }];
    case "pow":
      return [{ t: "pow" }];
    case "ln":
      // e is ALPHA ln on the fx-82MS.
      if (alpha && model.id === "fx82ms") return [{ t: "const", v: "e" }];
      return [{ t: "fn", v: shift ? "exp" : "ln" }];
    case "log":
      return [{ t: "fn", v: shift ? "tenpow" : "log" }];
    case "logb":
      return [{ t: "fn", v: shift && model.id === "fx991ex" ? "tenpow" : "logb" }];
    case "frac":
      return [{ t: "frac" }];
    case "exp10":
      if (shift) return [{ t: "const", v: "pi" }];
      // e is above ×10ˣ everywhere but the MS models.
      if (alpha) return model.statInput === "dt" ? null : [{ t: "const", v: "e" }];
      return [{ t: "e10" }];
    case "ans":
      return [{ t: "ans" }];
    case "x":
      return [{ t: "var", v: "X" }];
    default:
      return null;
  }
}

/** The variable a key names after ALPHA, STO or RCL. */
const letterFor = (key: KeyId, model: ModelSpec): VarName | null =>
  key === "x" ? "X" : (model.letters[key] ?? null);

/** Tokens that continue from the last answer: pressed first, they get "Ans" before them. */
const continuesAnswer = (tok: Tok | undefined) =>
  tok?.t === "op" || tok?.t === "post" || tok?.t === "pow" || tok?.t === "frac" || tok?.t === "est";

function insertTokens(s: CalcState, toks: Tok[]): CalcState {
  if (s.evaluated) {
    const input = continuesAnswer(toks[0]) ? [{ t: "ans" } as Tok, ...toks] : [...toks];
    return { ...s, input, cursor: input.length, result: null, resultLabel: null, evaluated: false };
  }
  const input = [...s.input.slice(0, s.cursor), ...toks, ...s.input.slice(s.cursor)];
  return { ...s, input, cursor: s.cursor + toks.length };
}

// ------------------------------------------------------- statistics ----

function statValue(s: CalcState, v: StatVar): number {
  const xs = s.stat.rows.map((row) => row.x);
  if (s.stat.kind === "1var") {
    const r = oneVariable(xs);
    if (!r) return NaN;
    const values: Partial<Record<StatVar, number>> = {
      mean: r.mean,
      n: r.n,
      popSd: r.popSd,
      sampleSd: r.sampleSd,
      sumX: r.sumX,
      sumX2: r.sumX2,
      min: r.min,
      max: r.max,
    };
    return values[v] ?? NaN;
  }
  const t = twoVariable(s.stat.rows);
  if (!t) return NaN;
  const values: Record<StatVar, number> = {
    mean: t.meanX,
    n: t.n,
    popSd: t.popSdX,
    sampleSd: t.sampleSdX,
    sumX: t.sumX,
    sumX2: t.sumX2,
    min: t.minX,
    max: t.maxX,
    meanY: t.meanY,
    popSdY: t.popSdY,
    sampleSdY: t.sampleSdY,
    sumY: t.sumY,
    sumY2: t.sumY2,
    sumXY: t.sumXY,
    minY: t.minY,
    maxY: t.maxY,
    a: t.a,
    b: t.b,
    r: t.r,
  };
  return values[v];
}

function contextOf(s: CalcState): EvalContext {
  return {
    angle: s.angle,
    ans: s.ans,
    matrices: s.matrices,
    matAns: isMatrix(s.ans) ? s.ans : null,
    vars: s.vars,
    stat: (v) => statValue(s, v),
    estimate: (kind, v) => {
      if (s.stat.kind !== "lin") return NaN;
      const t = twoVariable(s.stat.rows);
      if (!t) return NaN;
      return kind === "yhat" ? t.a + t.b * v : (v - t.a) / t.b;
    },
    normalise: (x) => {
      const r = oneVariable(s.stat.rows.map((row) => row.x));
      return r ? (x - r.mean) / r.popSd : NaN;
    },
  };
}

// ---------------------------------------------------------- helpers ----

const fresh = (s: CalcState): CalcState => ({
  ...s,
  input: [],
  cursor: 0,
  result: null,
  resultLabel: null,
  evaluated: false,
  fractionInput: false,
});

/**
 * A cursor menu opens on what is current: the HOME screen on the app in use,
 * the angle list on the angle in use. Anything else opens on its first item.
 */
function startIndex(s: CalcState, menu: Menu): number {
  if (!menu.cursor) return 0;
  const index = menu.pages
    .flat()
    .findIndex(({ action }) =>
      action.do === "mode"
        ? action.mode === s.mode
        : action.do === "angle" && action.unit === s.angle,
    );
  return Math.max(0, index);
}

const openMenu = (s: CalcState, menu: Menu, back: Screen): CalcState => ({
  ...s,
  screen: { s: "menu", menu, page: 0, back, index: startIndex(s, menu) },
});

const errorScreen = (s: CalcState, kind: ErrorKind, back: Screen): CalcState => ({
  ...s,
  screen: { s: "error", kind, back },
});

const showError = (s: CalcState, error: unknown, back: Screen): CalcState => {
  if (!(error instanceof CalcError)) throw error;
  return errorScreen(s, error.kind, back);
};

const unsupported = (s: CalcState): CalcState => ({ ...s, notice: "unsupported" });

/** Work out what was typed into a cell: a number, or an error. */
function cellValue(s: CalcState, entry: Tok[]): number {
  const value = evaluate(entry, contextOf(s));
  if (isMatrix(value)) throw new CalcError("math");
  return value;
}

/**
 * The menu a key opens where you are, `null` for a menu key that opens
 * nothing here, or `undefined` when the key is not a menu key at all.
 */
function contextMenu(
  s: CalcState,
  key: KeyId,
  shift: boolean,
  model: ModelSpec,
): Menu | null | undefined {
  if (key === (model.optnKey ?? "optn") && !shift)
    return model.optn ? model.optn(s.mode, s.screen.s, s.stat.kind) : null;
  // OK opens a menu only where the model has one; elsewhere it is the screen's own.
  if (key === "ok" && model.okMenu)
    return model.okMenu(s.mode, s.screen.s, s.stat.kind) ?? undefined;
  if (key === "format" && model.formatMenu) {
    return s.screen.s === "calc" && s.evaluated && s.result !== null ? model.formatMenu : null;
  }
  if (shift && DIGITS.has(key) && !model.shiftLetters) {
    return model.shiftMenu ? model.shiftMenu(key, s.mode, s.stat.kind) : null;
  }
  return undefined;
}

function enterMode(s: CalcState, mode: CalcMode): CalcState {
  // Leaving STAT empties the data, as on every model here.
  const stat = mode === s.mode ? s.stat : { kind: "1var" as const, rows: [] };
  return { ...fresh(s), mode, stat, pending: null, screen: { s: "calc" } };
}

export const coefCount = (type: EqnType): number =>
  type.kind === "linear" ? type.n * (type.n + 1) : type.degree + 1;

/** Each distribution's fields, in the order the EX asks for them, with its defaults. */
export const DIST_FIELDS: Record<DistKind, DistField[]> = {
  normalPd: [
    { label: "x", initial: 0 },
    { label: "σ", initial: 1 },
    { label: "μ", initial: 0 },
  ],
  normalCd: [
    { label: "Lower", initial: 0 },
    { label: "Upper", initial: 0 },
    { label: "σ", initial: 1 },
    { label: "μ", initial: 0 },
  ],
  inverseNormal: [
    { label: "Area", initial: 0 },
    { label: "σ", initial: 1 },
    { label: "μ", initial: 0 },
  ],
  binomialPd: [
    { label: "x", initial: 0 },
    { label: "N", initial: 0 },
    { label: "p", initial: 0 },
  ],
  binomialCd: [
    { label: "x", initial: 0 },
    { label: "N", initial: 0 },
    { label: "p", initial: 0 },
  ],
  poissonPd: [
    { label: "x", initial: 0 },
    { label: "λ", initial: 0 },
  ],
  poissonCd: [
    { label: "x", initial: 0 },
    { label: "λ", initial: 0 },
  ],
};

export const DIST_TITLE: Record<DistKind, string> = {
  normalPd: "Normal PD",
  normalCd: "Normal CD",
  inverseNormal: "Inverse Normal",
  binomialPd: "Binomial PD",
  binomialCd: "Binomial CD",
  poissonPd: "Poisson PD",
  poissonCd: "Poisson CD",
};

/** A distribution's fields on this model: the EX's order unless the model says otherwise. */
export const distFields = (model: ModelSpec, kind: DistKind): DistField[] =>
  model.distFields?.[kind] ?? DIST_FIELDS[kind];

/**
 * The values in the order `distValue` takes them, the EX's, whatever order
 * the model asked for them in.
 */
function inExOrder(model: ModelSpec, kind: DistKind, values: number[]): number[] {
  const asked = distFields(model, kind);
  return DIST_FIELDS[kind].map((field) => {
    const i = asked.findIndex((f) => f.label === field.label);
    return values[i] ?? field.initial;
  });
}

function distValue(kind: DistKind, v: number[]): number {
  const [a = 0, b = 0, c = 0, d = 0] = v;
  switch (kind) {
    case "normalPd":
      return b > 0 ? normalPdf(a, b, c) : NaN;
    case "normalCd":
      return c > 0 ? normalBetween(a, b, c, d) : NaN;
    case "inverseNormal":
      return b > 0 ? inverseNormal(a, b, c) : NaN;
    case "binomialPd":
      return binomialPd(a, b, c);
    case "binomialCd":
      return binomialCd(a, b, c);
    case "poissonPd":
      return poissonPd(a, b);
    case "poissonCd":
      return poissonCd(a, b);
  }
}

function applyAction(s: CalcState, action: Action, back: Screen, model: ModelSpec): CalcState {
  switch (action.do) {
    case "menu":
      return openMenu(s, action.menu, back);
    case "insert":
      return insertTokens({ ...s, screen: { s: "calc" } }, action.toks);
    case "mode": {
      const next = enterMode(s, action.mode);
      return action.then ? applyAction(next, action.then, { s: "calc" }, model) : next;
    }
    case "angle":
      return { ...fresh(s), angle: action.unit, screen: { s: "calc" } };
    case "statType": {
      const next = { ...fresh(s), stat: { kind: action.kind, rows: [] } };
      return model.statInput === "editor"
        ? { ...next, screen: { s: "statEditor", row: 0, col: 0, entry: [] } }
        : { ...next, screen: { s: "calc" } };
    }
    case "statEditor":
      return { ...s, screen: { s: "statEditor", row: 0, col: 0, entry: [] } };
    case "statCalc":
      return { ...fresh(s), screen: { s: "calc" } };
    case "statList":
    case "regList":
      if (s.stat.rows.length === 0) return errorScreen(s, "math", back);
      return {
        ...s,
        screen: { s: "statList", list: action.do === "statList" ? "oneVar" : "reg", top: 0, back },
      };
    case "defineMatrix":
      return {
        ...s,
        matrices: { ...s.matrices, [action.name]: zeros(action.rows, action.cols) },
        screen: { s: "matrixEditor", name: action.name, cell: 0, entry: [] },
      };
    case "askDimension":
      return { ...s, screen: { s: "dimPrompt", name: action.name, rows: null, entry: [] } };
    case "editMatrix":
      if (!s.matrices[action.name]) return errorScreen(s, "dimension", back);
      return { ...s, screen: { s: "matrixEditor", name: action.name, cell: 0, entry: [] } };
    case "eqnType":
      return {
        ...s,
        eqn: { type: action.type, coefs: Array.from({ length: coefCount(action.type) }, () => 0) },
        screen: { s: "eqnEditor", cell: 0, entry: [] },
      };
    case "dist":
      return {
        ...s,
        dist: { kind: action.dist, values: distFields(model, action.dist).map((f) => f.initial) },
        screen: { s: "distEditor", field: 0, entry: [] },
      };
    case "decimal":
      return { ...s, decimal: action.on, screen: { s: "calc" } };
    case "unsupported":
      return { ...s, screen: back, notice: "unsupported" };
  }
}

// ------------------------------------------------------------ screens ----

function onMenu(
  s: CalcState,
  screen: Extract<Screen, { s: "menu" }>,
  key: KeyId,
  model: ModelSpec,
): CalcState {
  if (screen.menu.cursor) {
    const items = screen.menu.pages.flat();
    const columns = screen.menu.columns ?? 1;
    const move = (to: number): CalcState => ({
      ...s,
      screen: { ...screen, index: Math.max(0, Math.min(items.length - 1, to)) },
    });
    switch (key) {
      case "ac":
      case "back":
        return { ...s, screen: screen.back };
      case "up":
        return move(screen.index - columns);
      case "down":
        return move(screen.index + columns);
      case "left":
        return columns > 1 ? move(screen.index - 1) : s;
      case "right":
        return columns > 1 ? move(screen.index + 1) : s;
      case "ok": {
        const chosen = items[screen.index];
        if (!chosen) return s;
        // An option list (the angle unit) stays open with the new option on, as on the CW.
        const { action } = chosen;
        if (action.do === "angle") return { ...fresh(s), angle: action.unit, screen };
        return applyAction(s, action, screen.back, model);
      }
      default:
        return s;
    }
  }
  const pages = screen.menu.pages.length;
  const [back, forward] = model.pageKeys;
  if (key === "ac") return { ...s, screen: screen.back };
  if (key === forward && screen.page < pages - 1) {
    return { ...s, screen: { ...screen, page: screen.page + 1 } };
  }
  if (key === back && screen.page > 0)
    return { ...s, screen: { ...screen, page: screen.page - 1 } };
  const letter = model.letters[key];
  const chosen = screen.menu.pages[screen.page]?.find(
    (entry) => entry.key === key || (letter !== undefined && entry.key === letter),
  );
  return chosen ? applyAction(s, chosen.action, screen.back, model) : s;
}

/** The innermost bracket still open at the end of the line is an exponent. */
function inExponent(input: Tok[]): boolean {
  let depth = 0;
  for (let i = input.length - 1; i >= 0; i--) {
    const tok = input[i]!;
    if (tok.t === "rp") depth++;
    else if (tok.t === "lp" || tok.t === "fn" || tok.t === "pow") {
      if (depth === 0) return tok.t === "pow";
      depth--;
    }
  }
  return false;
}

/** The innermost bracket still open at the end of the line, if it is a template. */
function openTemplate(input: Tok[]): { full: boolean } | null {
  const stack: ({ fn: Fn; args: number } | null)[] = [];
  for (const tok of input) {
    if (tok.t === "lp" || tok.t === "pow") stack.push(null);
    else if (tok.t === "fn") stack.push({ fn: tok.v, args: 1 });
    else if (tok.t === "comma") {
      const top = stack[stack.length - 1];
      if (top) top.args++;
    } else if (tok.t === "rp") stack.pop();
  }
  const top = stack[stack.length - 1];
  const slots = top ? TEMPLATE_SLOTS[top.fn] : undefined;
  return top && slots ? { full: top.args >= slots } : null;
}

function evaluateInput(s: CalcState, decimal: boolean): CalcState {
  if (s.input.length === 0) return s;
  try {
    const value = evaluate(s.input, contextOf(s));
    return {
      ...s,
      result: value,
      resultLabel: null,
      ans: value,
      evaluated: true,
      decimal,
      fractionInput: s.input.some((tok) => tok.t === "frac"),
    };
  } catch (error) {
    return showError(s, error, { s: "calc" });
  }
}

/** STO: work out the line (or take the answer on screen) and keep it in a variable. */
function store(s: CalcState, name: VarName): CalcState {
  let value: Value;
  try {
    value = s.evaluated && s.result !== null ? s.result : evaluate(s.input, contextOf(s));
  } catch (error) {
    return showError(s, error, { s: "calc" });
  }
  if (isMatrix(value)) return errorScreen(s, "math", { s: "calc" });
  const input: Tok[] = [
    ...(s.evaluated ? [{ t: "ans" } as Tok] : s.input),
    { t: "storeTo", v: name },
  ];
  return {
    ...s,
    vars: { ...s.vars, [name]: value },
    input,
    cursor: input.length,
    result: value,
    resultLabel: null,
    ans: value,
    evaluated: true,
    decimal: false,
  };
}

/** DT on the MS: the line is one value (SD) or x , y (REG), added to the data. */
function enterData(s: CalcState, model: ModelSpec): CalcState {
  if (!s.input.length) return s;
  const parts: Tok[][] = [[]];
  let depth = 0;
  for (const tok of s.input) {
    if (tok.t === "lp" || tok.t === "fn" || tok.t === "pow") depth++;
    if (tok.t === "rp") depth--;
    if (tok.t === "comma" && depth === 0) parts.push([]);
    else parts[parts.length - 1]!.push(tok);
  }
  const wanted = s.stat.kind === "1var" ? 1 : 2;
  if (parts.length !== wanted) return errorScreen(s, "syntax", { s: "calc" });
  let values: number[];
  try {
    values = parts.map((part) => cellValue(s, part));
  } catch (error) {
    return showError(s, error, { s: "calc" });
  }
  const capacity = model.statCapacity[s.stat.kind === "1var" ? 0 : 1];
  if (s.stat.rows.length >= capacity) return { ...s, notice: "full" };
  const rows = [...s.stat.rows, { x: values[0]!, y: values[1] ?? 0 }];
  return {
    ...s,
    stat: { ...s.stat, rows },
    result: rows.length,
    resultLabel: "n=",
    evaluated: true,
    decimal: false,
  };
}

function startSolve(s: CalcState): CalcState {
  if (s.mode !== "calc") return unsupported(s);
  if (!s.input.length || !mentionsX(s.input)) return errorScreen(s, "syntax", { s: "calc" });
  return { ...s, evaluated: false, result: null, screen: { s: "solvePrompt", entry: [] } };
}

function runSolve(s: CalcState): CalcState {
  let solution;
  try {
    const f = equationOf(s.input, contextOf(s));
    f(s.vars.X);
    solution = newtonSolve(f, s.vars.X);
  } catch (error) {
    if (error instanceof CalcError && error.kind === "syntax")
      return showError(s, error, { s: "calc" });
    solution = null;
  }
  if (!solution) return errorScreen(s, "cantSolve", { s: "calc" });
  return {
    ...s,
    vars: { ...s.vars, X: solution.x },
    screen: { s: "solveResult", x: solution.x, residual: solution.residual },
  };
}

function onCalc(
  s: CalcState,
  key: KeyId,
  shift: boolean,
  alpha: boolean,
  model: ModelSpec,
): CalcState {
  if (s.pending) {
    const letter = letterFor(key, model);
    const next = { ...s, pending: null };
    if (!letter) return next;
    if (s.pending === "sto") return store(next, letter);
    const value = s.vars[letter];
    const input: Tok[] = [{ t: "var", v: letter }];
    return {
      ...next,
      input,
      cursor: 1,
      result: value,
      resultLabel: null,
      evaluated: true,
      decimal: false,
    };
  }

  // STO and RCL: STO is its own key on the EX, SHIFT RCL elsewhere.
  if (key === (model.storeOnSto ? "sto" : "rcl")) {
    const storing = model.storeOnSto ? !shift : shift;
    return { ...s, pending: storing ? "sto" : "rcl" };
  }

  if (alpha) {
    const letter = model.letters[key];
    if (letter) return insertTokens(s, [{ t: "var", v: letter }]);
    if (key === "calc") return insertTokens(s, [{ t: "equals" }]);
  }

  if (key === "calc") return shift ? startSolve(s) : unsupported(s);
  if (key === "integral") {
    if (s.mode !== "calc") return unsupported(s);
    return insertTokens(s, [{ t: "fn", v: shift ? "deriv" : "integral" }]);
  }

  // DT: on the MS, M+ enters data in SD and REG.
  if (key === "mplus" && s.mode === "stat" && model.statInput === "dt" && !shift) {
    return enterData(s, model);
  }

  // a b/c on the MS turns an answer into a fraction and back.
  if (
    key === "frac" &&
    s.evaluated &&
    !model.autoFractions &&
    s.result !== null &&
    !isMatrix(s.result)
  ) {
    const showing = s.fractionInput && !s.decimal;
    if (showing) return { ...s, decimal: true };
    return toFraction(s.result) ? { ...s, fractionInput: true, decimal: false } : s;
  }

  switch (key) {
    case "ac":
      return fresh(s);
    case "del":
      if (s.evaluated) {
        const input = s.input.slice(0, -1);
        return {
          ...s,
          input,
          cursor: input.length,
          result: null,
          resultLabel: null,
          evaluated: false,
        };
      }
      if (s.cursor === 0) return s;
      return {
        ...s,
        input: [...s.input.slice(0, s.cursor - 1), ...s.input.slice(s.cursor)],
        cursor: s.cursor - 1,
      };
    case "left":
      if (s.evaluated)
        return { ...s, result: null, resultLabel: null, evaluated: false, cursor: s.input.length };
      return { ...s, cursor: Math.max(0, s.cursor - 1) };
    case "right": {
      if (s.evaluated)
        return { ...s, result: null, resultLabel: null, evaluated: false, cursor: 0 };
      if (model.templates && s.cursor === s.input.length) {
        // ▶ leaves an exponent box first.
        if (inExponent(s.input)) return insertTokens(s, [{ t: "rp" }]);
        // In a template, ▶ moves to the next box, and out of the last one.
        const open = openTemplate(s.input);
        if (open) return insertTokens(s, [open.full ? { t: "rp" } : { t: "comma" }]);
      }
      return { ...s, cursor: Math.min(s.input.length, s.cursor + 1) };
    }
    case "up":
    case "down": {
      // On the CW, ▼ goes from ∫'s expression to its lower limit and ▲ on to the upper.
      if (model.verticalTemplates && !s.evaluated && s.cursor === s.input.length) {
        const open = openTemplate(s.input);
        if (open && !open.full) return insertTokens(s, [{ t: "comma" }]);
      }
      return s;
    }
    case "sd":
      return s.result === null || shift ? s : { ...s, decimal: !s.decimal };
    case "eq":
      // SHIFT = (≈ on the EX) asks for the decimal straight away.
      return evaluateInput(s, shift);
  }
  const toks = tokensFor(key, shift, alpha, model);
  return toks ? insertTokens(s, toks) : unsupported(s);
}

function onStatEditor(
  s: CalcState,
  screen: Extract<Screen, { s: "statEditor" }>,
  key: KeyId,
  shift: boolean,
  alpha: boolean,
  model: ModelSpec,
): CalcState {
  const rows = s.stat.rows;
  const cols = s.stat.kind === "lin" ? 2 : 1;
  const at = (row: number, col = screen.col, entry: Tok[] = []): CalcState => ({
    ...s,
    screen: {
      s: "statEditor",
      row: Math.max(0, Math.min(rows.length, row)),
      col: Math.max(0, Math.min(cols - 1, col)),
      entry,
    },
  });
  switch (key) {
    case "ac":
      return screen.entry.length ? at(screen.row) : { ...fresh(s), screen: { s: "calc" } };
    case "up":
      return at(screen.row - 1);
    case "down":
      // On the CW, ▼ from the empty row at the bottom goes back to the top.
      return model.editorWraps && screen.row >= rows.length ? at(0) : at(screen.row + 1);
    case "left":
      return at(screen.row, screen.col - 1);
    case "right":
      return at(screen.row, screen.col + 1);
    case "del":
      if (screen.entry.length) return at(screen.row, screen.col, screen.entry.slice(0, -1));
      if (screen.row >= rows.length) return s;
      return {
        ...s,
        stat: { ...s.stat, rows: rows.filter((_, i) => i !== screen.row) },
        screen: { ...screen, row: Math.min(screen.row, rows.length - 1) },
      };
    case "eq": {
      if (!screen.entry.length) return s;
      try {
        const x = cellValue(s, screen.entry);
        const appending = screen.row >= rows.length;
        const capacity = model.statCapacity[cols - 1]!;
        if (appending && rows.length >= capacity) return { ...at(screen.row), notice: "full" };
        const field = screen.col === 0 ? "x" : "y";
        const next = appending
          ? [...rows, { x: 0, y: 0, [field]: x }]
          : rows.map((row, i) => (i === screen.row ? { ...row, [field]: x } : row));
        return {
          ...s,
          stat: { ...s.stat, rows: next },
          screen: { s: "statEditor", row: screen.row + 1, col: screen.col, entry: [] },
        };
      } catch (error) {
        return showError(s, error, { ...screen, entry: [] });
      }
    }
  }
  const toks = tokensFor(key, shift, alpha, model);
  return toks ? at(screen.row, screen.col, [...screen.entry, ...toks]) : unsupported(s);
}

function onMatrixEditor(
  s: CalcState,
  screen: Extract<Screen, { s: "matrixEditor" }>,
  key: KeyId,
  shift: boolean,
  alpha: boolean,
  model: ModelSpec,
): CalcState {
  const m = s.matrices[screen.name] ?? [[0]];
  const width = m[0]?.length ?? 1;
  const last = m.length * width - 1;
  const at = (cell: number, entry: Tok[] = []): CalcState => ({
    ...s,
    screen: { ...screen, cell: Math.max(0, Math.min(last, cell)), entry },
  });
  switch (key) {
    case "ac":
      return screen.entry.length ? at(screen.cell) : { ...fresh(s), screen: { s: "calc" } };
    case "left":
      return at(screen.cell - 1);
    case "right":
      return at(screen.cell + 1);
    case "up":
      return at(screen.cell - (model.prompts ? 1 : width));
    case "down":
      return at(screen.cell + (model.prompts ? 1 : width));
    case "del":
      return at(screen.cell, screen.entry.slice(0, -1));
    case "eq": {
      if (!screen.entry.length) return model.prompts ? at(screen.cell + 1) : s;
      try {
        const x = cellValue(s, screen.entry);
        const r = Math.floor(screen.cell / width);
        const c = screen.cell % width;
        const next = m.map((row, i) => row.map((value, j) => (i === r && j === c ? x : value)));
        return {
          ...s,
          matrices: { ...s.matrices, [screen.name]: next },
          screen: { ...screen, cell: Math.min(last, screen.cell + 1), entry: [] },
        };
      } catch (error) {
        return showError(s, error, { ...screen, entry: [] });
      }
    }
  }
  const toks = tokensFor(key, shift, alpha, model);
  return toks ? at(screen.cell, [...screen.entry, ...toks]) : unsupported(s);
}

function onDimPrompt(
  s: CalcState,
  screen: Extract<Screen, { s: "dimPrompt" }>,
  key: KeyId,
  shift: boolean,
  alpha: boolean,
  model: ModelSpec,
): CalcState {
  if (key === "ac") return { ...fresh(s), screen: { s: "calc" } };
  if (key === "del") return { ...s, screen: { ...screen, entry: screen.entry.slice(0, -1) } };
  if (key === "eq") {
    if (!screen.entry.length) return s;
    let n: number;
    try {
      n = cellValue(s, screen.entry);
    } catch (error) {
      return showError(s, error, { ...screen, entry: [] });
    }
    if (!Number.isInteger(n) || n < 1 || n > 3)
      return errorScreen(s, "math", { ...screen, entry: [] });
    if (screen.rows === null) return { ...s, screen: { ...screen, rows: n, entry: [] } };
    return applyAction(
      s,
      { do: "defineMatrix", name: screen.name, rows: screen.rows, cols: n },
      { s: "calc" },
      model,
    );
  }
  const toks = tokensFor(key, shift, alpha, model);
  return toks ? { ...s, screen: { ...screen, entry: [...screen.entry, ...toks] } } : unsupported(s);
}

function solveEquations(s: CalcState, model: ModelSpec): CalcState {
  const { type, coefs } = s.eqn;
  const back: Screen = { s: "eqnEditor", cell: 0, entry: [] };
  if (type.kind === "linear") {
    const width = type.n + 1;
    const rows = Array.from({ length: type.n }, (_, i) =>
      coefs.slice(i * width, i * width + width),
    );
    const answer = solveLinear(rows);
    if (typeof answer === "string") {
      return model.eqnMessages
        ? { ...s, screen: { s: "eqnResult", index: 0, roots: answer } }
        : errorScreen(s, "math", back);
    }
    return {
      ...s,
      decimal: false,
      screen: { s: "eqnResult", index: 0, roots: answer.map((re) => ({ re, im: 0 })) },
    };
  }
  const roots = solvePolynomial(coefs);
  if (!roots) return errorScreen(s, "math", back);
  return { ...s, decimal: false, screen: { s: "eqnResult", index: 0, roots } };
}

function onEqnEditor(
  s: CalcState,
  screen: Extract<Screen, { s: "eqnEditor" }>,
  key: KeyId,
  shift: boolean,
  alpha: boolean,
  model: ModelSpec,
): CalcState {
  const type = s.eqn.type;
  const last = coefCount(type) - 1;
  const width = type.kind === "linear" ? type.n + 1 : type.degree + 1;
  const at = (cell: number, entry: Tok[] = []): CalcState => ({
    ...s,
    screen: { s: "eqnEditor", cell: Math.max(0, Math.min(last, cell)), entry },
  });
  switch (key) {
    case "ac":
      if (screen.entry.length) return at(screen.cell);
      return {
        ...s,
        eqn: { ...s.eqn, coefs: s.eqn.coefs.map(() => 0) },
        screen: { ...screen, cell: 0 },
      };
    case "left":
      return model.prompts ? s : at(screen.cell - 1);
    case "right":
      return model.prompts ? s : at(screen.cell + 1);
    case "up":
      return at(screen.cell - (model.prompts ? 1 : width));
    case "down":
      return at(screen.cell + (model.prompts ? 1 : width));
    case "del":
      return at(screen.cell, screen.entry.slice(0, -1));
    case "eq": {
      if (!screen.entry.length) {
        if (model.prompts && screen.cell < last) return at(screen.cell + 1);
        return solveEquations(s, model);
      }
      let x: number;
      try {
        x = cellValue(s, screen.entry);
      } catch (error) {
        return showError(s, error, { ...screen, entry: [] });
      }
      const next = {
        ...s,
        eqn: { ...s.eqn, coefs: s.eqn.coefs.map((c, i) => (i === screen.cell ? x : c)) },
      };
      // The MS solves the moment its last coefficient is entered.
      if (model.prompts && screen.cell === last) return solveEquations(next, model);
      return {
        ...next,
        screen: { s: "eqnEditor", cell: Math.min(last, screen.cell + 1), entry: [] },
      };
    }
  }
  const toks = tokensFor(key, shift, alpha, model);
  return toks ? at(screen.cell, [...screen.entry, ...toks]) : unsupported(s);
}

function onEqnResult(
  s: CalcState,
  screen: Extract<Screen, { s: "eqnResult" }>,
  key: KeyId,
): CalcState {
  const count = Array.isArray(screen.roots) ? screen.roots.length : 1;
  const editor: Screen = { s: "eqnEditor", cell: 0, entry: [] };
  switch (key) {
    case "ac":
      return { ...s, screen: editor };
    case "down":
      return { ...s, screen: { ...screen, index: Math.min(count - 1, screen.index + 1) } };
    case "up":
      return { ...s, screen: { ...screen, index: Math.max(0, screen.index - 1) } };
    case "eq":
      // Each = shows the next solution; after the last, back to the coefficients.
      return screen.index < count - 1
        ? { ...s, screen: { ...screen, index: screen.index + 1 } }
        : { ...s, screen: editor };
    case "sd":
      return { ...s, decimal: !s.decimal };
  }
  return s;
}

function onDistEditor(
  s: CalcState,
  screen: Extract<Screen, { s: "distEditor" }>,
  key: KeyId,
  shift: boolean,
  alpha: boolean,
  model: ModelSpec,
): CalcState {
  const last = distFields(model, s.dist.kind).length - 1;
  const at = (field: number, entry: Tok[] = []): CalcState => ({
    ...s,
    screen: { s: "distEditor", field: Math.max(0, Math.min(last, field)), entry },
  });
  const work = (): CalcState => {
    const value = distValue(s.dist.kind, inExOrder(model, s.dist.kind, s.dist.values));
    if (!Number.isFinite(value)) return errorScreen(s, "math", { ...screen });
    return { ...s, ans: value, screen: { s: "distResult", value } };
  };
  switch (key) {
    // The CW: Execute, with OK.
    case "ok":
      return screen.entry.length ? s : work();
    case "ac":
      return at(screen.field);
    case "up":
      return at(screen.field - 1);
    case "down":
      return at(screen.field + 1);
    case "del":
      return at(screen.field, screen.entry.slice(0, -1));
    case "eq": {
      if (!screen.entry.length) {
        if (screen.field < last) return at(screen.field + 1);
        return work();
      }
      let x: number;
      try {
        x = cellValue(s, screen.entry);
      } catch (error) {
        return showError(s, error, { ...screen, entry: [] });
      }
      const values = s.dist.values.map((v, i) => (i === screen.field ? x : v));
      return {
        ...s,
        dist: { ...s.dist, values },
        screen: { s: "distEditor", field: Math.min(last, screen.field + 1), entry: [] },
      };
    }
  }
  const toks = tokensFor(key, shift, alpha, model);
  return toks ? at(screen.field, [...screen.entry, ...toks]) : unsupported(s);
}

function onSolvePrompt(
  s: CalcState,
  screen: Extract<Screen, { s: "solvePrompt" }>,
  key: KeyId,
  shift: boolean,
  alpha: boolean,
  model: ModelSpec,
): CalcState {
  if (key === "ac") return { ...s, screen: { s: "calc" }, cursor: s.input.length };
  if (key === "calc" && shift) return runSolve(s);
  if (key === "del") return { ...s, screen: { ...screen, entry: screen.entry.slice(0, -1) } };
  if (key === "eq") {
    let next = s;
    if (screen.entry.length) {
      try {
        next = { ...s, vars: { ...s.vars, X: cellValue(s, screen.entry) } };
      } catch (error) {
        return showError(s, error, { ...screen, entry: [] });
      }
    }
    if (model.solveRuns === "afterStart") return runSolve(next);
    return { ...next, screen: { s: "solvePrompt", entry: [] } };
  }
  const toks = tokensFor(key, shift, alpha, model);
  return toks ? { ...s, screen: { ...screen, entry: [...screen.entry, ...toks] } } : unsupported(s);
}

/** Rows the EX's 1-Variable results screen lists, in its order. */
const STAT_LIST: [string, (r: NonNullable<ReturnType<typeof oneVariable>>) => number][] = [
  ["x̄", (r) => r.mean],
  ["Σx", (r) => r.sumX],
  ["Σx²", (r) => r.sumX2],
  ["σ²x", (r) => r.popVar],
  ["σx", (r) => r.popSd],
  ["s²x", (r) => r.sampleVar],
  ["sx", (r) => r.sampleSd],
  ["n", (r) => r.n],
  ["min(x)", (r) => r.min],
  ["Q₁", (r) => r.q1],
  ["Med", (r) => r.median],
  ["Q₃", (r) => r.q3],
  ["max(x)", (r) => r.max],
];

/** Rows of a results list visible at once (six, as on the EX). */
export const STAT_LIST_ROWS = 6;

function listRows(
  s: CalcState,
  list: "oneVar" | "reg",
  format: (x: number) => string = formatDecimal,
): { label: string; value: string }[] {
  const show = (x: number) => (Number.isNaN(x) ? "ERROR" : format(x));
  if (list === "reg") {
    const t = twoVariable(s.stat.rows);
    return [
      { label: "a", value: show(t?.a ?? NaN) },
      { label: "b", value: show(t?.b ?? NaN) },
      { label: "r", value: show(t?.r ?? NaN) },
    ];
  }
  const r = oneVariable(s.stat.rows.map((row) => row.x));
  return STAT_LIST.map(([label, pick]) => ({ label, value: show(r ? pick(r) : NaN) }));
}

export function press(prev: CalcState, pressed: KeyId): CalcState {
  let key = pressed;
  const model = MODELS[prev.model];
  let s: CalcState = { ...prev, notice: null };
  if (key === "shift") return { ...s, shift: !s.shift, alpha: false };
  if (key === "alpha") return { ...s, alpha: !s.alpha, shift: false };
  const { shift, alpha } = s;
  s = { ...s, shift: false, alpha: false };

  if (key === "on") return { ...fresh(s), pending: null, screen: { s: "calc" } };
  if (key === model.settingsKey) {
    if (!model.setupMenu) return unsupported(s);
    const back: Screen = s.screen.s === "menu" ? { s: "calc" } : s.screen;
    return openMenu({ ...s, pending: null }, model.setupMenu, back);
  }
  // BACK leaves a menu, a list or an answer, as AC does there; elsewhere it does nothing here.
  if (key === "back") {
    const leaves = ["menu", "statList", "eqnResult", "distResult", "error"];
    if (!leaves.includes(s.screen.s)) return s;
    key = "ac";
  }
  if (key === model.menuKey) {
    const screen = s.screen;
    // The MS turns the MODE menu's pages by pressing MODE again.
    if (!shift && model.modeCycles && screen.s === "menu" && screen.menu === model.mainMenu) {
      return { ...s, screen: { ...screen, page: (screen.page + 1) % screen.menu.pages.length } };
    }
    const menu = shift ? model.setupMenu : model.mainMenu;
    if (!menu) return unsupported(s);
    const back: Screen =
      screen.s === "menu" ||
      screen.s === "error" ||
      screen.s.endsWith("Result") ||
      screen.s.endsWith("Prompt")
        ? { s: "calc" }
        : screen;
    return openMenu({ ...s, pending: null }, menu, back);
  }

  const screen = s.screen;
  switch (screen.s) {
    case "menu":
      return onMenu(s, screen, key, model);
    case "error":
      if (key === "ac") {
        return screen.back.s === "calc"
          ? fresh({ ...s, screen: screen.back })
          : { ...s, screen: screen.back };
      }
      if ((key === "left" || key === "right") && screen.back.s === "calc") {
        return {
          ...s,
          screen: { s: "calc" },
          evaluated: false,
          result: null,
          cursor: s.input.length,
        };
      }
      return s;
    case "statList": {
      if (key === "ac") return { ...s, screen: screen.back };
      const max = Math.max(0, listRows(s, screen.list).length - STAT_LIST_ROWS);
      if (key === "down")
        return { ...s, screen: { ...screen, top: Math.min(max, screen.top + 1) } };
      if (key === "up") return { ...s, screen: { ...screen, top: Math.max(0, screen.top - 1) } };
      return s;
    }
    case "eqnResult":
      return onEqnResult(s, screen, key);
    case "distResult":
      return key === "ac" || key === "eq" || key === "ok"
        ? { ...s, screen: { s: "distEditor", field: 0, entry: [] } }
        : s;
    case "solveResult":
      if (key === "ac") return { ...s, screen: { s: "calc" }, cursor: s.input.length };
      if (key === "eq") return { ...s, screen: { s: "solvePrompt", entry: [] } };
      return s;
    case "solvePrompt":
      return onSolvePrompt(s, screen, key, shift, alpha, model);
    case "dimPrompt":
      return onDimPrompt(s, screen, key, shift, alpha, model);
  }

  const menu = contextMenu(s, key, shift, model);
  if (menu !== undefined) return menu ? openMenu(s, menu, screen) : unsupported(s);

  switch (screen.s) {
    case "statEditor":
      return onStatEditor(s, screen, key, shift, alpha, model);
    case "matrixEditor":
      return onMatrixEditor(s, screen, key, shift, alpha, model);
    case "eqnEditor":
      return onEqnEditor(s, screen, key, shift, alpha, model);
    case "distEditor":
      return onDistEditor(s, screen, key, shift, alpha, model);
    case "calc":
      return onCalc(s, key, shift, alpha, model);
  }
}

// ------------------------------------------------------------ display ----

export type ResultView =
  { kind: "number"; text: string; canToggle: boolean } | { kind: "matrix"; cells: string[][] };

export type DisplayBody =
  | {
      kind: "calc";
      input: string[];
      cursor: number | null;
      result: ResultView | null;
      label: string | null;
    }
  | {
      kind: "menu";
      title?: string;
      items: { key: string; label: string }[];
      page: number;
      pages: number;
      /** In a cursor menu: the highlighted item among `items`, and how many across. */
      selected: number | null;
      columns: number;
    }
  | {
      kind: "table";
      title?: string;
      columns: string[];
      rows: { head: string; cells: string[]; active: number | null }[];
      entry: string | null;
    }
  | {
      kind: "list";
      title?: string;
      rows: { label: string; value: string }[];
      top: number;
      total: number;
    }
  | {
      kind: "matrixEditor";
      name: string;
      cells: { text: string; active: boolean }[][];
      entry: string | null;
    }
  | { kind: "prompt"; title: string; value: string; entry: string | null }
  | { kind: "answer"; lines: string[]; label: string; value: string; note?: string }
  | { kind: "error"; title: string; hints: string[] };

export interface DisplayModel {
  shift: boolean;
  alpha: boolean;
  angle: "D" | "R";
  mode: string;
  /** STO or RCL is waiting for a variable. */
  pending: "STO" | "RCL" | null;
  body: DisplayBody;
}

const ERROR_TITLE: Record<ErrorKind, string> = {
  syntax: "Syntax ERROR",
  math: "Math ERROR",
  dimension: "Dimension ERROR",
  cantSolve: "Can't Solve",
};

function modeLabel(s: CalcState, model: ModelSpec): string {
  switch (s.mode) {
    case "stat":
      if (model.statInput === "dt") return s.stat.kind === "1var" ? "SD" : "REG";
      return "STAT";
    case "matrix":
      return "MAT";
    case "eqn":
      return "EQN";
    case "dist":
      return "DIST";
    default:
      return "";
  }
}

const coefName = (type: EqnType, cell: number): string => {
  const letters = "abcd";
  if (type.kind === "poly") return letters[cell] ?? "?";
  const width = type.n + 1;
  return `${letters[cell % width]}${Math.floor(cell / width) + 1}`;
};

function rootLabel(type: EqnType, index: number, model: ModelSpec): string {
  const name = type.kind === "linear" ? ["X", "Y", "Z"][index]! : `X${index + 1}`;
  return `${model.lowerXY || model.prompts ? name.toLowerCase() : name}=`;
}

/** What the screen shows: the interface draws this and nothing else. */
export function display(s: CalcState): DisplayModel {
  const model = MODELS[s.model];
  const style: TextStyle = { lowerXY: model.lowerXY, msFraction: !model.autoFractions };
  const text = (toks: Tok[]) => toks.map((tok) => tokenText(tok, style)).join("");
  const entryText = (entry: Tok[]): string | null => (entry.length ? text(entry) : null);
  const fractionStyle = model.autoFractions ? "slash" : "ms";
  const showNumber = (x: number, decimal: boolean) => formatNumber(x, decimal, fractionStyle);
  // On the MS the 0 before a point takes one of the ten digit places.
  const dec = (x: number) => formatDecimal(x, !model.autoFractions);
  const head = {
    shift: s.shift,
    alpha: s.alpha,
    angle: s.angle === "deg" ? ("D" as const) : ("R" as const),
    mode: modeLabel(s, model),
    pending: s.pending === "sto" ? ("STO" as const) : s.pending === "rcl" ? ("RCL" as const) : null,
  };
  const X = model.lowerXY ? "x" : "X";
  const screen = s.screen;

  switch (screen.s) {
    case "calc": {
      let result: ResultView | null = null;
      if (s.result !== null) {
        const decimal = s.decimal || !(model.autoFractions || s.fractionInput);
        result = isMatrix(s.result)
          ? { kind: "matrix", cells: s.result.map((row) => row.map((x) => showNumber(x, decimal))) }
          : {
              kind: "number",
              text: showNumber(s.result, decimal),
              canToggle: toFraction(s.result) !== null,
            };
      }
      return {
        ...head,
        body: {
          kind: "calc",
          input: s.input.map((tok) => tokenText(tok, style)),
          cursor: s.evaluated ? null : s.cursor,
          result,
          label: s.resultLabel,
        },
      };
    }
    case "menu": {
      if (screen.menu.cursor) {
        // What fits on screen: four lines of a list, two rows of the HOME grid,
        // scrolled as little as keeps the highlight in view.
        const all = screen.menu.pages.flat();
        const columns = screen.menu.columns ?? 1;
        const rows = columns > 1 ? 2 : 4;
        const row = Math.floor(screen.index / columns);
        const top = Math.max(0, row - rows + 1);
        const shown = all.slice(top * columns, (top + rows) * columns);
        return {
          ...head,
          body: {
            kind: "menu",
            title: screen.menu.title,
            items: shown.map(({ label }) => ({ key: "", label })),
            page: 0,
            pages: 1,
            selected: screen.index - top * columns,
            columns,
          },
        };
      }
      return {
        ...head,
        body: {
          kind: "menu",
          title: screen.menu.title,
          items: (screen.menu.pages[screen.page] ?? []).map(({ key, label }) => ({ key, label })),
          page: screen.page,
          pages: screen.menu.pages.length,
          selected: null,
          columns: 1,
        },
      };
    }
    case "statEditor": {
      const lin = s.stat.kind === "lin";
      const name = (c: string) => (model.lowerXY ? c : c.toUpperCase());
      return {
        ...head,
        body: {
          kind: "table",
          columns: lin ? [name("x"), name("y")] : [name("x")],
          rows: [...s.stat.rows, null].map((row, i) => ({
            head: String(i + 1),
            cells: lin ? [row ? dec(row.x) : "", row ? dec(row.y) : ""] : [row ? dec(row.x) : ""],
            active: i === screen.row ? screen.col : null,
          })),
          entry: entryText(screen.entry),
        },
      };
    }
    case "statList": {
      const rows = listRows(s, screen.list, dec);
      return {
        ...head,
        body: {
          kind: "list",
          title: screen.list === "reg" ? "y=a+bx" : undefined,
          rows,
          top: screen.top,
          total: rows.length,
        },
      };
    }
    case "matrixEditor": {
      const m = s.matrices[screen.name] ?? [[0]];
      const width = m[0]?.length ?? 1;
      if (model.prompts) {
        const r = Math.floor(screen.cell / width);
        const c = screen.cell % width;
        return {
          ...head,
          body: {
            kind: "prompt",
            title: `Mat${screen.name}${r + 1}${c + 1}`,
            value: dec(m[r]?.[c] ?? 0),
            entry: entryText(screen.entry),
          },
        };
      }
      return {
        ...head,
        body: {
          kind: "matrixEditor",
          name: `Mat${screen.name}`,
          cells: m.map((row, i) =>
            row.map((x, j) => ({
              text: showNumber(x, false),
              active: i * width + j === screen.cell,
            })),
          ),
          entry: entryText(screen.entry),
        },
      };
    }
    case "dimPrompt":
      return {
        ...head,
        body: {
          kind: "prompt",
          title: screen.rows === null ? `Mat ${screen.name}(m×n) m?` : "n?",
          value: "0",
          entry: entryText(screen.entry),
        },
      };
    case "eqnEditor": {
      const type = s.eqn.type;
      if (model.prompts) {
        return {
          ...head,
          body: {
            kind: "prompt",
            title: `${coefName(type, screen.cell)}?`,
            value: dec(s.eqn.coefs[screen.cell] ?? 0),
            entry: entryText(screen.entry),
          },
        };
      }
      const width = type.kind === "linear" ? type.n + 1 : type.degree + 1;
      const count = type.kind === "linear" ? type.n : 1;
      return {
        ...head,
        body: {
          kind: "table",
          columns: "abcd".slice(0, width).split(""),
          rows: Array.from({ length: count }, (_, r) => ({
            head: type.kind === "linear" ? String(r + 1) : "",
            cells: s.eqn.coefs.slice(r * width, r * width + width).map((c) => showNumber(c, false)),
            active: Math.floor(screen.cell / width) === r ? screen.cell % width : null,
          })),
          entry: entryText(screen.entry),
        },
      };
    }
    case "eqnResult": {
      if (!Array.isArray(screen.roots)) {
        return {
          ...head,
          body: {
            kind: "answer",
            lines: [],
            label: "",
            value: screen.roots === "none" ? "No Solution" : "Infinite Solution",
          },
        };
      }
      const root = screen.roots[screen.index] ?? { re: 0, im: 0 };
      return {
        ...head,
        body: {
          kind: "answer",
          lines: [],
          label: rootLabel(s.eqn.type, screen.index, model),
          value:
            root.im === 0
              ? showNumber(root.re, s.decimal || !model.autoFractions)
              : formatComplex(root.re, root.im, s.decimal || !model.autoFractions),
          note: `${screen.index + 1}/${screen.roots.length}`,
        },
      };
    }
    case "distEditor": {
      const fields = distFields(model, s.dist.kind);
      return {
        ...head,
        body: {
          kind: "table",
          title: DIST_TITLE[s.dist.kind],
          columns: [],
          rows: fields.map((f, i) => ({
            head: f.label,
            cells: [dec(s.dist.values[i] ?? f.initial)],
            active: i === screen.field ? 0 : null,
          })),
          entry: entryText(screen.entry),
        },
      };
    }
    case "distResult":
      return {
        ...head,
        body: {
          kind: "answer",
          lines: [DIST_TITLE[s.dist.kind]],
          label: s.dist.kind === "inverseNormal" ? "xInv=" : "p=",
          value: dec(screen.value),
        },
      };
    case "solvePrompt":
      return {
        ...head,
        body: {
          kind: "prompt",
          title: model.solveRuns === "secondPress" ? `${X}?` : `Solve for ${X}`,
          value: dec(s.vars.X),
          entry: entryText(screen.entry),
        },
      };
    case "solveResult":
      return {
        ...head,
        body: {
          kind: "answer",
          lines: [text(s.input)],
          label: `${X}=`,
          value: dec(screen.x),
          note: `L−R=${dec(screen.residual)}`,
        },
      };
    case "error":
      return {
        ...head,
        body: {
          kind: "error",
          title: ERROR_TITLE[screen.kind],
          hints: ["[AC] :Cancel", "[◀][▶] :Goto"],
        },
      };
  }
}
