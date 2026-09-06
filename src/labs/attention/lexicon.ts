/**
 * The vocabulary and the three projection matrices.
 *
 * Pure data and pure functions — no React, no DOM, no randomness, no library.
 *
 * ## What is honest about this file
 *
 * Every number below was written by hand, and every one of them has a stated
 * semantic reason. Nothing here was learned from text, and nothing here was
 * tuned until a picture looked good: the feature vectors are 0/1 flags for
 * properties a student already knows the names of, and the projection weights
 * are sparse rules that can be read aloud as sentences ("a pronoun is looking
 * for something noun-like and animate, and is not looking for a determiner").
 *
 * What that buys is the thing the lab is for: when the reveal shows *why* one
 * token scored higher than another, the reason is inspectable rather than
 * "because the weights say so". Real language models learn representations in
 * hundreds of dimensions that nobody named and nobody can read. This one is
 * the opposite, on purpose, and the lab has to say so.
 *
 * ## What this file deliberately does NOT model
 *
 * Adjectives. There is no adjective axis, so `tired` carries only its
 * position and sits at neutral in every comparison. That is a limitation of
 * our seven hand-written features, not of attention, and it is worth showing
 * rather than hiding.
 *
 * Likewise `ball` and `mirror` have *identical* feature vectors. These seven
 * features cannot tell a ball from a mirror, so neither can the model. That
 * is exactly why `mirror` is the control in the context swap.
 */

// ------------------------------------------------------------- dimensions ---

/**
 * Input features. Each one is a property a student can name, and each token's
 * vector is a 0/1 flag per property plus a position value.
 */
export const FEATURES = [
  "noun",
  "animate",
  "plural",
  "verb",
  "function",
  "pronoun",
  "position",
] as const;
export type Feature = (typeof FEATURES)[number];
export const D_MODEL = FEATURES.length; // 7

/**
 * The query/key space.
 *
 * Six named axes rather than the three the design proposed. The engine
 * demonstrated the three-axis version to be insufficient — see
 * `engine.test.ts` > "why the query/key space needs six axes" — because with
 * only `nounness / animacy / plurality` a noun and a verb have no axis to ask
 * a question on, so their queries are identically zero and their attention
 * rows are identically uniform. Two of the lab's promises fail at once: no two
 * rows differ, and selecting a noun shows nothing.
 *
 * Each added axis carries a question somebody actually asks:
 *   verbness     — a noun looking for the predicate it belongs to
 *   functionness — every content word declining to look at determiners
 *   position     — a mild preference for later words
 */
export const QK_AXES = [
  "nounness",
  "animacy",
  "plurality",
  "verbness",
  "functionness",
  "position",
] as const;
export type QkAxis = (typeof QK_AXES)[number];
export const D_K = QK_AXES.length; // 6

/**
 * The value space — what a token contributes when it is attended to.
 *
 * Three content axes, so the output of a token reads as a plain sentence:
 * after attending, `it` is "mostly noun-like, largely animate".
 */
export const V_AXES = ["nounness", "animacy", "verbness"] as const;
export type VAxis = (typeof V_AXES)[number];
export const D_V = V_AXES.length; // 3

// -------------------------------------------------------------- the words ---

/** A word's content features. `position` is added per-sentence, not here. */
export interface WordFeatures {
  readonly noun?: number;
  readonly animate?: number;
  readonly plural?: number;
  readonly verb?: number;
  readonly function?: number;
  readonly pronoun?: number;
}

/**
 * Every word the lab can show, with the reason for each flag.
 *
 * Anything omitted is zero. A word with no flags at all is not a bug — it is a
 * word this feature set has no opinion about.
 */
export const WORDS: Readonly<Record<string, WordFeatures>> = {
  // Determiners and conjunctions: grammatical glue, no content of their own.
  the: { function: 1 },
  because: { function: 1 },
  ".": { function: 1 },

  // Nouns. `cat` and `dog` are animate; `ball` and `mirror` are not.
  cat: { noun: 1, animate: 1 },
  dog: { noun: 1, animate: 1 },
  ball: { noun: 1 },
  mirror: { noun: 1 },

  // Verbs.
  ignored: { verb: 1 },
  was: { verb: 1 },

  // Pronoun. Singular, and standing in for something else.
  it: { pronoun: 1 },

  // Adjective — unmodelled. There is no adjective axis, so this word carries
  // only its position. Stated rather than papered over.
  tired: {},

  // Only used by tests, to prove the plurality axis is wired and not
  // decorative. No sentence in the lab contains it.
  balls: { noun: 1, plural: 1 },
};

export const isKnownWord = (word: string): boolean =>
  Object.prototype.hasOwnProperty.call(WORDS, word);

// ------------------------------------------------------------- projections ---

/** A dModel × dOut matrix written as readable rows, one per input feature. */
type Rows = Readonly<Record<Feature, readonly number[]>>;

function flatten(rows: Rows, dOut: number): Float64Array {
  const out = new Float64Array(D_MODEL * dOut);
  for (let f = 0; f < D_MODEL; f++) {
    const row = rows[FEATURES[f]!];
    if (row.length !== dOut) {
      throw new Error(`lexicon: row "${FEATURES[f]}" has ${row.length} entries, expected ${dOut}`);
    }
    for (let a = 0; a < dOut; a++) out[f * dOut + a] = row[a]!;
  }
  return out;
}

