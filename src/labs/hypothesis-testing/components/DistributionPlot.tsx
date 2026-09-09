import { useId } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { normalPdf, type Result } from "../engine";
import { PLOT, areaPath, coord, criticalList, curvePath, prob, regionsOf, scaleOf } from "../view";

export interface DistributionPlotProps {
  result: Result;
  /** Draw the rejection region and its boundary. Off in section 1. */
  showCritical?: boolean;
  /** Shade the H1 mass that would be missed. Off until section 3. */
  showBeta?: boolean;
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
  className,
}: DistributionPlotProps) {
  const copy = useT().labs["hypothesis-testing"];
  const plot = copy.plot;
  const baseId = useId();
  const alphaHatch = `${baseId}-alpha`;
  const betaHatch = `${baseId}-beta`;

  const { mu0, mu1, alpha } = result.params;
  const scale = scaleOf(result);
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

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("rounded border border-line/10 bg-ink-950 p-3", className)}
    >
      <svg
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
            <line x1="0" y1="0" x2="0" y2="2.4" className="stroke-signal-amber" strokeWidth="0.8" />
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
            { at: mu1, name: plot.h1, className: "fill-data" },
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
          <text x={1} y={PLOT.height - 1.2} className="fill-signal-rose" style={{ fontSize: 2.9 }}>
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
    </div>
  );
}
