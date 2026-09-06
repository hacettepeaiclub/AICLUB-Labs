import { describe, expect, it } from "vitest";
import {
  ADAM_BETA1,
  ADAM_BETA2,
  ADAM_EPSILON,
  conditionNumber,
  createRun,
  currentObjective,
  divergesAnalytically,
  gradient,
  measureRun,
  objective,
  objectiveContractionFactor,
  optimalLearningRate,
  parameterContractionFactor,
  pathAt,
  runToEnd,
  stabilityLimit,
  step,
  type Landscape,
  type OptimizerConfig,
  type Point,
} from "./engine";
import {
  aspectRatio,
  CHALLENGES,
  contourSemiAxes,
  LANDSCAPES,
  landscapeFacts,
  landscapeIds,
  type ChallengeSpec,
} from "./landscape";

/**
 * The suite deliberately asserts *relations*, not remembered numbers.
 *
 * A test that says "this run takes 78 steps" only proves the engine still does
 * what it did the day the number was pasted in. A test that says "the run
 * matches (1 − ηa)^t x₀ to machine precision" proves the engine is doing
 * gradient descent. Almost everything below is of the second kind; the few
 * places a concrete number appears are the feasibility gate, where the number
 * *is* the claim the lab makes to the visitor.
 */

const ALL: Landscape[] = [
  { a: 1, b: 1 },
  { a: 6, b: 1 },
  { a: 1, b: 6 },
  { a: 20, b: 1 },
  { a: 1, b: 25 },
  { a: 60, b: 1 },
  { a: 1000, b: 0.001 },
  { a: 0.5, b: 3.25 },
];

const P = (x: number, y: number): Point => ({ x, y });
const norm = (p: Point): number => Math.hypot(p.x, p.y);

/** Angle in degrees between two vectors. */
function angleBetween(u: Point, v: Point): number {
  const dot = u.x * v.x + u.y * v.y;
  const cos = Math.min(1, Math.max(-1, dot / (norm(u) * norm(v))));
  return (Math.acos(cos) * 180) / Math.PI;
}

// =========================================================== the objective ==

describe("objective and gradient", () => {
  it("is zero at the minimum and strictly positive everywhere else", () => {
    for (const l of ALL) {
      expect(objective(l, P(0, 0))).toBe(0);
      for (const p of [P(1, 0), P(0, 1), P(-0.3, 0.7), P(1, -0.55)]) {
        expect(objective(l, p)).toBeGreaterThan(0);
      }
    }
  });

  it("has a vanishing gradient only at the minimum", () => {
    for (const l of ALL) {
      expect(gradient(l, P(0, 0))).toEqual(P(0, 0));
      expect(norm(gradient(l, P(1, -0.55)))).toBeGreaterThan(0);
    }
  });

  it("agrees with a central finite difference of the objective", () => {
    const h = 1e-6;
    for (const l of ALL) {
      for (const p of [P(1, -0.55), P(-0.4, 0.9), P(0.02, -0.02)]) {
        const gx = (objective(l, P(p.x + h, p.y)) - objective(l, P(p.x - h, p.y))) / (2 * h);
        const gy = (objective(l, P(p.x, p.y + h)) - objective(l, P(p.x, p.y - h))) / (2 * h);
        const g = gradient(l, p);
        // Scaled tolerance: the difference quotient loses precision in
        // proportion to the size of the values being subtracted.
        const scale = Math.max(1, Math.abs(g.x), Math.abs(g.y));
        expect(gx).toBeCloseTo(g.x, 5 - Math.log10(scale));
        expect(gy).toBeCloseTo(g.y, 5 - Math.log10(scale));
      }
    }
  });
});

// ======================================================= analytic constants ==

describe("condition number", () => {
  it("is max(a, b) / min(a, b) and never assumes a >= b", () => {
    expect(conditionNumber({ a: 25, b: 1 })).toBe(25);
    expect(conditionNumber({ a: 1, b: 25 })).toBe(25);
    expect(conditionNumber({ a: 0.001, b: 1000 })).toBe(1e6);
  });

  it("is symmetric in its two arguments", () => {
    for (const l of ALL) {
      expect(conditionNumber({ a: l.b, b: l.a })).toBe(conditionNumber(l));
    }
  });

  it("is at least 1, and exactly 1 only when the curvatures are equal", () => {
    for (const l of ALL) {
      const k = conditionNumber(l);
      expect(k).toBeGreaterThanOrEqual(1);
      expect(k === 1).toBe(l.a === l.b);
    }
  });
});

