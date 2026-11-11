import type { MatName, StatVar, Tok, VarName } from "./expression";
import type {
  Action,
  CalcMode,
  DistKind,
  DistField,
  EqnType,
  KeyDef,
  KeyId,
  Menu,
  MenuItem,
  ModelId,
  StatKind,
} from "./types";

/**
 * The calculators, as data: their keyboards and their menus.
 *
 * ## Where this comes from
 *
 * A wrong menu number here is a student pressing the wrong key in an exam, so
 * nothing is written from memory:
 *
 * - **Keyboards**: Casio's own product photographs of each model, key by key,
 *   with the SHIFT (amber) and ALPHA (rose) labels printed above them.
 * - **fx-991EX**: Casio's *fx-991EX Quick Start Guide* (US). MENU 4 Matrix,
 *   6 Statistics, 7 Distribution, A Equation/Func; OPTN ▼ 2 Determinant;
 *   OPTN 3 1-Variable Calc and OPTN 4 Regression Calc from the data editor;
 *   SHIFT MENU 2 2 Radian; ∫ and d/dx filled box by box with ▶.
 * - **fx-991ES PLUS**: Casio's online manual. MODE 3 STAT, 5 EQN, 6 MATRIX;
 *   SHIFT 1 Type/Data/Sum/Var/Distr (Reg for pairs)/MinMax; SHIFT 4 Dim,
 *   Data, MatA–C, MatAns, det, Trn.
 * - **fx-82ES PLUS**: Casio's online manual. MODE has only COMP, STAT and
 *   TABLE: no EQN, no matrices, no ∫, d/dx or SOLVE, and no Distr.
 * - **fx-570MS / 991MS**: Casio's *User's Guide* (2nd edition). MODE pressed
 *   again turns the page: COMP, then SD/REG/BASE, then EQN/MAT/VCT, then
 *   Deg/Rad/Gra. Data goes in with DT (the M+ key). SHIFT 1 S-SUM, 2 S-VAR,
 *   3 DISTR, 4 MAT, with ▶ for the next page of a menu.
 * - **fx-82MS**: Casio's *User's Guide* (2nd edition, fx-82MS/85MS/300MS/
 *   350MS). MODE 1 COMP, 2 SD, 3 REG; pressing MODE again reaches Deg/Rad/
 *   Gra, then Fix/Sci/Norm, then Disp. REG: 1 Lin, 2 Log, 3 Exp, ▶ Pwr/Inv/
 *   Quad. SHIFT 1 S-SUM and SHIFT 2 S-VAR as on the 570MS; no DISTR, no EQN,
 *   no matrices, no ∫, d/dx or SOLVE. nCr has a key of its own (SHIFT: nPr).
 *
 * Items that exist on a device but are not simulated say so when picked
 * (`unsupported`) rather than doing something the device would not. Where a
 * source does not give an item's number, the item is left out, so a menu may
 * have a gap in its numbering.
 *
 * - **fx-991CW / 570CW**: Casio's online *User's Guide* for both models, and
 *   Casio UK's *fx-991CW Interactive Manual*, whose screenshots show each
 *   menu in order. The CW has no ALPHA, MODE or numbered menus: HOME is a
 *   grid of apps, and every menu is walked with the cursor keys and OK. Only
 *   items those screenshots show are listed, in their order, so a menu here
 *   may stop where the screenshot stopped. The order inside CATALOG's Matrix
 *   category is not shown anywhere, so matrices (and Solver) are not run yet.
 */

export interface ModelSpec {
  id: ModelId;
  /** As printed on the case. */
  name: string;
  series: string;
  /** Models with the same keys and menus for everything taught here. */
  siblings: string;
  /** The key that opens the list of modes (the CW's HOME screen of apps). */
  menuKey: "menu" | "mode" | "home";
  /** SETUP on a key of its own (the CW's SETTINGS); elsewhere SHIFT and the menu key. */
  settingsKey?: KeyId;
  /** The key that opens `optn`: OPTN, or CATALOG on the CW. */
  optnKey?: KeyId;
  /** What OK opens in an editor: the CW's statistics menu. */
  okMenu?: (mode: CalcMode, screen: string, stat: StatKind) => Menu | null;
  /** The CW's FORMAT key, for an answer on screen. */
  formatMenu?: Menu;
  /** An OK key in the middle of the cursor pad (the CW). */
  okKey?: boolean;
  /** ▼ past the last row of the data table goes back to the first (the CW). */
  editorWraps?: boolean;
  /** ▼ and ▲ move between the boxes of ∫ (the CW); ▶ elsewhere. */
  verticalTemplates?: boolean;
  /** Variables typed with SHIFT and the key they are printed above (the CW). */
  shiftLetters?: Partial<Record<KeyId, VarName>>;
  /** A distribution's fields in this model's order, where it differs (the CW: μ before σ). */
  distFields?: Partial<Record<DistKind, DistField[]>>;
  /** What the device has but this simulation does not run yet; nothing here asks for it. */
  notSimulated?: ("matrix" | "solver")[];
  /** The MS turns the MODE menu's pages by pressing MODE again. */
  modeCycles: boolean;
  /** Keys that turn a menu's pages: back, forward. */
  pageKeys: [KeyId, KeyId];
  matrices: MatName[];
  /** Data rows the statistics editor holds: one column, two columns. */
  statCapacity: [number, number];
  /** How data goes in: a table (ES PLUS, EX) or one value at a time with DT (MS). */
  statInput: "editor" | "dt";
  /** How one-variable results are read: a list (EX) or variables (others). */
  statResults: "list" | "variables";
  /** Results shown as fractions by default (natural display), or only after one was typed (MS). */
  autoFractions: boolean;
  /** Templates (∫, d/dx, log■□) whose boxes ▶ moves between. */
  templates: boolean;
  lowerXY: boolean;
  /** The MS asks for one coefficient or element at a time. */
  prompts: boolean;
  /** The EX names an inconsistent system rather than reporting an error. */
  eqnMessages: boolean;
  /** SOLVE runs as soon as the starting value is entered, or on a second SHIFT CALC (MS). */
  solveRuns: "afterStart" | "secondPress";
  /** STO is its own key (EX) or SHIFT RCL (others). */
  storeOnSto: boolean;
  /** The key each variable letter is printed above. */
  letters: Partial<Record<KeyId, VarName>>;
  /** What this model has at all; a lesson for something it lacks is not offered. */
  has: { eqn: boolean; matrix: boolean; calculus: boolean; dist: boolean; normalP: boolean };
  /** Rows round the cursor pad: two keys left of it, two right; null leaves a gap. */
  top: [KeyDef | null, KeyDef | null, KeyDef | null, KeyDef | null][];
  functionRows: KeyDef[][];
  digitRows: KeyDef[][];
  mainMenu: Menu;
  setupMenu: Menu | null;
  optn?: (mode: CalcMode, screen: string, stat: StatKind) => Menu | null;
  shiftMenu?: (digit: string, mode: CalcMode, stat: StatKind) => Menu | null;
}

