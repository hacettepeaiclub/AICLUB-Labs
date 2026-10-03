import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabs } from "@/i18n/labs";
import { at, correlate, terms, withCell } from "../engine";
import { LETTER_T, PREWITT } from "../pictures";
import { factor, formatValue } from "../view";
import { GridView } from "./GridView";
import { Panel } from "./Panel";

const SIDE = LETTER_T.width - PREWITT.width + 1;
const CELLS = SIDE * SIDE;

/**
 * Section 1: a window slides, and every stop is nine multiplications.
 *
 * Nothing is named first. The visitor presses one button, the window moves
 * one cell, and one more output appears with the sum that made it written
 * out in full. The output fills in as the window visits it, so the picture
 * on the right is visibly *made of* those sums rather than handed over.
 *
 * Pixels are 0 or 1 and the weights are −1, 0 and 1, so every product and
 * every total on screen is exact. Clicking a pixel flips it, and every cell
 * already computed is recomputed at once — the same nine weights, applied
 * again.
 */
export function SlideStage() {
  const t = useLabs().convolution.slide;
  const [image, setImage] = useState(LETTER_T);
  const [position, setPosition] = useState(0);
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([0]));

  const output = useMemo(() => correlate(image, PREWITT), [image]);
  const j = position % SIDE;
  const i = Math.floor(position / SIDE);
  const parts = terms(image, PREWITT, j, i);
  const value = at(output, j, i);

  const visit = (p: number) => setVisited((v) => (v.has(p) ? v : new Set(v).add(p)));
  const go = (next: number) => {
    setPosition(next);
    visit(next);
  };
  // Functional, so two presses inside one frame still move two cells.
  const step = () =>
    setPosition((p) => {
      const next = (p + 1) % CELLS;
      visit(next);
      return next;
    });

  const all = visited.size === CELLS;

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={t.announce(j + 1, i + 1, formatValue(value))}
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
          {/* On a phone the kernel drops under the pair it connects, at a size
              where its numbers can still be read. */}
          <div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-[minmax(0,9fr)_minmax(0,3fr)_minmax(0,7fr)] sm:gap-5">
            <Panel label={t.input}>
              <GridView
                grid={image}
                kind="image"
                window={{ x: j, y: i, w: 3, h: 3 }}
                onCell={(x, y) => setImage((g) => withCell(g, x, y, at(g, x, y) ? 0 : 1))}
                ariaLabel={t.inputLabel}
              />
            </Panel>
            <div className="order-last col-span-2 mx-auto w-28 sm:order-none sm:col-span-1 sm:w-auto">
              <Panel label={t.kernel}>
                <GridView grid={PREWITT} kind="signed" showValues ariaLabel={t.kernelLabel} />
              </Panel>
            </div>
            <Panel label={t.output}>
              <GridView
                grid={output}
                kind="signed"
                scale={3}
                showValues
                hidden={(x, y) => !visited.has(y * SIDE + x)}
                selected={{ x: j, y: i }}
                onCell={(x, y) => go(y * SIDE + x)}
                onArrow={(dx, dy) => {
                  const x = Math.min(Math.max(j + dx, 0), SIDE - 1);
                  const y = Math.min(Math.max(i + dy, 0), SIDE - 1);
                  go(y * SIDE + x);
                }}
                ariaLabel={t.outputLabel(visited.size, CELLS)}
              />
            </Panel>
          </div>

          <div className="border-t border-line/10 pt-3">
            <p className="text-overline uppercase text-fg-faint">{t.arithmetic}</p>
            <p className="mt-2 font-mono text-caption leading-relaxed text-fg-muted sm:text-body-sm">
              {parts.map((term, k) => (
                <span key={k} className={term.weight === 0 ? "text-fg-faint" : undefined}>
                  {k > 0 && " + "}
                  {factor(term.weight)}·{term.pixel}
                </span>
              ))}
              <span className="text-fg">
                {" = "}
                <span className="text-accent">{formatValue(value)}</span>
              </span>
            </p>
          </div>
        </div>
      }
      primary={
        <div className="flex gap-2">
          <Button onClick={step} className="min-h-[44px] flex-1">
            {t.step}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (all) {
                setVisited(new Set([0]));
                setPosition(0);
                setImage(LETTER_T);
              } else {
                setVisited(new Set(Array.from({ length: CELLS }, (_, k) => k)));
              }
            }}
            className="min-h-[44px]"
          >
            {all ? t.reset : t.fillRest}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure label={t.figures.cell} value={formatValue(value)} tone="accent" />
          <Figure label={t.figures.computed} value={`${visited.size} / ${CELLS}`} />
          <Figure label={t.figures.weights} value="9" hint={t.figures.weightsHint} />
        </>
      }
    />
  );
}
