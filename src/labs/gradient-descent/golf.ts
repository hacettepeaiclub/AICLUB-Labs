/**
 * Gradient golf: the lab's quadratic landscapes as a course.
 *
 * Pure TypeScript, no React, no DOM. Randomness (where each tee is placed)
 * comes in through an `rng` argument.
 *
 * ## The rule that makes it gradient descent
 *
 * The ball sits on f(x, y) = ½(a·x² + b·y²) and the cup is the minimum. A
 * stroke is one plain gradient-descent step: the ball moves to p − η·∇f(p).
 * The visitor never aims. The slope picks the direction, and the only thing
 * they choose is the club, which is η. So the distance a club sends the ball
 * is η·|∇f|: the same club goes far on a steep wall and barely moves near the
 * cup. That is the whole game, and it is the lab's section 3 played by hand.
 *
 * Because each coordinate is just multiplied by (1 − η·c) for its own
 * curvature c, a stroke with η = 1/c lands exactly on the floor of that
 * direction, η = 2/c bounces to the mirror point, and anything more throws
 * the ball further out each time, off the course. The free holes reward
 * finding those clubs. The last two holes take the choice away: one club for
 * every stroke, which is what an optimizer with a fixed learning rate is.
 *
 * ## Par is computed, not chosen
 *
 * Every tee is random, so par is found per round by `solveFree` and
 * `solveFixed`, which search the same strokes the visitor can play.
 * `golf.test.ts` checks that the par a hole quotes is reachable.
 */

import { gradient, type Landscape, type Point } from "./engine";

// ------------------------------------------------------------------ clubs ---

export type ClubId = "putter" | "wedge" | "iron9" | "iron5" | "wood" | "driver";

export interface Club {
  readonly id: ClubId;
  /** The learning rate this club strikes with. */
  readonly eta: number;
}

/** Shortest to longest. */
export const CLUBS: readonly Club[] = [
  { id: "putter", eta: 0.02 },
  { id: "wedge", eta: 0.05 },
  { id: "iron9", eta: 0.1 },
  { id: "iron5", eta: 0.2 },
  { id: "wood", eta: 0.5 },
  { id: "driver", eta: 1 },
];

// Every ClubId names an entry of CLUBS, so the fallback is never reached.
export const clubById = (id: ClubId): Club => CLUBS.find((c) => c.id === id) ?? CLUBS[0]!;

// ----------------------------------------------------------------- course ---

/** Half the width of the course. A ball beyond it on either axis is out of bounds. */
export const BOUND = 1.5;

/** The cup's radius, in the landscape's own units. */
export const CUP = 0.09;

/** A stroke that leaves the course costs this many strokes in all, and the ball comes back. */
export const OUT_OF_BOUNDS_COST = 2;

/** Strokes after which a free hole is picked up and scored as played. */
export const FREE_LIMIT = 10;

/** Strokes after which a one-club hole stops: it is not going to get there. */
export const FIXED_LIMIT = 40;

export type HoleId = "bowl" | "oval" | "ravine" | "valley" | "oneClub" | "oneClubNarrow";

export interface HoleSpec {
  readonly id: HoleId;
  readonly landscape: Landscape;
  /** `free`: any club on any stroke. `fixed`: one club, chosen once, for every stroke. */
  readonly mode: "free" | "fixed";
  /** How far from the cup the tee is placed, as a fraction of `BOUND`. */
  readonly reach: number;
}

/**
 * Six holes, each a lesson the lab makes elsewhere.
 *
 * - bowl: κ = 1. The slope points at the cup; one club sinks it.
 * - oval: κ = 4. The slope no longer points at the cup.
 * - ravine: steep across y. The big clubs fly off; one club lands on the floor.
 * - valley: κ = 20, and no club lands exactly on its floor. A big club
 *   multiplies whatever is left across the valley by 1 − η·a, so the steep
 *   direction has to be made small with short clubs before the long shot.
 * - oneClub, oneClubNarrow: one learning rate for every stroke, on κ = 4 and
 *   then κ = 12, so the cost of conditioning shows up as a stroke count.
 */
export const HOLES: readonly HoleSpec[] = [
  { id: "bowl", landscape: { a: 2, b: 2 }, mode: "free", reach: 0.7 },
  { id: "oval", landscape: { a: 4, b: 1 }, mode: "free", reach: 0.75 },
  { id: "ravine", landscape: { a: 1, b: 20 }, mode: "free", reach: 0.75 },
  { id: "valley", landscape: { a: 18, b: 0.9 }, mode: "free", reach: 0.8 },
  { id: "oneClub", landscape: { a: 4, b: 1 }, mode: "fixed", reach: 0.75 },
  { id: "oneClubNarrow", landscape: { a: 12, b: 1 }, mode: "fixed", reach: 0.75 },
];

export type Rng = () => number;

/**
 * A random tee: on a circle of radius `reach·BOUND`, at an angle at least 25°
 * from either axis. On an axis one coordinate is already solved, and the hole
 * would teach nothing about the other.
 */
export function teeFor(spec: HoleSpec, rng: Rng): Point {
  const margin = (25 * Math.PI) / 180;
  const quadrant = Math.floor(rng() * 4);
  const angle = quadrant * (Math.PI / 2) + margin + rng() * (Math.PI / 2 - 2 * margin);
  const r = spec.reach * BOUND;
  return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
}

// ---------------------------------------------------------------- strokes ---

/** One stroke: a single plain gradient-descent step of size η. */
export function strike(l: Landscape, p: Point, eta: number): Point {
  const g = gradient(l, p);
  return { x: p.x - eta * g.x, y: p.y - eta * g.y };
}

