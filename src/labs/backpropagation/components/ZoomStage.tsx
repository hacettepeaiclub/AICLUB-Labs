import { useMemo, useRef, useState, type PointerEvent } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { evaluate, gradient, networkLoss, type NetworkParam } from "../engine";
import { formatSmall, formatValue } from "../view";

const GRAPH = networkLoss(0.8, -0.5, 1.2);
const FIXED: Record<NetworkParam, number> = {
  w11: 0.9,
  w12: -0.6,
  b1: 0.1,
  w21: -0.4,
  w22: 0.8,
  b2: -0.2,
  v1: 0.7,
  v2: -0.5,
  c: 0.05,
};
const loss = (w: number) => evaluate(GRAPH, { ...FIXED, w11: w });

const W = 600;
const H = 260;
const SAMPLES = 240;

/**
 * Section 2: zoom in until the curve is a line.
 *
 * The loss, as one weight (w₁₁) moves and every other weight holds still, is
 * a curve. It is a weight *inside* a tanh on purpose: for an output weight
 * the loss is an exact parabola, and a parabola's symmetric secant equals its
 * slope at every width, which would leave nothing to converge. The visitor zooms in on one point of it — the slider is a
 * magnification, from ±3 down to ±0.0003 — and watches the curve straighten
 * until it cannot be told from the dashed line whose slope backpropagation
 * returned. That is what the number backprop hands a weight *is*: the slope
 * of the loss at that weight, seen close enough.
 *
 * Beside it, the slope measured the slow way — the rise across the visible
 * window, over its width — closes in on backprop's as the window shrinks,
 * and the gap between them is printed, so the convergence is read rather
 * than eyeballed. Dragging the chart slides the point along the curve.
 */
export function ZoomStage() {
  const t = useLabs().backpropagation.zoom;
  const [w, setW] = useState(0.9);
  const [zoom, setZoom] = useState(0);
  const half = 3 * 10 ** -zoom;
  const drag = useRef<{ x: number; w: number } | null>(null);

  const slope = useMemo(() => gradient(GRAPH, { ...FIXED, w11: w }).w11 ?? 0, [w]);
  const secant = (loss(w + half) - loss(w - half)) / (2 * half);

  const curve = useMemo(() => {
    const xs = Array.from({ length: SAMPLES + 1 }, (_, i) => w - half + (2 * half * i) / SAMPLES);
    const ys = xs.map(loss);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const pad = (hi - lo) * 0.12 || Math.abs(hi) * 1e-6 || 1e-9;
    return { xs, ys, lo: lo - pad, hi: hi + pad };
  }, [w, half]);

  const px = (x: number) => ((x - (w - half)) / (2 * half)) * W;
  const py = (y: number) => H - ((y - curve.lo) / (curve.hi - curve.lo)) * H;
  const L = loss(w);
  const tangent = [w - half, w + half].map((x) => [px(x), py(L + slope * (x - w))] as const);

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, w };
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dw = ((e.clientX - drag.current.x) / r.width) * 2 * half;
    setW(Math.min(3, Math.max(-3, drag.current.w - dw)));
  };

  const gap = Math.abs(secant - slope);

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(formatSmall(half), formatValue(slope, 4), formatSmall(gap))}
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-3">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={t.chartLabel(formatValue(w, 3), formatSmall(half))}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
            className="block h-56 w-full cursor-ew-resize touch-none sm:h-64"
          >
            <line
              x1={tangent[0]?.[0]}
              y1={tangent[0]?.[1]}
              x2={tangent[1]?.[0]}
              y2={tangent[1]?.[1]}
              className="stroke-data"
              strokeWidth={1.5}
              strokeDasharray="6 5"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={curve.xs
                .map((x, i) => `${px(x).toFixed(2)},${py(curve.ys[i] ?? 0).toFixed(2)}`)
                .join(" ")}
              className="fill-none stroke-accent"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={W / 2}
              x2={W / 2}
              y1={0}
              y2={H}
              className="stroke-line/15"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* The point, as HTML so it stays round however the chart stretches. */}
          <div className="relative -mt-56 h-56 sm:-mt-64 sm:h-64" aria-hidden>
            <span
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg ring-4 ring-ink-950"
              style={{ left: "50%", top: `${(py(L) / H) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-caption text-fg-faint">
            <span>{formatValue(w - half, 4)}</span>
            <span>{t.axis}</span>
            <span>{formatValue(w + half, 4)}</span>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-caption text-fg-muted">
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 bg-accent" />
              {t.legend.curve}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 border-t border-dashed border-data" />
              {t.legend.tangent}
            </li>
          </ul>
        </div>
      }
      primary={
        <LabSlider
          label={t.zoomLabel}
          value={zoom}
          min={0}
          max={4}
          step={0.05}
          onChange={setZoom}
          format={(v) => `×${formatValue(10 ** v, 0)}`}
          valueText={(v) => t.zoomValue(formatValue(10 ** v, 0))}
        />
      }
      figures={
        <>
          <Figure
            label={t.figures.backprop}
            value={formatValue(slope, 4)}
            hint={t.figures.backpropHint}
            tone="accent"
          />
          <Figure
            label={t.figures.secant}
            value={formatValue(secant, 4)}
            hint={t.figures.secantHint}
          />
          <Figure label={t.figures.gap} value={formatSmall(gap)} />
        </>
      }
    />
  );
}
