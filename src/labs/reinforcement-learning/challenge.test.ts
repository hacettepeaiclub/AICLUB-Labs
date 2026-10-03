import { describe, expect, it } from "vitest";
import { CHALLENGES, LEVER_RANGE, WINDOW, judge, solutions } from "./challenge";
import { TILE_REWARD_MAX, TILE_REWARD_MIN } from "./world";

/**
 * A puzzle that cannot be solved, or that is already solved when it opens, is
 * worse than no puzzle. Both are measured here against the real engine rather
 * than asserted, so an engine change breaks the tests instead of the lab.
 */

describe("every puzzle", () => {
  it("starts unsolved", () => {
    for (const spec of CHALLENGES) {
      const attempt = judge(spec, spec.start);
      expect(attempt.solved, `${spec.id} is already solved at its start`).toBe(false);
      expect(attempt.untouched).toBe(true);
    }
  });

  it("is solvable, and by a wide band rather than one lucky value", () => {
    for (const spec of CHALLENGES) {
      const found = solutions(spec);
      const { min, max, step } = LEVER_RANGE[spec.lever];
      const total = Math.round((max - min) / step) + 1;
      expect(found.length, `${spec.id} has no solution`).toBeGreaterThan(0);
      // At least a tenth of the track works: nobody should have to find a
      // single position by luck.
      expect(found.length / total, `${spec.id} solution band is too narrow`).toBeGreaterThan(0.1);
    }
  });

  it("has one contiguous solution band, so the lever reads as a direction", () => {
    for (const spec of CHALLENGES) {
      const found = solutions(spec);
      const { step } = LEVER_RANGE[spec.lever];
      for (let i = 1; i < found.length; i++) {
        expect(found[i]! - found[i - 1]!, `${spec.id} has a hole at ${found[i]}`).toBeLessThan(
          step * 1.5,
        );
      }
    }
  });

  it("keeps its lever inside the range the world allows", () => {
    for (const spec of CHALLENGES) {
      const range = LEVER_RANGE[spec.lever];
      const value = spec.start[spec.lever];
      expect(value).toBeGreaterThanOrEqual(range.min);
      expect(value).toBeLessThanOrEqual(range.max);
      if (spec.lever === "tileReward") {
        expect(range.min).toBe(TILE_REWARD_MIN);
        expect(range.max).toBe(TILE_REWARD_MAX);
      }
    }
  });

  it("reports the numbers its verdict was made from", () => {
    for (const spec of CHALLENGES) {
      const attempt = judge(spec, spec.start);
      expect(attempt.window.length).toBeLessThanOrEqual(WINDOW);
      expect(attempt.successRate).toBeGreaterThanOrEqual(0);
      expect(attempt.successRate).toBeLessThanOrEqual(1);
      expect(Number.isFinite(attempt.meanSteps)).toBe(true);
      expect(Number.isFinite(attempt.meanReward)).toBe(true);
      const recomputed = attempt.window.filter((e) => e.reachedGoal).length / attempt.window.length;
      expect(attempt.successRate).toBeCloseTo(recomputed, 12);
    }
  });

  it("is deterministic — the same lever gives the same verdict every time", () => {
    for (const spec of CHALLENGES) {
      const value = solutions(spec)[0]!;
      const settings = { ...spec.start, [spec.lever]: value };
      const a = judge(spec, settings);
      const b = judge(spec, settings);
      expect(a.rollout.path).toEqual(b.rollout.path);
      expect(a.successRate).toBe(b.successRate);
      expect(a.solved).toBe(b.solved);
    }
  });
});

describe("what each puzzle is actually about", () => {
  it("cross: the square has to be worth something, but less than finishing", () => {
    const spec = CHALLENGES.find((s) => s.id === "cross")!;
    const found = solutions(spec);
    // Too negative and it detours; too positive and it stops finishing.
    expect(Math.min(...found)).toBeGreaterThan(TILE_REWARD_MIN);
    expect(Math.max(...found)).toBeLessThan(TILE_REWARD_MAX);
    expect(judge(spec, { ...spec.start, tileReward: TILE_REWARD_MIN }).behaviour).toBe("avoided");
    expect(judge(spec, { ...spec.start, tileReward: TILE_REWARD_MAX }).behaviour).toBe("stayed");
  });

  it("camp: rewarding the square more than the door stops it finishing at all", () => {
    const spec = CHALLENGES.find((s) => s.id === "camp")!;
    const found = solutions(spec);
    // The band runs to the top of the range: more is always worse, never better.
    expect(Math.max(...found)).toBeCloseTo(TILE_REWARD_MAX, 6);
    const solved = judge(spec, { ...spec.start, tileReward: Math.min(...found) });
    expect(solved.rollout.reachedGoal).toBe(false);
    expect(solved.rollout.tileVisits).toBeGreaterThan(1);
  });

  it("settle: too much exploration leaves the run still wandering at the end", () => {
    const spec = CHALLENGES.find((s) => s.id === "settle")!;
    const opening = judge(spec, spec.start);
    // The failure is in the run, not the route: the greedy table is fine.
    expect(opening.successRate).toBeLessThan(0.5);
    expect(opening.meanSteps).toBeGreaterThan(40);

    const found = solutions(spec);
    // Lower is the direction that helps.
    expect(Math.min(...found)).toBeLessThan(spec.start.epsilon);
    expect(Math.max(...found)).toBeLessThan(spec.start.epsilon);
    const fixed = judge(spec, { ...spec.start, epsilon: Math.min(...found) });
    expect(fixed.successRate).toBeGreaterThanOrEqual(0.9);
  });
});
