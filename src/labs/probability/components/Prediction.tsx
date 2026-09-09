import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface PredictionOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

export interface PredictionProps<T extends string> {
  question: string;
  options: readonly PredictionOption<T>[];
  /** Null until the visitor commits. Committing is one-way. */
  chosen: T | null;
  onChoose: (value: T) => void;
  /** What actually happens, revealed only after a choice. */
  answer: string;
  /** Whether the committed guess matched. Drives the wording, not a score. */
  matched?: boolean;
  copy: {
    readonly yours: string;
    readonly actual: string;
    readonly agreed: string;
    readonly disagreed: string;
  };
}

/**
 * Guess first, then find out.
 *
 * Local to this lab on purpose. It is not a quiz component and it must never
 * become one: there is no score, nothing to retry, and no state anywhere that
 * remembers how you did. The only thing being asked is whether you expected
 * the result, because noticing that you did not is the entire lesson of the
 * section it introduces.
 *
 * ## Why the answer is withheld
 *
 * A probability you read before predicting is a fact. The same probability
 * read after committing to a different one is a surprise, and only the second
 * of those changes anybody's intuition. So the reveal is gated on a choice —
 * and the choice is one-way, because a guess you can revise after seeing the
 * answer is not a guess.
 *
 * ## What it does not touch
 *
 * Nothing here feeds the model. Every section computes its result from its own
 * engine whether or not a prediction was ever made; this only decides when the
 * result is shown.
 */
export function Prediction<T extends string>({
  question,
  options,
  chosen,
  onChoose,
  answer,
  matched,
  copy,
}: PredictionProps<T>) {
  const committed = chosen !== null;
  const picked = options.find((option) => option.value === chosen);

  return (
    <div className="space-y-3">
      <p className="text-body-sm text-fg">{question}</p>

      {!committed ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              onClick={() => onChoose(option.value)}
              className="min-h-11"
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-2 rounded border border-line/10 bg-ink-950 p-4">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className="text-caption text-fg-faint">
              {copy.yours}{" "}
              <span className="font-mono text-body-sm text-fg-muted">{picked?.label ?? ""}</span>
            </span>
            <span className="text-caption text-fg-faint">
              {copy.actual} <span className="font-mono text-body-sm text-accent">{answer}</span>
            </span>
          </div>
          {matched !== undefined && (
            // Stated, never scored: a tick and a word, not a mark out of ten.
            <p className={cn("text-caption", matched ? "text-fg-muted" : "text-fg")}>
              <span aria-hidden className="mr-1.5">
                {matched ? "=" : "≠"}
              </span>
              {matched ? copy.agreed : copy.disagreed}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
