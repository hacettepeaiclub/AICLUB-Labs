import type { ReactNode } from "react";
import { useT } from "@/i18n";

export interface LabRecapProps {
  /** One line per takeaway. */
  lessons: readonly string[];
  /** Closing note under the list — a parting thought, not a summary. */
  footer?: ReactNode;
  /** Override only if the default heading doesn't fit the lab's voice. */
  title?: string;
}

/**
 * Closing checklist — the takeaways.
 *
 * The lines used to arrive one at a time on a stagger as the block scrolled
 * into view. See the note in `LabSection`: scroll-triggered entrance is a
 * marketing gesture, and it was the last of it left in the lab chrome. The
 * takeaways are now simply there, which is also how someone re-reading them
 * wants to find them.
 *
 * No shadow either. This is the end of a page, not a card floating above one.
 */
export function LabRecap({ lessons, footer, title }: LabRecapProps) {
  const t = useT();
  const heading = title ?? t.common.recapTitle;

  return (
    <div className="rounded-card border border-line/10 bg-ink-800 p-6 md:p-10">
      <h3 className="text-display-md text-fg">{heading}</h3>
      <ul className="mt-6 space-y-3">
        {lessons.map((lesson) => (
          <li key={lesson} className="flex items-start gap-3 text-body text-fg-muted">
            <span
              aria-hidden
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill bg-signal-green/15 text-caption text-signal-green"
            >
              ✓
            </span>
            {lesson}
          </li>
        ))}
      </ul>
      {footer && <p className="mt-8 text-body-sm text-fg-faint">{footer}</p>}
    </div>
  );
}
