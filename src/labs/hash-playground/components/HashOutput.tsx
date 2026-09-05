import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui";
import { spring } from "@/design/motion";
import { useDebouncedValue } from "@/hooks";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

export interface HashOutputProps {
  hash: string;
  /** Per-character change flags vs. the previous digest. */
  changed: boolean[];
  /** Bumps on every new digest — re-triggers the per-character animation. */
  version: number;
  onCopy?: () => void;
}

/** One byte of the digest: two hex chars + a hover tooltip with its anatomy. */
function HexPair({
  pair,
  index,
  changedA,
  changedB,
  version,
  reduced,
}: {
  pair: string;
  index: number;
  changedA: boolean;
  changedB: boolean;
  version: number;
  reduced: boolean | null;
}) {
  const byte = parseInt(pair, 16);
  const binary = byte.toString(2).padStart(8, "0");

  return (
    <span className="group relative inline-block">
      {[0, 1].map((offset) => {
        const isChanged = offset === 0 ? changedA : changedB;
        return (
          <motion.span
            key={`${version}-${offset}`}
            initial={isChanged && !reduced ? { rotateX: -90, opacity: 0 } : false}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ ...spring.snappy, delay: reduced ? 0 : index * 0.012 }}
            className={cn(
              "inline-block",
              isChanged ? "text-accent" : "text-fg-muted",
              "transition-colors duration-fast group-hover:text-fg",
            )}
          >
            {pair[offset]}
          </motion.span>
        );
      })}
      {/* Hover anatomy — pure CSS reveal, zero JS cost. */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden
          -translate-x-1/2 whitespace-nowrap rounded border border-line/15 bg-ink-700
          px-3 py-2 font-mono text-caption text-fg shadow-card group-hover:block"
      >
        <span className="text-signal-cyan">{binary}</span>
        <span className="mx-2 text-fg-faint">·</span>
        {byte}
        <span className="mx-2 text-fg-faint">·</span>
        <span className="text-fg-muted">
          byte {index} · bits {index * 8}–{index * 8 + 7}
        </span>
      </span>
    </span>
  );
}

/** The live digest: 32 hex pairs, changed ones flip in, each byte inspectable. */
export const HashOutput = memo(function HashOutput({
  hash,
  changed,
  version,
  onCopy,
}: HashOutputProps) {
  const t = useT().labs["hash-playground"];
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const settled = useDebouncedValue(hash);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      onCopy?.();
    } catch {
      // Clipboard unavailable (permissions) — selection still works manually.
    }
  };

  const pairs = Array.from({ length: 32 }, (_, i) => hash.slice(i * 2, i * 2 + 2));

  return (
    <div className="card-surface p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge dotClassName="bg-signal-green">SHA-256</Badge>
          <Badge>{t.digestBits}</Badge>
          <span className="hidden text-caption text-fg-faint sm:inline">
            hover a pair to see inside
          </span>
        </div>
        <motion.button
          type="button"
          onClick={() => void copy()}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          aria-label={copied ? t.hashCopied : t.copyHash}
          className={cn(
            "rounded px-3 py-1.5 text-caption font-medium transition-colors duration-fast",
            copied ? "text-signal-green" : "text-fg-muted hover:bg-line/5 hover:text-fg",
          )}
        >
          {copied ? t.copied : t.copy}
        </motion.button>
      </div>

      {/* The digest is split into 32 animated pairs so characters can flip
          individually — which leaves no readable text behind, so the visual
          copy is hidden and the real one lives below it. An aria-label on a
          <p> is not reliably exposed, so it isn't used as the mechanism. */}
      <p
        aria-hidden
        className="break-all font-mono text-body leading-loose tracking-wide md:text-body-lg"
      >
        {pairs.map((pair, i) => (
          <HexPair
            key={i}
            pair={pair}
            index={i}
            changedA={changed[i * 2] === true}
            changedB={changed[i * 2 + 1] === true}
            version={version}
            reduced={reduced}
          />
        ))}
      </p>

      {/* Readable at any time, and never announced: 64 hex characters read
          aloud on every keystroke would be unusable. */}
      <p className="sr-only">SHA-256 digest: {hash}</p>

      {/* Announced once typing stops — that the digest changed, plus enough of
          it to tell two digests apart without reciting all 64 characters. */}
      <p aria-live="polite" className="sr-only">
        {`Digest updated, now starting ${settled.slice(0, 8)}.`}
      </p>
    </div>
  );
});
