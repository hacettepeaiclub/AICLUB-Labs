import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { labs, orderedLabs, publishedLabs } from "../registry";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";
import { hypothesisTestingMeta } from "./meta";
import { BOUNDS, TEST_TYPES, evaluate, normalPdf, type Params } from "./engine";
import {
  CHALLENGES,
  PLOT,
  SAMPLES,
  areaPath,
  challengeById,
  criticalList,
  curvePath,
  domainOf,
  judge,
  regionsOf,
  samples,
  scaleOf,
  separation,
} from "./view";

const DIR = "src/labs/hypothesis-testing/";
const COMPONENTS = [
  "index.tsx",
  "components/DistributionPlot.tsx",
  "components/SeparationStage.tsx",
  "components/AlphaStage.tsx",
  "components/BetaStage.tsx",
  "components/SampleSizeStage.tsx",
  "components/SecondaryControls.tsx",
  "components/HypothesisChallenge.tsx",
];
const read = (path: string) => readFileSync(DIR + path, "utf8");
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

const base: Params = { mu0: 0, mu1: 2, sigma: 1, alpha: 0.1, n: 10, testType: "right" };

// ============================================================== registry ===

describe("registry", () => {
  it("registers the lab exactly once", () => {
    expect(labs.filter((lab) => lab.meta.slug === hypothesisTestingMeta.slug)).toHaveLength(1);
  });

  it("shows up on the home page, at the end of the collection", () => {
    const order = orderedLabs().map((lab) => lab.meta.slug);
    expect(order).toContain("hypothesis-testing");
    expect(order[order.length - 1]).toBe("hypothesis-testing");
    expect(publishedLabs().map((lab) => lab.meta.slug)).toContain("hypothesis-testing");
  });

  it("declares a theory lab with a duration", () => {
    expect(hypothesisTestingMeta.category).toBe("theory");
    expect(hypothesisTestingMeta.minutes).toBeGreaterThan(0);
    expect(hypothesisTestingMeta.description.length).toBeGreaterThan(20);
  });

  it("has a drawing of its own on the home page", () => {
    const source = readFileSync("src/components/home/LabSignature.tsx", "utf8");
    expect(source).toMatch(/case "hypothesis-testing":/);
  });
});

// ================================================================== copy ===

describe("copy", () => {
  it("exists in both languages", () => {
    for (const dict of [en, tr]) {
      const copy = dict.labs["hypothesis-testing"];
      expect(copy.title.length).toBeGreaterThan(3);
      expect(copy.description.length).toBeGreaterThan(20);
      expect(copy.recap.lessons).toHaveLength(3);
      expect(copy.recap.footer.length).toBeGreaterThan(60);
      expect(copy.scope.length).toBeGreaterThan(60);
    }
  });

  it("names all three test directions in both languages", () => {
    for (const dict of [en, tr]) {
      for (const type of TEST_TYPES) {
        expect(dict.labs["hypothesis-testing"].testType[type].length).toBeGreaterThan(2);
      }
    }
  });

  it("says what the model is and what it is not", () => {
    // The scope note is the whole academic-honesty position of the lab. It has
    // to name the assumption that makes the boundary a z, and it has to say
    // that nothing is sampled.
    for (const [name, copy] of [
      ["en", en.labs["hypothesis-testing"]],
      ["tr", tr.labs["hypothesis-testing"]],
    ] as const) {
      const scope = copy.scope.toLowerCase();
      expect({ name, mentionsKnownSigma: /known|bilinen/.test(scope) }).toMatchObject({
        name,
        mentionsKnownSigma: true,
      });
      expect({ name, saysNothingIsSampled: /sampled|örneklem/.test(scope) }).toMatchObject({
        name,
        saysNothingIsSampled: true,
      });
    }
  });

  it("does not claim more than the engine computes", () => {
    // No p-values: the engine has none. No "proves"/"significant" language,
    // which this model does not license.
    for (const dict of [en, tr]) {
      const all = JSON.stringify(dict.labs["hypothesis-testing"]).toLowerCase();
      for (const banned of ["p-value", "p value", "p-değer", "proves", "kanıtlar ki"]) {
        // Whole words: "improves" is not a claim that anything is proved.
        // Built from a character code: a backslash-b written as an escape
        // does not always survive whatever wrote this file, and a regex
        // with a control character in it matches nothing and passes free.
        const B = String.fromCharCode(92) + "b";
        const pattern = new RegExp(B + banned + B, "i");
        expect({ banned, found: pattern.test(all) }).toEqual({ banned, found: false });
      }
    }
  });
});

// ================================== nothing drawn is written down ==========

