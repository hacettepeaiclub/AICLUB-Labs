import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui";
import { Figure, LabSlider, Stage, Transport } from "@/components/lab";
import { useT } from "@/i18n";
import { useLocalStorage } from "@/hooks";
import { formatPercent } from "@/lib/format";
import { generateDataset, splitDataset } from "../datasets";
import { useTrainer } from "../useTrainer";
import { DecisionCanvas } from "./DecisionCanvas";

/** Test accuracy that counts as "solved". */
const TARGET = 0.9;
/** Ignore the opening epochs: a lucky initialization is not a solution. */
const MIN_EPOCHS = 150;
const LEARNING_RATES = [0.01, 0.03, 0.1, 0.3] as const;

interface Attempt {
  neurons: number;
  accuracy: number;
  epoch: number;
}

/** Fewer neurons wins; ties go to whoever got there in fewer epochs. */
const beats = (candidate: Attempt, best: Attempt | null): boolean =>
  !best ||
  candidate.neurons < best.neurons ||
  (candidate.neurons === best.neurons && candidate.epoch < best.epoch);

/**
 * The closing challenge. The spiral is genuinely hard, and the interesting
 * question is not "can a network do it" but "how little network does it take"
 * — which is where architecture stops being a slider and starts being a
 * decision.
 */
export function SpiralChallenge() {
  const lab = useT().labs["neural-playground"];
  const c = lab.challenge;
  const [layers, setLayers] = useState(2);
  const [neurons, setNeurons] = useState(6);
  const [rateIndex, setRateIndex] = useState(2);
  const [running, setRunning] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [best, setBest] = useLocalStorage<Attempt | null>(
    "acl:neural-playground:best-spiral",
    null,
  );

  const points = useMemo(() => generateDataset("spiral", 220, 0.06, 21), []);
  const { train, test } = useMemo(() => splitDataset(points, 0.75, 13), [points]);

  const hidden = useMemo(() => Array.from({ length: layers }, () => neurons), [layers, neurons]);
  const total = layers * neurons;

  const trainer = useTrainer(
    train,
    test,
    {
      hidden,
      activation: "tanh",
      learningRate: LEARNING_RATES[rateIndex] ?? 0.1,
      l2: 0,
      batchSize: 10,
      seed: 31 + attempt,
      epochsPerFrame: 6,
    },
    running,
  );
  const { stats } = trainer;

  const solved = stats.testAccuracy >= TARGET && stats.epoch >= MIN_EPOCHS;
  // One record per attempt: without this the effect would re-fire every frame
  // for as long as the run stays above the target.
  const recordedRef = useRef(false);
  useEffect(() => {
    recordedRef.current = false;
  }, [attempt, total, rateIndex]);

  useEffect(() => {
    if (!solved || recordedRef.current) return;
    recordedRef.current = true;
    const run: Attempt = { neurons: total, accuracy: stats.testAccuracy, epoch: stats.epoch };
    setBest((previous) => (beats(run, previous) ? run : previous));
  }, [solved, total, stats.testAccuracy, stats.epoch, setBest]);

  const retry = () => {
    setRunning(false);
    setAttempt((n) => n + 1);
  };

  return (
    <Stage
      width="wide"
      secondaryLabel={c.architecture}
      caption={solved ? c.solvedNote : c.objectiveLine(formatPercent(TARGET, 0))}
      announcement={solved ? c.announceSolved(total, formatPercent(stats.testAccuracy, 1)) : ""}
      viewport={
        <DecisionCanvas
          netRef={trainer.netRef}
          points={points}
          running={running}
          revision={trainer.generation + trainer.revision}
          ariaLabel={c.canvasLabel(total, formatPercent(stats.testAccuracy, 1), stats.epoch)}
          /* Nothing is drawn on this one by hand, so it does not need the
             full column: at 558px square it left the rail beside it empty. */
          className="mx-auto max-w-md"
        />
      }
      readout={
        <div className="flex flex-wrap items-center gap-2">
          {/* A word as well as a colour: "Solved" / "Not yet". */}
          <Badge dotClassName={solved ? "bg-signal-green" : "bg-fg-faint"}>
            {solved ? lab.solvedBadge : lab.notYet}
          </Badge>
          <p className="text-caption text-fg-faint">
            {best ? c.bestLine(best.neurons, formatPercent(best.accuracy, 1), best.epoch) : c.noBest}
          </p>
        </div>
      }
      primary={
        <Transport
          running={running}
          onRun={() => setRunning((value) => !value)}
          onStep={() => trainer.step(20)}
          onReset={retry}
          runLabel={c.train}
          stepDisabled={running}
        />
      }
      figures={
        <>
          <Figure label={c.neuronsUsed} value={String(total)} tone={solved ? "accent" : "default"} />
          <Figure label={c.testAccuracy} value={formatPercent(stats.testAccuracy, 1)} />
          <Figure label={c.target} value={formatPercent(TARGET, 0)} tone="muted" />
          <Figure label={c.yourBest} value={best ? String(best.neurons) : "—"} />
        </>
      }
      secondary={
        <>
          <LabSlider label={c.hiddenLayers} value={layers} min={1} max={3} onChange={setLayers} />
          <LabSlider label={c.neuronsPerLayer} value={neurons} min={1} max={8} onChange={setNeurons} />
          <LabSlider
            label={c.learningRate}
            value={rateIndex}
            min={0}
            max={LEARNING_RATES.length - 1}
            onChange={setRateIndex}
            format={(i) => String(LEARNING_RATES[i] ?? 0.1)}
          />
        </>
      }
    />
  );
}
