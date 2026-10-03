import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useDebouncedValue } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  absR,
  addFloats,
  classify,
  decode,
  div,
  type Float,
  floatsEqual,
  FORMATS,
  fromDouble,
  gapAbove,
  nextUp,
  parseNumber,
  type Rational,
  rational,
  round,
  shortest,
  toDouble,
} from "../engine";
import { powerOfTwo, readable } from "../view";
import { FloatField } from "./FloatField";

const F32 = FORMATS.float32;
const ONE = round(rational(1n), F32);
const MIN_POWER = -10;
const MAX_POWER = 40;

/** The float32 nearest 2^power. The slider chooses a size; this is the number. */
const atPower = (power: number): Float => round(decode(fromDouble(2 ** power)) as Rational, F32);

/** log2 of a float's value, as a plain number: for placing it on a chart. */
const log2Of = (x: Float): number =>
  Math.log2(Math.abs(toDouble(round(decode(x) as Rational, FORMATS.float64))));

// Chart geometry: x is log2(size), y is log2(gap) = floor(log2 size) − 23.
const W = 640;
const H = 220;
const L = 44;
const R = 16;
const T = 14;
const B = 34;
const GAP_MIN = MIN_POWER - 23;
const GAP_MAX = MAX_POWER - 23;
const px = (log2x: number) => L + ((log2x - MIN_POWER) / (MAX_POWER - MIN_POWER)) * (W - L - R);
const py = (log2gap: number) => H - B - ((log2gap - GAP_MIN) / (GAP_MAX - GAP_MIN)) * (H - T - B);

/**
 * Section 5: in float32, the gap to the next number grows with the number.
 *
 * ## The chart
 *
 * Gap against size, both logarithmic. For a normal float32 between 2^e and
 * 2^(e+1) the gap is exactly 2^(e − 23), so the true curve is a staircase
 * with a step at every power of two — which is what is drawn, from that
 * formula, and what the readouts confirm from `gapAbove` for the number you
 * are on. The relative gap is the distance from the staircase to the
 * diagonal, and it never grows: that is the meaning of "floating".
 *
 * The `+ 1` row is the consequence: from 2^24 the gap is 2, and adding 1 to a
 * number lands exactly halfway to the next one — a tie that goes to the even
 * neighbour, which is the number you started with.
 */
