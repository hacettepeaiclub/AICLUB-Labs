import { useMemo, useState } from "react";
import { useLabCopy } from "@/i18n/labs";
import { useLanguage } from "@/i18n";
import { Button } from "@/components/ui";
import { Figure, LabSlider, Stage, LabRecap } from "@/components/lab";
import { alpha, corrupt, estimate, noise, reverse, SHAPES, SIZE, STEPS, TEMPLATES } from "./engine";

function Pixels({ values, label }: { values: Float64Array; label: string }) {
  return (
    <figure className="min-w-0">
      <figcaption className="mb-2 text-caption text-fg-muted">{label}</figcaption>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${SIZE}  ${SIZE}`}
        className="w-full rounded border border-line/20 bg-ink-950 text-accent"
        shapeRendering="crispEdges"
      >
        {Array.from(values, (value, i) => (
          <rect
            key={i}
            x={i % SIZE}
            y={Math.floor(i / SIZE)}
            width="1"
            height="1"
            fill="currentColor"
            opacity={Math.max(0, Math.min(1, (value + 1) / 2))}
          />
        ))}
      </svg>
    </figure>
  );
}

export default function DiffusionLab() {
  const { language } = useLanguage(),
    tr = language === "tr";
  const [shape, setShape] = useState(0),
    [seed, setSeed] = useState(7),
    [t, setT] = useState(35);
  const [sample, setSample] = useState(() => corrupt(TEMPLATES[0]!, 35, 7));
  const [excluded, setExcluded] = useState(false);
  const copy = useLabCopy("diffusion");
  const names = copy.experiment.shapes;
  const allowed = useMemo(
    () => SHAPES.map((_, i) => i).filter((i) => !excluded || i !== shape),
    [excluded, shape],
  );
  const prediction = useMemo(() => estimate(sample, t, allowed), [sample, t, allowed]);
  function reset(at: number, nextShape = shape, nextSeed = seed) {
    setT(at);
    setSample(corrupt(TEMPLATES[nextShape]!, at, nextSeed));
  }
  function step(finish = false) {
    let current = sample;
    const end = finish ? 0 : Math.max(0, t - 1);
    for (let at = t; at > end; at--) current = reverse(current, at, allowed);
    setSample(current);
    setT(end);
  }
  return (
    <div className="space-y-10">
      <Stage
        width="full"
        secondaryCollapsible
        viewport={
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Pixels values={sample} label={copy.experiment.sampleLabel} />
              <Pixels values={prediction.clean} label={copy.experiment.estimateLabel} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {prediction.allowed.map((id, i) => (
                <div key={id} className="rounded border border-line/20 p-2">
                  <p className="flex justify-between gap-2 text-caption text-fg">
                    <span>{names[id]}</span>
                    <span>
                      {tr
                        ? `%${(prediction.weights[i]! * 100).toFixed(1).replace(".", ",")}`
                        : `${(prediction.weights[i]! * 100).toFixed(1)}%`}
                    </span>
                  </p>
                  <div className="mt-2 h-2 bg-line/10" aria-hidden>
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${prediction.weights[i]! * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-caption text-fg-muted">{copy.experiment.posteriorHint}</p>
          </div>
        }
        primary={
          <div className="space-y-4">
            <LabSlider
              label={copy.experiment.noiseStep}
              value={t}
              min={0}
              max={STEPS}
              onChange={(value) => reset(value)}
              format={() => String(t)}
            />
            <div className="flex flex-wrap gap-2">
              <Button disabled={t === 0} onClick={() => step()}>
                {copy.experiment.reverseStep}
              </Button>
              <Button variant="secondary" disabled={t === 0} onClick={() => step(true)}>
                {copy.experiment.finish}
              </Button>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const next = seed + 1;
                setSeed(next);
                reset(35, shape, next);
              }}
            >
              {copy.experiment.newSeed} · {seed}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setT(STEPS);
                setSample(noise(seed));
              }}
            >
              {copy.experiment.startFromNoise}
            </Button>
            <label className="flex min-h-11 items-center gap-3 text-body-sm text-fg">
              <input
                type="checkbox"
                checked={excluded}
                onChange={(e) => {
                  setExcluded(e.target.checked);
                  reset(35);
                }}
              />
              {copy.experiment.excludeSource}
            </label>
          </div>
        }
        figures={
          <>
            <Figure label={copy.experiment.stepsLeft} value={String(t)} />
            <Figure
              label={copy.experiment.signalFraction}
              value={tr ? alpha(t).toFixed(4).replace(".", ",") : alpha(t).toFixed(4)}
            />
          </>
        }
        secondaryLabel={copy.experiment.sourceShape}
        secondary={
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {names.map((name, i) => (
                <Button
                  key={name}
                  variant={shape === i ? "primary" : "secondary"}
                  onClick={() => {
                    setShape(i);
                    reset(35, i);
                  }}
                >
                  {name}
                </Button>
              ))}
            </div>
            <Pixels values={TEMPLATES[shape]!} label={copy.experiment.sourceLabel} />
          </div>
        }
        caption={copy.experiment.caption}
      />
      <section className="rounded-lg border border-line/20 bg-ink-800 p-5">
        <h2 className="text-title text-fg">{copy.experiment.modelTitle}</h2>
        <p className="mt-3 text-body-sm text-fg-muted">{copy.experiment.modelBody}</p>
        <a
          className="mt-3 inline-flex min-h-11 items-center text-accent underline"
          href="https://huggingface.co/docs/diffusers/api/schedulers/ddim"
          target="_blank"
          rel="noreferrer"
        >
          DDIM · Hugging Face
        </a>
      </section>
      <LabRecap lessons={copy.recap.lessons} />
    </div>
  );
}
