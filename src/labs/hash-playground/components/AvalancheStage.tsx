import { useId } from "react";
import { Figure, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { useDebouncedValue } from "@/hooks";
import { HASH_BITS } from "../hashUtils";
import { BitGrid } from "./BitGrid";
import { DigestPanel } from "./DigestPanel";
import { MessageField } from "./MessageField";

export interface AvalancheStageProps {
  input: string;
  onInputChange: (value: string) => void;
  /** The digest before the most recent edit, or null before there is one. */
  prev: string | null;
  current: string;
  changedChars: readonly boolean[];
  bits: readonly number[];
  changedBits: readonly boolean[];
  changedCount: number;
}

/**
 * Section 3: change one character.
 *
 * The two digests are stacked in the order they happened, with every character
 * that differs marked in both — struck through in the one that is gone,
 * underlined and live-coloured in the one that replaced it. Beside them the
 * same difference at bit resolution.
 *
 * ## Everything here is measured
 *
 * `changedCount` is `countChangedBits(prev, current)` over two real SHA-256
 * digests, and the percentage is that count over 256. No figure on this stage
 * is a stand-in, an easing curve or an approximation — which matters more here
 * than anywhere else in the lab, because "about half the bits flip" is exactly
 * the kind of claim a decorative counter could quietly fake.
 *
 * ## Its own copy of the field
 *
 * The message field is mounted here as well as in section 1, against the same
 * state. The instruction is "change one character", and asking someone to
 * scroll two sections up to do it would put the cause and the effect on
 * different screens.
 */
export function AvalancheStage({
  input,
  onInputChange,
  prev,
  current,
  changedChars,
  bits,
  changedBits,
  changedCount,
}: AvalancheStageProps) {
  const t = useT().labs["hash-playground"];
  const helpId = useId();
  const settled = useDebouncedValue(changedCount);
  const percent = Math.round((changedCount / HASH_BITS) * 100);
  const settledPercent = Math.round((settled / HASH_BITS) * 100);

  return (
    <Stage
      width="full"
      caption={t.avalanche.caption}
      announcement={prev ? t.avalanche.announce(settled, HASH_BITS, settledPercent) : ""}
      viewport={
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:items-start">
          {prev ? (
            <div className="min-w-0 space-y-3">
              <DigestPanel
                hex={prev}
                changed={changedChars}
                tone="old"
                label={t.avalanche.before}
              />
              <div aria-hidden className="flex items-center gap-3">
                <span className="font-mono text-caption text-fg-faint">↓</span>
                <span className="h-px flex-1 bg-line/10" />
              </div>
              <DigestPanel
                hex={current}
                changed={changedChars}
                tone="new"
                label={t.avalanche.after}
              />
            </div>
          ) : (
            <p className="rounded border border-line/10 bg-ink-950 px-4 py-8 text-center text-body-sm text-fg-muted">
              {t.avalanche.editPrompt}
            </p>
          )}
          <BitGrid bits={bits} changed={changedBits} />
        </div>
      }
      readout={
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-fg-faint">
          <span>
            <span
              aria-hidden
              className="mr-1.5 inline-block size-2.5 rounded-[2px] bg-accent align-middle"
            />
            {t.bits.legendOne}
          </span>
          <span>
            <span
              aria-hidden
              className="mr-1.5 inline-block size-2.5 rounded-[2px] bg-ink-700 align-middle"
            />
            {t.bits.legendZero}
          </span>
          <span>
            <span
              aria-hidden
              className="mr-1.5 inline-block size-2.5 rounded-[2px] bg-data align-middle ring-1 ring-data"
            />
            {t.bits.legendChanged}
          </span>
        </p>
      }
      primary={
        <div>
          <MessageField
            value={input}
            onChange={onInputChange}
            label={t.avalanche.fieldLabel}
            describedBy={helpId}
          />
          <p id={helpId} className="sr-only">
            {t.avalanche.help}
          </p>
        </div>
      }
      figures={
        <>
          <Figure
            label={t.figures.bitsChanged}
            value={prev ? `${changedCount} / ${HASH_BITS}` : "—"}
            tone="accent"
          />
          <Figure label={t.figures.percentChanged} value={prev ? `${percent}%` : "—"} hint={t.figures.expectedHalf} />
          <Figure
            label={t.figures.charsChanged}
            value={prev ? String(changedChars.filter(Boolean).length) : "—"}
            hint={t.figures.ofSixtyFour}
          />
        </>
      }
    />
  );
}
