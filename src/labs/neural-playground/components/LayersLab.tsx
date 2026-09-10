import { useMemo, useState } from "react";
import { Figure, Stage, Transport } from "@/components/lab";
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
    <Stage
      width="full"
      // One button, two networks, and the whole point is watching them race.
      // In the rail this left a 288px column empty for 422px beside the
      // canvases; centred underneath, Run sits between the two things it
      // starts.
      controls="stack"
      caption={decided ? lab.layersCaption.solved : lab.layersCaption.idle}
      announcement={decided ? lab.layersCaption.solved : ""}
      viewport={
        <div className="grid gap-4 sm:grid-cols-2">
          {columns.map((column) => (
            <div key={column.key} className="min-w-0 space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-body-sm font-semibold text-fg">{column.title}</h3>
                <span className="font-mono text-caption text-fg-faint">{column.sizes}</span>
              </div>
              <p className="text-caption text-fg-muted">{column.subtitle}</p>
              <DecisionCanvas
                netRef={column.trainer.netRef}
                points={points}
                running={running}
                revision={column.trainer.generation + column.trainer.revision}
                ariaLabel={lab.layers.panelLabel(
                  column.title,
                  Math.round(column.trainer.stats.accuracy * 100),
                  column.trainer.stats.epoch,
                )}
                /* Two pictures to compare, not two billboards: given the
                   full width they grew to 511px square each. */
                className="mx-auto max-w-sm"
              />
              <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
                <Figure
                  label={lab.layers.accuracy}
                  value={formatPercent(column.trainer.stats.accuracy, 1)}
                  tone={column.key === "deep" ? "accent" : "default"}
                />
              </div>
            </div>
          ))}
        </div>
      }
      primary={
        <Transport
          running={running}
          onRun={() => setRunning((value) => !value)}
          onStep={() => {
            for (const column of columns) column.trainer.step(20);
          }}
          onReset={restart}
          runLabel={lab.layers.trainBoth}
          stepDisabled={running}
        />
      }
    />
  );
}
