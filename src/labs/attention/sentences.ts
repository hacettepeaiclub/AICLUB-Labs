/**
 * The sentence the lab shows, and the one word the visitor can change.
 *
 * Pure data. The sentence is deliberately singular: ten selectable tokens
 * against three contexts is thirty distinct attention distributions, which is
 * more exploration than a five-minute lab needs. Adding sentences is additive
 * and cheap; adding them before the first one has earned its keep is not.
 *
 * ## Why this sentence, and why not the famous one
 *
 * The canonical attention example — "The animal didn't cross the street
 * because it was tired" — is famous precisely because resolving `it` needs
 * world knowledge: that tiredness is predicable of animals and width of
 * streets. A single-head, single-layer, untrained model has no such knowledge,
 * and there are only two ways to appear to have it: stack a second layer so
 * the pronoun first absorbs its predicate, or write the answer into the
 * vectors and present it as an inference. The first doubles the lab; the
 * second is dishonest. Using that sentence would invite exactly the belief the
 * lab exists to prevent — that the model understands English.
 *
 * This sentence asks for less and delivers it truthfully. `it` looks for
 * something noun-like and animate; `cat` is both, `ball` is only the first.
 * No world knowledge is claimed and none is needed.
 */

import { embed, isKnownWord } from "./lexicon";

/**
 * The one word the visitor can change, and the entire reason the lab has a
 * second control.
 *
 * - `ball`   — the baseline. A noun, not animate.
 * - `dog`    — a *competitor*. Animate, so it matches the same request `cat`
 *              matches, and softmax must divide the same 100% three ways
 *              instead of two. The weight on `cat` falls even though neither
 *              `it` nor `cat` changed at all.
 * - `mirror` — the *control*, and the more important of the two swaps. Its
 *              feature vector is **identical** to `ball`'s: these seven
 *              features cannot tell a ball from a mirror, so neither can the
 *              model, and nothing moves. Without this option a visitor learns
 *              "editing changes things"; with it they learn "editing a
 *              *matching* thing changes things", which is the mechanism.
 */
export const VARIANTS = ["ball", "dog", "mirror"] as const;
export type Variant = (typeof VARIANTS)[number];

export const DEFAULT_VARIANT: Variant = "ball";

/** The sentence, with the swappable word written as `null`. */
const TEMPLATE: readonly (string | null)[] = [
  "the",
  "cat",
  "ignored",
  "the",
  null,
  "because",
  "it",
  "was",
  "tired",
  ".",
];

/** Index of the word the variant replaces. */
export const SWAP_INDEX = TEMPLATE.indexOf(null);

/** The token the lab selects on load — the pronoun. */
export const QUERY_INDEX = 6;
/** The token the demonstration is about — the animate noun. */
export const TARGET_INDEX = 1;

export const TOKEN_COUNT = TEMPLATE.length;

/** The token strings for one variant. */
export function tokensFor(variant: Variant): string[] {
  return TEMPLATE.map((word, i) => (i === SWAP_INDEX ? variant : word!));
}

/** Input matrix X for one variant: `n × D_MODEL`, row-major, fresh each call. */
export function embedVariant(variant: Variant): Float64Array {
  return embed(tokensFor(variant));
}

/**
 * How each token is displayed. The engine works on lowercase keys; the
 * sentence is shown as a person would write it.
 */
export const DISPLAY: Readonly<Record<string, string>> = {
  the: "the",
  cat: "cat",
  dog: "dog",
  ball: "ball",
  mirror: "mirror",
  ignored: "ignored",
  because: "because",
  it: "it",
  was: "was",
  tired: "tired",
  ".": ".",
};

/** Sentence-cased display strings for one variant. */
export function displayTokens(variant: Variant): string[] {
  return tokensFor(variant).map((word, i) => {
    const shown = DISPLAY[word] ?? word;
    return i === 0 ? shown.charAt(0).toUpperCase() + shown.slice(1) : shown;
  });
}

/** Every word any variant can produce must exist in the lexicon. */
export function unknownWords(): string[] {
  const missing = new Set<string>();
  for (const variant of VARIANTS) {
    for (const word of tokensFor(variant)) if (!isKnownWord(word)) missing.add(word);
  }
  return [...missing];
}
