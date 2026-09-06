import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { keyOf, outputOf, queryOf, ranked, rowScores, rowWeights, type Attention } from "../engine";
import { percent } from "../view";

/** The three query/key axes worth showing. The other three are position and
 *  the two "not looking for this" axes, which would crowd the picture. */
const QK_SHOWN = [0, 1, 3] as const;

export interface AttentionTraceProps {
  attention: Attention;
  words: readonly string[];
  selected: number;
}

/**
 * One causal chain, bound live to whatever is selected in section 1.
 *
 * Not six definitions in six panels: a single path from the selected token to
 * the one it leans on hardest, with each term named as it is passed. Every
 * number is read out of the same `Attention` object the sentence above is
 * drawn from — there is one calculation in this lab, and this is a second view
 * of it rather than a second version of it.
 */
export function AttentionTrace({ attention, words, selected }: AttentionTraceProps) {
  const t = useT();
  const a = t.labs.attention;
  const trace = a.trace;

  const list = ranked(attention, selected);
  const best = list[0];
  if (!best) return null;

  const target = best.index;
  const selectedWord = words[selected] ?? "";
  const targetWord = words[target] ?? "";

  const q = queryOf(attention, selected);
  const k = keyOf(attention, target);
  const score = rowScores(attention, selected)[target] ?? 0;
  const weight = rowWeights(attention, selected)[target] ?? 0;
  const out = outputOf(attention, selected);

  const axisNames = [trace.axes.nounness, trace.axes.animacy, trace.axes.verbness];
  const qValues = QK_SHOWN.map((i) => q[i] ?? 0);
  const kValues = QK_SHOWN.map((i) => k[i] ?? 0);
  const qkScale = Math.max(1e-6, ...qValues.map(Math.abs), ...kValues.map(Math.abs));
  const outValues = [out[0] ?? 0, out[1] ?? 0, out[2] ?? 0];
  const outScale = Math.max(1e-6, ...outValues.map(Math.abs));

  return (
    <div className="space-y-4">
      <Step index={1} kicker={trace.step1} title={trace.step1Title(selectedWord)}>
        <p className="text-body-sm text-fg-muted">{trace.step1Note}</p>
      </Step>

      <Step index={2} kicker={trace.step2} title={trace.step2Title(selectedWord)}>
        <Bars names={axisNames} values={qValues} scale={qkScale} signed />
        <p className="mt-3 text-body-sm text-fg-muted">{trace.step2Note}</p>
      </Step>

      <Step index={3} kicker={trace.step3} title={trace.step3Title(targetWord)}>
        <Bars names={axisNames} values={kValues} scale={qkScale} signed />
        <p className="mt-3 text-body-sm text-fg-muted">{trace.step3Note}</p>
      </Step>

      <Step index={4} kicker={trace.step4} title={trace.step4Title(formatNumber(score, 2))}>
        <p className="text-body-sm text-fg-muted">{trace.step4Note(selectedWord, targetWord)}</p>
      </Step>

      <Step index={5} kicker={trace.step5} title={trace.step5Title(percent(weight))}>
        {/* The behavioural point, not the formula: raw matches on the left, the
            same tokens' shares of a fixed 100% on the right. */}
        <table className="w-full border-collapse text-body-sm">
          <caption className="sr-only">{trace.tableCaption}</caption>
          <thead>
            <tr className="text-overline uppercase text-fg-faint">
              <th scope="col" className="py-1.5 text-left font-normal">
                {trace.colToken}
              </th>
              <th scope="col" className="py-1.5 text-right font-normal">
                {trace.colScore}
              </th>
              <th scope="col" className="py-1.5 text-right font-normal">
                {trace.colShare}
              </th>
            </tr>
          </thead>
          <tbody>
            {list.slice(0, 4).map((entry) => (
              <tr key={entry.index} className="border-t border-line/10">
                <td className="py-2 font-mono text-fg">{words[entry.index]}</td>
                <td className="py-2 text-right font-mono tabular-nums text-fg-muted">
                  {formatNumber(rowScores(attention, selected)[entry.index] ?? 0, 2)}
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-fg">
                  {a.percent(percent(entry.weight))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-body-sm text-fg-muted">{trace.step5Note}</p>
      </Step>

      <Step index={6} kicker={trace.step6} title={trace.step6Title(selectedWord)}>
        <Bars names={axisNames} values={outValues} scale={outScale} />
        <p className="mt-3 text-body-sm text-fg-muted">{trace.step6Note}</p>
      </Step>
    </div>
  );
}

function Step({
  index,
  kicker,
  title,
  children,
}: {
  index: number;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative rounded-card border border-line/10 bg-ink-900 p-5">
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden
          className="grid size-6 shrink-0 place-items-center rounded-pill bg-accent-fill font-mono text-overline text-accent-fg"
        >
          {index}
        </span>
        <div className="min-w-0">
          <p className="text-overline uppercase text-fg-faint">{kicker}</p>
          <h3 className="mt-1 text-body-lg text-fg">{title}</h3>
        </div>
      </div>
      <div className="mt-4 pl-9">{children}</div>
    </section>
  );
}

/**
 * A small row of labelled bars.
 *
 * `signed` draws from a centre line, because a query can genuinely ask for the
 * *absence* of a property — a pronoun is not looking for a verb — and drawing
 * that as a short positive bar would invert the meaning.
 */
function Bars({
  names,
  values,
  scale,
  signed = false,
}: {
  names: readonly string[];
  values: readonly number[];
  scale: number;
  signed?: boolean;
}) {
  return (
    <ul className="space-y-2">
      {names.map((name, i) => {
        const value = values[i] ?? 0;
        const width = (Math.abs(value) / scale) * (signed ? 50 : 100);
        return (
          <li key={name} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-caption text-fg-muted">{name}</span>
            <span aria-hidden className="relative h-2 flex-1 rounded-pill bg-line/10">
              {signed && <span className="absolute inset-y-0 left-1/2 w-px bg-line/20" />}
              <span
                className={cn(
                  "absolute inset-y-0 rounded-pill",
                  value < 0 ? "bg-fg-faint" : "bg-accent",
                )}
                style={
                  signed
                    ? value < 0
                      ? { right: "50%", width: `${width}%` }
                      : { left: "50%", width: `${width}%` }
                    : { left: 0, width: `${width}%` }
                }
              />
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-caption tabular-nums text-fg">
              {formatNumber(value, 2)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
