import { Figure, LabSlider, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { BOUNDS, type Params, type Result } from "../engine";
import { coord, separation } from "../view";
import { DistributionPlot } from "./DistributionPlot";
import { SecondaryControls } from "./SecondaryControls";

export interface SeparationStageProps {
  result: Result;
  onChange: (patch: Partial<Params>) => void;
}

/**
 * Section 1 — the two hypotheses, and nothing named yet.
 *
 * No critical value, no alpha, no beta. Only two curves and a slider that
 * moves one of them, because "these two are hard to tell apart when they
 * overlap" is a thing you can see before it is a thing anybody defines. The
 * separation figure is in standard errors rather than raw units, which is the
 * quantity that actually decides distinguishability — and the reason section 4
 * has anything to say.
 */
export function SeparationStage({ result, onChange }: SeparationStageProps) {
  const copy = useT().labs["hypothesis-testing"];
  const s = copy.separation;
  const { mu0, mu1 } = result.params;

  return (
    <Stage
      width="full"
      caption={s.caption}
      announcement={s.announce(coord(mu1), coord(separation(result)))}
      viewport={<DistributionPlot result={result} showCritical={false} showBeta={false} />}
      primary={
        <div className="space-y-2">
          <LabSlider
            label={s.mu1Label}
            value={Math.round(mu1 * 10)}
            min={Math.round(BOUNDS.mu1.min * 10)}
            max={Math.round(BOUNDS.mu1.max * 10)}
            onChange={(value) => onChange({ mu1: value / 10 })}
            format={() => coord(mu1)}
            valueText={() => s.mu1Value(coord(mu1))}
          />
          <p className="text-caption text-fg-muted">{s.mu1Hint}</p>
        </div>
      }
      figures={
        <>
          <Figure label={s.mu0Label} value={coord(mu0)} />
          <Figure label={s.mu1Figure} value={coord(mu1)} tone="accent" />
          <Figure label={s.gapLabel} value={coord(separation(result))} hint={s.gapHint} />
        </>
      }
      secondaryLabel={copy.controls.moreLabel}
      secondary={<SecondaryControls result={result} onChange={onChange} show={["mu0", "sigma"]} />}
    />
  );
}
