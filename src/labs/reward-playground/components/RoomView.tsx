import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { COLS, ROWS, colOf, rowOf } from "../world";
import type { Rollout } from "../engine";
import { behaviourOf, pathPoints, roomCells } from "../view";

export interface RoomViewProps {
  rollout: Rollout;
  /** Bumped by the caller when the route changes, to restart the walk. */
  revision: number;
}

/** Roughly this many cells a second while the robot walks its route. */
const STEPS_PER_SECOND = 5;

/**
 * The room, and the route the robot actually walks.
 *
 * SVG rather than canvas: the whole picture is under a hundred shapes, so the
 * project's rule applies — start with SVG, drop to canvas only when profiling
 * says otherwise. It also stays crisp at any size and needs no device-pixel
 * bookkeeping.
 *
 * The overlay uses a `0 0 6 6` viewBox, so a cell centre is `(col + 0.5,
 * row + 0.5)` and nothing here ever measures the DOM. There is no
 * `ResizeObserver` and no layout read.
 *
 * ## What is animated, and what is not
 *
 * The full route is drawn as soon as it exists; the robot then walks along it.
 * The walk is a finite transition that stops at the end — never a standing
 * frame loop — and under reduced motion it does not happen at all: the robot
 * is placed at the end of the route immediately. Nothing on screen is
 * knowable only from the movement.
 */
export function RoomView({ rollout, revision }: RoomViewProps) {
  const copy = useT().labs["reward-playground"].room;
  const reduced = useReducedMotion() ?? false;

  const cells = roomCells(rollout.path);
  const points = pathPoints(rollout.path);
  const lastStep = Math.max(0, points.length - 1);

  const [step, setStep] = useState(lastStep);

  // Restart the walk whenever the route changes. Reduced motion skips it.
  useEffect(() => {
    if (reduced || lastStep === 0) {
      setStep(lastStep);
      return;
    }
    setStep(0);
    let frame = 0;
    let last = performance.now();
    let position = 0;
    const tick = (now: number) => {
      position += ((now - last) / 1000) * STEPS_PER_SECOND;
      last = now;
      if (position >= lastStep) {
        setStep(lastStep);
        return; // finished: nothing further is scheduled
      }
      setStep(Math.floor(position));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [revision, reduced, lastStep]);

  const here = points[Math.min(step, lastStep)] ?? { x: 0.5, y: 0.5 };
  const behaviour = behaviourOf(rollout);

  const summary = copy.mapLabel(
    copy.behaviour[behaviour],
    rollout.steps,
    rollout.tileVisits,
    step,
  );

  return (
    <div className="space-y-4">
      <div
        role="img"
        aria-label={summary}
        className="mx-auto w-full max-w-md rounded-card border border-line/10 bg-ink-900 p-3"
      >
        <div className="relative aspect-square w-full">
          {/* The room itself: real elements, so a wall is a wall in the DOM. */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1">
            {cells.map((cell) => (
              <div
                key={cell.index}
                aria-hidden
                className={cn(
                  "rounded-sm",
                  // A wall has to read as solid in both themes, or the room
                  // has no shape and the detour has no visible reason. ink-700
                  // was almost invisible against the light panel.
                  cell.kind === "wall" && "bg-fg-faint/50",
                  cell.kind === "floor" && "bg-line/[0.04]",
                  cell.kind === "start" && "bg-line/[0.04] ring-1 ring-line/20",
                  cell.kind === "tile" && "bg-signal-amber/25 ring-2 ring-signal-amber",
                  cell.kind === "goal" && "bg-signal-green/25 ring-2 ring-signal-green",
                  cell.visits > 0 && cell.kind !== "wall" && "bg-accent/10",
                )}
              />
            ))}
          </div>

          <svg
            aria-hidden
            viewBox={`0 0 ${COLS} ${ROWS}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {/* The door and the tile keep a glyph as well as a colour. */}
            <text
              x={colOf(cells.findIndex((c) => c.kind === "goal")) + 0.5}
              y={rowOf(cells.findIndex((c) => c.kind === "goal")) + 0.72}
              textAnchor="middle"
              fontSize="0.5"
              className="fill-signal-green"
            >
              ⌂
            </text>
            <text
              x={colOf(cells.findIndex((c) => c.kind === "tile")) + 0.5}
              y={rowOf(cells.findIndex((c) => c.kind === "tile")) + 0.72}
              textAnchor="middle"
              fontSize="0.5"
              className="fill-signal-amber"
            >
              ✦
            </text>

            {points.length > 1 && (
              <polyline
                points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                className="stroke-accent/70"
                strokeWidth={0.08}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            <circle
              cx={here.x}
              cy={here.y}
              r={0.24}
              className="fill-accent"
              style={reduced ? undefined : { transition: "cx 160ms linear, cy 160ms linear" }}
            />
            <circle cx={here.x} cy={here.y} r={0.32} className="fill-none stroke-fg/70" strokeWidth={0.05} />
          </svg>
        </div>
      </div>

      {/* The same information as words, for anyone who cannot use the picture. */}
      <p className="mx-auto max-w-md text-center text-body-sm text-fg">
        {copy.behaviour[behaviour]}
      </p>
      <p className="mx-auto max-w-md text-center text-caption text-fg-faint">
        {copy.readout(rollout.steps, rollout.tileVisits)}
      </p>
      <p aria-live="polite" className="sr-only">
        {`${copy.behaviour[behaviour]} ${copy.readout(rollout.steps, rollout.tileVisits)}`}
      </p>
    </div>
  );
}
