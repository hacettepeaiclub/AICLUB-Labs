import { memo, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ease, spring } from "@/design/motion";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { useDebouncedValue, useLocalControls } from "@/hooks";
import { commonHexPrefix, HEX_CHARS } from "../hashUtils";
import { useSha256 } from "../useSha256";

const MAX_ROUND = 6;

/** Odds of matching the first n hex characters by chance: 1 in 16^n. */
const odds = (n: number) => formatNumber(16 ** n, 0);

function ChallengeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex-1">
      <label htmlFor={id} className="text-overline uppercase text-fg-muted">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        className="mt-2 w-full rounded border border-line/15 bg-ink-900 px-4 py-3 font-mono
          text-body text-fg transition-colors duration-fast hover:border-line/25"
      />
    </div>
  );
}

function PrefixHash({ hex, matched }: { hex: string; matched: number }) {
  return (
    <p className="break-all font-mono text-body-sm leading-relaxed">
      <span className="rounded-[3px] bg-signal-green/15 text-signal-green">
        {hex.slice(0, matched)}
      </span>
      <span className="text-fg-faint">{hex.slice(matched)}</span>
    </p>
  );
}

/** Small radial burst — elegant celebration, no confetti storm. */
function Burst() {
  return (
    <span aria-hidden className="relative inline-block size-0 align-middle">
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute size-1.5 rounded-pill bg-signal-green"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * 26,
              y: Math.sin(angle) * 26,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.6, ease: [...ease.out] }}
          />
        );
      })}
    </span>
  );
}

/**
 * The collision hunt as a game: each round asks for one more matching leading
 * hex character, and each round is exactly 16× harder — which is the whole
 * lesson. Progress is celebrated; a real collision is never faked.
 */
