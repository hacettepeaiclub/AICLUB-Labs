import { describe, expect, it } from "vitest";
import {
  attend,
  entropy,
  outputOf,
  queryOf,
  ranked,
  rowScores,
  rowWeights,
  softmaxInPlace,
  spread,
  weightAt,
  type Attention,
  type Model,
} from "./engine";
import { D_K, D_MODEL, D_V, LAB_MODEL, embed, W_K, W_Q, W_V } from "./lexicon";
import {
  QUERY_INDEX,
  SWAP_INDEX,
  TARGET_INDEX,
  TOKEN_COUNT,
  VARIANTS,
  embedVariant,
  tokensFor,
  type Variant,
} from "./sentences";

/**
 * The suite asserts relations and invariants, not remembered numbers.
 *
 * A test that says "this weight is 0.59" only proves the engine still does
 * what it did the day the number was pasted in. A test that says "adding an
 * animate competitor strictly reduces the weight on the other animate noun"
 * proves the engine is doing softmax attention. Almost everything below is of
 * the second kind; the few places a concrete number appears are Gate A, where
 * the number *is* the promise the lab makes to the visitor.
 */

const n = TOKEN_COUNT;
const model: Model = LAB_MODEL;

const run = (variant: Variant): Attention => attend(model, embedVariant(variant), n);

const BASE = run("ball");
const WITH_COMPETITOR = run("dog");
const WITH_CONTROL = run("mirror");

const TOKENS = tokensFor("ball");
const indexOfWord = (word: string): number => TOKENS.indexOf(word);

/** Every index whose token is a determiner, a conjunction or the full stop. */
const FUNCTION_WORDS = [0, 3, 5, 9];
/**
 * Content words this seven-feature lexicon actually models. `tired` (index 8)
 * is deliberately excluded: there is no adjective axis, so it carries only its
 * position and behaves like a function word. See the report.
 */
const MODELLED_CONTENT = [1, 2, 4, 6, 7];

// ======================================================= 1. rows sum to 1 ==

describe("softmax", () => {
  it("gives every row a total of exactly 1", () => {
    for (const a of [BASE, WITH_COMPETITOR, WITH_CONTROL]) {
      for (let i = 0; i < n; i++) {
        let sum = 0;
        const row = rowWeights(a, i);
        for (let j = 0; j < n; j++) sum += row[j]!;
        expect(sum).toBeCloseTo(1, 12);
      }
    }
  });

  it("produces only finite, non-negative weights", () => {
    for (let i = 0; i < BASE.weights.length; i++) {
      expect(Number.isFinite(BASE.weights[i]!)).toBe(true);
      expect(BASE.weights[i]!).toBeGreaterThanOrEqual(0);
    }
  });

  // ============================================== 2. numerical stability ==

  it("survives scores that would overflow without the max subtraction", () => {
    for (const magnitude of [800, 1e4, 1e8]) {
      const data = new Float64Array([magnitude, magnitude - 1, magnitude - 2, -magnitude]);
      softmaxInPlace(data, 0, data.length);
      let sum = 0;
      for (const value of data) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        sum += value;
      }
      expect(sum).toBeCloseTo(1, 12);
      // Naive exp() would have produced Infinity/Infinity = NaN here.
      expect(data[0]!).toBeGreaterThan(data[1]!);
    }
  });

  it("is unchanged by adding a constant to every score", () => {
    const base = new Float64Array([0.3, -1.2, 2.5, 0.0]);
    const shifted = new Float64Array(base.map((v) => v + 137.5));
    softmaxInPlace(base, 0, base.length);
    softmaxInPlace(shifted, 0, shifted.length);
    // Exact in real arithmetic; in float64 `exp(x + c) / Σ` and `exp(x) / Σ`
    // differ in the last bit or two, so this checks to 1e-14 rather than
    // claiming a precision the hardware does not have.
    for (let i = 0; i < base.length; i++) expect(shifted[i]!).toBeCloseTo(base[i]!, 14);
  });

  it("handles a row where every score is identical", () => {
    const data = new Float64Array([4, 4, 4, 4, 4]);
    softmaxInPlace(data, 0, data.length);
    for (const value of data) expect(value).toBeCloseTo(0.2, 15);
  });
});

