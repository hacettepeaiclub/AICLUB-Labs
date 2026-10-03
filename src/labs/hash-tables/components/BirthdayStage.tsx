import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLabs } from "@/i18n/labs";
import { createRng } from "@/lib/random";
import { collisionChance, evenOdds } from "../engine";
import { Guess } from "./Guess";

type Size = "16" | "365" | "1000";
const SIZES: readonly Size[] = ["16", "365", "1000"];

/** One trial, kept whole so the grid can show where each key fell. */
interface Trial {
  readonly m: number;
  readonly order: readonly number[];
}

function throwKeys(m: number, seed: number): Trial {
  const rng = createRng(seed);
  const seen = new Uint8Array(m);
  const order: number[] = [];
  for (;;) {
    const b = Math.floor(rng() * m);
    order.push(b);
    if (seen[b]) return { m, order };
    seen[b] = 1;
  }
}

/**
 * Section 2: collisions come early, far earlier than intuition says.
 *
 * Guessed before shown, because the number is the lesson: with 365 buckets,
 * 23 keys are enough for a shared bucket to be more likely than not. The
 * curve is the exact product 1 − Π(1 − i/m), and the grid beside it throws
 * real keys until the first collision, so the visitor can watch a collision
 * arrive with most of the table still empty.
 */
export function BirthdayStage() {
  const lab = useLabs()["hash-tables"];
  const t = lab.birthday;
  const [guess, setGuess] = useState<"23" | "92" | "183" | null>(null);
  const [size, setSize] = useState<Size>("365");
  const m = Number(size);
  const half = evenOdds(m);
  const [n, setN] = useState(23);
  const keys = Math.min(n, m + 1);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [seed, setSeed] = useState(1);
  const [history, setHistory] = useState<number[]>([]);

  const max = Math.min(m + 1, half * 3);
  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let k = 0; k <= max; k++) {
      pts.push(
        `${((k / max) * 100).toFixed(2)},${(60 - collisionChance(k, m) * 56 - 2).toFixed(2)}`,
      );
    }
    return pts.join(" ");
  }, [m, max]);

  const p = collisionChance(keys, m);
  const throwOnce = () => {
    const next = throwKeys(m, seed * 7919 + m);
    setSeed((s) => s + 1);
    setTrial(next);
    setHistory((h) => [...h, next.order.length]);
  };
  const within = history.filter((k) => k <= half).length;

  const pick = (s: Size) => {
    setSize(s);
    setN(evenOdds(Number(s)));
    setTrial(null);
    setHistory([]);
  };

  const shown = trial && trial.m === m ? trial : null;
  const hits = new Set(shown?.order.slice(0, -1));
  const last = shown?.order.at(-1);
  const cols = m === 16 ? 8 : m === 365 ? 25 : 40;

  return (
    <div className="space-y-6">
      <Guess
        question={t.question}
        options={[
          { value: "23", label: "23" },
          { value: "92", label: "92" },
          { value: "183", label: "183" },
        ]}
        chosen={guess}
        onChoose={setGuess}
        answer={t.answer}
        copy={{ ...t.guess, correct: "23" }}
      />

      <Stage
        width="wide"
        caption={t.caption}
        announcement={t.announce(keys, lab.percent((p * 100).toFixed(1)))}
        viewport={
          <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
            <div>
              <p className="text-overline uppercase text-fg-faint">{t.curveTitle(m)}</p>
              <svg
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                role="img"
                aria-label={t.curveLabel(m, half)}
                className="mt-2 block h-40 w-full"
              >
                <line
                  x1={0}
                  y1={30}
                  x2={100}
                  y2={30}
                  className="stroke-line/20"
                  strokeWidth={0.3}
                  strokeDasharray="1 1"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={0}
                  y1={58}
                  x2={100}
                  y2={58}
                  className="stroke-line/20"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
                <polyline
                  points={curve}
                  className="fill-none stroke-accent"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={(keys / max) * 100}
                  x2={(keys / max) * 100}
                  y1={2}
                  y2={58}
                  className="stroke-data"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="mt-1 flex justify-between font-mono text-caption text-fg-faint">
                <span>0</span>
                <span>{t.axis}</span>
                <span>{max}</span>
              </div>
            </div>

            <div className="border-t border-line/10 pt-4">
              <p className="text-overline uppercase text-fg-faint">{t.gridTitle(m)}</p>
              <div
                role="img"
                aria-label={shown ? t.gridLabel(shown.order.length, m) : t.gridEmpty}
                className="mt-2 grid gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: m }, (_, b) => (
                  <span
                    key={b}
                    className={
                      b === last
                        ? "aspect-square rounded-[1px] bg-signal-amber"
                        : hits.has(b)
                          ? "aspect-square rounded-[1px] bg-accent"
                          : "aspect-square rounded-[1px] bg-fg/10"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-caption text-fg-muted">
                {shown ? t.trialLine(shown.order.length, m - hits.size) : t.gridEmpty}
              </p>
            </div>
          </div>
        }
        primary={
          <div className="space-y-4">
            <LabSlider label={t.keysLabel} value={keys} min={1} max={max} onChange={setN} />
            <Button onClick={throwOnce} className="min-h-[44px] w-full">
              {t.throw}
            </Button>
          </div>
        }
        secondary={
          <Segmented
            label={t.sizeLabel}
            value={size}
            options={SIZES.map((s) => ({ value: s, label: s }))}
            onChange={pick}
          />
        }
        secondaryLabel={t.secondaryLabel}
        figures={
          <>
            <Figure
              label={t.figures.chance}
              value={lab.percent((p * 100).toFixed(1))}
              hint={t.figures.chanceHint(keys)}
              tone="accent"
            />
            <Figure label={t.figures.even} value={String(half)} hint={t.figures.evenHint(m)} />
            <Figure
              label={t.figures.trials}
              value={history.length ? `${within} / ${history.length}` : "—"}
              hint={t.figures.trialsHint(half)}
            />
          </>
        }
      />
    </div>
  );
}
