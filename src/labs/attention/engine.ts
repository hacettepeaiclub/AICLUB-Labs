/**
 * Single-head self-attention, written from scratch.
 *
 * Pure TypeScript — no React, no DOM, no randomness, no library. Everything
 * the lab draws is read out of this file, so the picture can never drift from
 * the arithmetic it claims to explain.
 *
 * ## What the lab is trying to show
 *
 *   **Attention is a competition, not a lookup.** Every token asks the same
 *   question of every other token, and a fixed budget of 100% is divided among
 *   the answers. Change any competitor and every share moves — including
 *   shares you were not touching.
 *
 * That is a property of the softmax below rather than a property of the
 * numbers in `lexicon.ts`: with weight `w_j = e^{s_j} / Σ_k e^{s_k}`, raising
 * any single score raises the denominator for everyone, so every other weight
 * strictly falls. The lab's central demonstration is therefore a theorem, not
 * a coincidence that had to be tuned into existence.
 *
 * ## The mathematics, exactly
 *
 *   Q = X·W_Q        K = X·W_K        V = X·W_V
 *   S = Q·Kᵀ / √d_k
 *   A = softmax(S), row-wise, with the row maximum subtracted first
 *   O = A·V
 *
 * Single head, single layer, no causal mask (every token sees every token), no
 * residual connection, no layer normalisation, no feed-forward block. Each of
 * those is an omission the lab names rather than hides.
 *
 * ## Storage
 *
 * Flat `Float64Array`, row-major, `row * cols + col` — the convention
 * `labs/neural-playground/engine.ts` uses. `attend()` computes the whole n×n,
 * not just one row, so the selection UI and the technical reveal provably read
 * the same object and switching the selected token recomputes nothing.
 *
 * ## Note on `!`
 *
 * Indices below are bounded by `n`, `dK` or `dV`, which also determine every
 * buffer's length, so all of them are provably in range. The assertions keep
 * the inner loops free of redundant undefined checks, following the same
 * convention as the other lab engines.
 */

export interface Model {
  readonly dModel: number;
  readonly dK: number;
  readonly dV: number;
  /** dModel × dK, row-major. */
  readonly wq: Float64Array;
  /** dModel × dK, row-major. */
  readonly wk: Float64Array;
  /** dModel × dV, row-major. */
  readonly wv: Float64Array;
}

/**
 * Every intermediate the calculation passes through, kept so the technical
 * reveal can trace one token from its query to its output without recomputing
 * anything — and without any chance of showing different numbers.
 */
export interface Attention {
  readonly n: number;
  readonly dK: number;
  readonly dV: number;
  /** n × dK — what each token is looking for. */
  readonly queries: Float64Array;
  /** n × dK — what each token offers. */
  readonly keys: Float64Array;
  /** n × dV — what each token contributes when attended to. */
  readonly values: Float64Array;
  /** n × n — raw match, already divided by √dK. */
  readonly scores: Float64Array;
  /** n × n — after softmax. Every row sums to 1. */
  readonly weights: Float64Array;
  /** n × dV — the weighted blend each token becomes. */
  readonly outputs: Float64Array;
}

/**
 * `out = in · w`, where `in` is n × dIn and `w` is dIn × dOut.
 *
 * Exported because the tests recompute the whole pipeline independently and
 * should not have to trust this function to check the ones above it.
 */
export function project(
  out: Float64Array,
  input: Float64Array,
  n: number,
  w: Float64Array,
  dIn: number,
  dOut: number,
): void {
  for (let i = 0; i < n; i++) {
    const inRow = i * dIn;
    const outRow = i * dOut;
    for (let a = 0; a < dOut; a++) {
      let sum = 0;
      for (let f = 0; f < dIn; f++) sum += input[inRow + f]! * w[f * dOut + a]!;
      out[outRow + a] = sum;
    }
  }
}

/**
 * Softmax in place over `data[at .. at+len)`.
 *
 * The row maximum is subtracted before exponentiating. That single line is the
 * whole numerical-stability story: without it a score of 800 overflows to
 * `Infinity` and the row becomes `NaN`; with it the largest exponent is always
 * `e^0 = 1`. Subtracting a constant from every score leaves the result exactly
 * unchanged, because the constant cancels between numerator and denominator.
 */
export function softmaxInPlace(data: Float64Array, at: number, len: number): void {
  if (len <= 0) return;

  let max = -Infinity;
  for (let i = 0; i < len; i++) {
    const value = data[at + i]!;
    if (value > max) max = value;
  }
  // An all −Infinity row would otherwise divide 0 by 0.
  if (!Number.isFinite(max)) max = 0;

  let sum = 0;
  for (let i = 0; i < len; i++) {
    const e = Math.exp(data[at + i]! - max);
    data[at + i] = e;
    sum += e;
  }

  const inv = sum > 0 ? 1 / sum : 0;
  for (let i = 0; i < len; i++) data[at + i] = data[at + i]! * inv;
}

