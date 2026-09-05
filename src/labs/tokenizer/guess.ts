/**
 * Scoring for section 1, where the visitor guesses where the cuts fall.
 *
 * Pure logic, no React. A "cut" is identified by the index of the character it
 * sits in front of, so a cut at 3 means the token break between `text[2]` and
 * `text[3]`. Position 0 and position `text.length` are the ends of the string:
 * they are boundaries by definition, nobody has to guess them, and they are
 * excluded everywhere below.
 *
 * ## Why this is scored generously
 *
 * The visitor is being asked to predict a system they have never seen. Getting
 * it wrong *is* the lesson, so the scoring exists to make the wrongness legible
 * — which cuts were real, which were imagined, which were missed — and not to
 * produce a mark out of ten. There is no pass mark and no streak.
 */

import type { Token } from "./engine";

export interface GuessScore {
  /** Cuts the visitor marked that the tokenizer also makes. */
  readonly matched: readonly number[];
  /** Cuts the visitor marked that the tokenizer does not make. */
  readonly imagined: readonly number[];
  /** Cuts the tokenizer makes that the visitor did not mark. */
  readonly missed: readonly number[];
  /** Every cut the tokenizer makes, excluding the ends of the string. */
  readonly actual: readonly number[];
  /** How many cuts the visitor marked in total. */
  readonly guessed: number;
}

const ascending = (a: number, b: number) => a - b;

/**
 * The interior cuts of a token stream.
 *
 * Every token starts a boundary, but the first token starts at 0 — the front
 * of the string, which is not a cut anyone chose.
 */
export function cutsOf(tokens: readonly Token[]): number[] {
  const cuts: number[] = [];
  for (const token of tokens) {
    if (token.start > 0) cuts.push(token.start);
  }
  return cuts;
}

/** Compare a set of guessed cuts against what the tokenizer actually did. */
export function scoreGuess(guesses: Iterable<number>, tokens: readonly Token[]): GuessScore {
  const actual = cutsOf(tokens);
  const actualSet = new Set(actual);
  const guessSet = new Set<number>();
  for (const guess of guesses) if (guess > 0) guessSet.add(guess);

  const matched: number[] = [];
  const imagined: number[] = [];
  for (const guess of guessSet) (actualSet.has(guess) ? matched : imagined).push(guess);

  return {
    matched: matched.sort(ascending),
    imagined: imagined.sort(ascending),
    missed: actual.filter((cut) => !guessSet.has(cut)),
    actual,
    guessed: guessSet.size,
  };
}

/**
 * Where the cuts would fall if tokens were simply words.
 *
 * This is the guess almost everyone makes, and section 1 exists to break it.
 * Offered as a button so the visitor commits to something concrete rather than
 * to nothing — being wrong about a belief you actually hold teaches more than
 * being wrong about an empty strip.
 *
 * The cut goes **in front of the space**, not after it. That is the reading of
 * "split into words" this tokenizer agrees with — a word owns the space before
 * it — and it is deliberate that the button uses it: every cut it places turns
 * out to be real, so the reveal is not "you were off by one everywhere" (which
 * reads as a trick) but "you found the word boundaries and had no idea it also
 * cuts inside words" (which is the lesson).
 */
export function wordCuts(text: string): number[] {
  const cuts: number[] = [];
  for (let i = 1; i < text.length; i++) {
    // A run of whitespace that a word follows: the boundary is at its start.
    if (/\s/.test(text[i]!) && !/\s/.test(text[i - 1]!)) cuts.push(i);
  }
  return cuts;
}

