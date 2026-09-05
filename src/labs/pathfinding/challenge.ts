/**
 * Judging a challenge attempt.
 *
 * Two gates, both of which have to be cleared at once: the path has to be as
 * cheap as the map allows, and the search has to settle no more cells than the
 * budget. A message that only said "failed" would teach nothing, so the
 * verdict always names the axis that was missed and the number that missed it.
 */

import type { SearchResult } from "./engine";
import type { ChallengeMaze } from "./mazes";

export type VerdictKind = "passed" | "cost" | "effort" | "both" | "unsolved";

/**
 * What happened, as facts rather than a sentence.
 *
 * The wording lives in the dictionary: this module is pure logic and has to
 * stay language-agnostic. The component reads `kind` and formats the numbers.
 */
export interface Verdict {
  kind: VerdictKind;
  costOk: boolean;
  effortOk: boolean;
  explored: number;
  pathCost: number;
  budget: number;
  optimalCost: number;
}

export function judge(maze: ChallengeMaze, result: SearchResult): Verdict {
  const base = {
    explored: result.explored,
    pathCost: result.pathCost,
    budget: maze.budget,
    optimalCost: maze.optimalCost,
  };

  if (result.status !== "solved") {
    return { ...base, kind: "unsolved", costOk: false, effortOk: false };
  }

  const costOk = result.pathCost === maze.optimalCost;
  const effortOk = result.explored <= maze.budget;

  if (costOk && effortOk) return { ...base, kind: "passed", costOk, effortOk };
  if (costOk) return { ...base, kind: "effort", costOk, effortOk };
  if (effortOk) return { ...base, kind: "cost", costOk, effortOk };
  return { ...base, kind: "both", costOk, effortOk };
}

/** Which mazes have been beaten, keyed by maze id. Stored between visits. */
export type ChallengeProgress = Record<string, boolean>;

export const isSolved = (progress: ChallengeProgress, id: string): boolean => progress[id] === true;

export const solvedCount = (progress: ChallengeProgress, ids: readonly string[]): number =>
  ids.filter((id) => isSolved(progress, id)).length;
