import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge, Button } from "@/components/ui";
import { ControlPanel, LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { useLocalStorage } from "@/hooks";
import { spring } from "@/design/motion";
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
  const reduced = useReducedMotion();
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
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <DecisionCanvas
        netRef={trainer.netRef}
        points={points}
        running={running}
        revision={trainer.generation + trainer.revision}
        ariaLabel={`Spiral challenge: ${total} hidden neurons, ${formatPercent(
          stats.testAccuracy,
          1,
        )} test accuracy after ${stats.epoch} epochs.`}
      />

      <div className="space-y-4">
        <div className="card-surface p-5">
          <p className="text-overline uppercase text-accent">{c.objective}</p>
          <p className="mt-2 text-body text-fg">
            Reach {formatPercent(TARGET, 0)} test accuracy on the spiral — using as few hidden
            neurons as you can.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge dotClassName={solved ? "bg-signal-green" : "bg-fg-faint"}>
              {solved ? lab.solvedBadge : lab.notYet}
            </Badge>
            <Badge>{total} neurons</Badge>
            <Badge>{formatPercent(stats.testAccuracy, 1)} test</Badge>
          </div>
        </div>

        <ControlPanel className="flex-col items-stretch">
          <LabSlider label={c.hiddenLayers} value={layers} min={1} max={3} onChange={setLayers} />
          <LabSlider
            label={c.neuronsPerLayer}
            value={neurons}
            min={1}
            max={8}
            onChange={setNeurons}
          />
          <LabSlider
            label={c.learningRate}
            value={rateIndex}
            min={0}
            max={LEARNING_RATES.length - 1}
            onChange={setRateIndex}
            format={(i) => String(LEARNING_RATES[i] ?? 0.1)}
          />
          <div className="grid w-full grid-cols-2 gap-2">
            <Button onClick={() => setRunning((value) => !value)}>
              {running ? c.pause : c.train}
            </Button>
            <Button variant="secondary" onClick={retry}>
              {c.newAttempt}
            </Button>
          </div>
        </ControlPanel>

        <motion.div
          key={best ? `${best.neurons}-${best.epoch}` : "none"}
          initial={reduced || !best ? false : { scale: 0.96, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={spring.bouncy}
          className="card-surface p-5"
        >
          <p className="text-overline uppercase text-fg-faint">{c.yourBest}</p>
          {best ? (
            <>
              <p className="mt-2 font-mono text-display-md text-fg">{best.neurons}</p>
              <p className="mt-1 text-body-sm text-fg-muted">
                hidden neurons, at {formatPercent(best.accuracy, 1)} after{" "}
                {best.epoch.toLocaleString("en-US")} epochs
              </p>
            </>
          ) : (
            <p className="mt-2 text-body-sm text-fg-muted">
              Nothing yet. Start with plenty of neurons, then take them away until it breaks.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
