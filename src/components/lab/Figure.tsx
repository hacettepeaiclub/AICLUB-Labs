import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks";
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
 * Accent is the collection's "this is the one" mark, so that is where the
 * changed digits go. A figure already wearing accent has nowhere brighter to go, so it
 * swaps to the plain foreground instead: the same gesture, in the other
 * direction. Colour only — nothing here changes size, weight or spacing, and
 * the figures are tabular, so a row cannot reflow while digits are marked.
 */
const emphasisClass: Record<FigureTone, string> = {
  default: "text-accent",
  accent: "text-fg",
  muted: "text-accent",
};

/**
 * The characters of `next` that differ from `previous`, as `[start, end)`.
 *
 * The span runs from the first character that changed to the last one, so it
 * is the part of the number that moved and nothing either side of it: going
 * from 0.4982 to 0.4931 it is "31", and from 64.0% to 64.5% it is "5" — the
 * percent sign did not change and is not marked. Where in the number the span
 * starts is the size of the change, read straight off the page: a loss whose
 * last two digits keep lighting up is converging, and one whose first digit
 * lit up just jumped.
 *
 * A change of length — 9.99 to 10.0 — marks the whole value, because every
 * digit is now in a different place and none of them is "the same one".
 */
export function changedRange(previous: string, next: string): [number, number] | null {
  if (previous === next) return null;
  if (previous.length !== next.length) return [0, next.length];
  let start = 0;
  while (start < next.length && previous[start] === next[start]) start++;
  let end = next.length;
  while (end > start && previous[end - 1] === next[end - 1]) end--;
  return [start, end];
}

/**
 * Which part of `value` is wearing the mark, and whether it is wearing it now.
 *
 * The number itself is never animated. It is written the instant it arrives,
 * because the whole collection rests on the figure beside a picture being the
 * arithmetic rather than an impression of it, and a value easing toward its
 * target is a value that is briefly wrong. That rules out the rolling counter
 * a dashboard would use. What animates is which *digits* are wearing the
 * mark: the ones that just moved.
 *
 * It used to be the whole figure. Marking only the digits that changed says
 * the same thing — this number moved — and adds how far, without drawing a
 * single value that is not the real one.
 *
 * The mark arrives instantly and leaves slowly. That asymmetry is the point —
 * an ease *in* would make the change itself feel gradual, which is the thing
 * being avoided. The range outlives the mark so that the fade-out has
 * somewhere to happen: the span stays split where it was, and only its colour
 * goes back.
 */
function useChangeMark(value: string, reduced: boolean) {
  const [marked, setMarked] = useState(false);
  const [range, setRange] = useState<[number, number] | null>(null);
  const previous = useRef(value);

  useEffect(() => {
    const span = changedRange(previous.current, value);
    previous.current = value;
    if (!span) return;
    setRange(span);
    setMarked(true);

    // Reduced motion still gets to see *which* digits moved, it just does not
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

  // A range from an earlier, longer value must not reach past this one.
  const safe = range && range[1] <= value.length ? range : null;
  return { marked, range: safe };
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
  const { marked, range } = useChangeMark(value, reduced);

  return (
    <div className="min-w-0">
      <p className="text-overline uppercase text-fg-faint">{label}</p>
      <p className={cn("mt-1 font-mono text-title tabular-nums", toneClass[tone])}>
        {range ? (
          <>
            {value.slice(0, range[0])}
            <span
              className={cn(
                marked ? emphasisClass[tone] : toneClass[tone],
                // Only the way back is eased. While the mark is on,
                // transitions are off so it lands in one step.
                marked ? "transition-none" : !reduced && "transition-colors duration-slow",
              )}
            >
              {value.slice(range[0], range[1])}
            </span>
            {value.slice(range[1])}
          </>
        ) : (
          value
        )}
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
