import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { LabSignature } from "@/components/home/LabSignature";
import { MarkField } from "@/components/home/MarkField";
import { useDocumentHead } from "@/app/useDocumentHead";
import { homeMeta } from "@/app/siteMeta";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_CODE, CATEGORY_VAR, type LabCategory, type LabMeta } from "@/labs/types";
import { orderedLabs } from "@/labs/registry";
import { readVisits } from "@/labs/visits";

/**
 * The home page.
 *
 * ## What it is trying to do
 *
 * Say what this is, and then get out of the way. The whole collection — every
 * lab, no curation, no path — still starts on the first screen, because the
 * fastest way to explain a laboratory is to show what is in it.
 *
 * ## The hero, and why it is allowed back
 *
 * The page once had no hero visual at all: an earlier one, a live insertion
 * sort, argued for one lab from the position that speaks for all of them and
 * pushed the grid below the fold. The mark that stands beside the headline now
 * does neither. It is the club's own logo, assembled from points, so it speaks
 * for the whole collection rather than one lab; and it sits *beside* the copy,
 * in a hero kept short enough that the first row of labs is still in view on a
 * laptop. The headline stays the largest thing on the page.
 *
 * ## The field filter, and why it reorders instead of dimming
 *
 * Picking a field lights its chip and the frames of its labs in the field's
 * colour, and moves them to the front. The rest follow under their own
 * heading at full strength. Dimming them was tried first: a card at a quarter
 * opacity is unreadable and still clickable, which reads as "disabled" and is
 * not. Picking the same field again, or "All", puts the collection back in its
 * written order.
 *
 * ## What it remembers
 *
 * Which labs this browser has opened, and the last one. That is the only thing
 * a returning visitor to a collection really wants — "what have I tried, and
 * where was I" — and it needs no account: see `labs/visits.ts`.
 *
 * ## What it deliberately does not contain
 *
 * No team, commissions, events, partnerships, testimonials or membership
 * pitch. Those belong to hacettepeaiclub.com, which is the community's site;
 * this is the community's laboratory. The primary action here is never "join"
 * — it is "open a lab".
 */