describe("stability limit", () => {
  it("is 2 / the larger curvature, on whichever axis it sits", () => {
    for (const l of ALL) {
      expect(stabilityLimit(l)).toBeCloseTo(2 / Math.max(l.a, l.b), 12);
      expect(stabilityLimit({ a: l.b, b: l.a })).toBe(stabilityLimit(l));
    }
  });
});

describe("optimal learning rate", () => {
  it("balances the two coordinates: |1 - eta*a| equals |1 - eta*b|", () => {
    for (const l of ALL) {
      const eta = optimalLearningRate(l);
      expect(Math.abs(1 - eta * l.a)).toBeCloseTo(Math.abs(1 - eta * l.b), 12);
    }
  });

  it("always sits strictly inside the stability limit", () => {
    for (const l of ALL) {
      const eta = optimalLearningRate(l);
      expect(eta).toBeGreaterThan(0);
      expect(eta).toBeLessThan(stabilityLimit(l));
    }
  });

  it("is exactly half the stability limit on an isotropic bowl, where it lands in one step", () => {
    const l: Landscape = { a: 4, b: 4 };
    expect(optimalLearningRate(l)).toBeCloseTo(stabilityLimit(l) / 2, 12);
    const run = runToEnd(
      createRun(
        l,
        P(1, -0.55),
        { kind: "gd", learningRate: optimalLearningRate(l) },
        { tolerance: 1e-12, maxSteps: 10 },
      ),
    );
    expect(run.t).toBe(1);
    expect(run.x).toBeCloseTo(0, 15);
    expect(run.y).toBeCloseTo(0, 15);
  });
});

describe("contraction factors are two different numbers", () => {
  it("parameter-space contraction is (k - 1) / (k + 1)", () => {
    for (const l of ALL) {
      const k = conditionNumber(l);
      expect(parameterContractionFactor(l)).toBeCloseTo((k - 1) / (k + 1), 12);
    }
  });

  it("parameter-space contraction equals |1 - eta* * a|, the per-step factor on a coordinate", () => {
    for (const l of ALL) {
      const eta = optimalLearningRate(l);
      expect(parameterContractionFactor(l)).toBeCloseTo(Math.abs(1 - eta * l.a), 12);
    }
  });

  it("objective contraction is the square of it, never the same number", () => {
    for (const l of ALL) {
      const rho = parameterContractionFactor(l);
      expect(objectiveContractionFactor(l)).toBeCloseTo(rho * rho, 12);
      // The two coincide only at rho = 0 and rho = 1, i.e. k = 1 and k -> inf.
      if (rho > 1e-9 && rho < 1 - 1e-9) {
        expect(objectiveContractionFactor(l)).toBeLessThan(rho);
      }
    }
  });

  it("both factors are what the run actually does", () => {
    for (const l of ALL) {
      if (conditionNumber(l) === 1) continue;
      const eta = optimalLearningRate(l);
      const run = createRun(l, P(1, -0.55), { kind: "gd", learningRate: eta }, { tolerance: 0, maxSteps: 40 });
      // Let the transient settle: the slower mode dominates after a few steps.
      for (let i = 0; i < 30; i++) step(run);
      const before = pathAt(run, 28);
      const after = pathAt(run, 29);
      expect(norm(after) / norm(before)).toBeCloseTo(parameterContractionFactor(l), 6);
      expect(objective(l, after) / objective(l, before)).toBeCloseTo(objectiveContractionFactor(l), 6);
    }
  });
});

// ============================================================== closed form ==

describe("plain gradient descent matches the closed form", () => {
  it("x_t = (1 - eta*a)^t * x_0 to machine precision", () => {
    for (const l of ALL) {
      for (const frac of [0.05, 0.3, 0.7, 0.95, 1.4]) {
        const eta = frac * stabilityLimit(l);
        const start = P(1, -0.55);
        const run = createRun(l, start, { kind: "gd", learningRate: eta }, {
          tolerance: 0,
          maxSteps: 25,
          escapeRadius: Infinity,
        });
        runToEnd(run);
        for (let t = 0; t < run.length; t++) {
          const p = pathAt(run, t);
          const ex = Math.pow(1 - eta * l.a, t) * start.x;
          const ey = Math.pow(1 - eta * l.b, t) * start.y;
          const scale = Math.max(1, Math.abs(ex), Math.abs(ey));
          expect(Math.abs(p.x - ex) / scale).toBeLessThan(1e-12);
          expect(Math.abs(p.y - ey) / scale).toBeLessThan(1e-12);
        }
      }
    }
  });
});

