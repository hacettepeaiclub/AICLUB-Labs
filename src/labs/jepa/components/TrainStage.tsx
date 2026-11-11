import { useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { labColor } from "@/design/tokens";
import { usePaletteVersion } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import { TEXTURES } from "../engine";
import { MAX_STEPS, useJepaTrainer } from "../useJepaTrainer";
import { KindLegend, MapView } from "./MapView";
import { PictureView } from "./PictureView";

/** Below this every vector sits on one spot: the map has collapsed. */
const COLLAPSED = 0.03;

export interface TrainStageProps {
  /** `train`: the slow copy on, as in I-JEPA. `collapse`: off, to watch what happens. */
  mode: "train" | "collapse";
}

/**
 * Sections 2 and 3: the same JEPA, trained live — once as I-JEPA trains it,
 * once with the slow copy switched off, so the two can be told apart by
 * what happens to the map rather than by what the loss says.
 */
export function TrainStage({ mode }: TrainStageProps) {
  const t = useLabCopy("jepa");
  const copy = t.train;
  const [seed, setSeed] = useState(1);
  const [slowCopy, setSlowCopy] = useState(mode === "train");
  const { snapshot: s, running, setRunning, restart } = useJepaTrainer(seed, slowCopy);
  const done = s.steps >= MAX_STEPS;
  const collapsed = s.steps > 0 && s.spread < COLLAPSED;
  const kinds = TEXTURES.map((texture) => ({ texture, name: t.kinds[texture] }));

  const announcement =
    mode === "collapse"
      ? collapsed
        ? t.collapse.announceCollapsed
        : ""
      : done
        ? copy.announceDone(Math.round(s.accuracy * 100))
        : "";

  return (
    <Stage
      width="wide"
      caption={mode === "train" ? copy.caption : t.collapse.caption}
      announcement={announcement}
      viewport={
        <div className="space-y-4 rounded-lg border border-line/20 bg-ink-900 p-4">
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4">
            <PictureView
              picture={s.sample.picture}
              hidden={s.sample.hidden}
              label={copy.pictureLabel}
            />
            <MapView points={s.points} guesses={s.guesses} label={copy.mapLabel} />
          </div>
          <KindLegend kinds={kinds} />
          <p className="text-caption text-fg-muted">
            ◯ {copy.legendGuess} · ● {copy.legendGoal}
          </p>
          <LossChart history={s.history} label={copy.lossLabel} />
        </div>
      }
      primary={
        <div className="space-y-4">
          {mode === "collapse" && (
            <div>
              <label className="flex min-h-11 items-center gap-3 text-body-sm text-fg">
                <input
                  type="checkbox"
                  checked={slowCopy}
                  onChange={(event) => setSlowCopy(event.target.checked)}
                />
                {t.collapse.slowCopy}
              </label>
              <p className="text-caption text-fg-muted">{t.collapse.slowCopyHint}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button disabled={done} onClick={() => setRunning(!running)}>
              {running ? copy.pause : copy.play}
            </Button>
            <Button variant="ghost" onClick={restart}>
              {copy.restart}
            </Button>
          </div>
        </div>
      }
      figures={
        <>
          <Figure label={copy.steps} value={String(s.steps)} />
          <Figure label={copy.loss} value={s.loss === null ? "—" : t.decimal(s.loss, 3)} />
          {mode === "collapse" ? (
            <Figure label={t.collapse.spread} value={t.decimal(s.spread, 3)} tone="accent" />
          ) : (
            <Figure label={copy.separation} value={copy.times(s.separation)} tone="accent" />
          )}
          <Figure label={copy.kindGuess} value={t.percent(Math.round(s.accuracy * 100))} />
        </>
      }
      secondaryLabel={mode === "train" ? copy.startLabel : undefined}
      secondaryCollapsible
      secondary={
        mode === "train" ? (
          <div className="space-y-3">
            <p className="text-body-sm text-fg-muted">{copy.newStartHint}</p>
            <Button variant="secondary" onClick={() => setSeed(seed + 1)}>
              {copy.newStart}
            </Button>
          </div>
        ) : undefined
      }
    />
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
