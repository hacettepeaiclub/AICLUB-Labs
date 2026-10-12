import { describe, expect, it } from "vitest";
import reference from "./reference.json";
import {
  ALPHA_DEFAULT,
  BOUNDS,
  MU0_DEFAULT,
  MU1_DEFAULT,
  N_DEFAULT,
  SIGMA_DEFAULT,
  TEST_TYPES,
  computeBeta,
  computePower,
  directionWarning,
  evaluate,
  getCriticalValues,
  normalCdf,
  normalPdf,
  normalQuantile,
  standardError,
  stdNormalCdf,
  type TestType,
} from "./engine";

/**
 * The mathematics is a port, so the tests are a comparison rather than a
 * restatement. `reference.json` was produced by running the supplied Python
 * implementation's own `standard_error`, `get_critical_values`, `compute_beta`
 * and `direction_warning` under SciPy, and every case below is checked against
 * it. If this file ever passes while disagreeing with that fixture, the port
 * has stopped being a port.
 */

const num = (s: string): number => Number(s);

describe("the normal functions match SciPy", () => {
  it("norm.ppf, to sixteen digits", () => {
    for (const [p, expected] of Object.entries(reference.spot.ppf)) {
      const got = normalQuantile(Number(p));
      const want = num(expected);
      expect(Math.abs(got - want) / Math.max(1, Math.abs(want)), `ppf(${p})`).toBeLessThan(1e-14);
    }
  });

  it("norm.cdf, including the far tail where a cheap approximation collapses", () => {
    for (const [z, expected] of Object.entries(reference.spot.cdf)) {
      const got = stdNormalCdf(Number(z));
      const want = num(expected);
      // Relative, so 6.22e-16 at z = -8 has to be right to its own precision
      // rather than merely "small".
      const rel = want === 0 ? Math.abs(got) : Math.abs(got - want) / Math.abs(want);
      expect(rel, `cdf(${z}) got ${got} want ${want}`).toBeLessThan(1e-10);
    }
  });

  it("norm.pdf", () => {
    for (const [z, expected] of Object.entries(reference.spot.pdf)) {
      expect(normalPdf(Number(z), 0, 1)).toBeCloseTo(num(expected), 15);
    }
  });

  it("the quantile inverts the cdf", () => {
    for (const p of [0.001, 0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99, 0.999]) {
      expect(stdNormalCdf(normalQuantile(p))).toBeCloseTo(p, 12);
    }
  });

  it("is symmetric, and integrates to one across the middle", () => {
    for (const z of [0.3, 1, 2.5, 6]) {
      expect(stdNormalCdf(-z)).toBeCloseTo(1 - stdNormalCdf(z), 14);
    }
    expect(stdNormalCdf(0)).toBe(0.5);
    expect(normalQuantile(0.5)).toBe(0);
  });

  it("shifts and scales", () => {
    expect(normalCdf(5, 5, 2)).toBeCloseTo(0.5, 15);
    expect(normalCdf(7, 5, 2)).toBeCloseTo(stdNormalCdf(1), 15);
    expect(normalPdf(7, 5, 2)).toBeCloseTo(normalPdf(1, 0, 1) / 2, 15);
  });
});

