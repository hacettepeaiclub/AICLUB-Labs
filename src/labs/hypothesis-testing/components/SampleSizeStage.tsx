import { Figure, LabSlider, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { BOUNDS, evaluate, type Params, type Result } from "../engine";
import { PLOT, coord, prob } from "../view";
import { DistributionPlot } from "./DistributionPlot";
import { SecondaryControls } from "./SecondaryControls";

export interface SampleSizeStageProps {
  result: Result;
  onChange: (patch: Partial<Params>) => void;
}

/** Sample sizes the power curve is drawn at. The reference implementation's range. */
const CURVE_N = Array.from({ length: BOUNDS.n.max - BOUNDS.n.min + 1 }, (_, i) => BOUNDS.n.min + i);

/**
 * Section 4 — what more data actually buys.
 *
 * Everything in this section falls out of one line, `SE = sigma / sqrt(n)`,
 * and the section's job is to make that chain visible rather than assert it:
 * n moves SE, SE moves the critical value, the critical value moves beta, and
 * beta is power. The plot narrows because the window narrows with it — the
 * reference implementation frames the x axis at `+/- 4.5 SE`, so this is the
 * honest version of "the curves get tighter".
 *
 * The power curve beside it is the same `evaluate()` the rest of the lab uses,
 * run once per sample size with everything else held. Its square-root shape is
 * not drawn in; it is what the equation does.
 */
export function SampleSizeStage({ result, onChange }: SampleSizeStageProps) {
  const copy = useT().labs["hypothesis-testing"];
  const s = copy.sampleSection;
  const { n } = result.params;

  // One real run per n. 99 evaluations of closed-form arithmetic: cheaper than
  // the render it feeds.
  const curve = CURVE_N.map((at) => ({
    n: at,
    power: evaluate({ ...result.params, n: at }).power,
  }));

  const path = curve
    .map((point, i) => {
      const x = ((point.n - BOUNDS.n.min) / (BOUNDS.n.max - BOUNDS.n.min)) * PLOT.width;
      const y = 30 - point.power * 26;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const markerX = ((n - BOUNDS.n.min) / (BOUNDS.n.max - BOUNDS.n.min)) * PLOT.width;

  return (
    <Stage
      width="full"
      caption={s.caption}
      announcement={s.announce(n, coord(result.se), prob(result.power))}
      viewport={
        <div className="space-y-3">
          <DistributionPlot result={result} />
          <div className="rounded border border-line/10 bg-ink-950 p-3">
            <p className="text-overline uppercase text-fg-faint">{s.curveTitle}</p>
            <svg
              viewBox={`0 0 ${PLOT.width} 34`}
              preserveAspectRatio="none"
              role="img"
              aria-label={s.curveLabel(
                BOUNDS.n.min,
                BOUNDS.n.max,
                prob(curve[0]?.power ?? 0),
                prob(curve[curve.length - 1]?.power ?? 0),
              )}
              className="mt-2 h-20 w-full"
            >
              {/* 0.80 is a convention, not a law, so it is a quiet rule with
                  its own printed label rather than a highlighted threshold. */}
              <line
                x1="0"
                y1={30 - 0.8 * 26}
                x2={PLOT.width}
                y2={30 - 0.8 * 26}
                className="stroke-line/40"
                strokeWidth="0.25"
                strokeDasharray="1.5 1.5"
              />
              <text
                x="0.5"
                y={30 - 0.8 * 26 - 1}
                className="fill-fg-faint font-mono"
                style={{ fontSize: 2.6 }}
              >
                {s.eighty}
              </text>
              <path d={path} fill="none" className="stroke-data" strokeWidth="0.6" />
              <line
                x1={markerX}
                y1="1"
                x2={markerX}
                y2="30"
                className="stroke-accent"
                strokeWidth="0.4"
              />
            </svg>
          </div>
        </div>
      }
      primary={
        <div className="space-y-2">
          <LabSlider
            label={s.nLabel}
            value={n}
            min={BOUNDS.n.min}
            max={BOUNDS.n.max}
            onChange={(value) => onChange({ n: value })}
            format={() => String(n)}
            valueText={() => s.nValue(n)}
          />
          <p className="font-mono text-caption text-fg-muted">{s.formula(coord(result.se))}</p>
        </div>
      }
      figures={
        <>
          <Figure label={s.nFigure} value={String(n)} />
          <Figure label={s.seLabel} value={coord(result.se)} tone="accent" hint={s.seHint} />
          <Figure label={s.powerLabel} value={prob(result.power)} />
          <Figure label={s.betaLabel} value={prob(result.beta)} />
        </>
      }
      secondaryLabel={copy.controls.moreLabel}
      secondary={
        <SecondaryControls result={result} onChange={onChange} show={["sigma", "alpha", "mu1"]} />
      }
    />
  );
}
