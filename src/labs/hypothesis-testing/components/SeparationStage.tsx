import { Figure, Stage } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import type { Params, Result } from "../engine";
import { coord, separation } from "../view";
import { DistributionPlot } from "./DistributionPlot";

export interface SeparationStageProps {
  result: Result;
  onChange: (patch: Partial<Params>) => void;
}

/**
 * Section 1 — the two hypotheses, and nothing named yet.
 *
 * No critical value, no alpha, no beta. Only two curves, and H1 to take
 * hold of and drag, because "these two are hard to tell apart when they
 * overlap" is a thing you can see before it is a thing anybody defines. The
 * separation figure is in standard errors rather than raw units, which is the
 * quantity that actually decides distinguishability — and the reason section 4
 * has anything to say.
 */
export function SeparationStage({ result, onChange }: SeparationStageProps) {
  const copy = useLabCopy("hypothesis-testing");
  const s = copy.separation;
  const { mu0, mu1 } = result.params;

  return (
    <Stage
      width="full"
      caption={s.caption}
      announcement={s.announce(coord(mu1), coord(separation(result)))}
      viewport={
        <DistributionPlot
          result={result}
          showCritical={false}
          showBeta={false}
          handles={{ mu1: (value) => onChange({ mu1: value }) }}
        />
      }
      primary={<p className="text-body-sm text-fg-muted">{s.mu1Hint}</p>}
      figures={
        <>
          <Figure label={s.mu0Label} value={coord(mu0)} />
          <Figure label={s.mu1Figure} value={coord(mu1)} tone="accent" />
          <Figure label={s.gapLabel} value={coord(separation(result))} hint={s.gapHint} />
        </>
      }
    />
  );
}
