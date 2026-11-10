import type { MatName, Tok } from "./expression";

/** Every key on any of the keyboards. A model lays out the ones it has. */
export type KeyId =
  | "shift"
  | "alpha"
  | "up"
  | "down"
  | "left"
  | "right"
  | "menu"
  | "mode"
  | "on"
  | "optn"
  | "calc"
  | "integral"
  | "x"
  | "frac"
  | "sqrt"
  | "sq"
  | "cube"
  | "pow"
  | "logb"
  | "log"
  | "ln"
  | "neg"
  | "dms"
  | "hyp"
  | "abs"
  | "inv"
  | "sin"
  | "cos"
  | "tan"
  | "sto"
  | "rcl"
  | "eng"
  | "const"
  | "lp"
  | "rp"
  | "comma"
  | "sd"
  | "mplus"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "dot"
  | "exp10"
  | "ans"
  | "eq"
  | "del"
  | "ac"
  | "plus"
  | "minus"
  | "times"
  | "divide";

export type ModelId = "fx991ex" | "fx991esplus" | "fx570ms" | "fx82esplus";

export type CalcMode = "calc" | "stat" | "matrix" | "eqn" | "dist";

/** One list of numbers, or pairs for the line y = a + bx. */
export type StatKind = "1var" | "lin";

export type EqnType = { kind: "linear"; n: 2 | 3 } | { kind: "poly"; degree: 2 | 3 };

export type DistKind =
  | "normalPd"
  | "normalCd"
  | "inverseNormal"
  | "binomialPd"
  | "binomialCd"
  | "poissonPd"
  | "poissonCd";

/** What choosing a menu item does. Interpreted by the machine. */
export type Action =
  | { do: "menu"; menu: Menu }
  | { do: "insert"; toks: Tok[] }
  | { do: "mode"; mode: CalcMode; then?: Action }
  | { do: "angle"; unit: "deg" | "rad" }
  | { do: "statType"; kind: StatKind }
  | { do: "statEditor" }
  | { do: "statCalc" }
  | { do: "statList" }
  | { do: "regList" }
  | { do: "defineMatrix"; name: MatName; rows: number; cols: number }
  /** The MS asks for the size as two numbers: m? then n?. */
  | { do: "askDimension"; name: MatName }
  | { do: "editMatrix"; name: MatName }
  | { do: "eqnType"; type: EqnType }
  | { do: "dist"; dist: DistKind }
  /** A real item on the device that this simulation does not model. */
  | { do: "unsupported" };

export interface MenuItem {
  /** The key that picks it, as printed on the screen: "1"…"9", or "A"–"C" on the EX. */
  key: string;
  label: string;
  action: Action;
}

export interface Menu {
  title?: string;
  /** Pages, turned with the model's page keys; numbering restarts on each page. */
  pages: MenuItem[][];
}

export interface KeyDef {
  id: KeyId;
  label: string;
  /** Printed above the key: what it does after SHIFT. */
  shift?: string;
  /** Printed above the key: what it does after ALPHA. */
  alpha?: string;
  /** How the key is drawn. */
  tone?: "modifier" | "function" | "digit" | "operator" | "clear" | "equals" | "nav";
}
