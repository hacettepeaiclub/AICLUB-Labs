import { Figure, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { ranked, type Attention } from "../engine";
import { peak, percent, scaleComparison } from "../view";
import { TokenPicker } from "./TokenPicker";

export interface ScaleStageProps {
  attention: Attention;
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * §3 — what the `/ √d_k` actually buys.
 *
 * This is the one step in the pipeline whose effect is invisible in the result:
 * you cannot see what the division did by looking at the answer, only by taking
 * it away. So the stage runs both — the row the rest of the lab uses, and the
 * same scores pushed through the engine's own softmax *without* the division —
 * and puts them side by side.
 *
 * Both columns are real arithmetic on real numbers. Nothing here feeds back
 * into the lab: `attention.weights` remains the single source for every other
 * figure on the page, and the undivided column exists only in this stage.
 */
export function ScaleStage({ attention, words, selected, onSelect }: ScaleStageProps) {
  const a = useT().labs.attention;
  const scale = a.scale;

  const comparison = scaleComparison(attention, selected);
  const order = ranked(attention, selected)
    .slice(0, 5)
    .map((entry) => entry.index);

  const peakScaled = peak(comparison.weights);
  const peakRaw = peak(comparison.weightsUnscaled);

  return (
    <Stage
      width="full"
      caption={scale.note}
      viewport={
        <div className="overflow-x-auto rounded border border-line/10 bg-ink-950 p-4">
          <table className="w-full min-w-[26rem] border-collapse text-body-sm">
            <caption className="sr-only">{scale.tableCaption}</caption>
            <thead>
              <tr className="text-overline uppercase text-fg-faint">
                <th scope="col" className="py-1.5 text-left font-normal">
                  {a.trace.colToken}
                </th>
                <th scope="col" className="py-1.5 text-right font-normal">
                  {scale.colRaw}
                </th>
                <th scope="col" className="py-1.5 text-right font-normal">
                  {scale.colScaled}
                </th>
                <th scope="col" className="py-1.5 text-right font-normal">
                  {scale.colWithout}
                </th>
                <th scope="col" className="py-1.5 text-right font-normal">
                  {scale.colWith}
                </th>
              </tr>
            </thead>
            <tbody>
              {order.map((index) => {
                const withShare = comparison.weights[index] ?? 0;
                const withoutShare = comparison.weightsUnscaled[index] ?? 0;
                return (
                  <tr key={index} className="border-t border-line/10">
                    <td className="py-2 font-mono text-fg">{words[index]}</td>
                    <td className="py-2 text-right font-mono tabular-nums text-fg-muted">
                      {formatNumber(comparison.raw[index] ?? 0, 2)}
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums text-fg-muted">
                      {formatNumber(comparison.scaled[index] ?? 0, 2)}
                    </td>
                    {/* The undivided column is the counterfactual, so it is the
                        quiet one; the column the model actually uses is the
                        emphasised one. */}
                    <td className="py-2 text-right font-mono tabular-nums text-fg-faint">
                      {a.percent(percent(withoutShare))}
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums text-fg">
                      {a.percent(percent(withShare))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-body-sm text-fg-muted">{scale.collapse}</p>
        </div>
      }
      primary={
        <TokenPicker label={a.pickLabel} words={words} selected={selected} onSelect={onSelect} />
      }
      figures={
        <>
          <Figure label={a.figures.axes} value={String(attention.dK)} />
          <Figure label={a.figures.divisor} value={formatNumber(comparison.root, 2)} />
          <Figure label={a.figures.peakWith} value={a.percent(percent(peakScaled))} tone="accent" />
          <Figure label={a.figures.peakWithout} value={a.percent(percent(peakRaw))} />
        </>
      }
    />
  );
}