describe("the stability boundary is exact and sharp", () => {
  const l: Landscape = { a: 20, b: 1 };
  const limit = stabilityLimit(l); // exactly 0.1

  const outcome = (eta: number) =>
    measureRun(l, P(1, -0.55), { kind: "gd", learningRate: eta }, { tolerance: 1e-9, maxSteps: 40000 });

  it("converges just below the limit - slowly, but it does converge", () => {
    const r = outcome(limit * (1 - 1e-3));
    expect(r.status).toBe("converged");
    // Right at the edge the steep coordinate shrinks by only 0.2% per step, so
    // "stable" and "useful" turn out to be very different properties.
    expect(r.steps).toBeGreaterThan(1000);
  });

  it("neither converges nor escapes exactly at the limit", () => {
    // At eta = 2/a the x coordinate is multiplied by exactly -1 each step: it
    // orbits forever at constant magnitude. Only y makes progress.
    const run = runToEnd(
      createRun(l, P(1, -0.55), { kind: "gd", learningRate: limit }, { tolerance: 1e-9, maxSteps: 500 }),
    );
    expect(run.status).toBe("exhausted");
    for (let t = 0; t < run.length; t++) expect(Math.abs(pathAt(run, t).x)).toBeCloseTo(1, 12);
  });

  it("diverges just above the limit", () => {
    expect(outcome(limit * (1 + 1e-3)).status).toBe("diverged");
  });

  it("divergesAnalytically agrees with whether the run actually contracts", () => {
    // Deliberately not phrased as "reaches the tolerance within N steps". At
    // 0.99 of the limit a run contracts by 0.2% per step and needs tens of
    // thousands of them: stable, but nowhere near convergent-within-a-budget.
    // The mathematical claim is about contraction, so contraction is what is
    // checked; speed is a separate question the lab asks separately.
    for (const land of ALL) {
      for (const frac of [0.5, 0.99, 1.01, 2]) {
        const eta = frac * stabilityLimit(land);
        const start = P(1, -0.55);
        const run = createRun(
          land,
          start,
          { kind: "gd", learningRate: eta },
          { tolerance: 0, maxSteps: 500, escapeRadius: Infinity },
        );
        runToEnd(run);
        const grew = norm(P(run.x, run.y)) > norm(start);
        expect(divergesAnalytically(land, eta)).toBe(grew);
      }
    }
  });

  it("a step size is not good or bad on its own - only against a landscape", () => {
    // This is the claim challenge C2 is built on, and the reason the lab never
    // says "a large learning rate is bad".
    const eta = 0.15;
    const on = (land: Landscape) =>
      measureRun(land, P(1, -0.55), { kind: "gd", learningRate: eta }, { tolerance: 1e-3, maxSteps: 2000 });
    expect(on({ a: 20, b: 1 }).status).toBe("diverged");
    expect(on({ a: 6, b: 1 }).status).toBe("converged");
    expect(on({ a: 1, b: 1 }).status).toBe("converged");
  });
});

// ============================================== the gradient is not the goal ==

describe("the descent direction is not the direction to the minimum", () => {
  const at = P(1, -0.55);
  const toMinimum = P(-at.x, -at.y);
  const descent = (l: Landscape) => {
    const g = gradient(l, at);
    return P(-g.x, -g.y);
  };

  it("coincides exactly when, and only when, the curvatures are equal", () => {
    expect(angleBetween(descent({ a: 1, b: 1 }), toMinimum)).toBeCloseTo(0, 10);
    expect(angleBetween(descent({ a: 7.5, b: 7.5 }), toMinimum)).toBeCloseTo(0, 10);
    for (const l of ALL) {
      const angle = angleBetween(descent(l), toMinimum);
      if (l.a === l.b) expect(angle).toBeCloseTo(0, 10);
      else expect(angle).toBeGreaterThan(1);
    }
  });

  it("separates further as the landscape gets worse conditioned", () => {
    const angles = [1, 2, 4, 6, 20, 60].map((a) => angleBetween(descent({ a, b: 1 }), toMinimum));
    for (let i = 1; i < angles.length; i++) {
      expect(angles[i]!).toBeGreaterThan(angles[i - 1]!);
    }
    expect(angles[0]!).toBeCloseTo(0, 10);
  });

  it("can reach 90 degrees of error nowhere, but gets arbitrarily close", () => {
    // sup over the plane of the angle between -grad and -theta is
    // arcsin((k-1)/(k+1)) -> 90 degrees as k -> infinity, never reaching it.
    for (const k of [6, 60, 1e6]) {
      const l: Landscape = { a: k, b: 1 };
      const bound = (Math.asin((k - 1) / (k + 1)) * 180) / Math.PI;
      let worst = 0;
      for (let i = 1; i < 400; i++) {
        const theta = (Math.PI / 2) * (i / 400);
        const p = P(Math.cos(theta), Math.sin(theta));
        const g = gradient(l, p);
        worst = Math.max(worst, angleBetween(P(-g.x, -g.y), P(-p.x, -p.y)));
      }
      expect(worst).toBeLessThanOrEqual(bound + 1e-9);
      expect(worst).toBeGreaterThan(bound - 0.5);
      expect(worst).toBeLessThan(90);
    }
  });
});

