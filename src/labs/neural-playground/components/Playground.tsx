import { useCallback, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button, Kbd, Segmented } from "@/components/ui";
import { ControlPanel, LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { useKeyPress } from "@/hooks";
import { formatNumber } from "@/lib/format";
import {
  DATASETS,
  generateDataset,
  splitDataset,
  type DatasetKind,
  type Label,
  type Point,
} from "../datasets";
import { ACTIVATIONS, type Activation } from "../engine";
import { useTrainer } from "../useTrainer";
import { DecisionCanvas } from "./DecisionCanvas";
import { NetworkDiagram } from "./NetworkDiagram";
import { TrainingStats } from "./TrainingStats";

/** Log-spaced, because the interesting range of a learning rate is multiplicative. */
const LEARNING_RATES = [0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1] as const;
const L2_RATES = [0, 0.001, 0.003, 0.01, 0.03] as const;
const POINT_COUNT = 200;
const DEFAULT_DATASET: DatasetKind = "circle";

const activationOptions = ACTIVATIONS.map((a) => ({ value: a.kind, label: a.label }));

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-fg-muted">
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-pill bg-accent-fill" />
        Class A
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-[2px] bg-signal-cyan" />
        Class B
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-pill ring-1 ring-signal-amber" />
        Currently wrong
      </span>
    </div>
  );
}

/**
 * The lab's centrepiece: a network training in real time against points the
 * visitor can draw themselves.
 *
 * All simulation state lives here; the canvas and the diagram read the network
 * out of a ref every frame, so training at 60fps costs no re-renders.
 */
