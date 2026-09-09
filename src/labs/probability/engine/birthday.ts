/**
 * The birthday problem, on the standard simplified model.
 *
 * Pure TypeScript. The model is stated rather than assumed:
 *
 *   - 365 days, each equally likely;
 *   - no leap years;
 *   - birthdays independent between people.
 *
 * Real birthdays are none of those things — they cluster by season and by day
 * of the week, and a leap day exists. Every one of those corrections *raises*
 * the collision probability slightly, so the threshold this file computes is
 * the conservative one. The lab says so rather than quietly using the tidy
 * model and calling it the world.
 */

import { createRng } from "@/lib/random";

export const DAYS = 365;

/**
 * P(no two people share a birthday), by the complement:
 *
 *     365/365 x 364/365 x ... x (365 - n + 1)/365
 *
 * Computed as a running product rather than a ratio of factorials, which
 * overflow long before they are useful.
 */
export function noSharedProbability(n: number): number {
  if (n <= 1) return 1;
  if (n > DAYS) return 0; // pigeonhole: a match is certain
  let p = 1;
  for (let k = 0; k < n; k++) p *= (DAYS - k) / DAYS;
  return p;
}

/** P(at least one shared birthday) among `n` people. */
export const sharedProbability = (n: number): number => 1 - noSharedProbability(n);

/**
 * The smallest group in which a shared birthday is more likely than not.
 *
 * Searched rather than written down, so the famous number is an output of the
 * model instead of a constant somebody typed.
 */
export function firstAbove(threshold = 0.5, limit = DAYS + 1): number {
  for (let n = 1; n <= limit; n++) {
    if (sharedProbability(n) > threshold) return n;
  }
  return limit;
}

/** How many distinct pairs `n` people form — the quantity that grows fast. */
export const pairCount = (n: number): number => (n * (n - 1)) / 2;

export interface Room {
  /** One birthday per person, as a day index in `0..364`. */
  readonly birthdays: readonly number[];
  /** The first colliding pair found, by index, or null when all are distinct. */
  readonly match: readonly [number, number] | null;
}

/**
 * Fill a room and look for a collision.
 *
 * The reported pair is the first collision in seating order, which is stable
 * for a given seed and group size — so the highlight in the picture does not
 * jump around between renders of the same room.
 */
export function fillRoom(seed: number, n: number): Room {
  const rng = createRng(seed);
  const birthdays: number[] = [];
  const seen = new Map<number, number>();
  let match: [number, number] | null = null;

  for (let i = 0; i < n; i++) {
    const day = Math.floor(rng() * DAYS);
    birthdays.push(day);
    const earlier = seen.get(day);
    if (earlier !== undefined && match === null) match = [earlier, i];
    else if (earlier === undefined) seen.set(day, i);
  }

  return { birthdays, match };
}

export interface Trial {
  readonly rooms: number;
  readonly withMatch: number;
}

/**
 * Many independent rooms of the same size, counting how many had a collision.
 *
 * Kept separate from `sharedProbability` on purpose: the lab shows the two
 * side by side and the point is that they are computed by different routes and
 * agree anyway. If this ever called the closed form, the agreement would be
 * a tautology instead of evidence.
 */
export function simulate(seed: number, n: number, rooms: number): Trial {
  let withMatch = 0;
  for (let r = 0; r < rooms; r++) {
    // A distinct seed per room, derived from the run's seed, so the whole run
    // is reproducible from one number.
    if (fillRoom(seed + r * 7919, n).match !== null) withMatch += 1;
  }
  return { rooms, withMatch };
}
