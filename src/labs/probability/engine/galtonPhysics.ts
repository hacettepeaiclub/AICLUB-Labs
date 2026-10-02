/**
 * The physical board: a rigid-body Galton board, simulated rather than scripted.
 *
 * This module is the one place in the Probability Lab allowed to run an
 * animation loop, and `lab.test.ts` records that exception by name. React owns
 * no part of the simulation: a component hands this module a canvas, receives
 * landing bins through a callback, and is told nothing per frame.
 *
 * ## What is being modelled, and what is not
 *
 * Nothing here decides that a ball goes left or right. A ball is released near
 * the top with a small seeded offset, gravity pulls it down, and every change
 * of direction is a contact response computed by Matter.js against static
 * pegs. The bin it ends in is wherever it stops.
 *
 * That makes this a *different model* from `pascal.ts`, not an implementation
 * of it. The binomial distribution follows from treating each row as an
 * independent fair left/right step; a physical board has geometry, restitution
 * and friction instead, and those produce their own distribution. Measured on
 * this configuration the physical board lands noticeably more often in the
 * middle bins than the ideal model predicts. Neither number is a mistake, and
 * the lab shows them side by side rather than reconciling them.
 *
 * ## Determinism
 *
 * The only randomness is the release offset, drawn from the lab's own seeded
 * generator. Matter.js contains no call to `Math.random` anywhere in its
 * source; its `Common.random` is a seeded generator the solver never uses. The
 * step is fixed, so the same seed, row count and ball count reproduce the same
 * bins whether the world is stepped by the render loop or by a test in Node.
 *
 * Balls share a negative collision group, so they pass through one another and
 * collide only with the board. Trials stay independent, and a ball's path does
 * not depend on how many others happen to be in the air beside it.
 */

import Matter from "matter-js";
import { createRng } from "@/lib/random";
import { clearCanvas } from "@/lib/canvas";

const { Bodies, Composite, Engine } = Matter;

/**
 * The configuration found by measuring, not by taste.
 *
 * Wider gaps and taller rows than intuition suggests: a ball has to land on
 * top of a peg and be turned by it. With tighter spacing it slips between two
 * pegs, keeps the sideways speed the first contact gave it, and skates across
 * the rows into the wall, which put every ball in an outer bin.
 *
 * These were tuned for stable contacts, no tunnelling and no stuck balls. They
 * were deliberately *not* tuned to make the result agree with the binomial.
 */
export const PHYSICS = {
  gap: 34,
  pegRadius: 8,
  ballRadius: 6,
  gravity: 1.8,
  restitution: 0.02,
  friction: 0.5,
  frictionAir: 0.06,
  /** Row spacing, as a multiple of the horizontal gap. */
  rowFactor: 0.9,
  /** The release offset, in pixels either side of centre. */
  jitter: 1.5,
  /** A fixed step, and how finely each one is integrated. */
  stepMs: 1000 / 120,
  substeps: 2,
  /** A ball that has not settled by here is abandoned rather than counted. */
  maxSteps: 2400,
  /** Steps between releases, so a batch arrives as a stream. */
  releaseEvery: 5,
  /**
   * How many seconds of simulation to run per second of wall clock.
   *
   * The air damping that stops a ball skating sideways across the rows also
   * makes it fall slowly: a single ball needs about six seconds of simulated
   * time to settle, which is a tedious thing to watch. This consumes the same
   * fixed steps in the same order, only faster, so nothing about the physics
   * or its determinism changes -- a recording played at speed, not a
   * different recording.
   */
  timeScale: 2.5,
} as const;

export interface Geometry {
  readonly rows: number;
  readonly width: number;
  readonly height: number;
  readonly topY: number;
  readonly rowH: number;
  readonly binTop: number;
  readonly floorY: number;
}