// ------------------------------------------------------------- helpers ----

const item = (key: string, label: string, action: Action): MenuItem => ({ key, label, action });
const unsupported = (key: string, label: string) => item(key, label, { do: "unsupported" });
const insert = (...toks: Tok[]): Action => ({ do: "insert", toks });
const fn = (v: Extract<Tok, { t: "fn" }>["v"]) => insert({ t: "fn", v });
const mat = (v: MatName | "Ans") => insert({ t: "mat", v });
const stat = (v: StatVar) => insert({ t: "stat", v });
const sub = (pages: MenuItem[][], title?: string): Action => ({
  do: "menu",
  menu: { title, pages },
});
const eqn = (type: EqnType): Action => ({ do: "eqnType", type });
const dist = (kind: DistKind): Action => ({ do: "dist", dist: kind });

const key = (
  id: KeyId,
  label: string,
  extra: Partial<Omit<KeyDef, "id" | "label">> = {},
): KeyDef => ({ id, label, tone: "function", ...extra });

const digitRows = (
  shifts: Partial<Record<KeyId, string>>,
  exp10: KeyDef,
  eq: KeyDef,
): KeyDef[][] => {
  const d = (id: KeyId, label: string, tone: KeyDef["tone"] = "digit"): KeyDef => ({
    id,
    label,
    tone,
    shift: shifts[id],
  });
  return [
    [d("7", "7"), d("8", "8"), d("9", "9"), d("del", "DEL", "clear"), d("ac", "AC", "clear")],
    [
      d("4", "4"),
      d("5", "5"),
      d("6", "6"),
      d("times", "×", "operator"),
      d("divide", "÷", "operator"),
    ],
    [
      d("1", "1"),
      d("2", "2"),
      d("3", "3"),
      d("plus", "+", "operator"),
      d("minus", "−", "operator"),
    ],
    [d("0", "0"), d("dot", "."), exp10, d("ans", "Ans"), eq],
  ];
};

const COMBINATIONS: Partial<Record<KeyId, string>> = { times: "nPr", divide: "nCr" };
const SHIFT = key("shift", "SHIFT", { tone: "modifier" });
const ALPHA = key("alpha", "ALPHA", { tone: "modifier" });
const ON = key("on", "ON");
const EXP10 = key("exp10", "×10ˣ", { tone: "digit", shift: "π", alpha: "e" });
const EQUALS = key("eq", "=", { tone: "equals" });
const trig = (): KeyDef[] => [
  key("sin", "sin", { shift: "sin⁻¹", alpha: "D" }),
  key("cos", "cos", { shift: "cos⁻¹", alpha: "E" }),
  key("tan", "tan", { shift: "tan⁻¹", alpha: "F" }),
];

/** The variable letters on the ES PLUS family's keys; the MS and EX differ in one place each. */
const ES_LETTERS: Partial<Record<KeyId, VarName>> = {
  neg: "A",
  dms: "B",
  hyp: "C",
  sin: "D",
  cos: "E",
  tan: "F",
  rp: "X",
  sd: "Y",
  mplus: "M",
};

// ----------------------------------------------- menus shared by models ----

const minMax = (pairs: boolean): Action =>
  sub([
    [
      item("1", "minX", stat("min")),
      item("2", "maxX", stat("max")),
      ...(pairs ? [item("3", "minY", stat("minY")), item("4", "maxY", stat("maxY"))] : []),
    ],
  ]);

/** The ES PLUS family's SHIFT 1 (STAT) menu. Distr only on the fx-991ES PLUS. */
function esStatMenu(kind: StatKind, typeMenu: Menu, distr: boolean): Menu {
  const type = item("1", "Type", { do: "menu", menu: typeMenu });
  const data = item("2", "Data", { do: "statEditor" });
  if (kind === "1var") {
    const tail = distr
      ? [
          item(
            "5",
            "Distr",
            sub([
              [
                item("1", "P(", fn("normP")),
                item("2", "Q(", fn("normQ")),
                item("3", "R(", fn("normR")),
                item("4", "▶t", insert({ t: "post", v: "tnorm" })),
              ],
            ]),
          ),
          item("6", "MinMax", minMax(false)),
        ]
      : [item("5", "MinMax", minMax(false))];
    return {
      pages: [
        [
          type,
          data,
          item("3", "Sum", sub([[item("1", "Σx²", stat("sumX2")), item("2", "Σx", stat("sumX"))]])),
          item(
            "4",
            "Var",
            sub([
              [
                item("1", "n", stat("n")),
                item("2", "x̄", stat("mean")),
                item("3", "σx", stat("popSd")),
                item("4", "sx", stat("sampleSd")),
              ],
            ]),
          ),
          ...tail,
        ],
      ],
    };
  }
  return {
    pages: [
      [
        type,
        data,
        item(
          "3",
          "Sum",
          sub([
            [
              item("1", "Σx²", stat("sumX2")),
              item("2", "Σx", stat("sumX")),
              item("3", "Σy²", stat("sumY2")),
              item("4", "Σy", stat("sumY")),
              item("5", "Σxy", stat("sumXY")),
            ],
          ]),
        ),
        item(
          "4",
          "Var",
          sub([
            [
              item("1", "n", stat("n")),
              item("2", "x̄", stat("mean")),
              item("3", "σx", stat("popSd")),
              item("4", "sx", stat("sampleSd")),
              item("5", "ȳ", stat("meanY")),
              item("6", "σy", stat("popSdY")),
              item("7", "sy", stat("sampleSdY")),
            ],
          ]),
        ),
        item(
          "5",
          "Reg",
          sub([
            [
              item("1", "A", stat("a")),
              item("2", "B", stat("b")),
              item("3", "r", stat("r")),
              item("4", "x̂", insert({ t: "est", v: "xhat" })),
              item("5", "ŷ", insert({ t: "est", v: "yhat" })),
            ],
          ]),
        ),
        item("6", "MinMax", minMax(true)),
      ],
    ],
  };
}

