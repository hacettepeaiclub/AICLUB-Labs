import { Figure, LabSlider, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { BOUNDS, type Params, type Result } from "../engine";
import { coord, criticalList, prob } from "../view";
import { DistributionPlot } from "./DistributionPlot";
import { SecondaryControls } from "./SecondaryControls";

export interface AlphaStageProps {
  result: Result;
  onChange: (patch: Partial<Params>) => void;
}

/**
 * Section 2 — the boundary, and what it costs.
 *
 * H1 is still drawn, because it is still there, but nothing about it is shaded
 * yet: this section is about one curve and one line. The alpha region is the
 * H0 mass beyond the critical value, which is what alpha *is* in this model —
 * so moving the slider moves the line, and the hatched area is the number.
 *
 * The critical value is shown as a figure as well as on the plot. It is the
 * quantity the equation actually produces (`mu0 +/- zcrit * SE`), and watching
 * it move while mu0 and SE stay put is the cleanest statement of what alpha
 * does on its own.
 */
export function AlphaStage({ result, onChange }: AlphaStageProps) {
  const copy = useT().labs["hypothesis-testing"];
  const a = copy.alphaSection;
  const criticals = criticalList(result.criticals);
  const { alpha, testType } = result.params;

  return (
    <Stage
      width="full"
      caption={a.caption}
      announcement={a.announce(prob(alpha), criticals.map(coord).join(", "))}
      viewport={<DistributionPlot result={result} showBeta={false} />}
      primary={
        <div className="space-y-2">
          <LabSlider
            label={a.alphaLabel}
            value={Math.round(alpha * 100)}
            min={Math.round(BOUNDS.alpha.min * 100)}
            max={Math.round(BOUNDS.alpha.max * 100)}
            onChange={(value) => onChange({ alpha: value / 100 })}
            format={() => alpha.toFixed(2)}
            valueText={() => a.alphaValue(alpha.toFixed(2))}
          />
          <p className="text-caption text-fg-muted">{a.alphaHint}</p>
        </div>
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-body-sm text-fg-muted">
            {testType === "two" ? a.twoSided(prob(alpha / 2)) : a.oneSided(prob(alpha))}
          </p>
        </div>
      }
      figures={
        <>
          <Figure label={a.alphaFigure} value={prob(alpha)} tone="accent" />
          {criticals.length === 1 ? (
            <Figure label={a.criticalLabel} value={coord(criticals[0]!)} hint={a.criticalHint} />
          ) : (
            <>
              <Figure label={a.criticalLeft} value={coord(criticals[0] ?? 0)} />
              <Figure label={a.criticalRight} value={coord(criticals[1] ?? 0)} />
            </>
          )}
          <Figure label={a.seLabel} value={coord(result.se)} hint={a.seHint} />
        </>
      }
      secondaryLabel={copy.controls.moreLabel}
      secondary={<SecondaryControls result={result} onChange={onChange} show={["mu0", "sigma"]} />}
    />
  );
}
