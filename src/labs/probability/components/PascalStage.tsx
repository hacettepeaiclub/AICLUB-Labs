import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import {
  DEFAULT_ROWS,
  MAX_ROWS,
  MIN_ROWS,
  binomialDistribution,
  pascalRow,
  totalPaths,
} from "../engine/pascal";
import type { GaltonWorld } from "../engine/galtonPhysics";
import { percent } from "../view";
import { Coach, Explain } from "./Framing";
import { GaltonCanvas } from "./GaltonCanvas";
import { Prediction } from "./Prediction";

/** Batch sizes. Every one of these is physically simulated, ball by ball. */
const BATCHES = [1, 10, 50, 100] as const;
const SEED = 8675309;

/**
 * Section 5 — two models of the same board, kept apart on purpose.
 *
 * The ideal model counts routes: treat each row as an independent fair step
 * and the share arriving at each bin is C(n,k)/2^n, which is `pascal.ts`. The
 * physical model has no steps in it at all: a ball is released, gravity pulls,
 * and Matter.js resolves each contact against a static peg. That is
 * `galtonPhysics.ts`, and the bin it reports is wherever the ball stopped.
 *
 * The two do not agree, and the section is built so that they visibly do not.
 * Measured on this board the physical outcomes sit more often in the middle
 * bins than the ideal model predicts, because a real ball loses sideways speed
 * to friction on every contact and is nudged back towards the centre. Neither
 * column is an error, and neither is tuned to flatter the other: the ideal one
 * is arithmetic, the physical one is whatever the simulation did.
 *
 * ## Nothing here is a coin flip
 *
 * The observed column is filled only by balls that physically landed. There is
 * no aggregate shortcut behind it, which is why the batch sizes stop at a
 * hundred rather than pretending about five hundred.
 */
