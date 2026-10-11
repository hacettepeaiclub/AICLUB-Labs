import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { BOUNDS, alphaForCritical, normalPdf, type Result } from "../engine";
import {
  PLOT,
  areaPath,
  coord,
  criticalList,
  curvePath,
  invert,
  prob,
  regionsOf,
  scaleOf,
  type Domain,
} from "../view";

/** What the visitor can take hold of on this plot. */
export interface PlotHandles {
  /** Drag H1 along the axis. */
  readonly mu1?: (mu1: number) => void;
  /** Drag the boundary; the plot reports the α that puts it there. */
  readonly critical?: (alpha: number) => void;
}

type Target = "mu1" | "critical";

/** Snap a dragged value to the step its slider used to have, inside its bounds. */
const snap = (value: number, min: number, max: number, perUnit: number) =>
  Math.min(max, Math.max(min, Math.round(value * perUnit) / perUnit));

export interface DistributionPlotProps {
  result: Result;
  /** Draw the rejection region and its boundary. Off in section 1. */
  showCritical?: boolean;
  /** Shade the H1 mass that would be missed. Off until section 3. */
  showBeta?: boolean;
  /** Make H1, the boundary, or both draggable. */
  handles?: PlotHandles;
  className?: string;
}

/**
 * The two sampling distributions, and whatever the current section is about.
 *
 * Every coordinate comes from `view.ts`, which builds them from the engine's
 * own numbers. There are no fixed points anywhere in this file: change a
 * slider and the paths are rebuilt from a fresh `Result`.
 *
 * ## What is drawn
 *
 * Both curves are `N(mu, SE)` — sampling distributions of the mean, which is
 * what the reference implementation plots. The alpha region is the H0 mass
 * beyond the critical value; the beta region is the H1 mass inside it. Those
 * two masks are the reference implementation's, written as intervals in
 * `regionsOf`.
 *
 * ## Not by colour
 *
 * H0 is a solid line, H1 is dashed, and both are named on the plot next to
 * their own peak. The alpha region is hatched one way and beta the other, and
 * each is labelled with its own value. Nothing here needs colour vision, or a
 * legend, or a hover.
 *
 * ## Not by hover, either
 *
 * There is no tooltip. Every number the picture carries is either printed on
 * the picture or sitting in a figure beside it, because a value you have to
 * find with a pointer is a value a phone cannot show you.
 */