// ================================================ 3. determinism, 6. shapes ==

describe("the calculation", () => {
  it("produces bit-identical results from identical inputs", () => {
    for (const variant of VARIANTS) {
      const one = run(variant);
      const two = run(variant);
      for (const key of ["queries", "keys", "values", "scores", "weights", "outputs"] as const) {
        expect(Array.from(one[key])).toEqual(Array.from(two[key]));
      }
    }
  });

  it("has the shapes the model declares", () => {
    expect(D_MODEL).toBe(7);
    expect(W_Q.length).toBe(D_MODEL * D_K);
    expect(W_K.length).toBe(D_MODEL * D_K);
    expect(W_V.length).toBe(D_MODEL * D_V);
    expect(BASE.queries.length).toBe(n * D_K);
    expect(BASE.keys.length).toBe(n * D_K);
    expect(BASE.values.length).toBe(n * D_V);
    expect(BASE.scores.length).toBe(n * n);
    expect(BASE.weights.length).toBe(n * n);
    expect(BASE.outputs.length).toBe(n * D_V);
  });

  it("rejects an input matrix of the wrong size", () => {
    expect(() => attend(model, new Float64Array(3), n)).toThrow();
  });

  // ========================================= 4. score order == weight order ==

  it("orders weights exactly as it orders scores", () => {
    for (const a of [BASE, WITH_COMPETITOR, WITH_CONTROL]) {
      for (let i = 0; i < n; i++) {
        const s = rowScores(a, i);
        const w = rowWeights(a, i);
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            if (s[j]! > s[k]!) expect(w[j]!).toBeGreaterThan(w[k]!);
            else if (s[j]! === s[k]!) expect(w[j]!).toBeCloseTo(w[k]!, 14);
          }
        }
      }
    }
  });

  // ============================== 7. output is the weighted sum of values ==

  it("makes each output the weighted blend of the values it attended to", () => {
    for (const a of [BASE, WITH_COMPETITOR]) {
      for (let i = 0; i < n; i++) {
        const expected = new Float64Array(D_V);
        for (let j = 0; j < n; j++) {
          const w = weightAt(a, i, j);
          for (let d = 0; d < D_V; d++) expected[d] = expected[d]! + w * a.values[j * D_V + d]!;
        }
        const actual = outputOf(a, i);
        for (let d = 0; d < D_V; d++) expect(actual[d]!).toBeCloseTo(expected[d]!, 12);
      }
    }
  });
});

// ================================ 9. anti-hardcoding: independent recompute ==

/**
 * A second, deliberately naive implementation written from the formula, using
 * plain arrays and sharing no code with `engine.ts`.
 *
 * This is the test that catches the failure the brief is most worried about:
 * if anyone ever replaces the computation with a stored table of impressive
 * weights — in the engine or behind it — the two implementations diverge and
 * this fails immediately.
 */
function naiveAttention(x: Float64Array, tokenCount: number) {
  const matmul = (rows: number, inner: number, outer: number, a: Float64Array, b: Float64Array) => {
    const out: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let o = 0; o < outer; o++) {
        let sum = 0;
        for (let k = 0; k < inner; k++) sum += a[i * inner + k]! * b[k * outer + o]!;
        row.push(sum);
      }
      out.push(row);
    }
    return out;
  };

  const q = matmul(tokenCount, D_MODEL, D_K, x, W_Q);
  const k = matmul(tokenCount, D_MODEL, D_K, x, W_K);
  const v = matmul(tokenCount, D_MODEL, D_V, x, W_V);

  const weights: number[][] = [];
  for (let i = 0; i < tokenCount; i++) {
    const scores: number[] = [];
    for (let j = 0; j < tokenCount; j++) {
      let dot = 0;
      for (let d = 0; d < D_K; d++) dot += q[i]![d]! * k[j]![d]!;
      scores.push(dot / Math.sqrt(D_K));
    }
    const max = Math.max(...scores);
    const exps = scores.map((s) => Math.exp(s - max));
    const total = exps.reduce((acc, e) => acc + e, 0);
    weights.push(exps.map((e) => e / total));
  }

  const outputs: number[][] = [];
  for (let i = 0; i < tokenCount; i++) {
    const row = new Array<number>(D_V).fill(0);
    for (let j = 0; j < tokenCount; j++) {
      for (let d = 0; d < D_V; d++) row[d] = row[d]! + weights[i]![j]! * v[j]![d]!;
    }
    outputs.push(row);
  }

  return { q, k, v, weights, outputs };
}

