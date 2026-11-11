import { cn } from "@/lib/cn";
import type { Neighbour } from "../engine";
import type { VocabularyItem } from "../vocabulary";
import { barWidth } from "../view";

/**
 * The eight nearest words, with their real similarities.
 *
 * This list — not the map — is the reliable interface. It works without
 * pointing, without colour, without seeing, and it carries the one thing the
 * picture cannot: the actual number. Every row states its rank and its cosine
 * as text; the bar beside them is redundant encoding, scaled against the
 * strongest neighbour in the list so the differences are visible at all.
 *
 * Rows are buttons, so the whole lab can be driven from here: choose a word and
 * the map re-centres on it.
 */

export interface NeighbourListCopy {
  readonly title: (word: string) => string;
  readonly rankHeader: string;
  readonly wordHeader: string;
  readonly scoreHeader: string;
  readonly rowLabel: (word: string, gloss: string, rank: number, score: string) => string;
}

export interface NeighbourListProps {
  anchor: VocabularyItem;
  neighbours: readonly Neighbour[];
  vocabulary: readonly VocabularyItem[];
  formatScore: (value: number) => string;
  onSelect: (index: number) => void;
  copy: NeighbourListCopy;
}

export function NeighbourList({
  anchor,
  neighbours,
  vocabulary,
  formatScore,
  onSelect,
  copy,
}: NeighbourListProps) {
  const strongest = neighbours[0]?.similarity ?? 0;

  return (
    <div>
      <h3 className="text-overline uppercase text-fg-faint">{copy.title(anchor.en)}</h3>
      <ol className="mt-3 space-y-1">
        {neighbours.map((neighbour, position) => {
          const item = vocabulary[neighbour.index];
          if (!item) return null;
          const rank = position + 1;
          const score = formatScore(neighbour.similarity);
          return (
            <li key={neighbour.index}>
              <button
                type="button"
                onClick={() => onSelect(neighbour.index)}
                aria-label={copy.rowLabel(item.en, item.tr, rank, score)}
                className={cn(
                  "flex min-h-[44px] w-full items-center gap-3 rounded px-2 py-1.5 text-left",
                  "transition-colors duration-fast hover:bg-fg/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                )}
              >
                <span className="w-5 shrink-0 text-right font-mono text-caption tabular-nums text-fg-faint">
                  {rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-body-sm text-fg">{item.en}</span>
                  <span className="block truncate text-caption text-fg-faint">{item.tr}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-20 shrink-0 overflow-hidden rounded-full bg-fg/10 sm:block"
                >
                  <span
                    className="block h-full rounded-full bg-accent/70"
                    style={{ width: `${barWidth(neighbour.similarity, strongest)}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right font-mono text-body-sm tabular-nums text-fg">
                  {score}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
