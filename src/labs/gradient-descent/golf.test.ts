import { describe, expect, it } from "vitest";
import { step, createRun } from "./engine";
import {
  BOUND,
  CLUBS,
  CUP,
  FIXED_LIMIT,
  FREE_LIMIT,
  HOLES,
  OUT_OF_BOUNDS_COST,
  clubById,
  lieAfter,
  planRound,
  play,
  runFixed,
  scoreName,
  slopeAt,
  solveFixed,
  solveFree,
  strike,
  strokesOf,
  teeFor,
  type HoleSpec,
} from "./golf";

/** A deterministic generator, so a failing tee can be reproduced. */
function lcg(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const hole = (id: HoleSpec["id"]): HoleSpec => HOLES.find((h) => h.id === id)!;

describe("a stroke is one gradient-descent step", () => {
  it("lands exactly where the lab's own engine steps to", () => {
    const rng = lcg(1);
    for (const spec of HOLES) {
      for (const club of CLUBS) {
        const tee = teeFor(spec, rng);
        const run = createRun(spec.landscape, tee, { kind: "gd", learningRate: club.eta });
        const event = step(run);
        const to = strike(spec.landscape, tee, club.eta);
        expect(to.x).toBeCloseTo(event.to.x, 12);
        expect(to.y).toBeCloseTo(event.to.y, 12);
      }
    }
  });

  it("sends a club further where the slope is steeper", () => {
    const l = hole("oval").landscape;
    const club = clubById("iron9");
    const steep = play(l, { x: 1, y: 0.5 }, club);
    const flat = play(l, { x: 0.2, y: 0.1 }, club);
    const length = (s: typeof steep) => Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y);
    expect(length(steep)).toBeGreaterThan(length(flat));
    // And by exactly η·|∇f|.
    expect(length(steep)).toBeCloseTo(club.eta * slopeAt(l, steep.from), 12);
  });

  it("lands on a direction's floor at η = 1/c and on its mirror at η = 2/c", () => {
    const l = { a: 1, b: 20 };
    const p = { x: 0.8, y: 0.6 };
    expect(strike(l, p, 1 / 20).y).toBeCloseTo(0, 12);
    expect(strike(l, p, 2 / 20).y).toBeCloseTo(-0.6, 12);
    expect(Math.abs(strike(l, p, 3 / 20).y)).toBeGreaterThan(0.6);
  });
});

describe("the course", () => {
  it("puts every tee on the course, off both axes, and out of the cup", () => {
    const rng = lcg(2);
    for (const spec of HOLES) {
      for (let i = 0; i < 200; i++) {
        const tee = teeFor(spec, rng);
        expect(Math.abs(tee.x)).toBeLessThan(BOUND);
        expect(Math.abs(tee.y)).toBeLessThan(BOUND);
        expect(Math.hypot(tee.x, tee.y)).toBeGreaterThan(CUP * 4);
        // 25° from an axis at reach·BOUND keeps both coordinates clear of it.
        const r = spec.reach * BOUND;
        expect(Math.abs(tee.x)).toBeGreaterThan(r * Math.sin((25 * Math.PI) / 180) - 1e-9);
        expect(Math.abs(tee.y)).toBeGreaterThan(r * Math.sin((25 * Math.PI) / 180) - 1e-9);
      }
    }
  });

  it("charges for a shot off the course and leaves the ball where it was", () => {
    const l = hole("ravine").landscape;
    const tee = { x: 0.6, y: 0.7 };
    const out = play(l, tee, clubById("driver"));
    expect(out.result).toBe("out");
    expect(strokesOf([out])).toBe(OUT_OF_BOUNDS_COST);
    expect(lieAfter(tee, [out])).toEqual(tee);
  });
});