export function HomePage() {
  const t = useT();
  const copy = t.home;
  useDocumentHead(homeMeta(copy.lede));
  const labs = orderedLabs();
  const artRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [field, setField] = useState<LabCategory | null>(null);
  // Read once: the page reflects the visits made before it opened.
  const [visits] = useState(readVisits);

  const fields = [...new Set(labs.map((lab) => lab.meta.category))];
  const matching = field ? labs.filter((lab) => lab.meta.category === field) : labs;
  const others = field ? labs.filter((lab) => lab.meta.category !== field) : [];
  const last = labs.find((lab) => lab.meta.slug === visits.last);

  // A touch screen has no hover, so each drawing plays its gesture once, as
  // its card comes into view. Re-armed whenever the grid is re-ordered,
  // because re-ordering remounts the cards.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !window.matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("sig-play");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.6 },
    );
    grid.querySelectorAll(".lab-card").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [field]);

  const pick = (next: LabCategory | null) => {
    setField((current) => (current === next ? null : next));
    // On a phone the chips and the results are a screen apart: bring the
    // results up so the change is seen.
    if (window.matchMedia("(max-width: 767px)").matches) {
      requestAnimationFrame(() => gridRef.current?.scrollIntoView({ block: "start" }));
    }
  };

  let order = 0;
  const tile = (meta: LabMeta, lit: boolean) => (
    // Keyed by the field too, so re-ordering remounts the cards and they rise in again.
    <li
      key={`${field ?? "all"}:${meta.slug}`}
      className="lab-rise flex"
      style={{ "--i": order++ } as CSSProperties}
    >
      <LabTile meta={meta} lit={lit} visited={visits.visited.has(meta.slug)} />
    </li>
  );

  return (
    <div>
      {/* ---------------------------------------------------------- hero -- */}
      <section aria-labelledby="home-title" className="relative border-b border-line/10">
        <MarkField targetRef={artRef} />
        <div className="shell relative grid items-center gap-2 pb-8 pt-6 md:min-h-[min(62vh,34rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-8 md:py-14">
          <div>
            <p className="font-mono text-caption uppercase tracking-[0.14em] text-fg-muted">
              <span className="font-semibold text-data">{copy.labCount(labs.length)}</span>
              {" · "}
              {t.shell.parentOrg}
            </p>
            <h1 id="home-title" className="mt-4 max-w-[19ch] font-display text-display-lg text-fg">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-[48ch] text-body-lg text-fg-muted">{copy.lede}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href="#labs"
                className="inline-flex min-h-11 items-center gap-2.5 rounded border border-line/15 bg-ink-800/60 px-4
                  font-mono text-caption uppercase tracking-[0.16em] text-fg transition-[border-color,box-shadow]
                  duration-base hover:border-data/70 hover:shadow-[0_0_22px_-8px_rgb(var(--data)/0.7)]"
              >
                {copy.browse}
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden
                >
                  <path d="M6 1v12M1 8l5 5 5-5" />
                </svg>
              </a>
              {last && (
                <Link
                  to={`/labs/${last.meta.slug}`}
                  className="rounded py-2 text-body-sm text-fg-muted transition-colors duration-fast hover:text-fg"
                >
                  <ContinueLabel
                    slug={last.meta.slug}
                    fallback={last.meta.title}
                    format={copy.continueLab}
                  />
                </Link>
              )}
            </div>
          </div>
          {/* The box the mark assembles into. Above the copy on a phone. */}
          <div
            ref={artRef}
            aria-hidden
            className="order-first h-32 md:order-none md:h-[min(46vh,23rem)]"
          />
        </div>
      </section>

      {/* ---------------------------------------------------------- labs -- */}
      <section
        aria-labelledby="labs-heading"
        id="labs"
        className="shell mt-8 scroll-mt-24 md:mt-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <h2 id="labs-heading" className="font-display text-display-md text-fg">
            {copy.labs}
          </h2>
          <p
            className="font-mono text-caption uppercase tracking-[0.12em] text-fg-faint"
            aria-live="polite"
          >
            {field
              ? copy.showing(matching.length, labs.length, t.category[field])
              : copy.labCount(labs.length)}
          </p>
        </div>

        {labs.length === 0 ? (
          <div className="mt-6 rounded border border-line/10 px-6 py-16 text-center">
            <p className="text-title text-fg">{copy.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-body-sm text-fg-muted">{copy.emptyBody}</p>
          </div>
        ) : (
          <>
            <div
              role="group"
              aria-label={copy.filterLabel}
              className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1.5 pt-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            >
              <FieldChip
                pressed={field === null}
                onClick={() => pick(null)}
                label={copy.allFields}
                count={labs.length}
              />
              {fields.map((category) => (
                <FieldChip
                  key={category}
                  pressed={field === category}
                  onClick={() => pick(category)}
                  label={t.category[category]}
                  count={labs.filter((lab) => lab.meta.category === category).length}
                  colour={CATEGORY_VAR[category]}
                />
              ))}
            </div>

            <ul
              ref={gridRef}
              className="mt-5 grid scroll-mt-40 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {matching.map((lab) => tile(lab.meta, field !== null))}
              {others.length > 0 && (
                <li
                  className="lab-rise col-span-full flex items-center gap-3.5 pt-4 font-mono text-caption uppercase tracking-[0.14em] text-fg-faint after:h-px after:flex-1 after:bg-line/10"
                  style={{ "--i": order++ } as CSSProperties}
                >
                  {copy.otherLabs}
                </li>
              )}
              {others.map((lab) => tile(lab.meta, false))}
            </ul>
          </>
        )}
      </section>

      <Marquee
        items={[
          t.shell.parentOrg,
          ...fields.map((category) => t.category[category]),
          t.shell.hashtag,
        ]}
      />
    </div>
  );
}

