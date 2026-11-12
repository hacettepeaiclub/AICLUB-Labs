import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { usePaletteVersion } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import {
  components,
  covariance,
  direction,
  makeCloud,
  mean,
  shadowVariance,
  shadows,
  type CloudKind,
} from "../engine";
import { COLOR, S, frameFor } from "../view";

/**
 * Section 2: a cloud of data. Turn a line through its middle and watch how
 * wide the points' shadows on it spread; the widest is the covariance
 * matrix's first eigenvector, and its variance is that eigenvalue.
 */
export function ShadowStage() {
  const t = useLabCopy("pca");
  const copy = t.shadow;
  usePaletteVersion();
  const [kind, setKind] = useState<CloudKind>("people");
  const [seed, setSeed] = useState(1);
  const [angle, setAngle] = useState(120);
  const [best, setBest] = useState(0);
  const [shown, setShown] = useState(false);

  const cloud = useMemo(() => makeCloud(kind, seed), [kind, seed]);
  const points = cloud.points;
  const frame = useMemo(() => frameFor(points), [points]);
  const middle = mean(points);
  const variance = shadowVariance(points, angle);
  const pcs = useMemo(() => components(points), [points]);
  const cov = useMemo(() => covariance(points), [points]);
  const [ux, uy] = direction(angle);
  const feet = shadows(points, angle);
  const axes = kind === "people" ? copy.axisPeople : copy.axisRound;

  const reset = (nextKind: CloudKind, nextSeed: number) => {
    setKind(nextKind);
    setSeed(nextSeed);
    setBest(0);
    setShown(false);
  };
  const onAngle = (next: number) => {
    setAngle(next);
    setBest((b) => Math.max(b, shadowVariance(points, next)));
  };

  const through = (deg: number) => {
    const [dx, dy] = direction(deg);
    const reach = 2 * S * frame.scale;
    return {
      x1: frame.x(middle.x - dx * reach),
      y1: frame.y(middle.y - dy * reach),
      x2: frame.x(middle.x + dx * reach),
      y2: frame.y(middle.y + dy * reach),
    };
  };

  return (
    <Stage
      width="wide"
      caption={copy.caption}
      announcement={shown ? copy.revealed : ""}
      viewport={
        <div className="space-y-3 rounded-lg border border-line/20 bg-ink-900 p-4">
          <svg
            viewBox={`0 0 ${S} ${S}`}
            role="img"
            aria-label={copy.cloudLabel(t.degrees(angle))}
            className="mx-auto max-h-[28rem] w-full"
          >
            <line x1="0" y1={S / 2} x2={S} y2={S / 2} stroke={COLOR.grid()} strokeWidth="0.3" />
            <line x1={S / 2} y1="0" x2={S / 2} y2={S} stroke={COLOR.grid()} strokeWidth="0.3" />
            {shown && (
              <>
                <line
                  {...through(pcs.first.angle)}
                  stroke={COLOR.stays()}
                  strokeWidth="0.5"
                  strokeDasharray="2 1"
                />
                <line
                  {...through(pcs.second.angle)}
                  stroke={COLOR.across()}
                  strokeWidth="0.5"
                  strokeDasharray="2 1"
                />
              </>
            )}
            <line {...through(angle)} stroke={COLOR.v()} strokeWidth="0.6" />
            {points.map((p, i) => {
              const s = feet[i]!;
              const fx = middle.x + s * ux;
              const fy = middle.y + s * uy;
              return (
                <g key={i}>
                  <line
                    x1={frame.x(p.x)}
                    y1={frame.y(p.y)}
                    x2={frame.x(fx)}
                    y2={frame.y(fy)}
                    stroke={COLOR.grid()}
                    strokeWidth="0.2"
                  />
                  <circle cx={frame.x(p.x)} cy={frame.y(p.y)} r="1" fill={COLOR.dot()} />
                  <circle cx={frame.x(fx)} cy={frame.y(fy)} r="0.7" fill={COLOR.v()} />
                </g>
              );
            })}
            <text x={S - 1} y={S / 2 - 1.5} textAnchor="end" fontSize="3" fill={COLOR.text()}>
              {axes.x}
            </text>
            <text x={S / 2 + 1.5} y="4" fontSize="3" fill={COLOR.text()}>
              {axes.y}
            </text>
          </svg>
          {shown && (
            <div className="text-caption text-fg-muted">
              <p>{copy.covariance}</p>
              <p className="font-mono">
                {copy.covarianceRows(
                  t.decimal(cov[0], 1),
                  t.decimal(cov[1], 1),
                  t.decimal(cov[2], 1),
                  t.decimal(cov[3], 1),
                )}
              </p>
            </div>
          )}
        </div>
      }
      primary={
        <div className="space-y-4">
          <LabSlider
            label={copy.angle}
            min={0}
            max={179.5}
            step={0.5}
            value={angle}
            onChange={onAngle}
            format={t.degrees}
          />
          <Button variant="secondary" onClick={() => setShown(!shown)}>
            {shown ? copy.hide : copy.reveal}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure label={copy.variance} value={t.decimal(variance, 1)} tone="accent" />
          <Figure label={copy.best} value={best ? t.decimal(best, 1) : "—"} />
          {shown && (
            <>
              <Figure label={copy.first} value={t.decimal(pcs.first.value, 1)} />
              <Figure label={copy.second} value={t.decimal(pcs.second.value, 1)} />
            </>
          )}
        </>
      }
      secondaryLabel={copy.dataLabel}
      secondaryCollapsible
      secondary={
        <div className="space-y-3">
          <Segmented
            label={copy.data}
            value={kind}
            options={(["people", "round"] as const).map((id) => ({
              value: id,
              label: copy.clouds[id],
            }))}
            onChange={(next) => reset(next, seed)}
          />
          <Button variant="ghost" onClick={() => reset(kind, seed + 1)}>
            {copy.newSample}
          </Button>
        </div>
      }
    />
  );
}
