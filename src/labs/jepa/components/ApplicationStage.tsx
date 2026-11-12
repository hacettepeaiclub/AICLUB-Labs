import { useMemo, useRef, useState } from "react";
import { Stage } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import { createJepa, TEXTURES, type Texture } from "../engine";
import { useJepaModel } from "../useJepaModel";
import { coverAt, observe, search, surface } from "../surfaceSearch";
import { useJepaActivity } from "../useJepaActivity";
import { MAX_STEPS } from "../useJepaTrainer";
import { PictureView } from "./PictureView";

/** Transfer the learned encoder into a small camera-to-catalogue application. */
export function ApplicationStage() {
  const t = useLabCopy("jepa"),
    a = t.application;
  const root = useRef<HTMLDivElement>(null),
    active = useJepaActivity(root);
  const [texture, setTexture] = useState<Texture>("horizontal");
  const [light, setLight] = useState(1),
    [noise, setNoise] = useState(0),
    [size, setSize] = useState(1),
    [position, setPosition] = useState(5);
  const [trained, setTrained] = useState(true);
  const model = useJepaModel(active);
  const steps = model.steps;
  const initial = useMemo(() => createJepa(1).encoder, []);
  const source = useMemo(() => surface(texture, 408), [texture]);
  const picture = useMemo(() => observe(source, light, noise), [source, light, noise]);
  const hidden = useMemo(() => coverAt(position, size), [position, size]);
  // steps is a publication version of the mutable network weights.
  const result = search(trained ? model.encoder : initial, picture, hidden);
  return (
    <div ref={root} data-jepa-application className="space-y-5">
      <Stage
        width="full"
        controls="stack"
        viewport={
          <div className="space-y-5">
            <div
              className="grid grid-cols-3 gap-2 text-center text-caption text-fg-muted"
              aria-hidden="true"
            >
              {[a.input, a.representation, a.results].map((label, i) => (
                <div key={label} className="rounded border border-line/20 px-2 py-3">
                  <span className="block font-mono text-accent">
                    0{i + 1}
                    {i < 2 ? " →" : ""}
                  </span>
                  {label}
                </div>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="min-w-0 space-y-3">
                <h3 className="text-body-sm font-semibold text-fg">{a.query}</h3>
                <div className="mx-auto max-w-[20rem] rounded-lg border border-line/20 bg-ink-900 p-3">
                  <PictureView
                    picture={picture}
                    hidden={hidden}
                    selected={hidden[0] ?? null}
                    onPick={setPosition}
                    dragSelect
                    patchLabel={t.picture.patchLabel}
                    label={a.query}
                  />
                </div>
                <p className="text-caption text-fg-muted">
                  {a.drag} · {a.visible}: {16 - hidden.length}/16
                </p>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label={a.query}>
                  {TEXTURES.map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      data-query-texture={kind}
                      aria-pressed={texture === kind}
                      onClick={() => setTexture(kind)}
                      className={`min-h-11 rounded border px-2 text-caption ${texture === kind ? "border-accent/60 bg-accent/10 text-fg" : "border-line/20 text-fg-muted"}`}
                    >
                      {t.kinds[kind]}
                    </button>
                  ))}
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="text-caption text-fg-muted">
                    {a.mask}: {size}×{size}
                    <input
                      data-search-mask
                      type="range"
                      min="0"
                      max="3"
                      step="1"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="min-h-11 w-full accent-accent"
                    />
                  </label>
                  <label className="text-caption text-fg-muted">
                    {a.light}: {t.decimal(light, 1)}
                    <input
                      data-search-light
                      type="range"
                      min="0.6"
                      max="1.4"
                      step="0.05"
                      value={light}
                      onChange={(e) => setLight(Number(e.target.value))}
                      className="min-h-11 w-full accent-accent"
                    />
                  </label>
                  <label className="text-caption text-fg-muted">
                    {a.noise}: {t.decimal(noise, 2)}
                    <input
                      data-search-noise
                      type="range"
                      min="0"
                      max="0.2"
                      step="0.01"
                      value={noise}
                      onChange={(e) => setNoise(Number(e.target.value))}
                      className="min-h-11 w-full accent-accent"
                    />
                  </label>
                </div>
              </div>
              <div className="min-w-0 space-y-3">
                <h3 className="text-body-sm font-semibold text-fg">{a.catalog}</h3>
                <div
                  className="grid grid-cols-4 gap-2 rounded border border-line/20 bg-ink-900 p-3"
                  aria-label={a.encoder}
                >
                  {Array.from(result.vector, (v, i) => (
                    <div key={i} className="text-center">
                      <div className="relative mx-auto h-12 w-6 rounded bg-line/10">
                        <span className="absolute inset-x-0 top-1/2 border-t border-line/30" />
                        <span
                          className={`absolute inset-x-1 ${v < 0 ? "bg-data" : "bg-accent"}`}
                          style={{
                            height: `${Math.abs(v) * 50}%`,
                            top: v < 0 ? "50%" : `${50 - v * 50}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-caption text-fg">{t.decimal(v, 2)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-caption text-fg-muted">{a.similarity}</p>
                <ol className="space-y-2">
                  {result.matches.map((match, i) => (
                    <li
                      key={match.texture}
                      data-search-match={match.texture}
                      className={`flex min-h-24 items-center gap-3 rounded border p-3 ${i === 0 ? "border-accent/60 bg-accent/5" : "border-line/15"}`}
                    >
                      <span className="font-mono text-caption text-fg-muted">0{i + 1}</span>
                      <div className="w-14 shrink-0">
                        <PictureView picture={match.picture} label={t.kinds[match.texture]} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-body-sm text-fg">{t.kinds[match.texture]}</p>
                        <p className="text-caption text-fg-muted">
                          <strong className="font-mono text-accent">
                            {t.decimal(match.similarity, 3)}
                          </strong>
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="text-caption text-fg-muted">{a.notProbability}</p>
              </div>
            </div>
          </div>
        }
        primary={
          <fieldset className="border-t border-line/15 pt-3">
            <legend className="px-2 text-caption text-fg-muted">{a.model}</legend>
            <div className="flex flex-wrap gap-4">
              {[false, true].map((value) => (
                <label
                  key={String(value)}
                  className="flex min-h-11 items-center gap-2 text-body-sm text-fg"
                >
                  <input
                    type="radio"
                    name="jepa-search-model"
                    checked={trained === value}
                    onChange={() => setTrained(value)}
                  />
                  {value ? a.after : a.before}
                </label>
              ))}
            </div>
          </fieldset>
        }
        readout={
          <>
            <p
              role="status"
              className="text-caption text-accent"
              data-search-ready={steps >= MAX_STEPS}
            >
              {steps < MAX_STEPS
                ? `${a.preparing} ${steps}/${MAX_STEPS}`
                : trained
                  ? a.ready
                  : a.before}
            </p>
            <div className="grid gap-3 rounded border border-line/15 bg-ink-900 p-3 text-body-sm text-fg-muted sm:grid-cols-2">
              <p>{a.training}</p>
              <p>{a.inference}</p>
            </div>
          </>
        }
        caption={a.scope}
      />
    </div>
  );
}
