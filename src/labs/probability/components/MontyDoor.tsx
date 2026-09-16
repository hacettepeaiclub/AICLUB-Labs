import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * One door, drawn.
 *
 * ## What the artwork can and cannot do
 *
 * The three door images are complete states: each one contains the frame, the
 * interior and the leaf, already painted. There is no separate leaf layer to
 * rotate, and the doorway interior is opaque — measured at alpha 253 — so
 * nothing placed behind a door image can be seen through it.
 *
 * So the leaf is not rotated and the prize is not behind the door. Instead:
 *
 *  - the opening is played as three aligned states, closed to half to open,
 *    each handing over to the next across a short fade. The three share one
 *    533x800 canvas at one scale factor, so nothing shifts between them and
 *    what reads is a door moving rather than a picture dissolving. Adjacent
 *    states differ only slightly, which is what makes that true; fading
 *    straight from closed to open would read as a dissolve, and does not
 *    happen here.
 *
 *  - the prize is clipped to the doorway aperture and drawn over the painted
 *    interior. The aperture is not guessed: it is the bounds of the dark
 *    interior region in each image, and it never overlaps the leaf, so a prize
 *    clipped to it is indistinguishable from one standing behind the door. The
 *    prize holds still and the aperture widens, which is the door revealing it
 *    rather than the prize arriving.
 *
 * Nothing here decides anything. Which door opens and what is behind it are
 * the engine's, handed down as `state` and `prize`.
 */

/** Closed, half open, open. The index is also the door's openness. */
const STATES = [
  "/labs/probability/monty/door-closed.webp",
  "/labs/probability/monty/door-half-open.webp",
  "/labs/probability/monty/door-open.webp",
] as const;

/**
 * Where the doorway actually is.
 *
 * The opening was found by reading the artwork: the interior is the one large
 * region that is opaque and near-black (alpha ~253, RGB about 9/19/30), and
 * these are the bounds of that region, as percentages **of the door image**.
 * Below the open door's floor line the canvas is fully transparent, which is
 * why `bottom` stops where it does -- anything drawn lower would sit outside
 * the door altogether rather than inside the room.
 */
const OPENING = [
  null,
  { left: 61.91, right: 71.86, top: 12.0, bottom: 86.12 },
  { left: 38.84, right: 85.18, top: 15.25, bottom: 82.88 },
] as const;

/**
 * The door image does not fill the tile, so image percentages are not tile
 * percentages.
 *
 * The tile is `aspect-[3/4]` and the artwork is 533x800, which is narrower.
 * Under `object-contain` the image therefore fills the tile's height and is
 * letterboxed left and right by a fixed amount -- fixed because both ratios
 * are constants, so this holds at every screen size. Vertical percentages pass
 * through untouched; horizontal ones have to be mapped through the letterbox.
 */
const TILE_RATIO = 3 / 4;
const DOOR_IMAGE = { w: 533, h: 800 } as const;
const DOOR_WIDTH = (DOOR_IMAGE.w / DOOR_IMAGE.h / TILE_RATIO) * 100;
const DOOR_LEFT = (100 - DOOR_WIDTH) / 2;
const toTileX = (imageX: number) => DOOR_LEFT + (imageX * DOOR_WIDTH) / 100;

/** The same openings, in the tile's own coordinates, ready for `clip-path`. */
const APERTURE = OPENING.map((o) =>
  o ? { left: toTileX(o.left), right: toTileX(o.right), top: o.top, bottom: o.bottom } : null,
);

/**
 * The prizes, measured the same way: the canvas each one was drawn on, and the
 * box its actual ink occupies inside that canvas.
 *
 * Both assets carry transparent padding, and the car carries a lot of it --
 * its ink is only 82% of its canvas height. Sizing the visible car by its
 * canvas is what made it read as a toy: the padding ate the height, and the
 * empty strip under the wheels left it hovering above the floor. So placement
 * is computed from the ink, and the canvas is positioned to put the ink where
 * it belongs.
 */
const PRIZE = {
  goat: { w: 653, h: 800, ink: { left: 19, right: 647, bottom: 800 } },
  car: { w: 800, h: 533, ink: { left: 13, right: 785, bottom: 506 } },
} as const;

/**
 * How the prize sits in the opening.
 *
 * `MARGIN` is breathing room, as a share of the opening's width taken off each
 * side, so the whole prize is inside the doorway with clear air around it and
 * nothing is cut off by a jamb. `FLOOR_GAP` lifts it off the threshold line by
 * a hair so it reads as standing on the floor rather than welded to the edge.
 *
 * The opening's width is what binds, for both prizes: the car is a long
 * landscape illustration and the doorway is a tall slot, so widthwise fit is
 * the constraint and the height follows from it.
 */