const ES_STAT_TYPES: Menu = {
  pages: [
    [
      item("1", "1-VAR", { do: "statType", kind: "1var" }),
      item("2", "A+BX", { do: "statType", kind: "lin" }),
      unsupported("3", "_+CX²"),
      unsupported("4", "ln X"),
      unsupported("5", "e^X"),
      unsupported("6", "A•B^X"),
      unsupported("7", "A•X^B"),
      unsupported("8", "1/X"),
    ],
  ],
};

const ES_SETUP: Menu = {
  pages: [
    [
      unsupported("1", "MthIO"),
      unsupported("2", "LineIO"),
      item("3", "Deg", { do: "angle", unit: "deg" }),
      item("4", "Rad", { do: "angle", unit: "rad" }),
      unsupported("5", "Gra"),
      unsupported("6", "Fix"),
      unsupported("7", "Sci"),
      unsupported("8", "Norm"),
    ],
  ],
};

/** The ES PLUS family's rows under the cursor pad, the same on the 82 and the 991 but for one key. */
const esFunctionRows = (hyp: KeyDef, cubeOnSquare = true): KeyDef[][] => [
  [
    key("frac", "■⁄□"),
    key("sqrt", "√■", { shift: "∛" }),
    // The 82 has x³ on a key of its own, and nothing above x².
    key("sq", "x²", cubeOnSquare ? { shift: "x³" } : {}),
    key("pow", "x^"),
    key("log", "log", { shift: "10■" }),
    key("ln", "ln", { shift: "e■" }),
  ],
  [key("neg", "(−)", { alpha: "A" }), key("dms", "°'\"", { alpha: "B" }), hyp, ...trig()],
  [
    key("rcl", "RCL", { shift: "STO" }),
    key("eng", "ENG"),
    key("lp", "("),
    key("rp", ")", { shift: ",", alpha: "X" }),
    key("sd", "S⇔D", { alpha: "Y" }),
    key("mplus", "M+", { alpha: "M" }),
  ],
];

// ------------------------------------------------------------ fx-991EX ----

const EX_MATRICES: MatName[] = ["A", "B", "C", "D"];

/** Define Matrix → MatA…MatD → Number of Rows? → Number of Columns? */
const exDefine: Menu = {
  title: "Define Matrix",
  pages: [
    EX_MATRICES.map((name, i) =>
      item(
        String(i + 1),
        `Mat${name}`,
        sub(
          [
            [1, 2, 3, 4].map((r) =>
              item(
                String(r),
                String(r),
                sub(
                  [
                    [1, 2, 3, 4].map((c) =>
                      item(String(c), String(c), { do: "defineMatrix", name, rows: r, cols: c }),
                    ),
                  ],
                  "Number of Columns?",
                ),
              ),
            ),
          ],
          "Number of Rows?",
        ),
      ),
    ),
  ],
};

const exEdit: Menu = {
  title: "Edit Matrix",
  pages: [
    EX_MATRICES.map((name, i) => item(String(i + 1), `Mat${name}`, { do: "editMatrix", name })),
  ],
};

const exStatType: Menu = {
  title: "Select Type",
  pages: [
    [
      item("1", "1-Variable", { do: "statType", kind: "1var" }),
      item("2", "y=a+bx", { do: "statType", kind: "lin" }),
    ],
  ],
};

const exAngle: Menu = {
  title: "Angle Unit",
  pages: [
    [
      item("1", "Degree", { do: "angle", unit: "deg" }),
      item("2", "Radian", { do: "angle", unit: "rad" }),
      unsupported("3", "Gradian"),
    ],
  ],
};

const listOrVariable = (kind: DistKind): Action =>
  sub([[unsupported("1", "List"), item("2", "Variable", dist(kind))]]);

const exDistribution: Menu = {
  pages: [
    [
      item("1", "Normal PD", dist("normalPd")),
      item("2", "Normal CD", dist("normalCd")),
      item("3", "Inverse Normal", dist("inverseNormal")),
      item("4", "Binomial PD", listOrVariable("binomialPd")),
    ],
    [
      item("1", "Binomial CD", listOrVariable("binomialCd")),
      item("2", "Poisson PD", listOrVariable("poissonPd")),
      item("3", "Poisson CD", listOrVariable("poissonCd")),
    ],
  ],
};

const exUnknowns: Action = sub(
  [
    [
      item("2", "2", eqn({ kind: "linear", n: 2 })),
      item("3", "3", eqn({ kind: "linear", n: 3 })),
      unsupported("4", "4"),
    ],
  ],
  "Number of Unknowns?",
);
const exDegree: Action = sub(
  [
    [
      item("2", "2", eqn({ kind: "poly", degree: 2 })),
      item("3", "3", eqn({ kind: "poly", degree: 3 })),
      unsupported("4", "4"),
    ],
  ],
  "Degree?",
);
const exEquation: Menu = {
  pages: [
    [
      item("1", "Simul Equation", exUnknowns),
      item("2", "Polynomial", exDegree),
      unsupported("3", "Solver"),
    ],
  ],
};