// ================================================================= momentum ==

describe("momentum", () => {
  const l: Landscape = { a: 60, b: 1 };
  const start = P(1, -0.55);

  it("with beta = 0 is bit-for-bit identical to plain descent", () => {
    const eta = 0.02;
    const gd = runToEnd(createRun(l, start, { kind: "gd", learningRate: eta }, { tolerance: 1e-6, maxSteps: 500 }));
    const mo = runToEnd(
      createRun(l, start, { kind: "momentum", learningRate: eta, beta: 0 }, { tolerance: 1e-6, maxSteps: 500 }),
    );
    expect(mo.t).toBe(gd.t);
    expect(Array.from(mo.path.slice(0, 2 * mo.length))).toEqual(
      Array.from(gd.path.slice(0, 2 * gd.length)),
    );
  });

  it("settles at an effective step of eta / (1 - beta) under a constant gradient", () => {
    // Freeze the gradient by using a landscape flat in y and reading the
    // velocity build-up directly: v_t = g * (1 - beta^t) / (1 - beta).
    const beta = 0.9;
    const g = 3;
    let v = 0;
    for (let t = 1; t <= 600; t++) v = beta * v + g;
    expect(v).toBeCloseTo(g / (1 - beta), 12);

    // And the engine builds the same velocity.
    const run = createRun({ a: 1e-12, b: 1e-12 }, P(g / 1e-12, 0), {
      kind: "momentum",
      learningRate: 1e-18,
      beta,
    }, { tolerance: 0, maxSteps: 600, escapeRadius: Infinity });
    runToEnd(run);
    expect(run.vx).toBeCloseTo(g / (1 - beta), 9);
  });

  it("is not always an improvement - too much of it is worse than none", () => {
    // The honest counterexample the lab shows in the momentum section.
    const ravine = LANDSCAPES.ravine;
    const at = (beta: number) =>
      measureRun(ravine.landscape, ravine.start, { kind: "momentum", learningRate: 0.03, beta }, {
        tolerance: 1e-3,
        maxSteps: 5000,
      }).steps;

    const none = at(0);
    const some = at(0.5);
    const lots = at(0.95);
    expect(none).not.toBeNull();
    expect(some).not.toBeNull();
    expect(lots).not.toBeNull();
    expect(some!).toBeLessThan(none!); // some momentum helps a lot
    expect(lots!).toBeGreaterThan(none!); // too much is worse than not using it
  });

  it("widens the stable range rather than narrowing it: the boundary is eta*a < 2(1 + beta)", () => {
    // Worth pinning down, because the obvious guess is wrong. The steady-state
    // effective step under a *constant* gradient really is eta/(1 - beta),
    // which suggests momentum should blow up sooner than plain descent. On a
    // quadratic it does the opposite. Written as
    //   theta_{t+1} = theta_t - eta*g_t + beta*(theta_t - theta_{t-1})
    // this is the heavy-ball recurrence, whose stability condition is
    //   0 < eta*a < 2(1 + beta).
    // So momentum permits a LARGER step than plain descent, and the price it
    // charges for the extra range is oscillation, not divergence.
    for (const beta of [0, 0.5, 0.9]) {
      const boundary = (2 * (1 + beta)) / l.a;
      const at = (frac: number) =>
        measureRun(l, start, { kind: "momentum", learningRate: frac * boundary, beta }, {
          tolerance: 1e-4,
          maxSteps: 20000,
        }).status;
      expect(at(0.9)).toBe("converged");
      expect(at(1.1)).toBe("diverged");
    }
    // Plain descent is exactly the beta = 0 case of the same formula.
    expect((2 * (1 + 0)) / l.a).toBeCloseTo(stabilityLimit(l), 15);
  });

  it("charges for that extra range in oscillation - more beta is not more speed", () => {
    // Held at one step size, raising beta first helps and then hurts. The
    // fastest setting is interior: neither none of it nor all of it.
    const ravine = LANDSCAPES.ravine;
    const steps = [0, 0.3, 0.5, 0.7, 0.9, 0.95].map(
      (beta) =>
        measureRun(ravine.landscape, ravine.start, { kind: "momentum", learningRate: 0.03, beta }, {
          tolerance: 1e-3,
          maxSteps: 5000,
        }).steps,
    );
    for (const s of steps) expect(s).not.toBeNull();
    const values = steps as number[];
    const bestIndex = values.indexOf(Math.min(...values));
    expect(bestIndex).toBeGreaterThan(0);
    expect(bestIndex).toBeLessThan(values.length - 1);
  });
});

