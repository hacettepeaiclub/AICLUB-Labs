import { useT } from "@/i18n";

/** The order they are listed in. Not a ranking — just a stable sequence. */
const IDS = ["git", "passwords", "https", "blockchain", "signatures"] as const;

/**
 * One small mark per item, generated to the same brief: a flat line pictogram
 * in the accent stroke colour, transparent ground. Decorative only — the
 * label beside it already says what the item is, so a screen reader gets
 * nothing from the image and the `dt` text stays the whole story.
 */
const ICON_SRC: Record<(typeof IDS)[number], string> = {
  git: "/labs/hash-playground/icons/git.png",
  passwords: "/labs/hash-playground/icons/passwords.png",
  https: "/labs/hash-playground/icons/https.png",
  blockchain: "/labs/hash-playground/icons/blockchain.png",
  signatures: "/labs/hash-playground/icons/signatures.png",
};

/**
 * Where hashes turn up, as a list.
 *
 * ## What this replaced
 *
 * A tab strip over five panels, each with an animated four-step pipeline that
 * played on a stagger, a Replay button to play it again, roving-tabindex key
 * handling and a raised card around the whole thing — two hundred lines to
 * deliver five sentences that do not change and cannot be interacted with.
 *
 * Five sentences is what it is, so five sentences is what it looks like. The
 * wording is carried over unchanged; whether each claim is stated precisely
 * enough is a separate question from how it is laid out, and this pass does
 * not touch it.
 *
 * ## The one thing added since: a mark per item
 *
 * A small tile sits in its own surface — border, rounded corners, a card
 * background — rather than the icon sitting bare on the page. That is not
 * decoration for its own sake: it means the tile reads as one deliberate
 * object regardless of whether the generated image itself came back with a
 * true alpha channel or a flat white square, and it keeps five different
 * source images visually disciplined into one shape.
 */
export function UsageList() {
  const t = useT().labs["hash-playground"].usage;

  return (
    <dl className="mx-auto max-w-[44rem] divide-y divide-line/10 border-y border-line/10">
      {IDS.map((id) => (
        <div key={id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] sm:gap-6">
          <dt className="flex items-center gap-3 text-body-sm font-semibold text-fg">
            <span className="flex size-9 shrink-0 items-center justify-center rounded border border-line/10 bg-ink-700/60">
              <img src={ICON_SRC[id]} alt="" aria-hidden className="size-5 object-contain" />
            </span>
            {t.items[id].label}
          </dt>
          <dd className="text-body-sm text-fg-muted">{t.items[id].body}</dd>
        </div>
      ))}
    </dl>
  );
}
