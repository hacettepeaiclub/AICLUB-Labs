import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Figure, Stage } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { chain } from "../engine";
import { formatValue } from "../view";

/** How each dial maps its value to an angle: ±135° covers this range. */
const RANGES = [2, 3, 1, 1, 1] as const;
const NAMES = ["x", "a", "b", "c", "d"] as const;
const R = 34;
const GAP = 120;
const W = GAP * 4 + 2 * (R + 16);
const H = 150;
const CY = 64;
const cx = (i: number) => R + 16 + i * GAP;
const angleOf = (v: number, range: number) =>
  (Math.max(-1, Math.min(1, v / range)) * 135 * Math.PI) / 180;

/**
 * Section 3: five dials on one shaft.
 *
 * x drives a = 1.5x, which drives b = tanh(a), which drives c = b², which
 * drives d = 2c − 1. The visitor turns only the first dial, by dragging it
 * round, and watches the others follow — each by its own amount, printed on
 * the link between them. Those amounts are the local derivatives, and how
 * far the last dial moved for a small turn of the first is their product:
 * the chain rule, felt rather than written.
 *
 * The measured ratio — Δd/Δx over the visitor's own last nudge — is shown
 * beside the product, so the claim is checked by the hand that made it.
 */
export function ChainStage() {
  const t = useLabs().backpropagation.chain;
  const [x, setX] = useState(0.35);
  const [last, setLast] = useState<{ dx: number; dd: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const state = chain(x);

  const move = (next: number) => {
    const clamped = Math.max(-RANGES[0], Math.min(RANGES[0], next));
    const dx = clamped - x;
    if (Math.abs(dx) > 1e-9) setLast({ dx, dd: chain(clamped).values[4] - state.values[4] });
    setX(clamped);
  };

  const fromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W - cx(0);
    const py = ((e.clientY - r.top) / r.height) * H - CY;
    // 0 at the top, clockwise positive, clamped to the dial's ±135°.
    let a = Math.atan2(px, -py);
    const limit = (135 * Math.PI) / 180;
    a = Math.max(-limit, Math.min(limit, a));
    move((a / limit) * RANGES[0]);
  };

  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const d =
      e.key === "ArrowRight" || e.key === "ArrowUp"
        ? 0.05
        : e.key === "ArrowLeft" || e.key === "ArrowDown"
          ? -0.05
          : 0;
    if (!d) return;
    e.preventDefault();
    move(x + d);
  };

  const ratio = last && Math.abs(last.dx) > 1e-6 ? last.dd / last.dx : null;

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={t.announce(
        formatValue(x),
        formatValue(state.values[4], 3),
        formatValue(state.product, 3),
      )}
      viewport={
        <div className="overflow-x-auto rounded border border-line/10 bg-ink-950 p-3">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={t.diagramLabel(state.values.map((v) => formatValue(v, 2)).join(", "))}
            className="block h-auto w-full min-w-[30rem] touch-none select-none"
            onPointerMove={(e) => dragging.current && fromPointer(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {state.values.map((v, i) => {
              const a = angleOf(v, RANGES[i] ?? 1);
              const first = i === 0;
              return (
                <g key={i}>
                  {i > 0 && (
                    <>
                      <line
                        x1={cx(i - 1) + R + 4}
                        x2={cx(i) - R - 4}
                        y1={CY}
                        y2={CY}
                        className="stroke-line/25"
                        strokeWidth={1.5}
                      />
                      <text
                        x={(cx(i - 1) + cx(i)) / 2}
                        y={CY - 10}
                        textAnchor="middle"
                        className="fill-data font-mono"
                        fontSize={13}
                      >
                        ×{formatValue(state.locals[i - 1] ?? 0, 2)}
                      </text>
                      <text
                        x={(cx(i - 1) + cx(i)) / 2}
                        y={CY + 22}
                        textAnchor="middle"
                        className="fill-fg-faint font-mono"
                        fontSize={10}
                      >
                        {t.stages[i - 1]}
                      </text>
                    </>
                  )}
                  <g
                    role={first ? "slider" : undefined}
                    tabIndex={first ? 0 : undefined}
                    aria-label={first ? t.dialLabel : undefined}
                    aria-valuemin={first ? -RANGES[0] : undefined}
                    aria-valuemax={first ? RANGES[0] : undefined}
                    aria-valuenow={first ? Number(x.toFixed(2)) : undefined}
                    onKeyDown={first ? onKey : undefined}
                    onPointerDown={
                      first
                        ? (e) => {
                            svgRef.current?.setPointerCapture(e.pointerId);
                            dragging.current = true;
                          }
                        : undefined
                    }
                    className={
                      first
                        ? "cursor-grab outline-none focus-visible:[&>circle]:stroke-accent"
                        : undefined
                    }
                  >
                    <circle
                      cx={cx(i)}
                      cy={CY}
                      r={R}
                      className={
                        first ? "fill-ink-800 stroke-accent" : "fill-ink-800 stroke-line/30"
                      }
                      strokeWidth={first ? 2.5 : 1.5}
                    />
                    {[-135, -90, -45, 0, 45, 90, 135].map((deg) => {
                      const r0 = R - 6;
                      const ra = (deg * Math.PI) / 180;
                      return (
                        <line
                          key={deg}
                          x1={cx(i) + Math.sin(ra) * r0}
                          y1={CY - Math.cos(ra) * r0}
                          x2={cx(i) + Math.sin(ra) * (R - 2)}
                          y2={CY - Math.cos(ra) * (R - 2)}
                          className="stroke-line/30"
                        />
                      );
                    })}
                    <line
                      x1={cx(i)}
                      y1={CY}
                      x2={cx(i) + Math.sin(a) * (R - 8)}
                      y2={CY - Math.cos(a) * (R - 8)}
                      className={first ? "stroke-accent" : "stroke-fg"}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                    <circle cx={cx(i)} cy={CY} r={3} className="fill-fg" />
                  </g>
                  <text
                    x={cx(i)}
                    y={CY + R + 20}
                    textAnchor="middle"
                    className="fill-fg font-mono"
                    fontSize={12}
                  >
                    {NAMES[i]} = {formatValue(v, 3)}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 font-mono text-caption text-fg-muted sm:text-body-sm">
            d′(x) = {state.locals.map((l) => formatValue(l, 3)).join(" × ")} ={" "}
            <span className="text-accent">{formatValue(state.product, 3)}</span>
          </p>
        </div>
      }
      primary={<p className="text-body-sm text-fg-muted">{t.hint}</p>}
      figures={
        <>
          <Figure
            label={t.figures.product}
            value={formatValue(state.product, 3)}
            hint={t.figures.productHint}
            tone="accent"
          />
          <Figure
            label={t.figures.measured}
            value={ratio === null ? "—" : formatValue(ratio, 3)}
            hint={last ? t.figures.measuredHint(formatValue(last.dx, 4)) : t.figures.measuredEmpty}
          />
        </>
      }
    />
  );
}
