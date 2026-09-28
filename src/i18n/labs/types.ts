import type { enLabs } from "./en";

/**
 * The shape every lab dictionary must have, derived from the English one —
 * the same contract `Translation` enforces for the shell, applied to the prose
 * that now travels separately.
 */
export type LabsCopy = typeof enLabs;

/** A lab slug that has translated copy. */
export type LabSlug = keyof LabsCopy;
