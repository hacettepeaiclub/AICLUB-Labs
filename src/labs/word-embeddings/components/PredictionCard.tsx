import { cn } from "@/lib/cn";
import type { VocabularyItem } from "../vocabulary";

/**
 * The first thing on the page, and the only thing until it is answered.
 *
 * There is no map behind this card. A point cloud that arrives before any
 * question has been asked is wallpaper — the visitor has no reason to look at
 * any particular part of it, so they look at none of it. The map is created by
 * answering, which also means the projection has the whole reading time to
 * compute in.
 *
 * ## Why this cannot become a quiz
 *
 * Not because the copy avoids the word "wrong", though it does. Because of the
 * data: `banana` really is the fifth nearest neighbour of `apple` out of 318.
 * Every chip on offer is a genuine near neighbour, so the reveal has nothing to
 * mark. It states two true things — where your word landed, and which word
 * landed first — and lets them sit next to each other. There is no score to
 * keep, nothing to retry, and no arrangement of these three words that produces
 * a loser.
 */

export interface PredictionChoice {
  readonly index: number;
  readonly item: VocabularyItem;
  /** Position among the anchor's neighbours, 1 = nearest. Computed by the engine. */
  readonly rank: number;
  /** How many words it was ranked against. */
  readonly total: number;
  readonly similarity: number;
}

export interface PredictionCardCopy {
  readonly question: (word: string) => string;
  readonly hint: string;
  readonly loading: string;
  readonly chose: (word: string, rank: number, total: number, score: string) => string;
  readonly nearest: (word: string, score: string) => string;
  readonly because: string;
}

export interface PredictionCardProps {
  anchor: VocabularyItem;
  choices: readonly PredictionChoice[];
  nearest: PredictionChoice | null;
  chosen: number | null;
  ready: boolean;
  formatScore: (value: number) => string;
  onChoose: (index: number) => void;
  copy: PredictionCardCopy;
}

export function PredictionCard({
  anchor,
  choices,
  nearest,
  chosen,
  ready,
  formatScore,
  onChoose,
  copy,
}: PredictionCardProps) {
  const answered = chosen !== null;
  const picked = choices.find((c) => c.index === chosen) ?? null;

  return (
    <div className="mx-auto max-w-prose text-center">
      <p
        className={cn(
          "text-fg",
          answered ? "text-body text-fg-muted" : "text-display-sm md:text-display-md",
        )}
      >
        {/* Casing is presentation, so it happens here rather than in the
            dictionary — a translation should carry words, not transformations. */}
        {copy.question(anchor.en.toUpperCase())}
      </p>

      {!answered && (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {choices.map((choice) => (
              <button
                key={choice.index}
                type="button"
                disabled={!ready}
                onClick={() => onChoose(choice.index)}
                className={cn(
                  "min-h-[44px] rounded-md border border-line/20 px-5 py-2.5",
                  "font-mono text-body text-fg transition-colors duration-fast",
                  "hover:border-accent/50 hover:text-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                )}
              >
                {choice.item.en}
              </button>
            ))}
          </div>
          <p className="mt-5 text-body-sm text-fg-faint" aria-live="polite">
            {ready ? copy.hint : copy.loading}
          </p>
        </>
      )}

      {answered && picked && nearest && (
        // Demoted, not replaced: what you thought stays visible next to what the
        // vectors say, which is the entire comparison this section is making.
        <div className="mt-4 space-y-1 text-body-sm">
          <p className="text-fg-muted">
            {copy.chose(picked.item.en, picked.rank, picked.total, formatScore(picked.similarity))}
          </p>
          <p className="text-fg">{copy.nearest(nearest.item.en, formatScore(nearest.similarity))}</p>
          <p className="pt-2 text-fg-faint">{copy.because}</p>
        </div>
      )}
    </div>
  );
}
