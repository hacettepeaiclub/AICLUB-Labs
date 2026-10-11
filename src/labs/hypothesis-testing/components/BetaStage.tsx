import { Figure, Stage } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useLabCopy } from "@/i18n/labs";
import { TEST_TYPES, type Params, type Result, type TestType } from "../engine";
import { prob } from "../view";
import { DistributionPlot } from "./DistributionPlot";

export interface BetaStageProps {
  result: Result;
  onChange: (patch: Partial<Params>) => void;
}

/**
 * Section 3 — the other error, and the direction you were looking in.
 *
 * Beta is now shaded: the H1 mass sitting inside the region where the test
 * does not reject. Both hatched areas are on screen at once, which is the
 * point of the section — they are two different curves' masses on two
 * different sides of one line, and no single slider makes both small.
 *
 * The direction picker is the primary control because it produces the sharpest
 * demonstration in the lab: point a one-sided test the wrong way and beta goes
 * to nearly one while nothing else moves at all. The reference implementation
 * raises a warning in exactly that state, and so does this — with its
 * condition, not a stricter one.
 */
export function BetaStage({ result, onChange }: BetaStageProps) {
  const copy = useLabCopy("hypothesis-testing");
  const b = copy.betaSection;
  const { testType } = result.params;

  return (
    <Stage
      width="full"
      // 597px of controls beside a 345px plot: the gap sat under the curve.
      controls="stack"
      caption={b.caption}
      announcement={b.announce(prob(result.beta), prob(result.power))}
      viewport={
        <DistributionPlot
          result={result}
          handles={{
            mu1: (value) => onChange({ mu1: value }),
            critical: (value) => onChange({ alpha: value }),
          }}
        />
      }
      readout={
        result.warning ? (
          // Not styled as an error: it is a true statement about a legitimate
          // configuration, and the visitor probably arrived here on purpose.
          <div className="rounded border border-signal-amber/40 bg-signal-amber/10 px-4 py-3">
            <p className="text-body-sm text-fg">
              <span aria-hidden className="mr-1.5">
                !
              </span>
              {b.warning[result.warning]}
            </p>
          </div>
        ) : (
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-body-sm text-fg-muted">{b.reading(prob(result.beta))}</p>
          </div>
        )
      }
      primary={
        <div className="space-y-4">
          <Segmented
            label={b.testTypeLabel}
            value={testType}
            options={TEST_TYPES.map((type) => ({ value: type, label: copy.testType[type] }))}
            onChange={(next: TestType) => onChange({ testType: next })}
          />
          <p className="text-body-sm text-fg-muted">{b.dragHint}</p>
        </div>
      }
      figures={
        <>
          <Figure label={b.betaLabel} value={prob(result.beta)} hint={b.betaHint} />
          <Figure
            label={b.powerLabel}
            value={prob(result.power)}
            tone="accent"
            hint={b.powerHint}
          />
          <Figure label={b.alphaLabel} value={prob(result.params.alpha)} />
        </>
      }
    />
  );
}