describe("the port reproduces the reference implementation", () => {
  it("matches every case: SE, critical values, beta, power and the warning", () => {
    expect(reference.cases.length).toBeGreaterThanOrEqual(20);

    for (const c of reference.cases) {
      const testType = c.testType as TestType;
      const label = `${testType} mu0=${c.mu0} mu1=${c.mu1} sigma=${c.sigma} alpha=${c.alpha} n=${c.n}`;

      const se = standardError(c.sigma, c.n);
      expect(se, `SE ${label}`).toBeCloseTo(num(c.se), 15);

      const criticals = getCriticalValues(c.alpha, c.mu0, c.sigma, c.n, testType);

      // A key is present exactly where the source's dictionary has one.
      expect({ label, hasLeft: criticals.left !== undefined }).toEqual({
        label,
        hasLeft: c.left !== null,
      });
      expect({ label, hasRight: criticals.right !== undefined }).toEqual({
        label,
        hasRight: c.right !== null,
      });

      if (c.left !== null) expect(criticals.left!, `c_left ${label}`).toBeCloseTo(num(c.left), 13);
      if (c.right !== null)
        expect(criticals.right!, `c_right ${label}`).toBeCloseTo(num(c.right), 13);

      const beta = computeBeta(c.mu1, c.sigma, c.n, criticals, testType);
      const wantBeta = num(c.beta);
      const rel = wantBeta === 0 ? Math.abs(beta) : Math.abs(beta - wantBeta) / Math.abs(wantBeta);
      expect(rel, `beta ${label}: got ${beta} want ${wantBeta}`).toBeLessThan(1e-9);

      expect(computePower(beta), `power ${label}`).toBeCloseTo(num(c.power), 12);
      expect(directionWarning(testType, c.mu0, c.mu1), `warning ${label}`).toBe(c.warning);
    }
  });

  it("carries the reference implementation's own defaults", () => {
    expect(MU0_DEFAULT).toBe(0);
    expect(MU1_DEFAULT).toBe(2);
    expect(SIGMA_DEFAULT).toBe(1);
    expect(ALPHA_DEFAULT).toBe(0.1);
    expect(N_DEFAULT).toBe(10);
  });

  it("keeps the reference implementation's slider bounds", () => {
    expect(BOUNDS.alpha).toEqual({ min: 0.01, max: 0.2, step: 0.01 });
    expect(BOUNDS.mu0).toEqual({ min: -3, max: 3, step: 0.1 });
    expect(BOUNDS.mu1).toEqual({ min: -5, max: 5, step: 0.1 });
    expect(BOUNDS.sigma).toEqual({ min: 0.5, max: 3, step: 0.1 });
    expect(BOUNDS.n).toEqual({ min: 2, max: 100, step: 1 });
  });
});

describe("the equations, checked against their own definitions", () => {
  it("SE is sigma over root n", () => {
    expect(standardError(1, 10)).toBeCloseTo(1 / Math.sqrt(10), 15);
    expect(standardError(3, 100)).toBeCloseTo(0.3, 15);
    // Four times the data halves the standard error, and nothing else does.
    expect(standardError(2, 40) / standardError(2, 10)).toBeCloseTo(0.5, 12);
  });

  it("a one-sided critical value sits exactly alpha of the mass beyond it", () => {
    for (const alpha of [0.01, 0.05, 0.1, 0.2]) {
      for (const testType of ["right", "left"] as const) {
        const c = getCriticalValues(alpha, 0, 1, 10, testType);
        const se = standardError(1, 10);
        const tail =
          testType === "right" ? 1 - normalCdf(c.right!, 0, se) : normalCdf(c.left!, 0, se);
        expect(tail, `${testType} alpha=${alpha}`).toBeCloseTo(alpha, 12);
      }
    }
  });

  it("a two-sided test splits alpha evenly and is symmetric about mu0", () => {
    for (const alpha of [0.01, 0.05, 0.1, 0.2]) {
      const mu0 = 1.5;
      const c = getCriticalValues(alpha, mu0, 1, 10, "two");
      const se = standardError(1, 10);
      expect(1 - normalCdf(c.right!, mu0, se)).toBeCloseTo(alpha / 2, 12);
      expect(normalCdf(c.left!, mu0, se)).toBeCloseTo(alpha / 2, 12);
      expect((c.left! + c.right!) / 2).toBeCloseTo(mu0, 12);
    }
  });

  it("beta is the H1 mass in the non-rejection region, per direction", () => {
    const [sigma, n] = [1, 10];
    const se = standardError(sigma, n);
    for (const mu1 of [-2, -0.5, 0, 0.5, 2]) {
      for (const testType of TEST_TYPES) {
        const c = getCriticalValues(0.05, 0, sigma, n, testType);
        const beta = computeBeta(mu1, sigma, n, c, testType);
        const expected =
          testType === "right"
            ? normalCdf(c.right!, mu1, se)
            : testType === "left"
              ? 1 - normalCdf(c.left!, mu1, se)
              : normalCdf(c.right!, mu1, se) - normalCdf(c.left!, mu1, se);
        expect(beta).toBeCloseTo(expected, 15);
        expect(beta).toBeGreaterThanOrEqual(0);
        expect(beta).toBeLessThanOrEqual(1);
      }
    }
  });

  it("power is one minus beta, always", () => {
    for (const mu1 of [-3, 0, 1, 4]) {
      for (const testType of TEST_TYPES) {
        const r = evaluate({ mu0: 0, mu1, sigma: 1, alpha: 0.05, n: 12, testType });
        expect(r.power).toBeCloseTo(1 - r.beta, 15);
      }
    }
  });

  it("under H1 = H0 a one-sided test has power equal to alpha", () => {
    // Not a coincidence worth hiding: with no effect to find, the only
    // rejections are false alarms.
    for (const alpha of [0.01, 0.05, 0.1, 0.2]) {
      for (const testType of ["right", "left"] as const) {
        const r = evaluate({ mu0: 0, mu1: 0, sigma: 1, alpha, n: 10, testType });
        expect(r.power, `${testType} alpha=${alpha}`).toBeCloseTo(alpha, 12);
      }
    }
  });
});

