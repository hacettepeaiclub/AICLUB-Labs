/**
 * The two puzzles in section 5. Pure logic — no React, no DOM.
 *
 * Both budgets below were measured against this engine before they were
 * written down, and `challenge.test.ts` re-measures them on every run. If a
 * corpus is edited, the tests fail rather than the puzzles quietly becoming
 * impossible (or trivial).
 *
 * ## The two puzzles ask different questions
 *
 * - **C1** fixes the tokenizer and lets the visitor edit the text. The lever is
 *   *how you write it*: capitals, spacing, and words you did not need.
 * - **C2** fixes the text and lets the visitor choose the tokenizer. The lever
 *   is *what it read*. No amount of training on the wrong corpus reaches the
 *   budget, which is the point — the ceiling is set by the training data, not
 *   by effort.
 */

import { MAX_MERGES, type CorpusId } from "./corpora";

export type ChallengeId = "say-it-cheaper" | "feed-it-the-right-words";

/** What the visitor is allowed to change. */
export type ChallengeLever = "text" | "tokenizer";

export interface ChallengeSpec {
  readonly id: ChallengeId;
  readonly lever: ChallengeLever;
  /** Tokens allowed, inclusive. */
  readonly budget: number;
  /** The text the visitor starts from — wasteful in C1, fixed in C2. */
  readonly start: string;
  /** Words that must survive editing, lower-case. Empty when the text is fixed. */
  readonly requires: readonly string[];
  /** The tokenizer this puzzle is judged with, when the visitor cannot pick. */
  readonly corpus?: CorpusId;
}

export const CHALLENGES: readonly ChallengeSpec[] = [
  {
    id: "say-it-cheaper",
    lever: "text",
    // Measured against the English vocabulary at 360 merges. The text as given
    // costs 67 tokens. Lower-casing it alone reaches 28; single-spacing as
    // well reaches 17; dropping the padding words reaches 10, and the tidiest
    // version that still keeps every required word costs 9. A budget of 12
    // cannot be met by any one of those fixes on its own.
    budget: 12,
    start: "THE  READING   ROOM  IS  VERY  MUCH  WARMER  THAN  THE  WALKING  IS",
    requires: ["the", "reading", "room", "is", "warmer", "than", "walking"],
    corpus: "english",
  },
  {
    id: "feed-it-the-right-words",
    lever: "tokenizer",
    // Measured: the English tokenizer costs 41 tokens untrained and bottoms
    // out at 29 — it never gets close, however far you drag the slider. The
    // Turkish one reaches 14 at 200 merges and 11 at full training.
    budget: 14,
    start: "Evlerimizden denizin sesi bile duyulurdu.",
    requires: [],
  },
];

export type VerdictKind = "untouched" | "missing-words" | "over-budget" | "passed";

/**
 * What happened, as facts rather than a sentence.
 *
 * The wording lives in the dictionary: this module is pure logic and has to
 * stay language-agnostic, and a message baked in here would only ever be
 * English. The component reads `kind` and formats the numbers it carries.
 */
export interface Verdict {
  readonly kind: VerdictKind;
  readonly tokens: number;
  readonly budget: number;
  /** Required words the text no longer contains. Empty unless `missing-words`. */
  readonly missing: readonly string[];
}

/**
 * Words of a text, lower-cased.
 *
 * Whole words, not substrings: requiring `the` as a substring would be
 * satisfied by `thereadingroom`, which costs few tokens and teaches nothing.
 */
export function wordsOf(text: string): string[] {
  return (text.toLocaleLowerCase("en-US").match(/\p{L}+/gu) ?? []).map((w) => w);
}

/** Required words the text no longer contains. */
export function missingWords(text: string, requires: readonly string[]): string[] {
  const present = new Set(wordsOf(text));
  return requires.filter((word) => !present.has(word));
}

export interface Attempt {
  /** The text as it currently stands. */
  readonly text: string;
  /** What that text costs, from the engine — never estimated. */
  readonly tokens: number;
  /** Whether the visitor has changed anything yet. */
  readonly touched: boolean;
}

/**
 * Judge an attempt.
 *
 * The order matters: an attempt that dropped a required word is refused before
 * the budget is looked at, so deleting the sentence can never read as a win.
 */
export function judge(spec: ChallengeSpec, attempt: Attempt): Verdict {
  const base = { tokens: attempt.tokens, budget: spec.budget, missing: [] as readonly string[] };

  if (!attempt.touched) return { ...base, kind: "untouched" };

  const missing = missingWords(attempt.text, spec.requires);
  if (missing.length > 0) return { ...base, kind: "missing-words", missing };

  if (attempt.tokens > spec.budget) return { ...base, kind: "over-budget" };

  return { ...base, kind: "passed" };
}

/** Which puzzles have been beaten. Stored, so returning visitors keep credit. */
export type ChallengeProgress = Partial<Record<ChallengeId, boolean>>;

export const isBeaten = (progress: ChallengeProgress, id: ChallengeId): boolean =>
  progress[id] === true;

export const beatenCount = (progress: ChallengeProgress, ids: readonly ChallengeId[]): number =>
  ids.filter((id) => isBeaten(progress, id)).length;

/** The tokenizer settings C2 lets the visitor choose between. */
export interface TokenizerChoice {
  readonly corpus: CorpusId;
  readonly merges: number;
}

export const DEFAULT_CHOICE: TokenizerChoice = { corpus: "english", merges: MAX_MERGES };
