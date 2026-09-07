import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { LabSignature } from "@/components/home/LabSignature";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_STYLE, type LabMeta } from "@/labs/types";
import { orderedLabs } from "@/labs/registry";

/**
 * The home page.
 *
 * ## What it is trying to do
 *
 * Say what this is in three lines, and then get out of the way. The whole
 * collection — all nine labs, no curation, no path, no second click — starts
 * within a screen of the top, because the fastest way to explain a laboratory
 * is to show what is in it.
 *
 * ## Why there is no button
 *
 * There was a "Start experimenting" CTA under the lede, pointing at the first
 * lab. It made sense while the collection was somewhere else; now the
 * collection is directly below it, and a button whose destination is already
 * on screen is a step invented for the sake of having one. Removing it also
 * removes the question it forced — *which* lab does the big button pick? —
 * which the page had no honest answer to. Nine cards, nine actions.
 *
 * ## Why there is no hero visual
 *
 * There was one: a real insertion sort, running the actual `sorting-race`
 * engine beside the headline. It was honest and it was the right instinct —
 * prove the claim rather than assert it — but it argued for one lab from the
 * position that speaks for all nine, and it pushed the collection below the
 * fold on every laptop. A picture of one instrument is a worse advertisement
 * for a laboratory than the shelf of instruments itself.
 *
 * Nothing replaces it. No illustration, no abstract artwork, no ambient
 * animation: the identity here is the type, the spacing, and the nine
 * signatures in the grid, which are drawings of the systems themselves.
 *
 * ## What it deliberately does not contain
 *
 * No team, commissions, events, partnerships, testimonials or membership
 * pitch. Those belong to hacettepeaiclub.com, which is the community's site;
 * this is the community's laboratory. The only link back is one line in the
 * footer. The primary action here is never "join" — it is "open a lab".
 */
export function HomePage() {
  const t = useT();
  const copy = t.home;
  const labs = orderedLabs();

  return (
    <div className="shell pb-24 pt-8 md:pt-12">
      {/* ---------------------------------------------------------- hero -- */}
      <section aria-labelledby="home-title">
        <p className="text-overline uppercase text-accent">{copy.kicker}</p>
        {/*
          `display-lg`, not `display-xl`. The headline names both fields out
          loud, which costs it length; at 72px that is four lines and half a
          laptop screen before a single lab is visible. At this size it sets in
          two or three and the grid starts where it should.
        */}
        <h1
          id="home-title"
          className="mt-3 max-w-[26ch] font-display text-display-lg text-fg"
        >
          {copy.title}
        </h1>
        <p className="mt-4 max-w-prose text-body-lg text-fg-muted">{copy.lede}</p>
      </section>

      {/* ---------------------------------------------------------- labs -- */}
      <section aria-labelledby="labs-heading" className="mt-14 scroll-mt-24 md:mt-16" id="labs">
        <div className="flex items-baseline justify-between gap-4 border-b border-line/10 pb-3">
          <h2 id="labs-heading" className="font-display text-title text-fg">
            {copy.labs}
          </h2>
          <p className="text-caption tabular-nums text-fg-faint">{copy.labCount(labs.length)}</p>
        </div>

        {labs.length === 0 ? (
          <div className="mt-6 rounded border border-line/10 px-6 py-16 text-center">
            <p className="text-title text-fg">{copy.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-body-sm text-fg-muted">{copy.emptyBody}</p>
          </div>
        ) : (
          /* Three columns and three rows at desktop — the whole collection at
             once. No pagination, no tabs, no "show more": nine is a number a
             page can simply hold. */
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
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
 * One lab, as an instrument on a shelf rather than a marketing card.
 *
 * Hairline border, no shadow, no lift on hover: the border and the signature
 * are what respond, which keeps the motion tied to "this is the one you are
 * pointing at" instead of decorating the whole tile.
 */
function LabTile({ meta }: { meta: LabMeta }) {
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
        <h3 className="min-w-0 font-display text-body-lg font-semibold text-fg">
          {copy?.title ?? meta.title}
        </h3>
        <LabSignature
          slug={meta.slug}
          className="h-10 w-16 shrink-0 opacity-70 transition-opacity duration-fast group-hover:opacity-100"
        />
      </div>

      <p className="mt-2 flex-1 text-body-sm text-fg-muted">{copy?.description ?? meta.description}</p>

      {/*
        One line, and it stays one line.

        This row used to be three chips — category, difficulty, duration — and
        on eight of the nine tiles the third one wrapped, orphaning "6 min"
        below the others. The cards then disagreed about their own height and
        the grid lost its rhythm over a number nobody picks a lab by. Chips
        could not promise a single line even at two: each one is a box with its
        own padding, so the row can only respond to pressure by breaking.

        Text can. The metadata takes whatever room is left and truncates rather
        than wrapping; the open action never shrinks. The duration still lives
        on the lab itself (LabShell), where it is a decision.

        Below `sm` the two stack instead of sharing a line. Measured at 360px,
        "Machine Learning · intermediate" and "Open lab →" want 271px of a
        272px card, and the metadata was losing its last word to the ellipsis —
        a truncated category is worse than a second line, and stacked they are
        still the same two fixed-height rows on all nine cards.
      */}
      <div
        className="mt-4 flex flex-col items-start gap-1 text-caption
          sm:flex-row sm:items-center sm:justify-between sm:gap-3"
      >
        <span className="flex w-full min-w-0 items-center gap-2 text-fg-muted sm:w-auto">
          <span aria-hidden className={cn("size-1.5 shrink-0 rounded-pill", category.dot)} />
          <span className="truncate">
            {t.category[meta.category]} · {t.difficulty[meta.difficulty]}
          </span>
        </span>
        <span className="shrink-0 font-medium text-fg-faint transition-colors duration-fast group-hover:text-accent">
          {t.shell.openLab}
        </span>
      </div>
    </Link>
  );
}
