import { lazy } from "react";
import type { LabEntry } from "./types";
import { attentionMeta } from "./attention/meta";
import { embeddingUniverse3DMeta } from "./embedding-universe-3d/meta";
import { embeddingUniverseMeta } from "./embedding-universe/meta";
import { gradientDescentMeta } from "./gradient-descent/meta";
import { hashPlaygroundMeta } from "./hash-playground/meta";
import { neuralPlaygroundMeta } from "./neural-playground/meta";
import { pathfindingMeta } from "./pathfinding/meta";
import { rewardPlaygroundMeta } from "./reward-playground/meta";
import { sortingRaceMeta } from "./sorting-race/meta";
import { tokenizerMeta } from "./tokenizer/meta";

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
 *   import { sortingRaceMeta } from "./sorting-race/meta";
import { tokenizerMeta } from "./tokenizer/meta";
 *
 *   { meta: sortingRaceMeta, Component: lazy(() => import("./sorting-race")) },
 *
 * Components are wrapped in React.lazy, so each lab is its own chunk and the
 * registry stays cheap even at 100+ entries.
 */
export const labs: LabEntry[] = [
  { meta: attentionMeta, Component: lazy(() => import("./attention")) },
  { meta: embeddingUniverseMeta, Component: lazy(() => import("./embedding-universe")) },
  // Draft: routable, but kept off the home grid. A prototype, not a lesson.
  { meta: embeddingUniverse3DMeta, Component: lazy(() => import("./embedding-universe-3d")) },
  { meta: gradientDescentMeta, Component: lazy(() => import("./gradient-descent")) },
  { meta: hashPlaygroundMeta, Component: lazy(() => import("./hash-playground")) },
  { meta: neuralPlaygroundMeta, Component: lazy(() => import("./neural-playground")) },
  { meta: pathfindingMeta, Component: lazy(() => import("./pathfinding")) },
  { meta: rewardPlaygroundMeta, Component: lazy(() => import("./reward-playground")) },
  { meta: sortingRaceMeta, Component: lazy(() => import("./sorting-race")) },
  { meta: tokenizerMeta, Component: lazy(() => import("./tokenizer")) },
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
 * function does to input, what an algorithm costs, how a search explores, how
 * text is cut up — and only then the machine learning that stands on all four.
 *
 * A lab missing from this list is not lost: it sorts to the end, alphabetically,
 * so registering a lab always puts it on the home page and forgetting to name
 * it here is a placement bug rather than a disappearance.
 */
const LAB_ORDER = [
  "hash-playground",
  "sorting-race",
  "pathfinding",
  "tokenizer",
  "gradient-descent",
  "neural-playground",
  "attention",
  "reward-playground",
  "embedding-universe",
] as const;

const RANK = new Map<string, number>(LAB_ORDER.map((slug, index) => [slug, index]));
const rankOf = (slug: string) => RANK.get(slug) ?? LAB_ORDER.length;

export const orderedLabs = (): LabEntry[] =>
  publishedLabs().sort(
    (a, b) =>
      rankOf(a.meta.slug) - rankOf(b.meta.slug) || a.meta.slug.localeCompare(b.meta.slug),
  );

export const findLab = (slug: string): LabEntry | undefined =>
  labs.find((lab) => lab.meta.slug === slug);
