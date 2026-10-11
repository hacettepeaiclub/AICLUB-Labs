import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoMark from "@/assets/aiclub-mark-white.webp";
import { palette, subscribePalette } from "@/design/tokens";
import { useLabMeta, useT } from "@/i18n";
import { clearCanvas } from "@/lib/canvas";

/**
 * The club's mark, assembled from a few thousand points beside the headline.
 *
 * ## Why the shape is exact
 *
 * The points' resting places are sampled from the logo file's own alpha, drawn
 * into the box this component fills. So once they settle, the mark is the real
 * geometry — nothing is traced or redrawn by hand. They arrive from a scatter
 * on first paint, which is the only time the field moves on its own.
 *
 * ## Why it is confined to its own box
 *
 * The canvas used to be stretched across the whole hero `<section>`, with the
 * scatter spanning that width. It meant the points flew across the headline
 * and the lede on their way in, and on a phone — where the hero is a tall
 * column and the mark's box is a band at the top of it — they simply sat on
 * top of the text. Now the canvas *is* the box, so the mark can only ever
 * appear where the layout put it, and the sampling pass reads that box rather
 * than a full-width offscreen canvas it mostly discards. On a phone that pass
 * was allocating and scanning an ImageData the size of the entire hero.
 *
 * ## How it answers
 *
 * A mouse nudges a small patch aside — a fingertip, not a hand — and springs
 * bring it back.
 *
 * A touch screen has no pointer to follow, so it gets a gesture instead: a
 * tap breaks the mark apart from where the finger landed, and the springs
 * pull it back together. Only a tap counts. A finger that moves is scrolling,
 * the browser cancels the pointer, and nothing happens — the listeners are
 * passive and never call `preventDefault`, so the field cannot get in the way
 * of the page.
 *
 * ## Why a phone does not keep the loop running
 *
 * It used to get a still mark, drawn once, because a loop repainting a
 * picture that never changed was battery spent on nothing. That is still the
 * rule; what changed is that the picture now changes twice — as it assembles,
 * and after a tap — and the loop runs exactly then. Once the points settle on
 * a touch screen it stops outright rather than dropping to the slow shimmer a
 * desktop gets, and a tap starts it again. `prefers-reduced-motion` gets the
 * still mark, as it always has.
 *
 * ## Why it is cheap when it does run
 *
 * Once everything has settled and nothing is touching it, the loop drops to a
 * quarter of the frames (the points still shimmer, slowly). It stops entirely
 * while the hero is off screen or the tab is hidden.
 *
 * ## The game
 *
 * "Rebuild the mark" scatters the points across the box and switches the
 * springs off. The visitor sweeps a brush over them — the cursor, a finger, or
 * the arrow keys — and every point the brush touches is pushed part of the way
 * home and coasts on, slowing, after the brush has gone. A point that arrives
 * is locked in place and drawn at full strength; the strays stay faint, so the
 * picture itself says what is left. At 95% home the clock stops, the springs
 * come back for the stragglers, and the best time is kept in this browser.
 *
 * It is a game about the club's own mark, and it is also honest arithmetic: a
 * push of `KICK` times the distance home, carried on by `COAST`, is gradient
 * descent with momentum on each point's squared distance from its place. The
 * result says so, and points at the lab where that idea is the subject.
 *
 * Only the game takes the page's touches. While it runs, the box sets
 * `touch-action: none`, so a finger dragged across it moves the brush instead
 * of the page; outside the game the box scrolls like everything else. Reduced
 * motion keeps the still mark and offers no game.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Resting place, from the logo's alpha. */
  tx: number;
  ty: number;
  /** In the game: arrived, and locked at its resting place. */
  home: boolean;
}

/** Sample every other pixel: dense enough for the thin strands to read. */
const STEP = 2;
const RADIUS = 34;
const PUSH = 2.6;
const SPRING = 0.05;
const DAMPING = 0.84;
/** Frames of stillness before the loop throttles down. */
const SETTLE_FRAMES = 90;
/** How long a motionless cursor still counts as touching the field. */
const HOVER_TIMEOUT_MS = 400;

