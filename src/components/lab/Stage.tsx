import type { ReactNode } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

/**
 * One interactive unit: the thing being computed, the controls that change it,
 * and the numbers it produced — as a single object.
 *
 * ## Why this exists
 *
 * Before this, a lab section was five separate things stacked down the page:
 * a bordered canvas, a bare legend, a bare caption, a bare paragraph of help,
 * and — somewhere off to the right — a panel of controls with its own border
 * and its own shadow. Nothing said they belonged together, and below the `lg`
 * breakpoint they simply queued up, so on a phone you scrolled past the
 * canvas, the legend, the caption and the help before reaching the button that
 * made anything happen. You would press Run with the grid off-screen above
 * you.
 *
 * That is not a styling problem. In a collection whose whole claim is that the
 * interaction is the lesson, a control you cannot see next to what it changes
 * has stopped teaching.
 *
 * So: one chassis, a recessed screen, and the controls on the same object.
 *
 *   >= lg   viewport left, an 18rem rail on the right
 *   <  lg   viewport, then the primary control, then the figures, then
 *           everything else behind a disclosure
 *
 * The mobile order is the argument: cause and effect stay in one screen, and
 * the things you need less often stop pushing them apart.
 *
 * ## What it deliberately does not do
 *
 * It knows nothing about any lab. It draws nothing, owns no state, and has no
 * opinion about what a viewport contains — `viewport` is a slot, and the lab's
 * own component keeps its canvas, its ARIA and its keyboard handling. There is
 * no challenge slot and no metrics component: what a lab counts, and whether
 * it sets a task at all, is the lab's business.
 *
 * The one thing it does own is the live region, because every stage needs
 * exactly one and they were drifting.
 */

/**
 * Stages are not all the same size, and pretending otherwise was making narrow
 * labs look thin and wide ones look cramped. Three widths, named for what they
 * hold rather than for a number.
 */
export type StageWidth = "column" | "wide" | "full";

const WIDTH: Record<StageWidth, string> = {
  /** A sentence, a small diagram, a list. */
  column: "max-w-[44rem]",
  /** The default: a chart or a grid with a rail beside it. */
  wide: "max-w-[56rem]",
  /** Only when the extra pixels are the point. */
  full: "max-w-shell",
};

export interface StageProps {
  /** The lab's own visualization, with its own surface, ARIA and keyboard. */
  viewport: ReactNode;
  /**
   * The one control this stage is about. Stays visible at every width — on a
   * phone it sits directly under the viewport. One per stage.
   */
  primary: ReactNode;
  /** Pickers, tools, help. In the rail on desktop, behind a disclosure below `lg`. */
  secondary?: ReactNode;
  /** What the run produced. Rendered bare — the chassis is already the panel. */
  figures?: ReactNode;
  /** A strip under the viewport: a legend, a readout, a hovered coordinate. */
  readout?: ReactNode;
  /** One line under the stage. Behaviour first, names later. */
  caption?: ReactNode;
  /** Announced once per meaningful transition. The stage owns the live region. */
  announcement?: string;
  /** Names what the disclosure holds. Never "Advanced", never a gear icon. */
  secondaryLabel?: string;
  width?: StageWidth;
  className?: string;
}

export function Stage({
  viewport,
  primary,
  secondary,
  figures,
  readout,
  caption,
  announcement,
  secondaryLabel,
  width = "wide",
  className,
}: StageProps) {
  const t = useT();

  return (
    <div className={cn("mx-auto", WIDTH[width], className)}>
      {/* The chassis. A hairline, no shadow: this houses a measurement, it is
          not a card that wants to be clicked. */}
      <div className="rounded-card border border-line/10 bg-ink-800 p-3 md:p-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-4">
          {/* ------------------------------------------------ the screen -- */}
          <div className="min-w-0 space-y-2">
            {viewport}
            {readout}
          </div>

          {/* ----------------------------------------------- the controls -- */}
          <div
            role="group"
            aria-label={t.common.controlsLabel}
            className="mt-3 space-y-3 lg:mt-0 lg:flex lg:flex-col lg:gap-3 lg:space-y-0"
          >
            {/* One reading order at every width: the control you press, then
                what it produced, then the things you touch less often. An
                earlier version reordered the rail on desktop so the pickers sat
                above the buttons, which put "Clear" at the top of the column —
                a destructive action in the most prominent position, with the
                Run button pushed below a paragraph of keyboard help. */}
            <div>{primary}</div>

            {figures && (
              <div className="flex flex-wrap items-start gap-x-8 gap-y-3">{figures}</div>
            )}

            {secondary && (
              <>
                {/* Below lg: a real <details>. No JS, no ARIA to get wrong,
                    and the browser's own disclosure semantics. */}
                <details className="group rounded border border-line/10 lg:hidden">
                  <summary
                    className="flex min-h-[44px] cursor-pointer select-none items-center justify-between
                      gap-2 px-3 text-body-sm text-fg-muted transition-colors duration-fast
                      hover:text-fg focus-visible:text-fg"
                  >
                    {secondaryLabel ?? t.common.moreControls}
                    <span aria-hidden className="text-fg-faint group-open:hidden">
                      +
                    </span>
                    <span aria-hidden className="hidden text-fg-faint group-open:inline">
                      −
                    </span>
                  </summary>
                  <div className="space-y-3 border-t border-line/10 p-3">{secondary}</div>
                </details>

                {/* At lg and up there is room for all of it, so nothing hides. */}
                <div className="hidden space-y-3 lg:block">{secondary}</div>
              </>
            )}
          </div>
        </div>
      </div>

      {caption && <p className="mt-3 max-w-prose text-body-sm text-fg-muted">{caption}</p>}

      {announcement !== undefined && (
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      )}
    </div>
  );
}
