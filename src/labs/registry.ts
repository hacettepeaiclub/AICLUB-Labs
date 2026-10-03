import { lazy } from "react";
import type { LabEntry, LabLoader, LabMeta } from "./types";
import { attentionMeta } from "./attention/meta";
import { backpropagationMeta } from "./backpropagation/meta";
import { convolutionMeta } from "./convolution/meta";
import { wordEmbeddings3DMeta } from "./word-embeddings-3d/meta";
import { wordEmbeddingsMeta } from "./word-embeddings/meta";
import { gradientDescentMeta } from "./gradient-descent/meta";
import { floatingPointMeta } from "./floating-point/meta";
import { cryptographicHashingMeta } from "./cryptographic-hashing/meta";
import { hashTablesMeta } from "./hash-tables/meta";
import { hypothesisTestingMeta } from "./hypothesis-testing/meta";
import { multilayerPerceptronsMeta } from "./multilayer-perceptrons/meta";
import { graphSearchMeta } from "./graph-search/meta";
import { probabilityMeta } from "./probability/meta";
import { reinforcementLearningMeta } from "./reinforcement-learning/meta";
import { sortingMeta } from "./sorting/meta";
import { tokenizationMeta } from "./tokenization/meta";

/**
 * Central lab registry.
 *
 * To add an experiment:
 *   1. Create `src/labs/<slug>/` with `meta.ts` (LabMeta) and an
 *      `index.tsx` default-exporting the lab component.
 *   2. Append one entry here. Nothing else changes — routing, the home grid,
 *      and code-splitting all derive from this array.
 *
 * Example:
 *   import { lazy } from "react";
 *   import { sortingMeta } from "./sorting/meta";
import { tokenizationMeta } from "./tokenization/meta";
 *
 *   entry(sortingMeta, () => import("./sorting")),
 *
 * Components are wrapped in React.lazy, so each lab is its own chunk and the
 * registry stays cheap even at 100+ entries.
 */
/**
 * One entry, from its metadata and its loader.
 *
 * The loader is kept beside the component rather than disappearing inside
 * `lazy()`, because two things want it: React, when the route renders, and the
 * home page, when a card is pointed at. Without it there is no way to start a
 * lab's download before the click that needs it.
 */
const entry = (meta: LabMeta, load: LabLoader): LabEntry => ({
  meta,
  load,
  Component: lazy(load),
});

export const labs: LabEntry[] = [
  entry(attentionMeta, () => import("./attention")),
  entry(backpropagationMeta, () => import("./backpropagation")),
  entry(convolutionMeta, () => import("./convolution")),
  entry(wordEmbeddingsMeta, () => import("./word-embeddings")),
  // Draft: routable, but kept off the home grid. A prototype, not a lesson.
  entry(wordEmbeddings3DMeta, () => import("./word-embeddings-3d")),
  entry(gradientDescentMeta, () => import("./gradient-descent")),
  entry(floatingPointMeta, () => import("./floating-point")),
  entry(cryptographicHashingMeta, () => import("./cryptographic-hashing")),
  entry(hashTablesMeta, () => import("./hash-tables")),
  entry(hypothesisTestingMeta, () => import("./hypothesis-testing")),
  entry(multilayerPerceptronsMeta, () => import("./multilayer-perceptrons")),
  entry(graphSearchMeta, () => import("./graph-search")),
  entry(probabilityMeta, () => import("./probability")),
  entry(reinforcementLearningMeta, () => import("./reinforcement-learning")),
  entry(sortingMeta, () => import("./sorting")),
  entry(tokenizationMeta, () => import("./tokenization")),
];

export const publishedLabs = (): LabEntry[] =>
  labs
    .filter((lab) => !lab.meta.draft)
    .sort((a, b) => b.meta.publishedAt.localeCompare(a.meta.publishedAt));

/**
 * The order the collection is read in.
 *
 * A written sequence rather than a computed one. Every rule that was tried
 * here answered a question nobody asked: publication date put the newest lab
 * first, and a difficulty rank put the three labs tagged `intro` first — but
 * "how hard is this lab" is not "where does this belong in the collection".
 * Attention and Reward are gentle introductions *to attention and to reward*;
 * they still assume a reader who wants machine learning.
 *
 * So the list below is the argument the collection makes, in order: what a
 * function does to input, how a number is actually stored, how that function
 * becomes an address, what an algorithm costs, how a search explores, how
 * text is cut up — and only then the machine learning that stands on all six.
 *
 * A lab missing from this list is not lost: it sorts to the end, alphabetically,
 * so registering a lab always puts it on the home page and forgetting to name
 * it here is a placement bug rather than a disappearance.
 */
const LAB_ORDER = [
  "cryptographic-hashing",
  "floating-point",
  "hash-tables",
  "sorting",
  "graph-search",
  "tokenization",
  "gradient-descent",
  "multilayer-perceptrons",
  "backpropagation",
  "convolution",
  "attention",
  "reinforcement-learning",
  "word-embeddings",
  "hypothesis-testing",
  "probability",
] as const;

const RANK = new Map<string, number>(LAB_ORDER.map((slug, index) => [slug, index]));
const rankOf = (slug: string) => RANK.get(slug) ?? LAB_ORDER.length;

export const orderedLabs = (): LabEntry[] =>
  publishedLabs().sort(
    (a, b) => rankOf(a.meta.slug) - rankOf(b.meta.slug) || a.meta.slug.localeCompare(b.meta.slug),
  );

export const findLab = (slug: string): LabEntry | undefined =>
  labs.find((lab) => lab.meta.slug === slug);

/**
 * Start a lab's download without rendering it.
 *
 * Called when a card is pointed at or focused, which on a desktop buys the
 * whole time between "I am going to click this" and the click — usually a few
 * hundred milliseconds, and the lab chunks are 20–36 KB. Calling it twice is
 * free: a module already requested resolves from the module cache, and a
 * rejection is swallowed because a failed prefetch must never surface as an
 * error on a page that is working.
 */
export const preloadLab = (slug: string): void => {
  void findLab(slug)
    ?.load()
    .catch(() => {});
};

/**
 * The lab that comes after `slug` in the collection's reading order, or
 * `undefined` when there is none.
 *
 * `LAB_ORDER` is an argument with a beginning and an end — what a function
 * does to input, then what an algorithm costs, and only then the machine
 * learning that stands on both — so the last lab has no "next" rather than
 * wrapping to the first. A draft is not in the order at all, and has none
 * either.
 */
export const nextLab = (slug: string): LabEntry | undefined => {
  const ordered = orderedLabs();
  const index = ordered.findIndex((lab) => lab.meta.slug === slug);
  return index === -1 ? undefined : ordered[index + 1];
};
