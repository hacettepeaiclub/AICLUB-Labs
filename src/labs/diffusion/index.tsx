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
        viewBox={`0 0 ${SIZE} ${SIZE}`}
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
  const names = tr ? ["Halka", "Artı", "Elmas", "Çubuklar"] : ["Ring", "Cross", "Diamond", "Bars"];
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
              <Pixels values={sample} label={tr ? "Şimdiki örnek xₜ" : "Current sample xₜ"} />
              <Pixels
                values={prediction.clean}
                label={tr ? "Temiz örnek tahmini E[x₀|xₜ]" : "Clean estimate E[x₀|xₜ]"}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {prediction.allowed.map((id, i) => (
                <div key={id} className="rounded border border-line/20 p-2">
                  <p className="flex justify-between gap-2 text-caption text-fg">
                    <span>{names[id]}</span>
                    <span>{(prediction.weights[i]! * 100).toFixed(1)}%</span>
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
            <p className="text-caption text-fg-muted">
              {tr
                ? "Yüzdeler yalnız bu dört şekilli oyuncak modeldeki posterior olasılıklardır. Piksel gösterimi kırpılır; hesaplama değerleri kırpılmaz."
                : "Percentages are posterior probabilities only within this four-shape toy model. Pixel display is clipped; calculation values are not."}
            </p>
          </div>
        }
        primary={
          <div className="space-y-4">
            <LabSlider
              label={
                tr
                  ? "Gürültü adımı (değiştirmek deneyi sıfırlar)"
                  : "Noise step (changing resets the experiment)"
              }
              value={t}
              min={0}
              max={STEPS}
              onChange={(value) => reset(value)}
              format={() => String(t)}
            />
            <div className="flex flex-wrap gap-2">
              <Button disabled={t === 0} onClick={() => step()}>
                {tr ? "Bir ters adım" : "Reverse one step"}
              </Button>
              <Button variant="secondary" disabled={t === 0} onClick={() => step(true)}>
                {tr ? "Sona kadar hesapla" : "Compute to the end"}
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
              {tr ? "Yeni seed" : "New seed"} · {seed}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setT(STEPS);
                setSample(noise(seed));
              }}
            >
              {tr ? "Yalnız gürültüden başla" : "Start from noise only"}
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
              {tr ? "Asıl şekli önbilgiden çıkar" : "Exclude source from prior"}
            </label>
          </div>
        }
        figures={
          <>
            <Figure label={tr ? "Kalan adım" : "Steps left"} value={String(t)} />
            <Figure
              label={tr ? "Sinyal katsayısı ᾱ" : "Signal fraction ᾱ"}
              value={alpha(t).toFixed(4)}
            />
          </>
        }
        secondaryLabel={tr ? "Başlangıç şekli" : "Source shape"}
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
            <Pixels
              values={TEMPLATES[shape]!}
              label={
                tr
                  ? "İleri sürecin kaynağı (ters süreç bunu almaz)"
                  : "Forward source (not passed to reverse process)"
              }
            />
          </div>
        }
        caption={
          tr
            ? "İleri: xₜ = √ᾱ x₀ + √(1−ᾱ) ε. Ters: mevcut örnekten temiz örneği tahmin et, sonra deterministik DDIM adımı uygula. Kaynak şekil ve özgün gürültü ters adıma verilmez."
            : "Forward: xₜ = √ᾱ x₀ + √(1−ᾱ) ε. Reverse: estimate a clean sample from the current sample, then apply a deterministic DDIM step. The reverse step receives neither the source shape nor its original noise."
        }
      />
      <section className="rounded-lg border border-line/20 bg-ink-800 p-5">
        <h2 className="text-title text-fg">
          {tr ? "Bu model ne biliyor?" : "What does this model know?"}
        </h2>
        <p className="mt-3 text-body-sm text-fg-muted">
          {tr
            ? "Bu taslakta sinir ağı eğitilmiyor. Eşit öncül olasılıklı dört sabit şekil ve Gauss gürültüsü için Bayes kuralıyla tam posterior ortalama hesaplanıyor. Gerçek diffusion modelleri bu tür bir denoiser'ı veriden öğrenir. Burada yeni nesneler, metin istemleri veya fotoğraflar üretilemez; model yalnız tanımlanan önbilgiye dayanır. Gürültüden başlatıldığında ilk örnek yaklaşık terminal dağılımıdır."
            : "No neural network is trained in this draft. It computes the exact posterior mean under a uniform prior over four fixed shapes and Gaussian corruption. Real diffusion models learn a denoiser from data. This model cannot generate new objects, text prompts or photos; it depends on its specified prior. Starting from noise approximates the terminal distribution."}
        </p>
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