export const FX991EX: ModelSpec = {
  id: "fx991ex",
  name: "fx-991EX",
  series: "ClassWiz",
  siblings: "fx-570EX",
  menuKey: "menu",
  modeCycles: false,
  pageKeys: ["up", "down"],
  matrices: EX_MATRICES,
  statCapacity: [160, 80],
  statInput: "editor",
  statResults: "list",
  autoFractions: true,
  templates: true,
  lowerXY: true,
  prompts: false,
  eqnMessages: true,
  solveRuns: "afterStart",
  storeOnSto: true,
  letters: { ...ES_LETTERS, hyp: undefined, inv: "C" },
  has: { eqn: true, matrix: true, calculus: true, dist: true, normalP: false },
  top: [
    [SHIFT, ALPHA, key("menu", "MENU", { shift: "SETUP" }), ON],
    [
      key("optn", "OPTN"),
      key("calc", "CALC", { shift: "SOLVE", alpha: "=" }),
      key("integral", "∫■□", { shift: "d/dx" }),
      key("x", "x"),
    ],
  ],
  functionRows: [
    [
      key("frac", "■⁄□"),
      key("sqrt", "√■", { shift: "∛" }),
      key("sq", "x²", { shift: "x³" }),
      key("pow", "x^"),
      key("logb", "log■□", { shift: "10■" }),
      key("ln", "ln", { shift: "e■" }),
    ],
    [
      key("neg", "(−)", { alpha: "A" }),
      key("dms", "°'\"", { alpha: "B" }),
      key("inv", "x⁻¹", { shift: "x!", alpha: "C" }),
      ...trig(),
    ],
    [
      key("sto", "STO", { shift: "RECALL" }),
      key("eng", "ENG"),
      key("lp", "(", { shift: "Abs" }),
      key("rp", ")", { shift: ",", alpha: "x" }),
      key("sd", "S⇔D", { alpha: "y" }),
      key("mplus", "M+", { alpha: "M" }),
    ],
  ],
  digitRows: digitRows(COMBINATIONS, EXP10, key("eq", "=", { tone: "equals", shift: "≈" })),
  mainMenu: {
    pages: [
      [
        item("1", "Calculate", { do: "mode", mode: "calc" }),
        unsupported("2", "Complex"),
        unsupported("3", "Base-N"),
        item("4", "Matrix", { do: "mode", mode: "matrix", then: { do: "menu", menu: exDefine } }),
        unsupported("5", "Vector"),
        item("6", "Statistics", {
          do: "mode",
          mode: "stat",
          then: { do: "menu", menu: exStatType },
        }),
        item("7", "Distribution", {
          do: "mode",
          mode: "dist",
          then: { do: "menu", menu: exDistribution },
        }),
        unsupported("8", "Spreadsheet"),
        unsupported("9", "Table"),
        item("A", "Equation/Func", {
          do: "mode",
          mode: "eqn",
          then: { do: "menu", menu: exEquation },
        }),
        unsupported("B", "Inequality"),
        unsupported("C", "Ratio"),
      ],
    ],
  },
  setupMenu: {
    title: "SETUP",
    pages: [
      [
        unsupported("1", "Input/Output"),
        item("2", "Angle Unit", { do: "menu", menu: exAngle }),
        unsupported("3", "Number Format"),
        unsupported("4", "Engineer Symbol"),
      ],
    ],
  },
  optn: (mode, screen, kind) => {
    if (mode === "matrix") {
      return {
        pages: [
          [
            item("1", "Define Matrix", { do: "menu", menu: exDefine }),
            item("2", "Edit Matrix", { do: "menu", menu: exEdit }),
            ...EX_MATRICES.map((name, i) => item(String(i + 3), `Mat${name}`, mat(name))),
          ],
          [
            item("2", "Determinant", fn("det")),
            item("3", "Transposition", fn("trn")),
            item("4", "Identity", fn("identity")),
          ],
        ],
      };
    }
    if (mode === "stat") {
      const type = item("1", "Select Type", { do: "menu", menu: exStatType });
      if (screen === "statEditor") {
        return kind === "1var"
          ? {
              pages: [
                [
                  type,
                  item("3", "1-Variable Calc", { do: "statList" }),
                  item("4", "Statistics Calc", { do: "statCalc" }),
                ],
              ],
            }
          : {
              pages: [
                [
                  type,
                  unsupported("3", "2-Variable Calc"),
                  item("4", "Regression Calc", { do: "regList" }),
                ],
              ],
            };
      }
      return kind === "1var"
        ? {
            pages: [
              [
                type,
                item("2", "1-Variable Calc", { do: "statList" }),
                item("3", "Data", { do: "statEditor" }),
              ],
            ],
          }
        : {
            pages: [
              [
                type,
                unsupported("2", "2-Variable Calc"),
                item("3", "Regression Calc", { do: "regList" }),
                item("4", "Data", { do: "statEditor" }),
              ],
            ],
          };
    }
    if (mode === "eqn") return exEquation;
    if (mode === "dist") {
      return { pages: [[item("1", "Select Type", { do: "menu", menu: exDistribution })]] };
    }
    return null;
  },
};

// -------------------------------------------------------- fx-991ES PLUS ----

const ES_MATRICES: MatName[] = ["A", "B", "C"];
const ES_DIMENSIONS: [number, number][][] = [
  [
    [3, 3],
    [3, 2],
    [3, 1],
    [2, 3],
    [2, 2],
    [2, 1],
  ],
  [
    [1, 3],
    [1, 2],
    [1, 1],
  ],
];

const esDefine: Menu = {
  title: "Matrix?",
  pages: [
    ES_MATRICES.map((name, i) =>
      item(
        String(i + 1),
        `Mat${name}`,
        sub(
          ES_DIMENSIONS.map((page) =>
            page.map(([r, c], j) =>
              item(String(j + 1), `${r}×${c}`, { do: "defineMatrix", name, rows: r, cols: c }),
            ),
          ),
          `Mat${name}(m×n) m×n?`,
        ),
      ),
    ),
  ],
};

const esData: Menu = {
  title: "Matrix?",
  pages: [
    ES_MATRICES.map((name, i) => item(String(i + 1), `Mat${name}`, { do: "editMatrix", name })),
  ],
};

const esEquation: Menu = {
  pages: [
    [
      item("1", "anX+bnY=cn", eqn({ kind: "linear", n: 2 })),
      item("2", "anX+bnY+cnZ=dn", eqn({ kind: "linear", n: 3 })),
      item("3", "aX²+bX+c=0", eqn({ kind: "poly", degree: 2 })),
      item("4", "aX³+bX²+cX+d=0", eqn({ kind: "poly", degree: 3 })),
    ],
  ],
};

