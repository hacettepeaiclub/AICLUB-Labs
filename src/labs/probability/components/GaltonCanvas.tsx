import { useEffect, useRef } from "react";
import { GaltonWorld, attachBoard, createPainter, geometryOf } from "../engine/galtonPhysics";

/**
 * The board, on a canvas.
 *
 * The component's whole job is to hand a canvas and a world to the physics
 * module and to get out of the way. It holds no loop, no frame, no body and no
 * per-frame state: `attachBoard` owns the stepping, and the only thing that
 * crosses back into React is a landing bin, once per ball.
 *
 * That division is why the lab's no-animation-loop rule survives a physics
 * engine. The rule was never about the word `requestAnimationFrame`; it was
 * about React not re-rendering sixty times a second. It still does not.
 */

export interface GaltonCanvasProps {
  rows: number;
  /** Recreated whenever this changes, so a new board is a new experiment. */
  worldKey: string;
  seed: number;
  /** Receives the bins of balls that have physically landed. */
  onOutcome: (bins: number[]) => void;
  onSettled?: () => void;
  /** Handed back so the stage can queue balls into the live world. */
  onReady: (world: GaltonWorld) => void;
  label: string;
  /**
   * With motion reduced the board is painted once and no loop starts. The
   * stage resolves each drop through the same world, synchronously, so the
   * experiment keeps every number and loses only the falling.
   */
  reduced: boolean;
  /** Bumped by the stage after a reduced-motion drop, to repaint once. */
  paintKey: number;
}

export function GaltonCanvas({
  rows,
  worldKey,
  seed,
  onOutcome,
  onSettled,
  onReady,
  label,
  reduced,
  paintKey,
}: GaltonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<GaltonWorld | null>(null);
  const painterRef = useRef<ReturnType<typeof createPainter>>(null);
  // Kept in refs so that changing a handler never tears down a running world.
  const outcome = useRef(onOutcome);
  const settled = useRef(onSettled);
  const ready = useRef(onReady);
  outcome.current = onOutcome;
  settled.current = onSettled;
  ready.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const world = new GaltonWorld(rows, seed);
    ready.current(world);
    worldRef.current = world;

    if (reduced) {
      const painter = createPainter(canvas, world);
      painterRef.current = painter;
      painter?.draw();
      return () => {
        painter?.dispose();
        painterRef.current = null;
      };
    }

    return attachBoard(canvas, world, {
      onOutcome: (bins) => outcome.current(bins),
      onSettled: () => settled.current?.(),
    });
    // `worldKey` is the identity of the experiment: same rows and seed, same
    // board, kept alive across drops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldKey]);

  // One repaint after a reduced-motion drop: the balls have already landed,
  // so there is nothing to animate, only a board to redraw.
  useEffect(() => {
    if (reduced) painterRef.current?.draw();
  }, [paintKey, reduced]);

  const geometry = geometryOf(rows);

  return (
    <div
      role="img"
      aria-label={label}
      className="overflow-hidden rounded border border-line/10 bg-ink-950 p-2"
    >
      <canvas
        ref={canvasRef}
        className="block w-full"
        style={{ aspectRatio: `${geometry.width} / ${geometry.height}` }}
      />
    </div>
  );
}
