import { describe, expect, it } from "vitest";
import {
  D_K,
  D_MODEL,
  D_V,
  FEATURES,
  QK_AXES,
  V_AXES,
  WORDS,
  W_K,
  W_Q,
  W_V,
  embed,
  isKnownWord,
  positionFeature,
} from "./lexicon";
import {
  DEFAULT_VARIANT,
  DISPLAY,
  QUERY_INDEX,
  SWAP_INDEX,
  TARGET_INDEX,
  TOKEN_COUNT,
  VARIANTS,
  displayTokens,
  embedVariant,
  tokensFor,
  unknownWords,
} from "./sentences";

/**
 * The lexicon is data, and its honesty is structural: every non-zero weight is
 * supposed to have a stated semantic reason. These tests pin the structural
 * claims the documentation makes, so a later edit that quietly turns the
 * matrices into tuned noise fails here.
 */

const wq = (feature: number, axis: number) => W_Q[feature * D_K + axis]!;
const wk = (feature: number, axis: number) => W_K[feature * D_K + axis]!;
const wv = (feature: number, axis: number) => W_V[feature * D_V + axis]!;

const F = Object.fromEntries(FEATURES.map((name, i) => [name, i])) as Record<
  (typeof FEATURES)[number],
  number
>;
const Q = Object.fromEntries(QK_AXES.map((name, i) => [name, i])) as Record<
  (typeof QK_AXES)[number],
  number
>;

describe("dimensions", () => {
  it("keeps the seven named input features", () => {
    expect([...FEATURES]).toEqual([
      "noun",
      "animate",
      "plural",
      "verb",
      "function",
      "pronoun",
      "position",
    ]);
    expect(D_MODEL).toBe(7);
  });

  it("names every query/key and value axis", () => {
    expect(QK_AXES).toHaveLength(D_K);
    expect(V_AXES).toHaveLength(D_V);
    expect(new Set(QK_AXES).size).toBe(D_K);
    expect(new Set(V_AXES).size).toBe(D_V);
  });

  it("sizes every projection matrix from those dimensions", () => {
    expect(W_Q.length).toBe(D_MODEL * D_K);
    expect(W_K.length).toBe(D_MODEL * D_K);
    expect(W_V.length).toBe(D_MODEL * D_V);
  });
});

describe("W_K — what a token offers", () => {
  it("lets each content feature announce exactly itself", () => {
    expect(wk(F.noun, Q.nounness)).toBe(1);
    expect(wk(F.animate, Q.animacy)).toBe(1);
    expect(wk(F.plural, Q.plurality)).toBe(1);
    expect(wk(F.verb, Q.verbness)).toBe(1);
    expect(wk(F.function, Q.functionness)).toBe(1);
    expect(wk(F.position, Q.position)).toBe(1);
  });

  it("gives a pronoun no content of its own to offer", () => {
    for (let a = 0; a < D_K; a++) expect(wk(F.pronoun, a)).toBe(0);
  });

  it("has no off-diagonal weights at all", () => {
    // Every non-zero in W_K is a feature announcing itself; anything else
    // would be a rule nobody wrote down.
    let nonZero = 0;
    for (let f = 0; f < D_MODEL; f++) {
      for (let a = 0; a < D_K; a++) if (wk(f, a) !== 0) nonZero += 1;
    }
    expect(nonZero).toBe(6);
  });
});

describe("W_Q — what a token is looking for", () => {
  it("makes a pronoun want a noun that is animate", () => {
    expect(wq(F.pronoun, Q.nounness)).toBeGreaterThan(0);
    expect(wq(F.pronoun, Q.animacy)).toBeGreaterThan(0);
  });

  it("makes a singular pronoun disprefer a plural noun", () => {
    expect(wq(F.pronoun, Q.plurality)).toBeLessThan(0);
  });

  it("makes a noun look for the predicate it belongs to", () => {
    expect(wq(F.noun, Q.verbness)).toBeGreaterThan(0);
  });

  it("makes a verb look for its arguments", () => {
    expect(wq(F.verb, Q.nounness)).toBeGreaterThan(0);
  });

  it("makes every content word decline to look at grammatical glue", () => {
    for (const feature of [F.noun, F.verb, F.pronoun]) {
      expect(wq(feature, Q.functionness)).toBeLessThan(0);
    }
  });

  it("gives function words nothing to ask for", () => {
    for (let a = 0; a < D_K; a++) expect(wq(F.function, a)).toBe(0);
  });

  it("leaves `animate` and `plural` asking for nothing", () => {
    // The asymmetry that makes W_Q and W_K different matrices: being animate
    // changes what you offer, not what you want.
    for (let a = 0; a < D_K; a++) {
      expect(wq(F.animate, a)).toBe(0);
      expect(wq(F.plural, a)).toBe(0);
    }
  });

  it("uses position only for a mild pull toward later words", () => {
    expect(wq(F.position, Q.position)).toBeGreaterThan(0);
    // Smaller than any semantic request, so word order nudges rather than
    // decides.
    const semantic = Math.abs(wq(F.pronoun, Q.nounness));
    expect(wq(F.position, Q.position)).toBeLessThan(semantic / 4);
    for (const a of [Q.nounness, Q.animacy, Q.plurality, Q.verbness, Q.functionness]) {
      expect(wq(F.position, a)).toBe(0);
    }
  });
});