// ===================================================================== adam ==

describe("adam", () => {
  it("takes a first step of exactly eta / (1 + epsilon/|g|) per coordinate", () => {
    // m1 = (1-b1)g, corrected -> g. s1 = (1-b2)g^2, corrected -> g^2.
    // update = -eta * g / (|g| + eps) = -eta * sign(g) / (1 + eps/|g|).
    const eta = 0.1;
    for (const l of ALL) {
      const start = P(1, -0.55);
      const g = gradient(l, start);
      const run = createRun(l, start, { kind: "adam", learningRate: eta }, {
        tolerance: 0,
        maxSteps: 1,
        escapeRadius: Infinity,
      });
      step(run);
      const expectX = (-eta * Math.sign(g.x)) / (1 + ADAM_EPSILON / Math.abs(g.x));
      const expectY = (-eta * Math.sign(g.y)) / (1 + ADAM_EPSILON / Math.abs(g.y));
      expect(run.x - start.x).toBeCloseTo(expectX, 12);
      expect(run.y - start.y).toBeCloseTo(expectY, 12);
    }
  });

  it("moves both coordinates the same distance across a million-fold curvature gap", () => {
    // The whole point of the section: the first step ignores how big the
    // gradient is, so the flat axis is not left behind by the steep one.
    const l: Landscape = { a: 1000, b: 0.001 };
    const start = P(1, -0.55);
    const g = gradient(l, start);
    // The two gradient components differ by more than six orders of magnitude.
    expect(Math.abs(g.x) / Math.abs(g.y)).toBeCloseTo((l.a * 1) / (l.b * 0.55), 6);
    expect(Math.abs(g.x) / Math.abs(g.y)).toBeGreaterThan(1e6);

    const run = createRun(l, start, { kind: "adam", learningRate: 0.1 }, {
      tolerance: 0,
      maxSteps: 1,
      escapeRadius: Infinity,
    });
    step(run);
    const dx = Math.abs(run.x - start.x);
    const dy = Math.abs(run.y - start.y);
    expect(dx).toBeCloseTo(0.1, 6);
    expect(dy).toBeCloseTo(0.1, 4);
    expect(dx / dy).toBeCloseTo(1, 3);
  });

  it("bias correction is what makes that true - without it the first step is (1 - beta1) too small", () => {
    const l: Landscape = { a: 6, b: 1 };
    const start = P(1, -0.55);
    const g = gradient(l, start);

    const run = createRun(l, start, { kind: "adam", learningRate: 0.1 }, { tolerance: 0, maxSteps: 1 });
    step(run);
    // Raw moments after one step.
    expect(run.mx).toBeCloseTo((1 - ADAM_BETA1) * g.x, 12);
    expect(run.sx).toBeCloseTo((1 - ADAM_BETA2) * g.x * g.x, 12);
    // Corrected moments are the gradient and its square exactly.
    expect(run.mx / (1 - ADAM_BETA1)).toBeCloseTo(g.x, 12);
    expect(run.sx / (1 - ADAM_BETA2)).toBeCloseTo(g.x * g.x, 12);
  });

  it("keeps the running mean of the SQUARED gradient, not the gradient", () => {
    // A second moment built from g rather than g^2 would be negative on a
    // negative coordinate, and sqrt() of it would be NaN. This test fails
    // loudly if that ever gets edited back in.
    const l: Landscape = { a: 6, b: 1 };
    const start = P(1, -0.55); // g.y is negative here
    const run = createRun(l, start, { kind: "adam", learningRate: 0.1 }, { tolerance: 0, maxSteps: 5 });
    for (let i = 0; i < 5; i++) step(run);
    expect(run.sy).toBeGreaterThan(0);
    expect(Number.isFinite(run.y)).toBe(true);
    expect(run.sy).toBeCloseTo(
      (() => {
        // Recompute the second moment independently from the trajectory.
        let s = 0;
        for (let t = 0; t < 5; t++) {
          const gy = gradient(l, pathAt(run, t)).y;
          s = ADAM_BETA2 * s + (1 - ADAM_BETA2) * gy * gy;
        }
        return s;
      })(),
      12,
    );
  });
});

// ========================================================== run bookkeeping ==

