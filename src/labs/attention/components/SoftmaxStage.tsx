import { Figure, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { ranked, rowScores, rowWeights, type Attention } from "../engine";
import { percent } from "../view";
import { TokenPicker } from "./TokenPicker";

/** Weights at or above this are the ones worth counting as "real" shares. */
const NOTABLE = 0.1;

export interface SoftmaxStageProps {
  attention: Attention;
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * §4 — scores become shares.
 *
 * The behavioural point rather than the formula: matches on the left, the same
 * tokens' portions of one fixed 100% on the right. The full row is drawn
 * underneath in sentence order, because the ranked table answers "who won" and
 * only the full row answers "and what did everyone else get" — which is the
 * half that makes a new competitor's effect visible.
 *
 * Every bar is labelled with its own number, so length is never the only
 * channel, and the row is a real `<table>` rather than a picture of one.
 */
export function SoftmaxStage({ attention, words, selected, onSelect }: SoftmaxStageProps) {
  const a = useT().labs.attention;
  const trace = a.trace;

  const list = ranked(attention, selected);
  const row = rowWeights(attention, selected);
  const scores = rowScores(attention, selected);
  const total = [...row].reduce((sum, value) => sum + value, 0);
  const notable = [...row].filter((value) => value >= NOTABLE).length;
  const best = list[0];

  return (
    <Stage
      width="full"
      caption={trace.step5Note}
      viewport={
        <div className="space-y-3">
          <div className="rounded border border-line/10 bg-ink-950 p-4">
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
                      {formatNumber(scores[entry.index] ?? 0, 2)}
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums text-fg">
                      {a.percent(percent(entry.weight))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* The whole row, in sentence order. The table above says who won;
              this says what everyone else was left with. */}
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="mb-3 text-overline uppercase text-fg-faint">{a.wholeRowLabel}</p>
            <ul className="space-y-1.5">
              {words.map((word, index) => {
                const weight = row[index] ?? 0;
                return (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 truncate font-mono text-caption text-fg-muted">
                      {word}
                    </span>
                    <span aria-hidden className="h-1.5 flex-1 rounded-pill bg-line/10">
                      <span
                        className="block h-full rounded-pill bg-accent"
                        style={{ width: `${Math.max(weight * 100, 1)}%` }}
                      />
                    </span>
                    <span className="w-11 shrink-0 text-right font-mono text-caption tabular-nums text-fg">
                      {a.percent(percent(weight))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      }
      primary={
        <TokenPicker label={a.pickLabel} words={words} selected={selected} onSelect={onSelect} />
      }
      figures={
        <>
          <Figure
            label={a.figures.biggestShare}
            value={a.percent(percent(best?.weight ?? 0))}
            tone="accent"
            hint={words[best?.index ?? 0]}
          />
          <Figure label={a.figures.aboveTen} value={String(notable)} />
          <Figure label={a.figures.sharesTotal} value={a.percent(percent(total))} />
        </>
      }
    />
  );
}
