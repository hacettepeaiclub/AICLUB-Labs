import { describe, expect, it } from "vitest";
import { labs, publishedLabs } from "../registry";
import { tokenizerMeta } from "./meta";
import {
  DEMO_CORPUS,
  GUESS_SENTENCE,
  HONESTY,
  MAX_MERGES,
  SAMPLES,
  SEED_SENTENCE,
  corpusById,
} from "./corpora";
import {
  corpusView,
  createTrainer,
  detokenize,
  tokenize,
  trainStep,
  trainVocabulary,
} from "./engine";
import { CHALLENGES } from "./challenge";

describe("registry", () => {
  it("registers the lab exactly once", () => {
    const entries = labs.filter((lab) => lab.meta.slug === tokenizerMeta.slug);
    expect(entries).toHaveLength(1);
  });

  it("keeps every slug unique", () => {
    const slugs = labs.map((lab) => lab.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("shows up on the home page", () => {
    expect(publishedLabs().map((lab) => lab.meta.slug)).toContain("tokenizer");
  });

  it("is the only machine-learning lab so far, and says how long it takes", () => {
    expect(tokenizerMeta.category).toBe("machine-learning");
    expect(tokenizerMeta.minutes).toBeGreaterThan(0);
    expect(tokenizerMeta.description.length).toBeLessThan(120);
  });
});

describe("honesty about scope", () => {
  it("says what the tokenizer is, and is not", () => {
    expect(HONESTY).toMatch(/not the tokenizer any GPT model uses/i);
  });

  it("never claims to be a deployed model's tokenizer anywhere in the lab", () => {
    // The one sentence that mentions GPT is the disclaimer itself.
    const forbidden = [/GPT tokens/i, /ChatGPT (would|counts|makes)/i, /OpenAI tokenizer/i];
    for (const pattern of forbidden) expect(HONESTY).not.toMatch(pattern);
  });
});

describe("section fixtures still behave the way the copy claims", () => {
  const english = trainVocabulary(corpusById("english").text, MAX_MERGES, "english");
  const turkish = trainVocabulary(corpusById("turkish").text, MAX_MERGES, "turkish");

  it("section 1: the sentence really does split `gardeners` and `watering`", () => {
    // The copy after the reveal names these two splits out loud.
    const texts = tokenize(GUESS_SENTENCE, english).map((t) => t.text);
    expect(texts).toContain(" garden");
    expect(texts).toContain("ers");
    expect(texts).toContain(" water");
    expect(texts).toContain("ing");
    expect(texts).toContain(".");
  });

  it("section 2: the demo corpus is small enough to look at and still teaches", () => {
    const trainer = createTrainer(DEMO_CORPUS, "demo");
    expect(trainer.words).toBeLessThanOrEqual(12);
    expect(corpusView(trainer)).toHaveLength(trainer.words);

    const learned: string[] = [];
    for (let i = 0; i < 40; i++) {
      const event = trainStep(trainer);
      if (!event) break;
      learned.push(event.token);
    }
    // Measured: " r", " re", " rea", " read", "er", "th", "the", " reader",
    // " the", " reads", " readi", " readin", " reading" — thirteen in all.
    // The space is part of the piece from the very first merge, which is the
    // same lesson section 1 just landed, so the copy names " read" with its
    // space rather than pretending a bare "read" was learned.
    expect(learned).toContain(" read");
    expect(learned).toContain(" reader");
    expect(learned).toContain(" reading");
    // "every" occurs once, so it is never worth a merge.
    expect(learned).not.toContain(" every");
    expect(learned.slice(0, 4)).toEqual([" r", " re", " rea", " read"]);
    expect(trainer.status).toBe("done");
    expect(learned.length).toBeLessThan(30);
  });

  it("section 2: the corpus view spells out exactly what the trainer holds", () => {
    const trainer = createTrainer(DEMO_CORPUS, "demo");
    for (let i = 0; i < 6; i++) trainStep(trainer);
    for (const word of corpusView(trainer)) {
      expect(word.symbols.join("")).toBe(word.text);
      expect(word.weight).toBeGreaterThanOrEqual(1);
    }
    // It really is a projection: reading it cannot disturb training.
    const before = corpusView(trainer);
    corpusView(trainer);
    expect(corpusView(trainer)).toEqual(before);
  });

  it("section 3: the seed sentence walks through the split the copy promises", () => {
    const at = (merges: number) => tokenize(SEED_SENTENCE, turkish, merges).map((t) => t.text);
    expect(at(50)).toEqual(expect.arrayContaining([" ev", "ler", "imiz", "den"]));
    expect(at(100)).toEqual(expect.arrayContaining([" ev", "lerimiz", "den"]));
    expect(at(200)).toEqual(expect.arrayContaining([" evlerimiz", "den"]));

    // And it keeps getting cheaper across the whole slider.
    expect(tokenize(SEED_SENTENCE, turkish, 0)).toHaveLength(Array.from(SEED_SENTENCE).length);
    expect(tokenize(SEED_SENTENCE, turkish, MAX_MERGES).length).toBeLessThan(
      tokenize(SEED_SENTENCE, turkish, 50).length,
    );
  });

  it("section 4: each sample is cheaper on the tokenizer that read its language", () => {
    for (const sample of SAMPLES) {
      const englishCost = tokenize(sample.text, english).length;
      const turkishCost = tokenize(sample.text, turkish).length;
      const turkishSample = sample.id.startsWith("tr-");
      expect(turkishSample ? turkishCost < englishCost : englishCost < turkishCost).toBe(true);
    }
  });

  it("section 4: the samples cover both directions, so neither side just wins", () => {
    const turkishSamples = SAMPLES.filter((s) => s.id.startsWith("tr-"));
    const englishSamples = SAMPLES.filter((s) => s.id.startsWith("en-"));
    expect(turkishSamples.length).toBeGreaterThan(0);
    expect(englishSamples.length).toBeGreaterThan(0);
  });

  it("every fixture round-trips through the tokenizer untouched", () => {
    const fixtures = [
      GUESS_SENTENCE,
      SEED_SENTENCE,
      DEMO_CORPUS,
      ...SAMPLES.map((s) => s.text),
      ...CHALLENGES.map((c) => c.start),
    ];
    for (const fixture of fixtures) {
      for (const vocabulary of [english, turkish]) {
        expect(detokenize(tokenize(fixture, vocabulary))).toBe(fixture);
        expect(detokenize(tokenize(fixture, vocabulary, 0))).toBe(fixture);
      }
    }
  });
});
