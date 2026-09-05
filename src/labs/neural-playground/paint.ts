/**
 * Canvas drawing shared by every view in this lab: heatmaps of a scalar
 * function over the input square, the neuron thumbnails in the diagram, and
 * the data points.
 *
 * Kept out of the components so each section draws the same picture from the
 * same code, and so the per-frame work stays visible in one place.
 *
 * Colors come from `design/tokens` — never a literal here.
 */

import { palette, paletteVersion, type ColorToken } from "@/design/tokens";
import { clamp } from "@/lib/math";
import type { Point } from "./datasets";
import { forward, type Mlp } from "./engine";

type Rgb = readonly [number, number, number];

const rgb = (token: ColorToken): Rgb => {
  const [r, g, b] = palette()[token].split(" ").map(Number);
  return [r ?? 0, g ?? 0, b ?? 0];
};

interface Ink {
  surface: Rgb;
  positive: Rgb;
  negative: Rgb;
  outline: Rgb;
  wrong: Rgb;
}

/**
 * The five colours this module mixes, resolved once per theme.
 *
 * Resolving them at module scope was fine while there was one theme; now a
 * switch has to reach the canvas too, and re-reading computed styles per pixel
 * would be absurd. `paletteVersion()` changes only when the theme does.
 */
let ink: Ink | null = null;
let inkVersion = -1;

function inks(): Ink {
  if (ink !== null && inkVersion === paletteVersion()) return ink;
  inkVersion = paletteVersion();
  ink = {
    surface: rgb("ink800"),
    positive: rgb("accent"),
    negative: rgb("signalCyan"),
    outline: rgb("ink950"),
    wrong: rgb("signalAmber"),
  };
  return ink;
}