/**
 * How strongly a token asks for what it is looking for.
 *
 * This is the magnitude of the hand-written projection, and it is the only
 * thing in the file that behaves like a temperature. It is stated here rather
 * than hidden inside the softmax, because a softmax over ten tokens with
 * scores near zero is flat no matter what the scores mean: without a real
 * request, every distribution is 10% across the board and there is nothing to
 * see. A trained model gets this sharpness from the learned norm of its
 * projections; this one gets it from a number somebody typed, and says so.
 */
const ASK = 3.0;
/** How strongly a content word declines to look at grammatical glue. */
const DECLINE = 2.6;
/** A mild preference for words later in the sentence. */
const RECENCY = 0.35;

/**
 * W_Q — what is this token looking for?
 *
 * Rows are input features, columns are `QK_AXES`. Read each non-zero as a
 * rule:
 *
 * - `pronoun → +nounness, +animacy` — a pronoun stands in for an entity, and
 *   `it` as the subject of "was tired" wants a thing that could be tired.
 * - `pronoun → −plurality` — `it` is singular, so a plural noun is a worse
 *   match. A negative weight is a real request, not an absence of one.
 * - `pronoun → −verbness` — a subject pronoun is not looking for another verb.
 * - `noun → +verbness` — a noun looks for the predicate it participates in.
 *   This is what makes selecting `cat` show a completely different picture
 *   from selecting `it`.
 * - `verb → +nounness` — a verb looks for its arguments.
 * - `… → −functionness` — no content word is looking for a determiner.
 * - `position → +position` — a mild pull toward later words.
 *
 * The `animate` and `plural` rows are **zero on purpose**: being animate does
 * not change what you are *looking for*, only what you *offer*. That
 * asymmetry is the whole reason W_Q and W_K are different matrices, and it is
 * the single most useful thing in the technical reveal.
 */
const WQ_ROWS: Rows = {
  //          nounness  animacy  plurality  verbness  functionness  position
  noun: [0, 0, 0, 2.8, -DECLINE, 0],
  animate: [0, 0, 0, 0, 0, 0],
  plural: [0, 0, 0, 0, 0, 0],
  verb: [2.8, 0, 0, 0, -DECLINE, 0],
  function: [0, 0, 0, 0, 0, 0],
  pronoun: [ASK, ASK, -1.5, -2.0, -DECLINE, 0],
  position: [0, 0, 0, 0, 0, RECENCY],
};

/**
 * W_K — what does this token offer?
 *
 * Deliberately the plainest matrix of the three: a token offers exactly the
 * content properties it has. The `pronoun` row is zero because a pronoun has
 * no content of its own to offer — that is what makes it a pronoun.
 */
const WK_ROWS: Rows = {
  //          nounness  animacy  plurality  verbness  functionness  position
  noun: [1, 0, 0, 0, 0, 0],
  animate: [0, 1, 0, 0, 0, 0],
  plural: [0, 0, 1, 0, 0, 0],
  verb: [0, 0, 0, 1, 0, 0],
  function: [0, 0, 0, 0, 1, 0],
  pronoun: [0, 0, 0, 0, 0, 0],
  position: [0, 0, 0, 0, 0, 1],
};

/**
 * W_V — what does this token contribute when it is attended to?
 *
 * The content features, so a weighted sum of values is readable as a blend:
 * after attending, `it` is mostly noun-like and largely animate. Position is
 * dropped here on purpose — where a word sits affects who looks at it, not
 * what it means.
 */
const WV_ROWS: Rows = {
  //          nounness  animacy  verbness
  noun: [1, 0, 0],
  animate: [0, 1, 0],
  plural: [0, 0, 0],
  verb: [0, 0, 1],
  function: [0, 0, 0],
  pronoun: [0, 0, 0],
  position: [0, 0, 0],
};

export const W_Q: Float64Array = flatten(WQ_ROWS, D_K);
export const W_K: Float64Array = flatten(WK_ROWS, D_K);
export const W_V: Float64Array = flatten(WV_ROWS, D_V);

// ------------------------------------------------------------ embeddings ---

/**
 * Position, as a feature.
 *
 * `(i + 1) / n`, so the first token is 0.1 rather than 0 — a token whose
 * position feature is exactly zero has an all-zero query and therefore a
 * perfectly uniform attention row, which is both an artefact and a lie.
 *
 * This is a deliberate simplification of the sinusoidal or learned positional
 * encodings a real model uses, and it inherits their weakness in an obvious
 * form: a dot product of two absolute positions can express "we are both late
 * in the sentence", but it cannot express "we are close together". This model
 * has no notion of distance.
 */
export const positionFeature = (index: number, n: number): number => (index + 1) / n;

/**
 * Build the input matrix X for a sentence: `n × D_MODEL`, row-major.
 *
 * Fresh array every call — tests perturb it, and nothing should alias.
 */
export function embed(tokens: readonly string[]): Float64Array {
  const n = tokens.length;
  const x = new Float64Array(n * D_MODEL);
  for (let i = 0; i < n; i++) {
    const word = tokens[i]!;
    const features = WORDS[word];
    if (!features) throw new Error(`lexicon: no features for "${word}"`);
    const at = i * D_MODEL;
    x[at + 0] = features.noun ?? 0;
    x[at + 1] = features.animate ?? 0;
    x[at + 2] = features.plural ?? 0;
    x[at + 3] = features.verb ?? 0;
    x[at + 4] = features.function ?? 0;
    x[at + 5] = features.pronoun ?? 0;
    x[at + 6] = positionFeature(i, n);
  }
  return x;
}

/** The model the lab uses. Frozen shape; the arrays are never written to. */
export const LAB_MODEL = {
  dModel: D_MODEL,
  dK: D_K,
  dV: D_V,
  wq: W_Q,
  wk: W_K,
  wv: W_V,
} as const;