export const FX991ESPLUS: ModelSpec = {
  id: "fx991esplus",
  name: "fx-991ES PLUS",
  series: "Natural-V.P.A.M.",
  siblings: "fx-570ES PLUS",
  menuKey: "mode",
  modeCycles: false,
  pageKeys: ["up", "down"],
  matrices: ES_MATRICES,
  statCapacity: [80, 40],
  statInput: "editor",
  statResults: "variables",
  autoFractions: true,
  templates: true,
  lowerXY: false,
  prompts: false,
  eqnMessages: false,
  solveRuns: "afterStart",
  storeOnSto: false,
  letters: ES_LETTERS,
  has: { eqn: true, matrix: true, calculus: true, dist: false, normalP: true },
  top: [
    [SHIFT, ALPHA, key("mode", "MODE", { shift: "SETUP" }), ON],
    [
      key("calc", "CALC", { shift: "SOLVE", alpha: "=" }),
      key("integral", "∫■□", { shift: "d/dx" }),
      key("inv", "x⁻¹", { shift: "x!" }),
      key("logb", "log■□"),
    ],
  ],
  functionRows: esFunctionRows(key("hyp", "hyp", { shift: "Abs", alpha: "C" })),
  digitRows: digitRows({ ...COMBINATIONS, "1": "STAT", "4": "MATRIX" }, EXP10, EQUALS),
  mainMenu: {
    pages: [
      [
        item("1", "COMP", { do: "mode", mode: "calc" }),
        unsupported("2", "CMPLX"),
        item("3", "STAT", { do: "mode", mode: "stat", then: { do: "menu", menu: ES_STAT_TYPES } }),
        unsupported("4", "BASE-N"),
        item("5", "EQN", { do: "mode", mode: "eqn", then: { do: "menu", menu: esEquation } }),
        item("6", "MATRIX", { do: "mode", mode: "matrix", then: { do: "menu", menu: esDefine } }),
        unsupported("7", "TABLE"),
        unsupported("8", "VECTOR"),
      ],
    ],
  },
  setupMenu: ES_SETUP,
  shiftMenu: (digit, mode, kind) => {
    if (digit === "1" && mode === "stat") return esStatMenu(kind, ES_STAT_TYPES, true);
    if (digit === "4" && mode === "matrix") {
      return {
        pages: [
          [
            item("1", "Dim", { do: "menu", menu: esDefine }),
            item("2", "Data", { do: "menu", menu: esData }),
            ...ES_MATRICES.map((name, i) => item(String(i + 3), `Mat${name}`, mat(name))),
            item("6", "MatAns", mat("Ans")),
            item("7", "det", fn("det")),
            item("8", "Trn", fn("trn")),
          ],
        ],
      };
    }
    return null;
  },
};

// --------------------------------------------------------- fx-82ES PLUS ----

export const FX82ESPLUS: ModelSpec = {
  ...FX991ESPLUS,
  id: "fx82esplus",
  name: "fx-82ES PLUS",
  siblings: "fx-85ES PLUS, fx-350ES PLUS",
  matrices: [],
  has: { eqn: false, matrix: false, calculus: false, dist: false, normalP: false },
  top: [
    [SHIFT, ALPHA, key("mode", "MODE", { shift: "SETUP" }), ON],
    [
      key("abs", "Abs"),
      key("cube", "x³"),
      key("inv", "x⁻¹", { shift: "x!" }),
      key("logb", "log■□"),
    ],
  ],
  functionRows: esFunctionRows(key("hyp", "hyp", { alpha: "C" }), false),
  digitRows: digitRows({ ...COMBINATIONS, "1": "STAT" }, EXP10, EQUALS),
  mainMenu: {
    pages: [
      [
        item("1", "COMP", { do: "mode", mode: "calc" }),
        item("2", "STAT", { do: "mode", mode: "stat", then: { do: "menu", menu: ES_STAT_TYPES } }),
        unsupported("3", "TABLE"),
      ],
    ],
  },
  setupMenu: ES_SETUP,
  shiftMenu: (digit, mode, kind) =>
    digit === "1" && mode === "stat" ? esStatMenu(kind, ES_STAT_TYPES, false) : null,
};

// ------------------------------------------------------ fx-570MS / 991MS ----

const MS_MATRICES: MatName[] = ["A", "B", "C"];

const msPick = (make: (name: MatName) => Action): Action =>
  sub([MS_MATRICES.map((name, i) => item(String(i + 1), name, make(name)))]);

function msStatMenu(digit: string, kind: StatKind): Menu | null {
  if (digit === "1") {
    const first = [
      item("1", "Σx²", stat("sumX2")),
      item("2", "Σx", stat("sumX")),
      item("3", "n", stat("n")),
    ];
    const second = [
      item("1", "Σy²", stat("sumY2")),
      item("2", "Σy", stat("sumY")),
      item("3", "Σxy", stat("sumXY")),
    ];
    return { pages: kind === "1var" ? [first] : [first, second] };
  }
  if (digit === "2") {
    const first = [
      item("1", "x̄", stat("mean")),
      item("2", "σx", stat("popSd")),
      item("3", "sx", stat("sampleSd")),
    ];
    if (kind === "1var") return { pages: [first] };
    return {
      pages: [
        first,
        [
          item("1", "ȳ", stat("meanY")),
          item("2", "σy", stat("popSdY")),
          item("3", "sy", stat("sampleSdY")),
        ],
        [item("1", "A", stat("a")), item("2", "B", stat("b")), item("3", "r", stat("r"))],
        [
          item("1", "x̂", insert({ t: "est", v: "xhat" })),
          item("2", "ŷ", insert({ t: "est", v: "yhat" })),
        ],
      ],
    };
  }
  if (digit === "3" && kind === "1var") {
    return {
      pages: [
        [
          item("1", "P(", fn("normP")),
          item("2", "Q(", fn("normQ")),
          item("3", "R(", fn("normR")),
          item("4", "▶t", insert({ t: "post", v: "tnorm" })),
        ],
      ],
    };
  }
  return null;
}

