import { useMemo, useState, type MouseEvent } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useDebouncedValue } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import {
  absR,
  allNonNegative,
  bias,
  classify,
  compare,
  decode,
  gapAbove,
  item,
  pow2,
  type Rational,
  shortest,
  sub,
  toBits,
  toyFormat,
} from "../engine";
import { readable } from "../view";

const W = 640;
const H = 150;
const PAD = 24;
const AXIS = 92;

/** v / max as a number in [0, 1], computed exactly and rounded once. */
const ratio = (v: Rational, max: Rational): number =>
  Number((v.num * max.den * 100_000n) / (v.den * max.num)) / 100_000;

/**
 * Section 4: every value a small float can hold, on one line.
 *
 * ## Why a toy format
 *
 * float32 has about two billion finite non-negative values; there is no line
 * they fit on. A format with two to four exponent bits and one to four
 * fraction bits is the same design — same bias, same hidden bit, same
 * subnormals — with few enough values to draw every one. Nothing is
 * approximated: each tick is `decode` of one bit pattern.
 *
 * The axis is linear on purpose. On a logarithmic one the ticks would look
 * evenly spaced and the lesson would disappear into the scale.
 */
export function RulerStage() {
  const lab = useLabs()["floating-point"];
  const t = lab.ruler;
  const [exponentBits, setExponentBits] = useState(3);
  const [fractionBits, setFractionBits] = useState(3);
  const [pick, setPick] = useState(24);

  const model = useMemo(() => {
    const format = toyFormat(exponentBits, fractionBits);
    const floats = allNonNegative(format);
    const values = floats.map((f) => decode(f) as Rational);
    const max = values[values.length - 1] as Rational;
    const b = bias(format);
    // Powers of two to label, chosen from the largest down: on a linear axis
    // the small ones crowd together near zero, and it is they that should
    // give way, not 1 and 2.
    let top = 1 - b;
    while (compare(pow2(top + 1), max) <= 0) top++;
    const powers: { k: number; at: number; label: string }[] = [];
    let lastAt = Infinity;
    for (let k = top; k >= 1 - b; k--) {
      const p = pow2(k);
      const at = PAD + ratio(p, max) * (W - 2 * PAD);
      if (lastAt - at >= 26) {
        powers.push({ k, at, label: readable(p) });
        lastAt = at;
      }
    }
    return { format, floats, values, max, powers };
  }, [exponentBits, fractionBits]);

  const index = Math.min(pick, model.floats.length - 1);
  const picked = item(model.floats, index);
  const pickedValue = item(model.values, index);
  const gap = gapAbove(picked);
  const isTop = index === model.floats.length - 1;
  const settled = useDebouncedValue(`${shortest(picked)}|${gap ? readable(gap) : "-"}`);

  /** Keep the pick at about the same value when the format changes. */
  const reformat = (e: number, f: number) => {
    const format = toyFormat(e, f);
    const values = allNonNegative(format).map((x) => decode(x) as Rational);
    const distance = (v: Rational) => absR(sub(v, pickedValue));
    let best = 0;
    for (let i = 1; i < values.length; i++) {
      if (compare(distance(item(values, i)), distance(item(values, best))) < 0) best = i;
    }
    setExponentBits(e);
    setFractionBits(f);
    setPick(best);
  };

  const x = (v: Rational) => PAD + ratio(v, model.max) * (W - 2 * PAD);

  const onClick = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const at = ((event.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    model.values.forEach((v, i) => {
      const d = Math.abs(x(v) - at);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setPick(best);
  };

  const bits = toBits(picked);
  const pattern = `${bits[0]} ${bits.slice(1, 1 + exponentBits).join("")} ${bits.slice(1 + exponentBits).join("")}`;
  const px = x(pickedValue);

  return (
    <Stage
      width="full"
      caption={t.caption}
      secondaryLabel={t.controlsLabel}
      announcement={
        settled ? t.announce(shortest(picked), gap ? readable(gap) : t.figures.top) : ""
      }
      viewport={
        <div className="space-y-3">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={t.lineLabel(
              model.values.length,
              shortest(item(model.floats, model.floats.length - 1)),
              2 ** fractionBits,
            )}
            onClick={onClick}
            className="w-full cursor-pointer rounded border border-line/10 bg-ink-950"
          >
            <line
              x1={PAD / 2}
              y1={AXIS}
              x2={W - PAD / 2}
              y2={AXIS}
              strokeWidth={1}
              className="stroke-line/30"
            />
            {model.floats.map((f, i) => {
              const subnormal = classify(f) !== "normal";
              const at = x(item(model.values, i));
              return (
                <line
                  key={i}
                  x1={at}
                  y1={AXIS - (subnormal ? 9 : 14)}
                  x2={at}
                  y2={AXIS}
                  strokeWidth={1.2}
                  className={subnormal ? "stroke-fg-faint" : "stroke-accent"}
                />
              );
            })}
            {model.powers.map((p) => (
              <g key={p.k}>
                <line
                  x1={p.at}
                  y1={AXIS}
                  x2={p.at}
                  y2={AXIS + 6}
                  strokeWidth={1}
                  className="stroke-fg-muted"
                />
                <text
                  x={p.at}
                  y={AXIS + 20}
                  textAnchor="middle"
                  className="fill-fg-muted font-mono text-[11px]"
                >
                  {p.label}
                </text>
              </g>
            ))}
            {/* the picked value: a taller live tick, its value and its bits */}
            <line
              x1={px}
              y1={AXIS - 34}
              x2={px}
              y2={AXIS + 2}
              strokeWidth={2.5}
              className="stroke-data"
            />
            <text
              x={Math.min(Math.max(px, 70), W - 70)}
              y={AXIS - 56}
              textAnchor="middle"
              className="fill-data font-mono text-[13px]"
            >
              {shortest(picked)}
            </text>
            <text
              x={Math.min(Math.max(px, 70), W - 70)}
              y={AXIS - 40}
              textAnchor="middle"
              className="fill-fg-muted font-mono text-[11px]"
            >
              {pattern}
            </text>
          </svg>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-caption text-fg-muted">
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-3 w-0.5 bg-accent" />
              {t.legend.normal}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-2 w-0.5 bg-fg-faint" />
              {t.legend.subnormal}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-3.5 w-1 bg-data" />
              {t.legend.picked}
            </li>
          </ul>
        </div>
      }
      primary={
        <LabSlider
          label={t.pick}
          value={index}
          min={0}
          max={model.floats.length - 1}
          step={1}
          onChange={setPick}
          format={(i) => shortest(model.floats[i] ?? picked)}
          valueText={(i) =>
            t.pickValue(shortest(model.floats[i] ?? picked), i + 1, model.floats.length)
          }
        />
      }
      secondary={
        <>
          <LabSlider
            label={t.exponentBits}
            value={exponentBits}
            min={2}
            max={4}
            step={1}
            onChange={(e) => reformat(e, fractionBits)}
          />
          <LabSlider
            label={t.fractionBits}
            value={fractionBits}
            min={1}
            max={4}
            step={1}
            onChange={(f) => reformat(exponentBits, f)}
          />
        </>
      }
      figures={
        <>
          <Figure label={t.figures.values} value={String(model.values.length)} />
          <Figure
            label={t.figures.largest}
            value={shortest(item(model.floats, model.floats.length - 1))}
          />
          <Figure
            label={t.figures.gap}
            value={isTop || !gap ? "—" : readable(gap)}
            hint={isTop ? t.figures.top : undefined}
            tone="accent"
          />
          <Figure label={t.figures.perDoubling} value={String(2 ** fractionBits)} />
        </>
      }
    />
  );
}
