import { Link } from "react-router-dom";
import { Badge } from "@/components/ui";
import { LabSignature } from "@/components/home/LabSignature";
import { SortingPreview } from "@/components/home/SortingPreview";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_STYLE, type LabMeta } from "@/labs/types";
import { labsByDifficulty, startHereLabs } from "@/labs/registry";

/**
 * The home page.
 *
 * ## What it is trying to do
 *
 * Convince someone in a few seconds that this is a place where systems run and
 * respond, not a place that describes systems. The previous version made the
 * opposite case by accident: five lines of 72px type, then a grid of text
 * cards, nothing on the page moving or computing. A platform whose thesis is
 * "the interaction IS the lesson" had a shop window made entirely of prose.
 *
 * So the first screen carries one claim, one sentence, one button — and beside
 * them a real insertion sort, actually sorting. The evidence is on screen
 * before the argument is finished.
 *
 * ## What it deliberately does not contain
 *
 * No team, commissions, events, partnerships, testimonials or membership
 * pitch. Those belong to hacettepeaiclub.com, which is the community's site;
 * this is the community's laboratory. The only link back is one line in the
 * footer. The primary action here is never "join" — it is "open a lab".
 *
 * ## Order
 *
 * The grid reads gentlest-first (`labsByDifficulty`) rather than newest-first,
 * which used to put the hardest lab in slot one and the three-minute
 * introduction in slot nine.
 */
export function HomePage() {
  const t = useT();
  const copy = t.home;
  const starters = startHereLabs();
  const all = labsByDifficulty();
  const first = starters[0] ?? all[0];

  return (
    <div className="shell pb-24 pt-10 md:pt-16">
      {/* ---------------------------------------------------------- hero -- */}
      <section
        aria-labelledby="home-title"
        className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14"
      >
        <div>
          <p className="text-overline uppercase text-accent">{copy.kicker}</p>
          <h1
            id="home-title"
            className="mt-4 max-w-[18ch] font-display text-display-lg text-fg lg:text-display-xl"
          >
            {copy.title}
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-fg-muted">{copy.lede}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            {first && (
              <Link
                to={`/labs/${first.meta.slug}`}
                className="inline-flex min-h-[44px] items-center rounded border border-accent/50 bg-accent-fill
                  px-5 text-body-sm font-semibold text-accent-fg transition-colors duration-fast
                  hover:border-accent hover:bg-accent-fill/85"
              >
                {copy.cta}
              </Link>
            )}
            <a
              href="#all-labs"
              className="inline-flex min-h-[44px] items-center text-body-sm text-fg-muted
                underline-offset-4 hover:text-fg hover:underline"
            >
              {copy.ctaSecondary(all.length)}
            </a>
          </div>
        </div>

        {/* Not a picture of a lab — a lab. See SortingPreview. */}
        <figure className="min-w-0">
          <div className="h-48 rounded border border-line/10 bg-ink-900 p-4 sm:h-56">
            <SortingPreview label={copy.previewAlt} />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-fg-faint">
            <span className="size-1.5 rounded-pill bg-data" aria-hidden />
            {copy.previewCaption}
          </figcaption>
        </figure>
      </section>

      {/* ---------------------------------------------------- start here -- */}
      {starters.length > 0 && (
        <section aria-labelledby="start-here" className="mt-20 md:mt-28">
          <div className="flex items-baseline justify-between gap-4 border-b border-line/10 pb-3">
            <h2 id="start-here" className="font-display text-title text-fg">
              {copy.startHere}
            </h2>
            <p className="text-caption text-fg-faint">{copy.startHereHint}</p>
          </div>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {starters.map((lab, index) => (
              <li key={lab.meta.slug}>
                <LabTile meta={lab.meta} step={index + 1} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ------------------------------------------------------ all labs -- */}
      <section aria-labelledby="all-labs-heading" className="mt-20 scroll-mt-24 md:mt-28" id="all-labs">
        <div className="flex items-baseline justify-between gap-4 border-b border-line/10 pb-3">
          <h2 id="all-labs-heading" className="font-display text-title text-fg">
            {copy.allLabs}
          </h2>
          <p className="text-caption tabular-nums text-fg-faint">{copy.labCount(all.length)}</p>
        </div>

        {all.length === 0 ? (
          <div className="mt-6 rounded border border-line/10 px-6 py-16 text-center">
            <p className="text-title text-fg">{copy.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-body-sm text-fg-muted">{copy.emptyBody}</p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((lab) => (
              <li key={lab.meta.slug}>
                <LabTile meta={lab.meta} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/**
 * One lab, as a module rather than a marketing card.
 *
 * Hairline border, no shadow, no lift on hover: the accent rule along the top
 * edge is what responds, which keeps the motion tied to "this is the one you
 * are pointing at" instead of decorating the whole tile.
 */
function LabTile({ meta, step }: { meta: LabMeta; step?: number }) {
  const t = useT();
  const copy = useLabMeta(meta.slug);
  const category = CATEGORY_STYLE[meta.category];

  return (
    <Link
      to={`/labs/${meta.slug}`}
      className="group flex h-full flex-col rounded border border-line/10 bg-ink-800/60 p-5
        transition-colors duration-fast hover:border-accent/40 hover:bg-ink-800
        focus-visible:border-accent/60"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {step !== undefined && (
            <span className="mb-1 block font-mono text-caption tabular-nums text-accent">
              {String(step).padStart(2, "0")}
            </span>
          )}
          <h3 className="font-display text-body-lg font-semibold text-fg">
            {copy?.title ?? meta.title}
          </h3>
        </div>
        <LabSignature slug={meta.slug} className="h-10 w-16 shrink-0 opacity-70 transition-opacity duration-fast group-hover:opacity-100" />
      </div>

      <p className="mt-2 flex-1 text-body-sm text-fg-muted">{copy?.description ?? meta.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge dotClassName={category.dot}>{t.category[meta.category]}</Badge>
        <Badge>{t.difficulty[meta.difficulty]}</Badge>
        <Badge>{t.shell.minutes(meta.minutes)}</Badge>
      </div>
    </Link>
  );
}
