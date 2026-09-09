import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { VocabularyItem } from "../vocabulary";

/**
 * Two words, and the one number that relates them.
 *
 * The neighbour list answers "what is near this word". It cannot answer "how
 * near are *these two*", because the pair a visitor wants to compare is
 * usually not in anybody's top eight — the interesting question is almost
 * always about two words that are far apart, and those are exactly the ones no
 * list shows together.
 *
 * So: hold one word, select another, and the cosine between them is measured
 * and stated, along with where the second lands in the first's ranking out of
 * every other word. Both numbers come from the engine through the page; this
 * component computes nothing. It is handed a similarity and a rank and prints
 * them.
 *
 * The rank is what stops the similarity being misread. A cosine of 0.31 means
 * nothing on its own — it is neither large nor small until you know that it
 * puts one word 14th out of 317 rather than 200th.
 */

export interface ComparePanelCopy {
  readonly title: string;
  readonly hold: string;
  readonly holding: (word: string) => string;
  readonly release: string;
  readonly idle: string;
  readonly samePoint: string;
  readonly scoreLabel: string;
  readonly rankLabel: string;
  readonly rankValue: (rank: number, total: number) => string;
  readonly sentence: (a: string, b: string, score: string, rank: number, total: number) => string;
}

export interface ComparePanelProps {
  /** The word currently selected in the map. */
  current: VocabularyItem;
  /** The word being held, or null. */
  held: VocabularyItem | null;
  /** Cosine between the two, measured by the engine. Null when nothing is held. */
  similarity: number | null;
  /** Where the selection lands among the held word's neighbours, 1 = nearest. */
  rank: number | null;
  total: number;
  onHold: () => void;
  onRelease: () => void;
  formatScore: (value: number) => string;
  copy: ComparePanelCopy;
}

export function ComparePanel({
  current,
  held,
  similarity,
  rank,
  total,
  onHold,
  onRelease,
  formatScore,
  copy,
}: ComparePanelProps) {
  const same = held !== null && held.id === current.id;
  const measured = held !== null && !same && similarity !== null && rank !== null;

  return (
    <div className="space-y-3">
      <p className="text-caption font-medium text-fg-muted">{copy.title}</p>

      {held === null ? (
        <>
          <Button variant="secondary" onClick={onHold} className="min-h-11 w-full justify-center">
            {copy.hold}
          </Button>
          <p className="text-caption text-fg-faint">{copy.idle}</p>
        </>
      ) : (
        <>
          <div className="rounded border border-line/10 bg-ink-950 px-3 py-2">
            <p className="font-mono text-body-sm text-fg">{copy.holding(held.en)}</p>
          </div>

          {same ? (
            <p className="text-caption text-fg-faint">{copy.samePoint}</p>
          ) : (
            measured && (
              <>
                <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
                  <div className="min-w-0">
                    <p className="text-overline uppercase text-fg-faint">{copy.scoreLabel}</p>
                    <p className={cn("mt-1 font-mono tabular-nums text-accent")}>
                      {formatScore(similarity)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-overline uppercase text-fg-faint">{copy.rankLabel}</p>
                    <p className="mt-1 font-mono tabular-nums text-fg">
                      {copy.rankValue(rank, total)}
                    </p>
                  </div>
                </div>
                {/* The two numbers as a sentence, because a cosine on its own
                    is not a quantity anybody has intuition for. */}
                <p className="text-caption text-fg-muted">
                  {copy.sentence(held.en, current.en, formatScore(similarity), rank, total)}
                </p>
              </>
            )
          )}

          <Button variant="ghost" onClick={onRelease} className="min-h-11 w-full justify-center">
            {copy.release}
          </Button>
        </>
      )}
    </div>
  );
}
