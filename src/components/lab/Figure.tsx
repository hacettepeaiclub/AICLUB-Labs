import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { duration } from "@/design/motion";
import { cn } from "@/lib/cn";

export type FigureTone = "default" | "accent" | "muted";

export interface FigureProps {
  /** What is being counted. Rendered as an overline, so keep it to a word or two. */
  label: string;
  /** Already formatted — this component never decides how a number should read. */
  value: string;
  /** A short gloss under the number: what it counts, not what it means. */
  hint?: string;
  /**
   * `accent` marks the one figure a section is actually about. Use it for at
   * most one figure in a row, or it stops meaning anything.
   */
  tone?: FigureTone;
}

const toneClass: Record<FigureTone, string> = {
  default: "text-fg",
  accent: "text-accent",
  muted: "text-fg-muted",
};

/**
 * Where a figure sits for the moment after its value changes.
 *
 * Accent is the collection's "this is the one" mark, so that is where a figure
 * goes. A figure already wearing accent has nowhere brighter to go, so it
 * swaps to the plain foreground instead: the same gesture, in the other
 * direction. Colour only — nothing here changes size, weight or spacing, so a
 * row of figures cannot reflow while one of them is marked.
 */
const emphasisClass: Record<FigureTone, string> = {
  default: "text-accent",
  accent: "text-fg",
  muted: "text-accent",
};

/**
 * True for one beat after `value` changes.
 *
 * The number itself is never animated. It is written the instant it arrives,
 * because the whole collection rests on the figure beside a picture being the
 * arithmetic rather than an impression of it, and a value easing toward its
 * target is a value that is briefly wrong. What animates is which figure is
 * wearing the mark: the parameter you moved, and the number that moved with
 * it.
 *
 * The mark arrives instantly and leaves slowly. That asymmetry is the point —
 * an ease *in* would make the change itself feel gradual, which is the thing
 * being avoided.
 */
function useChangeMark(value: string, reduced: boolean): boolean {
  const [marked, setMarked] = useState(false);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    setMarked(true);

    // Reduced motion still gets to see *which* number moved, it just does not
    // get a fade: the mark is held for the same beat and then dropped in one
    // step. A colour swap is not movement, and removing it outright would cost
    // the signal without buying the visitor anything.
    if (reduced) {
      const timer = setTimeout(() => setMarked(false), duration.slow * 1000);
      return () => clearTimeout(timer);
    }

    // Two frames, not one: the browser has to paint the marked state before
    // the class comes off, or there is no previous colour to ease away from
    // and the transition never runs.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setMarked(false));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [value, reduced]);

  return marked;
}

/**
 * One headline number.
 *
 * Four labs had grown their own copy of this — identical markup, identical
 * intent — and they had already started to drift apart. It lives here so that
 * "explored", "comparisons", "tokens" and "loss" are visibly the same kind of
 * thing across the collection, because they are.
 *
 * Deliberately not a metrics *panel*: what a lab groups together, and what it
 * puts beside the numbers, is the lab's own business.
 */
export function Figure({ label, value, hint, tone = "default" }: FigureProps) {
  const reduced = useReducedMotion() ?? false;
  const marked = useChangeMark(value, reduced);

  return (
    <div className="min-w-0">
      <p className="text-overline uppercase text-fg-faint">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-title tabular-nums",
          marked ? emphasisClass[tone] : toneClass[tone],
          // Only the way back is eased. While the mark is on, transitions are
          // off so it lands in one step.
          marked ? "transition-none" : !reduced && "transition-colors duration-slow",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-caption text-fg-faint">{hint}</p>}
    </div>
  );
}

export interface FigureRowProps {
  children: ReactNode;
  /** Pulls trailing content — a legend, a sparkline — to the far end. */
  spread?: boolean;
  className?: string;
}

/** The standard panel a row of figures sits in. One padding, one rhythm. */
export function FigureRow({ children, spread, className }: FigureRowProps) {
  return (
    <div
      className={cn(
        "card-surface flex flex-wrap items-start gap-x-8 gap-y-4 p-5",
        spread && "justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}
