import { describe, expect, it } from "vitest";
import { CHALLENGES, beatenCount, isBeaten, judge, type ChallengeProgress } from "./challenge";
import { inversions, sortAndMeasure, type Algorithm, type SortResult } from "./engine";
import { editCount, setValue } from "./arrayEdit";
import { SIZE } from "./arrays";

const ALGORITHMS: Algorithm[] = ["selection", "insertion"];
const SPEC = CHALLENGES[0]!;

const result = (over: Partial<SortResult>): SortResult => ({
  comparisons: 0,
  moves: 0,
  steps: 0,
  values: Int32Array.of(1),
  ...over,
});

describe("judging an attempt", () => {
  it("passes when the objective is inside the budget", () => {
    expect(judge(SPEC, result({ comparisons: SPEC.budget })).kind).toBe("passed");
  });

  it("treats the budget as inclusive", () => {
    expect(judge(SPEC, result({ comparisons: SPEC.budget + 1 })).kind).toBe("over-budget");
  });

  it("carries the number that missed, and the budget", () => {
    const verdict = judge(SPEC, result({ comparisons: 381 }));
    expect(verdict.kind).toBe("over-budget");
    expect(verdict.used).toBe(381);
    expect(verdict.budget).toBe(SPEC.budget);
    expect(verdict.objective).toBe("comparisons");
  });

  it("judges the moves challenge on moves, not comparisons", () => {
    const moves = CHALLENGES[1]!;
    // A huge comparison count is irrelevant here and must not fail the attempt.
    expect(judge(moves, result({ comparisons: 9999, moves: moves.budget })).kind).toBe("passed");
    expect(judge(moves, result({ comparisons: 0, moves: moves.budget + 1 })).kind).toBe(
      "over-budget",
    );
    expect(judge(moves, result({ moves: 74 })).objective).toBe("moves");
  });

  it("rejects an attempt that changed too many bars, before looking at the budget", () => {
    const edits = CHALLENGES[2]!;
    const verdict = judge(edits, result({ comparisons: 0 }), (edits.maxEdits ?? 0) + 1);
    expect(verdict.kind).toBe("too-many-edits");
    expect(verdict.maxEdits).toBe(edits.maxEdits);
  });
});

// -------------------------------------------------------------- GATE A ----

describe("Gate A — every puzzle is winnable, and not by the same move twice", () => {
  it("gives each puzzle a budget that some choice can meet", () => {
    for (const spec of CHALLENGES) {
      const candidates = spec.algorithm ? [spec.algorithm] : ALGORITHMS;
      const passes = candidates.filter((algorithm) => {
        const measured = sortAndMeasure(spec.values, algorithm);
        return judge(spec, measured).kind === "passed";
      });
      // The third puzzle is meant to be unwinnable until the data is changed.
      if (spec.maxEdits === undefined) expect(passes).toHaveLength(1);
      else expect(passes).toHaveLength(0);
    }
  });

  it("C1 is passed only by the algorithm that notices the data is nearly in order", () => {
    const spec = CHALLENGES[0]!;
    expect(judge(spec, sortAndMeasure(spec.values, "insertion")).kind).toBe("passed");
    expect(judge(spec, sortAndMeasure(spec.values, "selection")).kind).toBe("over-budget");
  });

  it("C2 punishes assuming the adaptive one is simply better", () => {
    const spec = CHALLENGES[1]!;
    // The trap: insertion asks fewer questions here, and still loses.
    const selection = sortAndMeasure(spec.values, "selection");
    const insertion = sortAndMeasure(spec.values, "insertion");
    expect(insertion.comparisons).toBeLessThan(selection.comparisons);
    expect(judge(spec, selection).kind).toBe("passed");
    expect(judge(spec, insertion).kind).toBe("over-budget");
  });

  it("C3 rewards fixing the value that is furthest from home", () => {
    const spec = CHALLENGES[2]!;
    const asGiven = Int32Array.from(spec.values);
    expect(judge(spec, sortAndMeasure(asGiven, "insertion"), 0).kind).toBe("over-budget");

    // One edit — put the stranded value back where it belongs.
    const fixed = Int32Array.from(spec.values);
    setValue(fixed, 2, 3);
    expect(editCount(fixed, spec.values)).toBe(1);
    expect(judge(spec, sortAndMeasure(fixed, "insertion"), 1).kind).toBe("passed");

    // Two edits spent on the near-miss instead: still over budget, which is
    // the whole point — it is distance from home that costs, not being wrong.
    const tidied = Int32Array.from(spec.values);
    setValue(tidied, 19, 20);
    setValue(tidied, 20, 21);
    expect(editCount(tidied, spec.values)).toBe(2);
    expect(judge(spec, sortAndMeasure(tidied, "insertion"), 2).kind).toBe("over-budget");
  });

  it("C3 cannot be brute-forced by three careless edits", () => {
    const spec = CHALLENGES[2]!;
    const wrecked = Int32Array.from(spec.values);
    setValue(wrecked, 5, 32);
    setValue(wrecked, 6, 32);
    setValue(wrecked, 7, 32);
    expect(judge(spec, sortAndMeasure(wrecked, "insertion"), 3).kind).toBe("over-budget");
  });

  it("asks a different question on each puzzle", () => {
    expect(new Set(CHALLENGES.map((c) => c.objective)).size).toBe(2);
    expect(CHALLENGES.filter((c) => c.maxEdits !== undefined)).toHaveLength(1);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
  });

  it("uses fixtures that all fit the chart the lab draws", () => {
    for (const spec of CHALLENGES) {
      expect(spec.values).toHaveLength(SIZE);
      expect(inversions(spec.values)).toBeGreaterThan(0);
    }
  });
});

describe("progress", () => {
  it("remembers which puzzles have been beaten", () => {
    const progress: ChallengeProgress = { "which-one-cares": true };
    expect(isBeaten(progress, "which-one-cares")).toBe(true);
    expect(isBeaten(progress, "fewest-writes")).toBe(false);
    expect(
      beatenCount(
        progress,
        CHALLENGES.map((c) => c.id),
      ),
    ).toBe(1);
  });

  it("treats anything but true as unbeaten", () => {
    expect(isBeaten({}, "which-one-cares")).toBe(false);
    expect(
      beatenCount(
        {},
        CHALLENGES.map((c) => c.id),
      ),
    ).toBe(0);
  });
});