describe("run mechanics", () => {
  const l: Landscape = { a: 6, b: 1 };
  const start = P(1, -0.55);

  it("records the start and advances by exactly one step per call", () => {
    const run = createRun(l, start, { kind: "gd", learningRate: 0.1 }, { tolerance: 0, maxSteps: 10 });
    expect(run.t).toBe(0);
    expect(run.length).toBe(1);
    expect(pathAt(run, 0)).toEqual(start);
    for (let i = 1; i <= 10; i++) {
      const event = step(run);
      expect(event.index).toBe(i);
      expect(run.t).toBe(i);
      expect(run.length).toBe(i + 1);
      expect(pathAt(run, i)).toEqual(event.to);
    }
  });

  it("reports the gradient the step actually used, taken at the point it left", () => {
    const run = createRun(l, start, { kind: "gd", learningRate: 0.1 }, { tolerance: 0, maxSteps: 5 });
    for (let i = 0; i < 5; i++) {
      const before = P(run.x, run.y);
      const event = step(run);
      expect(event.from).toEqual(before);
      expect(event.gradient).toEqual(gradient(l, before));
      expect(event.update.x).toBeCloseTo(event.to.x - event.from.x, 15);
      expect(event.objective).toBeCloseTo(objective(l, event.to), 15);
    }
  });

  it("is exhausted, not converged, when it runs out of budget", () => {
    const run = runToEnd(createRun(l, start, { kind: "gd", learningRate: 1e-6 }, { tolerance: 1e-3, maxSteps: 20 }));
    expect(run.status).toBe("exhausted");
    expect(run.t).toBe(20);
    expect(currentObjective(run)).toBeGreaterThan(run.tolerance);
  });

  it("only says converged when the objective is actually inside the tolerance", () => {
    for (const eta of [0.01, 0.1, 0.28, 0.34]) {
      const run = runToEnd(
        createRun(l, start, { kind: "gd", learningRate: eta }, { tolerance: 1e-3, maxSteps: 5000 }),
      );
      expect(currentObjective(run) <= 1e-3).toBe(run.status === "converged");
    }
  });

  it("treats a start that is already at the minimum as finished, without stepping", () => {
    const run = createRun(l, P(0, 0), { kind: "gd", learningRate: 0.1 }, { tolerance: 1e-3 });
    expect(run.status).toBe("converged");
    expect(run.t).toBe(0);
  });

  it("stepping a finished run changes nothing", () => {
    const run = runToEnd(createRun(l, start, { kind: "gd", learningRate: 0.2 }, { tolerance: 1e-3, maxSteps: 200 }));
    const { t, x, y, status, length } = run;
    const event = step(run);
    expect(run.t).toBe(t);
    expect(run.x).toBe(x);
    expect(run.y).toBe(y);
    expect(run.status).toBe(status);
    expect(run.length).toBe(length);
    expect(event.update).toEqual(P(0, 0));
  });

  it("calls a run that has blown up to a non-finite value diverged", () => {
    const run = runToEnd(
      createRun({ a: 1e8, b: 1 }, start, { kind: "gd", learningRate: 1e-2 }, { tolerance: 1e-3, maxSteps: 400 }),
    );
    expect(run.status).toBe("diverged");
  });

  it("is deterministic - the same configuration produces the same trajectory twice", () => {
    const configs: OptimizerConfig[] = [
      { kind: "gd", learningRate: 0.13 },
      { kind: "momentum", learningRate: 0.04, beta: 0.8 },
      { kind: "adam", learningRate: 0.3 },
    ];
    for (const config of configs) {
      const one = runToEnd(createRun(l, start, config, { tolerance: 1e-6, maxSteps: 300 }));
      const two = runToEnd(createRun(l, start, config, { tolerance: 1e-6, maxSteps: 300 }));
      expect(one.t).toBe(two.t);
      expect(Array.from(one.path)).toEqual(Array.from(two.path));
    }
  });

  it("never writes to the point it was given", () => {
    const mutable = { x: 1, y: -0.55 };
    runToEnd(createRun(l, mutable, { kind: "gd", learningRate: 0.2 }, { tolerance: 1e-3, maxSteps: 100 }));
    expect(mutable).toEqual({ x: 1, y: -0.55 });
  });
});

// ================================================================ landscape ==

