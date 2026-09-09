import { Figure, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { outputOf, ranked, valueOf, type Attention } from "../engine";
import { percent } from "../view";
import { Bars } from "./Bars";
import { TokenPicker } from "./TokenPicker";

export interface MixStageProps {
  attention: Attention;
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * §5 — the shares are spent.
 *
 * The step that separates attention from highlighting: the weights are not a
 * verdict about which word matters, they are the coefficients of a sum. So the
 * stage shows the three heaviest contributors with their own value vectors and
 * their shares, and then the vector those add up to.
 *
 * The contributor rows are the multiplication written out. A visitor reading
 * the animate noun's share beside its value vector can see which axes of the
 * output that word paid for, and that the verb-like component was bought from
 * somewhere else entirely.
 */
export function MixStage({ attention, words, selected, onSelect }: MixStageProps) {
  const a = useT().labs.attention;
  const trace = a.trace;

  const selectedWord = words[selected] ?? "";
  const out = outputOf(attention, selected);
  const axisNames = [trace.axes.nounness, trace.axes.animacy, trace.axes.verbness];
  const outValues = [out[0] ?? 0, out[1] ?? 0, out[2] ?? 0];
  const outScale = Math.max(1e-6, ...outValues.map(Math.abs));

  const contributors = ranked(attention, selected).slice(0, 3);

  return (
    <Stage
      width="full"
      caption={trace.step6Note}
      viewport={
        <div className="space-y-3">
          {/* The multiplication, written out: share × value, per contributor. */}
          <div className="overflow-x-auto rounded border border-line/10 bg-ink-950 p-4">
            <p className="mb-3 text-overline uppercase text-fg-faint">{a.mixLabel}</p>
            <table className="w-full min-w-[22rem] border-collapse text-body-sm">
              <caption className="sr-only">{a.mix.tableCaption}</caption>
              <thead>
                <tr className="text-overline uppercase text-fg-faint">
                  <th scope="col" className="py-1.5 text-left font-normal">
                    {trace.colToken}
                  </th>
                  <th scope="col" className="py-1.5 text-right font-normal">
                    {trace.colShare}
                  </th>
                  {axisNames.map((name) => (
                    <th key={name} scope="col" className="py-1.5 text-right font-normal">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contributors.map((entry) => {
                  const value = valueOf(attention, entry.index);
                  return (
                    <tr key={entry.index} className="border-t border-line/10">
                      <td className="py-2 font-mono text-fg">{words[entry.index]}</td>
                      <td className="py-2 text-right font-mono tabular-nums text-fg">
                        {a.percent(percent(entry.weight))}
                      </td>
                      {axisNames.map((name, axis) => (
                        <td
                          key={name}
                          className="py-2 text-right font-mono tabular-nums text-fg-muted"
                        >
                          {formatNumber(value[axis] ?? 0, 2)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="mb-3 text-overline uppercase text-fg-faint">
              {trace.step6Title(selectedWord)}
            </p>
            <Bars names={axisNames} values={outValues} scale={outScale} label={a.mix.outputLabel} />
          </div>
        </div>
      }
      primary={
        <TokenPicker label={a.pickLabel} words={words} selected={selected} onSelect={onSelect} />
      }
      figures={
        <>
          {axisNames.map((name, axis) => (
            <Figure key={name} label={name} value={formatNumber(outValues[axis] ?? 0, 2)} />
          ))}
        </>
      }
    />
  );
}
