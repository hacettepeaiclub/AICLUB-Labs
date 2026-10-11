import { useEffect, useRef, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useRafLoop } from "@/hooks";
import { useLanguage } from "@/i18n";
import { useLabCopy } from "@/i18n/labs";
import { createRng } from "@/lib/random";
import { cn } from "@/lib/cn";
import { counterRun } from "../engine";
import { formatCount, formatMean } from "../view";

/** Runs per batch: enough for a rate to mean something, few enough to draw each one. */
export const RUNS = 200;
/** How long one thread runs, on average, before the scheduler switches. */
export const SLICES = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000] as const;
export const INCREMENTS = [10, 1_000, 100_000] as const;
type Increments = (typeof INCREMENTS)[number];

/** Time each frame may spend running; the rest of the frame is the page's. */
const FRAME_BUDGET_MS = 8;
/** How often the dots catch up with the runs while a batch is going. */
const COMMIT_MS = 120;

/**
 * Section 3: why buggy code passes its tests.
 *
 * The same two threads, each adding to the counter many times, run two
 * hundred times under a scheduler that switches between them at random. The
 * visitor sets how often it switches and how much work each thread does, and
 * every run lands as a dot: right, or short.
 *
 * Coarse switching — a single core handing over every few milliseconds — and
 * a little work leave almost every run right, which is exactly how a race
 * survives testing. Fine switching, or more work, and it fails nearly every
 * time. Nothing about the code changes between those two pictures.
 *
 * Runs are seeded, so a setting tells the same story twice; "Run again"
 * draws a new seed. Batches are run a slice of a frame at a time, so even the
 * finest switching over a hundred thousand increments never freezes the page.
 */
export function OddsStage() {
  const t = useLabCopy("race-condition").odds;
  const { language } = useLanguage();
  // Index into SLICES. Opens where a single core would be: almost every run
  // right, which is the picture a test suite sees.
  const [slice, setSlice] = useState(5);
  const [increments, setIncrements] = useState<Increments>(1_000);
  const [seed, setSeed] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [running, setRunning] = useState(false);

  const pending = useRef<number[]>([]);
  const rng = useRef(createRng(seed));
  const lastCommit = useRef(0);

  // Any change to the setting or the seed starts a fresh batch.
  useEffect(() => {
    pending.current = [];
    rng.current = createRng(seed * 7919 + slice * 31 + increments);
    lastCommit.current = 0;
    setResults([]);
    setRunning(true);
  }, [slice, increments, seed]);

  useRafLoop(() => {
    const start = performance.now();
    const meanSlice = SLICES[slice]!;
    while (pending.current.length < RUNS && performance.now() - start < FRAME_BUDGET_MS) {
      pending.current.push(counterRun(increments, meanSlice, rng.current));
    }
    const done = pending.current.length >= RUNS;
    if (done || start - lastCommit.current > COMMIT_MS) {
      lastCommit.current = start;
      setResults(pending.current.slice());
    }
    if (done) setRunning(false);
  }, running);

  const target = 2 * increments;
  const right = results.filter((c) => c === target).length;
  const worst = results.reduce((w, c) => Math.max(w, target - c), 0);
  const meanLost =
    results.length === 0 ? 0 : results.reduce((s, c) => s + (target - c), 0) / results.length;
  const complete = results.length === RUNS;
  const sliceLabel = formatCount(SLICES[slice]!, language);

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={
        complete ? t.announce(right, RUNS, formatCount(worst, language), sliceLabel) : ""
      }
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
          <p className="text-caption text-fg-muted">
            {t.setup(formatCount(increments, language), formatCount(target, language), sliceLabel)}
          </p>
          <div
            role="img"
            aria-label={t.dotsLabel(right, results.length)}
            className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 sm:gap-1.5"
          >
            {Array.from({ length: RUNS }, (_, i) => {
              const c = results[i];
              // Shape as well as colour: a right run is a dot, a short one a
              // hollow square.
              return (
                <span
                  key={i}
                  className={cn(
                    "aspect-square",
                    c === undefined
                      ? "rounded-full bg-ink-800"
                      : c === target
                        ? "rounded-full bg-signal-green/80"
                        : "rounded-[2px] border-2 border-signal-amber",
                  )}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-caption text-fg-muted" aria-hidden>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-signal-green/80" />
              {t.legendRight(formatCount(target, language))}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] border-2 border-signal-amber" />
              {t.legendShort}
            </span>
          </div>
          <p className="min-h-[2.5rem] text-body-sm text-fg-muted">
            {!complete
              ? t.running
              : right === RUNS
                ? t.allRight
                : right === 0
                  ? t.noneRight
                  : t.someRight}
          </p>
        </div>
      }
      primary={
        <div className="space-y-4">
          <LabSlider
            label={t.sliceLabel}
            value={slice}
            min={0}
            max={SLICES.length - 1}
            onChange={setSlice}
            format={(v) => t.sliceValue(formatCount(SLICES[v]!, language))}
            valueText={(v) => t.sliceValue(formatCount(SLICES[v]!, language))}
          />
          <Button
            variant="secondary"
            onClick={() => setSeed((s) => s + 1)}
            disabled={running}
            className="w-full"
          >
            {running ? t.runningShort : t.again(RUNS)}
          </Button>
        </div>
      }
      secondary={
        <Segmented
          label={t.incrementsLabel}
          value={String(increments) as `${Increments}`}
          onChange={(v) => setIncrements(Number(v) as Increments)}
          options={INCREMENTS.map((k) => ({
            value: String(k) as `${Increments}`,
            label: formatCount(k, language),
          }))}
        />
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure
            label={t.figures.right}
            value={complete ? `${right} / ${RUNS}` : "—"}
            hint={t.figures.rightHint}
            tone="accent"
          />
          <Figure
            label={t.figures.worst}
            value={complete ? formatCount(worst, language) : "—"}
            hint={t.figures.worstHint}
          />
          <Figure
            label={t.figures.mean}
            value={complete ? formatMean(meanLost, language) : "—"}
            hint={t.figures.meanHint}
          />
        </>
      }
    />
  );
}
