import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion system.
 *
 * Rules (see docs/GUIDELINES.md):
 * - Motion explains, it never decorates. Every animation should communicate
 *   causality, hierarchy, or state.
 * - UI chrome uses `spring.snappy` or `ease.out`; educational simulations may
 *   run their own clocks (useRafLoop) but UI around them stays on this system.
 * - Always pair entrance variants with `useReducedMotion` — the variants below
 *   already degrade to opacity-only when `reduced` is passed.
 */

/** Durations in seconds — keep UI under 0.45s. */
export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

/** Easing curves matching the CSS tokens in tailwind.config.ts. */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  outBack: [0.34, 1.56, 0.64, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Springs for interactive elements (hover, press, drag). */
export const spring = {
  /** Buttons, toggles, small UI. */
  snappy: { type: "spring", stiffness: 500, damping: 32, mass: 0.8 } satisfies Transition,
  /** Cards, panels, layout shifts. */
  smooth: { type: "spring", stiffness: 260, damping: 30 } satisfies Transition,
  /** Playful emphasis (badges, success states). */
  bouncy: { type: "spring", stiffness: 400, damping: 18 } satisfies Transition,
} as const;

/** Standard entrance: fade + 12px rise. Pass `reduced` from useReducedMotion. */
export const fadeUp = (reduced: boolean | null = false): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
});

/** Simple fade for reduced-motion fallbacks and overlays. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base } },
};

/** Parent container that staggers its children's entrances. */
export const staggerChildren = (staggerSec = 0.06): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerSec } },
});

/** Page-level transition used by the router shell. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};

/** Hover/press treatment for interactive cards. */
export const cardInteraction = {
  whileHover: { y: -4, transition: spring.smooth },
  whileTap: { scale: 0.985, transition: spring.snappy },
} as const;