export const FX570MS: ModelSpec = {
  id: "fx570ms",
  name: "fx-570MS",
  series: "S-V.P.A.M.",
  siblings: "fx-991MS",
  menuKey: "mode",
  modeCycles: true,
  pageKeys: ["left", "right"],
  matrices: MS_MATRICES,
  statCapacity: [80, 40],
  statInput: "dt",
  statResults: "variables",
  autoFractions: false,
  templates: false,
  lowerXY: false,
  prompts: true,
  eqnMessages: false,
  solveRuns: "secondPress",
  storeOnSto: false,
  letters: { ...ES_LETTERS, sd: undefined, comma: "Y" },
  has: { eqn: true, matrix: true, calculus: true, dist: false, normalP: true },
  top: [
    [SHIFT, ALPHA, key("mode", "MODE", { shift: "CLR" }), ON],
    [
      key("calc", "CALC", { shift: "SOLVE", alpha: "=" }),
      key("integral", "∫dx", { shift: "d/dx" }),
      key("inv", "x⁻¹", { shift: "x!" }),
      key("const", "CONST"),
    ],
  ],
  functionRows: [
    [
      key("frac", "a b/c"),
      key("sqrt", "√", { shift: "∛" }),
      key("sq", "x²", { shift: "x³" }),
      key("pow", "^"),
      key("log", "log", { shift: "10ˣ" }),
      key("ln", "ln", { shift: "eˣ" }),
    ],
    [
      key("neg", "(−)", { alpha: "A" }),
      key("dms", "°'\"", { alpha: "B" }),
      key("hyp", "hyp", { alpha: "C" }),
      ...trig(),
    ],
    [
      key("rcl", "RCL", { shift: "STO" }),
      key("eng", "ENG"),
      key("lp", "("),
      key("rp", ")", { alpha: "X" }),
      key("comma", ",", { alpha: "Y" }),
      key("mplus", "M+", { alpha: "M" }),
    ],
  ],
  digitRows: digitRows(
    { ...COMBINATIONS, "1": "S-SUM", "2": "S-VAR", "3": "DISTR", "4": "MAT" },
    key("exp10", "×10ˣ", { tone: "digit", shift: "π" }),
    EQUALS,
  ),
  mainMenu: {
    pages: [
      [item("1", "COMP", { do: "mode", mode: "calc" }), unsupported("2", "CMPLX")],
      [
        item("1", "SD", { do: "mode", mode: "stat", then: { do: "statType", kind: "1var" } }),
        item("2", "REG", {
          do: "mode",
          mode: "stat",
          then: sub([
            [
              item("1", "Lin", { do: "statType", kind: "lin" }),
              unsupported("2", "Log"),
              unsupported("3", "Exp"),
            ],
            [unsupported("1", "Pwr"), unsupported("2", "Inv"), unsupported("3", "Quad")],
          ]),
        }),
        unsupported("3", "BASE"),
      ],
      [
        item("1", "EQN", {
          do: "mode",
          mode: "eqn",
          then: {
            do: "menu",
            menu: {
              title: "Unknowns? ▶ Degree?",
              pages: [
                [
                  item("2", "2", eqn({ kind: "linear", n: 2 })),
                  item("3", "3", eqn({ kind: "linear", n: 3 })),
                ],
                [
                  item("2", "2", eqn({ kind: "poly", degree: 2 })),
                  item("3", "3", eqn({ kind: "poly", degree: 3 })),
                ],
              ],
            },
          },
        }),
        item("2", "MAT", { do: "mode", mode: "matrix" }),
        unsupported("3", "VCT"),
      ],
      [
        item("1", "Deg", { do: "angle", unit: "deg" }),
        item("2", "Rad", { do: "angle", unit: "rad" }),
        unsupported("3", "Gra"),
      ],
      [unsupported("1", "Fix"), unsupported("2", "Sci"), unsupported("3", "Norm")],
    ],
  },
  setupMenu: {
    title: "CLR",
    pages: [[unsupported("1", "Scl"), unsupported("2", "Mode"), unsupported("3", "All")]],
  },
  shiftMenu: (digit, mode, kind) => {
    if (mode === "stat") return msStatMenu(digit, kind);
    if (digit === "4" && mode === "matrix") {
      return {
        pages: [
          [
            item(
              "1",
              "Dim",
              msPick((name) => ({ do: "askDimension", name })),
            ),
            item(
              "2",
              "Edit",
              msPick((name) => ({ do: "editMatrix", name })),
            ),
            item(
              "3",
              "Mat",
              sub([
                [
                  ...MS_MATRICES.map((name, i) => item(String(i + 1), name, mat(name))),
                  item("4", "Ans", mat("Ans")),
                ],
              ]),
            ),
          ],
          [item("1", "Det", fn("det")), item("2", "Trn", fn("trn"))],
        ],
      };
    }
    return null;
  },
};

// -------------------------------------------------------------- fx-991CW ----

/** A menu item picked with the cursor: no number. */
const pick = (label: string, action: Action): MenuItem => item("", label, action);
const notRun = (label: string): MenuItem => unsupported("", label);
const list = (items: MenuItem[], columns?: number): Menu => ({
  pages: [items],
  cursor: true,
  columns,
});
const open = (items: MenuItem[]): Action => ({ do: "menu", menu: list(items) });

const CW_STAT_TYPES = list([
  pick("1-Variable", { do: "statType", kind: "1var" }),
  pick("2-Variable", { do: "statType", kind: "lin" }),
]);

/** Binomial and Poisson ask whether x is a list or one value. */
const cwListOrVariable = (kind: DistKind): Action =>
  open([notRun("List"), pick("Variable", dist(kind))]);

const CW_DISTRIBUTIONS = list([
  pick("Binomial PD", cwListOrVariable("binomialPd")),
  pick("Binomial CD", cwListOrVariable("binomialCd")),
  pick("Normal PD", dist("normalPd")),
  pick("Normal CD", dist("normalCd")),
  pick("Inverse Normal", dist("inverseNormal")),
  pick("Poisson PD", cwListOrVariable("poissonPd")),
  pick("Poisson CD", cwListOrVariable("poissonCd")),
]);

