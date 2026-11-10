import type { ReactNode } from "react";

export interface LabSectionProps {
  id?: string;
  /** Short uppercase label above the heading, e.g. "The avalanche effect". */
  kicker?: string;
  title: string;
  /** Optional one-paragraph introduction between the heading and the content. */
  lede?: string;
  children: ReactNode;
  /** Optional deeper investigation; contents stay mounted to preserve state. */
  deeper?: boolean;
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
export function LabSection({ id, kicker, title, lede, children, deeper = false }: LabSectionProps) {
  if (deeper)
    return (
      <details id={id} className="lab-section lab-deeper">
        <summary>
          <span className="text-overline uppercase text-accent">
            <span lang="en">Go deeper · Optional</span>
          </span>
          <h2 lang="en" className="mt-2 text-title font-semibold text-fg">
            {title}
          </h2>
          {kicker && (
            <p lang="en" className="mt-2 text-overline text-fg-faint">
              {kicker}
            </p>
          )}
        </summary>
        <div className="pt-5">
          {lede && <p className="mb-5 max-w-prose text-body text-fg-muted">{lede}</p>}
          {children}
        </div>
      </details>
    );
  return (
    <section id={id} className="lab-section">
      {kicker && (
        <p lang="en" className="text-overline uppercase text-fg-faint">
          {kicker}
        </p>
      )}
      <h2
        lang="en"
        className="mt-3 text-[clamp(1.375rem,2.5vw,1.75rem)] font-semibold leading-snug tracking-tight text-fg"
      >
        {title}
      </h2>
      {lede && <p className="mt-3 max-w-prose text-body text-fg-muted">{lede}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