describe("the components draw the engine, not a memory of it", () => {
  it("contain no measured output as a literal", () => {
    // Every value the lab reports, at the precision it reports it. If one of
    // these turns up in a component, the picture has stopped being computed.
    const measured = new Set<string>();
    for (const testType of TEST_TYPES) {
      for (const n of [2, 10, 30, 100]) {
        for (const alpha of [0.01, 0.05, 0.1, 0.2]) {
          const r = evaluate({ ...base, testType, n, alpha });
          measured.add(r.beta.toFixed(3));
          measured.add(r.power.toFixed(3));
          measured.add(r.se.toFixed(2));
          for (const c of criticalList(r.criticals)) measured.add(c.toFixed(2));
        }
      }
    }
    for (const file of COMPONENTS) {
      const code = stripComments(read(file));
      for (const value of measured) {
        // Only unambiguous shapes: a bare `0.10` is a slider step as often as
        // it is a result.
        for (const shape of [`"${value}"`, `= ${value}`, `>${value}<`]) {
          expect({ file, shape, found: code.includes(shape) }).toEqual({
            file,
            shape,
            found: false,
          });
        }
      }
    }
  });

  it("keeps the mathematics in the engine and out of the components", () => {
    for (const file of COMPONENTS) {
      const code = stripComments(read(file));
      for (const banned of ["Math.exp", "Math.sqrt", "normalCdf", "normalQuantile", "erf"]) {
        // Whole words, or "erf" fires on `preserveAspectRatio`.
        // Built from a character code: a backslash-b written as an escape
        // does not always survive whatever wrote this file, and a regex
        // with a control character in it matches nothing and passes free.
        const B = String.fromCharCode(92) + "b";
        const escaped = banned.replace(".", String.fromCharCode(92) + ".");
        const pattern = new RegExp(B + escaped + B);
        expect({ file, banned, found: pattern.test(code) }).toEqual({
          file,
          banned,
          found: false,
        });
      }
    }
    // The only place a critical value or a beta is produced.
    expect(stripComments(read("index.tsx"))).toMatch(/evaluate\(/);
  });

  it("derives its geometry through the view helpers", () => {
    const plot = stripComments(read("components/DistributionPlot.tsx"));
    for (const helper of ["scaleOf", "curvePath", "areaPath", "regionsOf", "criticalList"]) {
      expect({ helper, used: plot.includes(helper) }).toEqual({ helper, used: true });
    }
  });

  it("keeps its prose in the dictionary", () => {
    for (const file of COMPONENTS) {
      expect(read(file), `${file} has bare JSX prose`).not.toMatch(/>\s*[A-Z][a-z]+ [a-z]+[^<{]*</);
    }
  });

  it("runs no animation loop anywhere", () => {
    for (const file of COMPONENTS) {
      expect(stripComments(read(file))).not.toMatch(/requestAnimationFrame|setInterval/);
    }
  });
});

// ============================================================ the drawing ===

describe("the plot geometry", () => {
  it("frames x exactly where the reference implementation frames it", () => {
    for (const params of [base, { ...base, mu1: -4, sigma: 2, n: 3 }]) {
      const r = evaluate(params);
      const d = domainOf(r);
      expect(d.lo).toBeCloseTo(Math.min(r.params.mu0, r.params.mu1) - 4.5 * r.se, 12);
      expect(d.hi).toBeCloseTo(Math.max(r.params.mu0, r.params.mu1) + 4.5 * r.se, 12);
    }
  });

  it("puts both means inside the window, always", () => {
    for (const testType of TEST_TYPES) {
      for (const mu1 of [-5, -1, 0, 2, 5]) {
        for (const n of [2, 100]) {
          const r = evaluate({ ...base, testType, mu1, n });
          const d = domainOf(r);
          expect(r.params.mu0).toBeGreaterThan(d.lo);
          expect(r.params.mu0).toBeLessThan(d.hi);
          expect(r.params.mu1).toBeGreaterThan(d.lo);
          expect(r.params.mu1).toBeLessThan(d.hi);
        }
      }
    }
  });

  it("maps the domain onto the box, monotonically and to the edges", () => {
    const scale = scaleOf(evaluate(base));
    expect(scale.x(scale.domain.lo)).toBeCloseTo(0, 9);
    expect(scale.x(scale.domain.hi)).toBeCloseTo(PLOT.width, 9);
    expect(scale.y(0)).toBeCloseTo(scale.baseline, 9);
    expect(scale.y(scale.peak)).toBeLessThan(scale.baseline);
    const xs = samples(scale.domain);
    for (let i = 1; i < xs.length; i++) expect(xs[i]!).toBeGreaterThan(xs[i - 1]!);
    expect(xs).toHaveLength(SAMPLES);
  });

  it("draws a curve whose peak sits at the mean", () => {
    const r = evaluate(base);
    const scale = scaleOf(r);
    const xs = samples(scale.domain);
    let bestX = 0;
    let best = -Infinity;
    for (const x of xs) {
      const d = normalPdf(x, r.params.mu0, r.se);
      if (d > best) {
        best = d;
        bestX = x;
      }
    }
    // Within one sample step of mu0.
    const step = (scale.domain.hi - scale.domain.lo) / (SAMPLES - 1);
    expect(Math.abs(bestX - r.params.mu0)).toBeLessThanOrEqual(step);
    expect(curvePath(scale, r.params.mu0, r.se)).toMatch(/^M[\d.]+ [\d.]+ L/);
  });

  it("shades the regions the reference implementation shades", () => {
    // right: alpha beyond c, beta below it. left: mirrored. two: both tails
    // for alpha, the middle for beta.
    const right = regionsOf({ right: 1 }, "right");
    expect(right.filter((r) => r.kind === "alpha")).toHaveLength(1);
    expect(right.find((r) => r.kind === "alpha")!.from).toBe(1);
    expect(right.find((r) => r.kind === "beta")!.to).toBe(1);

    const left = regionsOf({ left: -1 }, "left");
    expect(left.find((r) => r.kind === "alpha")!.to).toBe(-1);
    expect(left.find((r) => r.kind === "beta")!.from).toBe(-1);

    const two = regionsOf({ left: -1, right: 1 }, "two");
    expect(two.filter((r) => r.kind === "alpha")).toHaveLength(2);
    const beta = two.find((r) => r.kind === "beta")!;
    expect([beta.from, beta.to]).toEqual([-1, 1]);
  });

  it("draws nothing for a region that is entirely outside the window", () => {
    const scale = scaleOf(evaluate(base));
    expect(areaPath(scale, 0, 1, 1e6, 2e6)).toBe("");
    expect(areaPath(scale, 0, 1, 5, 5)).toBe("");
    expect(areaPath(scale, 0, 1, scale.domain.lo, scale.domain.hi)).toMatch(/Z$/);
  });

  it("lists one critical value for a one-sided test and two for a two-sided one", () => {
    expect(criticalList(evaluate({ ...base, testType: "right" }).criticals)).toHaveLength(1);
    expect(criticalList(evaluate({ ...base, testType: "left" }).criticals)).toHaveLength(1);
    const two = criticalList(evaluate({ ...base, testType: "two" }).criticals);
    expect(two).toHaveLength(2);
    expect(two[0]!).toBeLessThan(two[1]!);
  });

  it("measures separation in standard errors", () => {
    const r = evaluate({ ...base, mu0: 0, mu1: 1, sigma: 1, n: 100 });
    // SE is 0.1, so a gap of 1 is ten standard errors.
    expect(separation(r)).toBeCloseTo(10, 9);
    expect(separation(evaluate({ ...base, mu1: 0 }))).toBe(0);
  });
});

// ============================================================= challenge ===

describe("the challenge", () => {
  it("starts unsolved and is solvable with the levers it offers", () => {
    for (const spec of CHALLENGES) {
      const opening = evaluate(spec.start);
      expect(judge(spec, opening).solved, `${spec.id} opens solved`).toBe(false);

      // Sweep the levers it actually hands over.
      let solvable = false;
      for (const n of [10, 25, 50, 100]) {
        for (const alpha of spec.levers.includes("alpha")
          ? [0.01, 0.05, 0.1]
          : [spec.start.alpha]) {
          for (const sigma of spec.levers.includes("sigma") ? [0.5, 1, 2, 3] : [spec.start.sigma]) {
            for (const testType of spec.levers.includes("testType")
              ? TEST_TYPES
              : [spec.start.testType]) {
              const r = evaluate({ ...spec.start, n, alpha, sigma, testType });
              if (judge(spec, r).solved) solvable = true;
            }
          }
        }
      }
      expect(solvable, `${spec.id} cannot be solved`).toBe(true);
    }
  });

  it("judges the result, never the control positions", () => {
    const spec = challengeById("reach-power");
    // Power high enough but alpha over the limit is not a pass.
    const overAlpha = evaluate({ ...spec.start, n: 100, alpha: 0.2 });
    expect(overAlpha.power).toBeGreaterThan(spec.minPower);
    expect(judge(spec, overAlpha).solved).toBe(false);
    expect(judge(spec, overAlpha).alphaMet).toBe(false);
  });

  it("keeps every lever inside the reference implementation's bounds", () => {
    for (const spec of CHALLENGES) {
      expect(spec.start.alpha).toBeGreaterThanOrEqual(BOUNDS.alpha.min);
      expect(spec.start.alpha).toBeLessThanOrEqual(BOUNDS.alpha.max);
      expect(spec.start.n).toBeGreaterThanOrEqual(BOUNDS.n.min);
      expect(spec.start.n).toBeLessThanOrEqual(BOUNDS.n.max);
      expect(spec.start.sigma).toBeGreaterThanOrEqual(BOUNDS.sigma.min);
      expect(spec.start.sigma).toBeLessThanOrEqual(BOUNDS.sigma.max);
    }
  });

  it("has copy for every puzzle in both languages", () => {
    for (const dict of [en, tr]) {
      for (const spec of CHALLENGES) {
        const puzzle = dict.labs["hypothesis-testing"].challenge.puzzles[spec.id];
        expect(puzzle.title.length).toBeGreaterThan(2);
        expect(puzzle.lesson.length).toBeGreaterThan(40);
      }
    }
  });
});
