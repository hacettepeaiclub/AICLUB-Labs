import { describe, expect, it } from "vitest";
import { cutsOf, scoreGuess, wordCuts } from "./guess";
import { GUESS_SENTENCE, MAX_MERGES, corpusById } from "./corpora";
import { detokenize, tokenize, trainVocabulary } from "./engine";
import { SLIDER_STEPS, mergesAt, positionOf } from "./mergeScale";

const english = trainVocabulary(corpusById("english").text, MAX_MERGES, "english");
const tokens = tokenize(GUESS_SENTENCE, english);

describe("cuts", () => {
  it("does not count the front of the string as a cut", () => {
    expect(cutsOf(tokens)).not.toContain(0);
    expect(cutsOf(tokens)).toHaveLength(tokens.length - 1);
  });

  it("puts a cut wherever a token starts", () => {
    for (const cut of cutsOf(tokens)) {
      expect(tokens.some((t) => t.start === cut)).toBe(true);
    }
  });

  it("marks the boundary in front of the space, where this tokenizer puts it", () => {
    expect(wordCuts("ab cd")).toEqual([2]);
    // One cut for a run of spaces, not one per space.
    expect(wordCuts("a  b")).toEqual([1]);
    expect(wordCuts("")).toEqual([]);
    expect(wordCuts("solid")).toEqual([]);
  });
});

describe("scoring a guess", () => {
  it("sorts every guess into matched, imagined or missed", () => {
    const actual = cutsOf(tokens);
    const first = actual[0]!;
    const score = scoreGuess([first, 999], tokens);

    expect(score.matched).toEqual([first]);
    expect(score.imagined).toEqual([999]);
    expect(score.missed).toEqual(actual.filter((cut) => cut !== first));
    expect(score.guessed).toBe(2);
  });

  it("ignores duplicates and the free boundary at zero", () => {
    const score = scoreGuess([5, 5, 0], tokens);
    expect(score.guessed).toBe(1);
  });

  it("reports everything missed when nothing was guessed", () => {
    const score = scoreGuess([], tokens);
    expect(score.matched).toHaveLength(0);
    expect(score.imagined).toHaveLength(0);
    expect(score.missed).toEqual(score.actual);
  });

  it("reports a perfect guess", () => {
    const score = scoreGuess(cutsOf(tokens), tokens);
    expect(score.missed).toHaveLength(0);
    expect(score.imagined).toHaveLength(0);
    expect(score.matched).toHaveLength(score.actual.length);
  });

  it("accounts for every guess and every real cut", () => {
    const score = scoreGuess([2, 4, 6, 8, 400], tokens);
    expect(score.matched.length + score.imagined.length).toBe(score.guessed);
    expect(score.matched.length + score.missed.length).toBe(score.actual.length);
  });

});

describe("the sentence section 1 uses", () => {
  it("agrees with every word boundary and then cuts inside words too", () => {
    // This is the shape the whole section depends on. The "cut at every word"
    // button must not be wrong — it must be *incomplete*. Measured: the five
    // word boundaries are all real cuts, and the tokenizer makes nine.
    const real = new Set(cutsOf(tokens));
    const words = wordCuts(GUESS_SENTENCE);
    expect(words.length).toBeGreaterThan(0);
    for (const cut of words) expect(real.has(cut)).toBe(true);

    const score = scoreGuess(words, tokens);
    expect(score.imagined).toHaveLength(0);
    expect(score.missed.length).toBeGreaterThanOrEqual(3);
    expect(tokens.length).toBeGreaterThan(GUESS_SENTENCE.trim().split(/\s+/).length);
  });

  it("still rebuilds exactly", () => {
    expect(detokenize(tokens)).toBe(GUESS_SENTENCE);
  });

  it("is short enough to guess and long enough to be interesting", () => {
    expect(GUESS_SENTENCE.length).toBeLessThan(60);
    expect(tokens.length).toBeGreaterThanOrEqual(8);
  });
});

describe("the merge slider's scale", () => {
  it("hits both ends exactly", () => {
    expect(mergesAt(0)).toBe(0);
    expect(mergesAt(SLIDER_STEPS)).toBe(MAX_MERGES);
    expect(positionOf(0)).toBe(0);
    expect(positionOf(MAX_MERGES)).toBe(SLIDER_STEPS);
  });

  it("clamps rather than running off either end", () => {
    expect(mergesAt(-10)).toBe(0);
    expect(mergesAt(SLIDER_STEPS + 10)).toBe(MAX_MERGES);
    expect(positionOf(-5)).toBe(0);
    expect(positionOf(MAX_MERGES * 3)).toBe(SLIDER_STEPS);
  });

  it("never goes backwards as the thumb moves right", () => {
    let previous = -1;
    for (let p = 0; p <= SLIDER_STEPS; p++) {
      const merges = mergesAt(p);
      expect(merges).toBeGreaterThanOrEqual(previous);
      previous = merges;
    }
  });

  it("round-trips every position through the merge count it stands for", () => {
    for (let p = 0; p <= SLIDER_STEPS; p++) {
      expect(positionOf(mergesAt(p))).toBe(p);
    }
  });

  it("has no dead steps — every position moves the merge count", () => {
    // A pure square rounds the first three positions all to zero merges, which
    // makes the slider feel broken exactly where it should feel liveliest.
    for (let p = 1; p <= SLIDER_STEPS; p++) {
      expect(mergesAt(p)).toBeGreaterThan(mergesAt(p - 1));
    }
  });

  it("spends most of the track on the range where the behaviour changes", () => {
    // Phase 1 measured the interesting region as roughly 0-120 merges. On a
    // linear track that is a third of the travel; here it must be more.
    const positions = [];
    for (let p = 0; p <= SLIDER_STEPS; p++) if (mergesAt(p) <= 120) positions.push(p);
    expect(positions.length / (SLIDER_STEPS + 1)).toBeGreaterThan(0.5);
  });
});
