import { useId, type ReactNode } from "react";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { normalPdf, type Result } from "../engine";
import type { Domain } from "../view";
import { PLOT, areaPath, criticalList, curvePath, labelAt, regionsOf, scaleOf } from "../view";
import { useNumberFormat } from "./useNumberFormat";

export interface DistributionPlotProps {
  result: Result;
  /** Draw the rejection region and its boundary. Off in section 1. */
  showCritical?: boolean;
  /** Shade the H1 mass that would be missed. Off until section 3. */
  showBeta?: boolean;
  className?: string;
  domain?: Domain;
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
  className,
  domain,
}: DistributionPlotProps) {
  const { coord, prob } = useNumberFormat();
  const copy = useLabCopy("hypothesis-testing");
  const plot = copy.plot;
  const baseId = useId();
  const alphaHatch = `${baseId}-alpha`;
  const betaHatch = `${baseId}-beta`;

  const { mu0, mu1, alpha } = result.params;
  const scale = scaleOf(result, domain);
  const regions = regionsOf(result.criticals, result.params.testType);
  const criticals = criticalList(result.criticals);

  const h0 = curvePath(scale, mu0, result.se);
  const h1 = curvePath(scale, mu1, result.se);

  // The height of a curve at its own mean, from the engine rather than
  // from the density formula written out a second time.
  const peakY = scale.y(normalPdf(mu0, mu0, result.se));
  // Each curve's name keeps to its own side of the midpoint between the two
  // means, so the names cannot run into each other however close they are.
  // H0 takes the left when the means coincide.
  const middle = (scale.x(mu0) + scale.x(mu1)) / 2;
  const h0Left = mu0 <= mu1;
  const left: [number, number] = [0, middle];
  const right: [number, number] = [middle, PLOT.width];
  const marks = [
    {
      at: mu0,
      name: plot.h0,
      stroke: "stroke-accent",
      text: "text-accent",
      span: h0Left ? left : right,
    },
    {
      at: mu1,
      name: plot.h1,
      stroke: "stroke-data",
      text: "text-data",
      span: h0Left ? right : left,
    },
  ];
  const label = plot.summary(
    coord(mu0),
    coord(mu1),
    coord(result.se),
    criticals.map(coord).join(", "),
    prob(alpha),
    prob(result.beta),
    prob(result.power),
  );

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("rounded-lg border border-line/20 bg-ink-900 p-3", className)}
    >
      <div className="relative h-[13rem] sm:h-[16rem]">
        <svg
          viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
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
            <path d={h1} className="stroke-data" strokeWidth="0.7" strokeDasharray="2.2 1.6" />
            <path d={h0} className="stroke-accent" strokeWidth="0.7" />
          </g>

          {/* ---- the boundary, and what it separates ---------------------- */}
          {showCritical && (
            <g aria-hidden>
              {criticals.map((c, i) => (
                <line
                  key={i}
                  x1={scale.x(c)}
                  y1={PLOT.valueRow}
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
            {marks.map((mark) => (
              <line
                key={mark.name}
                x1={scale.x(mark.at)}
                y1={scale.baseline - 1}
                x2={scale.x(mark.at)}
                y2={scale.baseline + 1.4}
                className={mark.stroke}
                strokeWidth="0.45"
              />
            ))}
          </g>
        </svg>

        {/* ---- words, laid over the picture ------------------------------
          HTML rather than SVG text: the SVG stretches to the box, and its
          glyphs would stretch with it. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 font-mono">
          {marks.map((mark) => (
            <PlotLabel
              key={mark.name}
              x={scale.x(mark.at)}
              y={peakY}
              span={mark.span}
              className={cn(
                "-translate-y-full pb-1 text-center text-caption font-semibold sm:text-body-sm",
                mark.text,
              )}
            >
              {mark.name}
            </PlotLabel>
          ))}
          {showCritical &&
            criticals.map((c, i) => (
              <PlotLabel
                key={i}
                x={scale.x(c)}
                y={PLOT.valueRow}
                className="-translate-y-full text-caption text-fg-muted"
              >
                {coord(c)}
              </PlotLabel>
            ))}
          {showCritical && (
            <span className="absolute bottom-0 left-0 text-caption text-signal-rose">
              {plot.alphaTag(prob(alpha))}
            </span>
          )}
          {showBeta && (
            <span className="absolute bottom-0 right-0 text-caption text-signal-amber">
              {plot.betaTag(prob(result.beta))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** One word on the plot, anchored at a point in plot units. */
function PlotLabel({
  x,
  y,
  span,
  className,
  children,
}: {
  x: number;
  y: number;
  /** The stretch of the plot, in plot units, the label must stay within. */
  span?: [number, number];
  className?: string;
  children: ReactNode;
}) {
  const at = labelAt(x, y, span?.[0], span?.[1]);
  return (
    <span
      className={cn("absolute w-max leading-tight", className)}
      style={{ left: at.left, top: at.top, maxWidth: at.maxWidth, translate: `${at.shift} 0` }}
    >
      {children}
    </span>
  );
}
