import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabs } from "@/i18n/labs";
import {
  add,
  addFloats,
  compare,
  decode,
  decodeFinite,
  exactDecimal,
  type Float,
  floatsEqual,
  FORMATS,
  gapAbove,
  isFinite,
  item,
  nextDown,
  nextUp,
  parseNumber,
  type Rational,
  round,
  shortest,
  stepsBetween,
  sub,
} from "../engine";
import { readable } from "../view";
import { ExactDigits } from "./ExactDigits";
import { FloatField } from "./FloatField";
import { Guess } from "./Guess";

type Choice = "exact" | "above" | "below";

/** Neighbours drawn on the line, at most this many steps apart. */
const MAX_DRAWN_STEPS = 4;

/** Where `v` falls between `lo` and `hi`, as a fraction, exactly then rounded once. */
function position(v: Rational, lo: Rational, hi: Rational): number {
  const span = sub(hi, lo);
  const at = sub(v, lo);
  // (at / span) × 10^6, as an integer, then one division by 10^6.
  return Number((at.num * span.den * 1_000_000n) / (at.den * span.num)) / 1_000_000;
}

/**
 * Section 2: two stored numbers, added — first guessed, then shown in full.
 *
 * ## What the ledger shows
 *
 * Each input as it was stored, their exact sum, that sum rounded to float64,
 * and the true answer stored directly. The last two are what `a + b === c`
 * compares, so the gap between them is the whole lesson. All five are exact
 * decimals from the engine; the figure for a + b is also checked against the
 * browser's own `+` in the tests.
 *
 * ## The line
 *
 * When the two results are at most a few steps apart, every float64 between
 * them is drawn to scale, with the exact sum and the true answer marked where
 * they really fall. Rounding is then something you can see: each mark goes to
 * its nearest tick.
 */
