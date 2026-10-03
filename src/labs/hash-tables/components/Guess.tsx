import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface GuessOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

/**
 * Guess first, then find out — once.
 *
 * The same pattern the probability and floating-point labs use, written again
 * here because labs do not import from one another. There is no score and
 * nothing is stored: a guess you could revise after seeing the answer would
 * not be a guess, and noticing how far off you were is the entire lesson.
 */
export function Guess<T extends string>({
  question,
  options,
  chosen,
  onChoose,
  answer,
  copy,
}: {
  question: string;
  options: readonly GuessOption<T>[];
  chosen: T | null;
  onChoose: (value: T) => void;
  answer: string;
  copy: { yours: string; actual: string; agreed: string; disagreed: string; correct: T };
}) {
  const picked = options.find((o) => o.value === chosen);
  return (
    <div className="card-surface p-5 md:p-6">
      <p className="text-body-lg text-fg">{question}</p>
      <div role="group" aria-label={question} className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={chosen === option.value ? "primary" : "secondary"}
            disabled={chosen !== null}
            aria-pressed={chosen === option.value}
            onClick={() => onChoose(option.value)}
            className={cn(
              "min-h-[44px]",
              chosen !== null && chosen !== option.value && "opacity-50",
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {picked && (
        <div
          aria-live="polite"
          className="verdict-enter mt-5 space-y-2 border-t border-line/10 pt-4"
        >
          <p className="text-body-sm text-fg-muted">
            <span className="text-overline uppercase text-fg-faint">{copy.yours}</span>{" "}
            {picked.label}. {chosen === copy.correct ? copy.agreed : copy.disagreed}
          </p>
          <p className="text-body text-fg">
            <span className="text-overline uppercase text-fg-faint">{copy.actual}</span> {answer}
          </p>
        </div>
      )}
    </div>
  );
}
