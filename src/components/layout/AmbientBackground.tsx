import { useEffect, useRef } from "react";
import { palette, subscribePalette } from "@/design/tokens";

/**
 * The room every page stands in: the club navy dissolved into the page as a
 * slow fog, and a field of faint points drifting through it.
 *
 * ## Why it is behind everything, including the labs
 *
 * It is the ground, not a picture. Cards, stages and panels are opaque and sit
 * on top of it, so inside a lab it only shows in the margins — enough to make
 * the lab feel like part of the same place, never enough to compete with the
 * experiment. It is fixed to the viewport so it does not scroll with content
 * and never needs to be taller than the screen.
 *
 * ## Why it is cheap
 *
 * Labs run their own canvases, some of them training networks every frame.
 * This one must not take time from them: a few hundred points, redrawn at
 * roughly 20 frames a second, stopped entirely while the tab is hidden, and
 * drawn once and left alone when the visitor asks for reduced motion.
 */

/** One point per this many square pixels, capped so a 4K screen stays cheap. */
const AREA_PER_POINT = 3200;
const MAX_POINTS = 700;
/** Milliseconds between redraws — about 20 fps is plenty for a slow drift. */
const FRAME_MS = 50;
/** The club navy. Not a palette token, because the palette only lists colours
 *  that must read on ink; this one never carries meaning, only atmosphere. */
const NAVY = "0 53 136";

interface Point {
  x: number;
  y: number;
  /** Depth 0–1: nearer points are larger and brighter. */
  z: number;
  vx: number;
  vy: number;
  /** 0 navy, 1 accent, 2 data. */
  role: 0 | 1 | 2;
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let points: Point[] = [];
    let colours: [string, string, string] = [NAVY, NAVY, NAVY];
    let light = false;

    const readColours = () => {
      const p = palette();
      colours = [NAVY, p.accent, p.data];
      light = document.documentElement.dataset.theme === "light";
    };

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(MAX_POINTS, Math.round((width * height) / AREA_PER_POINT));
      points = Array.from({ length: count }, () => {
        const roll = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random(),
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          role: roll < 0.5 ? 0 : roll < 0.8 ? 1 : 2,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // On paper the points are ink and must be fainter to stay background.
      const [base, range] = light ? [0.08, 0.18] : [0.16, 0.34];
      for (const p of points) {
        ctx.fillStyle = `rgb(${colours[p.role]} / ${base + p.z * range})`;
        const size = 0.6 + p.z;
        ctx.fillRect(p.x, p.y, size, size);
      }
    };

    const step = () => {
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += width;
        else if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        else if (p.y > height) p.y -= height;
      }
    };

    readColours();
    seed();
    draw();

    const unsubscribe = subscribePalette(() => {
      readColours();
      draw();
    });

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        seed();
        draw();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < FRAME_MS) return;
      last = now;
      step();
      draw();
    };
    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      unsubscribe();
    };
  }, []);

  return (
    <div aria-hidden className="ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <i className="ambient-fog ambient-fog-a" />
      <i className="ambient-fog ambient-fog-b" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