export function SumStage() {
  const lab = useLabs()["floating-point"];
  const t = lab.sum;
  const [guess, setGuess] = useState<Choice | null>(null);
  const [a, setA] = useState("0.1");
  const [b, setB] = useState("0.2");

  const view = useMemo(() => {
    const pa = parseNumber(a);
    const pb = parseNumber(b);
    if (!pa || !pb || pa.kind !== "finite" || pb.kind !== "finite") return null;
    const A = round(pa, FORMATS.float64);
    const B = round(pb, FORMATS.float64);
    const S = addFloats(A, B);
    const T = round(add(pa.value, pb.value), FORMATS.float64);
    const dA = decode(A);
    const dB = decode(B);
    if (!dA || !dB || !isFinite(S) || !isFinite(T)) return null;
    const exactSum = add(dA, dB);
    const truth = add(pa.value, pb.value);
    const steps = stepsBetween(S, T);
    const lowest = compare(decodeFinite(S), decodeFinite(T)) <= 0 ? S : T;
    const highest = lowest === S ? T : S;

    // The line: one neighbour either side of the two results.
    let ticks: Float[] | null = null;
    if (steps <= BigInt(MAX_DRAWN_STEPS)) {
      ticks = [nextDown(lowest)];
      let cursor = lowest;
      ticks.push(cursor);
      while (compare(decodeFinite(cursor), decodeFinite(highest)) < 0) {
        cursor = nextUp(cursor);
        ticks.push(cursor);
      }
      ticks.push(nextUp(highest));
    }

    // A tie: the exact sum sits exactly halfway between the float64 at or
    // below it and the one above.
    const nearest = round(exactSum, FORMATS.float64);
    const floor = compare(decodeFinite(nearest), exactSum) <= 0 ? nearest : nextDown(nearest);
    const gap = gapAbove(floor);
    const half = gap ? { num: gap.num, den: gap.den * 2n } : null;
    const tie = half !== null && compare(sub(exactSum, decodeFinite(floor)), half) === 0;

    return { A, B, S, T, dA, dB, exactSum, truth, steps, ticks, tie, step: gapAbove(lowest) };
  }, [a, b]);

  const reset = () => {
    setA("0.1");
    setB("0.2");
  };

  const options = [
    { value: "exact" as const, label: t.options.exact },
    { value: "above" as const, label: t.options.above },
    { value: "below" as const, label: t.options.below },
  ];

  const equal = view ? floatsEqual(view.S, view.T) : false;
  const steps = view ? view.steps.toString() : "0";

  return (
    <div className="space-y-6">
      <Guess
        question={t.question}
        options={options}
        chosen={guess}
        onChoose={setGuess}
        answer={t.answer}
        copy={{
          yours: t.yours,
          actual: t.actual,
          agreed: t.agreed,
          disagreed: t.disagreed,
          correct: "above",
        }}
      />

      {guess !== null && (
        <Stage
          width="full"
          controls="stack"
          caption={t.caption}
          announcement={view ? t.announce(shortest(view.S), equal) : ""}
          viewport={
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <FloatField
                  value={a}
                  onChange={setA}
                  label={t.aLabel}
                  error={parseNumber(a)?.kind === "finite" ? null : lab.invalid}
                  compact
                />
                <FloatField
                  value={b}
                  onChange={setB}
                  label={t.bLabel}
                  error={parseNumber(b)?.kind === "finite" ? null : lab.invalid}
                  compact
                />
              </div>

              {view && (
                <>
                  <dl className="divide-y divide-line/5 rounded border border-line/10 bg-ink-950">
                    {(
                      [
                        [t.rows.a, view.dA, null],
                        [t.rows.b, view.dB, null],
                        [t.rows.exact, view.exactSum, null],
                        [t.rows.sum, decodeFinite(view.S), t.printsAs(shortest(view.S))],
                        [t.rows.target, decodeFinite(view.T), t.printsAs(shortest(view.T))],
                      ] as const
                    ).map(([label, value, note], i) => (
                      <div
                        key={label}
                        className="grid gap-1 px-4 py-3 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-4"
                      >
                        <dt
                          className={
                            i >= 3
                              ? "text-caption font-medium text-fg"
                              : "text-caption text-fg-muted"
                          }
                        >
                          {label}
                        </dt>
                        <dd className="min-w-0">
                          <ExactDigits
                            text={exactDecimal(value) ?? ""}
                            from={null}
                            showAll={lab.showAll}
                            showLess={lab.showLess}
                          />
                          {note && <p className="mt-1 text-caption text-fg-faint">{note}</p>}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {view.ticks && <NumberLine view={view} ticks={view.ticks} steps={steps} />}

                  <p
                    className={
                      equal
                        ? "rounded border border-signal-green/30 bg-signal-green/10 px-4 py-3 text-body-sm text-signal-green"
                        : "rounded border border-signal-amber/30 bg-signal-amber/10 px-4 py-3 text-body-sm text-signal-amber"
                    }
                  >
                    {equal ? t.same : t.apart(t.steps(steps))}
                    {view.tie && <span className="mt-1 block text-fg-muted">{t.tie}</span>}
                  </p>
                </>
              )}
            </div>
          }
          primary={
            <Button onClick={reset} variant="secondary" className="min-h-[44px] w-full">
              {t.reset}
            </Button>
          }
          figures={
            <>
              <Figure label={t.figures.sum} value={view ? shortest(view.S) : "—"} tone="accent" />
              <Figure
                label={t.figures.equals}
                value={view ? (equal ? t.figures.yes : t.figures.no) : "—"}
              />
              <Figure label={t.figures.apart} value={view ? t.figures.stepUnit(steps) : "—"} />
              <Figure label={t.figures.stepSize} value={view?.step ? readable(view.step) : "—"} />
            </>
          }
        />
      )}
    </div>
  );
}

/**
 * The neighbouring float64 values, to scale, with where the exact sum and the
 * true answer really fall. Ticks are drawn from the engine's own neighbours,
 * so the spacing is the true spacing at that size.
 */
function NumberLine({
  view,
  ticks,
  steps,
}: {
  view: { S: Float; T: Float; exactSum: Rational; truth: Rational };
  ticks: Float[];
  steps: string;
}) {
  const t = useLabs()["floating-point"].sum;
  const lo = decodeFinite(item(ticks, 0));
  const hi = decodeFinite(item(ticks, ticks.length - 1));
  const W = 640;
  const PAD = 28;
  const x = (v: Rational) => PAD + position(v, lo, hi) * (W - 2 * PAD);
  const same = floatsEqual(view.S, view.T);

  return (
    <svg
      viewBox={`0 0 ${W} 132`}
      role="img"
      aria-label={t.lineLabel(same ? t.same : t.apart(t.steps(steps)))}
      className="w-full rounded border border-line/10 bg-ink-950"
    >
      <line
        x1={PAD / 2}
        y1={66}
        x2={W - PAD / 2}
        y2={66}
        strokeWidth={1}
        className="stroke-line/30"
      />
      {ticks.map((tick, i) => {
        const v = decodeFinite(tick);
        const isSum = floatsEqual(tick, view.S);
        const isTarget = floatsEqual(tick, view.T);
        return (
          <g key={i}>
            <line
              x1={x(v)}
              y1={isSum || isTarget ? 50 : 58}
              x2={x(v)}
              y2={74}
              strokeWidth={isSum || isTarget ? 2.5 : 1.5}
              className={isSum ? "stroke-data" : isTarget ? "stroke-accent" : "stroke-fg-faint"}
            />
            {isSum && (
              <text x={x(v)} y={42} textAnchor="middle" className="fill-data font-mono text-[11px]">
                {t.marks.sum}
              </text>
            )}
            {isTarget && !isSum && (
              <text
                x={x(v)}
                y={94}
                textAnchor="middle"
                className="fill-accent font-mono text-[11px]"
              >
                {t.marks.target}
              </text>
            )}
          </g>
        );
      })}
      {/* Where the two exact values really are: a triangle above, a dot below. */}
      <path
        d={`M ${x(view.exactSum) - 5} 18 L ${x(view.exactSum) + 5} 18 L ${x(view.exactSum)} 26 Z`}
        className="fill-fg-muted"
      />
      <text
        x={x(view.exactSum)}
        y={12}
        textAnchor="middle"
        className="fill-fg-muted font-mono text-[11px]"
      >
        {t.marks.exact}
      </text>
      <circle
        cx={x(view.truth)}
        cy={108}
        r={4}
        className="fill-none stroke-fg-muted"
        strokeWidth={1.5}
      />
      <text
        x={x(view.truth)}
        y={126}
        textAnchor="middle"
        className="fill-fg-muted font-mono text-[11px]"
      >
        {t.marks.truth}
      </text>
    </svg>
  );
}
