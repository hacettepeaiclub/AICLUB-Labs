import type { ReactNode } from "react";

export interface LabSectionProps {
  /** Short uppercase label above the heading, e.g. "The avalanche effect". */
  kicker?: string;
  title: string;
  /** Optional one-paragraph introduction between the heading and the content. */
  lede?: string;
  children: ReactNode;
}

/**
 * One chapter of a lab: heading, optional lede, then the interactive part.
 *
 * ## Why nothing animates any more
 *
 * Every section used to fade and rise as it scrolled into view. That is a
 * landing-page device: it draws the eye to *a block of content arriving*,
 * which is precisely the wrong thing to emphasise in an instrument. Worse, it
 * competed with the motion that matters — a frontier spreading, a bar
 * swapping, a point stepping downhill. When scrolling also produces movement,
 * movement stops meaning "something you did changed something".
 *
 * So motion in a lab is caused by the visitor or by the engine, or it does not
 * happen. The reduced-motion path is no longer a special case, because there
 * is nothing here to reduce.
 *
 * ## The kicker
 *
 * It is the section's question — "Why divide at all?", "The error nobody
 * counts" — and the heading beneath it is the answer's name. Thirty of them
 * were written, translated, and then never rendered; this component accepted
 * the prop and dropped it. They are rendered now, in the overline style the
 * rest of the collection uses for a label above a thing, so the pair reads as
 * one unit rather than as two headings. A section that supplies no kicker gets
 * no element at all: an empty overline would still take a line of space.
 */
export function LabSection({ kicker, title, lede, children }: LabSectionProps) {
  return (
    <section>
      {kicker && <p className="text-overline uppercase text-fg-faint">{kicker}</p>}
      <h2 className="mt-3 text-display-md text-fg">{title}</h2>
      {lede && <p className="mt-3 max-w-prose text-body text-fg-muted">{lede}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}
