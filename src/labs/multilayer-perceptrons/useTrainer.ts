import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { useRafLoop } from "@/hooks";
import type { Point } from "./datasets";
import { createMlp, evaluate, trainEpoch, type Activation, type Mlp } from "./engine";

export interface TrainerConfig {
  /** Neurons in each hidden layer, e.g. [6, 4]. Input (2) and output (1) are implied. */
  hidden: readonly number[];
  activation: Activation;
  learningRate: number;
  l2: number;
  batchSize: number;
  seed: number;
  /** Epochs per animation frame — the speed control. */
  epochsPerFrame: number;
}

export interface TrainerStats {
  epoch: number;
  loss: number;
  accuracy: number;
  testLoss: number;
  testAccuracy: number;
}

const EMPTY_STATS: TrainerStats = { epoch: 0, loss: 0, accuracy: 0, testLoss: 0, testAccuracy: 0 };

/** Publish React state 10×/s — the simulation itself runs every frame. */
const PUBLISH_INTERVAL_SEC = 0.1;
const HISTORY_LENGTH = 180;

export interface Trainer {
  /** The live network. Read it from rAF callbacks; never render from it directly. */
  netRef: MutableRefObject<Mlp>;
  stats: TrainerStats;
  /** Recent training loss, oldest first — the sparkline's data. */
  history: number[];
  /** Bumps whenever the network is rebuilt, so views can re-initialize. */
  generation: number;
  /** Bumps after any manual change to the weights — cue for paused views. */
  revision: number;
  /** Throw the weights away and start over from the same seed. */
  reset: () => void;
  /** Train a fixed number of epochs while paused. */
  step: (epochs?: number) => void;
}

/**
 * Owns one network and trains it against `points` while `running`.
 *
 * The network lives in a ref and is mutated in place every frame; React state
 * is published a few times a second. Without that split, a 60fps trainer would
 * mean 60 re-renders a second of the whole page (docs/GUIDELINES.md → 60fps is
 * a feature).
 */
export function useTrainer(
  train: readonly Point[],
  test: readonly Point[],
  config: TrainerConfig,
  running: boolean,
): Trainer {
  const sizes = [2, ...config.hidden, 1];
  const shape = `${sizes.join("-")}:${config.activation}:${config.seed}`;

  const netRef = useRef<Mlp | null>(null);
  netRef.current ??= createMlp(sizes, config.activation, config.seed);

  const [generation, setGeneration] = useState(0);
  const [revision, setRevision] = useState(0);
  const [stats, setStats] = useState<TrainerStats>(EMPTY_STATS);
  const historyRef = useRef<number[]>([]);
  const [history, setHistory] = useState<number[]>([]);

  // Latest values for the rAF loop, which must not re-subscribe every render.
  const configRef = useRef(config);
  configRef.current = config;
  const trainRef = useRef(train);
  trainRef.current = train;
  const testRef = useRef(test);
  testRef.current = test;

  const rebuild = useCallback(() => {
    const next = configRef.current;
    netRef.current = createMlp([2, ...next.hidden, 1], next.activation, next.seed);
    historyRef.current = [];
    setHistory([]);
    setStats(EMPTY_STATS);
    setGeneration((g) => g + 1);
  }, []);

  // Any change to the architecture is a different network, not the same one
  // resized — so it starts over. Learning rate and L2 apply mid-flight.
  useEffect(rebuild, [shape, rebuild]);

  const sincePublishRef = useRef(0);

  useRafLoop(
    useCallback((dtSec: number) => {
      const net = netRef.current;
      if (!net) return;
      const { learningRate, batchSize, l2, epochsPerFrame } = configRef.current;
      const points = trainRef.current;

      for (let i = 0; i < epochsPerFrame; i++) {
        trainEpoch(net, points, learningRate, batchSize, l2);
      }

      sincePublishRef.current += dtSec;
      if (sincePublishRef.current < PUBLISH_INTERVAL_SEC) return;
      sincePublishRef.current = 0;

      const trainScore = evaluate(net, points);
      const testScore = evaluate(net, testRef.current);
      historyRef.current.push(trainScore.loss);
      if (historyRef.current.length > HISTORY_LENGTH) historyRef.current.shift();
      setHistory([...historyRef.current]);
      setStats({
        epoch: net.epoch,
        loss: trainScore.loss,
        accuracy: trainScore.accuracy,
        testLoss: testScore.loss,
        testAccuracy: testScore.accuracy,
      });
    }, []),
    running,
  );

  // While paused, still score the current weights so the panel isn't blank
  // after a reset or a dataset edit.
  useEffect(() => {
    if (running) return;
    const net = netRef.current;
    if (!net) return;
    const trainScore = evaluate(net, train);
    const testScore = evaluate(net, test);
    setStats({
      epoch: net.epoch,
      loss: trainScore.loss,
      accuracy: trainScore.accuracy,
      testLoss: testScore.loss,
      testAccuracy: testScore.accuracy,
    });
  }, [running, train, test, generation]);

  const step = useCallback((epochs = 10) => {
    const net = netRef.current;
    if (!net) return;
    const { learningRate, batchSize, l2 } = configRef.current;
    for (let i = 0; i < epochs; i++) {
      trainEpoch(net, trainRef.current, learningRate, batchSize, l2);
    }
    const trainScore = evaluate(net, trainRef.current);
    const testScore = evaluate(net, testRef.current);
    historyRef.current.push(trainScore.loss);
    if (historyRef.current.length > HISTORY_LENGTH) historyRef.current.shift();
    setHistory([...historyRef.current]);
    setStats({
      epoch: net.epoch,
      loss: trainScore.loss,
      accuracy: trainScore.accuracy,
      testLoss: testScore.loss,
      testAccuracy: testScore.accuracy,
    });
    setRevision((r) => r + 1);
  }, []);

  return {
    netRef: netRef as MutableRefObject<Mlp>,
    stats,
    history,
    generation,
    revision,
    reset: rebuild,
    step,
  };
}