describe("nothing is hardcoded", () => {
  it("matches an independent naive implementation of the formula", () => {
    for (const variant of VARIANTS) {
      const x = embedVariant(variant);
      const a = attend(model, x, n);
      const naive = naiveAttention(x, n);

      for (let i = 0; i < n; i++) {
        for (let d = 0; d < D_K; d++) {
          expect(a.queries[i * D_K + d]!).toBeCloseTo(naive.q[i]![d]!, 12);
          expect(a.keys[i * D_K + d]!).toBeCloseTo(naive.k[i]![d]!, 12);
        }
        for (let j = 0; j < n; j++) {
          expect(weightAt(a, i, j)).toBeCloseTo(naive.weights[i]![j]!, 12);
        }
        for (let d = 0; d < D_V; d++) {
          expect(a.outputs[i * D_V + d]!).toBeCloseTo(naive.outputs[i]![d]!, 12);
        }
      }
    }
  });

  // ============================================== 11. perturbation response ==

  it("moves when a single feature moves by a millionth", () => {
    const x = embedVariant("ball");
    const before = attend(model, x, n);

    // Nudge `cat`'s animacy. Every row that can see it must respond.
    const perturbed = new Float64Array(x);
    perturbed[TARGET_INDEX * D_MODEL + 1] = perturbed[TARGET_INDEX * D_MODEL + 1]! + 1e-6;
    const after = attend(model, perturbed, n);

    let moved = 0;
    for (let i = 0; i < n; i++) {
      // Only rows whose query actually asks about animacy can respond.
      if (queryOf(before, i)[1] === 0) continue;
      for (let j = 0; j < n; j++) {
        if (weightAt(before, i, j) !== weightAt(after, i, j)) moved += 1;
      }
    }
    expect(moved).toBeGreaterThan(0);
    expect(weightAt(before, QUERY_INDEX, TARGET_INDEX)).not.toBe(
      weightAt(after, QUERY_INDEX, TARGET_INDEX),
    );
  });

  it("responds to a feature change in every row that queries that feature", () => {
    const x = embedVariant("ball");
    const before = attend(model, x, n);
    const perturbed = new Float64Array(x);
    // Nudge `ball`'s nounness — pronouns and verbs both ask about that.
    perturbed[SWAP_INDEX * D_MODEL + 0] = perturbed[SWAP_INDEX * D_MODEL + 0]! + 1e-6;
    const after = attend(model, perturbed, n);

    for (const i of [QUERY_INDEX, indexOfWord("ignored"), indexOfWord("was")]) {
      expect(weightAt(before, i, SWAP_INDEX)).not.toBe(weightAt(after, i, SWAP_INDEX));
    }
  });
});

// ============================================== 8. permutation equivariance ==

