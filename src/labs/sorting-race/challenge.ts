/**
 * The three challenges, and how an attempt is judged.
 *
 * Each one asks a different question, and none of them can be answered by
 * remembering which algorithm is "best" — because there is no such thing here,
 * only a cheaper answer for the objective in front of you.
 *
 * Budgets are derived from what the engine actually does on these fixtures and
 * pinned by `challenge.test.ts`; nothing here is a guess.
 */

import type { Algorithm, SortResult } from "./engine";

export type Objective = "comparisons" | "moves";

/** The three puzzles. A union so translations can be keyed by it. */
export type ChallengeId = "which-one-cares" | "fewest-writes" | "three-edits";

export interface ChallengeSpec {
  id: ChallengeId;
  /** The fixed starting array. */
  values: readonly number[];
  objective: Objective;
  budget: number;
  /** Fixed for the challenge that is about the data rather than the algorithm. */
  algorithm?: Algorithm;
  /** When set, the visitor may reshape at most this many bars. */
  maxEdits?: number;
}

const sortedRamp = (n = 32): number[] => Array.from({ length: n }, (_, i) => i + 1);

/** Sorted, then a few neighbours swapped — cheap for anything that notices. */
const almostSorted = (): number[] => {
  const values = sortedRamp();
  for (const i of [3, 9, 16, 24, 29]) {
    const left = values[i]!;
    values[i] = values[i + 1]!;
    values[i + 1] = left;
  }
  return values;
};

/** Sorted apart from one value dumped far from where it belongs. */
const oneFarFromHome = (): number[] => {
  const values = sortedRamp();
  values[2] = 32;
  const left = values[19]!;
  values[19] = values[20]!;
  values[20] = left;
  return values;
};

const SHUFFLED = [
  17, 3, 28, 9, 22, 1, 14, 31, 6, 25, 11, 19, 2, 30, 8, 23, 13, 27, 5, 16, 32, 10, 21, 4, 29, 15,
  26, 7, 20, 12, 24, 18,
];

export const CHALLENGES: readonly ChallengeSpec[] = [
  {
    id: "which-one-cares",
    values: almostSorted(),
    objective: "comparisons",
    // Selection asks 496 whatever happens; insertion asks 36 here.
    budget: 64,
  },
  {
    id: "fewest-writes",
    values: SHUFFLED,
    objective: "moves",
    // Selection relocates 30 values; insertion relocates 256.
    budget: 48,
  },
  {
    id: "three-edits",
    values: oneFarFromHome(),
    objective: "comparisons",
    // 60 as it stands. Fixing the one value that is far from home costs a
    // single edit and drops it to 32; tidying the near-miss instead spends two
    // edits and only reaches 59.
    budget: 40,
    algorithm: "insertion",
    maxEdits: 3,
  },
];

export type VerdictKind = "passed" | "over-budget" | "too-many-edits";

/**
 * What happened, as facts rather than a sentence.
 *
 * The wording lives in the dictionary: this module is pure logic and has to
 * stay language-agnostic. The component reads `kind` and formats the numbers.
 */
export interface Verdict {
  kind: VerdictKind;
  /** Comparisons or moves, whichever this puzzle counts. */
  used: number;
  objective: Objective;
  budget: number;
  edits: number;
  maxEdits: number;
}

export function judge(spec: ChallengeSpec, result: SortResult, edits = 0): Verdict {
  const used = spec.objective === "comparisons" ? result.comparisons : result.moves;
  const base = {
    used,
    objective: spec.objective,
    budget: spec.budget,
    edits,
    maxEdits: spec.maxEdits ?? 0,
  };

  if (spec.maxEdits !== undefined && edits > spec.maxEdits) {
    return { ...base, kind: "too-many-edits" };
  }
  if (used > spec.budget) return { ...base, kind: "over-budget" };
  return { ...base, kind: "passed" };
}

/** Which challenges have been beaten, kept between visits. */
export type ChallengeProgress = Partial<Record<ChallengeId, boolean>>;

export const isBeaten = (progress: ChallengeProgress, id: ChallengeId): boolean =>
  progress[id] === true;

export const beatenCount = (progress: ChallengeProgress, ids: readonly ChallengeId[]): number =>
  ids.filter((id) => isBeaten(progress, id)).length;
