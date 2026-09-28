/**
 * Shared motion system.
 *
 * ## Rules (see docs/GUIDELINES.md)
 *
 * - Motion explains, it never decorates. Every animation should communicate
 *   causality, hierarchy, or state.
 * - Chrome and UI motion is CSS: a class in `globals.css` with one of the
 *   curves below, so the `prefers-reduced-motion` block there clamps it
 *   without any component having to ask.
 * - Educational simulations run their own clocks (`useRafLoop`) and check
 *   `useReducedMotion` themselves, because a canvas is invisible to CSS.
 *
 * ## Why these are numbers and not variants
 *
 * This file used to export Framer Motion `Variants` — `fadeUp`, `pageTransition`,
 * a set of springs. Between them they drove one page fade and two verdict
 * banners, and cost 38 KB gzipped on the critical path of every visit. All
 * three are CSS keyframes now. What is left here is the vocabulary those
 * keyframes and the Tailwind tokens are written in, kept in one place so a
 * duration used in JS and the same duration used in a class cannot drift.
 */

/** Durations in seconds — keep UI under 0.45s. */
export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

/** Easing curves matching the CSS tokens in tailwind.config.ts. */
export const ease = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  outBack: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;