describe("permutation", () => {
  /** The same model with position removed from both projections. */
  const positionless: Model = (() => {
    const wq = new Float64Array(W_Q);
    const wk = new Float64Array(W_K);
    // Feature 6 is `position`; zero its whole row in both matrices.
    for (let a = 0; a < D_K; a++) {
      wq[6 * D_K + a] = 0;
      wk[6 * D_K + a] = 0;
    }
    return { dModel: D_MODEL, dK: D_K, dV: D_V, wq, wk, wv: W_V };
  })();

  it("permutes the attention matrix exactly as it permutes the tokens", () => {
    // With position disabled the head is order-blind, so shuffling the
    // sentence must shuffle the answer and change nothing else. This is a
    // genuine property of attention and a limitation worth naming.
    const order = [4, 0, 7, 2, 9, 1, 6, 3, 8, 5];
    const x = embedVariant("ball");
    const base = attend(positionless, x, n);

    const shuffled = new Float64Array(n * D_MODEL);
    for (let i = 0; i < n; i++) {
      for (let f = 0; f < D_MODEL; f++) shuffled[i * D_MODEL + f] = x[order[i]! * D_MODEL + f]!;
    }
    const moved = attend(positionless, shuffled, n);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        expect(weightAt(moved, i, j)).toBeCloseTo(weightAt(base, order[i]!, order[j]!), 12);
      }
    }
  });

  it("is NOT order-blind once position is switched back on", () => {
    // The positional feature exists precisely so the two `the` tokens are not
    // the same token. Without it they are indistinguishable.
    const withoutPosition = attend(positionless, embedVariant("ball"), n);
    expect(Array.from(rowWeights(withoutPosition, 0))).toEqual(
      Array.from(rowWeights(withoutPosition, 3)),
    );
    expect(Array.from(rowWeights(BASE, 0))).not.toEqual(Array.from(rowWeights(BASE, 3)));
  });
});

// ============================================================ 10. ranked() ==

describe("ranked", () => {
  it("returns every token, heaviest first, summing to 1", () => {
    for (let i = 0; i < n; i++) {
      const list = ranked(BASE, i);
      expect(list).toHaveLength(n);
      let sum = 0;
      for (let r = 1; r < list.length; r++) {
        expect(list[r - 1]!.weight).toBeGreaterThanOrEqual(list[r]!.weight);
      }
      for (const entry of list) sum += entry.weight;
      expect(sum).toBeCloseTo(1, 12);
      expect(new Set(list.map((e) => e.index)).size).toBe(n);
    }
  });

  it("agrees with the weight matrix it claims to describe", () => {
    // The accessible summary is built from `ranked`; the picture is built from
    // `weights`. If these ever diverge, a screen reader would describe a
    // different distribution from the one on screen.
    for (let i = 0; i < n; i++) {
      for (const entry of ranked(BASE, i)) {
        expect(entry.weight).toBe(weightAt(BASE, i, entry.index));
      }
    }
  });

  it("breaks ties by index, so the order is stable", () => {
    const flat = attend(
      { dModel: D_MODEL, dK: D_K, dV: D_V, wq: new Float64Array(D_MODEL * D_K), wk: W_K, wv: W_V },
      embedVariant("ball"),
      n,
    );
    const list = ranked(flat, 0);
    expect(list.map((e) => e.index)).toEqual([...Array(n).keys()]);
  });
});

// ======================================== 5. the ball → dog swap theorem ==

describe("the swap theorem", () => {
  it("raises the score on the swapped slot when the replacement matches better", () => {
    const before = rowScores(BASE, QUERY_INDEX)[SWAP_INDEX]!;
    const after = rowScores(WITH_COMPETITOR, QUERY_INDEX)[SWAP_INDEX]!;
    expect(after).toBeGreaterThan(before);
  });

  it("leaves the query and the target's own vectors untouched", () => {
    // This is what makes the demonstration surprising: nothing about `it` or
    // `cat` changed, and yet the connection between them weakened.
    for (let d = 0; d < D_K; d++) {
      expect(queryOf(WITH_COMPETITOR, QUERY_INDEX)[d]!).toBe(queryOf(BASE, QUERY_INDEX)[d]!);
      expect(WITH_COMPETITOR.keys[TARGET_INDEX * D_K + d]!).toBe(
        BASE.keys[TARGET_INDEX * D_K + d]!,
      );
    }
    expect(rowScores(WITH_COMPETITOR, QUERY_INDEX)[TARGET_INDEX]!).toBe(
      rowScores(BASE, QUERY_INDEX)[TARGET_INDEX]!,
    );
  });

  it("therefore strictly reduces the weight on the untouched target", () => {
    // A theorem about softmax, not a tuned coincidence: the numerator is
    // unchanged, the denominator grew, so the quotient must fall.
    expect(weightAt(WITH_COMPETITOR, QUERY_INDEX, TARGET_INDEX)).toBeLessThan(
      weightAt(BASE, QUERY_INDEX, TARGET_INDEX),
    );
  });

  it("reduces every other weight in the row too, not just the target's", () => {
    for (let j = 0; j < n; j++) {
      if (j === SWAP_INDEX) continue;
      expect(weightAt(WITH_COMPETITOR, QUERY_INDEX, j)).toBeLessThan(
        weightAt(BASE, QUERY_INDEX, j),
      );
    }
  });

  it("changes nothing at all for the control, because it is the same vector", () => {
    // `ball` and `mirror` have identical features. The model cannot tell them
    // apart, so the whole matrix is untouched — which is the point of having
    // the control at all.
    expect(Array.from(WITH_CONTROL.weights)).toEqual(Array.from(BASE.weights));
  });

  it("genuinely rebuilds X rather than patching the result", () => {
    const a = embedVariant("ball");
    const b = embedVariant("dog");
    let differing = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) differing += 1;
    // Exactly one feature differs: the swapped slot's animacy.
    expect(differing).toBe(1);
    expect(b[SWAP_INDEX * D_MODEL + 1]!).toBe(1);
    expect(a[SWAP_INDEX * D_MODEL + 1]!).toBe(0);
  });
});