describe("how the levers move the result", () => {
  const at = (patch: Partial<Parameters<typeof evaluate>[0]>) =>
    evaluate({
      mu0: MU0_DEFAULT,
      mu1: 0.5,
      sigma: SIGMA_DEFAULT,
      alpha: 0.05,
      n: N_DEFAULT,
      testType: "right",
      ...patch,
    });

  it("more data raises power, monotonically", () => {
    let previous = -Infinity;
    for (const n of [2, 5, 10, 20, 40, 80, 100]) {
      const r = at({ n });
      expect(r.power, `n=${n}`).toBeGreaterThan(previous);
      previous = r.power;
    }
  });

  it("a larger alpha raises power and moves the critical value towards mu0", () => {
    let power = -Infinity;
    let critical = Infinity;
    for (const alpha of [0.01, 0.05, 0.1, 0.2]) {
      const r = at({ alpha });
      expect(r.power).toBeGreaterThan(power);
      expect(r.criticals.right!).toBeLessThan(critical);
      power = r.power;
      critical = r.criticals.right!;
    }
  });

  it("a larger sigma lowers power", () => {
    let previous = Infinity;
    for (const sigma of [0.5, 1, 2, 3]) {
      const r = at({ sigma });
      expect(r.power, `sigma=${sigma}`).toBeLessThan(previous);
      previous = r.power;
    }
  });

  it("separation raises power on the side the test is looking", () => {
    let previous = -Infinity;
    for (const mu1 of [0, 0.5, 1, 2, 3]) {
      const r = at({ mu1 });
      expect(r.power, `mu1=${mu1}`).toBeGreaterThan(previous);
      previous = r.power;
    }
  });

  it("only n and sigma move the standard error", () => {
    const base = at({});
    expect(at({ alpha: 0.2 }).se).toBe(base.se);
    expect(at({ mu0: 2 }).se).toBe(base.se);
    expect(at({ mu1: -4 }).se).toBe(base.se);
    expect(at({ testType: "two" }).se).toBe(base.se);
    expect(at({ n: 40 }).se).toBeLessThan(base.se);
    expect(at({ sigma: 2 }).se).toBeGreaterThan(base.se);
  });

  it("a two-sided test costs power against a one-sided test looking the right way", () => {
    // Same alpha, same everything: splitting it across two tails pushes the
    // relevant boundary further out.
    const one = at({ testType: "right", mu1: 1 });
    const two = at({ testType: "two", mu1: 1 });
    expect(two.power).toBeLessThan(one.power);
    expect(two.criticals.right!).toBeGreaterThan(one.criticals.right!);
  });
});

describe("the direction warning", () => {
  it("fires exactly where the reference implementation fires it", () => {
    expect(directionWarning("left", 0, 1)).toBe("left");
    expect(directionWarning("left", 0, 0)).toBe("left");
    expect(directionWarning("left", 0, -1)).toBeNull();
    expect(directionWarning("right", 0, -1)).toBe("right");
    expect(directionWarning("right", 0, 0)).toBe("right");
    expect(directionWarning("right", 0, 1)).toBeNull();
    // A two-sided test never warns: it is looking both ways.
    for (const mu1 of [-3, 0, 3]) expect(directionWarning("two", 0, mu1)).toBeNull();
  });

  it("marks the states where power really has collapsed", () => {
    // The warning is not decoration — it names a configuration in which the
    // test cannot find what it was pointed at.
    const wrong = evaluate({ mu0: 0, mu1: 2, sigma: 1, alpha: 0.1, n: 10, testType: "left" });
    expect(wrong.warning).toBe("left");
    expect(wrong.power).toBeLessThan(0.001);
    expect(wrong.beta).toBeGreaterThan(0.999);
  });
});
