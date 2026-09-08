import { useId, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button, Kbd } from "@/components/ui";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { conditionNumber, gradient, type Landscape, type Point } from "../engine";
import { LandscapeCanvas } from "./LandscapeCanvas";
import { VIEW_EXTENT } from "./DescentStage";

const HOME: Point = { x: 1, y: -0.55 };

/** κ runs from 1 to 60 on a logarithmic slider, so the low end is usable. */
const KAPPA_MAX = 60;
const KAPPA_STEPS = 100;
const kappaAt = (index: number): number => Math.pow(KAPPA_MAX, index / KAPPA_STEPS);

/** Below this the point sits on an axis and the two directions agree anyway. */
const ON_AXIS = 0.02;

function angleBetween(u: Point, v: Point): number {
  const nu = Math.hypot(u.x, u.y);
  const nv = Math.hypot(v.x, v.y);
  if (nu === 0 || nv === 0) return 0;
  const cos = Math.min(1, Math.max(-1, (u.x * v.x + u.y * v.y) / (nu * nv)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/**
 * Section 2: the descent direction against the direction to the minimum.
 *
 * No run and no button to press. The visitor drags the point and drags the
 * curvature, and the two arrows answer. There is nothing here that a
 * one-dimensional picture could show: with a single axis a gradient is only a
 * sign, so it always points at the minimum and the question cannot be asked.
 *
 * The mathematics is exact and worth stating precisely, because the tempting
 * simplification is wrong. −∇f = −(a·x, b·y) is a positive multiple of the
 * direction to the minimum, −(x, y), when a·x/x equals b·y/y — that is, when
 * a = b, or when the point already sits on one of the axes and one of the two
 * ratios is vacuous. Away from the axes the arrows agree only on a landscape
 * whose curvature is the same in both directions.
 */
export function GradientStage() {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const hintId = useId();

  const [point, setPoint] = useState<Point>(HOME);
  const [kappaIndex, setKappaIndex] = useState(60);

  const kappa = kappaAt(kappaIndex);
  const landscape: Landscape = { a: kappa, b: 1 };

  const grad = gradient(landscape, point);
  const descent: Point = { x: -grad.x, y: -grad.y };
  const target: Point = { x: -point.x, y: -point.y };
  const angle = angleBetween(descent, target);

  const onAxis = Math.abs(point.x) < ON_AXIS || Math.abs(point.y) < ON_AXIS;
  const note = onAxis ? g.direction.onAxis : angle < 0.05 ? g.direction.aligned : g.direction.apart;

  return (
    <Stage
      width="full"
      secondaryLabel={g.direction.legendAndKeys}
      caption={g.direction.caption}
      announcement={note}
      viewport={
        <>
          <LandscapeCanvas
            landscape={landscape}
            extent={VIEW_EXTENT}
            current={point}
            descentArrow={descent}
            targetArrow={target}
            onMovePoint={setPoint}
            homePoint={HOME}
            label={g.direction.label(
              formatNumber(point.x, 2),
              formatNumber(point.y, 2),
              formatNumber(conditionNumber(landscape), 2),
              formatNumber(angle, 1),
            )}
            describedBy={hintId}
          />
          {/* Always in the DOM, never on screen: the description the map
              points at must not depend on a disclosure being open. */}
          <p id={hintId} className="sr-only">
            {g.direction.keyboardHelp}
          </p>
        </>
      }
      readout={
        /* Earned in context: it changes as the point and the curvature move,
           and it is the answer to the question the arrows are asking. */
        <p className="text-caption text-fg-muted">{note}</p>
      }
      primary={
        <div className="space-y-3">
          <LabSlider
            label={g.controls.curvature}
            value={kappaIndex}
            min={0}
            max={KAPPA_STEPS}
            onChange={setKappaIndex}
            format={() => `κ ${formatNumber(kappa, kappa < 10 ? 2 : 0)}`}
            valueText={() => g.controls.curvatureValue(formatNumber(kappa, 2))}
          />
          <Button variant="secondary" onClick={() => setPoint(HOME)} className="min-h-[44px] w-full">
            {g.controls.resetPoint}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure
            label={g.figures.conditionNumber}
            value={formatNumber(conditionNumber(landscape), 2)}
            hint={g.figures.conditionNumberHint}
          />
          <Figure
            label={g.direction.angle}
            value={`${formatNumber(angle, 1)}°`}
            tone="accent"
            hint={g.direction.angleHint}
          />
          <Figure
            label={g.figures.position}
            value={`${formatNumber(point.x, 2)}, ${formatNumber(point.y, 2)}`}
          />
        </>
      }
      secondary={
        <>
          {/* The legend distinguishes the arrows by line style as well as by
              colour, so it survives being read in greyscale. */}
          <ul className="space-y-2">
            <li className="flex items-center gap-3">
              <svg width="34" height="10" aria-hidden className="shrink-0">
                <line x1="1" y1="5" x2="33" y2="5" className="stroke-signal-cyan" strokeWidth="2" />
              </svg>
              <span className="text-caption text-fg">{g.direction.descent}</span>
            </li>
            <li className="flex items-center gap-3">
              <svg width="34" height="10" aria-hidden className="shrink-0">
                <line
                  x1="1"
                  y1="5"
                  x2="33"
                  y2="5"
                  className="stroke-signal-amber"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
              </svg>
              <span className="text-caption text-fg">{g.direction.target}</span>
            </li>
          </ul>
          <p className="text-caption text-fg-faint">{g.direction.equalLength}</p>
          <p className="text-caption text-fg-faint">
            {g.direction.dragHint}{" "}
            <span className="whitespace-nowrap">
              <Kbd>←</Kbd> <Kbd>→</Kbd> <Kbd>↑</Kbd> <Kbd>↓</Kbd>
            </span>{" "}
            {g.direction.keyboardHint} <Kbd>Home</Kbd>
          </p>
        </>
      }
    />
  );
}
