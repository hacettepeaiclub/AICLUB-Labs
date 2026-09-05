import { useCallback, useEffect, useRef } from "react";
import { useCanvas2D, useLocalControls, useRepaintFlag } from "@/hooks";
import { ControlPanel, LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { Segmented } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { ACTIVATIONS, type Activation } from "../engine";
import { createScalarFieldPainter, drawAxes } from "../paint";

const activationOptions = ACTIVATIONS.map((a) => ({ value: a.kind, label: a.label }));

const squash = (kind: Activation, z: number): number => {
  switch (kind) {
    case "tanh":
      return Math.tanh(z);
    case "relu":
      // Clipped only for display: the heatmap's scale runs to 1.
      return Math.min(z > 0 ? z : 0, 1);
    case "sigmoid":
      // Recentred so "undecided" reads as the neutral surface color.
      return (1 / (1 + Math.exp(-z))) * 2 - 1;
  }
};

/**
 * One neuron, laid bare.
 *
 * A neuron only ever does two things: add up its inputs with weights, then
 * squash the total. The weights tilt the dividing line, the bias slides it,
 * and the activation decides how sharp the edge is — and you can feel all
 * three by dragging.
 */
export function NeuronLab() {
  const lab = useT().labs["neural-playground"];
  const n = lab.neuron;
  const [state, set] = useLocalControls("acl:neural-playground:neuron", {
    w1: 1.4,
    w2: -0.8,
    bias: 0,
    activation: "tanh" as Activation,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const painterRef = useRef<ReturnType<typeof createScalarFieldPainter> | null>(null);
  // This picture only changes when a slider moves; nothing here animates on its
  // own, so the frame loop stays idle until the controls say otherwise.
  const { markDirty, version } = useRepaintFlag();
  useEffect(markDirty, [state, markDirty]);

  const canvasRef = useCanvas2D(
    useCallback(
      ({ ctx, width, height }) => {
        painterRef.current ??= createScalarFieldPainter(72);
        const { w1, w2, bias, activation } = stateRef.current;
        painterRef.current.draw(ctx, width, height, (x, y) =>
          squash(activation, w1 * x + w2 * y + bias),
        );
        drawAxes(ctx, width, height);
      },
      [],
    ),
    // Nothing here animates on its own, so there is no frame loop at all —
    // each control change repaints exactly once.
    false,
    version,
  );

  const note = ACTIVATIONS.find((a) => a.kind === state.activation)?.note ?? "";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-4">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`A single neuron's output across the input square, with weights ${formatNumber(
            state.w1,
            1,
          )} and ${formatNumber(state.w2, 1)} and bias ${formatNumber(state.bias, 1)}.`}
          className="aspect-square w-full rounded-card bg-ink-800"
        />
        <p className="text-center font-mono text-body-sm text-fg-muted">
          output = {state.activation}(
          <span className="text-accent">{formatNumber(state.w1, 2)}</span>·x₁ +{" "}
          <span className="text-accent">{formatNumber(state.w2, 2)}</span>·x₂ +{" "}
          <span className="text-signal-cyan">{formatNumber(state.bias, 2)}</span>)
        </p>
      </div>

      <div className="space-y-4">
        <ControlPanel className="flex-col items-stretch">
          <LabSlider
            label={n.weight1}
            value={state.w1}
            min={-3}
            max={3}
            step={0.1}
            onChange={(w1) => set({ w1 })}
            format={(v) => formatNumber(v, 1)}
          />
          <LabSlider
            label={n.weight2}
            value={state.w2}
            min={-3}
            max={3}
            step={0.1}
            onChange={(w2) => set({ w2 })}
            format={(v) => formatNumber(v, 1)}
          />
          <LabSlider
            label={n.bias}
            value={state.bias}
            min={-3}
            max={3}
            step={0.1}
            onChange={(bias) => set({ bias })}
            format={(v) => formatNumber(v, 1)}
          />
          <Segmented
            label={n.activation}
            value={state.activation}
            options={activationOptions}
            onChange={(activation) => set({ activation })}
          />
          <p className="text-caption text-fg-faint">{note}</p>
        </ControlPanel>

        <div className="card-surface p-5">
          <p className="text-body-sm text-fg-muted">
            Notice what you <em>cannot</em> do: however you drag these three sliders, the boundary
            stays a straight line. That is the whole limitation of one neuron — and the reason the
            next section exists.
          </p>
        </div>
      </div>
    </div>
  );
}