describe("landscape geometry", () => {
  it("contour semi-axes land exactly on the level they name", () => {
    for (const l of ALL) {
      for (const level of [0.01, 0.5, 3, 40]) {
        const { rx, ry } = contourSemiAxes(l, level);
        expect(objective(l, P(rx, 0))).toBeCloseTo(level, 10);
        expect(objective(l, P(0, ry))).toBeCloseTo(level, 10);
        // And every point on the ellipse, not just the axes.
        for (const theta of [0.3, 1.1, 2.6, 4.9]) {
          const p = P(rx * Math.cos(theta), ry * Math.sin(theta));
          expect(objective(l, p)).toBeCloseTo(level, 10);
        }
      }
    }
  });

  it("the drawn elongation is sqrt(k), not k", () => {
    for (const l of ALL) {
      const { rx, ry } = contourSemiAxes(l, 1);
      const drawn = Math.max(rx, ry) / Math.min(rx, ry);
      expect(drawn).toBeCloseTo(aspectRatio(l), 10);
      expect(drawn).toBeCloseTo(Math.sqrt(conditionNumber(l)), 10);
      if (conditionNumber(l) > 1) expect(drawn).toBeLessThan(conditionNumber(l));
    }
  });

  it("every preset is a valid, strictly convex landscape started off the diagonal", () => {
    for (const id of landscapeIds) {
      const { landscape, start } = LANDSCAPES[id];
      expect(landscape.a).toBeGreaterThan(0);
      expect(landscape.b).toBeGreaterThan(0);
      expect(start.x).not.toBe(0);
      expect(start.y).not.toBe(0);
      // Off the line where the gradient would already point at the minimum.
      if (landscape.a !== landscape.b) {
        const g = gradient(landscape, start);
        expect(angleBetween(P(-g.x, -g.y), P(-start.x, -start.y))).toBeGreaterThan(1);
      }
    }
  });

  it("the steep axis is not always the horizontal one", () => {
    const steepOnY = landscapeIds.filter((id) => LANDSCAPES[id].landscape.b > LANDSCAPES[id].landscape.a);
    expect(steepOnY.length).toBeGreaterThan(0);
  });

  it("landscapeFacts derives every number from the curvatures", () => {
    for (const id of landscapeIds) {
      const l = LANDSCAPES[id].landscape;
      const f = landscapeFacts(l);
      expect(f.conditionNumber).toBe(conditionNumber(l));
      expect(f.stabilityLimit).toBe(stabilityLimit(l));
      expect(f.monotoneLimit).toBeCloseTo(f.stabilityLimit / 2, 15);
      expect(f.optimalLearningRate).toBe(optimalLearningRate(l));
      expect(f.objectiveContraction).toBeCloseTo(f.parameterContraction ** 2, 15);
    }
  });
});

// ============================================================ GATE A ========

/**
 * The feasibility gate.
 *
 * Each challenge is a promise to the visitor about what can and cannot be done
 * inside a step budget. These tests re-derive that promise from the real
 * engine every run, so a change to a curvature, a budget or an optimizer fails
 * here instead of quietly turning a puzzle into an unsolvable one — or, worse,
 * into one whose intended lesson can be skipped.
 */
