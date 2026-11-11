import { useCallback, useMemo, useRef, useState } from "react";
import { Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useRafLoop } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import { createRng } from "@/lib/random";
import {
  blockAt,
  createJepa,
  fitPixelGuesser,
  GRID,
  guessPixels,
  guesses,
  kindNear,
  patchOf,
  pictures,
  trainStep,
  vectorsOf,
  type Jepa,
} from "../engine";
import { MAX_STEPS, REFERENCE } from "../useJepaTrainer";
import { kindColor } from "../view";
import { PatchView, PictureView } from "./PictureView";

const FRAME_BUDGET_MS = 8;

/**
 * Section 4: the same hidden patches, guessed two ways. A pixel predictor —
 * the best straight line from the neighbours' pixels — and the JEPA, which
 * names a kind. The JEPA here trains itself first, from the start the lab
 * opens on, so this section works whether or not section 2 was run.
 */
export function PixelsStage() {
  const t = useLabCopy("jepa");
  const copy = t.pixels;
  const [seed, setSeed] = useState(7);
  // Inside one region at first, so every guess has neighbours that agree;
  // moving the block onto a border shows the other case.
  const [block, setBlock] = useState({ x: 2, y: 1 });
  const picture = useMemo(() => pictures(seed, 1)[0]!, [seed]);
  const hidden = blockAt(block.x, block.y);
  const guesser = useMemo(() => fitPixelGuesser(5), []);

  const modelRef = useRef<Jepa | null>(null);
  modelRef.current ??= createJepa(1);
  const rngRef = useRef(createRng(77));
  const [steps, setSteps] = useState(0);
  const ready = steps >= MAX_STEPS;

  useRafLoop(
    useCallback(() => {
      const model = modelRef.current;
      if (!model) return;
      const start = performance.now();
      while (model.steps < MAX_STEPS && performance.now() - start < FRAME_BUDGET_MS) {
        trainStep(model, rngRef.current, { slowCopy: true });
      }
      setSteps(model.steps);
    }, []),
    !ready,
  );

  const reference = useMemo(
    () => (ready && modelRef.current ? vectorsOf(modelRef.current.target, REFERENCE) : null),
    [ready],
  );
  const kindGuesses =
    reference && modelRef.current ? guesses(modelRef.current, picture, hidden) : [];

  const moveBlock = (index: number) =>
    setBlock({
      x: Math.min(GRID - 2, index % GRID),
      y: Math.min(GRID - 2, Math.floor(index / GRID)),
    });

  return (
    <Stage
      width="wide"
      caption={copy.caption}
      viewport={
        <div className="grid grid-cols-1 items-start gap-4 rounded-lg border border-line/20 bg-ink-900 p-4 sm:grid-cols-2">
          <PictureView
            picture={picture}
            hidden={hidden}
            onPick={moveBlock}
            patchLabel={t.picture.patchLabel}
            label={copy.pictureLabel}
          />
          <table className="w-full text-caption">
            <thead>
              <tr className="text-fg-muted">
                <th scope="col" className="pb-2 text-left font-normal">
                  {copy.real}
                </th>
                <th scope="col" className="pb-2 text-left font-normal">
                  {copy.pixelGuess}
                </th>
                <th scope="col" className="pb-2 text-left font-normal">
                  {copy.meaningGuess}
                </th>
              </tr>
            </thead>
            <tbody>
              {hidden.map((h, i) => {
                const pixels = guessPixels(guesser, picture, hidden, h);
                const guess = kindGuesses.find((g) => g.hidden === h);
                const kind = guess && reference ? kindNear(guess.guess, reference) : null;
                // On a border the visible neighbours disagree, and a guess made
                // from their average lands between kinds. The visitor can see
                // this in the picture; the model cannot, and is not told.
                const mixed =
                  !!guess && new Set(guess.from.map((n) => picture.textures[n])).size > 1;
                return (
                  <tr key={h} aria-label={copy.rowLabel(i + 1)}>
                    <td className="pb-2 pr-3">
                      <div className="w-12">
                        <PatchView pixels={patchOf(picture, h)} label={copy.real} />
                      </div>
                    </td>
                    <td className="pb-2 pr-3">
                      <div className="w-12">
                        {pixels ? (
                          <PatchView pixels={pixels} label={copy.pixelGuess} />
                        ) : (
                          <span className="text-fg-muted">—</span>
                        )}
                      </div>
                    </td>
                    <td className="pb-2 text-fg">
                      {!pixels ? (
                        <span className="text-fg-muted">{copy.noGuess}</span>
                      ) : !ready ? (
                        <span className="text-fg-muted">
                          {copy.preparing(Math.round((steps / MAX_STEPS) * 100))}
                        </span>
                      ) : mixed ? (
                        <span className="text-fg-muted">{copy.between}</span>
                      ) : kind ? (
                        <span className="flex items-center gap-2">
                          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden="true">
                            <circle cx="5" cy="5" r="5" fill={kindColor(kind)} />
                          </svg>
                          {t.kinds[kind]}
                        </span>
                      ) : (
                        <span className="text-fg-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
      primary={
        <Button variant="secondary" onClick={() => setSeed(seed + 1)}>
          {copy.another}
        </Button>
      }
      controls="stack"
    />
  );
}