const CW_EQUATIONS = list([
  pick(
    "Simul Equation",
    open([
      pick("2 Unknowns", eqn({ kind: "linear", n: 2 })),
      pick("3 Unknowns", eqn({ kind: "linear", n: 3 })),
      notRun("4 Unknowns"),
    ]),
  ),
  pick(
    "Polynomial",
    open([
      pick("ax²+bx+c", eqn({ kind: "poly", degree: 2 })),
      pick("ax³+bx²+cx+d", eqn({ kind: "poly", degree: 3 })),
      notRun("ax⁴+bx³+cx²+dx+e"),
    ]),
  ),
  notRun("Solver"),
]);

/** HOME: the apps, three to a row. */
const CW_HOME = list(
  [
    pick("Calculate", { do: "mode", mode: "calc" }),
    pick("Statistics", { do: "mode", mode: "stat", then: { do: "menu", menu: CW_STAT_TYPES } }),
    pick("Distribution", {
      do: "mode",
      mode: "dist",
      then: { do: "menu", menu: CW_DISTRIBUTIONS },
    }),
    notRun("Spreadsheet"),
    notRun("Table"),
    pick("Equation", { do: "mode", mode: "eqn", then: { do: "menu", menu: CW_EQUATIONS } }),
    notRun("Inequality"),
    notRun("Complex"),
    notRun("Base-N"),
    notRun("Matrix"),
    notRun("Vector"),
    notRun("Ratio"),
    notRun("Math Box"),
  ],
  3,
);

const CW_SETTINGS = list([
  pick(
    "Calc Settings",
    open([
      notRun("Input/Output"),
      pick(
        "Angle Unit",
        open([
          pick("Degree", { do: "angle", unit: "deg" }),
          pick("Radian", { do: "angle", unit: "rad" }),
          notRun("Gradian"),
        ]),
      ),
      notRun("Number Format"),
      notRun("Engineer Symbol"),
      notRun("Fraction Result"),
      notRun("Complex Result"),
      notRun("Decimal Mark"),
      notRun("Digit Separator"),
    ]),
  ),
  notRun("System Settings"),
  notRun("Reset"),
  notRun("Get Started"),
]);

/** CATALOG, in the Calculate app; the Statistics app puts its own category first. */
const cwCatalog = (mode: CalcMode): Menu =>
  list([
    ...(mode === "stat"
      ? [
          pick(
            "Statistics",
            open([
              notRun("Summation"),
              notRun("Mean/Var/Dev…"),
              notRun("Min/Max/Quartile"),
              notRun("Norm Dist"),
            ]),
          ),
        ]
      : []),
    pick(
      "Func Analysis",
      open([
        pick("Derivative(d/dx)", fn("deriv")),
        pick("Integration(∫)", fn("integral")),
        notRun("Summation(Σ)"),
        pick("Logarithm(logab)", fn("logb")),
      ]),
    ),
    pick(
      "Probability",
      open([
        notRun("%"),
        pick("Factorial(!)", insert({ t: "post", v: "fact" })),
        pick("Permutation(P)", insert({ t: "op", v: "P" })),
        pick("Combination(C)", insert({ t: "op", v: "C" })),
        notRun("Random Number"),
        notRun("Random Integer"),
      ]),
    ),
    pick("Numeric Calc", open([pick("Absolute Value", fn("abs")), notRun("Round Off")])),
    pick(
      "Angle/Coord/Sexa",
      open([notRun("Degrees"), notRun("Radians"), notRun("Gradians"), notRun("Rect to Polar")]),
    ),
    notRun("Hyperbolic/Trig"),
    notRun("Engineer Symbol"),
    notRun("Sci Constants"),
    notRun("Unit Conversions"),
  ]);

/** OK in the statistics data table. */
const cwStatResults = (kind: StatKind): Menu =>
  kind === "1var"
    ? list([pick("1-Var Results", { do: "statList" }), pick("Statistics Calc", { do: "statCalc" })])
    : list([
        notRun("2-Var Results"),
        pick(
          "Reg Results",
          open([
            pick("y=a+bx", { do: "regList" }),
            notRun("y=a+bx+cx²"),
            notRun("y=a+b·ln(x)"),
            notRun("y=a·e^(bx)"),
          ]),
        ),
        pick("Statistics Calc", { do: "statCalc" }),
      ]);

const nav = (id: KeyId, label: string, extra: Partial<Omit<KeyDef, "id" | "label">> = {}) =>
  key(id, label, { tone: "nav", ...extra });
const cwDigit = (id: KeyId, label: string, shift?: string, tone: KeyDef["tone"] = "digit") =>
  key(id, label, { tone, shift });

