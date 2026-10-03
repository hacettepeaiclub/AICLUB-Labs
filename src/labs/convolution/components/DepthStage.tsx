import { useState, type KeyboardEvent } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { dependencies, layerSizes, receptiveField, type Layer } from "../engine";

const INPUT = 16;
const ROW = 1.7;
const CELL = 0.78;

/**
 * Section 5: stacking layers, seen from one cell at the top.
 *
 * One axis is enough — square kernels give a square field, so a row of
 * cells per layer tells the whole story and fits on a phone. Each cell sits
 * over the middle of the input it reads, which is where "same" padding puts
 * it, so a strided layer visibly spreads out.
 *
 * Picking a cell at the top lights everything it depends on, layer by layer,
 * down to the input. The figure is the formula; the picture is the proof,
 * and the two are computed separately (`receptiveField` and `dependencies`)
 * and tested against a brute-force perturbation of a real stack.
 */
export function DepthStage() {
  const t = useLabs().convolution.depth;
  const [stored, save] = useLocalControls("acl:convolution:depth", {
    count: 2,
    strides: "1111",
  });
  const count = Math.min(Math.max(Math.round(stored.count), 1), 4);
  const strides = /^[12]{4}$/.test(stored.strides) ? stored.strides : "1111";
  const layers: Layer[] = Array.from({ length: count }, (_, l) => ({
    kernel: 3,
    padding: 1,
    stride: strides[l] === "2" ? 2 : 1,
  }));
  const sizes = layerSizes(INPUT, layers);
  const top = sizes[count] ?? 1;
  const [picked, setPicked] = useState<number | null>(null);
  const sel = Math.min(picked ?? Math.floor((top - 1) / 2), top - 1);

  const field = receptiveField(layers);
  const ranges = dependencies(layers, sel);
  const reachesPadding = (ranges.at(-1)?.from ?? 0) < 0 || (ranges.at(-1)?.to ?? 0) > INPUT - 1;

  // Jump (input cells per step) at every level, input first.
  const jumps = [1];
  for (const layer of layers) jumps.push((jumps.at(-1) ?? 1) * layer.stride);

  // A little headroom so the top row's label has somewhere to sit.
  const HEAD = 0.6;
  const height = (count + 1) * ROW + HEAD;
  const yOf = (level: number) => HEAD + (count - level) * ROW + (ROW - CELL) / 2;
  const xOf = (level: number, i: number) => i * (jumps[level] ?? 1) + 0.5;

  const toggle = (l: number) => {
    const next = [...strides];
    next[l] = next[l] === "2" ? "1" : "2";
    save({ strides: next.join("") });
    setPicked(null);
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const d = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    if (!d) return;
    event.preventDefault();
    setPicked(Math.min(Math.max(sel + d, 0), top - 1));
  };

  const cone = [];
  for (let m = 0; m < ranges.length - 1; m++) {
    const upper = ranges[m];
    const lower = ranges[m + 1];
    if (!upper || !lower) continue;
    const lu = count - m;
    const ll = lu - 1;
    const clip = (r: { from: number; to: number }, level: number) => ({
      from: Math.max(r.from, 0),
      to: Math.min(r.to, (sizes[level] ?? 1) - 1),
    });
    const u = clip(upper, lu);
    const w = clip(lower, ll);
    const y1 = yOf(lu) + CELL;
    const y2 = yOf(ll);
    cone.push(
      <polygon
        key={m}
        points={[
          [xOf(lu, u.from) - CELL / 2, y1],
          [xOf(lu, u.to) + CELL / 2, y1],
          [xOf(ll, w.to) + CELL / 2, y2],
          [xOf(ll, w.from) - CELL / 2, y2],
        ]
          .map((p) => p.join(","))
          .join(" ")}
        className="fill-accent/10"
      />,
    );
  }

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={t.announce(field.size)}
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <div className="relative">
            <svg
              viewBox={`0 0 ${INPUT} ${height}`}
              role="img"
              tabIndex={0}
              aria-label={t.diagramLabel(count, sel + 1, top, field.size)}
              onKeyDown={onKeyDown}
              className="block h-auto w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {cone}
              {sizes.map((size, level) =>
                Array.from({ length: size }, (_, i) => {
                  const range = ranges[count - level];
                  const lit = !!range && i >= range.from && i <= range.to;
                  const chosen = level === count && i === sel;
                  return (
                    <rect
                      key={`${level}-${i}`}
                      x={xOf(level, i) - CELL / 2}
                      y={yOf(level)}
                      width={CELL}
                      height={CELL}
                      rx={0.1}
                      onClick={level === count ? () => setPicked(i) : undefined}
                      className={cn(
                        lit ? "fill-accent" : "fill-fg/10",
                        chosen && "stroke-fg",
                        level === count && "cursor-pointer",
                      )}
                      strokeWidth={chosen ? 0.1 : 0}
                    />
                  );
                }),
              )}
            </svg>
            {/* Labels over the SVG rather than inside it, so they keep the
                page's type size however wide the diagram is drawn. */}
            {Array.from({ length: count + 1 }, (_, level) => (
              <p
                key={level}
                aria-hidden
                className="pointer-events-none absolute left-0 -translate-y-full pb-0.5 text-overline uppercase text-fg-faint"
                style={{ top: `${(yOf(level) / height) * 100}%` }}
              >
                {level === 0 ? t.inputName : t.layerName(level)}
              </p>
            ))}
          </div>
          {reachesPadding && <p className="mt-3 text-caption text-fg-faint">{t.edgeNote}</p>}
        </div>
      }
      primary={
        <div className="space-y-4">
          <LabSlider
            label={t.layersLabel}
            value={count}
            min={1}
            max={4}
            onChange={(v) => {
              save({ count: v });
              setPicked(null);
            }}
          />
          <div
            role="group"
            aria-label={t.stridesLabel}
            className="flex flex-wrap justify-center gap-2"
          >
            {layers.map((layer, l) => (
              <Button
                key={l}
                variant={layer.stride === 2 ? "primary" : "secondary"}
                aria-pressed={layer.stride === 2}
                onClick={() => toggle(l)}
                className="min-h-[44px]"
              >
                {t.strideButton(l + 1, layer.stride)}
              </Button>
            ))}
          </div>
        </div>
      }
      figures={
        <>
          <Figure
            label={t.figures.field}
            value={`${field.size} × ${field.size}`}
            hint={t.figures.fieldHint}
            tone="accent"
          />
          <Figure
            label={t.figures.weights}
            value={String(9 * count)}
            hint={t.figures.weightsHint(count)}
          />
          <Figure
            label={t.figures.single}
            value={String(field.size * field.size)}
            hint={t.figures.singleHint(field.size)}
          />
        </>
      }
    />
  );
}
