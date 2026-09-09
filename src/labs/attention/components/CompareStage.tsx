import { Figure, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { keyOf, queryOf, ranked, rowScores, type Attention } from "../engine";
import { scaleComparison } from "../view";
import { Bars } from "./Bars";
import { TokenPicker } from "./TokenPicker";

/** The three query/key axes worth showing. The other three are position and
 *  the two "not looking for this" axes, which would crowd the picture. */
const QK_SHOWN = [0, 1, 3] as const;

export interface CompareStageProps {
  attention: Attention;
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * §2 — what the selected word asks for, and what the word it leans on offers.
 *
 * The two halves of a dot product, side by side and on one shared scale, so
 * "these line up" is something you can see rather than something you are told.
 * The comparison target is the row's strongest match, which is the
 * representative pair; printing all ten keys would be ten times the numbers
 * and none of the point.
 *
 * The picker in the rail is the same selection the sentence above owns. It is
 * repeated here so that changing the word and watching the query change happen
 * on one screen — which is the entire claim this stage makes.
 */
export function CompareStage({ attention, words, selected, onSelect }: CompareStageProps) {
  const a = useT().labs.attention;
  const trace = a.trace;

  const best = ranked(attention, selected)[0];
  if (!best) return null;

  const target = best.index;
  const selectedWord = words[selected] ?? "";
  const targetWord = words[target] ?? "";

  const q = queryOf(attention, selected);
  const k = keyOf(attention, target);
  const score = rowScores(attention, selected)[target] ?? 0;
  const raw = scaleComparison(attention, selected).raw[target] ?? 0;

  const axisNames = [trace.axes.nounness, trace.axes.animacy, trace.axes.verbness];
  const qValues = QK_SHOWN.map((i) => q[i] ?? 0);
  const kValues = QK_SHOWN.map((i) => k[i] ?? 0);
  // One scale across both, or the two pictures cannot be compared by eye.
  const qkScale = Math.max(1e-6, ...qValues.map(Math.abs), ...kValues.map(Math.abs));

  return (
    <Stage
      width="full"
      caption={a.reveal.lede}
      viewport={
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-overline uppercase text-fg-faint">{trace.step2}</p>
            <p className="mb-3 mt-1 text-body-sm text-fg">{trace.step2Title(selectedWord)}</p>
            <Bars names={axisNames} values={qValues} scale={qkScale} signed />
          </div>
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-overline uppercase text-fg-faint">{trace.step3}</p>
            <p className="mb-3 mt-1 text-body-sm text-fg">{trace.step3Title(targetWord)}</p>
            <Bars names={axisNames} values={kValues} scale={qkScale} signed />
          </div>
        </div>
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-body-sm text-fg-muted">{trace.step2Note}</p>
          <p className="mt-2 text-body-sm text-fg-muted">{trace.step3Note}</p>
        </div>
      }
      primary={
        <TokenPicker label={a.pickLabel} words={words} selected={selected} onSelect={onSelect} />
      }
      figures={
        <>
          <Figure label={a.figures.matchedWith} value={targetWord} />
          <Figure label={a.figures.rawMatch} value={formatNumber(raw, 2)} tone="accent" />
          <Figure label={a.figures.score} value={formatNumber(score, 2)} />
        </>
      }
    />
  );
}