// ================================================ 12. function-word flatness ==

describe("what a function word looks at", () => {
  it("gives determiners and conjunctions measurably flatter rows than content words", () => {
    const flattest = Math.min(...FUNCTION_WORDS.map((i) => entropy(BASE, i)));
    const peakiest = Math.max(...MODELLED_CONTENT.map((i) => entropy(BASE, i)));
    // Entropy is highest when a row is flat, so every function word must sit
    // above every modelled content word.
    expect(flattest).toBeGreaterThan(peakiest);
  });

  it("still gives each function word a slightly different row", () => {
    // They are near-flat, not flat: the positional feature separates them.
    for (const i of FUNCTION_WORDS) expect(spread(BASE, i)).toBeGreaterThan(0);
  });

  it("treats the unmodelled adjective like a function word, because it is unmodelled", () => {
    // `tired` has no adjective axis to sit on, so it asks nothing. Reported
    // rather than hidden: it is a limitation of the lexicon, not of attention.
    const tired = entropy(BASE, indexOfWord("tired"));
    expect(tired).toBeGreaterThan(Math.max(...MODELLED_CONTENT.map((i) => entropy(BASE, i))));
  });
});

// ============================================================ GATE A =======

/**
 * The feasibility gate.
 *
 * These four numbers are the promise the lab makes to a visitor in its first
 * thirty seconds, so they are measured against the real engine on every run.
 * If the vectors or the projections are ever edited, this fails rather than
 * quietly turning the demonstration into mush.
 */
describe("Gate A — the demonstration actually demonstrates something", () => {
  it("A1: the selected pronoun has an obvious favourite", () => {
    const list = ranked(BASE, QUERY_INDEX);
    const top = list[0]!;
    const second = list[1]!;
    expect(top.index).toBe(TARGET_INDEX);
    expect(top.weight).toBeGreaterThanOrEqual(0.4);
    expect(top.weight - second.weight).toBeGreaterThanOrEqual(0.15);
  });

  it("A2: swapping in a competitor visibly steals weight from it", () => {
    const before = weightAt(BASE, QUERY_INDEX, TARGET_INDEX);
    const after = weightAt(WITH_COMPETITOR, QUERY_INDEX, TARGET_INDEX);
    expect(before - after).toBeGreaterThanOrEqual(0.15);
  });

  it("A3: the control barely moves anything", () => {
    const before = weightAt(BASE, QUERY_INDEX, TARGET_INDEX);
    const after = weightAt(WITH_CONTROL, QUERY_INDEX, TARGET_INDEX);
    expect(Math.abs(before - after)).toBeLessThanOrEqual(0.03);
  });

  it("A4: no row is uniform and no two rows are identical", () => {
    for (let i = 0; i < n; i++) expect(spread(BASE, i)).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        expect(Array.from(rowWeights(BASE, i))).not.toEqual(Array.from(rowWeights(BASE, j)));
      }
    }
  });

  it("A5: selecting a different token shows a genuinely different picture", () => {
    // The lab's core loop depends on this: click `cat` after `it` and the
    // answer must be somewhere else entirely, not a rearrangement of the same
    // two words.
    const pronounTop = ranked(BASE, QUERY_INDEX)[0]!.index;
    const nounTop = ranked(BASE, TARGET_INDEX)[0]!.index;
    expect(nounTop).not.toBe(pronounTop);
    expect(TOKENS[nounTop]).toMatch(/ignored|was/);
  });
});