/** The board's measurements for a given number of rows. */
export function geometryOf(rows: number): Geometry {
  const rowH = PHYSICS.gap * PHYSICS.rowFactor;
  const topY = PHYSICS.gap * 2;
  const binTop = topY + (rows - 1) * rowH + rowH * 0.7;
  const floorY = binTop + PHYSICS.gap * 2.2;
  return {
    rows,
    width: PHYSICS.gap * (rows + 2),
    height: floorY + 12,
    topY,
    rowH,
    binTop,
    floorY,
  };
}

export interface Circle {
  readonly x: number;
  readonly y: number;
  readonly r: number;
}

export interface Snapshot {
  readonly geometry: Geometry;
  readonly pegs: readonly Circle[];
  readonly balls: readonly Circle[];
  /** Where the bin walls stand, so the renderer does not recompute them. */
  readonly dividers: readonly number[];
}

interface Live {
  readonly body: Matter.Body;
  readonly index: number;
  steps: number;
}

/**
 * One board, one world.
 *
 * Stepped by whoever owns it: the render loop below when the board is on
 * screen, or a plain `while` in a test. Both take the same path through the
 * same code, which is what makes a headless run and a watched run agree.
 */
export class GaltonWorld {
  readonly geometry: Geometry;

  private readonly engine: Matter.Engine;
  private readonly rng: () => number;
  private readonly pegs: Circle[] = [];
  private readonly dividers: number[] = [];
  private live: Live[] = [];

  private queued = 0;
  private released = 0;
  private sinceRelease = 0;
  private abandoned = 0;

  constructor(rows: number, seed: number) {
    this.geometry = geometryOf(rows);
    this.rng = createRng(seed);
    this.engine = Engine.create();
    this.engine.gravity.y = PHYSICS.gravity;
    this.engine.positionIterations = 8;
    this.engine.velocityIterations = 8;

    const { width, topY, rowH, binTop, floorY } = this.geometry;
    const statics: Matter.Body[] = [];

    for (let row = 0; row < rows; row++) {
      for (let k = 0; k <= row; k++) {
        const x = width / 2 + (k - row / 2) * PHYSICS.gap;
        const y = topY + row * rowH;
        this.pegs.push({ x, y, r: PHYSICS.pegRadius });
        statics.push(
          Bodies.circle(x, y, PHYSICS.pegRadius, {
            isStatic: true,
            restitution: PHYSICS.restitution,
            friction: PHYSICS.friction,
          }),
        );
      }
    }

    // Floor and side walls.
    statics.push(
      Bodies.rectangle(width / 2, floorY + 10, width + 40, 20, {
        isStatic: true,
        friction: PHYSICS.friction,
      }),
      Bodies.rectangle(-10, floorY / 2, 20, floorY * 3, { isStatic: true }),
      Bodies.rectangle(width + 10, floorY / 2, 20, floorY * 3, { isStatic: true }),
    );

    // One divider between each pair of bins, so a settled ball stays counted
    // where it landed instead of rolling along the floor.
    for (let k = 0; k <= rows + 1; k++) {
      const x = width / 2 + (k - (rows + 1) / 2) * PHYSICS.gap;
      this.dividers.push(x);
      statics.push(
        Bodies.rectangle(x, (binTop + floorY) / 2, 2, floorY - binTop, {
          isStatic: true,
          friction: PHYSICS.friction,
        }),
      );
    }

    Composite.add(this.engine.world, statics);
  }

  /** Ask for `count` more balls. They are released a few steps apart. */
  queue(count: number): void {
    this.queued += count;
  }

  get pending(): number {
    return this.queued;
  }

  get active(): number {
    return this.live.length;
  }

  /** Balls released so far, whether or not they have landed. */
  get released_(): number {
    return this.released;
  }

  /** Balls abandoned after failing to settle. Reported, never counted. */
  get lost(): number {
    return this.abandoned;
  }

  get busy(): boolean {
    return this.queued > 0 || this.live.length > 0;
  }

