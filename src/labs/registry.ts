import { lazy } from "react";
import { DIFFICULTY_RANK, type LabEntry } from "./types";
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
 * The collection in the order someone should meet it: gentlest first, and
 * within a tier the shortest first.
 *
 * Publication order is the wrong answer for a curriculum — it happened to put
 * an intermediate lab in the first slot and the three-minute introduction in
 * the last one. Ties break on slug so the sort is total and the grid never
 * reshuffles between renders.
 */
export const labsByDifficulty = (): LabEntry[] =>
  publishedLabs().sort(
    (a, b) =>
      DIFFICULTY_RANK[a.meta.difficulty] - DIFFICULTY_RANK[b.meta.difficulty] ||
      a.meta.minutes - b.meta.minutes ||
      a.meta.slug.localeCompare(b.meta.slug),
  );

/**
 * The three the home page opens with — an editorial path, not a computed one.
 *
 * Sorting by `difficulty` alone yields Hash, Attention, Reward, because those
 * three are tagged `intro`. That tag answers "how hard is this lab", which is
 * not the same question as "where should someone start". Attention and Reward
 * are gentle introductions *to attention and to reward* — they still assume a
 * reader who wants machine learning. The path below is the one that assumes
 * nothing: what a function does to input, then what an algorithm costs, then
 * how a search explores.
 *
 * Three slugs is the least metadata that expresses this. Anything more general
 * would be a taxonomy invented to hold three facts.
 */
const START_HERE = ["hash-playground", "sorting-race", "pathfinding"] as const;

export const startHereLabs = (): LabEntry[] =>
  START_HERE.map((slug) => findLab(slug)).filter(
    (lab): lab is LabEntry => lab !== undefined && !lab.meta.draft,
  );

export const findLab = (slug: string): LabEntry | undefined =>
  labs.find((lab) => lab.meta.slug === slug);