/**
 * Run the head.
 *
 * `x` is the n × dModel input matrix. Nothing is cached and nothing is
 * memoised here: this is a pure function of `(model, x)`, so the same input
 * produces a bit-identical result every time.
 */
export function attend(model: Model, x: Float64Array, n: number): Attention {
  const { dModel, dK, dV } = model;
  if (x.length !== n * dModel) {
    throw new Error(`attend: x has ${x.length} entries, expected ${n * dModel}`);
  }

  const queries = new Float64Array(n * dK);
  const keys = new Float64Array(n * dK);
  const values = new Float64Array(n * dV);
  project(queries, x, n, model.wq, dModel, dK);
  project(keys, x, n, model.wk, dModel, dK);
  project(values, x, n, model.wv, dModel, dV);

  // S = Q·Kᵀ / √dK
  const scale = 1 / Math.sqrt(dK);
  const scores = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    const qRow = i * dK;
    for (let j = 0; j < n; j++) {
      const kRow = j * dK;
      let dot = 0;
      for (let a = 0; a < dK; a++) dot += queries[qRow + a]! * keys[kRow + a]!;
      scores[i * n + j] = dot * scale;
    }
  }

  // A = softmax(S), row-wise.
  const weights = new Float64Array(scores);
  for (let i = 0; i < n; i++) softmaxInPlace(weights, i * n, n);

  // O = A·V
  const outputs = new Float64Array(n * dV);
  for (let i = 0; i < n; i++) {
    const wRow = i * n;
    const oRow = i * dV;
    for (let j = 0; j < n; j++) {
      const weight = weights[wRow + j]!;
      if (weight === 0) continue;
      const vRow = j * dV;
      for (let a = 0; a < dV; a++) outputs[oRow + a] = outputs[oRow + a]! + weight * values[vRow + a]!;
    }
  }

  return { n, dK, dV, queries, keys, values, scores, weights, outputs };
}

// ------------------------------------------------------------------ views ---

/** Attention weights of token `i` over every token. A view, not a copy. */
export const rowWeights = (a: Attention, i: number): Float64Array =>
  a.weights.subarray(i * a.n, (i + 1) * a.n);

/** Raw scores of token `i`, already scaled by 1/√dK. A view, not a copy. */
export const rowScores = (a: Attention, i: number): Float64Array =>
  a.scores.subarray(i * a.n, (i + 1) * a.n);

export const queryOf = (a: Attention, i: number): Float64Array =>
  a.queries.subarray(i * a.dK, (i + 1) * a.dK);

export const keyOf = (a: Attention, i: number): Float64Array =>
  a.keys.subarray(i * a.dK, (i + 1) * a.dK);

export const valueOf = (a: Attention, i: number): Float64Array =>
  a.values.subarray(i * a.dV, (i + 1) * a.dV);

export const outputOf = (a: Attention, i: number): Float64Array =>
  a.outputs.subarray(i * a.dV, (i + 1) * a.dV);

export const weightAt = (a: Attention, i: number, j: number): number => a.weights[i * a.n + j]!;

export interface RankedWeight {
  readonly index: number;
  readonly weight: number;
}

/**
 * Token `i`'s attention, heaviest first.
 *
 * This is what the accessible summary and the ranked list are both built from,
 * so the spoken description and the picture are provably the same data. Ties
 * break by index, so the ordering is stable and deterministic.
 */
export function ranked(a: Attention, i: number): RankedWeight[] {
  const row = rowWeights(a, i);
  const out: RankedWeight[] = [];
  for (let j = 0; j < a.n; j++) out.push({ index: j, weight: row[j]! });
  out.sort((p, q) => (q.weight === p.weight ? p.index - q.index : q.weight - p.weight));
  return out;
}

/**
 * Shannon entropy of token `i`'s attention, in nats.
 *
 * `0` means all the weight sits on one token; `ln(n)` means a perfectly flat
 * row. Used to state "function words have no strong opinion" as a measurement
 * rather than an impression.
 */
export function entropy(a: Attention, i: number): number {
  const row = rowWeights(a, i);
  let h = 0;
  for (let j = 0; j < a.n; j++) {
    const p = row[j]!;
    if (p > 0) h -= p * Math.log(p);
  }
  return h;
}

/** Largest minus smallest weight in token `i`'s row. Flatness, plainly. */
export function spread(a: Attention, i: number): number {
  const row = rowWeights(a, i);
  let lo = Infinity;
  let hi = -Infinity;
  for (let j = 0; j < a.n; j++) {
    const p = row[j]!;
    if (p < lo) lo = p;
    if (p > hi) hi = p;
  }
  return hi - lo;
}