  private release(): void {
    const { width, topY } = this.geometry;
    const offset = (this.rng() - 0.5) * PHYSICS.jitter * 2;
    const body = Bodies.circle(width / 2 + offset, topY - PHYSICS.gap * 1.2, PHYSICS.ballRadius, {
      restitution: PHYSICS.restitution,
      friction: PHYSICS.friction,
      frictionAir: PHYSICS.frictionAir,
      // A negative group: balls ignore each other and collide only with the
      // board, so every trial is independent of the ones beside it.
      collisionFilter: { group: -1, category: 1, mask: 0xffffffff },
    });
    Composite.add(this.engine.world, body);
    this.live.push({ body, index: this.released, steps: 0 });
    this.released += 1;
    this.queued -= 1;
  }

  /**
   * Advance one fixed step and return the bins of any balls that finished.
   *
   * A ball is finished when it is below the bin line and has stopped moving,
   * or when it has fallen past the floor. Either way its body leaves the world
   * immediately: nothing inactive is kept alive.
   */
  step(): number[] {
    this.sinceRelease += 1;
    if (this.queued > 0 && this.sinceRelease >= PHYSICS.releaseEvery) {
      this.release();
      this.sinceRelease = 0;
    }

    for (let s = 0; s < PHYSICS.substeps; s++) {
      Engine.update(this.engine, PHYSICS.stepMs / PHYSICS.substeps);
    }

    const { binTop, floorY, width, rows } = {
      ...this.geometry,
      rows: this.geometry.rows,
    };
    const landed: number[] = [];
    const still: Live[] = [];

    for (const ball of this.live) {
      ball.steps += 1;
      const { position, velocity } = ball.body;
      const settled =
        position.y > binTop &&
        Math.abs(velocity.y) < 0.12 &&
        Math.abs(velocity.x) < 0.12;
      const escaped = position.y > floorY;
      const timedOut = ball.steps > PHYSICS.maxSteps;

      if (settled || escaped || timedOut) {
        Composite.remove(this.engine.world, ball.body);
        if (timedOut && !settled && !escaped) this.abandoned += 1;
        else {
          const bin = Math.round((position.x - width / 2) / PHYSICS.gap + rows / 2);
          landed.push(Math.max(0, Math.min(rows, bin)));
        }
      } else {
        still.push(ball);
      }
    }

    this.live = still;
    return landed;
  }

  snapshot(): Snapshot {
    return {
      geometry: this.geometry,
      pegs: this.pegs,
      dividers: this.dividers,
      balls: this.live.map((ball) => ({
        x: ball.body.position.x,
        y: ball.body.position.y,
        r: PHYSICS.ballRadius,
      })),
    };
  }
}

/**
 * Run a whole batch with no renderer and no clock.
 *
 * Used by the tests, and by the board itself when the visitor has asked for
 * reduced motion: the same physics, resolved at once, so the experiment keeps
 * all of its information and loses only the falling.
 */
export function runHeadless(rows: number, seed: number, count: number): number[] {
  const world = new GaltonWorld(rows, seed);
  world.queue(count);
  const bins: number[] = [];
  let guard = 0;
  while (world.busy && guard < PHYSICS.maxSteps + count * PHYSICS.releaseEvery + 600) {
    bins.push(...world.step());
    guard += 1;
  }
  return bins;
}

// ------------------------------------------------- drawing, and the loop ---

/**
 * Colours, taken from the stylesheet rather than written down here.
 *
 * `globals.css` stores each token as three channel numbers, so the canvas can
 * use the same ink as the rest of the page and follow the theme without the
 * board knowing which theme is on.
 */
function paletteOf(element: Element) {
  const style = getComputedStyle(element);
  const token = (name: string, alpha = 1) => {
    const value = style.getPropertyValue(name).trim();
    return value ? `rgb(${value} / ${alpha})` : `rgb(120 120 140 / ${alpha})`;
  };
  return {
    peg: token("--fg-faint", 0.55),
    frame: token("--line", 0.35),
    floor: token("--line", 0.5),
    ball: token("--accent"),
    ballEdge: token("--accent", 0.35),
  };
}

