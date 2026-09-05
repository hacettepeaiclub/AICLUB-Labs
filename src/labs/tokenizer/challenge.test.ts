import { describe, expect, it } from "vitest";
import {
  CHALLENGES,
  beatenCount,
  isBeaten,
  judge,
  missingWords,
  wordsOf,
  type ChallengeProgress,
  type ChallengeSpec,
} from "./challenge";
import { MAX_MERGES, corpusById } from "./corpora";
import { countTokens, trainVocabulary, type Vocabulary } from "./engine";

const vocabularies: Record<string, Vocabulary> = {
  english: trainVocabulary(corpusById("english").text, MAX_MERGES, "english"),
  turkish: trainVocabulary(corpusById("turkish").text, MAX_MERGES, "turkish"),
};

const C1 = CHALLENGES[0]!;
const C2 = CHALLENGES[1]!;

/**
 * Judge an attempt the way the matching UI does.
 *
 * `touched` differs by puzzle and has to be modelled, not guessed: in C1 the
 * text is the lever, so an untouched text means the visitor has not tried
 * anything; in C2 the text is fixed and the levers are elsewhere, so every
 * reading is a real attempt.
 */
const attempt = (
  spec: ChallengeSpec,
  text: string,
  merges = MAX_MERGES,
  corpus = spec.corpus ?? "english",
) =>
  judge(spec, {
    text,
    tokens: countTokens(text, vocabularies[corpus]!, merges),
    touched: spec.lever === "text" ? text !== spec.start : true,
  });

describe("required words", () => {
  it("reads words, not substrings", () => {
    expect(wordsOf("The Reading Room!")).toEqual(["the", "reading", "room"]);
    expect(wordsOf("")).toEqual([]);
    expect(wordsOf("1000000")).toEqual([]);
  });

  it("refuses a run-together sentence that only contains the words as substrings", () => {
    // The cheap way out, if matching were substring-based: no spaces to pay
    // for, every required word technically "present".
    expect(missingWords("thereadingroomiswarmerthanthewalking", C1.requires).length).toBeGreaterThan(
      0,
    );
    expect(attempt(C1, "thereadingroomiswarmerthanthewalking").kind).toBe("missing-words");
  });

  it("accepts the words in any case and any order", () => {
    expect(missingWords("WALKING than warmer is room reading the", C1.requires)).toEqual([]);
  });

  it("names what is still missing", () => {
    const verdict = attempt(C1, "the reading room");
    expect(verdict.kind).toBe("missing-words");
    // The verdict carries the facts; the wording lives in the dictionary.
    expect(verdict.missing).toContain("warmer");
  });
});

describe("judging", () => {
  it("says nothing has been tried until the text changes", () => {
    expect(judge(C1, { text: C1.start, tokens: 67, touched: false }).kind).toBe("untouched");
  });

  it("treats the budget as inclusive", () => {
    expect(judge(C2, { text: C2.start, tokens: C2.budget, touched: true }).kind).toBe("passed");
    expect(judge(C2, { text: C2.start, tokens: C2.budget + 1, touched: true }).kind).toBe(
      "over-budget",
    );
  });

  it("checks the words before the budget, so deleting the sentence never wins", () => {
    // Two tokens, far inside the budget — and still refused.
    expect(attempt(C1, "hi").kind).toBe("missing-words");
  });

  it("carries the overshoot and the budget", () => {
    const verdict = attempt(C1, C1.start.toLocaleLowerCase("en-US"));
    expect(verdict.kind).toBe("over-budget");
    expect(verdict.budget).toBe(C1.budget);
    expect(verdict.tokens).toBeGreaterThan(C1.budget);
  });
});

// -------------------------------------------------------------- budgets ----

describe("Gate A — the budgets are measured, and each puzzle needs its own lever", () => {
  it("C1 cannot be met by any single fix, but can be met by all of them", () => {
    const asGiven = countTokens(C1.start, vocabularies["english"]!);
    // Measured: 67 as given, 28 lower-cased, 17 also single-spaced, 9 tidy.
    expect(asGiven).toBeGreaterThan(60);

    const lowered = C1.start.toLocaleLowerCase("en-US");
    const spaced = lowered.replace(/\s+/g, " ").trim();
    const trimmed = "the reading room is warmer than the walking";

    expect(attempt(C1, lowered).kind).toBe("over-budget");
    expect(attempt(C1, spaced).kind).toBe("over-budget");
    expect(attempt(C1, trimmed).kind).toBe("passed");

    // Each fix on its own leaves it well over; together they clear it.
    expect(countTokens(lowered, vocabularies["english"]!)).toBeLessThan(asGiven);
    expect(countTokens(spaced, vocabularies["english"]!)).toBeLessThan(
      countTokens(lowered, vocabularies["english"]!),
    );
    expect(countTokens(trimmed, vocabularies["english"]!)).toBeLessThanOrEqual(C1.budget);
  });

  it("C1 still has headroom, so it is not a single-string puzzle", () => {
    // Several genuinely different rewrites pass. If only one string worked,
    // this would be a guessing game rather than a lesson.
    const solutions = [
      "the reading room is warmer than the walking",
      "the reading room is warmer than the walking.",
      "the reading room is warmer than walking",
      "reading the room is warmer than the walking",
    ];
    for (const solution of solutions) {
      expect(attempt(C1, solution).kind).toBe("passed");
    }
  });

  it("C1's own starting text is over budget", () => {
    expect(countTokens(C1.start, vocabularies["english"]!)).toBeGreaterThan(C1.budget);
  });

  it("C2 is unreachable on the English tokenizer at every merge count", () => {
    for (let merges = 0; merges <= MAX_MERGES; merges += 10) {
      expect(attempt(C2, C2.start, merges, "english").kind).toBe("over-budget");
    }
    // Even fully trained, and by a wide margin — this is not a near miss.
    const best = countTokens(C2.start, vocabularies["english"]!);
    expect(best).toBeGreaterThan(C2.budget * 1.8);
  });

  it("C2 is reachable on the Turkish tokenizer, but only once it has trained", () => {
    const turkish = vocabularies["turkish"]!;
    const at = (merges: number) =>
      judge(C2, { text: C2.start, tokens: countTokens(C2.start, turkish, merges), touched: true });

    expect(at(0).kind).toBe("over-budget");
    expect(at(50).kind).toBe("over-budget");
    expect(at(MAX_MERGES).kind).toBe("passed");
    // Measured: it crosses the budget at 200 merges.
    expect(at(200).kind).toBe("passed");
  });

  it("asks a different question in each puzzle", () => {
    expect(new Set(CHALLENGES.map((c) => c.lever)).size).toBe(CHALLENGES.length);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
    // The puzzle whose lever is the text is the only one with required words.
    for (const spec of CHALLENGES) {
      expect(spec.requires.length > 0).toBe(spec.lever === "text");
    }
  });
});

describe("progress", () => {
  it("remembers which puzzles have been beaten", () => {
    const progress: ChallengeProgress = { "say-it-cheaper": true };
    expect(isBeaten(progress, "say-it-cheaper")).toBe(true);
    expect(isBeaten(progress, "feed-it-the-right-words")).toBe(false);
    expect(
      beatenCount(
        progress,
        CHALLENGES.map((c) => c.id),
      ),
    ).toBe(1);
  });

  it("treats anything but true as unbeaten", () => {
    expect(isBeaten({}, "say-it-cheaper")).toBe(false);
  });
});
