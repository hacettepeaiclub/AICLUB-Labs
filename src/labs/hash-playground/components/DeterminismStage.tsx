import { useCallback, useEffect, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { sha256Hex } from "../hashUtils";
import { DigestPanel } from "./DigestPanel";

export interface DeterminismStageProps {
  /** The message section 1 is hashing. This section re-hashes the same string. */
  input: string;
}

/** Enough runs to make the point; more would just be a longer identical list. */
const MAX_RUNS = 5;

/**
 * Section 2: the same message, hashed again.
 *
 * ## Why this section exists
 *
 * Determinism used to be a claim on a card — "Hash 'hello' today, tomorrow, on
 * any machine on Earth" — sitting in a grid of four such claims. A property you
 * are told is a property you have to take on trust, which is the opposite of
 * how this collection works.
 *
 * So it is an interaction now. Press the button and the message is hashed
 * again, for real, through `crypto.subtle` — a fresh call each time, nothing
 * cached and nothing copied from the run before. The list grows and the
 * digests stay identical, and the figure that counts *distinct* results stays
 * at one no matter how many times you press.
 *
 * Editing the message clears the list, because a run of the old message is not
 * evidence about the new one.
 */
export function DeterminismStage({ input }: DeterminismStageProps) {
  const t = useT().labs["hash-playground"];
  const [runs, setRuns] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  // A run of the previous message says nothing about this one.
  useEffect(() => {
    setRuns([]);
  }, [input]);

  const hashAgain = useCallback(() => {
    setBusy(true);
    void sha256Hex(input)
      .then((hex) => {
        setRuns((current) => (current.length >= MAX_RUNS ? current : [...current, hex]));
      })
      .finally(() => setBusy(false));
  }, [input]);

  const distinct = new Set(runs).size;

  return (
    <Stage
      width="wide"
      caption={t.determinism.caption}
      announcement={
        runs.length === 0 ? "" : t.determinism.announce(runs.length, distinct)
      }
      viewport={
        <div className="space-y-3">
          {runs.length === 0 ? (
            <p className="rounded border border-line/10 bg-ink-950 px-4 py-6 text-center text-body-sm text-fg-muted">
              {t.determinism.empty}
            </p>
          ) : (
            <ol className="space-y-2">
              {runs.map((hex, i) => (
                <li key={i} className="rounded border border-line/10 bg-ink-950 p-3">
                  <DigestPanel hex={hex} label={t.determinism.run(i + 1)} />
                </li>
              ))}
            </ol>
          )}
        </div>
      }
      primary={
        <Button
          onClick={hashAgain}
          disabled={busy || runs.length >= MAX_RUNS}
          className="min-h-[44px] w-full"
        >
          {runs.length >= MAX_RUNS ? t.determinism.enough : t.determinism.hashAgain}
        </Button>
      }
      figures={
        <>
          <Figure label={t.determinism.runsLabel} value={String(runs.length)} />
          <Figure
            label={t.determinism.distinctLabel}
            value={runs.length === 0 ? "—" : String(distinct)}
            tone={runs.length > 1 && distinct === 1 ? "accent" : "default"}
            hint={t.determinism.distinctHint}
          />
        </>
      }
    />
  );
}
