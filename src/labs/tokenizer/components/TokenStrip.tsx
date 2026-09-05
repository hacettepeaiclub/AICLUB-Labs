import { Fragment, type ReactNode } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import type { Token } from "../engine";

/**
 * Whitespace has to be *seen*.
 *
 * Half of what this lab teaches is that a leading space belongs to the word
 * after it and costs real money. Rendered as an actual space that is invisible
 * — so spaces are drawn as a faint middle dot, tabs as an arrow and newlines
 * as a return mark, and the dot is dimmer than the letters so a token still
 * reads as its word first.
 */
function visible(text: string): ReactNode {
  const parts = text.split(/(\s+)/).filter((part) => part !== "");
  return parts.map((part, i) =>
    /^\s/.test(part) ? (
      <span key={i} aria-hidden className="text-fg-faint">
        {Array.from(part, (c) => (c === "\n" ? "↵" : c === "\t" ? "→" : "·")).join("")}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** What a token reads as out loud, for the strip's text alternative. */
const spoken = (text: string): string =>
  text.replace(/\n/g, "newline").replace(/\t/g, "tab").replace(/ /g, "space ").trim() || "space";

export interface TokenStripProps {
  tokens: readonly Token[];
  /** Accessible name for the whole strip. */
  label: string;
  /** Dim the strip while a fresher result is being computed. */
  muted?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * A tokenized string, as boxes.
 *
 * Real DOM text, not a canvas: the tokens are selectable, they wrap the way
 * text wraps, and a screen reader gets the sentence rather than a description
 * of a picture. No animation — the strip's job is to answer a dragged slider
 * instantly, and a transition on forty boxes would make it feel slower, not
 * livelier.
 *
 * Tokens are told apart by border and gap, never by colour alone. Alternating
 * backgrounds are a second, redundant cue for the same boundary; a token built
 * from a character the corpus never saw is marked with a dashed border *and* a
 * `?`, so the flag survives both colour blindness and a greyscale print.
 */
export function TokenStrip({ tokens, label, muted, size = "md", className }: TokenStripProps) {
  const copy = useT().labs.tokenizer;
  const summary = tokens.map((token) => spoken(token.text)).join(" / ");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-card border border-line/10 bg-ink-900 p-3",
        muted && "opacity-50",
        className,
      )}
      role="group"
      aria-label={copy.stripSummary(label, tokens.length, summary)}
    >
      {tokens.length === 0 && (
        <span className="px-1 py-1 text-body-sm text-fg-faint">{copy.nothingToTokenize}</span>
      )}
      {tokens.map((token, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "inline-flex items-center rounded border font-mono tabular-nums",
            size === "sm" ? "px-1 py-0.5 text-caption" : "px-1.5 py-1 text-body-sm",
            // The alternating fill is a redundant cue, not the boundary itself.
            i % 2 === 0 ? "bg-ink-700/70" : "bg-ink-800",
            token.known
              ? "border-line/10 text-fg"
              : "border-dashed border-signal-amber/60 text-signal-amber",
          )}
        >
          {visible(token.text)}
          {!token.known && <span className="ml-0.5 text-caption">?</span>}
        </span>
      ))}
    </div>
  );
}
