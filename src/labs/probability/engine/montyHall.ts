/**
 * The Monty Hall problem, played rather than asserted.
 *
 * Pure TypeScript — no React, no DOM, and no randomness that is not seeded.
 *
 * ## The host is the whole problem
 *
 * The counterintuitive answer depends entirely on the host's constraints, and
 * a version that gets them wrong is a different problem with a different
 * answer. So they are enforced here rather than described:
 *
 *   1. the host never opens the door the player picked;
 *   2. the host never opens the door with the car.
 *
 * Those two rules are what make the host's action informative. A host who
 * opened a door at random — and sometimes revealed the car — would leave
 * staying and switching equally good, which is exactly the intuition most
 * people arrive with. `montyHall.test.ts` checks both rules on every round of
 * a long run rather than trusting the code below to have kept them.
 *
 * ## When the host has a choice
 *
 * If the player's first pick was the car, both remaining doors hide goats and
 * the host may open either. This picks uniformly between them, drawing from
 * the seeded generator — so the run is reproducible, and the host is
 * symmetric.
 *
 * That symmetry is worth being deliberate about. A host with a fixed
 * preference (say, always the lower-numbered goat) still gives a switcher a
 * 2/3 win rate overall, so the headline number would be unchanged; but the
 * probability *conditional on which door was opened* would no longer be 2/3
 * for every case. The uniform host keeps the simple statement true in both
 * readings, which is the one the lab makes.
 */

import { createRng } from "@/lib/random";

export const DOORS = [0, 1, 2] as const;
export type Door = (typeof DOORS)[number];

export type Strategy = "stay" | "switch";

/** The exact probabilities, derived rather than measured. */
export const THEORETICAL: Readonly<Record<Strategy, number>> = {
  stay: 1 / 3,
  switch: 2 / 3,
};

export interface Round {
  readonly car: Door;
  readonly picked: Door;
  /** The goat the host revealed. Never `picked`, never `car`. */
  readonly opened: Door;
  /** The door a switcher would end on: the one neither picked nor opened. */
  readonly other: Door;
  /** True when the first pick was already the car. */
  readonly stayWins: boolean;
  /** Exactly the negation of `stayWins` — one of the two always wins. */
  readonly switchWins: boolean;
}

const remaining = (a: Door, b: Door): Door =>
  (3 - a - b) as Door; /* the three doors sum to 3, so this is the third */

/**
 * One round, from a car placement and a first pick.
 *
 * Split out from the generator so a test can drive every one of the nine
 * (car, pick) combinations directly instead of waiting for a seed to produce
 * them.
 */
export function resolve(car: Door, picked: Door, hostChoice: number): Round {
  // Doors the host is allowed to open: not the pick, not the car.
  const eligible = DOORS.filter((door) => door !== picked && door !== car);
  // Provably non-empty: at most two doors are excluded, and when the pick is
  // the car the two exclusions coincide, leaving two candidates.
  const opened = (eligible.length === 1 ? eligible[0] : eligible[hostChoice < 0.5 ? 0 : 1]) as Door;
  const other = remaining(picked, opened);
  const stayWins = picked === car;
  return { car, picked, opened, other, stayWins, switchWins: !stayWins };
}

/** One round from the generator: a uniform car, a uniform pick, a uniform host. */
export function playRound(rng: () => number): Round {
  const car = Math.floor(rng() * 3) as Door;
  const picked = Math.floor(rng() * 3) as Door;
  return resolve(car, picked, rng());
}

export interface Tally {
  readonly rounds: number;
  readonly stayWins: number;
  readonly switchWins: number;
}

export const EMPTY_TALLY: Tally = { rounds: 0, stayWins: 0, switchWins: 0 };

export const add = (tally: Tally, round: Round): Tally => ({
  rounds: tally.rounds + 1,
  stayWins: tally.stayWins + (round.stayWins ? 1 : 0),
  switchWins: tally.switchWins + (round.switchWins ? 1 : 0),
});

/**
 * Run many rounds and count both strategies on each of them.
 *
 * Both outcomes are read off the same round rather than simulated separately.
 * That is not a shortcut: in any given round exactly one of staying and
 * switching wins, so counting both from one deal is a complete description of
 * it — and it means the two rates are compared on identical games rather than
 * on two different samples that happen to be the same size.
 *
 * The consequence is an invariant worth testing: `stayWins + switchWins`
 * always equals `rounds`.
 */
export function simulate(seed: number, rounds: number): Tally {
  const rng = createRng(seed);
  let tally = EMPTY_TALLY;
  for (let i = 0; i < rounds; i++) tally = add(tally, playRound(rng));
  return tally;
}

/** Observed win rate, or null before any round has been played. */
export const rateOf = (wins: number, rounds: number): number | null =>
  rounds === 0 ? null : wins / rounds;