describe("Gate A - challenge feasibility, measured against the real engine", () => {
  /** Sweep plain descent across its whole usable range of step sizes. */
  function sweepGd(c: ChallengeSpec, samples = 400) {
    const limit = stabilityLimit(c.landscape);
    let best = Infinity;
    let bestEta = 0;
    let withinBudget = 0;
    for (let i = 1; i <= samples; i++) {
      const eta = (limit * i) / (samples + 1);
      const r = measureRun(c.landscape, c.start, { kind: "gd", learningRate: eta }, {
        tolerance: c.tolerance,
        maxSteps: 5000,
      });
      if (r.steps === null) continue;
      if (r.steps <= c.budget) withinBudget += 1;
      if (r.steps < best) {
        best = r.steps;
        bestEta = eta;
      }
    }
    return { best, bestEta, withinBudget, samples };
  }

  it("C1 is solvable, but only near the right step size", () => {
    const c = CHALLENGES.c1;
    const s = sweepGd(c);
    expect(s.best).toBeLessThanOrEqual(c.budget);
    // Comfortably solvable...
    expect(s.best).toBeLessThan(c.budget);
    // ...but not by accident: most step sizes miss the budget.
    const share = s.withinBudget / s.samples;
    expect(share).toBeGreaterThan(0.1);
    expect(share).toBeLessThan(0.45);
    // The fastest step size is near the analytic optimum.
    expect(s.bestEta).toBeCloseTo(optimalLearningRate(c.landscape), 1);
  });

  it("C2 is solvable, and the interesting failure above it is divergence", () => {
    const c = CHALLENGES.c2;
    const s = sweepGd(c);
    expect(s.best).toBeLessThanOrEqual(c.budget);
    const share = s.withinBudget / s.samples;
    expect(share).toBeGreaterThan(0.1);
    expect(share).toBeLessThan(0.5);
    // Every step size at or above the limit fails, and fails by exploding.
    for (const frac of [1.0, 1.05, 1.5, 3]) {
      const r = measureRun(c.landscape, c.start, { kind: "gd", learningRate: frac * stabilityLimit(c.landscape) }, {
        tolerance: c.tolerance,
        maxSteps: 2000,
      });
      expect(r.status).not.toBe("converged");
    }
  });

  it("C2's lesson holds: the step size that explodes here is fine on a gentler surface", () => {
    const c = CHALLENGES.c2;
    const eta = 1.5 * stabilityLimit(c.landscape);
    expect(
      measureRun(c.landscape, c.start, { kind: "gd", learningRate: eta }, { tolerance: c.tolerance, maxSteps: 2000 })
        .status,
    ).toBe("diverged");
    const gentle = LANDSCAPES.gentle;
    expect(
      measureRun(gentle.landscape, gentle.start, { kind: "gd", learningRate: eta }, {
        tolerance: c.tolerance,
        maxSteps: 2000,
      }).status,
    ).toBe("converged");
  });

  it("C3 cannot be solved by plain descent at ANY step size", () => {
    const c = CHALLENGES.c3;
    const s = sweepGd(c, 400);
    expect(s.withinBudget).toBe(0);
    // And not narrowly: the best plain run needs at least 1.5x the budget, so
    // the challenge cannot be won by a finer slider than the sweep used.
    expect(s.best).toBeGreaterThan(1.5 * c.budget);
  });

  it("C3 is solvable with momentum, over a region wide enough to find by exploring", () => {
    const c = CHALLENGES.c3;
    const limit = stabilityLimit(c.landscape);
    const betas = [0, 0.3, 0.5, 0.7, 0.8, 0.85, 0.9, 0.95];
    const shareAt = (beta: number) => {
      let win = 0;
      const n = 200;
      for (let i = 1; i <= n; i++) {
        const eta = (2 * limit * i) / n;
        const r = measureRun(c.landscape, c.start, { kind: "momentum", learningRate: eta, beta }, {
          tolerance: c.tolerance,
          maxSteps: 3000,
        });
        if (r.steps !== null && r.steps <= c.budget) win += 1;
      }
      return win / n;
    };
    const shares = betas.map(shareAt);

    // There is a real band of beta that works, not a single lucky value.
    const workable = betas.filter((_, i) => shares[i]! > 0.2);
    expect(workable.length).toBeGreaterThanOrEqual(3);
    // At the best beta a large fraction of step sizes succeed.
    expect(Math.max(...shares)).toBeGreaterThan(0.4);
    // Momentum is genuinely required: beta = 0 is plain descent and fails.
    expect(shares[0]).toBe(0);
  });

  it("C3 shows momentum is a band, not a dial: too much of it stops working", () => {
    const c = CHALLENGES.c3;
    const limit = stabilityLimit(c.landscape);
    const shareAt = (beta: number) => {
      let win = 0;
      const n = 200;
      for (let i = 1; i <= n; i++) {
        const r = measureRun(c.landscape, c.start, {
          kind: "momentum",
          learningRate: (2 * limit * i) / n,
          beta,
        }, { tolerance: c.tolerance, maxSteps: 3000 });
        if (r.steps !== null && r.steps <= c.budget) win += 1;
      }
      return win / n;
    };
    expect(shareAt(0.95)).toBeLessThan(shareAt(0.8));
    expect(shareAt(0.3)).toBeLessThan(shareAt(0.8));
  });

  it("C3 is solvable by Adam, but only at a well-chosen step size", () => {
    const c = CHALLENGES.c3;
    let best = Infinity;
    let bestEta = 0;
    let win = 0;
    const n = 300;
    for (let i = 1; i <= n; i++) {
      const eta = i / n;
      const r = measureRun(c.landscape, c.start, { kind: "adam", learningRate: eta }, {
        tolerance: c.tolerance,
        maxSteps: 3000,
      });
      if (r.steps === null) continue;
      if (r.steps <= c.budget) win += 1;
      if (r.steps < best) {
        best = r.steps;
        bestEta = eta;
      }
    }
    expect(best).toBeLessThanOrEqual(c.budget);
    expect(bestEta).toBeGreaterThan(0);
    // Adam is not a free win here: most step sizes still miss the budget.
    expect(win / n).toBeLessThan(0.25);
    // At a small, conventional step size it is far slower than tuned momentum.
    const conventional = measureRun(c.landscape, c.start, { kind: "adam", learningRate: 0.1 }, {
      tolerance: c.tolerance,
      maxSteps: 3000,
    });
    expect(conventional.steps).toBeGreaterThan(c.budget);
  });

  it("every challenge start is outside its own tolerance", () => {
    for (const id of ["c1", "c2", "c3"] as const) {
      const c = CHALLENGES[id];
      expect(objective(c.landscape, c.start)).toBeGreaterThan(c.tolerance);
      expect(c.budget).toBeGreaterThan(0);
      expect(c.allowed.length).toBeGreaterThan(0);
    }
  });
});
