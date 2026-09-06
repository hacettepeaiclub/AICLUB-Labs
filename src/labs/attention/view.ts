/**
 * Presentation logic for the sentence — pure, and deliberately outside the
 * components.
 *
 * Every number the lab shows is derived here from an `Attention` object the
 * engine produced. No component computes a percentage, and no component
 * contains one. That is not a style preference: it is the structural guard
 * against the failure this lab is most exposed to, which is a developer
 * pasting in the impressive-looking distribution instead of rendering the
 * computed one. `lab.test.ts` reads the component sources and fails if a
 * percentage literal ever appears in them.
 */

import { ranked, rowWeights, type Attention, type RankedWeight } from "./engine";

/**
 * The weight at which a token is drawn at full strength.
 *
 * Emphasis is measured against this fixed reference rather than against the
 * row's own maximum, and the difference matters. Scaling to the row maximum
 * would make a perfectly flat row — which is what a determiner produces —
 * render as ten equally *loud* words, when the truth is ten equally *quiet*
 * ones. Against a fixed reference a flat row stays uniformly faint, a near-tie
 * shows two words at almost the same strength, and a decisive row shows one.
 */
export const FULL_EMPHASIS = 0.35;

/** Below this an arc is more clutter than signal. */
export const ARC_THRESHOLD = 0.15;
/** Three at most. Nine arcs is a bowl of spaghetti, not a sentence. */
export const MAX_ARCS = 3;
/** Weights under this are not worth printing a number for. */
export const PERCENT_THRESHOLD = 0.1;
/** How many entries the quiet ranked summary lists. */
export const TOP_N = 3;

export interface TokenView {
  readonly index: number;
  readonly word: string;
  readonly weight: number;
  /** 0…1, drives type weight and underline width. */
  readonly emphasis: number;
  readonly selected: boolean;
  /** Whether this token is worth printing a percentage on. */
  readonly showPercent: boolean;
}

const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Percent as an integer. The single place a weight becomes a displayed number. */
export const percent = (weight: number): number => Math.round(weight * 100);

/**
 * One entry per token, in sentence order, carrying everything the sentence
 * needs to draw itself.
 */
export function tokenViews(
  attention: Attention,
  selected: number,
  words: readonly string[],
): TokenView[] {
  const row = rowWeights(attention, selected);
  const top = new Set(
    ranked(attention, selected)
      .slice(0, TOP_N)
      .map((entry) => entry.index),
  );

  return words.map((word, index) => {
    const weight = row[index] ?? 0;
    return {
      index,
      word,
      weight,
      emphasis: clamp01(weight / FULL_EMPHASIS),
      selected: index === selected,
      // Printing a number on all ten is noise; printing it on the three that
      // matter is the summary. A flat row therefore shows three near-equal
      // numbers, which is the truth about that row.
      showPercent: top.has(index) && weight >= PERCENT_THRESHOLD,
    };
  });
}

/**
 * Which tokens get an arc drawn to them.
 *
 * The selected token is excluded: an arc from a word to itself communicates
 * nothing, though its self-weight still appears in the bar and in the ranked
 * list, because leaving it out of those would misstate the distribution.
 */
export function arcTargets(attention: Attention, selected: number): RankedWeight[] {
  return ranked(attention, selected)
    .filter((entry) => entry.index !== selected && entry.weight >= ARC_THRESHOLD)
    .slice(0, MAX_ARCS);
}

/** The quiet ranked summary beside the sentence. */
export const topTargets = (attention: Attention, selected: number, count = TOP_N): RankedWeight[] =>
  ranked(attention, selected).slice(0, count);

/**
 * Is this row close to a tie at the top?
 *
 * Phase 1 measured that most rows are: selecting `cat` gives 27.1% and 26.7%
 * to the two verbs, because this model has no syntax and cannot tell which
 * predicate a noun belongs to. The UI has to say so rather than let a student
 * read a one-point lead as a decision.
 */
export const TIE_MARGIN = 0.05;

export function isNearTie(attention: Attention, selected: number): boolean {
  const list = ranked(attention, selected);
  const first = list[0];
  const second = list[1];
  if (!first || !second) return false;
  return first.weight - second.weight < TIE_MARGIN;
}

/** Every weight in a row, as whole percentages, for the accessible summary. */
export function rowPercents(attention: Attention, selected: number): number[] {
  const row = rowWeights(attention, selected);
  const out: number[] = [];
  for (let i = 0; i < attention.n; i++) out.push(percent(row[i] ?? 0));
  return out;
}
