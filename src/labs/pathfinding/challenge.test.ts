import { describe, expect, it } from "vitest";
import { solve, type Algorithm, type SearchResult } from "./engine";
import { CHALLENGES, challengeGrid } from "./mazes";
import { isSolved, judge, solvedCount, type ChallengeProgress } from "./challenge";

const MAZE = CHALLENGES[0]!;

const result = (over: Partial<SearchResult>): SearchResult => ({
  status: "solved",
  explored: MAZE.budget,
  pathLength: 10,
  pathCost: MAZE.optimalCost,
  steps: 100,
  ...over,
});

describe("judging an attempt", () => {
  it("passes only when both gates are cleared", () => {
    const verdict = judge(MAZE, result({}));
    expect(verdict.kind).toBe("passed");
    expect(verdict.costOk).toBe(true);
    expect(verdict.effortOk).toBe(true);
  });

  it("treats the budget as inclusive", () => {
    expect(judge(MAZE, result({ explored: MAZE.budget })).kind).toBe("passed");
    expect(judge(MAZE, result({ explored: MAZE.budget + 1 })).kind).toBe("effort");
  });

  it("names the effort axis, with both numbers, when only the path was right", () => {
    const verdict = judge(MAZE, result({ explored: MAZE.budget + 200 }));
    expect(verdict.kind).toBe("effort");
    expect(verdict.costOk).toBe(true);
    expect(verdict.explored).toBe(MAZE.budget + 200);
    expect(verdict.budget).toBe(MAZE.budget);
  });

  it("names the cost axis, with both numbers, when only the effort was right", () => {
    const verdict = judge(MAZE, result({ pathCost: MAZE.optimalCost + 7 }));
    expect(verdict.kind).toBe("cost");
    expect(verdict.effortOk).toBe(true);
    expect(verdict.pathCost).toBe(MAZE.optimalCost + 7);
    expect(verdict.optimalCost).toBe(MAZE.optimalCost);
  });

  it("names both when neither was right", () => {
    const verdict = judge(
      MAZE,
      result({ pathCost: MAZE.optimalCost + 7, explored: MAZE.budget + 50 }),
    );
    expect(verdict.kind).toBe("both");
    expect(verdict.costOk).toBe(false);
    expect(verdict.effortOk).toBe(false);
  });

  it("says so when the search never arrived", () => {
    const verdict = judge(MAZE, result({ status: "unreachable", pathCost: 0, pathLength: 0 }));
    expect(verdict.kind).toBe("unsolved");
    expect(verdict.kind).toBe("unsolved");
  });

  it("never claims a cheaper-than-optimal path is fine", () => {
    // Below the optimum is impossible; if it ever happened it would be a bug,
    // not a win, so the cost gate is an equality rather than a bound.
    expect(judge(MAZE, result({ pathCost: MAZE.optimalCost - 1 })).costOk).toBe(false);
  });
});

describe("judging real runs — the challenge is winnable and not by accident", () => {
  it("passes A* and fails the other two on every map", () => {
    for (const maze of CHALLENGES) {
      const grid = challengeGrid(maze);
      const verdicts = (["bfs", "dijkstra", "astar"] as Algorithm[]).map(
        (algorithm) => [algorithm, judge(maze, solve(grid, algorithm))] as const,
      );
      for (const [algorithm, verdict] of verdicts) {
        if (algorithm === "astar") expect(verdict.kind).toBe("passed");
        else expect(verdict.kind).not.toBe("passed");
      }
    }
  });

  it("fails BFS on cost only where the ground is uneven", () => {
    const failures = CHALLENGES.map((maze) => judge(maze, solve(challengeGrid(maze), "bfs")));
    // The swamp is the one where the cost gate does the work; elsewhere BFS
    // finds an optimal path and is stopped by the budget instead.
    expect(failures.filter((v) => !v.costOk)).toHaveLength(1);
    expect(failures.every((v) => !v.effortOk)).toBe(true);
  });
});

describe("progress", () => {
  it("remembers which maps have been beaten", () => {
    const progress: ChallengeProgress = { swamp: true };
    expect(isSolved(progress, "swamp")).toBe(true);
    expect(isSolved(progress, "open-ground")).toBe(false);
    expect(solvedCount(progress, ["swamp", "open-ground"])).toBe(1);
  });

  it("treats anything but true as unsolved", () => {
    expect(isSolved({}, "swamp")).toBe(false);
    expect(
      solvedCount(
        {},
        CHALLENGES.map((m) => m.id),
      ),
    ).toBe(0);
  });
});
