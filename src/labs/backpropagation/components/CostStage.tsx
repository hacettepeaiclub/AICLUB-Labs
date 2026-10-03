import { useEffect, useMemo, useRef, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLanguage } from "@/i18n";
import { useLabs } from "@/i18n/labs";
import { backward, forward, numericGradient, parameterNodes, wideNetwork } from "../engine";
import { formatSmall, formatValue } from "../view";

interface Result {
  readonly params: number;
  readonly backpropMs: number;
  readonly numericMs: number;
  readonly worst: number;
}

/** Parameters checked per slice of the numeric run, so the page stays responsive. */
const SLICE = 40;

/**
 * Section 5: a race, run for real in this browser.
 *
 * The same gradient two ways, on a network whose width the visitor sets:
 * central differences, which need two forward passes for every one of its N
 * weights, against backpropagation, which needs one forward pass and one
 * backward. Both are timed with the page's own clock while they run, the
 * numeric one in slices so the page never freezes, and the largest
 * disagreement between their answers is printed — the race only counts if
 * both reach the same gradient.
 *
 * Nothing on this stage is a model of the cost. The times are this
 * machine's, and they will differ on the next one; the ratio is what holds.
 */
export function CostStage() {
  const t = useLabs().backpropagation.cost;
  const { language } = useLanguage();
  const [width, setWidth] = useState(12);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const cancel = useRef(false);

  const net = useMemo(() => wideNetwork(width, 5), [width]);
  const count = Object.keys(net.params).length;

  useEffect(() => {
    cancel.current = true;
    setRunning(false);
    setResult(null);
    setProgress(0);
  }, [width]);
  useEffect(() => () => void (cancel.current = true), []);

  const race = () => {
    cancel.current = false;
    setRunning(true);
    setResult(null);
    setProgress(0);

    // One backward pass can finish inside the clock's resolution, so it is
    // run several times and the average taken. The numeric side needs no
    // such help: it is thousands of passes long.
    const REPEAT = 20;
    let adj = new Float64Array(0);
    const t0 = performance.now();
    for (let r = 0; r < REPEAT; r++) adj = backward(net.graph, forward(net.graph, net.params));
    const backpropMs = (performance.now() - t0) / REPEAT;
    const nodes = parameterNodes(net.graph);

    const names = Object.keys(net.params);
    let i = 0;
    let numericMs = 0;
    let worst = 0;
    const slice = () => {
      if (cancel.current) return;
      const start = performance.now();
      for (const end = Math.min(i + SLICE, names.length); i < end; i++) {
        const name = names[i] ?? "";
        const numeric = numericGradient(net.graph, net.params, name, 1e-5);
        const analytic = adj[nodes.get(name) ?? 0] ?? 0;
        worst = Math.max(worst, Math.abs(numeric - analytic));
      }
      numericMs += performance.now() - start;
      setProgress(i / names.length);
      if (i < names.length) setTimeout(slice, 0);
      else {
        setRunning(false);
        setResult({ params: names.length, backpropMs, numericMs, worst });
      }
    };
    setTimeout(slice, 0);
  };

  const ratio = result && result.backpropMs > 0 ? result.numericMs / result.backpropMs : null;
  const longest = result ? Math.max(result.numericMs, result.backpropMs) : 1;
  const ms = (v: number) => (v < 1 ? `${formatValue(v, 2)} ms` : `${formatValue(v, 0)} ms`);

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={result && ratio ? t.announce(formatValue(ratio, 0), result.params) : ""}
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-body-sm text-fg-muted">
            {t.sizeLine(count.toLocaleString(language === "tr" ? "tr-TR" : "en-US"), 2 * count)}
          </p>
          {[
            {
              key: "numeric",
              label: t.numeric,
              passes: t.numericPasses(2 * count),
              ms: result?.numericMs,
              live: running,
              tone: "bg-signal-amber",
            },
            {
              key: "backprop",
              label: t.backprop,
              passes: t.backpropPasses,
              ms: result?.backpropMs,
              live: false,
              tone: "bg-accent",
            },
          ].map((row) => (
            <div key={row.key}>
              <div className="flex items-baseline justify-between gap-3 text-body-sm">
                <span className="text-fg">{row.label}</span>
                <span className="font-mono text-caption text-fg-muted">
                  {row.ms !== undefined
                    ? ms(row.ms)
                    : row.live
                      ? `${formatValue(progress * 100, 0)}%`
                      : "—"}
                </span>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded bg-fg/10">
                <div
                  className={`h-full ${row.tone}`}
                  style={{
                    width: `${
                      row.ms !== undefined
                        ? Math.max((row.ms / longest) * 100, 0.6)
                        : row.live
                          ? progress * 100
                          : 0
                    }%`,
                  }}
                />
              </div>
              <p className="mt-1 text-caption text-fg-faint">{row.passes}</p>
            </div>
          ))}
          {result && (
            <p className="text-body-sm text-signal-green">{t.agree(formatSmall(result.worst))}</p>
          )}
        </div>
      }
      primary={
        <div className="space-y-4">
          <LabSlider label={t.widthLabel} value={width} min={2} max={48} onChange={setWidth} />
          <Button onClick={race} disabled={running} className="min-h-[44px] w-full">
            {running ? t.running : t.race}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure
            label={t.figures.weights}
            value={count.toLocaleString(language === "tr" ? "tr-TR" : "en-US")}
          />
          <Figure
            label={t.figures.ratio}
            value={ratio ? `×${formatValue(ratio, 0)}` : "—"}
            hint={t.figures.ratioHint}
            tone="accent"
          />
        </>
      }
    />
  );
}