export interface Painter {
  /** Paint the world as it stands. */
  draw: () => void;
  dispose: () => void;
}

/**
 * One canvas, one board, one paint.
 *
 * Extracted so the static path and the animated path draw the same picture. A
 * visitor who has asked for reduced motion gets this called once; everybody
 * else gets it called by the loop below. Nothing about how the board looks
 * depends on which.
 */
export function createPainter(canvas: HTMLCanvasElement, world: GaltonWorld): Painter | null {
  const maybe = canvas.getContext("2d");
  if (!maybe) return null;
  // Captured after the guard so the hoisted painter below keeps the narrowing.
  const context = maybe;

  const palette = paletteOf(canvas);
  const { geometry } = world;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || geometry.width;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(((width * geometry.height) / geometry.width) * ratio));
  };
  resize();
  // Resizing a canvas clears it. The animated path repaints on the next frame
  // anyway, but the static path has no next frame, so the observer has to put
  // the picture back itself or a reduced-motion board ends up blank.
  const observer = new ResizeObserver(() => {
    resize();
    draw();
  });
  observer.observe(canvas);

  function draw() {
    const shot = world.snapshot();
    const scale = canvas.width / geometry.width;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    clearCanvas(context);

    context.lineWidth = 1;
    context.strokeStyle = palette.frame;
    context.beginPath();
    for (const x of shot.dividers) {
      context.moveTo(x, geometry.binTop);
      context.lineTo(x, geometry.floorY);
    }
    context.stroke();

    context.strokeStyle = palette.floor;
    context.beginPath();
    context.moveTo(0, geometry.floorY);
    context.lineTo(geometry.width, geometry.floorY);
    context.stroke();

    context.fillStyle = palette.peg;
    for (const peg of shot.pegs) {
      context.beginPath();
      context.arc(peg.x, peg.y, peg.r, 0, Math.PI * 2);
      context.fill();
    }

    context.lineWidth = 2;
    for (const ball of shot.balls) {
      context.beginPath();
      context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      context.fillStyle = palette.ball;
      context.fill();
      context.strokeStyle = palette.ballEdge;
      context.stroke();
    }
  }

  return { draw, dispose: () => observer.disconnect() };
}

export interface BoardHandlers {
  /** Called with the bins of every ball that finished on this frame. */
  onOutcome: (bins: number[]) => void;
  /** Called when the queue empties and the last ball has landed. */
  onSettled?: () => void;
}

/**
 * Drive a world onto a canvas.
 *
 * This is the animation loop the rest of the Probability Lab does not have,
 * and the only one it is allowed; `lab.test.ts` permits it in this file and
 * nowhere else. A fixed-step accumulator advances the physics in whole
 * `stepMs` increments whatever the display's refresh rate is, and the catch-up
 * is clamped so a tab that was hidden for a minute resumes rather than
 * fast-forwarding a minute of collisions.
 *
 * React never sees a frame. Outcomes leave through `onOutcome`, in batches,
 * only when a ball has actually landed.
 */
export function attachBoard(
  canvas: HTMLCanvasElement,
  world: GaltonWorld,
  handlers: BoardHandlers,
): () => void {
  const painter = createPainter(canvas, world);
  if (!painter) return () => {};

  let frame = 0;
  let last = 0;
  let carry = 0;
  let wasBusy = false;

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (last === 0) last = now;
    carry = Math.min(carry + (now - last) * PHYSICS.timeScale, PHYSICS.stepMs * 20);
    last = now;

    const bins: number[] = [];
    while (carry >= PHYSICS.stepMs) {
      bins.push(...world.step());
      carry -= PHYSICS.stepMs;
    }
    if (bins.length > 0) handlers.onOutcome(bins);

    const busy = world.busy;
    if (wasBusy && !busy) handlers.onSettled?.();
    wasBusy = busy;

    painter.draw();
  };

  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    painter.dispose();
  };
}
