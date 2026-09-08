import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

/**
 * Copy a digest to the clipboard, and say so for a moment.
 *
 * Shared by the panel's inline button and by section 1, whose stage uses it as
 * the primary action — the digest is the answer, and copying it is the only
 * thing you do to an answer.
 */
export function CopyButton({
  hex,
  onCopied,
  className,
}: {
  hex: string;
  onCopied?: () => void;
  className?: string;
}) {
  const t = useT().labs["hash-playground"];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <Button
      variant={className ? "primary" : "ghost"}
      onClick={() => {
        void navigator.clipboard
          .writeText(hex)
          .then(() => {
            setCopied(true);
            onCopied?.();
          })
          // Clipboard blocked by permissions — the text is selectable regardless.
          .catch(() => undefined);
      }}
      className={cn("min-h-[44px]", className)}
      aria-label={copied ? t.hashCopied : t.copyHash}
    >
      {copied ? t.copied : t.copy}
    </Button>
  );
}

export interface DigestPanelProps {
  /** 64 lowercase hex characters. */
  hex: string;
  /**
   * Per-character "did this change" flags. Marked characters are underlined as
   * well as coloured, so the comparison survives being read in greyscale.
   */
  changed?: readonly boolean[];
  /** How a marked character reads: the value that just arrived, or the one it replaced. */
  tone?: "new" | "old";
  label?: string;
  /** Adds a copy button. Only the digest a visitor would actually want gets one. */
  onCopied?: () => void;
  className?: string;
}

/**
 * A SHA-256 digest, as text.
 *
 * ## Why this is a paragraph and not a canvas
 *
 * The digest is the answer this lab is about, so it has to behave like an
 * answer: selectable, copyable, and readable by a screen reader in the order
 * it is written. Drawing it would take all three away.
 *
 * The previous version split it into 32 animated pairs and marked the whole
 * thing `aria-hidden`, keeping a second `sr-only` copy alongside — two sources
 * of truth for one string, and a hover tooltip per byte that no keyboard could
 * reach. It is one run of real text now.
 *
 * Nothing about it is announced on every keystroke: 64 hex characters read
 * aloud per edit is unusable, so the live region belongs to whichever stage
 * owns this panel and speaks once the typing settles.
 */
export function DigestPanel({
  hex,
  changed,
  tone = "new",
  label,
  onCopied,
  className,
}: DigestPanelProps) {
  return (
    <div className={cn("min-w-0", className)}>
      {(label || onCopied) && (
        <div className="mb-1.5 flex items-center justify-between gap-3">
          {label && <p className="text-overline uppercase text-fg-faint">{label}</p>}
          {onCopied && <CopyButton hex={hex} onCopied={onCopied} />}
        </div>
      )}
      <p className="select-all break-all font-mono text-body-sm leading-relaxed tracking-wide text-fg-muted md:text-body">
        {changed
          ? hex.split("").map((char, i) => (
              <span
                key={i}
                className={cn(
                  changed[i] && "underline decoration-2 underline-offset-2",
                  changed[i] && tone === "new" && "text-data",
                  changed[i] && tone === "old" && "text-fg-faint line-through decoration-1",
                )}
              >
                {char}
              </span>
            ))
          : hex}
      </p>
    </div>
  );
}
