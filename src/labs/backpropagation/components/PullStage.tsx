import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useReducedMotion } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { aimStep, evaluate, gradient, network, NETWORK_PARAMS, type NetworkParam } from "../engine";
import { formatValue } from "../view";

const X1 = 0.8;
const X2 = -0.5;
const NET = network(X1, X2);
const START: Record<NetworkParam, number> = {
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

/** The output's track, in output units. */
const LO = -2;
const HI = 2;
const W = 500;
const H = 300;
const TRACK_X = 430;
const TRACK_TOP = 30;
const TRACK_BOTTOM = 270;
const yOf = (v: number) => TRACK_BOTTOM - ((v - LO) / (HI - LO)) * (TRACK_BOTTOM - TRACK_TOP);
const vOf = (y: number) => LO + ((TRACK_BOTTOM - y) / (TRACK_BOTTOM - TRACK_TOP)) * (HI - LO);

const POS = {
  x1: { x: 42, y: 90 },
  x2: { x: 42, y: 210 },
  h1: { x: 232, y: 90 },
  h2: { x: 232, y: 210 },
  out: { x: TRACK_X, y: 150 },
} as const;

/** Which edge each weight is drawn on. Biases sit on their node. */
const EDGES: readonly { param: NetworkParam; from: keyof typeof POS; to: keyof typeof POS }[] = [
  { param: "w11", from: "x1", to: "h1" },
  { param: "w12", from: "x2", to: "h1" },
  { param: "w21", from: "x1", to: "h2" },
  { param: "w22", from: "x2", to: "h2" },
  { param: "v1", from: "h1", to: "out" },
  { param: "v2", from: "h2", to: "out" },
];
const BIASES: readonly { param: NetworkParam; at: keyof typeof POS }[] = [
  { param: "b1", at: "h1" },
  { param: "b2", at: "h2" },
  { param: "c", at: "out" },
];

/**
 * Where a weight's value is written along its edge. The two crossing edges
 * meet at their midpoints, so their labels sit a quarter of the way along
 * instead, near the input each one starts from.
 */
const labelAt = (e: { x1: number; y1: number; x2: number; y2: number }, param: NetworkParam) => {
  const f = param === "w12" || param === "w21" ? 0.25 : 0.5;
  return { x: e.x1 + (e.x2 - e.x1) * f, y: e.y1 + (e.y2 - e.y1) * f };
};

/**
 * Section 1: grab the output and pull.
 *
 * There is no button that says "backpropagate". The visitor takes hold of
 * the network's output and drags it to where they want it, and while they
 * hold it every weight lights up with how much of that pull it would carry:
 * the size of its share of the step, and which way. Letting go takes the
 * step — the smallest change of the weights that a straight-line view of
 * the network says would land the output on the target — and the page
 * reports where it actually landed, which is close but not exact, because
 * the network is not a straight line.
 *
 * Every share comes from `gradient`, which the tests hold to central
 * differences; the step is `aimStep`, tested to miss by a second-order
 * amount.
 */
export function PullStage() {
  const lab = useLabs().backpropagation;
  const t = lab.pull;
  const reduced = useReducedMotion() ?? false;
  const [params, setParams] = useState<Record<NetworkParam, number>>(START);
  const [target, setTarget] = useState<number | null>(null);
  const [landed, setLanded] = useState<{ aimed: number; landed: number } | null>(null);
  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const anim = useRef(0);

  const out = evaluate(NET.graph, params);
  const grads = useMemo(
    () => gradient(NET.graph, params) as Record<NetworkParam, number>,
    [params],
  );
  const step = useMemo(
    () => (target === null ? null : aimStep(NET.graph, params, target)),
    [params, target],
  );
  /** Each weight's share of the step: Δθ. */
  const shares = useMemo(() => {
    const s: Record<string, number> = {};
    for (const p of NETWORK_PARAMS) s[p] = step ? (step[p] ?? 0) - params[p] : 0;
    return s;
  }, [step, params]);
  const biggest = Math.max(1e-9, ...Object.values(shares).map(Math.abs));
  const leader = step
    ? NETWORK_PARAMS.reduce((a, b) => (Math.abs(shares[b] ?? 0) > Math.abs(shares[a] ?? 0) ? b : a))
    : null;

  const values = useMemo(() => {
    const z = (w1: number, w2: number, b: number) => Math.tanh(w1 * X1 + w2 * X2 + b);
    return { h1: z(params.w11, params.w12, params.b1), h2: z(params.w21, params.w22, params.b2) };
  }, [params]);

  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const release = () => {
    if (!step || target === null) return;
    const from = params;
    const to = step as Record<NetworkParam, number>;
    const aimed = target;
    setTarget(null);
    const finish = () => {
      setParams(to);
      setLanded({ aimed, landed: evaluate(NET.graph, to) });
    };
    if (reduced) return finish();
    const start = performance.now();
    const run = (now: number) => {
      const k = Math.min((now - start) / 450, 1);
      const e = 1 - (1 - k) ** 3;
      const mid = {} as Record<NetworkParam, number>;
      for (const p of NETWORK_PARAMS) mid[p] = from[p] + (to[p] - from[p]) * e;
      setParams(mid);
      if (k < 1) anim.current = requestAnimationFrame(run);
      else finish();
    };
    anim.current = requestAnimationFrame(run);
  };

  const pointToTarget = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const y = ((event.clientY - r.top) / r.height) * H;
    setTarget(Math.min(HI, Math.max(LO, vOf(y))));
  };

  const onKey = (event: KeyboardEvent<SVGElement>) => {
    const d = event.key === "ArrowUp" ? 0.1 : event.key === "ArrowDown" ? -0.1 : 0;
    if (d) {
      event.preventDefault();
      setLanded(null);
      setTarget((v) => Math.min(HI, Math.max(LO, (v ?? out) + d)));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      release();
    }
  };

  const edge = (from: keyof typeof POS, to: keyof typeof POS) => ({
    x1: POS[from].x,
    y1: POS[from].y,
    x2: to === "out" ? TRACK_X : POS[to].x,
    y2: to === "out" ? yOf(out) : POS[to].y,
  });

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={
        landed
          ? t.announceLanded(formatValue(landed.aimed), formatValue(landed.landed))
          : target !== null
            ? t.announceAim(formatValue(target), leader ?? "")
            : ""
      }
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-3">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={t.diagramLabel(formatValue(out))}
            className="block h-auto w-full touch-none select-none"
            onPointerMove={(e) => dragging.current && pointToTarget(e)}
            onPointerUp={() => {
              if (dragging.current) {
                dragging.current = false;
                release();
              }
            }}
            onPointerCancel={() => {
              dragging.current = false;
              setTarget(null);
            }}
          >
            {/* the output's track and its scale */}
            <line
              x1={TRACK_X}
              x2={TRACK_X}
              y1={TRACK_TOP}
              y2={TRACK_BOTTOM}
              className="stroke-line/20"
              strokeWidth={2}
            />
            {[-2, -1, 0, 1, 2].map((v) => (
              <g key={v}>
                <line
                  x1={TRACK_X - 6}
                  x2={TRACK_X + 6}
                  y1={yOf(v)}
                  y2={yOf(v)}
                  className="stroke-line/30"
                />
                <text
                  x={TRACK_X + 14}
                  y={yOf(v) + 5}
                  className="fill-fg-faint font-mono"
                  fontSize={14}
                >
                  {formatValue(v)}
                </text>
              </g>
            ))}

            {EDGES.map(({ param, from, to }) => {
              const share = shares[param] ?? 0;
              const k = Math.abs(share) / biggest;
              const live = target !== null && k > 0.01;
              return (
                <g key={param}>
                  <line {...edge(from, to)} className="stroke-line/15" strokeWidth={2} />
                  {live && (
                    <line
                      {...edge(from, to)}
                      className={cn(
                        share > 0 ? "stroke-accent" : "stroke-signal-rose",
                        !reduced && "backflow",
                      )}
                      strokeWidth={1.5 + 7 * k}
                      strokeOpacity={0.35 + 0.65 * k}
                      strokeDasharray={reduced ? undefined : "10 8"}
                      strokeLinecap="round"
                    />
                  )}
                  <text
                    x={labelAt(edge(from, to), param).x}
                    y={labelAt(edge(from, to), param).y - 8}
                    textAnchor="middle"
                    className={cn("font-mono", live ? "fill-fg" : "fill-fg-faint")}
                    fontSize={14}
                  >
                    {formatValue(params[param])}
                  </text>
                </g>
              );
            })}

            {(["x1", "x2", "h1", "h2"] as const).map((key) => (
              <g key={key}>
                <circle
                  cx={POS[key].x}
                  cy={POS[key].y}
                  r={30}
                  className="fill-ink-800 stroke-line/30"
                  strokeWidth={1.5}
                />
                <text
                  x={POS[key].x}
                  y={POS[key].y - 3}
                  textAnchor="middle"
                  className="fill-fg-muted font-mono"
                  fontSize={14}
                >
                  {key === "x1" ? "x₁" : key === "x2" ? "x₂" : key === "h1" ? "h₁" : "h₂"}
                </text>
                <text
                  x={POS[key].x}
                  y={POS[key].y + 15}
                  textAnchor="middle"
                  className="fill-fg font-mono"
                  fontSize={14}
                >
                  {formatValue(key === "x1" ? X1 : key === "x2" ? X2 : values[key])}
                </text>
              </g>
            ))}

            {BIASES.map(({ param, at }) => {
              const share = shares[param] ?? 0;
              const k = Math.abs(share) / biggest;
              const pos = at === "out" ? { x: TRACK_X, y: yOf(out) } : POS[at];
              return (
                <text
                  key={param}
                  x={pos.x - (at === "out" ? 34 : 0)}
                  y={pos.y + (at === "out" ? 34 : 50)}
                  textAnchor="middle"
                  className={cn(
                    "font-mono",
                    target !== null && k > 0.01
                      ? share > 0
                        ? "fill-accent"
                        : "fill-signal-rose"
                      : "fill-fg-faint",
                  )}
                  fontSize={13 + 3 * (target !== null ? k : 0)}
                >
                  {t.bias(
                    param === "c" ? "c" : param === "b1" ? "b₁" : "b₂",
                    formatValue(params[param]),
                  )}
                </text>
              );
            })}

            {/* the output, and the handle the visitor pulls */}
            {target !== null && (
              <line
                x1={TRACK_X}
                x2={TRACK_X}
                y1={yOf(out)}
                y2={yOf(target)}
                className="stroke-data"
                strokeWidth={3}
                strokeDasharray="4 4"
              />
            )}
            <circle
              cx={TRACK_X}
              cy={yOf(out)}
              r={13}
              className="fill-ink-800 stroke-fg"
              strokeWidth={2}
            />
            <g
              role="slider"
              tabIndex={0}
              aria-label={t.handleLabel}
              aria-valuemin={LO}
              aria-valuemax={HI}
              aria-valuenow={Number((target ?? out).toFixed(2))}
              aria-valuetext={t.handleValue(
                formatValue(out),
                target === null ? null : formatValue(target),
              )}
              onKeyDown={onKey}
              onPointerDown={(e) => {
                e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
                dragging.current = true;
                setLanded(null);
                cancelAnimationFrame(anim.current);
              }}
              className="cursor-grab outline-none focus-visible:[&>circle]:stroke-accent"
            >
              <circle cx={TRACK_X} cy={yOf(target ?? out)} r={22} className="fill-transparent" />
              <circle
                cx={TRACK_X}
                cy={yOf(target ?? out)}
                r={9}
                className={target !== null ? "fill-data" : "fill-fg"}
                strokeWidth={3}
              />
            </g>
            <text
              x={TRACK_X}
              y={18}
              textAnchor="middle"
              className="fill-fg-faint font-mono"
              fontSize={14}
            >
              ŷ
            </text>
          </svg>
          <p className="mt-2 text-caption text-fg-muted">
            {target !== null && leader
              ? t.leaderLine(leader, formatValue(shares[leader] ?? 0))
              : landed
                ? t.landedLine(formatValue(landed.aimed), formatValue(landed.landed))
                : t.hint}
          </p>
        </div>
      }
      primary={
        <div className="flex gap-2">
          <Button onClick={release} disabled={target === null} className="min-h-[44px] flex-1">
            {t.letGo}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              cancelAnimationFrame(anim.current);
              setParams(START);
              setTarget(null);
              setLanded(null);
            }}
            className="min-h-[44px]"
          >
            {t.reset}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure label={t.figures.output} value={formatValue(out)} tone="accent" />
          <Figure label={t.figures.target} value={target === null ? "—" : formatValue(target)} />
          <Figure
            label={t.figures.landed}
            value={landed ? formatValue(landed.landed) : "—"}
            hint={
              landed
                ? t.figures.missedBy(formatValue(Math.abs(landed.landed - landed.aimed), 3))
                : undefined
            }
          />
        </>
      }
      readout={
        <details className="rounded border border-line/10 px-3 py-2 text-caption text-fg-muted">
          <summary className="cursor-pointer select-none">{t.tableTitle}</summary>
          <table className="mt-2 w-full font-mono tabular-nums">
            <thead>
              <tr className="text-left text-fg-faint">
                <th className="py-1 font-normal">{t.columns.weight}</th>
                <th className="py-1 font-normal">{t.columns.value}</th>
                <th className="py-1 font-normal">∂ŷ/∂θ</th>
              </tr>
            </thead>
            <tbody>
              {NETWORK_PARAMS.map((p) => (
                <tr key={p} className="border-t border-line/5">
                  <td className="py-1 text-fg">{p}</td>
                  <td className="py-1">{formatValue(params[p], 3)}</td>
                  <td className="py-1">{formatValue(grads[p], 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      }
    />
  );
}
