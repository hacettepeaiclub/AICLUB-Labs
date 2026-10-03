import { useMemo, useRef, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useRafLoop, useReducedMotion } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { createRng } from "@/lib/random";
import {
  asKernel,
  centred,
  correlate,
  descend,
  extent,
  loss,
  prepareFit,
  type Grid,
} from "../engine";
import { BOX_BLUR, LAPLACIAN, SOBEL_X, texturedScene } from "../pictures";
import { formatLoss, formatValue } from "../view";
import { GridView } from "./GridView";
import { Panel } from "./Panel";

type Target = "vertical" | "blur" | "outline";
const TARGETS: Record<Target, Grid> = { vertical: SOBEL_X, blur: BOX_BLUR, outline: LAPLACIAN };
const ORDER: readonly Target[] = ["vertical", "blur", "outline"];

const PICTURE = texturedScene(24);
const CENTRED = centred(PICTURE);

/** Below this the weights agree with the hidden kernel to every digit shown. */
const DONE = 1e-10;
const STEPS_PER_FRAME = 5;
const MAX_STEPS = 3000;

const start = (seed: number): Float64Array => {
  const rng = createRng(seed);
  return Float64Array.from({ length: 9 }, () => rng() * 2 - 1);
};

/**
 * Section 6: the kernel is not designed, it is found.
 *
 * A hidden kernel has already been applied to the picture; the visitor sees
 * only its output. Nine random weights then move downhill on the squared
 * error between their output and that one, and the visitor watches them
 * turn into the hidden kernel — a Sobel edge detector, a blur, an outline —
 * which is revealed only once the fit has found it.
 *
 * The step is 1/λ_max of the loss's Hessian, the largest that is safe in
 * every direction, so the loss falls on every single step; `engine.test.ts`
 * holds it to that. The picture's mean is taken out before fitting, which
 * is what lets a few hundred steps suffice (see `centred`).
 */
