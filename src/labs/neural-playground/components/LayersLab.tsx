import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { formatPercent } from "@/lib/format";
import { generateDataset, splitDataset } from "../datasets";
import { useTrainer, type TrainerConfig } from "../useTrainer";
import { DecisionCanvas } from "./DecisionCanvas";

const BASE: Omit<TrainerConfig, "hidden" | "seed"> = {
  activation: "tanh",
  learningRate: 0.1,
  l2: 0,
  batchSize: 10,
  epochsPerFrame: 3,
};

/**
 * The same data, the same learning rate, the same number of epochs — the only
 * difference is one hidden layer. It is the cleanest demonstration in the
 * whole subject, so the lab lets you run it rather than asserting it.
 */
export function LayersLab() {
  const t = useT();
  const lab = t.labs["neural-playground"];
  const reduced = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);

  const points = useMemo(() => generateDataset("xor", 160, 0.06, 3), []);
  const { train, test } = useMemo(() => splitDataset(points, 0.75, 9), [points]);

  const flat = useTrainer(train, test, { ...BASE, hidden: [], seed: 4 + round }, running);
  const deep = useTrainer(train, test, { ...BASE, hidden: [4], seed: 4 + round }, running);

  const restart = () => {
    setRunning(false);
    setRound((r) => r + 1);
  };

  const columns = [
    {
      key: "flat",
      title: lab.layersPanels.flat.title,
      subtitle: lab.layersPanels.flat.subtitle,
      trainer: flat,
      sizes: "2 → 1",
    },
    {
      key: "deep",
      title: lab.layersPanels.deep.title,
      subtitle: lab.layersPanels.deep.subtitle,
      trainer: deep,
      sizes: "2 → 4 → 1",
    },
  ];

  // Long enough that the visitor has actually watched it plateau.
  const decided = flat.stats.epoch > 600;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {columns.map((column) => (
          <div key={column.key} className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-title text-fg">{column.title}</h3>
              <span className="font-mono text-caption text-fg-faint">{column.sizes}</span>
            </div>
            <p className="min-h-10 text-body-sm text-fg-muted">{column.subtitle}</p>
            <DecisionCanvas
              netRef={column.trainer.netRef}
              points={points}
              running={running}
              revision={column.trainer.generation + column.trainer.revision}
              ariaLabel={`${column.title}: ${Math.round(
                column.trainer.stats.accuracy * 100,
              )}% of the XOR points classified correctly after ${column.trainer.stats.epoch} epochs.`}
            />
            <div className="card-surface flex items-baseline justify-between gap-4 px-4 py-3">
              <span className="text-caption text-fg-muted">{lab.layers.accuracy}</span>
              <span className="font-mono text-title tabular-nums text-fg">
                {formatPercent(column.trainer.stats.accuracy, 1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setRunning((value) => !value)} className="min-w-32">
          {running ? lab.layers.pauseBoth : reduced ? lab.layers.trainBothShort : lab.layers.trainBoth}
        </Button>
        <Button variant="secondary" onClick={restart}>
          {lab.layers.startOver}
        </Button>
        <p className="text-body-sm text-fg-muted" aria-live="polite">
          {decided
            ? lab.layersCaption.solved
            : lab.layersCaption.idle}
        </p>
      </div>
    </div>
  );
}