describe("par", () => {
  it("is reachable on every free hole: replaying the solver's clubs holes the ball", () => {
    const rng = lcg(3);
    for (const spec of HOLES.filter((h) => h.mode === "free")) {
      for (let i = 0; i < 60; i++) {
        const tee = teeFor(spec, rng);
        const solution = solveFree(spec.landscape, tee);
        expect(solution, spec.id).not.toBeNull();
        let p = tee;
        let last = null;
        for (const id of solution!.clubs) {
          last = play(spec.landscape, p, clubById(id));
          expect(last.result, spec.id).not.toBe("out");
          p = last.to;
        }
        expect(last?.result, spec.id).toBe("holed");
        expect(solution!.strokes).toBeLessThan(FREE_LIMIT);
      }
    }
  });

  it("is the fewest strokes: no shorter sequence of clubs exists", () => {
    // Exhaustive for the short holes, where every sequence can be tried.
    const rng = lcg(4);
    for (const id of ["bowl", "ravine", "oval"] as const) {
      const spec = hole(id);
      const tee = teeFor(spec, rng);
      const par = solveFree(spec.landscape, tee)!.strokes;
      const holedWithin = (p: typeof tee, left: number): boolean => {
        if (left === 0) return false;
        return CLUBS.some((club) => {
          const shot = play(spec.landscape, p, club);
          if (shot.result === "holed") return true;
          return shot.result === "rolling" && holedWithin(shot.to, left - 1);
        });
      };
      expect(holedWithin(tee, par - 1), id).toBe(false);
      expect(holedWithin(tee, par), id).toBe(true);
    }
  });

  it("gives each hole the character its comment claims", () => {
    const rng = lcg(5);
    const pars = (id: HoleSpec["id"]) =>
      Array.from({ length: 30 }, () => {
        const spec = hole(id);
        const tee = teeFor(spec, rng);
        return spec.mode === "free"
          ? solveFree(spec.landscape, tee)!.strokes
          : solveFixed(spec.landscape, tee).strokes;
      });
    // The bowl is a hole in one; the ravine has a club that lands on its floor.
    expect(new Set(pars("bowl"))).toEqual(new Set([1]));
    expect(new Set(pars("ravine"))).toEqual(new Set([2]));
    // One club for every stroke is slower than choosing, on the same landscape...
    const free = pars("oval");
    const fixed = pars("oneClub");
    expect(Math.max(...free)).toBeLessThan(Math.min(...fixed));
    // ...and slower still where the landscape is narrower.
    const narrow = pars("oneClubNarrow");
    expect(Math.min(...narrow)).toBeGreaterThan(Math.max(...fixed));
    expect(Math.max(...narrow)).toBeLessThan(FIXED_LIMIT);
  });

  it("finds the best single club, and the biggest clubs never finish a narrow hole", () => {
    const spec = hole("oneClubNarrow");
    const tee = teeFor(spec, lcg(6));
    const best = solveFixed(spec.landscape, tee);
    for (const club of CLUBS) {
      expect(runFixed(spec.landscape, tee, club).strokes).toBeGreaterThanOrEqual(best.strokes);
    }
    // At or above 2/a the steep direction never shrinks.
    for (const club of CLUBS.filter((c) => c.eta >= 2 / spec.landscape.a)) {
      expect(runFixed(spec.landscape, tee, club).holed, club.id).toBe(false);
    }
  });

  it("plans a whole round quickly", () => {
    const t0 = performance.now();
    const round = planRound(lcg(7));
    expect(round).toHaveLength(HOLES.length);
    expect(round.every((h) => h.par >= 1)).toBe(true);
    expect(performance.now() - t0).toBeLessThan(200);
  });
});

describe("score names", () => {
  it("follows golf", () => {
    expect(scoreName(1, 3)).toBe("holeInOne");
    expect(scoreName(2, 4)).toBe("eagle");
    expect(scoreName(3, 4)).toBe("birdie");
    expect(scoreName(4, 4)).toBe("par");
    expect(scoreName(5, 4)).toBe("bogey");
    expect(scoreName(6, 4)).toBe("doubleBogey");
    expect(scoreName(9, 4)).toBe("worse");
  });
});