/**
 * A strip under the collection: the club, its fields and its hashtag,
 * drifting sideways. Decoration, so hidden from assistive technology, and
 * still under reduced motion. The run is written four times and the loop
 * slides by exactly half, so it is seamless and never runs out of text on a
 * wide screen.
 */
function Marquee({ items }: { items: string[] }) {
  const run = items.map((item, i) => (
    <span key={i}>
      <span className={i % 2 === 0 ? "text-fg" : undefined}>{item}</span>
      <span className="px-4 text-fg-faint">·</span>
    </span>
  ));
  return (
    <div
      aria-hidden
      className="mt-20 overflow-hidden whitespace-nowrap border-y border-line/10 py-4 font-mono text-body-sm uppercase tracking-[0.12em] text-fg-muted"
    >
      <div className="marquee-track">
        {run}
        {run}
        {run}
        {run}
      </div>
    </div>
  );
}

/** The last-opened lab's title in the current language. */
function ContinueLabel({
  slug,
  fallback,
  format,
}: {
  slug: string;
  fallback: string;
  format: (title: string) => string;
}) {
  const copy = useLabMeta(slug);
  return (
    <>
      {format(copy?.title ?? fallback)} <span aria-hidden>→</span>
    </>
  );
}

/**
 * One field in the filter. Pressing it locks its frame in the field's colour,
 * with a brief brighter flash as it locks — the only emphasis on the page that
 * is not a lab's own drawing.
 */
function FieldChip({
  pressed,
  onClick,
  label,
  count,
  colour,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  count: number;
  colour?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="field-chip"
      style={{ "--c": colour ?? "var(--fg)" } as CSSProperties}
    >
      {colour && (
        <span aria-hidden className="size-[7px] shrink-0 rounded-pill bg-[rgb(var(--c))]" />
      )}
      {label}
      <span className="field-chip-count font-mono text-caption text-fg-faint">{count}</span>
    </button>
  );
}

/**
 * One lab, as an instrument on a shelf rather than a marketing card.
 *
 * Title first, then what you will do, then the field. The frame has corner
 * brackets that lengthen and take the field's colour on hover; when the lab's
 * field is picked in the filter, they stay lit.
 */
function LabTile({ meta, lit, visited }: { meta: LabMeta; lit: boolean; visited: boolean }) {
  const t = useT();
  const copy = useLabMeta(meta.slug);
  return (
    <Link
      to={`/labs/${meta.slug}`}
      className={cn("lab-card group", lit && "is-lit")}
      style={{ "--c": CATEGORY_VAR[meta.category] } as CSSProperties}
      onPointerEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
    >
      <div className="relative grid h-36 place-items-center overflow-hidden border border-line/5 bg-ink-950">
        <span className="absolute left-2.5 top-2.5 border border-line/10 bg-ink-950/80 px-1.5 py-1 font-mono text-caption uppercase tracking-[0.12em] text-[rgb(var(--c))]">
          {CATEGORY_CODE[meta.category]}
        </span>
        {visited && (
          <span className="absolute right-2.5 top-2.5 flex items-center gap-1.5 font-mono text-caption uppercase tracking-[0.12em] text-fg-muted">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-data"
              aria-hidden
            >
              <path d="M2 6.5l2.5 2.5L10 3.5" />
            </svg>
            {t.home.visited}
          </span>
        )}
        <LabSignature
          slug={meta.slug}
          className="h-[70%] w-[62%] opacity-80 transition duration-slow ease-out-expo group-hover:scale-105 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-0.5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-display text-title text-fg">{copy?.title ?? meta.title}</h3>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden
            className="mt-1 shrink-0 text-fg-faint transition duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[rgb(var(--c))]"
          >
            <path d="M4 12L12 4M5.5 4H12v6.5" />
          </svg>
        </div>
        <p className="mt-1.5 flex-1 text-body-sm text-fg-muted">
          {copy?.description ?? meta.description}
        </p>
        <p className="mt-3.5 flex items-center gap-2 text-caption text-fg-muted">
          <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-[rgb(var(--c))]" />
          {t.category[meta.category]}
        </p>
      </div>
    </Link>
  );
}
