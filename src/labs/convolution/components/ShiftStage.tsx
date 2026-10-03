import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLanguage } from "@/i18n";
import { useLabs } from "@/i18n/labs";
import { argmax, correlate, grid, stamp, weightCounts } from "../engine";
import { DISTRACTORS, PLUS, PLUS_DETECTOR } from "../pictures";
import { formatValue, grouped } from "../view";
import { GridView } from "./GridView";
import { Panel } from "./Panel";

const FIELD = 16;
const MAX = FIELD - PLUS.width;

/** The decoys sit where they are; only the plus moves. */
const BACKGROUND = [
  [DISTRACTORS.x, 1, 1],
  [DISTRACTORS.block, 12, 1],
  [DISTRACTORS.bar, 1, 13],
] as const;

const field = (px: number, py: number) => {
  let g = grid(FIELD, FIELD);
  for (const [shape, x, y] of BACKGROUND) g = stamp(g, shape, x, y);
  return stamp(g, PLUS, px, py);
};

const COUNTS = weightCounts(FIELD, PLUS_DETECTOR.width, 2);

/**
 * Section 3: one detector, every position.
 *
 * The kernel here is the shape it looks for — +1 on the plus, −1 around it —
 * so a window holding exactly the plus scores 9, the most any window can,
 * and the decoys score less. Moving the plus moves the peak by the same
 * amount, cell for cell, because the same 25 weights are applied at every
 * position: that is the whole reason convolution suits images, where the
 * thing worth finding can be anywhere.
 *
 * The figure beside it is the price of not sharing: a fully connected layer
 * producing the same 16×16 map needs a weight for every pair of input pixel
 * and output cell.
 */
export function ShiftStage() {
  const t = useLabs().convolution.shift;
  const { language } = useLanguage();
  const [pos, setPos] = useState({ x: 6, y: 6 });
  const input = useMemo(() => field(pos.x, pos.y), [pos]);
  const output = useMemo(() => correlate(input, PLUS_DETECTOR, { padding: 2 }), [input]);
  const peak = argmax(output);

  const move = (dx: number, dy: number) =>
    setPos((p) => ({
      x: Math.min(Math.max(p.x + dx, 0), MAX),
      y: Math.min(Math.max(p.y + dy, 0), MAX),
    }));
  const place = (x: number, y: number) =>
    setPos({ x: Math.min(Math.max(x - 2, 0), MAX), y: Math.min(Math.max(y - 2, 0), MAX) });

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(peak.x + 1, peak.y + 1, formatValue(peak.value))}
      viewport={
        <div className="space-y-3 rounded border border-line/10 bg-ink-950 p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] sm:items-start sm:gap-4">
            <Panel label={t.input}>
              <GridView
                grid={input}
                kind="image"
                window={{ x: pos.x, y: pos.y, w: 5, h: 5 }}
                onCell={place}
                onArrow={move}
                ariaLabel={t.inputLabel(pos.x + 3, pos.y + 3)}
              />
            </Panel>
            <div className="order-last col-span-2 mx-auto w-20 sm:order-none sm:col-span-1 sm:w-full">
              <Panel label={t.detector}>
                <GridView grid={PLUS_DETECTOR} kind="signed" ariaLabel={t.detectorLabel} />
              </Panel>
            </div>
            <Panel label={t.output} note={t.outputNote}>
              <GridView
                grid={output}
                kind="match"
                scale={9}
                selected={{ x: peak.x, y: peak.y }}
                ariaLabel={t.outputLabel(peak.x + 1, peak.y + 1, formatValue(peak.value))}
              />
            </Panel>
          </div>
          <p className="text-caption text-fg-faint">{t.keyboardHint}</p>
        </div>
      }
      primary={
        <div role="group" aria-label={t.moveLabel} className="grid grid-cols-4 gap-2">
          {(
            [
              ["left", -1, 0, "←"],
              ["up", 0, -1, "↑"],
              ["down", 0, 1, "↓"],
              ["right", 1, 0, "→"],
            ] as const
          ).map(([name, dx, dy, arrow]) => (
            <Button
              key={name}
              variant="secondary"
              aria-label={t.move[name]}
              onClick={() => move(dx, dy)}
              className="min-h-[44px] text-body"
            >
              <span aria-hidden>{arrow}</span>
            </Button>
          ))}
        </div>
      }
      figures={
        <>
          <Figure
            label={t.figures.peak}
            value={formatValue(peak.value)}
            hint={t.figures.peakAt(peak.x + 1, peak.y + 1)}
            tone="accent"
          />
          <Figure
            label={t.figures.weights}
            value={String(COUNTS.convolution)}
            hint={t.figures.weightsHint}
          />
          <Figure
            label={t.figures.dense}
            value={grouped(COUNTS.dense, language)}
            hint={t.figures.denseHint}
          />
        </>
      }
    />
  );
}