describe("W_V — what a token contributes", () => {
  it("passes the content features through and drops the rest", () => {
    expect(wv(F.noun, 0)).toBe(1);
    expect(wv(F.animate, 1)).toBe(1);
    expect(wv(F.verb, 2)).toBe(1);
    for (const feature of [F.function, F.pronoun, F.position, F.plural]) {
      for (let a = 0; a < D_V; a++) expect(wv(feature, a)).toBe(0);
    }
  });
});

describe("the words", () => {
  it("marks cats and dogs animate, and balls and mirrors not", () => {
    expect(WORDS.cat).toEqual({ noun: 1, animate: 1 });
    expect(WORDS.dog).toEqual({ noun: 1, animate: 1 });
    expect(WORDS.ball).toEqual({ noun: 1 });
    expect(WORDS.mirror).toEqual({ noun: 1 });
  });

  it("gives `ball` and `mirror` identical vectors, which is the point of the control", () => {
    // These seven features cannot tell a ball from a mirror, so neither can
    // the model. Stated in the lexicon and asserted here.
    expect(WORDS.ball).toEqual(WORDS.mirror);
  });

  it("leaves the adjective unmodelled rather than inventing an axis for it", () => {
    expect(WORDS.tired).toEqual({});
  });

  it("only ever uses the seven declared features", () => {
    const allowed = new Set(FEATURES.filter((f) => f !== "position"));
    for (const [word, features] of Object.entries(WORDS)) {
      for (const key of Object.keys(features)) {
        expect(allowed.has(key as never), `${word}.${key}`).toBe(true);
      }
    }
  });

  it("uses only 0/1 flags, so no vector was quietly tuned", () => {
    for (const [word, features] of Object.entries(WORDS)) {
      for (const [key, value] of Object.entries(features)) {
        expect([0, 1], `${word}.${key} = ${value}`).toContain(value);
      }
    }
  });
});

describe("embedding", () => {
  it("builds an n × dModel matrix with the declared flags", () => {
    const x = embed(["cat", "ball"]);
    expect(x.length).toBe(2 * D_MODEL);
    expect(x[F.noun]).toBe(1);
    expect(x[F.animate]).toBe(1);
    expect(x[D_MODEL + F.noun]).toBe(1);
    expect(x[D_MODEL + F.animate]).toBe(0);
  });

  it("never gives a token a position of exactly zero", () => {
    // A zero position feature makes a function word's query identically zero,
    // and therefore its attention row perfectly uniform — an artefact, not a
    // fact about language.
    for (let n = 1; n <= 20; n++) {
      for (let i = 0; i < n; i++) {
        expect(positionFeature(i, n)).toBeGreaterThan(0);
        expect(positionFeature(i, n)).toBeLessThanOrEqual(1);
      }
    }
  });

  it("increases position monotonically along the sentence", () => {
    const x = embedVariant(DEFAULT_VARIANT);
    for (let i = 1; i < TOKEN_COUNT; i++) {
      expect(x[i * D_MODEL + F.position]!).toBeGreaterThan(x[(i - 1) * D_MODEL + F.position]!);
    }
  });

  it("returns a fresh array every call", () => {
    const a = embedVariant("ball");
    const b = embedVariant("ball");
    expect(a).not.toBe(b);
    a[0] = 99;
    expect(b[0]).not.toBe(99);
  });

  it("refuses a word it has no features for", () => {
    expect(() => embed(["banana"])).toThrow(/banana/);
    expect(isKnownWord("banana")).toBe(false);
    expect(isKnownWord("cat")).toBe(true);
  });
});

describe("the sentence", () => {
  it("knows every word it can produce", () => {
    expect(unknownWords()).toEqual([]);
  });

  it("puts the swap slot, the pronoun and the target where the lab expects", () => {
    const tokens = tokensFor("ball");
    expect(tokens).toHaveLength(TOKEN_COUNT);
    expect(tokens[SWAP_INDEX]).toBe("ball");
    expect(tokens[QUERY_INDEX]).toBe("it");
    expect(tokens[TARGET_INDEX]).toBe("cat");
  });

  it("offers exactly one competitor and one control", () => {
    expect([...VARIANTS]).toEqual(["ball", "dog", "mirror"]);
    expect(WORDS.dog!.animate).toBe(1);
    expect(WORDS.mirror!.animate).toBeUndefined();
  });

  it("changes only the swapped slot between variants", () => {
    const base = tokensFor("ball");
    for (const variant of VARIANTS) {
      const other = tokensFor(variant);
      for (let i = 0; i < TOKEN_COUNT; i++) {
        if (i === SWAP_INDEX) expect(other[i]).toBe(variant);
        else expect(other[i]).toBe(base[i]);
      }
    }
  });

  it("capitalises only the first word for display", () => {
    const shown = displayTokens("ball");
    expect(shown[0]).toBe("The");
    expect(shown[1]).toBe("cat");
    expect(shown[TOKEN_COUNT - 1]).toBe(".");
    expect(Object.keys(DISPLAY).length).toBeGreaterThanOrEqual(TOKEN_COUNT);
  });
});