const css = ([r, g, b]: Rgb, alpha = 1): string =>
  alpha === 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${alpha})`;

/** Model space is [-1, 1]²; the canvas is [0, w] × [0, h] with y flipped. */
export const toCanvasX = (x: number, width: number): number => ((x + 1) / 2) * width;
export const toCanvasY = (y: number, height: number): number => ((1 - y) / 2) * height;
export const toModelX = (px: number, width: number): number => (px / width) * 2 - 1;
export const toModelY = (py: number, height: number): number => 1 - (py / height) * 2;

export interface ScalarFieldPainter {
  /**
   * Paint `sample(x, y)` across the canvas. The sampler is called in model
   * space ([-1, 1]², y up) and should return a value in −1…1.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    sample: (x: number, y: number) => number,
  ): void;
}

/**
 * The heatmap behind everything in this lab.
 *
 * Rendered at `res × res` into an offscreen buffer and scaled up by the GPU:
 * sampling at display resolution would mean ~500k evaluations a frame, at 64²
 * it is 4k, and the smoothing does the rest. Buffers are allocated once.
 */
export function createScalarFieldPainter(res = 64): ScalarFieldPainter {
  const buffer = document.createElement("canvas");
  buffer.width = res;
  buffer.height = res;
  const bufferCtx = buffer.getContext("2d");
  const image = bufferCtx?.createImageData(res, res);

  return {
    draw(ctx, width, height, sample) {
      if (!bufferCtx || !image) return;
      const C = inks();
      const pixels = image.data;

      for (let row = 0; row < res; row++) {
        // Screen rows run top-to-bottom while y runs bottom-to-top.
        const y = 1 - (2 * (row + 0.5)) / res;
        for (let col = 0; col < res; col++) {
          const x = (2 * (col + 0.5)) / res - 1;
          const value = sample(x, y);
          const hue = value >= 0 ? C.positive : C.negative;
          // Gamma < 1 lifts the faint early-training signal into view without
          // lying about which side of zero a cell is on.
          const strength = Math.pow(clamp(Math.abs(value), 0, 1), 0.65) * 0.62;
          const o = (row * res + col) * 4;
          pixels[o] = C.surface[0] + (hue[0] - C.surface[0]) * strength;
          pixels[o + 1] = C.surface[1] + (hue[1] - C.surface[1]) * strength;
          pixels[o + 2] = C.surface[2] + (hue[2] - C.surface[2]) * strength;
          pixels[o + 3] = 255;
        }
      }

      bufferCtx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(buffer, 0, 0, res, res, 0, 0, width, height);
    },
  };
}

export interface NeuronNode {
  /** Layer index into `net.acts` — 0 is the input. */
  layer: number;
  index: number;
  /** Centre and side length in canvas pixels. */
  cx: number;
  cy: number;
  size: number;
}

export interface NeuronFieldPainter {
  draw(ctx: CanvasRenderingContext2D, net: Mlp, nodes: readonly NeuronNode[]): void;
}

/**
 * Paints what every neuron in the network responds to: for each one, its own
 * activation across the whole input square.
 *
 * All the thumbnails share a single grid sweep — one forward pass per cell
 * fills every neuron's buffer at once — and they land on one canvas, so the
 * whole diagram costs `res²` forward passes and one animation frame.
 */
export function createNeuronFieldPainter(res = 20): NeuronFieldPainter {
  const tile = document.createElement("canvas");
  tile.width = res;
  tile.height = res;
  const tileCtx = tile.getContext("2d");
  const image = tileCtx?.createImageData(res, res);
  let fields: Float32Array[] = [];

  return {
    draw(ctx, net, nodes) {
      const C = inks();
      if (!tileCtx || !image) return;
      if (fields.length !== nodes.length) {
        fields = nodes.map(() => new Float32Array(res * res));
      }

      for (let row = 0; row < res; row++) {
        const y = 1 - (2 * (row + 0.5)) / res;
        for (let col = 0; col < res; col++) {
          const x = (2 * (col + 0.5)) / res - 1;
          forward(net, x, y);
          const cell = row * res + col;
          for (let k = 0; k < nodes.length; k++) {
            const node = nodes[k]!;
            fields[k]![cell] = net.acts[node.layer]?.[node.index] ?? 0;
          }
        }
      }

      // sigmoid lives in 0…1, the others straddle zero — recentre so "no
      // opinion" is always the neutral surface color.
      const centre = net.activation === "sigmoid" ? 0.5 : 0;
      const gain = net.activation === "sigmoid" ? 2 : 1;
      const pixels = image.data;

      for (let k = 0; k < nodes.length; k++) {
        const node = nodes[k]!;
        const values = fields[k]!;
        // The input and output layers are always signed, whatever the hidden
        // activation is: one is a raw coordinate, the other a tanh.
        const isEnd = node.layer === 0 || node.layer === net.sizes.length - 1;
        for (let i = 0; i < values.length; i++) {
          const value = ((values[i] ?? 0) - (isEnd ? 0 : centre)) * (isEnd ? 1 : gain);
          const hue = value >= 0 ? C.positive : C.negative;
          const strength = Math.pow(clamp(Math.abs(value), 0, 1), 0.65) * 0.75;
          const o = i * 4;
          pixels[o] = C.surface[0] + (hue[0] - C.surface[0]) * strength;
          pixels[o + 1] = C.surface[1] + (hue[1] - C.surface[1]) * strength;
          pixels[o + 2] = C.surface[2] + (hue[2] - C.surface[2]) * strength;
          pixels[o + 3] = 255;
        }
        tileCtx.putImageData(image, 0, 0);

        const half = node.size / 2;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(node.cx - half, node.cy - half, node.size, node.size, 6);
        ctx.clip();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(tile, 0, 0, res, res, node.cx - half, node.cy - half, node.size, node.size);
        ctx.restore();
      }
    },
  };
}

/** Faint axes through the origin — an anchor for reading the boundary. */
export function drawAxes(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.strokeStyle = "rgb(255 255 255 / 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * The data. Class is encoded by shape *and* color (circle vs. square), never
 * by color alone; points the network currently gets wrong wear an amber ring.
 */
export function drawPoints(
  ctx: CanvasRenderingContext2D,
  points: readonly Point[],
  net: Mlp | null,
  width: number,
  height: number,
  radius = 4.5,
): void {
  const C = inks();
  ctx.save();
  ctx.lineWidth = 1.5;
  for (const p of points) {
    const cx = toCanvasX(p.x, width);
    const cy = toCanvasY(p.y, height);
    const positive = p.label === 1;

    ctx.beginPath();
    if (positive) {
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    } else {
      ctx.rect(cx - radius, cy - radius, radius * 2, radius * 2);
    }
    ctx.fillStyle = css(positive ? C.positive : C.negative);
    ctx.fill();
    ctx.strokeStyle = css(C.outline, 0.75);
    ctx.stroke();

    if (net && Math.sign(forward(net, p.x, p.y)) !== p.label) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = css(C.wrong, 0.9);
      ctx.stroke();
    }
  }
  ctx.restore();
}
