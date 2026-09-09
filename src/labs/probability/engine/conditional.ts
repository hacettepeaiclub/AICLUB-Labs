/**
 * Two children, and what the wording of the clue does to the answer.
 *
 * Pure TypeScript, and small enough to enumerate: four ordered outcomes, each
 * with probability 1/4, filtered by a stated condition.
 *
 * ## The model, stated
 *
 *   - each child is independently a boy or a girl with probability 1/2;
 *   - birth order is recorded, so BG and GB are different outcomes;
 *   - the clue is conditioned on exactly as written.
 *
 * That last line is the entire lesson, and it is also the reason this file
 * exposes two conditions instead of one. "At least one is a boy" and "the
 * first is a boy" are different facts about the same family, and they leave
 * different sets of possibilities standing. Neither answer is *the* answer to
 * "the two children problem" — the question is underspecified until the clue
 * is.
 *
 * A third reading exists and is deliberately not modelled here: if you met one
 * child at random and observed a boy, the answer is 1/2 rather than 1/3, even
 * though "at least one is a boy" is now true. That depends on how the
 * information reached you rather than on what it says, which is a longer story
 * than this section is telling. The lab does not claim otherwise.
 */

export type Child = "B" | "G";

export interface Outcome {
  /** Birth order, oldest first. */
  readonly children: readonly [Child, Child];
  /** "GG", "GB", "BG" or "BB" — the label the matrix prints. */
  readonly id: string;
}

const make = (first: Child, second: Child): Outcome => ({
  children: [first, second],
  id: `${first}${second}`,
});

/** The four equally likely ordered outcomes, in matrix order. */
export const OUTCOMES: readonly Outcome[] = [
  make("G", "G"),
  make("G", "B"),
  make("B", "G"),
  make("B", "B"),
];

/** Each outcome has probability 1/4 before any clue is given. */
export const PRIOR = 1 / OUTCOMES.length;

export type ClueId = "atLeastOneBoy" | "firstIsBoy";

export const CLUES: readonly ClueId[] = ["atLeastOneBoy", "firstIsBoy"];

/** Whether an outcome survives a clue. */
export function satisfies(outcome: Outcome, clue: ClueId): boolean {
  const [first, second] = outcome.children;
  return clue === "firstIsBoy" ? first === "B" : first === "B" || second === "B";
}

/** Whether both children are boys. The event the question asks about. */
export const isBothBoys = (outcome: Outcome): boolean =>
  outcome.children[0] === "B" && outcome.children[1] === "B";

export interface Analysis {
  readonly clue: ClueId;
  /** The outcomes still possible once the clue is known. */
  readonly kept: readonly Outcome[];
  /** The outcomes the clue ruled out. */
  readonly ruledOut: readonly Outcome[];
  /** How many of the survivors are BB. */
  readonly favourable: number;
  /** `favourable / kept.length` — the conditional probability. */
  readonly probability: number;
}

/**
 * Condition on a clue and report what is left.
 *
 * Counting rather than dividing: because the four outcomes are equally likely,
 * the conditional probability is the share of survivors that are BB, and the
 * lab can show the survivors themselves next to the fraction. Nothing here is
 * a formula the visitor has to take on trust.
 */
export function analyse(clue: ClueId): Analysis {
  const kept = OUTCOMES.filter((outcome) => satisfies(outcome, clue));
  const ruledOut = OUTCOMES.filter((outcome) => !satisfies(outcome, clue));
  const favourable = kept.filter(isBothBoys).length;
  return {
    clue,
    kept,
    ruledOut,
    favourable,
    probability: kept.length === 0 ? 0 : favourable / kept.length,
  };
}
