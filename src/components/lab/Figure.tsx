import type { ReactNode } from "react";
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
  return (
    <div className="min-w-0">
      <p className="text-overline uppercase text-fg-faint">{label}</p>
      <p className={cn("mt-1 font-mono text-title tabular-nums", toneClass[tone])}>{value}</p>
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