/** A tap scatters the points within this share of the box's larger side. */
const BURST_REACH = 0.42;
/** Peak outward kick, in px per frame, at the centre of a tap. */
const BURST_KICK = 7;
/** A press that moves further than this, or lasts longer, is not a tap. */
const TAP_SLOP = 10;
const TAP_MS = 450;

/** Three tiers of point, in the order they are painted. */
const ROLES = 3;

/** The game: each frame under the brush sets a point's velocity to this share of its way home. */
const KICK = 0.105;
/** …and it keeps this share of that velocity each frame after, so one touch carries it ~95% home. */
const COAST = 0.9;
/** Closer than this, a point has arrived and snaps into place: too small a jump to see. */
const ARRIVED = 3;
/** The share of points home that ends a round. The springs bring the rest. */
const FINISH = 0.95;
/** Brush radius as a share of the box's smaller side, within these bounds in px. */
const BRUSH = 0.085;
const BRUSH_MIN = 18;
const BRUSH_MAX = 30;
/** One arrow-key press moves the brush this far. */
const KEY_STEP = 14;
/** How long the mark glows after a round, in ms. */
const GLOW_MS = 700;

/**
 * The strip along the bottom of the box that the game's controls live in, in
 * px. The mark is drawn above it, so no button or result is ever laid over it.
 */
const HUD_BAND = 56;

const BEST_KEY = "aiclub-labs-mark-best";

