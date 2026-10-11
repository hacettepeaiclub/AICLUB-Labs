import { useEffect, useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import { formatNumber } from "@/lib/format";
import { ranked, type Attention } from "../engine";
import { peak, percent, scaleComparison, sharesAt } from "../view";
import { TokenPicker } from "./TokenPicker";

/** The divisor's track, in hundredths: from no division at all to twice √dK. */
const TRACK_MIN = 100;

export interface ScaleStageProps {
  attention: Attention;
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * §3 — what the `/ √d_k` actually buys, by turning it.
 *
 * This is the one step in the pipeline whose effect is invisible in the
 * result: you cannot see what the division did by looking at the answer, only
 * by changing it. So the visitor holds the divisor, from ÷1 (no division) to
 * twice what the model uses, and the shares are recomputed from the model's
 * own undivided matches on every move. Near ÷1 the budget collapses onto one
 * word; at ÷√d_k it is the row the rest of the lab draws; further out it
 * flattens towards an even split.
 *
 * Both ends are real arithmetic. `scaleComparison` recovers the undivided
 * matches exactly, `sharesAt` runs the engine's own softmax over them, and
 * nothing here feeds back into the lab: `attention.weights` stays the single
 * source for every other figure on the page. A faint tick on every bar marks
 * the model's own share, so the divisor's effect is always read against it.
 */
export function ScaleStage({ attention, words, selected, onSelect }: ScaleStageProps) {
  const a = useLabCopy("attention");
  const scale = a.scale;

  const comparison = scaleComparison(attention, selected);
  const modelTrack = Math.round(comparison.root * 100);
  const [track, setTrack] = useState(modelTrack);
  useEffect(() => setTrack(modelTrack), [modelTrack, selected]);

  const divisor = track / 100;
  const shares = useMemo(() => sharesAt(comparison.raw, divisor), [comparison.raw, divisor]);
  const order = ranked(attention, selected)
    .slice(0, 5)
    .map((entry) => entry.index);

  const atModel = track === modelTrack;
  const atNone = track === TRACK_MIN;

  return (
    <Stage
      width="full"
      caption={scale.note}
      announcement={scale.announce(formatNumber(divisor, 2), a.percent(percent(peak(shares))))}
      viewport={
        <div className="space-y-3 rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
          <ul className="space-y-2">
            {order.map((index) => (
              <li
                key={index}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.75rem] items-center gap-3 sm:grid-cols-[6rem_minmax(0,1fr)_3rem]"
              >
                <span className="truncate font-mono text-caption text-fg-muted">
                  {words[index]}
                </span>
                <span aria-hidden className="relative h-3 rounded-pill bg-line/10">
                  <span
                    className="absolute inset-y-0 left-0 rounded-pill bg-accent transition-[width] duration-fast"
                    style={{ width: `${Math.max((shares[index] ?? 0) * 100, 1)}%` }}
                  />
                  {/* The model's own share: ÷√d_k. */}
                  <span
                    className="absolute -inset-y-1 w-0.5 rounded-pill bg-fg/70"
                    style={{ left: `${(comparison.weights[index] ?? 0) * 100}%` }}
                  />
                </span>
                <span className="text-right font-mono text-caption tabular-nums text-fg">
                  {a.percent(percent(shares[index] ?? 0))}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-caption text-fg-faint">{scale.legend}</p>
          {/* Wrapped: a table ignores the 1px box `sr-only` gives it and
              would widen the page on a phone. */}
          <div className="sr-only">
            <table>
              <caption>{scale.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{a.trace.colToken}</th>
                  <th scope="col">{scale.colRaw}</th>
                  <th scope="col">{scale.colWith}</th>
                  <th scope="col">{scale.colNow}</th>
                </tr>
              </thead>
              <tbody>
                {order.map((index) => (
                  <tr key={index}>
                    <td>{words[index]}</td>
                    <td>{formatNumber(comparison.raw[index] ?? 0, 2)}</td>
                    <td>{a.percent(percent(comparison.weights[index] ?? 0))}</td>
                    <td>{a.percent(percent(shares[index] ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-body-sm text-fg-muted">
            {atNone
              ? scale.collapse
              : atModel
                ? scale.atModel
                : divisor < comparison.root
                  ? scale.sharper
                  : scale.flatter}
          </p>
        </div>
      }
      primary={
        <div className="space-y-2">
          <LabSlider
            label={scale.divisorLabel}
            value={track}
            min={TRACK_MIN}
            max={modelTrack * 2}
            step={5}
            onChange={setTrack}
            format={(v) => scale.divisorValue(formatNumber(v / 100, 2))}
            valueText={(v) => scale.divisorValue(formatNumber(v / 100, 2))}
          />
          <div className="flex justify-between text-caption text-fg-faint">
            <button
              type="button"
              onClick={() => setTrack(TRACK_MIN)}
              className="underline decoration-line/30 underline-offset-2 hover:text-fg"
            >
              {scale.noneMark}
            </button>
            <button
              type="button"
              onClick={() => setTrack(modelTrack)}
              className="underline decoration-line/30 underline-offset-2 hover:text-fg"
            >
              {scale.modelMark(formatNumber(comparison.root, 2))}
            </button>
          </div>
        </div>
      }
      secondary={
        <TokenPicker label={a.pickLabel} words={words} selected={selected} onSelect={onSelect} />
      }
      secondaryLabel={a.softmax.pickAnother}
      figures={
        <>
          <Figure label={a.figures.divisor} value={formatNumber(divisor, 2)} />
          <Figure
            label={a.figures.peakWith}
            value={a.percent(percent(peak(shares)))}
            tone="accent"
            hint={scale.peakNowHint}
          />
          <Figure
            label={scale.peakModelLabel}
            value={a.percent(percent(peak(comparison.weights)))}
            hint={scale.peakModelHint}
          />
        </>
      }
    />
  );
}