export const CollisionChallenge = memo(function CollisionChallenge({
  onCelebrate,
}: {
  onCelebrate?: () => void;
}) {
  const t = useT().labs["hash-playground"].challenge;
  const reduced = useReducedMotion();
  const [inputA, setInputA] = useState("hello");
  const [inputB, setInputB] = useState("hello!");
  // Progress is worth keeping across visits; `attempts` is this sitting's effort
  // and `justCleared` is animation state, so neither is stored.
  const [progress, saveProgress] = useLocalControls("acl:hash-playground:collision", {
    round: 1,
    best: 0,
  });
  const { round, best } = progress;
  const [attempts, setAttempts] = useState(0);
  const [justCleared, setJustCleared] = useState(false);
  const hashA = useSha256(inputA);
  const hashB = useSha256(inputB);

  const sameInput = inputA === inputB;
  const matched = hashA && hashB && !sameInput ? commonHexPrefix(hashA, hashB) : 0;
  const cleared = !sameInput && matched >= round;

  useEffect(() => {
    if (matched > best) saveProgress({ best: matched });
  }, [matched, best, saveProgress]);

  /**
   * An attempt is a pair the visitor actually rested on.
   *
   * The hashes update live as you type, so counting digests counted keystrokes:
   * editing "hello" into "hello9" scored six attempts for one guess. Waiting
   * for the pair to settle makes the number mean what the label says.
   */
  const settledPair = useDebouncedValue(JSON.stringify([inputA, inputB]), 500);
  const countedPair = useRef<string | null>(null);
  useEffect(() => {
    if (countedPair.current === null) {
      countedPair.current = settledPair; // The pair they arrived with isn't a guess.
      return;
    }
    if (countedPair.current === settledPair) return;
    countedPair.current = settledPair;
    setAttempts((a) => a + 1);
  }, [settledPair]);

  const settledMatched = useDebouncedValue(matched);

  // Celebrate the rising edge of a cleared round, once per round.
  const celebratedRound = useRef(0);
  useEffect(() => {
    if (!cleared || celebratedRound.current >= round) return;
    celebratedRound.current = round;
    setJustCleared(true);
    onCelebrate?.();
  }, [cleared, round, onCelebrate]);

  if (!hashA || !hashB) return null;

  const nextRound = () => {
    setJustCleared(false);
    saveProgress({ round: Math.min(round + 1, MAX_ROUND) });
  };

  return (
    <div className="card-surface space-y-8 p-6 md:p-10">
      {/* Round ladder — each step is 16× harder than the last. */}
      <div>
        <div className="flex flex-wrap items-center gap-2" aria-label={t.rounds}>
          {Array.from({ length: MAX_ROUND }, (_, i) => {
            const r = i + 1;
            const done = r < round || (r === round && cleared);
            const isCurrent = r === round;
            return (
              <span
                key={r}
                className={cn(
                  "rounded-pill border px-3 py-1.5 font-mono text-caption transition-colors duration-base",
                  done && "border-signal-green/40 bg-signal-green/10 text-signal-green",
                  !done && isCurrent && "border-accent/50 bg-accent/10 text-accent-fg",
                  !done && !isCurrent && "border-line/10 text-fg-faint",
                )}
              >
                {done ? "✓" : t.roundLabel(r)} · {odds(r)}
              </span>
            );
          })}
        </div>
        <p className="mt-3 text-body text-fg">
          <span className="text-overline uppercase text-accent">Round {round}</span>
          <span className="ml-3">
            Make the hashes share their first <span className="font-mono text-accent">{round}</span>{" "}
            hex character
            {round === 1 ? "" : "s"} — the odds per guess are 1 in {odds(round)}.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <ChallengeField label={t.inputA} value={inputA} onChange={setInputA} />
        <ChallengeField label={t.inputB} value={inputB} onChange={setInputB} />
      </div>

      {sameInput ? (
        <p className="rounded border border-signal-amber/30 bg-signal-amber/10 px-4 py-3 text-body-sm text-signal-amber">
          Same input, same hash — that&apos;s determinism, not a collision. A collision needs two{" "}
          <em>different</em> inputs.
        </p>
      ) : (
        <div className="space-y-3">
          <PrefixHash hex={hashA} matched={matched} />
          <PrefixHash hex={hashB} matched={matched} />
        </div>
      )}

      {justCleared && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={spring.bouncy}
          className="flex flex-wrap items-center justify-between gap-4 rounded-card border
            border-signal-green/30 bg-signal-green/10 px-5 py-4"
          role="status"
        >
          <p className="text-body font-medium text-signal-green">
            {!reduced && <Burst />}
            <span className="ml-2">
              Round {round} cleared — {matched} matching character{matched === 1 ? "" : "s"}!
            </span>
          </p>
          {round < MAX_ROUND ? (
            <button
              type="button"
              onClick={nextRound}
              className="rounded bg-signal-green/20 px-4 py-2 text-body-sm font-medium
                text-signal-green transition-colors duration-fast hover:bg-signal-green/30"
            >
              Round {round + 1}: 16× harder →
            </button>
          ) : (
            <p className="text-body-sm text-signal-green/80">
              That&apos;s where humans retire. 58 characters to go.
            </p>
          )}
        </motion.div>
      )}

      <div className="border-t border-line/10 pt-6">
        <p className="text-title text-fg">
          Matching prefix:{" "}
          <span className="font-mono text-signal-green">{sameInput ? "—" : matched}</span>
          <span className="text-fg-faint"> / {HEX_CHARS} characters</span>
          <span className="ml-4 text-body-sm text-fg-muted">
            best: <span className="font-mono text-fg">{best}</span>
            <span className="ml-3">
              attempts: <span className="font-mono text-fg">{formatNumber(attempts, 0)}</span>
            </span>
          </span>
        </p>

        {/* Visual probability: each extra matching character is 16× less likely. */}
        <div
          role="img"
          aria-label={`Progress toward a full collision: ${matched} of 64 characters match. Round target: ${round}.`}
          className="mt-4 grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${HEX_CHARS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: HEX_CHARS }, (_, i) => (
            <motion.span
              key={i}
              className={cn(
                "h-3 rounded-[2px]",
                i < matched && !sameInput
                  ? "bg-signal-green"
                  : i < round
                    ? "bg-ink-700 ring-1 ring-inset ring-accent/40"
                    : "bg-ink-700",
              )}
              animate={reduced ? undefined : { opacity: i < matched && !sameInput ? [0.4, 1] : 1 }}
              transition={{ duration: 0.3, ease: [...ease.out], delay: i * 0.015 }}
            />
          ))}
        </div>

        {/* Meaningful transitions only: where the settled pair landed and
            whether it beat the record. Clearing a round is announced by the
            role="status" banner above. */}
        <p aria-live="polite" className="sr-only">
          {sameInput
            ? t.identical
            : `${settledMatched} of ${HEX_CHARS} leading characters match. Best so far ${best}. Round ${round} needs ${round}.`}
        </p>

        <div className="mt-6 max-w-prose space-y-3 text-body-sm text-fg-muted">
          <p>
            Each round multiplies the search space by 16 — that&apos;s the entire secret of hash
            security, felt firsthand. Matching all 64 characters by chance is 1 in 2<sup>256</sup>,
            about 1 followed by 77 zeros. There are an estimated ~10<sup>80</sup> atoms in the
            observable universe.
          </p>
          <p>
            Even the clever “birthday” shortcut needs around 2<sup>128</sup> ≈ 3.4 × 10
            <sup>38</sup> hashes. Hashing a trillion inputs per second, that&apos;s roughly 10
            <sup>19</sup> years — about a billion times the age of the universe. No SHA-256
            collision has ever been found. Not because nobody tried — because the math is that
            lopsided.
          </p>
        </div>
      </div>
    </div>
  );
});
