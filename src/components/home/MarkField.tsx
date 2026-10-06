import { useEffect, useRef } from "react";
import logoMark from "@/assets/aiclub-mark-white.png";
import { palette, subscribePalette } from "@/design/tokens";
import { clearCanvas } from "@/lib/canvas";

/**
 * The club's mark, assembled from a few thousand points beside the headline.
 *
 * ## Why the shape is exact
 *
 * The points' resting places are sampled from the logo PNG's own alpha, drawn
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
 * ## Why the loop is not always running
 *
 * The picture changes only while the points are moving: as the mark
 * assembles, while a cursor pushes through it, and after a tap. The loop runs
 * exactly then. Once the points settle and nothing is touching them it stops
 * outright, on every device — a desktop used to keep it going at a quarter
 * of the frames for a faint shimmer, which was a few thousand points
 * repainted forever for a movement nobody could make out — and a cursor or a
 * tap starts it again. It also stops while the hero is off screen, and picks
 * up where it was when the hero comes back. `prefers-reduced-motion` gets the
 * still mark, as it always has.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Resting place, from the logo's alpha. */
  tx: number;
  ty: number;
}

/** Sample every other pixel: dense enough for the thin strands to read. */
const STEP = 2;
const RADIUS = 34;
const PUSH = 2.6;
const SPRING = 0.05;
const DAMPING = 0.84;
/** Frames of stillness before the loop stops. */
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

export function MarkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    // A still mark for anyone who asked for less movement.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    /** One array per role, so a frame is three passes over three lists rather
        than three passes over all of them testing a field each time. */
    let tiers: Particle[][] = [];
    let fills: string[] = [];
    let dot = 1.35;
    let blend: GlobalCompositeOperation = "lighter";
    const mouse = { x: 0, y: 0, active: false, at: 0 };

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
    };

    const image = new Image();
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
      let h = Math.min(height, 360);
      let w = h * ratio;
      if (w > width) {
        w = width;
        h = w / ratio;
      }
      o.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
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
      for (let role = 0; role < ROLES; role++) {
        ctx.fillStyle = fills[role] ?? "";
        for (const p of tiers[role] ?? []) ctx.fillRect(p.x, p.y, dot, dot);
      }
      ctx.globalCompositeOperation = "source-over";
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
        });
      }
      idleFrames = 0;
      draw();
      if (running === false && !still && raf !== 0) wake();
    };

    /** One tick of the spring system. Returns the fastest point's speed. */
    const step = () => {
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
    let raf = 0;
    let running = false;
    /** Stopped by scrolling away rather than by settling: resume on return. */
    let interrupted = false;
    const tick = () => {
      // A cursor that came to rest inside the box used to hold the field at
      // full frame rate indefinitely, because only leaving cleared the flag.
      if (mouse.active && performance.now() - mouse.at > HOVER_TIMEOUT_MS) mouse.active = false;
      if (idleFrames > SETTLE_FRAMES && !mouse.active) {
        // Settled: stop until a cursor or a tap.
        running = false;
        return;
      }
      if (!inView) {
        running = false;
        interrupted = true;
        return;
      }
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const fastest = step();
      idleFrames = fastest < 0.35 && !mouse.active ? idleFrames + 1 : 0;
      draw();
    };

    /** Run the loop if it is not running; `fresh` restarts the settling count. */
    const wake = (fresh = true) => {
      if (fresh) idleFrames = 0;
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

    const press = { x: 0, y: 0, at: 0, live: false };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      press.x = event.clientX;
      press.y = event.clientY;
      press.at = performance.now();
      press.live = true;
    };
    const onUp = (event: PointerEvent) => {
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
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      mouse.x = event.clientX - r.left;
      mouse.y = event.clientY - r.top;
      mouse.active = true;
      mouse.at = performance.now();
      wake();
    };
    const onLeave = () => {
      mouse.active = false;
    };
    if (!still) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown, { passive: true });
      host.addEventListener("pointerup", onUp, { passive: true });
      host.addEventListener("pointercancel", onCancel, { passive: true });
    }

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView && interrupted) {
        interrupted = false;
        wake(false);
      }
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
    const start = () => {
      if (cancelled) return;
      build();
      resize.observe(host);
      if (!still) wake();
    };
    if (image.complete && image.width) start();
    else image.addEventListener("load", start, { once: true });

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
      image.removeEventListener("load", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
