import { useT } from "@/i18n";

/** The loop, in the order it runs. Not a ranking — a sequence. */
const STEPS = ["forward", "loss", "backprop", "descent"] as const;

/**
 * The training loop's vocabulary, once the behaviour is familiar.
 *
 * ## What this replaced
 *
 * Four hoverable cards in a staggered grid, each lifting its shadow on hover
 * and fading up as the section scrolled into view, in four different accent
 * colours. Four definitions do not need four cards, four colours, or an
 * entrance; they need to be readable in order, because the order is the point
 * — this is a loop, and the list is numbered.
 *
 * The wording is carried over unchanged.
 */
export function ConceptList() {
  const lab = useT().labs["neural-playground"];
  const t = lab.loop;

  return (
    <ol className="mx-auto max-w-[44rem] divide-y divide-line/10 border-y border-line/10">
      {STEPS.map((key, i) => (
        <li key={key} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] sm:gap-6">
          <p className="flex items-baseline gap-2">
            <span className="font-mono text-caption tabular-nums text-fg-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-body-sm font-semibold text-fg">{t.cards[key].title}</span>
          </p>
          <div>
            <p className="text-body-sm text-fg">{lab.loopCards[key].headline}</p>
            <p className="mt-1 text-body-sm text-fg-muted">{t.cards[key].body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