export function Playground() {
  const t = useT();
  const lab = t.labs["neural-playground"];
  const p = lab.playground;
  const datasetOptions = DATASETS.map((d) => ({ value: d.kind, label: lab.datasets[d.kind].label }));
  const reduced = useReducedMotion();

  const [dataset, setDataset] = useState<DatasetKind>(DEFAULT_DATASET);
  const [noise, setNoise] = useState(0.12);
  const [dataSeed, setDataSeed] = useState(7);
  const [points, setPoints] = useState<Point[]>(() =>
    generateDataset(DEFAULT_DATASET, POINT_COUNT, 0.12, 7),
  );

  const [layers, setLayers] = useState(1);
  const [neurons, setNeurons] = useState(4);
  const [activation, setActivation] = useState<Activation>("tanh");
  const [rateIndex, setRateIndex] = useState(4);
  const [l2Index, setL2Index] = useState(0);
  const [speed, setSpeed] = useState(3);
  const [netSeed, setNetSeed] = useState(11);

  // Autoplaying simulations start paused for reduced-motion visitors.
  const [running, setRunning] = useState(!reduced);
  const [paintClass, setPaintClass] = useState<Label>(1);

  const { train, test } = useMemo(() => splitDataset(points, 0.75, 5), [points]);
  const hidden = useMemo(() => Array.from({ length: layers }, () => neurons), [layers, neurons]);
  const sizes = useMemo(() => [2, ...hidden, 1], [hidden]);

  const config = {
    hidden,
    activation,
    learningRate: LEARNING_RATES[rateIndex] ?? 0.03,
    l2: L2_RATES[l2Index] ?? 0,
    batchSize: 10,
    seed: netSeed,
    epochsPerFrame: speed,
  };

  const trainer = useTrainer(train, test, config, running);
  const { netRef, stats, history, generation, revision, reset, step } = trainer;

  const regenerate = useCallback((kind: DatasetKind, level: number, seed: number) => {
    setPoints(generateDataset(kind, POINT_COUNT, level, seed));
  }, []);

  const handleDataset = (kind: DatasetKind) => {
    setDataset(kind);
    regenerate(kind, noise, dataSeed);
    reset();
  };

  const handleNoise = (value: number) => {
    setNoise(value);
    regenerate(dataset, value, dataSeed);
  };

  const handleReshuffle = () => {
    const seed = dataSeed + 1;
    setDataSeed(seed);
    regenerate(dataset, noise, seed);
    reset();
  };

  const handleRestart = useCallback(() => {
    setNetSeed((s) => s + 1);
    reset();
  }, [reset]);

  const handlePaint = useCallback(
    (x: number, y: number) => {
      setPoints((prev) => [...prev, { x, y, label: paintClass }]);
    },
    [paintClass],
  );

  useKeyPress(" ", (event) => {
    // Space is also how a keyboard user presses a focused button — including
    // the ones further down the page. Only claim it when nothing else wants it.
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, [role='button']")) return;
    event.preventDefault();
    setRunning((value) => !value);
  });
  useKeyPress("r", handleRestart);

  const hint = lab.datasets[dataset].hint;
  const canvasLabel = lab.canvasLabel(points.length, Math.round(stats.accuracy * 100));

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <DecisionCanvas
            netRef={netRef}
            points={points}
            running={running}
            revision={generation + revision}
            onPaint={handlePaint}
            ariaLabel={canvasLabel}
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Legend />
            <div className="flex items-center gap-3">
              <Segmented
                label={p.draw}
                value={paintClass === 1 ? "a" : "b"}
                options={[
                  { value: "a", label: lab.classA },
                  { value: "b", label: lab.classB },
                ]}
                onChange={(value) => setPaintClass(value === "a" ? 1 : -1)}
              />
              <Button variant="ghost" size="sm" onClick={() => setPoints([])}>
                {p.clearPoints}
              </Button>
            </div>
          </div>
          <p className="text-body-sm text-fg-muted">
            Click or drag on the canvas to add your own points — the network has to deal with
            whatever you draw.
          </p>
        </div>

        <div className="space-y-4">
          <ControlPanel className="flex-col items-stretch">
            <Segmented
              label={p.data}
              value={dataset}
              options={datasetOptions}
              onChange={handleDataset}
            />
            <p className="-mt-1 text-caption text-fg-faint">{hint}</p>
            <LabSlider
              label={p.noise}
              value={noise}
              min={0}
              max={0.4}
              step={0.02}
              onChange={handleNoise}
              format={(v) => formatNumber(v, 2)}
            />
            <Button variant="secondary" size="sm" onClick={handleReshuffle}>
              {p.newSample}
            </Button>
          </ControlPanel>

          <ControlPanel className="flex-col items-stretch">
            <LabSlider
              label={p.hiddenLayers}
              value={layers}
              min={0}
              max={3}
              onChange={setLayers}
              format={(v) => (v === 0 ? "none" : String(v))}
            />
            <LabSlider
              label={p.neuronsPerLayer}
              value={neurons}
              min={1}
              max={8}
              onChange={setNeurons}
            />
            <Segmented
              label={p.activation}
              value={activation}
              options={activationOptions}
              onChange={setActivation}
            />
            <LabSlider
              label={p.learningRate}
              value={rateIndex}
              min={0}
              max={LEARNING_RATES.length - 1}
              onChange={setRateIndex}
              format={(i) => String(LEARNING_RATES[i] ?? 0.03)}
            />
            <LabSlider
              label={p.regularization}
              value={l2Index}
              min={0}
              max={L2_RATES.length - 1}
              onChange={setL2Index}
              format={(i) => (i === 0 ? "off" : String(L2_RATES[i]))}
            />
            <LabSlider label={p.speed} value={speed} min={1} max={10} onChange={setSpeed} />
          </ControlPanel>

          <ControlPanel className="items-center">
            <Button onClick={() => setRunning((value) => !value)} className="min-w-24">
              {running ? p.pause : p.train}
            </Button>
            <Button variant="secondary" onClick={() => step(20)} disabled={running}>
              Step 20
            </Button>
            <Button variant="secondary" onClick={handleRestart}>
              Restart
            </Button>
            <p className="w-full text-caption text-fg-faint">
              <Kbd>Space</Kbd> {lab.keyboardHint.trainPause} <Kbd>R</Kbd>{" "}
              {lab.keyboardHint.restart}
            </p>
          </ControlPanel>
        </div>
      </div>

      <TrainingStats stats={stats} history={history} />

      <div className="pt-6">
        <h3 className="text-title text-fg">{p.insideTitle}</h3>
        <p className="mt-2 max-w-prose text-body-sm text-fg-muted">
          {p.insideBody}
        </p>
        <div className="mt-5">
          <NetworkDiagram
            netRef={netRef}
            sizes={sizes}
            running={running}
            revision={generation + revision}
          />
        </div>
      </div>
    </div>
  );
}