export function PascalStage() {
  const copy = useT().labs.probability;
  const p = copy.pascal;
  const reduced = useReducedMotion() ?? false;

  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [counts, setCounts] = useState<number[]>(() => new Array(DEFAULT_ROWS + 1).fill(0));
  const [dropped, setDropped] = useState(0);
  const [queued, setQueued] = useState(0);
  const [paintKey, setPaintKey] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);
  const worldRef = useRef<GaltonWorld | null>(null);

  const theoretical = useMemo(() => binomialDistribution(rows), [rows]);
  const triangle = useMemo(() => pascalRow(rows), [rows]);
  const paths = totalPaths(rows);
  const answered = guess !== null;

  const record = useCallback((bins: number[]) => {
    if (bins.length === 0) return;
    setCounts((current) => {
      const next = [...current];
      for (const bin of bins) next[bin] = (next[bin] ?? 0) + 1;
      return next;
    });
    setDropped((n) => n + bins.length);
    setQueued((n) => Math.max(0, n - bins.length));
  }, []);

  const onReady = useCallback((world: GaltonWorld) => {
    worldRef.current = world;
  }, []);

  const drop = (count: number) => {
    const world = worldRef.current;
    if (!world) return;
    world.queue(count);
    if (!reduced) {
      setQueued((n) => n + count);
      return;
    }
    // Motion is reduced: run the same physics to completion now, and repaint
    // the board once. Same engine, same numbers, no falling to watch.
    const bins: number[] = [];
    let guard = 0;
    while (world.busy && guard < 40_000) {
      bins.push(...world.step());
      guard += 1;
    }
    record(bins);
    setPaintKey((key) => key + 1);
  };

  const rebuild = (nextRows: number) => {
    setRows(nextRows);
    setCounts(new Array(nextRows + 1).fill(0));
    setDropped(0);
    setQueued(0);
    setPaintKey((key) => key + 1);
  };

  const peakBin = theoretical.reduce(
    (best, value, index) => (value > (theoretical[best] ?? 0) ? index : best),
    0,
  );
  const busiest = counts.reduce((best, value, index) => (value > (counts[best] ?? 0) ? index : best), 0);

  const coach = [
    { q: p.coach.twoModels.q, a: p.coach.twoModels.a },
    { q: p.coach.whyDiffer.q, a: p.coach.whyDiffer.a },
    { q: p.coach.whyMiddle.q, a: p.coach.whyMiddle.a(String(triangle[peakBin] ?? 0), String(paths)) },
  ];

  return (
    <>
      <Stage
        width="full"
        caption={p.caption}
        announcement={dropped > 0 ? p.announce(dropped, busiest) : ""}
        viewport={
          <div className="space-y-3">
            <GaltonCanvas
              rows={rows}
              worldKey={`${rows}-${paintKey === 0 ? 0 : paintKey}-${SEED}`}
              seed={SEED}
              onOutcome={record}
              onReady={onReady}
              reduced={reduced}
              paintKey={paintKey}
              label={dropped > 0 ? p.boardLabel(dropped, rows) : p.boardEmptyLabel(rows)}
            />

            {/* Two models, one table, never merged into a single curve. The
                left pair of columns is arithmetic; the right pair is whatever
                the simulation did. */}
            {dropped > 0 && (
              <div className="overflow-x-auto rounded border border-line/10 bg-ink-950 p-4">
                <table className="w-full border-collapse text-caption">
                  <caption className="sr-only">{p.tableCaption(rows, dropped)}</caption>
                  <thead>
                    <tr className="text-fg-faint">
                      <th scope="col" className="py-1 pr-3 text-left font-normal">
                        {p.binColumn}
                      </th>
                      <th scope="col" className="py-1 pr-3 text-right font-normal">
                        {p.pathsColumn}
                      </th>
                      <th scope="col" className="py-1 pr-4 text-right font-normal">
                        {p.idealColumn}
                      </th>
                      <th scope="col" className="py-1 pr-3 text-right font-normal">
                        {p.physicalColumn}
                      </th>
                      <th scope="col" className="w-2/5 py-1 text-left font-normal">
                        {p.shapeColumn}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {theoretical.map((expected, bin) => {
                      const observed = (counts[bin] ?? 0) / dropped;
                      const widest = Math.max(...theoretical, ...counts.map((c) => c / dropped));
                      return (
                        <tr key={bin} className="border-t border-line/10">
                          <th
                            scope="row"
                            className="py-1 pr-3 text-left font-mono font-normal tabular-nums text-fg-muted"
                          >
                            {bin}
                          </th>
                          <td className="py-1 pr-3 text-right font-mono tabular-nums text-fg">
                            {triangle[bin]}
                          </td>
                          <td className="py-1 pr-4 text-right font-mono tabular-nums text-accent">
                            {percent(expected)}
                          </td>
                          <td className="py-1 pr-3 text-right font-mono tabular-nums text-fg">
                            {percent(observed)}
                          </td>
                          <td className="py-1">
                            <span className="block h-2">
                              <span
                                aria-hidden
                                className="block h-1 rounded-pill bg-accent/60"
                                style={{ width: `${(expected / widest) * 100}%` }}
                              />
                            </span>
                            <span className="block h-2">
                              <span
                                aria-hidden
                                className="block h-1 rounded-pill bg-fg/45"
                                style={{ width: `${(observed / widest) * 100}%` }}
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-3 text-caption text-fg-faint">{p.legend}</p>
              </div>
            )}
          </div>
        }
        readout={
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-body-sm text-fg-muted">
              {dropped > 0 ? p.reading(dropped, rows) : p.readingEmpty}
            </p>
            {answered && dropped > 0 && (
              <Explain
                what={p.explainWhat}
                why={p.explainWhy}
                maths={p.explainMaths(rows, String(triangle[peakBin] ?? 0), String(paths))}
                copy={copy.explain}
              />
            )}
          </div>
        }
        primary={
          <div className="space-y-4">
            <Prediction
              question={p.predictQuestion}
              options={[
                { value: "edges", label: p.predict.edges },
                { value: "centre", label: p.predict.centre },
                { value: "even", label: p.predict.even },
              ]}
              chosen={guess}
              onChoose={(value) => {
                setGuess(value);
                if (dropped === 0) drop(1);
              }}
              answer={p.predictAnswer(peakBin, percent(theoretical[peakBin] ?? 0))}
              matched={guess === null ? undefined : guess === "centre"}
              copy={copy.prediction}
            />

            <div className="space-y-2">
              <p className="text-caption text-fg-faint">{p.dropLabel}</p>
              <div className="grid grid-cols-2 gap-2">
                {BATCHES.map((size) => (
                  <Button
                    key={size}
                    variant={size === 1 ? "primary" : "secondary"}
                    onClick={() => drop(size)}
                    className="min-h-11 justify-center"
                  >
                    {p.dropBatch(size)}
                  </Button>
                ))}
              </div>
              <p className="text-caption text-fg-muted">
                {queued > 0 ? p.falling(queued) : p.dropHint}
              </p>
            </div>
          </div>
        }
        figures={
          <>
            <Figure label={p.ballsFigure} value={String(dropped)} hint={p.ballsHint} />
            <Figure label={p.rowsFigure} value={String(rows)} />
            <Figure label={p.pathsFigure} value={String(paths)} hint={p.pathsHint} />
            {answered && dropped > 0 && (
              <Figure
                label={p.peakFigure}
                value={String(busiest)}
                tone="accent"
                hint={p.peakHint(peakBin)}
              />
            )}
          </>
        }
        secondaryLabel={p.boardSettings}
        secondary={
          <div className="space-y-4">
            <div className="space-y-2">
              <LabSlider
                label={p.rowsLabel}
                value={rows}
                min={MIN_ROWS}
                max={MAX_ROWS}
                onChange={rebuild}
                format={() => String(rows)}
                valueText={() => p.rowsValue(rows, String(paths))}
              />
              <p className="text-caption text-fg-muted">{p.rowsHint}</p>
            </div>
            <button
              type="button"
              onClick={() => rebuild(rows)}
              className={cn(
                "min-h-11 w-full rounded border border-line/20 px-4 text-body-sm text-fg",
                "transition-colors duration-fast hover:border-accent/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              )}
            >
              {p.emptyBoard}
            </button>
          </div>
        }
      />
      <Coach label={p.coachLabel} questions={coach} />
    </>
  );
}
