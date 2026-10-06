import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useCanvas2D, useRepaintFlag } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { formatPercent } from "@/lib/format";
import { generateDataset, type Point } from "../datasets";
import { bestOneLine, side, type Line } from "../lines";
import { createScalarFieldPainter, drawAxes, drawJudgedPoints } from "../paint";
import { LineOverlay } from "./LineOverlay";

type Mode = "one" | "two";

const FIRST: Line = { w1: 1.2, w2: 0.4, b: 0 };
const SECOND: Line = { w1: -0.4, w2: 1.2, b: 0.2 };

/**
 * What the hand-made network says about one point.
 *
 * One line: the side its arrow points to. Two lines: yes only where both
 * arrows point — the output neuron is step(h₁ + h₂ − 1.5), a single
 * threshold. Which of the two answers means which class is the output
 * weight's sign, the one number the visitor does not hold, so it is taken
 * whichever way gets more points right; `flip` says which way that was.
 */
function judge(points: readonly Point[], lines: readonly Line[], mode: Mode) {
  const yes = (p: { x: number; y: number }) =>
    mode === "one"
      ? side(lines[0] ?? FIRST, p) > 0
      : side(lines[0] ?? FIRST, p) > 0 && side(lines[1] ?? SECOND, p) > 0;
  let agree = 0;
  for (const p of points) if (yes(p) === (p.label === 1)) agree++;
  const flip = agree < points.length - agree;
  const say = (p: { x: number; y: number }) => (yes(p) !== flip ? 1 : -1);
  return { say, accuracy: Math.max(agree, points.length - agree) / points.length };
}

/**
 * Section 3, before the race: try XOR yourself.
 *
 * The four corners that stopped a single neuron in 1969, and a line to
 * separate them with. The visitor drags it about and watches the score
 * climb to about three quarters and no further; beside it, the best any
 * line at all can do on these points, found by search, so the ceiling is a
 * fact rather than a hunch. Then a second line, and an output neuron that
 * combines the two — a hidden layer of two, placed by hand — and the score
 * goes past anything one line could reach.
 *
 * The race below is the same thing done by gradient descent, with four.
 */
export function HandXorStage() {
  const lab = useLabs()["multilayer-perceptrons"];
  const t = lab.handXor;
  const points = useMemo(() => generateDataset("xor", 160, 0.06, 3), []);
  const ceiling = useMemo(() => bestOneLine(points), [points]);
  const [mode, setMode] = useState<Mode>("one");
  const [lines, setLines] = useState<Line[]>([FIRST, SECOND]);
  const [active, setActive] = useState(0);
  const [best, setBest] = useState(0);

  const shown = mode === "one" ? lines.slice(0, 1) : lines;
  const verdict = judge(points, lines, mode);
  const atCeiling = mode === "one" && verdict.accuracy >= ceiling - 0.005;
  const beaten = mode === "two" && verdict.accuracy > ceiling + 0.02;

  useEffect(() => {
    if (mode === "one") setBest((b) => Math.max(b, verdict.accuracy));
  }, [mode, verdict.accuracy]);

  const judgeRef = useRef(verdict);
  judgeRef.current = verdict;
  const painter = useRef<ReturnType<typeof createScalarFieldPainter> | null>(null);
  const { markDirty, version } = useRepaintFlag();
  useEffect(markDirty, [lines, mode, markDirty]);

  const canvasRef = useCanvas2D(
    useCallback(
      ({ ctx, width, height }) => {
        painter.current ??= createScalarFieldPainter(80);
        const { say } = judgeRef.current;
        painter.current.draw(ctx, width, height, (x, y) => say({ x, y }) * 0.55);
        drawAxes(ctx, width, height);
        drawJudgedPoints(ctx, points, (p) => say(p) !== p.label, width, height, 3.5);
      },
      [points],
    ),
    false,
    version,
  );

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(formatPercent(verdict.accuracy, 0))}
      viewport={
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={t.canvasLabel(shown.length, formatPercent(verdict.accuracy, 0))}
            className="absolute inset-0 h-full w-full rounded border border-line/10 bg-ink-950"
          />
          <LineOverlay
            lines={shown}
            active={Math.min(active, shown.length - 1)}
            onActivate={setActive}
            onChange={(i, next) => setLines((ls) => ls.map((l, j) => (j === i ? next : l)))}
            labels={{ slide: t.slideHandle, turn: t.turnHandle }}
          />
        </div>
      }
      primary={
        <div className="space-y-3">
          <Segmented
            label={t.modeLabel}
            value={mode}
            options={[
              { value: "one", label: t.modes.one },
              { value: "two", label: t.modes.two },
            ]}
            onChange={(m) => {
              setMode(m);
              setActive(m === "two" ? 1 : 0);
            }}
          />
          <p
            className={
              atCeiling || beaten ? "text-body-sm text-signal-green" : "text-body-sm text-fg-muted"
            }
          >
            {mode === "one"
              ? atCeiling
                ? t.ceilingReached(formatPercent(ceiling, 0))
                : t.oneHint
              : beaten
                ? t.twoBeaten(formatPercent(ceiling, 0))
                : t.twoHint}
          </p>
        </div>
      }
      figures={
        <>
          <Figure label={t.figures.accuracy} value={formatPercent(verdict.accuracy, 0)} tone="accent" />
          <Figure label={t.figures.best} value={best ? formatPercent(best, 0) : "—"} hint={t.figures.bestHint} />
          <Figure label={t.figures.ceiling} value={formatPercent(ceiling, 0)} hint={t.figures.ceilingHint} />
        </>
      }
    />
  );
}
