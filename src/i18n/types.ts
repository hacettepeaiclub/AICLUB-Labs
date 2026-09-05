import type { en } from "./en";

/**
 * The shape every dictionary must have, derived from the English one.
 *
 * English is the source of truth: adding a key there makes `tr.ts` fail to
 * compile until it is translated, and removing one makes the leftover
 * translation an excess-property error. Interpolated strings are functions, so
 * their argument types are checked too — a translator cannot quietly drop a
 * count or swap two parameters.
 */
export type Translation = typeof en;