function readBest(): number | null {
  try {
    const value = Number(window.localStorage.getItem(BEST_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeBest(seconds: number): void {
  try {
    window.localStorage.setItem(BEST_KEY, String(seconds));
  } catch {
    // Storage unavailable: the round still counts, it just is not remembered.
  }
}

type Mode = "idle" | "playing" | "done";

interface Result {
  seconds: number;
  best: number;
  isBest: boolean;
}

interface Controls {
  start: () => void;
  stop: () => void;
}

export function MarkField() {
  const t = useT();
  const copy = t.home.game;
  const lesson = useLabMeta("gradient-descent");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef<Controls | null>(null);
  const [playable, setPlayable] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const previousMode = useRef<Mode>("idle");

  // Written straight to the DOM each frame, so a round never re-renders.
  const pctRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  // The effect outlives a language change; it reads the current wording here.
  const format = useRef(copy);
  format.current = copy;
  const onDone = useRef((seconds: number) => {
    const previous = readBest();
    const isBest = previous === null || seconds < previous;
    if (isBest) writeBest(seconds);
    setResult({ seconds, best: isBest ? seconds : previous, isBest });
    setMode("done");
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    // A still mark for anyone who asked for less movement.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No hover means no pointer to follow: taps instead, and no idle loop.
    const touch = window.matchMedia("(hover: none)").matches;

    let width = 0;
    let height = 0;
    /** One array per role, so a frame is three passes over three lists rather
        than three passes over all of them testing a field each time. */
    let tiers: Particle[][] = [];
    let fills: string[] = [];
    let dot = 1.35;
    let blend: GlobalCompositeOperation = "lighter";
    const mouse = { x: 0, y: 0, active: false, at: 0 };

    const game = { playing: false, started: 0, home: 0, total: 0, glowUntil: 0, last: 0 };
    /** `px, py` is where the brush was last frame: it sweeps the whole path between. */
    const brush = { x: 0, y: 0, px: 0, py: 0, active: false, at: 0, held: false };
    let brushRadius = BRUSH_MIN;
    let stray = "";

    const readColours = () => {
      const p = palette();
      const light = document.documentElement.dataset.theme === "light";
      // Light on ink adds up; ink on paper just overlaps.
      blend = light ? "source-over" : "lighter";
      // On paper a 1.35px point at 92% is a speck, and a field of them reads
      // as dust on the screen rather than as a drawing. Ink needs the weight
      // that light does not.
      dot = light ? 1.75 : 1.35;
      fills = [p.fg, p.accent, p.data].map((c) => `rgb(${c} / ${light ? 1 : 0.92})`);
      stray = `rgb(${p.fgFaint} / ${light ? 0.55 : 0.5})`;
    };

    const image = new Image();
    // The header masks with this same file, and a CSS mask is fetched in CORS
    // mode. An image fetched without it is a different request as far as the
    // cache is concerned, so the logo came down twice; asking for it the same
    // way lets the second use reuse the first. Same origin, so nothing else
    // changes — and reading its pixels back stays allowed.
    image.crossOrigin = "anonymous";
    image.src = logoMark;

    /** The logo's opaque pixels, in this box's coordinates. */
    const sample = (): [number, number][] => {
      if (!image.width) return [];
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const o = off.getContext("2d");
      if (!o) return [];
      const ratio = image.width / image.height;
      // Above the controls' strip, unless there are no controls.
      const room = still ? height : height - HUD_BAND;
      let h = Math.min(room, 360);
      let w = h * ratio;
      if (w > width) {
        w = width;
        h = w / ratio;
      }
      o.drawImage(image, (width - w) / 2, (room - h) / 2, w, h);
      const data = o.getImageData(0, 0, width, height).data;
      const points: [number, number][] = [];
      for (let y = 0; y < height; y += STEP) {
        for (let x = 0; x < width; x += STEP) {
          if ((data[(y * width + x) * 4 + 3] ?? 0) > 140) {
            points.push([x + (Math.random() - 0.5) * 1.2, y + (Math.random() - 0.5) * 1.2]);
          }
        }
      }
      return points;
    };

    const draw = () => {
      clearCanvas(ctx);
      ctx.globalCompositeOperation = blend;
      const glowing = performance.now() < game.glowUntil;
      if (game.playing) {
        // The strays first and faint, so what is left to do is what is dim.
        ctx.fillStyle = stray;
        for (const tier of tiers)
          for (const p of tier) if (!p.home) ctx.fillRect(p.x, p.y, dot, dot);
      }
      for (let role = 0; role < ROLES; role++) {
        ctx.fillStyle = (glowing ? fills[2] : fills[role]) ?? "";
        for (const p of tiers[role] ?? []) {
          if (game.playing && !p.home) continue;
          ctx.fillRect(p.x, p.y, dot, dot);
        }
      }
      ctx.globalCompositeOperation = "source-over";
      if (game.playing && brush.active) {
        ctx.strokeStyle = fills[2] ?? "";
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(brush.x, brush.y, brushRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    let idleFrames = 0;
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.round(host.clientWidth);
      height = Math.round(host.clientHeight);
      if (!width || !height) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      brushRadius = Math.min(BRUSH_MAX, Math.max(BRUSH_MIN, Math.min(width, height) * BRUSH));
      tiers = Array.from({ length: ROLES }, () => []);
      for (const [tx, ty] of sample()) {
        const roll = Math.random();
        const role = roll < 0.08 ? 2 : roll < 0.2 ? 1 : 0;
        tiers[role]!.push({
          x: still ? tx : width / 2 + (Math.random() - 0.5) * width * 1.1,
          y: still ? ty : height / 2 + (Math.random() - 0.5) * height * 1.1,
          vx: 0,
          vy: 0,
          tx,
          ty,
          home: false,
        });
      }
      // A resize in the middle of a round redraws the mark at its new size;
      // the round starts over on it rather than scoring a different picture.
      if (game.playing) scatter();
      idleFrames = 0;
      draw();
      if (running === false && !still && raf !== 0) wake();
    };

    /** One tick of the game. Returns the fastest point's speed. */
    const stepGame = () => {
      // Measured in 60 Hz frames, so a round takes as long on a 120 Hz screen
      // as on a 60 Hz one and best times can be compared. Capped, so a stall
      // does not fling every point across the box at once.
      const now = performance.now();
      const dt = game.last ? Math.min(3, (now - game.last) / (1000 / 60)) : 1;
      game.last = now;
      const coast = COAST ** dt;
      let fastest = 0;
      let touched = false;
      const r2 = brushRadius * brushRadius;
      // The brush is the stroke since the last frame, not the point it ended
      // on: a quick sweep crosses more than its own width in one frame, and
      // everything it passed over counts.
      const ax = brush.px;
      const ay = brush.py;
      const abx = brush.x - ax;
      const aby = brush.y - ay;
      const ab2 = abx * abx + aby * aby;
      for (const tier of tiers) {
        for (const p of tier) {
          if (p.home) continue;
          if (brush.active) {
            const along = ab2 > 0 ? ((p.x - ax) * abx + (p.y - ay) * aby) / ab2 : 0;
            const u = along < 0 ? 0 : along > 1 ? 1 : along;
            const dx = p.x - (ax + abx * u);
            const dy = p.y - (ay + aby * u);
            if (dx * dx + dy * dy < r2) {
              // One step down the gradient of ½·distance², which is the
              // vector home. Set, not added: holding still on a point does
              // not wind it up into an overshoot.
              p.vx = (p.tx - p.x) * KICK;
              p.vy = (p.ty - p.y) * KICK;
              touched = true;
            }
          }
          p.vx *= coast;
          p.vy *= coast;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) < ARRIVED) {
            p.home = true;
            p.x = p.tx;
            p.y = p.ty;
            p.vx = 0;
            p.vy = 0;
            game.home++;
          }
          fastest = Math.max(fastest, Math.abs(p.vx) + Math.abs(p.vy));
        }
      }
      brush.px = brush.x;
      brush.py = brush.y;
      // The clock starts at the first touch, not at the button.
      if (touched && game.started === 0) game.started = now;
      const share = game.total ? game.home / game.total : 0;
      const seconds = game.started ? (now - game.started) / 1000 : 0;
      const pct = Math.min(100, Math.floor(share * 100));
      if (pctRef.current) pctRef.current.textContent = format.current.progress(pct);
      if (timeRef.current) timeRef.current.textContent = format.current.time(seconds);
      barRef.current?.style.setProperty("--p", String(Math.min(1, share / FINISH)));
      if (share >= FINISH) finish(seconds);
      return fastest;
    };

    /** One tick of the spring system. Returns the fastest point's speed. */
    const step = () => {
      if (game.playing) return stepGame();
      let fastest = 0;
      for (const tier of tiers) {
        for (const p of tier) {
          let ax = (p.tx - p.x) * SPRING;
          let ay = (p.ty - p.y) * SPRING;
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < RADIUS * RADIUS) {
              const f = ((1 - d2 / (RADIUS * RADIUS)) * PUSH) / (Math.sqrt(d2) + 1);
              ax += dx * f;
              ay += dy * f;
            }
          }
          p.vx = (p.vx + ax) * DAMPING;
          p.vy = (p.vy + ay) * DAMPING;
          p.x += p.vx + (Math.random() - 0.5) * 0.15;
          p.y += p.vy + (Math.random() - 0.5) * 0.15;
          fastest = Math.max(fastest, Math.abs(p.vx) + Math.abs(p.vy));
        }
      }
      return fastest;
    };

    let inView = true;
    let frame = 0;
    let raf = 0;
    let running = false;
    const tick = () => {
      if (touch && idleFrames > SETTLE_FRAMES) {
        // Settled on a phone: stop until the next tap.
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
      if (!inView || document.hidden) return;
      const now = performance.now();
      // A cursor that came to rest inside the box used to hold the field at
      // full frame rate indefinitely, because only leaving cleared the flag.
      if (mouse.active && now - mouse.at > HOVER_TIMEOUT_MS) mouse.active = false;
      // A finger on the glass keeps the brush on; a cursor or a key, briefly.
      if (brush.active && !brush.held && now - brush.at > HOVER_TIMEOUT_MS) brush.active = false;
      frame++;
      const busy = mouse.active || game.playing || now < game.glowUntil;
      const idle = idleFrames > SETTLE_FRAMES && !busy;
      if (idle && frame % 4 !== 0) return;
      const fastest = step();
      idleFrames = fastest < 0.35 && !busy ? idleFrames + 1 : 0;
      draw();
    };

    const wake = () => {
      idleFrames = 0;
      if (running || still) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    /** Throw the points near (x, y) outward, harder the nearer they are. */
    const burst = (x: number, y: number) => {
      const reach = Math.max(width, height) * BURST_REACH;
      for (const tier of tiers) {
        for (const p of tier) {
          const dx = p.x - x;
          const dy = p.y - y;
          const d = Math.hypot(dx, dy);
          if (d >= reach) continue;
          const kick = (1 - d / reach) * BURST_KICK * (0.6 + Math.random() * 0.8);
          const angle = d > 0.5 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
          p.vx += Math.cos(angle) * kick;
          p.vy += Math.sin(angle) * kick;
        }
      }
      wake();
    };

    /** Every point to a random place in the box, none of them home. */
    function scatter() {
      const margin = 6;
      for (const tier of tiers) {
        for (const p of tier) {
          p.x = margin + Math.random() * (width - margin * 2);
          p.y = margin + Math.random() * (height - margin * 2);
          p.vx = 0;
          p.vy = 0;
          p.home = false;
        }
      }
      game.home = 0;
      game.total = tiers.reduce((n, tier) => n + tier.length, 0);
      game.started = 0;
      game.last = 0;
    }

    const start = () => {
      if (still || !tiers.some((tier) => tier.length)) return;
      game.playing = true;
      mouse.active = false;
      brush.x = width / 2;
      brush.y = height / 2;
      brush.active = false;
      brush.held = false;
      scatter();
      // The box takes the page's touches only while there is a round to play.
      host.style.touchAction = "none";
      // Focusable, and named, for the arrow keys. `application` because the
      // arrows belong to the brush while the round runs, not to a reader.
      host.tabIndex = 0;
      host.setAttribute("role", "application");
      host.setAttribute("aria-label", `${format.current.play}. ${format.current.hint}`);
      host.focus({ preventScroll: true });
      wake();
    };

    /** Springs back on; the stragglers fly home on their own. */
    const release = () => {
      game.playing = false;
      brush.active = false;
      brush.held = false;
      host.style.touchAction = "";
      host.removeAttribute("tabindex");
      host.removeAttribute("role");
      host.removeAttribute("aria-label");
      wake();
    };

    function finish(seconds: number) {
      release();
      game.glowUntil = performance.now() + GLOW_MS;
      onDone.current(Math.round(seconds * 10) / 10);
    }

    controls.current = { start, stop: release };

    const moveBrush = (x: number, y: number) => {
      const nx = Math.min(width, Math.max(0, x));
      const ny = Math.min(height, Math.max(0, y));
      // A brush coming back after a pause starts its stroke where it lands,
      // rather than sweeping a line from wherever it last was.
      if (!brush.active) {
        brush.px = nx;
        brush.py = ny;
      }
      brush.x = nx;
      brush.y = ny;
      brush.at = performance.now();
    };

    const onKey = (event: KeyboardEvent) => {
      if (!game.playing) return;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-KEY_STEP, 0],
        ArrowRight: [KEY_STEP, 0],
        ArrowUp: [0, -KEY_STEP],
        ArrowDown: [0, KEY_STEP],
      };
      const move = moves[event.key];
      if (move) {
        event.preventDefault();
        moveBrush(brush.x + move[0], brush.y + move[1]);
        brush.active = true;
      } else if (event.key === "Escape") {
        release();
        setMode("idle");
      }
    };

    const press = { x: 0, y: 0, at: 0, live: false };
    const onDown = (event: PointerEvent) => {
      if (game.playing) {
        if (event.pointerType === "mouse") return;
        const r = host.getBoundingClientRect();
        moveBrush(event.clientX - r.left, event.clientY - r.top);
        brush.active = true;
        brush.held = true;
        return;
      }
      if (event.pointerType === "mouse") return;
      press.x = event.clientX;
      press.y = event.clientY;
      press.at = performance.now();
      press.live = true;
    };
    const onUp = (event: PointerEvent) => {
      if (game.playing) {
        brush.held = false;
        brush.active = false;
        return;
      }
      if (!press.live || event.pointerType === "mouse") return;
      press.live = false;
      const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
      if (moved > TAP_SLOP || performance.now() - press.at > TAP_MS) return;
      const r = host.getBoundingClientRect();
      burst(event.clientX - r.left, event.clientY - r.top);
    };
    // A scroll that began on the mark arrives here, never as an `up`.
    const onCancel = () => {
      press.live = false;
      brush.held = false;
      brush.active = false;
    };

    const onMove = (event: PointerEvent) => {
      if (game.playing) {
        // A finger moves the brush only while it is down; a cursor always.
        if (event.pointerType !== "mouse" && !brush.held) return;
        const r = host.getBoundingClientRect();
        moveBrush(event.clientX - r.left, event.clientY - r.top);
        brush.active = true;
        return;
      }
      if (event.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      mouse.x = event.clientX - r.left;
      mouse.y = event.clientY - r.top;
      mouse.active = true;
      mouse.at = performance.now();
    };
    const onLeave = (event: PointerEvent) => {
      mouse.active = false;
      if (event.pointerType === "mouse") brush.active = false;
    };
    if (!still) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown, { passive: true });
      host.addEventListener("pointerup", onUp, { passive: true });
      host.addEventListener("pointercancel", onCancel, { passive: true });
      host.addEventListener("keydown", onKey);
    }

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
    });
    visibility.observe(host);

    let resizeTimer = 0;
    // The observer also fires once when it starts watching. Rebuilding then
    // would scatter a mark that has just begun to assemble, so only a real
    // change of size counts.
    const resize = new ResizeObserver(() => {
      if (Math.round(host.clientWidth) === width && Math.round(host.clientHeight) === height)
        return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 200);
    });

    const unsubscribe = subscribePalette(() => {
      readColours();
      draw();
    });

    readColours();
    let cancelled = false;
    const begin = () => {
      if (cancelled) return;
      build();
      resize.observe(host);
      if (!still) {
        wake();
        setPlayable(tiers.some((tier) => tier.length));
      }
    };
    if (image.complete && image.width) begin();
    else image.addEventListener("load", begin, { once: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      resize.disconnect();
      visibility.disconnect();
      unsubscribe();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onCancel);
      host.removeEventListener("keydown", onKey);
      image.removeEventListener("load", begin);
      host.style.touchAction = "";
      host.removeAttribute("tabindex");
      host.removeAttribute("role");
      host.removeAttribute("aria-label");
      controls.current = null;
    };
  }, []);

  // A round that ends — finished, stopped, or escaped — takes away what had
  // focus: the box stops being focusable, the Stop button unmounts. Hand focus
  // to the button that starts the next round, but only if it was lost, so a
  // visitor who has moved on is left where they are.
  useEffect(() => {
    const ended = previousMode.current === "playing" && mode !== "playing";
    previousMode.current = mode;
    if (!ended) return;
    const host = canvasRef.current?.parentElement;
    const active = document.activeElement;
    if (active === document.body || (host && host.contains(active))) {
      playRef.current?.focus({ preventScroll: true });
    }
  }, [mode]);

  const play = () => {
    setResult(null);
    setMode("playing");
    controls.current?.start();
  };
  const stop = () => {
    controls.current?.stop();
    setMode("idle");
  };
  const touch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {playable && (
        <div className="mark-hud absolute inset-x-0 bottom-0 flex h-14 items-center justify-between gap-3">
          {mode === "playing" ? (
            <>
              <div className="pointer-events-none min-w-0 text-caption">
                <p aria-hidden className="font-mono">
                  <span ref={pctRef} className="text-data">
                    {copy.progress(0)}
                  </span>
                  <span className="text-fg-faint"> · </span>
                  <span ref={timeRef} className="text-fg-muted">
                    {copy.time(0)}
                  </span>
                </p>
                <p className="truncate text-fg-faint">{touch ? copy.hintTouch : copy.hint}</p>
              </div>
              <button type="button" onClick={stop} className="mark-play">
                {copy.stop}
              </button>
              <span aria-hidden ref={barRef} className="mark-bar" />
            </>
          ) : (
            <>
              <div role="status" className="min-w-0 text-caption">
                {mode === "done" && result && (
                  <>
                    <p>
                      <span className="font-mono text-fg">{copy.done(result.seconds)}</span>
                      <span className="text-fg-faint"> · </span>
                      <span className={result.isBest ? "text-data" : "text-fg-muted"}>
                        {result.isBest ? copy.newBest : copy.best(result.best)}
                      </span>
                    </p>
                    {lesson && (
                      <Link
                        to="/labs/gradient-descent"
                        title={lesson.title}
                        className="text-fg-faint underline decoration-line/30 underline-offset-2 transition-colors duration-fast hover:text-fg"
                      >
                        {copy.lesson} <span aria-hidden>→</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
              <button ref={playRef} type="button" onClick={play} className="mark-play">
                <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden>
                  <path d="M1 1l7 4-7 4z" fill="currentColor" />
                </svg>
                {mode === "done" ? (
                  // On a phone the result needs the width; the button keeps
                  // its name for a screen reader and shows only its arrow.
                  <span className="sr-only sm:not-sr-only">{copy.again}</span>
                ) : (
                  copy.play
                )}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
