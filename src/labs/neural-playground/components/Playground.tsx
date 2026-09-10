import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button, Kbd, Segmented } from "@/components/ui";
import { LabSlider, Stage, Transport } from "@/components/lab";
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
import { TrainingFigures } from "./TrainingStats";

/** Log-spaced, because the interesting range of a learning rate is multiplicative. */
const LEARNING_RATES = [0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1] as const;
const L2_RATES = [0, 0.001, 0.003, 0.01, 0.03] as const;
const POINT_COUNT = 200;
const DEFAULT_DATASET: DatasetKind = "circle";

const activationOptions = ACTIVATIONS.map((a) => ({ value: a.kind, label: a.label }));

function Legend() {
  const lab = useT().labs["neural-playground"];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-fg-muted">
      {/* Shape as well as hue: a disc, a square and a ring. */}
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-pill bg-accent-fill" />
        {lab.classA}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-[2px] bg-signal-cyan" />
        {lab.classB}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-pill ring-1 ring-signal-amber" />
        {lab.playground.currentlyWrong}
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
/**
 * Whether the two pictures fit side by side.
 *
 * The diagram sits beside the decision surface from `xl` up. Below that they
 * stack, and the diagram then sits between the canvas and the Train button —
 * which put that button 1,206px down the page on a phone, so a visitor
 * scrolled past the entire network to reach the control that starts it.
 *
 * Reading the breakpoint in JS rather than duplicating the diagram behind two
 * CSS visibility rules keeps it to a single mount, which matters here: it
 * repaints on every training frame.
 */
function useSideBySide() {
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return wide;
}

export function Playground() {
  const t = useT();
  const lab = t.labs["neural-playground"];
  const p = lab.playground;
  const sideBySide = useSideBySide();
  const datasetOptions = DATASETS.map((d) => ({
    value: d.kind,
    label: lab.datasets[d.kind].label,
  }));
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
    <Stage
      width="full"
      secondaryLabel={p.dataAndArchitecture}
      caption={p.caption}
      announcement=""
      viewport={
        /* The network's two pictures, side by side: what it predicts across
           the whole square, and what it is made of. The diagram used to sit at
           the very bottom of the section, under the scoreboard and a heading —
           the thing the lab is named after, last. */
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-2">
            <DecisionCanvas
              netRef={netRef}
              points={points}
              running={running}
              revision={generation + revision}
              onPaint={handlePaint}
              ariaLabel={canvasLabel}
            />
            <Legend />
          </div>
          {/* Side by side when there is room; folded away when there is not,
              so the Train button follows the canvas instead of the network. */}
          <div className="min-w-0">
            {sideBySide ? (
              <NetworkDiagram
                netRef={netRef}
                sizes={sizes}
                running={running}
                revision={generation + revision}
              />
            ) : (
              <details className="group rounded border border-line/10">
                <summary
                  className="flex min-h-11 cursor-pointer select-none items-center justify-between
                    gap-2 px-3 text-body-sm text-fg-muted transition-colors duration-fast
                    hover:text-fg focus-visible:text-fg"
                >
                  {p.insideTitle}
                  <span aria-hidden className="text-fg-faint group-open:hidden">
                    +
                  </span>
                  <span aria-hidden className="hidden text-fg-faint group-open:inline">
                    −
                  </span>
                </summary>
                <div className="border-t border-line/10 p-3">
                  <NetworkDiagram
                    netRef={netRef}
                    sizes={sizes}
                    running={running}
                    revision={generation + revision}
                  />
                </div>
              </details>
            )}
          </div>
        </div>
      }
      readout={
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
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
            <Button variant="ghost" onClick={() => setPoints([])} className="min-h-[44px]">
              {p.clearPoints}
            </Button>
          </div>
          <p className="text-caption text-fg-faint">{p.drawHint}</p>
        </div>
      }
      primary={
        <Transport
          running={running}
          onRun={() => setRunning((value) => !value)}
          onStep={() => step(20)}
          onReset={handleRestart}
          runLabel={p.train}
          stepDisabled={running}
        />
      }
      figures={<TrainingFigures stats={stats} history={history} />}
      secondary={
        <>
          <Segmented
            label={p.data}
            value={dataset}
            options={datasetOptions}
            onChange={handleDataset}
          />
          <p className="text-caption text-fg-faint">{hint}</p>
          <LabSlider
            label={p.noise}
            value={noise}
            min={0}
            max={0.4}
            step={0.02}
            onChange={handleNoise}
            format={(v) => formatNumber(v, 2)}
          />
          <Button variant="secondary" onClick={handleReshuffle} className="min-h-[44px] w-full">
            {p.newSample}
          </Button>

          <LabSlider
            label={p.hiddenLayers}
            value={layers}
            min={0}
            max={3}
            onChange={setLayers}
            format={(v) => (v === 0 ? p.noneLabel : String(v))}
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
            format={(i) => (i === 0 ? p.offLabel : String(L2_RATES[i]))}
          />
          <LabSlider label={p.speed} value={speed} min={1} max={10} onChange={setSpeed} />

          <p className="text-caption text-fg-faint">
            <Kbd>Space</Kbd> {lab.keyboardHint.trainPause} <Kbd>R</Kbd> {lab.keyboardHint.restart}
          </p>
        </>
      }
    />
  );
}
