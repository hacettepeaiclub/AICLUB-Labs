import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useLabMeta, useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { nextLab, preloadLab } from "@/labs/registry";
import { CATEGORY_CODE, CATEGORY_VAR } from "@/labs/types";
import { LabSignature } from "./LabSignature";

/**
 * The way on, at the bottom of a lab.
 *
 * ## Why this exists
 *
 * The collection is written as an argument — `LAB_ORDER` runs from what a
 * function does to its input, through what an algorithm costs, to the machine
 * learning that stands on both — and that order was only ever visible on the
 * grid. Inside a lab, the page ended with its sources and then the footer. The
 * nearest link anywhere else was the breadcrumb at the top, six thousand
 * pixels up, so finishing a lab meant scrolling back past the whole of it.
 *
 * ## Why it looks like a card from the grid
 *
 * Because it is one. Same frame, same corner brackets, same drawing in the
 * same field colour, and the drawing plays its gesture on hover exactly as it
 * does on the home page. Someone who has seen the grid recognises what this is
 * without reading it.
 *
 * ## Why it starts the download when it scrolls into view
 *
 * Reaching the end of a lab is the strongest signal on the site that the next
 * one is about to be opened, and it arrives several seconds before the click.
 * The lab chunks are 20–36 KB; by the time the visitor has read the card, the
 * next lab is usually already in the cache.
 *
 * ## The last lab
 *
 * Has no next. The order is an argument with an end, and wrapping round to
 * the first lab would make it a loop, which says something different. It says
 * the collection is finished instead, and points back at the grid.
 */
export function LabNext({ slug }: { slug: string }) {
  const t = useT();
  const next = nextLab(slug);
  const copy = useLabMeta(next?.meta.slug ?? "");
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !next) return;
    const touch = window.matchMedia("(hover: none)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        preloadLab(next.meta.slug);
        // No hover on a touch screen, so the drawing plays its gesture once
        // as the card arrives — the same rule the home grid follows.
        if (touch) card.classList.add("sig-play");
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [next]);

  if (!next) {
    return (
      <nav
        aria-labelledby="lab-next-heading"
        className="mt-16 border-t border-line/10 pt-10 md:mt-24"
      >
        <p id="lab-next-heading" className="font-display text-title text-fg">
          {t.common.endOfCollection}
        </p>
        <p className="mt-2 max-w-prose text-body-sm text-fg-muted">
          {t.common.endOfCollectionBody}
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded border border-line/15 bg-ink-800/60 px-4
            font-mono text-caption uppercase tracking-[0.16em] text-fg transition-[border-color] duration-base
            hover:border-line/40"
        >
          <span aria-hidden>←</span>
          {t.common.backToCollection}
        </Link>
      </nav>
    );
  }

  const { meta } = next;
  return (
    <nav aria-labelledby="lab-next-heading" className="mt-16 md:mt-24">
      <p
        id="lab-next-heading"
        className="mb-3 flex items-center gap-3.5 font-mono text-caption uppercase tracking-[0.14em] text-fg-faint
          after:h-px after:flex-1 after:bg-line/10"
      >
        {t.common.nextLab}
      </p>
      <Link
        ref={cardRef}
        to={`/labs/${meta.slug}`}
        className="lab-card group gap-4 sm:flex-row sm:items-stretch"
        style={{ "--c": CATEGORY_VAR[meta.category] } as CSSProperties}
        onPointerEnter={() => preloadLab(meta.slug)}
        onFocus={() => preloadLab(meta.slug)}
      >
        <div
          className="relative grid h-36 shrink-0 place-items-center overflow-hidden border border-line/5 bg-ink-950
            sm:h-auto sm:min-h-36 sm:w-60"
        >
          <span
            className="absolute left-2.5 top-2.5 border border-line/10 bg-ink-950/80 px-1.5 py-1 font-mono
              text-caption uppercase tracking-[0.12em] text-[rgb(var(--c))]"
          >
            {CATEGORY_CODE[meta.category]}
          </span>
          <LabSignature
            slug={meta.slug}
            className="h-[70%] w-[62%] opacity-80 transition duration-slow ease-out-expo group-hover:scale-105
              group-hover:opacity-100"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center px-1 pb-0.5 sm:py-2">
          {copy?.term && (
            <p className="mb-1 text-overline uppercase text-fg-faint">{copy.term}</p>
          )}
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 font-display text-display-md text-fg">
              {copy?.title ?? meta.title}
            </p>
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden
              className={cn(
                "mt-1.5 shrink-0 text-fg-faint transition duration-base",
                "group-hover:translate-x-1 group-hover:text-[rgb(var(--c))]",
              )}
            >
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </div>
          <p className="mt-2 max-w-prose text-body text-fg-muted">
            {copy?.description ?? meta.description}
          </p>
        </div>
      </Link>
    </nav>
  );
}