export const FX991CW: ModelSpec = {
  ...FX991EX,
  id: "fx991cw",
  name: "fx-991CW",
  series: "ClassWiz",
  siblings: "fx-570CW",
  menuKey: "home",
  settingsKey: "settings",
  optnKey: "catalog",
  okKey: true,
  editorWraps: true,
  verticalTemplates: true,
  pageKeys: ["pgup", "pgdn"],
  storeOnSto: false,
  letters: {},
  shiftLetters: { "4": "A", "5": "B", "6": "C", "1": "D", "2": "E", "3": "F", "0": "X", dot: "Y" },
  distFields: {
    normalPd: [
      { label: "x", initial: 0 },
      { label: "μ", initial: 0 },
      { label: "σ", initial: 1 },
    ],
    normalCd: [
      { label: "Lower", initial: 0 },
      { label: "Upper", initial: 0 },
      { label: "μ", initial: 0 },
      { label: "σ", initial: 1 },
    ],
    inverseNormal: [
      { label: "Area", initial: 0 },
      { label: "μ", initial: 0 },
      { label: "σ", initial: 1 },
    ],
  },
  notSimulated: ["matrix", "solver"],
  top: [
    [ON, nav("home", "HOME"), null, nav("pgup", "⇑")],
    [nav("settings", "SETTINGS"), nav("back", "BACK"), nav("function", "f(x)"), nav("pgdn", "⇓")],
    [SHIFT, nav("variable", "VARIABLE"), nav("catalog", "CATALOG"), nav("tools", "TOOLS")],
  ],
  functionRows: [
    [
      key("x", "x", { shift: "QR" }),
      key("frac", "■⁄□", { shift: "■■⁄□" }),
      key("sqrt", "√■", { shift: "∛■" }),
      key("pow", "■^■", { shift: "■⁻¹" }),
      key("sq", "■²", { shift: "log" }),
      key("logb", "log■□", { shift: "ln" }),
    ],
    [
      key("ans", "Ans"),
      key("sin", "sin", { shift: "sin⁻¹" }),
      key("cos", "cos", { shift: "cos⁻¹" }),
      key("tan", "tan", { shift: "tan⁻¹" }),
      key("lp", "(", { shift: "=" }),
      key("rp", ")", { shift: "," }),
    ],
  ],
  digitRows: [
    [
      cwDigit("7", "7", "π"),
      cwDigit("8", "8", "e"),
      cwDigit("9", "9", "i"),
      cwDigit("del", "⌫", "INS", "clear"),
      cwDigit("ac", "AC", "OFF", "clear"),
    ],
    [
      cwDigit("4", "4", "A"),
      cwDigit("5", "5", "B"),
      cwDigit("6", "6", "C"),
      cwDigit("times", "×", undefined, "operator"),
      cwDigit("divide", "÷", undefined, "operator"),
    ],
    [
      cwDigit("1", "1", "D"),
      cwDigit("2", "2", "E"),
      cwDigit("3", "3", "F"),
      cwDigit("plus", "+", "°'\"", "operator"),
      cwDigit("minus", "−", "(−)", "operator"),
    ],
    [
      cwDigit("0", "0", "x"),
      cwDigit("dot", ".", "y"),
      cwDigit("exp10", "×10■", "z"),
      cwDigit("format", "FORMAT", undefined, "digit"),
      key("eq", "EXE", { tone: "equals", shift: "≈" }),
    ],
  ],
  mainMenu: CW_HOME,
  setupMenu: CW_SETTINGS,
  optn: (mode, screen) => (screen === "calc" ? cwCatalog(mode) : null),
  okMenu: (mode, screen, kind) =>
    mode === "stat" && screen === "statEditor" ? cwStatResults(kind) : null,
  formatMenu: list([
    pick("Standard", { do: "decimal", on: false }),
    pick("Decimal", { do: "decimal", on: true }),
    notRun("Improper Fraction"),
    notRun("Mixed Fraction"),
  ]),
  shiftMenu: undefined,
};

/** Every key on a model's keyboard, without the gaps. */
export const keysOf = (model: ModelSpec): KeyDef[] =>
  [...model.top.flat(), ...model.functionRows.flat(), ...model.digitRows.flat()].filter(
    (def): def is KeyDef => def !== null,
  );

// --------------------------------------------------------------- fx-82MS ----

/** The fx-82MS: the MS keyboard without CALC, ∫ or MAT, and only SD and REG. */
export const FX82MS: ModelSpec = {
  ...FX570MS,
  id: "fx82ms",
  name: "fx-82MS",
  siblings: "fx-85MS, fx-300MS, fx-350MS",
  matrices: [],
  has: { eqn: false, matrix: false, calculus: false, dist: false, normalP: false },
  top: [
    [SHIFT, ALPHA, key("mode", "MODE", { shift: "CLR" }), ON],
    [
      key("inv", "x⁻¹", { shift: "x!" }),
      key("ncr", "nCr", { shift: "nPr" }),
      key("pol", "Pol(", { shift: "Rec(", alpha: ":" }),
      key("cube", "x³", { shift: "∛" }),
    ],
  ],
  functionRows: [
    [
      key("frac", "a b/c", { shift: "d/c" }),
      key("sqrt", "√"),
      key("sq", "x²"),
      key("pow", "^", { shift: "ˣ√" }),
      key("log", "log", { shift: "10ˣ" }),
      key("ln", "ln", { shift: "eˣ", alpha: "e" }),
    ],
    [
      key("neg", "(−)", { alpha: "A" }),
      key("dms", "°'\"", { shift: "←", alpha: "B" }),
      key("hyp", "hyp", { alpha: "C" }),
      ...trig(),
    ],
    [
      key("rcl", "RCL", { shift: "STO" }),
      key("eng", "ENG", { shift: "←" }),
      key("lp", "("),
      key("rp", ")", { alpha: "X" }),
      key("comma", ",", { shift: ";", alpha: "Y" }),
      key("mplus", "M+", { shift: "M−", alpha: "M" }),
    ],
  ],
  digitRows: digitRows(
    {
      "1": "S-SUM",
      "2": "S-VAR",
      "0": "Rnd",
      dot: "Ran#",
      ans: "DRG▶",
      del: "INS",
      ac: "OFF",
    },
    key("exp10", "×10ˣ", { tone: "digit", shift: "π" }),
    key("eq", "=", { tone: "equals", shift: "%" }),
  ),
  mainMenu: {
    pages: [
      [
        item("1", "COMP", { do: "mode", mode: "calc" }),
        item("2", "SD", { do: "mode", mode: "stat", then: { do: "statType", kind: "1var" } }),
        item("3", "REG", {
          do: "mode",
          mode: "stat",
          then: sub([
            [
              item("1", "Lin", { do: "statType", kind: "lin" }),
              unsupported("2", "Log"),
              unsupported("3", "Exp"),
            ],
            [unsupported("1", "Pwr"), unsupported("2", "Inv"), unsupported("3", "Quad")],
          ]),
        }),
      ],
      [
        item("1", "Deg", { do: "angle", unit: "deg" }),
        item("2", "Rad", { do: "angle", unit: "rad" }),
        unsupported("3", "Gra"),
      ],
      [unsupported("1", "Fix"), unsupported("2", "Sci"), unsupported("3", "Norm")],
      [unsupported("1", "Disp")],
    ],
  },
  // S-SUM and S-VAR as on the 570MS; SHIFT 3 (DISTR) is not on this model.
  shiftMenu: (digit, mode, kind) =>
    mode === "stat" && digit !== "3" ? msStatMenu(digit, kind) : null,
};

export const MODELS: Record<ModelId, ModelSpec> = {
  fx991cw: FX991CW,
  fx991ex: FX991EX,
  fx991esplus: FX991ESPLUS,
  fx570ms: FX570MS,
  fx82ms: FX82MS,
  fx82esplus: FX82ESPLUS,
};

export const MODEL_IDS: ModelId[] = [
  "fx991cw",
  "fx991ex",
  "fx991esplus",
  "fx570ms",
  "fx82ms",
  "fx82esplus",
];
