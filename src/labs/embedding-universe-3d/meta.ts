import type { LabMeta } from "../types";

/**
 * A prototype, not a lesson.
 *
 * `draft: true` keeps it off the home grid while leaving it routable at
 * `/labs/embedding-universe-3d` — the repository's own mechanism for exactly
 * this, and the reason no feature flag had to be invented. Nothing links to it
 * from the published lab, so the taught path is untouched.
 */
export const embeddingUniverse3DMeta: LabMeta = {
  slug: "embedding-universe-3d",
  title: "Embedding Universe — 3D prototype",
  description:
    "An experiment: the same 318 words projected onto three PCA axes instead of two.",
  category: "machine-learning",
  difficulty: "advanced",
  minutes: 3,
  publishedAt: "2026-09-10",
  draft: true,
};
