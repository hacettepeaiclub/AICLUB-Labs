import { useState } from "react";
import { useLabCopy } from "@/i18n/labs";
import { labColor } from "@/design/tokens";
import { usePaletteVersion } from "@/hooks";
import type { Guess } from "../engine";

type Network = keyof Guess["layers"];
/** One real forward pass at a time. Edges show connectivity, not weight magnitude. */
export function LayerInspector({ trace, initial }: { trace: Guess; initial: Network }) {
  usePaletteVersion();
  const t = useLabCopy("jepa"),
    n = t.network;
  const [network, setNetwork] = useState<Network>(initial);
  const [neuron, setNeuron] = useState(0);
  const pass = trace.layers[network];
  const columns = [pass.input, pass.hidden, pass.output];
  const xs = [35, 180, 325];
  const at = (i: number, count: number) => 24 + ((i + 0.5) * 208) / count;
  const nodeColor = (value: number) =>
    labColor(value < 0 ? "data" : "accent", 0.15 + 0.85 * Math.min(1, Math.abs(value)));
  return (
    <details className="rounded-lg border border-line/20 bg-ink-800 p-3" data-jepa-layers>
      <summary className="cursor-pointer py-2 text-body-sm font-medium text-fg">{n.open}</summary>
      <p className="my-3 text-caption text-fg-muted">{n.note}</p>
      <label className="block space-y-2 text-caption text-fg-muted">
        {n.choose}
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as Network)}
          className="min-h-11 w-full rounded border border-line/30 bg-ink-900 p-2 text-fg"
        >
          {(["encoder", "predictor", "target"] as const).map((k) => (
            <option key={k} value={k}>
              {n[k]}
            </option>
          ))}
        </select>
      </label>
      <p className="my-3 text-body-sm text-fg">{n[`${network}Hint`]}</p>
      <div className="grid grid-cols-3 gap-2 text-center text-caption text-fg-muted">
        {[n.input, n.hidden, n.output].map((label, i) => (
          <div key={label}>
            {label}
            <strong className="block text-body-lg text-accent">{columns[i]!.length}</strong>
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 360 256"
        role="img"
        aria-label={`${n[network]}: ${columns.map((c) => c.length).join(" → ")}`}
        className="w-full"
      >
        {[0, 1].flatMap((c) =>
          Array.from(columns[c]!, (_, i) =>
            Array.from(columns[c + 1]!, (_, j) => {
              const highlighted = c === 0 ? j === neuron : i === neuron;
              return (
                <line
                  key={`${c}-${i}-${j}`}
                  x1={xs[c]}
                  y1={at(i, columns[c]!.length)}
                  x2={xs[c + 1]}
                  y2={at(j, columns[c + 1]!.length)}
                  stroke={labColor(highlighted ? "accent" : "fgFaint", highlighted ? 0.55 : 0.1)}
                  strokeWidth={highlighted ? 1 : 0.5}
                />
              );
            }),
          ),
        )}
        {columns.map((values, c) =>
          Array.from(values, (v, i) => (
            <circle
              key={`${c}-${i}`}
              cx={xs[c]}
              cy={at(i, values.length)}
              r={c === 1 && i === neuron ? 5.5 : 4}
              fill={nodeColor(v)}
              stroke={labColor(c === 1 && i === neuron ? "fg" : "fgFaint", 0.6)}
              strokeWidth="0.7"
            >
              <title>{`${i + 1}: ${t.decimal(v, 3)}`}</title>
            </circle>
          )),
        )}
      </svg>
      <label className="block text-caption text-fg-muted">
        {n.neuron}: {neuron + 1} · {n.value}:{" "}
        <span className="font-mono text-accent">{t.decimal(pass.hidden[neuron]!, 3)}</span>
        <input
          type="range"
          min="0"
          max={pass.hidden.length - 1}
          step="1"
          value={neuron}
          onChange={(e) => setNeuron(Number(e.target.value))}
          className="min-h-11 w-full accent-accent"
        />
      </label>
      <p className="mt-2 text-caption text-fg-muted">{n.normalization}</p>
    </details>
  );
}