export function LearnStage() {
  const t = useLabs().convolution.learn;
  const reduced = useReducedMotion() ?? false;
  const [target, setTarget] = useState<Target>("vertical");
  const [seed, setSeed] = useState(1);
  const [weights, setWeights] = useState(() => start(1));
  const [steps, setSteps] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const hidden = TARGETS[target];
  const fit = useMemo(() => prepareFit(CENTRED, correlate(CENTRED, hidden), 3), [hidden]);
  const goal = useMemo(() => correlate(CENTRED, hidden), [hidden]);
  const current = useMemo(() => correlate(CENTRED, asKernel(weights, 3)), [weights]);
  const now = loss(fit, weights);
  const done = now < DONE;
  const show = revealed || done;

  const range = extent(goal);
  const scale = Math.max(Math.abs(range.min), Math.abs(range.max));
  const kernelRange = extent(hidden);
  const kernelScale = Math.max(Math.abs(kernelRange.min), Math.abs(kernelRange.max));

  const state = useRef({ weights, steps });
  state.current = { weights, steps };

  useRafLoop(() => {
    let w = state.current.weights;
    const losses: number[] = [];
    // Reduced motion gets the same descent in bigger jumps per frame, so
    // the numbers settle rather than visibly crawl.
    const batch = reduced ? STEPS_PER_FRAME * 10 : STEPS_PER_FRAME;
    let n = state.current.steps;
    for (let k = 0; k < batch && n < MAX_STEPS; k++) {
      w = descend(fit, w);
      n++;
      losses.push(loss(fit, w));
    }
    // Kept here too, so a frame that arrives before React has rendered the
    // last one continues from it rather than repeating it.
    state.current = { weights: w, steps: n };
    setWeights(w);
    setSteps(n);
    setHistory((h) => [...h, ...losses]);
    if ((losses.at(-1) ?? Infinity) < DONE || n >= MAX_STEPS) setRunning(false);
  }, running);

  const restart = (nextTarget = target, nextSeed = seed + 1) => {
    setTarget(nextTarget);
    setSeed(nextSeed);
    setWeights(start(nextSeed));
    setSteps(0);
    setHistory([]);
    setRunning(false);
    setRevealed(false);
  };

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={done ? t.announceDone(steps) : ""}
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <Panel label={t.input}>
              <GridView grid={PICTURE} kind="image" ariaLabel={t.inputLabel} />
            </Panel>
            <Panel label={t.goal}>
              <GridView grid={goal} kind="signed" scale={scale} ariaLabel={t.goalLabel} />
            </Panel>
            <Panel label={t.current}>
              <GridView
                grid={current}
                kind="signed"
                scale={scale}
                ariaLabel={t.currentLabel(formatLoss(now))}
              />
            </Panel>
          </div>

          <div className="grid grid-cols-2 items-start gap-3 border-t border-line/10 pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)] sm:gap-4">
            <Panel label={t.weightsLabel}>
              <GridView
                grid={asKernel(weights, 3)}
                kind="signed"
                scale={kernelScale}
                showValues
                ariaLabel={t.weightsAria([...weights].map((w) => formatValue(w)).join(", "))}
              />
            </Panel>
            <Panel label={t.hiddenLabel}>
              <GridView
                grid={hidden}
                kind="signed"
                scale={kernelScale}
                showValues
                hidden={() => !show}
                ariaLabel={
                  show
                    ? t.hiddenAria([...hidden.data].map((w) => formatValue(w)).join(", "))
                    : t.hiddenSecret
                }
              />
            </Panel>
            <div className="col-span-2 sm:col-span-1">
              <Panel label={t.curve}>
                <LossCurve history={history} label={t.curveLabel} />
              </Panel>
            </div>
          </div>
          <p className={done ? "text-body-sm text-signal-green" : "text-body-sm text-fg-muted"}>
            {done ? t.found(steps) : steps === 0 ? t.ready : t.searching}
          </p>
        </div>
      }
      primary={
        <div className="flex gap-2">
          <Button
            onClick={() => setRunning((r) => !r)}
            disabled={done || steps >= MAX_STEPS}
            className="min-h-[44px] flex-1"
          >
            {running ? t.pause : steps === 0 ? t.train : t.resume}
          </Button>
          <Button variant="secondary" onClick={() => restart()} className="min-h-[44px]">
            {t.again}
          </Button>
        </div>
      }
      secondary={
        <>
          <Segmented
            label={t.targetLabel}
            value={target}
            options={ORDER.map((id) => ({ value: id, label: t.targets[id] }))}
            onChange={(id) => restart(id)}
          />
          <Button
            variant="ghost"
            onClick={() => setRevealed(true)}
            disabled={show}
            className="min-h-[44px] w-full"
          >
            {t.reveal}
          </Button>
        </>
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure label={t.figures.steps} value={String(steps)} />
          <Figure label={t.figures.loss} value={formatLoss(now)} tone="accent" />
        </>
      }
    />
  );
}

/** Loss against step, on a log scale: a straight fall is steady progress. */
function LossCurve({ history, label }: { history: readonly number[]; label: string }) {
  const W = 100;
  const H = 40;
  if (history.length < 2) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full">
        <line
          x1={0}
          y1={H - 0.5}
          x2={W}
          y2={H - 0.5}
          className="stroke-line/20"
          strokeWidth={0.5}
        />
      </svg>
    );
  }
  const logs = history.map((v) => Math.log10(Math.max(v, 1e-14)));
  const hi = Math.max(...logs);
  const lo = Math.min(Math.min(...logs), hi - 1);
  const points = logs
    .map(
      (v, i) =>
        `${((i / (logs.length - 1)) * W).toFixed(2)},${(((hi - v) / (hi - lo)) * (H - 2) + 1).toFixed(2)}`,
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full">
      <line x1={0} y1={H - 0.5} x2={W} y2={H - 0.5} className="stroke-line/20" strokeWidth={0.5} />
      <polyline
        points={points}
        className="fill-none stroke-accent"
        strokeWidth={1.2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
