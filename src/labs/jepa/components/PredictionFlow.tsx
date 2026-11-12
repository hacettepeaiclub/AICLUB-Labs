import { useId, useState } from "react";
import { useLabCopy } from "@/i18n/labs";
import { patchOf, type TrainOptions } from "../engine";
import type { Snapshot } from "../useJepaTrainer";
import { PatchView } from "./PictureView";
import { LayerInspector } from "./LayerInspector";

export function PredictionFlow({
  snapshot: s,
  options,
}: {
  snapshot: Snapshot;
  options: TrainOptions;
}) {
  const t = useLabCopy("jepa"),
    f = t.flow;
  const [selected, setSelected] = useState(-1);
  const [phase, setPhase] = useState(0);
  const id = useId();
  const hidden = s.sample.hidden.includes(selected) ? selected : s.sample.hidden[0]!;
  const index = s.traces.findIndex((g) => g.hidden === hidden),
    trace = s.traces[index];
  return (
    <section
      data-jepa-flow
      className="space-y-4 rounded-lg border border-line/20 bg-ink-900 p-3 md:p-5"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={`${id}-title`} className="text-body font-semibold text-fg">
          {f.title}
        </h3>
        <label className="flex items-center gap-2 text-caption text-fg-muted">
          {f.choose}
          <select
            value={hidden}
            onChange={(e) => setSelected(Number(e.target.value))}
            className="min-h-11 rounded border border-line/30 bg-ink-800 px-2 text-fg"
          >
            {s.sample.hidden.map((h) => (
              <option key={h} value={h}>
                {t.picture.patchLabel(h + 1)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {trace ? (
        <>
          <label className="block text-body-sm text-fg">
            {t.simulation.trace}
            <input
              data-jepa-signal
              type="range"
              min="0"
              max="3"
              step="1"
              value={phase}
              onChange={(e) => setPhase(Number(e.target.value))}
              className="min-h-11 w-full accent-accent"
            />
          </label>
          <div className="grid grid-cols-4 gap-1" role="group" aria-label={t.simulation.detail}>
            {t.simulation.steps.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={phase === i}
                aria-controls={`${id}-explanation`}
                onClick={() => setPhase(i)}
                className={`min-h-14 min-w-0 rounded border px-1 py-2 text-caption ${phase === i ? "border-accent/70 bg-accent/10 text-fg" : "border-line/15 text-fg-muted"}`}
              >
                <span className="block font-mono text-accent">
                  0{i + 1}
                  {i < 3 ? " →" : " ↔"}
                </span>
                {label}
              </button>
            ))}
          </div>
          <div className="rounded border border-line/15 bg-ink-800 p-4" data-flow-phase={phase}>
            <h4 className="mb-4 text-body-sm font-semibold text-fg">
              {[f.context, f.predictor, f.target, f.compare][phase]}
            </h4>
            {phase === 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2">
                  {trace.from.map((n) => (
                    <div key={n} className="w-12">
                      <PatchView
                        pixels={patchOf(s.sample.picture, n)}
                        label={t.picture.patchLabel(n + 1)}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-accent" aria-hidden="true">
                  →
                </span>
                <div className="rounded border border-accent/40 px-4 py-3 text-center font-mono text-body-sm text-fg">
                  E<span className="block text-caption text-fg-muted">16 → 16 → 4</span>
                </div>
                <span className="text-accent" aria-hidden="true">
                  →
                </span>
                <span className="text-body-sm text-fg-muted">{t.network.output} · 4</span>
              </div>
            )}
            {phase === 1 && <Vector values={trace.guess} label={f.predictor} name="guess" />}
            {phase === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12">
                    <PatchView
                      pixels={patchOf(s.sample.picture, hidden)}
                      label={t.picture.patchLabel(hidden + 1)}
                    />
                  </div>
                  <span className="text-accent">→</span>
                  <span className="text-body-sm text-fg-muted">{f.target}</span>
                </div>
                <Vector values={trace.goal} label={f.target} name="goal" />
                <p className="text-caption text-fg-muted">
                  {options.slowCopy ? f.copied : options.stopGradient ? f.detached : f.joint}
                </p>
              </div>
            )}
            {phase === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-2 text-caption text-fg-muted">{t.train.legendGuess}</p>
                    <Vector values={trace.guess} label={f.predictor} name="guess" />
                  </div>
                  <div>
                    <p className="mb-2 text-caption text-fg-muted">{t.train.legendGoal}</p>
                    <Vector values={trace.goal} label={f.target} name="goal" />
                  </div>
                </div>
                <p className="text-body-sm text-fg-muted">
                  {f.distance}:{" "}
                  <strong className="font-mono text-accent">{t.decimal(trace.error, 4)}</strong>
                </p>
              </div>
            )}
            <p id={`${id}-explanation`} className="mt-4 text-body-sm text-fg-muted">
              {f.details[phase]}
            </p>
          </div>
          <LayerInspector
            key={phase}
            trace={trace}
            initial={phase === 1 ? "predictor" : phase === 2 ? "target" : "encoder"}
          />
          {phase === 3 && (
            <div className="border-t border-line/15 pt-3">
              <p className="text-body-sm text-fg">
                {f.decode}: <strong className="text-accent">{t.kinds[s.decoded[index]!]}</strong>
              </p>
              <p className="mt-1 text-caption text-fg-muted">{f.decodeHint}</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-body-sm text-fg-muted">{f.noContext}</p>
      )}
    </section>
  );
}
function Vector({ values, label, name }: { values: Float64Array; label: string; name: string }) {
  const t = useLabCopy("jepa");
  return (
    <div
      data-vector={name}
      aria-label={label}
      className="grid grid-cols-4 gap-2 rounded border border-line/15 p-2"
    >
      {Array.from(values, (v, i) => (
        <div key={i} className="min-w-0 text-center">
          <div className="relative mx-auto h-14 w-6 rounded bg-line/5" aria-hidden="true">
            <span className="absolute inset-x-0 top-1/2 border-t border-line/30" />
            <span
              className={`absolute inset-x-1 rounded-sm ${v < 0 ? "bg-data" : "bg-accent"}`}
              style={{ height: `${Math.abs(v) * 50}%`, top: v < 0 ? "50%" : `${50 - v * 50}%` }}
            />
          </div>
          <span className="mt-1 block font-mono text-caption tabular-nums text-fg">
            {t.decimal(v, 2)}
          </span>
        </div>
      ))}
    </div>
  );
}
