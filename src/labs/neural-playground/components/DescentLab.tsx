import { useCallback, useRef, useState, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { ControlPanel, LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { useRafLoop } from "@/hooks";
import { formatNumber } from "@/lib/format";
import { clamp } from "@/lib/math";

/**
 * A deliberately bumpy loss curve: one shallow basin on the right, the real
 * one on the left. Backprop hands the network exactly one number per weight —
 * this slope — and gradient descent does nothing cleverer than step downhill.
 */
const loss = (w: number): number => 0.25 * w ** 4 - 0.5 * w * w + 0.25 * w + 0.55;
const slope = (w: number): number => w ** 3 - w + 0.25;

const W_MIN = -2;
const W_MAX = 2;
const LOSS_MAX = 2.6;
const VIEW_W = 100;
const VIEW_H = 58;
/** One step every 90ms: fast enough to feel live, slow enough to follow. */
const STEP_INTERVAL_SEC = 0.09;
const LEARNING_RATES = [0.005, 0.02, 0.05, 0.12, 0.3, 0.6, 1.05] as const;
const START_W = 1.55;

const toSvgX = (w: number): number => ((w - W_MIN) / (W_MAX - W_MIN)) * VIEW_W;
const toSvgY = (l: number): number =>
  VIEW_H - (clamp(l, 0, LOSS_MAX) / LOSS_MAX) * (VIEW_H - 4) - 2;
const toW = (svgX: number): number => W_MIN + (svgX / VIEW_W) * (W_MAX - W_MIN);

const CURVE = Array.from({ length: 161 }, (_, i) => {
  const w = W_MIN + ((W_MAX - W_MIN) * i) / 160;
  return `${toSvgX(w).toFixed(2)},${toSvgY(loss(w)).toFixed(2)}`;
}).join(" ");

/** Where the ball ends up if you let it run — used for the verdict line. */
const GLOBAL_MIN_W = -1.11;

export function DescentLab() {
  const t = useT();
  const lab = t.labs["neural-playground"];
  const d = lab.descent;
  const reduced = useReducedMotion();
  const [rateIndex, setRateIndex] = useState(3);
  const [w, setW] = useState(START_W);
  const [steps, setSteps] = useState(0);
  const [running, setRunning] = useState(false);
  const accumulatorRef = useRef(0);
  const rateRef = useRef(rateIndex);
  rateRef.current = rateIndex;

  const learningRate = LEARNING_RATES[rateIndex] ?? 0.12;

  const takeStep = useCallback(() => {
    const rate = LEARNING_RATES[rateRef.current] ?? 0.12;
    setW((current) => clamp(current - rate * slope(current), -2.4, 2.4));
    setSteps((n) => n + 1);
  }, []);

  useRafLoop(
    useCallback(
      (dtSec: number) => {
        accumulatorRef.current += dtSec;
        while (accumulatorRef.current >= STEP_INTERVAL_SEC) {
          accumulatorRef.current -= STEP_INTERVAL_SEC;
          takeStep();
        }
      },
      [takeStep],
    ),
    running,
  );

  const restart = () => {
    setRunning(false);
    setW(START_W);
    setSteps(0);
    accumulatorRef.current = 0;
  };

  const placeBall = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = toW(((event.clientX - rect.left) / rect.width) * VIEW_W);
    setRunning(false);
    setW(clamp(next, W_MIN, W_MAX));
    setSteps(0);
  };

  const gradient = slope(w);
  const escaped = Math.abs(w) > 2.05;
  const settled = !escaped && Math.abs(gradient) < 0.02;
  // Which basin it came to rest in: the deep one on the left, or the shallow
  // one on the right that gradient descent has no way of seeing past.
  const deepest = Math.abs(w - GLOBAL_MIN_W) < 0.5;
  const verdict = escaped
    ? lab.descentNote.overshoot
    : settled
      ? deepest
        ? lab.descentNote.deep
        : lab.descentNote.shallow
      : lab.descentNote.rolling;

  // Tangent segment, drawn in curve space so its visual slope is the real one.
  const tangentSpan = 0.32;
  const tangent = `${toSvgX(w - tangentSpan)},${toSvgY(loss(w) - gradient * tangentSpan)} ${toSvgX(
    w + tangentSpan,
  )},${toSvgY(loss(w) + gradient * tangentSpan)}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-4">
        <div className="card-surface p-4 sm:p-6">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full cursor-pointer touch-none"
            role="img"
            aria-label={d.curveLabel(formatNumber(w, 2), formatNumber(loss(w), 2), formatNumber(gradient, 2))}
            onPointerDown={placeBall}
          >
            <line
              x1={0}
              y1={toSvgY(0)}
              x2={VIEW_W}
              y2={toSvgY(0)}
              className="stroke-line/10"
              strokeWidth={0.4}
            />
            <polyline
              points={CURVE}
              fill="none"
              className="stroke-fg-faint"
              strokeWidth={0.8}
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={tangent}
              fill="none"
              className="stroke-signal-amber"
              strokeWidth={1.2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={toSvgX(clamp(w, -2.4, 2.4))}
              cy={toSvgY(loss(clamp(w, -2.4, 2.4)))}
              r={2.2}
              className="fill-accent"
            />
          </svg>
          <p className="mt-3 text-center text-caption text-fg-faint">
            Click anywhere on the curve to drop the weight somewhere else.
          </p>
        </div>
        <p className="text-body-sm text-fg-muted" aria-live="polite">
          {verdict}
        </p>
      </div>

      <div className="space-y-4">
        <ControlPanel className="flex-col items-stretch">
          <LabSlider
            label={d.learningRate}
            value={rateIndex}
            min={0}
            max={LEARNING_RATES.length - 1}
            onChange={setRateIndex}
            format={(i) => String(LEARNING_RATES[i] ?? 0.12)}
          />
          <div className="grid w-full grid-cols-2 gap-2">
            <Button onClick={() => setRunning((value) => !value)}>
              {running ? t.common.pause : d.roll}
            </Button>
            <Button variant="secondary" onClick={takeStep} disabled={running}>
              One step
            </Button>
            <Button variant="ghost" onClick={restart} className="col-span-2">
              {t.common.reset}
            </Button>
          </div>
        </ControlPanel>

        <div className="card-surface space-y-3 p-5 font-mono text-body-sm">
          <div className="flex justify-between gap-4">
            <span className="text-fg-faint">{d.weight}</span>
            <span className="tabular-nums text-fg">{formatNumber(w, 3)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-fg-faint">{d.loss}</span>
            <span className="tabular-nums text-fg">{formatNumber(loss(w), 3)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-fg-faint">{d.slope}</span>
            <span className="tabular-nums text-signal-amber">{formatNumber(gradient, 3)}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-line/10 pt-3">
            <span className="text-fg-faint">{d.nextStep}</span>
            <span className="tabular-nums text-accent">
              {formatNumber(-learningRate * gradient, 3)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-fg-faint">{d.steps}</span>
            <span className="tabular-nums text-fg-muted">{steps}</span>
          </div>
        </div>

        {reduced && (
          <p className="text-caption text-fg-faint">
            Prefer it still? “One step” advances the ball a single move at a time.
          </p>
        )}
      </div>
    </div>
  );
}