// ================================ why the query/key space needs six axes ====

describe("why the query/key space needs six axes", () => {
  /**
   * The approved design proposed dK = 3 — `nounness`, `animacy`, `plurality`.
   * The engine says that is not enough, and this is the demonstration the
   * brief asked for before any dimension was allowed to change.
   */
  const threeAxisOnly: Model = (() => {
    const wq = new Float64Array(W_Q);
    const wk = new Float64Array(W_K);
    // Zero the verbness, functionness and position columns in both.
    for (let f = 0; f < D_MODEL; f++) {
      for (const axis of [3, 4, 5]) {
        wq[f * D_K + axis] = 0;
        wk[f * D_K + axis] = 0;
      }
    }
    return { dModel: D_MODEL, dK: D_K, dV: D_V, wq, wk, wv: W_V };
  })();

  const restricted = attend(threeAxisOnly, embedVariant("ball"), n);

  it("leaves nouns and verbs with nothing to ask, so their rows go flat", () => {
    // Without a `verbness` axis, a noun's query is identically zero.
    const q = queryOf(restricted, TARGET_INDEX);
    for (let d = 0; d < D_K; d++) expect(q[d]!).toBe(0);
    expect(spread(restricted, TARGET_INDEX)).toBeCloseTo(0, 15);
  });

  it("makes six different tokens produce the identical uniform row", () => {
    const uniform: number[] = [];
    for (let i = 0; i < n; i++) if (spread(restricted, i) < 1e-12) uniform.push(i);
    // Nouns, verbs, function words and the adjective all collapse together.
    expect(uniform.length).toBeGreaterThanOrEqual(6);
    for (let a = 1; a < uniform.length; a++) {
      expect(Array.from(rowWeights(restricted, uniform[a]!))).toEqual(
        Array.from(rowWeights(restricted, uniform[0]!)),
      );
    }
  });

  it("breaks Gate A4 and Gate A5, which is why the basis was widened", () => {
    // A4: identical rows exist.
    let identicalPairs = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Array.from(rowWeights(restricted, i)).every((v, k) => v === rowWeights(restricted, j)[k]))
          identicalPairs += 1;
      }
    }
    expect(identicalPairs).toBeGreaterThan(0);
    // A5: selecting `cat` shows nothing at all.
    expect(spread(restricted, TARGET_INDEX)).toBeLessThan(1e-12);
  });
});

// ================================================ the plurality axis is wired ==

describe("the plurality axis", () => {
  it("is inert in this sentence because nothing in it is plural", () => {
    for (const word of tokensFor("ball")) {
      expect(embed([word])[2]).toBe(0);
    }
  });

  it("but genuinely lowers the score of a plural noun when one is present", () => {
    // `balls` exists only for this test. It proves the negative weight from
    // `pronoun → −plurality` is a real rule and not decoration.
    const singular = tokensFor("ball");
    const plural = [...singular];
    plural[SWAP_INDEX] = "balls";

    const a = attend(model, embed(singular), n);
    const b = attend(model, embed(plural), n);
    expect(rowScores(b, QUERY_INDEX)[SWAP_INDEX]!).toBeLessThan(
      rowScores(a, QUERY_INDEX)[SWAP_INDEX]!,
    );
    // And by the same softmax theorem, the pronoun then leans harder on `cat`.
    expect(weightAt(b, QUERY_INDEX, TARGET_INDEX)).toBeGreaterThan(
      weightAt(a, QUERY_INDEX, TARGET_INDEX),
    );
  });
});
