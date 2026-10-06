import { useCallback, useEffect, useRef } from "react";
import { useCanvas2D, useLocalControls, useRepaintFlag } from "@/hooks";
import { LabSlider, Stage } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { Segmented } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { ACTIVATIONS, type Activation } from "../engine";
import { LIMIT, type Line } from "../lines";
import { createScalarFieldPainter, drawAxes } from "../paint";
import { LineOverlay } from "./LineOverlay";

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
 * and the activation decides how sharp the edge is.
 *
 * The line itself is the control. It is drawn over the neuron's output with
 * its weight vector standing on it as an arrow (`LineOverlay`): drag the
 * square and the line comes to the finger, which is the bias; drag the
 * arrow's tip and it turns and sharpens, which is the two weights. The
 * sliders that used to be the only way in are still there, behind the
 * disclosure, for exact values and the keyboard.
 */
export function NeuronLab() {
  const lab = useLabs()["multilayer-perceptrons"];
  const n = lab.neuron;
  const [state, set] = useLocalControls("acl:multilayer-perceptrons:neuron", {
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
    useCallback(({ ctx, width, height }) => {
      painterRef.current ??= createScalarFieldPainter(72);
      const { w1, w2, bias, activation } = stateRef.current;
      painterRef.current.draw(ctx, width, height, (x, y) =>
        squash(activation, w1 * x + w2 * y + bias),
      );
      drawAxes(ctx, width, height);
    }, []),
    // Nothing here animates on its own, so there is no frame loop at all —
    // each control change repaints exactly once.
    false,
    version,
  );

  // The engine also carries an English `note` per activation. It stays there,
  // untouched; the sentence a visitor reads comes from the dictionary.
  const note = n.notes[state.activation];
  const line: Line = { w1: state.w1, w2: state.w2, b: state.bias };

  return (
    <Stage
      width="wide"
      secondaryLabel={n.activation}
      caption={n.caption}
      viewport={
        <div className="space-y-2">
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={lab.neuronLabel(
                formatNumber(state.w1, 1),
                formatNumber(state.w2, 1),
                formatNumber(state.bias, 1),
              )}
              className="absolute inset-0 h-full w-full rounded border border-line/10 bg-ink-950"
            />
            <LineOverlay
              lines={[line]}
              active={0}
              onChange={(_i, next) => set({ w1: round(next.w1), w2: round(next.w2), bias: round(next.b) })}
              labels={{ slide: () => n.slideHandle, turn: () => n.turnHandle }}
            />
          </div>
          {/* The sum it is actually computing, in the same numbers the sliders
              are setting. */}
          <p className="text-center font-mono text-body-sm text-fg-muted">
            output = {state.activation}(
            <span className="text-accent">{formatNumber(state.w1, 2)}</span>·x₁ +{" "}
            <span className="text-accent">{formatNumber(state.w2, 2)}</span>·x₂ +{" "}
            <span className="text-data">{formatNumber(state.bias, 2)}</span>)
          </p>
        </div>
      }
      /* The line is the control now; the sliders below give the same three
         numbers exactly, for the keyboard. */
      primary={<p className="text-body-sm text-fg">{n.dragHint}</p>}
      secondary={
        <div className="space-y-4">
          <div className="space-y-3">
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
          </div>
        <div className="space-y-2">
          <Segmented
            label={n.activation}
            value={state.activation}
            options={activationOptions}
            onChange={(activation) => set({ activation })}
          />
          <p className="text-caption text-fg-faint">{note}</p>
        </div>
        </div>
      }
    />
  );
}

/** The sliders' grid is 0.1 and their range ±3; a dragged line lands on the same grid. */
const round = (v: number) => Math.max(-LIMIT, Math.min(LIMIT, Math.round(v * 10) / 10));
