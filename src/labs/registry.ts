import { lazy } from "react";
import type { LabEntry } from "./types";
import { hashPlaygroundMeta } from "./hash-playground/meta";
import { neuralPlaygroundMeta } from "./neural-playground/meta";
import { pathfindingMeta } from "./pathfinding/meta";
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
  { meta: hashPlaygroundMeta, Component: lazy(() => import("./hash-playground")) },
  { meta: neuralPlaygroundMeta, Component: lazy(() => import("./neural-playground")) },
  { meta: pathfindingMeta, Component: lazy(() => import("./pathfinding")) },
  { meta: sortingRaceMeta, Component: lazy(() => import("./sorting-race")) },
  { meta: tokenizerMeta, Component: lazy(() => import("./tokenizer")) },
];

export const publishedLabs = (): LabEntry[] =>
  labs
    .filter((lab) => !lab.meta.draft)
    .sort((a, b) => b.meta.publishedAt.localeCompare(a.meta.publishedAt));

export const findLab = (slug: string): LabEntry | undefined =>
  labs.find((lab) => lab.meta.slug === slug);
