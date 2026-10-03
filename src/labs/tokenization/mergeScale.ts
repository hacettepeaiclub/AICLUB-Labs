/**
 * How the merge slider's positions map onto merge counts.
 *
 * The slider reports a real merge count and drives the real encoder — this
 * file only decides how much *travel* each part of the range gets.
 *
 * Phase 1 measured where the interesting behaviour lives. Between 0 and about
 * 120 merges a Turkish word walks through `ev · ler · imiz · den` and then
 * `ev · lerimiz · den`; past roughly 200 the tokenizer is memorising whole rare
 * words and the strip barely moves. On a linear 0–360 track that first stretch
 * is a third of the travel and passes under the thumb in a flick.
 *
 * So the track is curved: `merges = MAX · (a·x + (1−a)·x²)` for a position
 * fraction `x`. The quadratic term does the stretching; the linear term is
 * what stops the first few steps from all rounding to zero merges, which a
 * pure square does — three dead steps at the very start is exactly where the
 * slider most needs to feel alive. Both ends are still exactly 0 and 360, the
 * mapping is strictly increasing, and the number on screen is always the true
 * merge count.
 */

import { MAX_MERGES } from "./corpora";

/** Positions on the track. Each arrow-key press moves one. */
export const SLIDER_STEPS = 60;

/** Weight of the linear term. Small enough to keep the stretch, big enough to move. */
const LINEAR = 0.18;

const clamp = (value: number, max: number): number => Math.min(Math.max(value, 0), max);

/** The merge count a slider position stands for. */
export function mergesAt(position: number): number {
  const x = clamp(position, SLIDER_STEPS) / SLIDER_STEPS;
  return Math.round(MAX_MERGES * (LINEAR * x + (1 - LINEAR) * x * x));
}

/**
 * The nearest slider position for a merge count.
 *
 * The exact inverse of `mergesAt` before rounding — the positive root of
 * `(1−a)x² + ax − t = 0`.
 */
export function positionOf(merges: number): number {
  const t = clamp(merges, MAX_MERGES) / MAX_MERGES;
  const quadratic = 1 - LINEAR;
  const x = (-LINEAR + Math.sqrt(LINEAR * LINEAR + 4 * quadratic * t)) / (2 * quadratic);
  return Math.round(SLIDER_STEPS * x);
}
