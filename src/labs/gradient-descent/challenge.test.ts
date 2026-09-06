import { describe, expect, it } from "vitest";
import { measureRun, objective, stabilityLimit, type OptimizerConfig } from "./engine";
import { landscapeFacts, learningRateAt, LANDSCAPES } from "./landscape";
import {
  CHALLENGES,
  challengeOrder,
  DEFAULTS,
  judge,
  transfer,
  TRANSFER_LANDSCAPE,
  TRANSFER_START,
} from "./challenge";

/**
 * The judge, and the state each challenge opens in.
 *
 * `engine.test.ts` proves the challenges are solvable at all. This file proves
 * that the thing grading an attempt agrees with that proof, and that the
 * controls a visitor first sees are pointed at the lesson rather than
 * accidentally already correct.
 */

describe("judging", () => {
  it("calls an attempt solved only when it is both convergent and inside the budget", () => {
    for (const id of challengeOrder) {
      const spec = CHALLENGES[id];
      for (const frac of [0.1, 0.3, 0.5, 0.7, 0.9, 1.2, 2]) {
        const config: OptimizerConfig = {
          kind: "gd",
          learningRate: frac * stabilityLimit(spec.landscape),
        };
        const verdict = judge(spec, config);
        const truth = measureRun(spec.landscape, spec.start, config, {
          tolerance: spec.tolerance,
          maxSteps: 5000,
        });
        const shouldPass = truth.steps !== null && truth.steps <= spec.budget;
        expect(verdict.kind === "solved", `${id} at ${frac}x`).toBe(shouldPass);
        if (verdict.kind === "solved") {
          expect(verdict.steps).toBe(truth.steps);
          expect(verdict.finalObjective).toBeLessThanOrEqual(spec.tolerance);
        }
      }
    }
  });

  it("separates a run that exploded from one that was merely slow", () => {
    const spec = CHALLENGES.c2;
    const over = judge(spec, { kind: "gd", learningRate: 1.5 * stabilityLimit(spec.landscape) });
    expect(over.kind).toBe("diverged");

    const crawling = judge(spec, { kind: "gd", learningRate: 1e-4 });
    expect(crawling.kind).toBe("over-budget");
    expect(crawling.steps).toBeNull();
  });

  it("never reports a step count for an attempt that did not arrive", () => {
    for (const id of challengeOrder) {
      const spec = CHALLENGES[id];
      const verdict = judge(spec, { kind: "gd", learningRate: 3 * stabilityLimit(spec.landscape) });
      expect(verdict.kind).not.toBe("solved");
      expect(verdict.steps).toBeNull();
    }
  });

  it("agrees with the feasibility gate: no step size solves C3 with plain descent", () => {
    const spec = CHALLENGES.c3;
    for (let i = 1; i <= 300; i++) {
      const learningRate = (i / 301) * stabilityLimit(spec.landscape);
      expect(judge(spec, { kind: "gd", learningRate }).kind).not.toBe("solved");
    }
  });

  it("agrees with the feasibility gate: momentum and Adam can both solve C3", () => {
    const spec = CHALLENGES.c3;
    const limit = stabilityLimit(spec.landscape);

    let momentumWins = 0;
    for (let i = 1; i <= 200; i++) {
      const learningRate = (2 * limit * i) / 200;
      if (judge(spec, { kind: "momentum", learningRate, beta: 0.8 }).kind === "solved") {
        momentumWins += 1;
      }
    }
    expect(momentumWins).toBeGreaterThan(40);

    let adamBest = Infinity;
    for (let i = 1; i <= 300; i++) {
      const verdict = judge(spec, { kind: "adam", learningRate: i / 300 });
      if (verdict.steps !== null) adamBest = Math.min(adamBest, verdict.steps);
    }
    expect(adamBest).toBeLessThanOrEqual(spec.budget);
  });
});

