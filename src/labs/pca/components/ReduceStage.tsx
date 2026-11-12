import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { usePaletteVersion, useReducedMotion } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import { components, direction, makeCloud, mean, shadows, type CloudKind } from "../engine";
import { COLOR, S, frameFor } from "../view";

/**
 * Section 3: keep only each point's shadow on the first principal component.
 * One number per point instead of two; the variance kept is the first
 * eigenvalue's share, and the rest is how far the points were from the line.
 */
export function ReduceStage() {
  const t = useLabCopy("pca");
  const copy = t.reduce;
  usePaletteVersion();
  const reduced = useReducedMotion() ?? false;
  const [kind, setKind] = useState<CloudKind>("people");
  const [flat, setFlat] = useState(false);

  const points = useMemo(() => makeCloud(kind, 1).points, [kind]);
  const frame = useMemo(() => frameFor(points), [points]);
  const middle = mean(points);
  const pcs = useMemo(() => components(points), [points]);
  const [ux, uy] = direction(pcs.first.angle);
  const feet = shadows(points, pcs.first.angle);
  const kept = Math.round(pcs.kept * 100);
  const reach = 2 * S * frame.scale;
  const motion = reduced ? undefined : { transition: "cx 0.6s ease, cy 0.6s ease" };

  return (
    <Stage
      width="wide"
      caption={copy.caption}
      viewport={
        <div className="rounded-lg border border-line/20 bg-ink-900 p-4">
          <svg
            viewBox={`0 0 ${S} ${S}`}
            role="img"
            aria-label={copy.cloudLabel(t.percent(kept))}
            className="mx-auto max-h-[28rem] w-full"
          >
            <line
              x1={frame.x(middle.x - ux * reach)}
              y1={frame.y(middle.y - uy * reach)}
              x2={frame.x(middle.x + ux * reach)}
              y2={frame.y(middle.y + uy * reach)}
              stroke={COLOR.stays()}
              strokeWidth="0.6"
            />
            {points.map((p, i) => {
              const fx = middle.x + feet[i]! * ux;
              const fy = middle.y + feet[i]! * uy;
              return (
                <g key={i}>
                  {flat && (
                    <line
                      x1={frame.x(p.x)}
                      y1={frame.y(p.y)}
                      x2={frame.x(fx)}
                      y2={frame.y(fy)}
                      stroke={COLOR.across()}
                      strokeWidth="0.25"
                    />
                  )}
                  <circle
                    cx={frame.x(flat ? fx : p.x)}
                    cy={frame.y(flat ? fy : p.y)}
                    r="1"
                    fill={flat ? COLOR.v() : COLOR.dot()}
                    style={motion}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      }
      primary={
        <div className="space-y-4">
          <Segmented
            label={copy.data}
            value={kind}
            options={(["people", "round"] as const).map((id) => ({
              value: id,
              label: t.shadow.clouds[id],
            }))}
            onChange={(next) => {
              setKind(next);
              setFlat(false);
            }}
          />
          <Button onClick={() => setFlat(!flat)}>{flat ? copy.restore : copy.flatten}</Button>
        </div>
      }
      figures={
        <>
          <Figure label={copy.kept} value={t.percent(kept)} tone="accent" />
          <Figure label={copy.lost} value={t.percent(100 - kept)} />
        </>
      }
    />
  );
}