export function DistributionPlot({
  result,
  showCritical = true,
  showBeta = true,
  handles,
  className,
}: DistributionPlotProps) {
  const copy = useLabCopy("hypothesis-testing");
  const plot = copy.plot;
  const baseId = useId();
  const alphaHatch = `${baseId}-alpha`;
  const betaHatch = `${baseId}-beta`;

  const { mu0, mu1, alpha, testType } = result.params;
  // While a drag is going, the window is held where it was when it started.
  const [frozen, setFrozen] = useState<Domain | null>(null);
  const dragging = useRef<Target | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const scale = scaleOf(result, frozen ?? undefined);
  const regions = regionsOf(result.criticals, result.params.testType);
  const criticals = criticalList(result.criticals);

  const h0 = curvePath(scale, mu0, result.se);
  const h1 = curvePath(scale, mu1, result.se);

  // The height of a curve at its own mean, from the engine rather than
  // from the density formula written out a second time.
  const peakY = scale.y(normalPdf(mu0, mu0, result.se));
  const label = plot.summary(
    coord(mu0),
    coord(mu1),
    coord(result.se),
    criticals.map(coord).join(", "),
    prob(alpha),
    prob(result.beta),
    prob(result.power),
  );

  const canGrab = (target: Target) =>
    Boolean(handles?.[target]) && (target === "mu1" || showCritical);

  const setFrom = (target: Target, value: number) => {
    if (target === "mu1") {
      handles?.mu1?.(snap(value, BOUNDS.mu1.min, BOUNDS.mu1.max, 10));
    } else {
      const raw = alphaForCritical(value, mu0, result.se, testType);
      handles?.critical?.(snap(raw, BOUNDS.alpha.min, BOUNDS.alpha.max, 100));
    }
  };

  /** Where on the axis a pointer is, in data units, under the current window. */
  const pointerValue = (event: PointerEvent<HTMLDivElement>) => {
    const box = area.current!.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    return { value: invert(scale, fraction * PLOT.width), plotX: fraction * PLOT.width };
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!handles || event.button !== 0) return;
    const { value, plotX } = pointerValue(event);
    // Take whichever handle is nearest the press. A finger has to land near
    // one, so a page can still be scrolled across the plot; a mouse may press
    // anywhere and the nearest thing jumps to it.
    const options: { target: Target; at: number }[] = [];
    if (canGrab("mu1")) options.push({ target: "mu1", at: scale.x(mu1) });
    if (canGrab("critical")) {
      for (const c of criticals) options.push({ target: "critical", at: scale.x(c) });
    }
    const nearest = options.sort((a, b) => Math.abs(a.at - plotX) - Math.abs(b.at - plotX))[0];
    if (!nearest) return;
    if (event.pointerType === "touch" && Math.abs(nearest.at - plotX) > PLOT.width * 0.12) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = nearest.target;
    setFrozen(scale.domain);
    setFrom(nearest.target, value);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setFrom(dragging.current, pointerValue(event).value);
  };

  const onPointerEnd = () => {
    dragging.current = null;
    setFrozen(null);
  };

  /** Arrow keys on a handle: one slider step, or ten with Shift. */
  const onKey = (target: Target) => (event: KeyboardEvent<HTMLElement>) => {
    const sign =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0;
    if (sign === 0) return;
    event.preventDefault();
    const steps = sign * (event.shiftKey ? 10 : 1);
    if (target === "mu1")
      handles?.mu1?.(snap(mu1 + steps * 0.1, BOUNDS.mu1.min, BOUNDS.mu1.max, 10));
    // Right always moves the line right: for a right-tailed boundary that
    // shrinks α, for a left-tailed one it grows it.
    else {
      const outward = testType === "left" ? -1 : 1;
      handles?.critical?.(
        snap(alpha - outward * steps * 0.01, BOUNDS.alpha.min, BOUNDS.alpha.max, 100),
      );
    }
  };

  const at = (value: number) => `${(scale.x(value) / PLOT.width) * 100}%`;

  return (
    <div className={cn("rounded border border-line/10 bg-ink-950 p-3", className)}>
      <div
        ref={area}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className={cn("relative touch-pan-y select-none", handles && "cursor-ew-resize")}
      >
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
          preserveAspectRatio="none"
          className="h-[13rem] w-full sm:h-[16rem]"
        >
          <defs>
            {/* Hatching, so the two shaded regions differ in pattern and not
              only in colour. Opposite diagonals: they never read as the same
              fill at any size. */}
            <pattern
              id={alphaHatch}
              width="2"
              height="2"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="2" className="stroke-signal-rose" strokeWidth="0.9" />
            </pattern>
            <pattern
              id={betaHatch}
              width="2.4"
              height="2.4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="2.4"
                className="stroke-signal-amber"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>

          {/* Baseline. The only rule on the plot: a grid would be chrome. */}
          <line
            x1="0"
            y1={scale.baseline}
            x2={PLOT.width}
            y2={scale.baseline}
            className="stroke-line/30"
            strokeWidth="0.2"
          />

          {/* ---- shaded regions, under the curves ------------------------- */}
          <g aria-hidden>
            {regions.map((region, i) => {
              if (region.kind === "beta" && !showBeta) return null;
              if (region.kind === "alpha" && !showCritical) return null;
              const under = region.kind === "alpha" ? mu0 : mu1;
              const d = areaPath(scale, under, result.se, region.from, region.to);
              if (!d) return null;
              return (
                <path
                  key={`${region.kind}-${i}`}
                  d={d}
                  fill={`url(#${region.kind === "alpha" ? alphaHatch : betaHatch})`}
                  opacity={region.kind === "alpha" ? 0.75 : 0.6}
                />
              );
            })}
          </g>

          {/* ---- the two densities ---------------------------------------- */}
          <g aria-hidden fill="none">
            {/* H1 first, so H0 sits on top where they overlap. */}
            <path d={h1} className="stroke-data" strokeWidth="0.55" strokeDasharray="2.2 1.6" />
            <path d={h0} className="stroke-accent" strokeWidth="0.55" />
          </g>

          {/* ---- the boundary, and what it separates ---------------------- */}
          {showCritical && (
            <g aria-hidden>
              {criticals.map((c, i) => (
                <line
                  key={i}
                  x1={scale.x(c)}
                  y1={PLOT.padTop - 1.5}
                  x2={scale.x(c)}
                  y2={scale.baseline}
                  className="stroke-fg"
                  strokeWidth="0.35"
                  strokeDasharray="1.2 1"
                />
              ))}
            </g>
          )}

          {/* ---- means, ticked on the baseline ---------------------------- */}
          <g aria-hidden>
            {[
              { at: mu0, name: plot.h0, className: "fill-accent" },
              { at: mu1, name: canGrab("mu1") ? "" : plot.h1, className: "fill-data" },
            ].map((mark) => (
              <g key={mark.name}>
                <line
                  x1={scale.x(mark.at)}
                  y1={scale.baseline - 1}
                  x2={scale.x(mark.at)}
                  y2={scale.baseline + 1.4}
                  className={mark.className.replace("fill-", "stroke-")}
                  strokeWidth="0.45"
                />
                <text
                  x={scale.x(mark.at)}
                  y={peakY - 1.4}
                  textAnchor="middle"
                  className={cn("font-mono", mark.className)}
                  style={{ fontSize: 3.4 }}
                >
                  {mark.name}
                </text>
              </g>
            ))}
          </g>

          {/* ---- values, printed on the picture --------------------------- */}
          <g aria-hidden className="font-mono">
            {showCritical &&
              criticals.map((c, i) => (
                <text
                  key={i}
                  x={Math.min(PLOT.width - 6, Math.max(6, scale.x(c)))}
                  y={PLOT.padTop - 0.2}
                  textAnchor="middle"
                  className="fill-fg-muted"
                  style={{ fontSize: 2.7 }}
                >
                  {coord(c)}
                </text>
              ))}
            <text
              x={1}
              y={PLOT.height - 1.2}
              className="fill-signal-rose"
              style={{ fontSize: 2.9 }}
            >
              {showCritical ? plot.alphaTag(prob(alpha)) : ""}
            </text>
            <text
              x={PLOT.width - 1}
              y={PLOT.height - 1.2}
              textAnchor="end"
              className="fill-signal-amber"
              style={{ fontSize: 2.9 }}
            >
              {showBeta ? plot.betaTag(prob(result.beta)) : ""}
            </text>
          </g>
        </svg>

        {/* The handles: real controls for keyboards and screen readers, and
          a visible grip for everyone else. HTML rather than SVG, so they keep
          their shape while the plot stretches to fit its box. */}
        {handles && (
          <div className="pointer-events-none absolute inset-0">
            {canGrab("mu1") && (
              <span
                role="slider"
                tabIndex={0}
                aria-label={plot.handleMu1}
                aria-valuemin={BOUNDS.mu1.min}
                aria-valuemax={BOUNDS.mu1.max}
                aria-valuenow={mu1}
                aria-valuetext={plot.handleMu1Value(coord(mu1))}
                onKeyDown={onKey("mu1")}
                style={{ left: at(mu1) }}
                className="pointer-events-auto absolute top-0 flex h-7 min-w-11 -translate-x-1/2 cursor-ew-resize items-center justify-center gap-1 rounded-pill border border-data/60 bg-ink-900 px-2 font-mono text-caption text-data"
              >
                <span aria-hidden>‹</span>
                {plot.h1}
                <span aria-hidden>›</span>
              </span>
            )}
            {canGrab("critical") &&
              criticals.map((c, i) => (
                <span
                  key={i}
                  role="slider"
                  tabIndex={0}
                  aria-label={plot.handleCritical}
                  aria-valuemin={BOUNDS.alpha.min}
                  aria-valuemax={BOUNDS.alpha.max}
                  aria-valuenow={alpha}
                  aria-valuetext={plot.handleCriticalValue(coord(c), prob(alpha))}
                  onKeyDown={onKey("critical")}
                  style={{ left: at(c) }}
                  className="pointer-events-auto absolute top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-fg/60 bg-ink-900 text-body-sm text-fg"
                >
                  <span aria-hidden>↔</span>
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
