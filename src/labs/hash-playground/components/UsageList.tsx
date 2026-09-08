import { useT } from "@/i18n";

/** The order they are listed in. Not a ranking — just a stable sequence. */
const IDS = ["git", "passwords", "https", "blockchain", "signatures"] as const;

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
 */
export function UsageList() {
  const t = useT().labs["hash-playground"].usage;

  return (
    <dl className="mx-auto max-w-[44rem] divide-y divide-line/10 border-y border-line/10">
      {IDS.map((id) => (
        <div key={id} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] sm:gap-6">
          <dt className="text-body-sm font-semibold text-fg">{t.items[id].label}</dt>
          <dd className="text-body-sm text-fg-muted">{t.items[id].body}</dd>
        </div>
      ))}
    </dl>
  );
}
