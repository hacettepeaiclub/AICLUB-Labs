import { useId, useRef, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { labColor } from "@/design/tokens";
import { usePaletteVersion } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import { TEXTURES, type TrainOptions } from "../engine";
import { useJepaActivity } from "../useJepaActivity";
import { MAX_STEPS, useJepaTrainer } from "../useJepaTrainer";
import { KindLegend, MapView } from "./MapView";
import { PictureView } from "./PictureView";
import { PredictionFlow } from "./PredictionFlow";

export interface TrainStageProps {
  mode: "train" | "collapse";
}
export function TrainStage({ mode }: TrainStageProps) {
  const t = useLabCopy("jepa");
  const copy = t.train;
  const ui = t.interaction;
  const root = useRef<HTMLDivElement>(null);
  const active = useJepaActivity(root);
  const id = useId();
  const [seed, setSeed] = useState(1);
  const [options, setOptions] = useState<TrainOptions>({
    slowCopy: mode === "train",
    stopGradient: mode === "train",
  });
  const trainer = useJepaTrainer(seed, options, active);
  const {
    snapshot: s,
    before,
    running,
    setRunning,
    restart,
    advance,
    moveBlock,
    nextPicture,
  } = trainer;
  const [showBefore, setShowBefore] = useState(false);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const v = showBefore ? before : s;
  const done = s.steps >= MAX_STEPS;
  const method = options.slowCopy ? "ema" : options.stopGradient ? "detached" : "joint";
  const kinds = TEXTURES.map((texture) => ({ texture, name: t.kinds[texture] }));
  const chooseMethod = (value: string) => {
    setShowBefore(false);
    setOptions({ slowCopy: value === "ema", stopGradient: value !== "joint" });
  };
  const announcement =
    mode === "collapse"
      ? s.steps > 0 && s.spread < 0.03
        ? t.collapse.announceCollapsed
        : ""
      : done
        ? copy.announceDone(Math.round(s.scores.all.accuracy * 100))
        : "";
  return (
    <div ref={root} data-jepa-trainer={mode} className="space-y-5">
      {mode === "train" && (
        <fieldset className="mx-auto max-w-[56rem] rounded-lg border border-line/20 p-4">
          <legend className="px-2 text-body-sm font-medium text-fg">{ui.question}</legend>
          <div className="flex flex-wrap gap-3">
            {[true, false].map((value) => (
              <label
                key={String(value)}
                className="flex min-h-11 items-center gap-2 text-body-sm text-fg-muted"
              >
                <input
                  type="radio"
                  name={`${id}-prediction`}
                  checked={prediction === value}
                  onChange={() => setPrediction(value)}
                />
                {value ? ui.yes : ui.no}
              </label>
            ))}
          </div>
          {prediction !== null && (
            <p role="status" className="mt-2 text-body-sm text-accent">
              {prediction ? ui.feedbackYes : ui.feedbackNo}
            </p>
          )}
        </fieldset>
      )}
      <Stage
        width="wide"
        caption={mode === "train" ? copy.caption : t.collapse.caption}
        announcement={announcement}
        viewport={
          <div className="space-y-3 rounded-lg border border-line/20 bg-ink-900 p-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label={ui.preview}>
              <button
                type="button"
                aria-pressed={showBefore}
                onClick={() => setShowBefore(true)}
                className={`min-h-11 rounded border px-3 text-caption ${showBefore ? "border-accent text-accent" : "border-line/20 text-fg-muted"}`}
              >
                {ui.before}
              </button>
              <button
                type="button"
                aria-pressed={!showBefore}
                onClick={() => setShowBefore(false)}
                className={`min-h-11 rounded border px-3 text-caption ${!showBefore ? "border-accent text-accent" : "border-line/20 text-fg-muted"}`}
              >
                {ui.after}
              </button>
            </div>
            <div className="grid grid-cols-2 items-start gap-3">
              <PictureView
                picture={v.sample.picture}
                hidden={v.sample.hidden}
                selected={v.sample.hidden[0]}
                onPick={moveBlock}
                dragSelect
                patchLabel={t.picture.patchLabel}
                label={copy.pictureLabel}
              />
              <MapView points={v.points} guesses={v.guesses} label={copy.mapLabel} />
            </div>
            <KindLegend kinds={kinds} />
            <p className="text-caption text-fg-muted">
              ◯ {copy.legendGuess} · ● {copy.legendGoal}
            </p>
            <LossChart history={v.history} label={copy.lossLabel} />
          </div>
        }
        primary={
          <div className="space-y-3">
            <label className="block space-y-1 text-body-sm text-fg">
              {t.simulation.scrub}
              <input
                data-jepa-seek
                type="range"
                min="0"
                max={MAX_STEPS}
                step="10"
                value={trainer.goal}
                onChange={(e) => {
                  setShowBefore(false);
                  trainer.seek(Number(e.target.value));
                }}
                className="min-h-11 w-full accent-accent"
              />
              <span className="block text-caption text-fg-muted">
                {t.simulation.goal}: <span className="font-mono text-accent">{trainer.goal}</span> ·{" "}
                {copy.steps}: {s.steps}
              </span>
            </label>
            {running && <p className="text-caption text-fg-muted">{t.simulation.remaining}</p>}
            {mode === "collapse" && (
              <label className="block space-y-2 text-body-sm text-fg">
                <span>{ui.method}</span>
                <select
                  data-jepa-method
                  value={method}
                  onChange={(e) => chooseMethod(e.target.value)}
                  className="min-h-11 w-full rounded border border-line/30 bg-ink-900 p-2"
                >
                  <option value="joint">{ui.joint}</option>
                  <option value="detached">{ui.detached}</option>
                  <option value="ema">{ui.ema}</option>
                </select>
              </label>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={done}
                onClick={() => {
                  setShowBefore(false);
                  setRunning(!running);
                }}
              >
                {running ? copy.pause : copy.play}
              </Button>
              <Button
                variant="secondary"
                disabled={done}
                onClick={() => {
                  setShowBefore(false);
                  advance();
                }}
              >
                {ui.step}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowBefore(false);
                  restart();
                }}
              >
                {copy.restart}
              </Button>
            </div>
            <p className="text-caption text-fg-muted">{ui.pauseHint}</p>
            <Button variant="ghost" onClick={nextPicture}>
              {ui.nextPicture}
            </Button>
          </div>
        }
        figures={
          <>
            <Figure label={copy.steps} value={String(v.steps)} />
            <Figure label={copy.loss} value={v.loss === null ? "—" : t.decimal(v.loss, 3)} />
            <Figure label={t.collapse.spread} value={t.decimal(v.spread, 3)} tone="accent" />
            <div className="w-full min-w-0 border-t border-line/15 pt-3" data-jepa-scores>
              <table className="w-full text-left text-caption text-fg-muted">
                <caption className="mb-2 text-left text-overline uppercase">{ui.counts}</caption>
                <tbody>
                  {(["all", "interior", "boundary"] as const).map((key) => (
                    <tr key={key}>
                      <th scope="row" className="py-2 pr-2 font-normal">
                        {ui[key]}
                      </th>
                      <td className="whitespace-nowrap py-2 font-mono text-fg">
                        {v.scores[key].right}/{v.scores[key].total}
                      </td>
                      <td className="py-2 pl-2 text-right font-mono text-accent">
                        {v.scores[key].total
                          ? t.percent(Math.round(v.scores[key].accuracy * 100))
                          : ui.noScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <details className="mt-2 text-caption text-fg-muted">
                <summary className="cursor-pointer py-2">
                  {ui.all} · {ui.boundary}
                </summary>
                <p>{ui.scoreHint}</p>
                <p className="mt-2">
                  {ui.unavailable} ({v.scores.unavailable})
                </p>
              </details>
            </div>
          </>
        }
        secondaryLabel={mode === "train" ? copy.startLabel : ui.advanced}
        secondaryCollapsible
        secondary={
          mode === "train" ? (
            <div className="space-y-3">
              <p className="text-body-sm text-fg-muted">{copy.newStartHint}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowBefore(false);
                  setSeed(seed + 1);
                }}
              >
                {copy.newStart}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 text-body-sm text-fg-muted">
              <label className="flex min-h-11 items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.slowCopy}
                  onChange={(e) => {
                    setShowBefore(false);
                    setOptions({
                      ...options,
                      slowCopy: e.target.checked,
                      stopGradient: e.target.checked || options.stopGradient,
                    });
                  }}
                />
                {t.collapse.slowCopy}
              </label>
              <label className="flex min-h-11 items-center gap-2">
                <input
                  type="checkbox"
                  disabled={options.slowCopy}
                  checked={!!options.stopGradient}
                  onChange={(e) => {
                    setShowBefore(false);
                    setOptions({ ...options, stopGradient: e.target.checked });
                  }}
                />
                {ui.stop}
              </label>
              <p>{t.collapse.slowCopyHint}</p>
              <p>{ui.resetHint}</p>
            </div>
          )
        }
      />
      <div className="mx-auto max-w-[56rem] space-y-3">
        <p className="text-caption text-fg-muted">
          {ui.previewHint} {ui.projection}
        </p>
        {mode === "train" ? (
          <PredictionFlow snapshot={v} options={options} />
        ) : (
          <p className="rounded border border-line/20 p-3 text-body-sm text-fg-muted">
            {options.slowCopy
              ? t.flow.copied
              : options.stopGradient
                ? t.flow.detached
                : t.flow.joint}
          </p>
        )}
      </div>
    </div>
  );
}
/** The smoothed loss so far, as one line. */
function LossChart({ history, label }: { history: readonly number[]; label: string }) {
  usePaletteVersion();
  const W = 200;
  const H = 40;
  const top = Math.max(1e-6, ...history);
  const points = history
    .map((v, i) => `${(i / Math.max(1, MAX_STEPS / 10 - 1)) * W},${H - (v / top) * (H - 2) - 1}`)
    .join(" ");
  return (
    <figure>
      <figcaption className="text-overline uppercase text-fg-muted">{label}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="mt-2 w-full">
        <line
          x1="0"
          y1={H - 0.5}
          x2={W}
          y2={H - 0.5}
          stroke={labColor("fgFaint", 0.4)}
          strokeWidth="0.5"
        />
        {history.length > 1 && (
          <polyline points={points} fill="none" stroke={labColor("data")} strokeWidth="1.2" />
        )}
      </svg>
    </figure>
  );
}
