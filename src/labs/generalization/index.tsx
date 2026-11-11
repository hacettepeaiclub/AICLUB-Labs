import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { Figure, LabRecap, LabSlider, Stage } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import { accuracy, dataset, predict, type Point } from "./engine";

export default function GeneralizationLab() {
  const t = useLabCopy("generalization");
  const [k, setK] = useState(1);
  const [count, setCount] = useState(32);
  const [noise, setNoise] = useState(0.15);
  const [seed, setSeed] = useState(71);
  const [reveal, setReveal] = useState(false);
  const [validationSeen, setValidationSeen] = useState(false);
  const [tested, setTested] = useState(false);
  const training = useMemo(() => dataset(seed, count, noise), [seed, count, noise]);
  const validation = useMemo(() => dataset(seed + 10000, 80, noise), [seed, noise]);
  const testing = useMemo(() => dataset(seed + 20000, 160, noise), [seed, noise]);
  const cells = useMemo(() => {
    const paths = ["", ""];
    for (let row = 0; row < 32; row++)
      for (let col = 0; col < 32; col++) {
        const x = (col + 0.5) / 16 - 1;
        const y = 1 - (row + 0.5) / 16;
        const label = predict(training, x, y, k);
        paths[label] += `M${col * 10} ${row * 10}h10v10h-10z`;
      }
    return paths;
  }, [training, k]);
  const trainScore = accuracy(training, training, k);
  const validScore = reveal ? accuracy(training, validation, k) : null;
  const testScore = tested ? accuracy(training, testing, k) : null;
  const points = tested ? testing : reveal ? validation : training;
  const percent = (n: number) => `${Math.round(n * 100)}%`;
  const pointShape = (p: Point, index: number) => {
    const x = (p.x + 1) * 160;
    const y = (1 - p.y) * 160;
    const wrong = predict(training, p.x, p.y, k) !== p.label;
    return (
      <g key={index}>
        {wrong && (
          <circle
            cx={x}
            cy={y}
            r="6"
            fill="none"
            className="stroke-signal-amber"
            strokeWidth="1.5"
          />
        )}
        {p.label === 1 ? (
          <circle cx={x} cy={y} r="2.8" className="fill-accent stroke-ink-950" />
        ) : (
          <path d={`M${x} ${y - 3.5}l3.5 7h-7z`} className="fill-data stroke-ink-950" />
        )}
      </g>
    );
  };
  return (
    <div className="space-y-12">
      <section aria-labelledby="generalization-heading">
        <h2 id="generalization-heading" className="mb-4 text-title text-fg">
          {t.question}
        </h2>
        <Stage
          width="full"
          caption={t.scope}
          announcement={tested ? t.finalNote : reveal ? t.revealed : ""}
          viewport={
            <div className="rounded-lg border border-line/20 bg-ink-900 p-3">
              <p className="mb-3 text-overline uppercase text-fg-muted">
                {tested ? t.test : reveal ? t.validation : t.training}
              </p>
              <svg
                viewBox="0 0 320 320"
                role="img"
                aria-label={t.map}
                className="mx-auto max-h-[28rem] w-full"
              >
                <path d={cells[0]} className="fill-data/15" />
                <path d={cells[1]} className="fill-accent/20" />
                {points.map(pointShape)}
              </svg>
              <p className="mt-3 text-caption text-fg-muted">{t.legend}</p>
            </div>
          }
          primary={
            <div className="space-y-4">
              <fieldset disabled={tested} className="space-y-4 disabled:opacity-50">
                <legend className="sr-only">{t.settings}</legend>
                <LabSlider
                  label={t.neighbours}
                  min={1}
                  max={Math.min(21, count - 1)}
                  step={2}
                  value={k}
                  onChange={setK}
                  format={() => String(k)}
                />
                <p className="text-body-sm text-fg-muted">{t.kHint}</p>
              </fieldset>
              <Button
                disabled={tested}
                variant="secondary"
                onClick={() => {
                  setValidationSeen(true);
                  setReveal(!reveal);
                }}
              >
                {reveal ? t.hide : t.show}
              </Button>
              <Button disabled={!reveal || tested} onClick={() => setTested(true)}>
                {t.lock}
              </Button>
              {tested && <p className="text-body-sm text-fg-muted">{t.finalNote}</p>}
              <Button
                variant="ghost"
                onClick={() => {
                  setSeed(seed + 1);
                  setTested(false);
                  setReveal(false);
                  setValidationSeen(false);
                  setK(1);
                }}
              >
                {t.newData}
              </Button>
            </div>
          }
          figures={
            <>
              <Figure label={t.training} value={percent(trainScore)} />
              <Figure
                label={t.validation}
                value={validScore === null ? "—" : percent(validScore)}
              />
              <Figure label={t.test} value={testScore === null ? "—" : percent(testScore)} />
            </>
          }
          secondaryLabel={t.dataSettings}
          secondaryCollapsible
          secondary={
            <fieldset disabled={tested || validationSeen} className="space-y-4 disabled:opacity-50">
              <legend className="sr-only">{t.dataSettings}</legend>
              <LabSlider
                label={t.samples}
                min={16}
                max={96}
                step={8}
                value={count}
                onChange={(value) => {
                  setCount(value);
                  setK(Math.min(k, value - 1));
                }}
                format={() => String(count)}
              />
              <LabSlider
                label={t.noise}
                min={0}
                max={0.3}
                step={0.05}
                value={noise}
                onChange={setNoise}
                format={() => percent(noise)}
              />
              <p className="text-caption text-fg-muted">{t.dataHint}</p>
            </fieldset>
          }
        />
      </section>
      <aside className="rounded-lg border border-line/20 bg-ink-800 p-5">
        <h2 className="text-title text-fg">{t.bridgeTitle}</h2>
        <p className="mt-2 text-body text-fg-muted">{t.bridge}</p>
        <Link
          className="mt-3 inline-flex min-h-11 items-center text-accent underline"
          to="/labs/multilayer-perceptrons/"
        >
          {t.link} →
        </Link>
      </aside>
      <LabRecap lessons={t.recap.lessons} footer={t.scope} />
    </div>
  );
}