export function GapStage() {
  const lab = useLabs()["floating-point"];
  const t = lab.gap;
  const [power, setPower] = useState(3);
  const [text, setText] = useState("");

  const typed = text.trim() ? parseNumber(text) : null;
  const x = useMemo(() => {
    const parsed = text.trim() ? parseNumber(text) : null;
    return parsed ? round(parsed, F32) : atPower(power);
  }, [text, power]);

  const kind = classify(x);
  const finite = kind === "normal" || kind === "subnormal";
  const gap = finite ? gapAbove(x) : null;
  const value = decode(x);
  const rel = gap && value && value.num !== 0n ? div(gap, absR(value)) : null;
  const plusOne = addFloats(x, ONE);
  const lost = finite && floatsEqual(plusOne, x);
  const settled = useDebouncedValue(`${shortest(x)}|${gap ? readable(gap) : "—"}`);

  // The cursor, when the number is on the chart.
  const here = finite && value && value.num > 0n ? log2Of(x) : null;
  const onChart = here !== null && here >= MIN_POWER && here <= MAX_POWER;

  const stairs = useMemo(() => {
    let d = `M ${px(MIN_POWER)} ${py(MIN_POWER - 23)}`;
    for (let e = MIN_POWER; e < MAX_POWER; e++) {
      d += ` H ${px(e + 1)} V ${py(e + 1 - 23)}`;
    }
    return d;
  }, []);

  return (
    <Stage
      width="full"
      caption={t.caption}
      secondaryLabel={t.inputLabel}
      announcement={settled ? t.announce(shortest(x), gap ? readable(gap) : "—") : ""}
      viewport={
        <div className="space-y-4">
          <dl className="grid gap-px overflow-hidden rounded border border-line/10 bg-line/10 sm:grid-cols-3">
            {[
              [t.value, shortest(x)],
              [t.next, finite ? shortest(nextUp(x)) : "—"],
              [t.plusOne, finite ? shortest(plusOne) : "—"],
            ].map(([label, shown], i) => (
              <div key={label} className="bg-ink-950 px-4 py-3">
                <dt className="text-overline uppercase text-fg-faint">{label}</dt>
                <dd
                  className={cn(
                    "mt-1 break-all font-mono text-body",
                    i === 2 && lost ? "text-signal-amber" : "text-fg",
                  )}
                >
                  {shown}
                </dd>
                {i === 2 && finite && (
                  <dd
                    className={cn(
                      "mt-0.5 text-caption",
                      lost ? "text-signal-amber" : "text-fg-faint",
                    )}
                  >
                    {lost ? t.lost : t.kept}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={t.chartLabel(gap ? readable(gap) : "—")}
            className="w-full rounded border border-line/10 bg-ink-950"
          >
            {/* gap = 1 and gap = 2: where whole numbers start to go missing */}
            <line
              x1={L}
              y1={py(1)}
              x2={W - R}
              y2={py(1)}
              strokeDasharray="3 4"
              strokeWidth={1}
              className="stroke-signal-amber/60"
            />
            <line
              x1={px(24)}
              y1={T}
              x2={px(24)}
              y2={H - B}
              strokeDasharray="3 4"
              strokeWidth={1}
              className="stroke-signal-amber/60"
            />
            <text x={px(24) + 6} y={T + 12} className="fill-signal-amber font-mono text-[11px]">
              2²⁴
            </text>
            <path d={stairs} fill="none" strokeWidth={1.8} className="stroke-accent" />
            {onChart && here !== null && (
              <g>
                <line
                  x1={px(here)}
                  y1={T}
                  x2={px(here)}
                  y2={H - B}
                  strokeWidth={1}
                  className="stroke-data/50"
                />
                <circle cx={px(here)} cy={py(Math.floor(here) - 23)} r={5} className="fill-data" />
              </g>
            )}
            <line
              x1={L}
              y1={H - B}
              x2={W - R}
              y2={H - B}
              strokeWidth={1}
              className="stroke-line/30"
            />
            <line x1={L} y1={T} x2={L} y2={H - B} strokeWidth={1} className="stroke-line/30" />
            {[-10, 0, 10, 20, 30, 40].map((k) => (
              <text
                key={k}
                x={px(k)}
                y={H - B + 16}
                textAnchor="middle"
                className="fill-fg-faint font-mono text-[10px]"
              >
                {powerOfTwo(k)}
              </text>
            ))}
            {[-30, -20, -10, 0, 10].map((k) => (
              <text
                key={k}
                x={L - 6}
                y={py(k) + 3}
                textAnchor="end"
                className="fill-fg-faint font-mono text-[10px]"
              >
                {powerOfTwo(k)}
              </text>
            ))}
            <text x={W - R} y={H - 4} textAnchor="end" className="fill-fg-muted text-[11px]">
              {t.axes.size} →
            </text>
            <text x={L + 4} y={T + 10} className="fill-fg-muted text-[11px]">
              ↑ {t.axes.gap}
            </text>
          </svg>
          <p className="text-caption text-fg-muted">{t.wholeNumbers}</p>
        </div>
      }
      primary={
        <LabSlider
          label={t.slider}
          value={power}
          min={MIN_POWER}
          max={MAX_POWER}
          step={0.05}
          onChange={(p) => {
            setText("");
            setPower(p);
          }}
          format={(p) => shortest(atPower(p))}
          valueText={(p) => t.sliderValue(p.toFixed(1))}
        />
      }
      secondary={
        <FloatField
          value={text}
          onChange={setText}
          label={t.inputLabel}
          placeholder="16777216"
          error={text.trim() !== "" && !typed ? lab.invalid : null}
          compact
        />
      }
      figures={
        <>
          <Figure label={t.figures.gap} value={gap ? readable(gap) : "—"} tone="accent" />
          <Figure
            label={t.figures.relative}
            value={rel ? readable(rel) : "—"}
            hint={t.figures.relativeHint}
          />
          <Figure
            label={t.figures.plusOne}
            value={finite ? (lost ? t.figures.lost : t.figures.kept) : "—"}
          />
        </>
      }
    />
  );
}
