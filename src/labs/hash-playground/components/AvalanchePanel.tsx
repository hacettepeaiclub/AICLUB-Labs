import { memo, useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { duration, ease, spring } from "@/design/motion";
import { useDebouncedValue } from "@/hooks";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { HASH_BITS } from "../hashUtils";

export interface AvalanchePanelProps {
  prev: string | null;
  current: string;
  /** Per-character change flags between prev and current. */
  changedChars: boolean[];
  changedBits: number;
  version: number;
}

function HashRow({
  label,
  hex,
  changedChars,
  tone,
}: {
  label: string;
  hex: string;
  changedChars: boolean[];
  tone: "before" | "after";
}) {
  return (
    <div>
      <p className="mb-2 text-overline uppercase text-fg-faint">{label}</p>
      <p className="break-all font-mono text-body-sm leading-relaxed tracking-wide md:text-body">
        {hex.split("").map((char, i) => (
          <span
            key={i}
            className={cn(
              "inline-block",
              !changedChars[i] && "text-fg-faint",
              changedChars[i] &&
                tone === "before" &&
                "text-signal-rose/70 line-through decoration-signal-rose/40",
              changedChars[i] && tone === "after" && "rounded-[3px] bg-accent/15 text-accent",
            )}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}

/** Animated "N / 256 bits changed" counter with an expanding energy ring. */
function BitCounter({ changedBits, version }: { changedBits: number; version: number }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(changedBits);

  // Count up from 0 on every new digest; `version` re-fires it even when two
  // edits happen to flip the same number of bits.
  useEffect(() => {
    if (reduced) {
      setDisplay(changedBits);
      return;
    }
    const controls = animate(0, changedBits, {
      duration: 0.7,
      ease: [...ease.out],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [changedBits, version, reduced]);

  return (
    <motion.span
      key={version}
      initial={reduced ? false : { scale: 1.12 }}
      animate={{ scale: 1 }}
      transition={spring.smooth}
      className="relative inline-block font-mono tabular-nums text-accent"
    >
      {!reduced && (
        <motion.span
          aria-hidden
          key={`ring-${version}`}
          className="absolute left-1/2 top-1/2 -z-10 size-16 -translate-x-1/2 -translate-y-1/2
            rounded-pill border border-accent/50"
          initial={{ scale: 0.4, opacity: 0.6 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.8, ease: [...ease.out] }}
        />
      )}
      {display}
    </motion.span>
  );
}

/**
 * The centerpiece: previous digest → new digest, every changed character
 * highlighted, an energy pulse sweeping the divider, and a count-up of flipped
 * bits. ~50% of bits are expected to flip — that's the avalanche effect.
 */
export const AvalanchePanel = memo(function AvalanchePanel({
  prev,
  current,
  changedChars,
  changedBits,
  version,
}: AvalanchePanelProps) {
  const t = useT().labs["hash-playground"].avalanche;
  const reduced = useReducedMotion();
  const percent = (changedBits / HASH_BITS) * 100;
  const settledBits = useDebouncedValue(changedBits);

  if (!prev) {
    return (
      <div className="card-surface grid place-items-center px-6 py-16 text-center">
        <p className="text-title text-fg">{t.editPrompt}</p>
        <p className="mt-2 max-w-sm text-body-sm text-fg-muted">
          The moment your input changes, you&apos;ll see both digests side by side — and how much of
          the hash survived. (Spoiler: almost none of it.)
        </p>
      </div>
    );
  }

  return (
    <div className="card-surface relative space-y-8 overflow-hidden p-6 md:p-10">
      <HashRow label={t.before} hex={prev} changedChars={changedChars} tone="before" />

      {/* Divider with a pulse that travels down through it on every change. */}
      <div className="flex items-center gap-4" aria-hidden>
        <motion.span
          key={`arrow-${version}`}
          initial={reduced ? false : { y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: duration.base, ease: [...ease.out] }}
          className="text-title text-accent"
        >
          ↓
        </motion.span>
        <span className="relative h-px flex-1 overflow-hidden bg-line/10">
          {!reduced && (
            <motion.span
              key={`sweep-${version}`}
              className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-accent/70 to-transparent"
              initial={{ left: "-6rem" }}
              animate={{ left: "100%" }}
              transition={{ duration: 0.6, ease: [...ease.out] }}
            />
          )}
        </span>
      </div>

      <HashRow label={t.after} hex={current} changedChars={changedChars} tone="after" />

      <div className="border-t border-line/10 pt-8">
        <p aria-hidden className="text-display-md text-fg md:text-display-lg">
          <BitCounter changedBits={changedBits} version={version} />
          <span className="text-fg-faint"> / {HASH_BITS}</span>
          <span className="ml-3 text-title text-fg-muted">bits changed</span>
        </p>

        {/* Bar with a marker at the expected 50% */}
        <div className="relative mt-5 h-2 overflow-hidden rounded-pill bg-ink-700">
          <motion.div
            className="h-full rounded-pill bg-accent-fill"
            animate={{ width: `${percent}%` }}
            transition={reduced ? { duration: 0 } : { duration: 0.7, ease: [...ease.out] }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-full w-px bg-fg/40"
            title={t.expected}
          />
        </div>
        <p aria-hidden className="mt-3 text-body-sm text-fg-muted">
          {percent.toFixed(0)}% of the hash flipped. A perfect hash flips about half its bits —
          <span className="text-fg"> no matter how small the change</span>. That&apos;s the
          avalanche effect.
        </p>

        {/* The accessible copy of everything above: real text, so it reads
            normally, and one announcement per burst of typing rather than one
            per frame of the count-up. */}
        <p aria-live="polite" className="sr-only">
          {`${settledBits} of ${HASH_BITS} bits changed — ${((settledBits / HASH_BITS) * 100).toFixed(0)} percent of the hash flipped. A perfect hash flips about half its bits, however small the change. That is the avalanche effect.`}
        </p>
      </div>
    </div>
  );
});
