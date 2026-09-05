import { Figure } from "@/components/lab";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

export interface TokenMetricsProps {
  tokens: number;
  characters: number;
  words: number;
  /** Shown only where the amount of training is something the visitor controls. */
  merges?: number;
  /** Which figure this section is really about, so the eye lands on it. */
  emphasis?: "tokens" | "merges";
  /** Repeat the scope note. On by default — see the comment below. */
  honest?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * The three numbers, and the sentence that has to travel with them.
 *
 * Three figures, not eight. Tokens is the one the lab is about; characters and
 * words are there so "tokens" has something to be different *from*, which is
 * the entire point of showing it.
 *
 * `HONESTY` sits inside this component rather than once at the top of the page
 * on purpose. A visitor who scrolls to one section, reads a token count and
 * leaves has to have seen what the number is a count *of*. Putting it in a
 * footnote would be the cheap version of telling the truth.
 */
export function TokenMetrics({
  tokens,
  characters,
  words,
  merges,
  emphasis = "tokens",
  honest = true,
  compact,
  className,
}: TokenMetricsProps) {
  const t = useT().labs.tokenizer;
  return (
    <div className={cn("card-surface", compact ? "p-4" : "p-5", className)}>
      {/* A fixed two-column grid, not a wrap. This panel lives in the stage
          sidebar, where four figures never fit on one line — and a wrapped row
          leaves the second line hanging off the first one's columns. */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Figure
          label={t.metrics.tokens}
          value={tokens.toLocaleString("en-US")}
          tone={emphasis === "tokens" ? "accent" : "default"}
        />
        <Figure label={t.metrics.characters} value={characters.toLocaleString("en-US")} />
        <Figure label={t.metrics.words} value={words.toLocaleString("en-US")} />
        {merges !== undefined && (
          <Figure
            label={t.metrics.merges}
            value={merges.toLocaleString("en-US")}
            tone={emphasis === "merges" ? "accent" : "default"}
          />
        )}
      </div>
      {honest && <p className="mt-4 text-caption text-fg-faint">{t.honesty}</p>}
    </div>
  );
}
