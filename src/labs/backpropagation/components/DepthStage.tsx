import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { depthGradients, type Activation } from "../engine";
import { formatSmall, formatValue } from "../view";

const MAX = 30;
const W = 720;
const H = 230;
const LEFT = 30;
const SPACING = (W - LEFT - 40) / MAX;
const ROW = 40;
/** The log scale of the bars: 10⁻¹² at the floor, 10⁴ at the top. */
const FLOOR = -12;
const CEIL = 4;
const BAR_TOP = 70;
const BAR_BOTTOM = 210;
const barY = (v: number) => {
  const l = Math.min(CEIL, Math.max(FLOOR, Math.log10(Math.max(v, 1e-300))));
  return BAR_BOTTOM - ((l - FLOOR) / (CEIL - FLOOR)) * (BAR_BOTTOM - BAR_TOP);
};
const ACTIVATIONS: readonly Activation[] = ["sigmoid", "tanh", "relu"];

/**
 * Section 6: pull the network longer and watch the signal fade.
 *
 * A chain of one-neuron layers, h = act(w·h), drawn as a row; the visitor
 * grabs the last neuron and drags it to the right to add layers, up to
 * thirty. Under each layer a bar, on a log scale, shows how much of a change
 * there would still reach the end — the gradient arriving back at that layer.
 *
 * With sigmoid at w = 1 every layer multiplies it by at most a quarter, so
 * ten layers lose six orders of magnitude; the bars fall off a cliff. ReLU
 * passes it through exactly while the signal stays positive, and turning w
 * above 1 shows the other failure, gradients that explode. Every bar is
 * `depthGradients`, which the tests hold to central differences.
 */
export function DepthStage() {
  const t = useLabs().backpropagation.depth;
  const [stored, save] = useLocalControls("acl:backpropagation:depth", {
    depth: 8,
    activation: "sigmoid" as string,
    weight: 1,
  });
  const depth = Math.min(MAX, Math.max(1, Math.round(stored.depth)));
  const activation = (ACTIVATIONS as readonly string[]).includes(stored.activation)
    ? (stored.activation as Activation)
    : "sigmoid";
  const weight = Math.min(2.5, Math.max(0.5, stored.weight));
  const grads = depthGradients(depth, activation, weight);
  const first = grads[0] ?? 0;
  const factor = depth > 1 && first > 0 ? first ** (1 / depth) : (grads[0] ?? 0);
  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const xOf = (l: number) => LEFT + l * SPACING;
  const fromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * W;
    save({ depth: Math.min(MAX, Math.max(1, Math.round((x - LEFT) / SPACING))) });
  };
  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    save({ depth: Math.min(MAX, Math.max(1, depth + d)) });
  };

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={t.announce(depth, formatSmall(first))}
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-3">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={t.chartLabel(depth, t.activations[activation], formatSmall(first))}
            className="block h-auto w-full touch-none select-none"
            onPointerMove={(e) => dragging.current && fromPointer(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {[0, -4, -8, -12].map((l) => (
              <g key={l}>
                <line
                  x1={LEFT - 10}
                  x2={W - 20}
                  y1={barY(10 ** l)}
                  y2={barY(10 ** l)}
                  className="stroke-line/10"
                />
                <text
                  x={W - 16}
                  y={barY(10 ** l) + 4}
                  className="fill-fg-faint font-mono"
                  fontSize={9}
                >
                  1e{l}
                </text>
              </g>
            ))}
            <line
              x1={xOf(0)}
              x2={xOf(depth)}
              y1={ROW}
              y2={ROW}
              className="stroke-line/25"
              strokeWidth={2}
            />
            {grads.map((g, l) => (
              <g key={l}>
                <rect
                  x={xOf(l) - SPACING * 0.32}
                  width={SPACING * 0.64}
                  y={barY(g)}
                  height={Math.max(BAR_BOTTOM - barY(g), 1)}
                  rx={1.5}
                  className={
                    g > 1.5 ? "fill-signal-amber" : g < 1e-4 ? "fill-signal-rose/70" : "fill-accent"
                  }
                />
                <circle
                  cx={xOf(l)}
                  cy={ROW}
                  r={6}
                  className={l === 0 ? "fill-fg-muted" : "fill-ink-800 stroke-fg/50"}
                  strokeWidth={1.5}
                />
              </g>
            ))}
            {/* the end of the chain: the handle that makes it longer */}
            <g
              role="slider"
              tabIndex={0}
              aria-label={t.handleLabel}
              aria-valuemin={1}
              aria-valuemax={MAX}
              aria-valuenow={depth}
              onKeyDown={onKey}
              onPointerDown={(e) => {
                svgRef.current?.setPointerCapture(e.pointerId);
                dragging.current = true;
              }}
              className="cursor-ew-resize outline-none focus-visible:[&>circle:last-child]:stroke-accent"
            >
              <circle cx={xOf(depth)} cy={ROW} r={22} className="fill-transparent" />
              <circle
                cx={xOf(depth)}
                cy={ROW}
                r={11}
                className="fill-data stroke-ink-950"
                strokeWidth={3}
              />
            </g>
            <text
              x={xOf(0)}
              y={ROW - 16}
              textAnchor="middle"
              className="fill-fg-faint font-mono"
              fontSize={10}
            >
              x
            </text>
            <text
              x={xOf(depth)}
              y={ROW - 18}
              textAnchor="middle"
              className="fill-fg font-mono"
              fontSize={10}
            >
              {t.end}
            </text>
          </svg>
          <p className="mt-1 text-caption text-fg-faint">{t.hint}</p>
        </div>
      }
      primary={
        <Segmented
          label={t.activationLabel}
          value={activation}
          options={ACTIVATIONS.map((a) => ({ value: a, label: t.activations[a] }))}
          onChange={(a) => save({ activation: a })}
        />
      }
      secondary={
        <>
          <LabSlider
            label={t.weightLabel}
            value={weight}
            min={0.5}
            max={2.5}
            step={0.05}
            onChange={(v) => save({ weight: v })}
            format={(v) => formatValue(v)}
          />
          <LabSlider
            label={t.depthLabel}
            value={depth}
            min={1}
            max={MAX}
            onChange={(v) => save({ depth: v })}
          />
        </>
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure
            label={t.figures.first}
            value={formatSmall(first)}
            hint={t.figures.firstHint}
            tone="accent"
          />
          <Figure
            label={t.figures.factor}
            value={`×${formatValue(factor, 3)}`}
            hint={t.figures.factorHint}
          />
        </>
      }
    />
  );
}
