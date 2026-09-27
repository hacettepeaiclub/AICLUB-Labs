import { useEffect, useRef, type RefObject } from "react";
import logoMark from "@/assets/aiclub-mark-white.png";
import { palette, subscribePalette } from "@/design/tokens";

/**
 * The club's mark, assembled from a few thousand points beside the headline.
 *
 * ## Why the shape is exact
 *
 * The points' resting places are sampled from the logo PNG's own alpha, drawn
 * into the box the page reserves for it. So once they settle, the mark is the
 * real geometry — nothing is traced or redrawn by hand. They arrive from a
 * scatter on first paint, which is the only time the field moves on its own.
 *
 * ## How it answers
 *
 * A mouse nudges a small patch aside — a fingertip, not a hand — and springs
 * bring it back. Touch is ignored on purpose, so the field never competes with
 * scrolling a phone.
 *
 * ## Why it is cheap
 *
 * Once everything has settled and nothing is touching it, the loop drops to a
 * quarter of the frames (the points still shimmer, slowly). It stops entirely
 * while the hero is off screen or the tab is hidden, and under reduced motion
 * the settled mark is drawn once and left.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Resting place, from the logo's alpha. */
  tx: number;
  ty: number;
  /** 0 body, 1 accent, 2 data. */
  role: 0 | 1 | 2;
}

/** Sample every other pixel: dense enough for the thin strands to read. */
const STEP = 2;
const RADIUS = 34;
const PUSH = 2.6;
const SPRING = 0.05;
const DAMPING = 0.84;
/** Frames of stillness before the loop throttles down. */
const SETTLE_FRAMES = 90;

export function MarkField({ targetRef }: { targetRef: RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let parts: Particle[] = [];
    let fills: string[] = [];
    let blend: GlobalCompositeOperation = "lighter";
    const mouse = { x: 0, y: 0, active: false };

    const readColours = () => {
      const p = palette();
      fills = [p.fg, p.accent, p.data].map((c) => `rgb(${c} / 0.92)`);
      // Light on ink adds up; ink on paper just overlaps.
      blend = document.documentElement.dataset.theme === "light" ? "source-over" : "lighter";
    };

    const image = new Image();
    image.src = logoMark;

    const sample = (): [number, number][] => {
      const target = targetRef.current;
      if (!target || !image.width) return [];
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const o = off.getContext("2d");
      if (!o) return [];
      const hostBox = host.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      const ratio = image.width / image.height;
      let h = Math.min(box.height, 360);
      let w = h * ratio;
      if (w > box.width) {
        w = box.width;
        h = w / ratio;
      }
      o.drawImage(image, box.left - hostBox.left + (box.width - w) / 2, box.top - hostBox.top + (box.height - h) / 2, w, h);
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
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = blend;
      for (let role = 0; role < 3; role++) {
        ctx.fillStyle = fills[role] ?? "";
        for (const p of parts) if (p.role === role) ctx.fillRect(p.x, p.y, 1.35, 1.35);
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
      const box = targetRef.current?.getBoundingClientRect();
      const hostBox = host.getBoundingClientRect();
      const cx = box ? box.left - hostBox.left + box.width / 2 : width / 2;
      const cy = box ? box.top - hostBox.top + box.height / 2 : height / 2;
      parts = sample().map(([tx, ty]) => {
        const roll = Math.random();
        const settled = reduced;
        return {
          x: settled ? tx : cx + (Math.random() - 0.5) * width * 0.9,
          y: settled ? ty : cy + (Math.random() - 0.5) * height * 1.2,
          vx: 0,
          vy: 0,
          tx,
          ty,
          role: roll < 0.08 ? 2 : roll < 0.2 ? 1 : 0,
        };
      });
      idleFrames = 0;
      draw();
    };

    const step = () => {
      let fastest = 0;
      for (const p of parts) {
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
      return fastest;
    };

    let inView = true;
    let frame = 0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!inView || document.hidden) return;
      frame++;
      const idle = idleFrames > SETTLE_FRAMES && !mouse.active;
      if (idle && frame % 4 !== 0) return;
      const fastest = step();
      idleFrames = fastest < 0.35 && !mouse.active ? idleFrames + 1 : 0;
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      mouse.x = event.clientX - r.left;
      mouse.y = event.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
    });
    visibility.observe(host);

    let resizeTimer = 0;
    // The observer also fires once when it starts watching. Rebuilding then
    // would scatter a mark that has just begun to assemble, so only a real
    // change of size counts.
    const resize = new ResizeObserver(() => {
      if (Math.round(host.clientWidth) === width && Math.round(host.clientHeight) === height) return;
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
      if (!reduced) raf = requestAnimationFrame(tick);
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
      image.removeEventListener("load", start);
    };
  }, [targetRef]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