describe("the C2 transfer", () => {
  it("a step size that explodes on the steep landscape settles on the gentle one", () => {
    const spec = CHALLENGES.c2;
    const rate = 1.5 * stabilityLimit(spec.landscape);
    const moved = transfer(spec, rate);
    expect(moved.divergentHere).toBe(true);
    expect(moved.convergesThere).toBe(true);
    expect(moved.stepsThere).not.toBeNull();
    // And the reason is the two limits, not anything about the number itself.
    expect(rate).toBeGreaterThan(landscapeFacts(spec.landscape).stabilityLimit);
    expect(rate).toBeLessThan(landscapeFacts(TRANSFER_LANDSCAPE).stabilityLimit);
  });

  it("the gentler landscape really is gentler, and its start is not already solved", () => {
    const spec = CHALLENGES.c2;
    expect(landscapeFacts(TRANSFER_LANDSCAPE).stabilityLimit).toBeGreaterThan(
      landscapeFacts(spec.landscape).stabilityLimit,
    );
    expect(objective(TRANSFER_LANDSCAPE, TRANSFER_START)).toBeGreaterThan(spec.tolerance);
  });

  it("is not a trick of the transfer landscape: a small enough step works on both", () => {
    const spec = CHALLENGES.c2;
    const moved = transfer(spec, 0.5 * stabilityLimit(spec.landscape));
    expect(moved.divergentHere).toBe(false);
    expect(moved.convergesThere).toBe(true);
  });
});

describe("opening state", () => {
  const configFor = (id: (typeof challengeOrder)[number]): OptimizerConfig => {
    const spec = CHALLENGES[id];
    const d = DEFAULTS[id];
    const learningRate = learningRateAt(spec.landscape, d.rateIndex);
    if (d.optimizer === "adam") return { kind: "adam", learningRate: d.adamIndex / 100 };
    if (d.optimizer === "momentum") {
      return { kind: "momentum", learningRate, beta: d.betaPercent / 100 };
    }
    return { kind: "gd", learningRate };
  };

  it("never opens on an answer", () => {
    for (const id of challengeOrder) {
      expect(judge(CHALLENGES[id], configFor(id)).kind, id).not.toBe("solved");
    }
  });

  it("C1 opens on a step size that arrives, just far too slowly", () => {
    const verdict = judge(CHALLENGES.c1, configFor("c1"));
    expect(verdict.kind).toBe("over-budget");
    expect(verdict.steps).not.toBeNull();
    expect(verdict.steps!).toBeGreaterThan(CHALLENGES.c1.budget);
  });

  it("C2 opens above the stability limit, so the first run explodes", () => {
    expect(judge(CHALLENGES.c2, configFor("c2")).kind).toBe("diverged");
    const rate = learningRateAt(CHALLENGES.c2.landscape, DEFAULTS.c2.rateIndex);
    expect(rate).toBeGreaterThan(stabilityLimit(CHALLENGES.c2.landscape));
    // ...and that same opening rate is the one the transfer panel makes its
    // point with, so the section works before anything is touched.
    const moved = transfer(CHALLENGES.c2, rate);
    expect(moved.divergentHere && moved.convergesThere).toBe(true);
  });

  it("C3 opens on plain descent, which cannot win it", () => {
    expect(DEFAULTS.c3.optimizer).toBe("gd");
    expect(judge(CHALLENGES.c3, configFor("c3")).kind).not.toBe("solved");
  });

  it("every opening step size is on the slider the visitor is given", () => {
    // The plain and momentum sliders top out at 1.3x and 2.1x the stability
    // limit respectively; Adam's runs to 1.20 absolute.
    for (const id of challengeOrder) {
      const d = DEFAULTS[id];
      expect(d.rateIndex).toBeGreaterThanOrEqual(1);
      expect(d.rateIndex).toBeLessThanOrEqual(260);
      expect(d.adamIndex).toBeGreaterThanOrEqual(1);
      expect(d.adamIndex).toBeLessThanOrEqual(120);
      expect(d.betaPercent % 5).toBe(0);
      expect(CHALLENGES[id].allowed).toContain(d.optimizer);
    }
  });
});

describe("challenge landscapes", () => {
  it("uses the presets the design settled on, at the budgets Phase 1 measured", () => {
    expect(CHALLENGES.c1.landscape).toEqual(LANDSCAPES.gentle.landscape);
    expect(CHALLENGES.c2.landscape).toEqual(LANDSCAPES.steep.landscape);
    expect(CHALLENGES.c3.landscape).toEqual(LANDSCAPES.valley.landscape);
    expect(CHALLENGES.c1.budget).toBe(12);
    expect(CHALLENGES.c2.budget).toBe(40);
    expect(CHALLENGES.c3.budget).toBe(39);
    expect(landscapeFacts(CHALLENGES.c3.landscape).conditionNumber).toBe(60);
  });
});
