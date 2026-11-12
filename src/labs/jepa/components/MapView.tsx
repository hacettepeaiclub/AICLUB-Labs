import { memo, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { labColor } from "@/design/tokens";
import { usePaletteVersion } from "@/hooks";
import type { MapPoint } from "../engine";
import { kindColor, mapRange } from "../view";

export interface MapGuess {
  readonly guess: { x: number; y: number };
  readonly goal: { x: number; y: number };
}

export interface MapViewProps {
  points: readonly MapPoint[];
  guesses?: readonly MapGuess[];
  label: string;
}

const S = 100;

/**
 * The vectors laid flat, one dot per patch, coloured by the kind the model
 * never sees. The frame fits the points, down to a floor, so a collapse
 * still shows as the cloud shrinking.
 */
export const MapView = memo(function MapView({ points, guesses = [], label }: MapViewProps) {
  const version = usePaletteVersion();
  const canvasRef = useRef<HTMLCanvasElement>(null),
    width = useRef(0);
  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const css = width.current || canvas.clientWidth;
    if (!css) return;
    width.current = css;
    const size = Math.max(1, Math.ceil(css * (window.devicePixelRatio || 1)));
    if (canvas.width !== size) canvas.width = size;
    if (canvas.height !== size) canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.setTransform(size / S, 0, 0, size / S, 0, 0);
    const farthest = Math.max(
      0,
      ...points.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))),
      ...guesses.flatMap(({ guess, goal }) => [guess.x, guess.y, goal.x, goal.y].map(Math.abs)),
    );
    const range = mapRange(farthest),
      at = (v: number) => ((v + range) / (2 * range)) * S;
    ctx.strokeStyle = labColor("fgFaint", 0.35);
    ctx.lineWidth = 0.3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(S / 2, 2);
    ctx.lineTo(S / 2, S - 2);
    ctx.moveTo(2, S / 2);
    ctx.lineTo(S - 2, S / 2);
    ctx.stroke();
    // Keep the original order and separate alpha compositing for every point.
    for (const p of points) {
      ctx.fillStyle = kindColor(p.texture, 0.75);
      ctx.beginPath();
      ctx.arc(at(p.x), at(-p.y), 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    const ring = labColor("fg");
    for (const { guess, goal } of guesses) {
      ctx.strokeStyle = ring;
      ctx.lineWidth = 0.4;
      ctx.setLineDash([1, 1]);
      ctx.beginPath();
      ctx.moveTo(at(guess.x), at(-guess.y));
      ctx.lineTo(at(goal.x), at(-goal.y));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(at(goal.x), at(-goal.y), 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(at(guess.x), at(-guess.y), 2.4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [points, guesses]);
  const paintRef = useRef(paint);
  paintRef.current = paint;
  useLayoutEffect(() => {
    paint();
  }, [paint, version]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        width.current = entry.contentRect.width;
        paintRef.current();
      }
    });
    observer.observe(canvas);
    const resize = () => {
      width.current = canvas.clientWidth;
      paintRef.current();
    };
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={100}
      role="img"
      aria-label={label}
      data-jepa-map
      className="block aspect-square w-full"
    />
  );
});

/** The kinds and their colours, under the map. */
export function KindLegend({
  kinds,
}: {
  kinds: readonly { texture: MapPoint["texture"]; name: string }[];
}) {
  usePaletteVersion();
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-fg-muted">
      {kinds.map(({ texture, name }) => (
        <li key={texture} className="flex items-center gap-2">
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden="true">
            <circle cx="5" cy="5" r="5" fill={kindColor(texture)} />
          </svg>
          {name}
        </li>
      ))}
    </ul>
  );
}