export const slopeAt = (l: Landscape, p: Point): number => {
  const g = gradient(l, p);
  return Math.hypot(g.x, g.y);
};

export const inCup = (p: Point): boolean => Math.hypot(p.x, p.y) <= CUP;

export const outOfBounds = (p: Point): boolean =>
  !Number.isFinite(p.x) || !Number.isFinite(p.y) || Math.abs(p.x) > BOUND || Math.abs(p.y) > BOUND;

export type ShotResult = "rolling" | "holed" | "out";

export interface Shot {
  readonly club: ClubId;
  readonly from: Point;
  /** Where the ball came to rest; for an out-of-bounds shot, where it would have. */
  readonly to: Point;
  /** |∇f| at `from`: the steepness the club multiplied. */
  readonly slope: number;
  readonly result: ShotResult;
}

export function play(l: Landscape, from: Point, club: Club): Shot {
  const to = strike(l, from, club.eta);
  const result: ShotResult = outOfBounds(to) ? "out" : inCup(to) ? "holed" : "rolling";
  return { club: club.id, from, to, slope: slopeAt(l, from), result };
}

/** Strokes a list of shots has cost, with the penalty for each one that left the course. */
export const strokesOf = (shots: readonly Shot[]): number =>
  shots.reduce((n, s) => n + (s.result === "out" ? OUT_OF_BOUNDS_COST : 1), 0);

/** Where the ball rests after these shots: an out-of-bounds shot leaves it where it was. */
export function lieAfter(tee: Point, shots: readonly Shot[]): Point {
  let p = tee;
  for (const s of shots) if (s.result !== "out") p = s.to;
  return p;
}

// ---------------------------------------------------------------- solvers ---

export interface FreeSolution {
  readonly strokes: number;
  readonly clubs: readonly ClubId[];
}

/**
 * The fewest strokes that hole the ball when any club may be used on any
 * stroke, by breadth-first search over the clubs.
 *
 * The search never plays an out-of-bounds shot: it costs strokes and leaves
 * the ball where it was, so it is never part of a shortest round. Positions
 * reached by different orders of the same clubs are the same point (every
 * stroke multiplies each coordinate by its own factor), so states are merged
 * on a rounded position, which keeps each level small.
 */
export function solveFree(l: Landscape, tee: Point, limit = FREE_LIMIT): FreeSolution | null {
  if (inCup(tee)) return { strokes: 0, clubs: [] };
  let frontier: { p: Point; clubs: ClubId[] }[] = [{ p: tee, clubs: [] }];
  const seen = new Set<string>();
  const key = (p: Point) => `${p.x.toFixed(9)},${p.y.toFixed(9)}`;
  seen.add(key(tee));
  for (let depth = 1; depth <= limit; depth++) {
    const next: typeof frontier = [];
    for (const state of frontier) {
      for (const club of CLUBS) {
        const shot = play(l, state.p, club);
        if (shot.result === "out") continue;
        const clubs = [...state.clubs, club.id];
        if (shot.result === "holed") return { strokes: depth, clubs };
        const k = key(shot.to);
        if (seen.has(k)) continue;
        seen.add(k);
        next.push({ p: shot.to, clubs });
      }
    }
    if (next.length === 0) return null;
    frontier = next;
  }
  return null;
}

export interface FixedRun {
  readonly club: ClubId;
  readonly shots: readonly Shot[];
  /** Strokes it cost, penalties included. */
  readonly strokes: number;
  readonly holed: boolean;
}

/**
 * One club on every stroke, until the ball drops, leaves the course, or the
 * limit is reached. A shot that leaves the course ends the run: with the same
 * club from the same spot it would only leave again.
 */
export function runFixed(l: Landscape, tee: Point, club: Club, limit = FIXED_LIMIT): FixedRun {
  const shots: Shot[] = [];
  let p = tee;
  while (strokesOf(shots) < limit) {
    const shot = play(l, p, club);
    shots.push(shot);
    if (shot.result !== "rolling") break;
    p = shot.to;
  }
  const last = shots[shots.length - 1];
  const holed = last?.result === "holed";
  return {
    club: club.id,
    shots,
    strokes: holed ? strokesOf(shots) : limit,
    holed,
  };
}

/** The best single club for a one-club hole: fewest strokes, and the shorter club on a tie. */
export function solveFixed(l: Landscape, tee: Point, limit = FIXED_LIMIT): FixedRun {
  let best: FixedRun | null = null;
  for (const club of CLUBS) {
    const run = runFixed(l, tee, club, limit);
    if (!best || run.strokes < best.strokes) best = run;
  }
  // CLUBS is not empty, so the loop ran at least once.
  return best!;
}

// ------------------------------------------------------------------ round ---

export interface HolePlan {
  readonly spec: HoleSpec;
  readonly tee: Point;
  readonly par: number;
}

/** A round: every hole with its tee and its computed par. */
export function planRound(rng: Rng): HolePlan[] {
  return HOLES.map((spec) => {
    const tee = teeFor(spec, rng);
    const par =
      spec.mode === "free"
        ? (solveFree(spec.landscape, tee)?.strokes ?? FREE_LIMIT)
        : solveFixed(spec.landscape, tee).strokes;
    return { spec, tee, par };
  });
}

/** Golf's names for a score against par. */
export type ScoreName =
  "holeInOne" | "eagle" | "birdie" | "par" | "bogey" | "doubleBogey" | "worse";

export function scoreName(strokes: number, par: number): ScoreName {
  if (strokes === 1) return "holeInOne";
  const d = strokes - par;
  if (d <= -2) return "eagle";
  if (d === -1) return "birdie";
  if (d === 0) return "par";
  if (d === 1) return "bogey";
  if (d === 2) return "doubleBogey";
  return "worse";
}
