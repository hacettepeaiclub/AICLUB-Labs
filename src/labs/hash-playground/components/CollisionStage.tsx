import { useEffect, useRef, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { useDebouncedValue, useLocalControls } from "@/hooks";
import { commonHexPrefix, HEX_CHARS } from "../hashUtils";
import { useSha256 } from "../useSha256";
import { MessageField } from "./MessageField";

const MAX_ROUND = 6;

/** Odds of matching the first n hex characters by chance: 1 in 16^n. */
const odds = (n: number) => formatNumber(16 ** n, 0);

/**
 * Section 4: can you make two different messages produce the same hash?
 *
 * ## The mechanic is unchanged, because it is honest
 *
 * This never claims to find a SHA-256 collision and never fakes one. It asks
 * for a *prefix* match — round 1 wants one shared leading hex character, round
 * 2 wants two — and each round is exactly sixteen times less likely than the
 * one before. Feeling that curve is the lesson; a full collision is what the
 * curve is heading towards and never arrives at.
 *
 * Both digests are real `crypto.subtle` output and the match is
 * `commonHexPrefix` over them. Progress (`round`, `best`) is kept across
 * visits; attempts counts pairs the visitor actually rested on rather than
 * keystrokes.
 *
 * ## What changed
 *
 * The layout, and only the layout. It was a raised card holding a round
 * ladder, two fields, two digests, a radial particle burst on every cleared
 * round, a 64-cell bar that animated each cell on a stagger, and two
 * paragraphs of prose. It is one stage now, the burst is gone, and the prose
 * moved into the section's lede where an explanation belongs.
 */
export function CollisionStage() {
  const t = useT().labs["hash-playground"];
  const c = t.challenge;
  const [inputA, setInputA] = useState("hello");
  const [inputB, setInputB] = useState("hello!");
  // Progress is worth keeping across visits; `attempts` is this sitting's
  // effort, so it is not stored.
  const [progress, saveProgress] = useLocalControls("acl:hash-playground:collision", {
    round: 1,
    best: 0,
  });
  const { round, best } = progress;
  const [attempts, setAttempts] = useState(0);
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
   * The hashes update live as you type, so counting digests counted
   * keystrokes: editing "hello" into "hello9" scored six attempts for one
   * guess. Waiting for the pair to settle makes the number mean what the label
   * says.
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

  if (!hashA || !hashB) return null;

  const nextRound = () => saveProgress({ round: Math.min(round + 1, MAX_ROUND) });

  return (
    <Stage
      width="full"
      caption={c.caption}
      announcement={
        sameInput
          ? c.identical
          : c.announce(settledMatched, HEX_CHARS, best, round)
      }
      viewport={
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <MessageField value={inputA} onChange={setInputA} label={c.inputA} />
            <MessageField value={inputB} onChange={setInputB} label={c.inputB} />
          </div>

          {sameInput ? (
            <p className="rounded border border-signal-amber/30 bg-signal-amber/10 px-4 py-3 text-body-sm text-signal-amber">
              {c.identical}
            </p>
          ) : (
            <div className="space-y-2">
              {[hashA, hashB].map((hex, row) => (
                <p
                  key={row}
                  className="select-all break-all font-mono text-body-sm leading-relaxed tracking-wide"
                >
                  {/* The shared prefix is underlined as well as coloured. */}
                  <span className="text-data underline decoration-2 underline-offset-2">
                    {hex.slice(0, matched)}
                  </span>
                  <span className="text-fg-faint">{hex.slice(matched)}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      }
      readout={
        /* The ladder: how far the shared prefix reaches, and where this round
           wants it to reach. Filled cells are the match; the outlined cell is
           the target. */
        <div
          role="img"
          aria-label={c.ladderLabel(matched, HEX_CHARS, round)}
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${HEX_CHARS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: HEX_CHARS }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-3 rounded-[2px]",
                i < matched && !sameInput
                  ? "bg-data"
                  : i < round
                    ? "bg-ink-700 ring-1 ring-inset ring-accent/60"
                    : "bg-ink-700",
              )}
            />
          ))}
        </div>
      }
      primary={
        <div className="space-y-2">
          <p className="text-caption text-fg-muted">{c.target(round, odds(round))}</p>
          <Button
            onClick={nextRound}
            disabled={!cleared || round >= MAX_ROUND}
            className="min-h-[44px] w-full"
          >
            {round >= MAX_ROUND
              ? c.maxRound
              : cleared
                ? c.nextRound(round + 1)
                : c.keepTrying}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure
            label={c.matchedLabel}
            value={sameInput ? "—" : `${matched} / ${HEX_CHARS}`}
            tone={cleared ? "accent" : "default"}
          />
          <Figure label={c.roundLabelFull} value={`${round} / ${MAX_ROUND}`} hint={c.oddsHint(odds(round))} />
          <Figure label={c.bestLabel} value={String(best)} />
          <Figure label={c.attemptsLabel} value={formatNumber(attempts, 0)} />
        </>
      }
    />
  );
}