const MARGIN = 0.05;
const FLOOR_GAP = 0.9;

/**
 * Place a prize inside the open doorway.
 *
 * Computed once per prize at module load against the *open* aperture, never
 * per frame and never against the current one: the prize holds still and the
 * door moves around it, which is what makes the reveal read as the door
 * opening rather than the prize arriving.
 */
function place(prize: (typeof PRIZE)[keyof typeof PRIZE]) {
  const open = APERTURE[2]!;
  const span = open.right - open.left;
  const inkWidth = span * (1 - 2 * MARGIN);
  // Scale the canvas up so that its *ink* comes out at `inkWidth`.
  const width = inkWidth / ((prize.ink.right - prize.ink.left) / prize.w);
  // The canvas's height as a share of the tile's height, not its width.
  const height = width * (prize.h / prize.w) * TILE_RATIO;
  const underInk = ((prize.h - prize.ink.bottom) / prize.h) * height;
  return {
    left: `${open.left + span * MARGIN - (prize.ink.left / prize.w) * width}%`,
    width: `${width}%`,
    bottom: `${100 - (open.bottom - FLOOR_GAP) - underInk}%`,
  };
}

const PLACEMENT = { goat: place(PRIZE.goat), car: place(PRIZE.car) } as const;

/**
 * How long each state holds, and how long it takes to hand over.
 *
 * Two steps of `HOLD_MS` puts the whole opening at 340ms, inside the 300-500ms
 * a door of this size should take. The fade is deliberately shorter than the
 * step: if a state fades for as long as it is on screen, both are half-visible
 * for the whole step and the door ghosts. At two thirds, each state is solid
 * for most of its turn and the blend is brief enough to read as the leaf
 * moving rather than one picture turning into another.
 */
const HOLD_MS = 170;
const FADE_MS = 110;

export type DoorVisual = "closed" | "picked" | "opened" | "revealed";

export interface MontyDoorProps {
  /** The logical state, straight from the experiment. */
  state: DoorVisual;
  /** What is behind this door once it is open, or null while it is shut. */
  prize: "goat" | "car" | null;
}

/** How far open a logical state is. */
const opennessOf = (state: DoorVisual): number =>
  state === "opened" || state === "revealed" ? 2 : 0;

/**
 * Walk the door to its target one state at a time.
 *
 * Opening and closing take the same path in opposite directions, so a door
 * that shuts retraces the way it came instead of fading out. Two timers at
 * most, never a frame loop: the door has three positions, not a continuum.
 */
function useOpenness(target: number, reduced: boolean): number {
  const [openness, setOpenness] = useState(target);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduced) {
      setOpenness(target);
      return;
    }
    if (openness === target) return;
    timer.current = window.setTimeout(
      () => setOpenness((current) => current + Math.sign(target - current)),
      HOLD_MS,
    );
    return () => window.clearTimeout(timer.current);
  }, [openness, target, reduced]);

  // A door that arrives already open — a replay drawn mid-round — should not
  // play an opening it never had.
  useEffect(() => {
    if (reduced) setOpenness(target);
  }, [reduced, target]);

  return openness;
}

export function MontyDoor({ state, prize }: MontyDoorProps) {
  const reduced = useReducedMotion() ?? false;
  const openness = useOpenness(opennessOf(state), reduced);
  const gap = APERTURE[openness];

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded">
      {/* The three states, stacked and aligned. Only one is ever opaque. */}
      {STATES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-contain"
          style={{
            opacity: index === openness ? 1 : 0,
            transition: reduced ? undefined : `opacity ${FADE_MS}ms ease-out`,
          }}
        />
      ))}

      {/* The prize, clipped to whatever the door is currently showing. It is
          drawn above the painted interior because nothing can be seen through
          it, and the clip is what keeps that honest: outside the gap the prize
          simply does not exist. */}
      {prize && gap && (
        <span
          className="absolute inset-0"
          style={{
            clipPath: `inset(${gap.top}% ${100 - gap.right}% ${100 - gap.bottom}% ${gap.left}%)`,
            transition: reduced ? undefined : `clip-path ${HOLD_MS}ms ease-out`,
          }}
        >
          <img
            src={`/labs/probability/monty/${prize}.webp`}
            alt=""
            draggable={false}
            // Sized and placed against the full opening, not the current gap,
            // so the prize stays put while the door moves around it. No height
            // is set: the width fixes the scale and the natural ratio does the
            // rest, which is what keeps the ink exactly where `place` put it.
            className="absolute"
            style={PLACEMENT[prize]}
          />
        </span>
      )}
    </span>
  );
}
