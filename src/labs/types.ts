import type { ComponentType, LazyExoticComponent } from "react";

/** Topic areas — drives category color, filtering, and the home page grid. */
export type LabCategory =
  | "algorithms"
  | "data-structures"
  | "machine-learning"
  | "neural-networks"
  | "systems"
  | "theory";

export type LabDifficulty = "intro" | "intermediate" | "advanced";

/**
 * Static metadata for one experiment. Lives in `src/labs/<slug>/meta.ts` so
 * the home page can list every lab without loading any lab code.
 */
export interface LabMeta {
  /** URL segment and unique id — kebab-case, e.g. "sorting-race". */
  slug: string;
  title: string;
  /** One sentence, benefit-first: what will the visitor understand? */
  description: string;
  category: LabCategory;
  difficulty: LabDifficulty;
  /** Rough time to the "aha" moment, in minutes. */
  minutes: number;
  /** ISO date the lab shipped — newest first on the home page. */
  publishedAt: string;
  /** Hide from the grid while in development (still routable). */
  draft?: boolean;
}

/** A registered lab: metadata + lazily-loaded component. */
export interface LabEntry {
  meta: LabMeta;
  Component: LazyExoticComponent<ComponentType>;
}

export const CATEGORY_LABEL: Record<LabCategory, string> = {
  algorithms: "Algorithms",
  "data-structures": "Data Structures",
  "machine-learning": "Machine Learning",
  "neural-networks": "Neural Networks",
  systems: "Systems",
  theory: "Theory",
};

/** Tailwind classes per category — keeps category color usage consistent. */
export const CATEGORY_STYLE: Record<LabCategory, { dot: string; text: string }> = {
  algorithms: { dot: "bg-signal-cyan", text: "text-signal-cyan" },
  "data-structures": { dot: "bg-signal-green", text: "text-signal-green" },
  "machine-learning": { dot: "bg-accent", text: "text-accent" },
  "neural-networks": { dot: "bg-signal-rose", text: "text-signal-rose" },
  systems: { dot: "bg-signal-amber", text: "text-signal-amber" },
  theory: { dot: "bg-signal-blue", text: "text-signal-blue" },
};
