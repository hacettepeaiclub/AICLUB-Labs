/**
 * The arithmetic behind the Convolution lab.
 *
 * Pure functions over small grids, with no DOM and no randomness that is not
 * seeded, so every picture on the page can be checked by a test.
 *
 * ## Which operation this is
 *
 * What a deep-learning library calls a convolution layer computes a
 * *cross-correlation*: the kernel is laid over the image as written, not
 * flipped first. Every output cell is
 *
 *   y[i][j] = Σ_u Σ_v  K[u][v] · x[i·s + u − p][j·s + v − p]
 *
 * with stride `s`, zero padding `p`, and x read as 0 outside the image. The
 * lab uses this throughout, because it is the operation the visitor will meet
 * in practice, and says so where it matters: a kernel that shifts the image
 * right has its 1 on the *left*. `convolve` — the flipped, textbook version —
 * exists only so a test can show the two differ by exactly that flip.
 *
 * ## Numbers
 *
 * The values are ordinary doubles. Where the page shows the arithmetic of a
 * single cell, its pixels are 0 or 1 and its weights are whole numbers, so
 * every product and every sum on screen is exact; elsewhere results are
 * rounded for display only.
 */

/** A rectangular grid of numbers, row-major. Images, kernels and outputs are all one. */
export interface Grid {
  readonly width: number;
  readonly height: number;
  readonly data: Float64Array;
}

export function grid(width: number, height: number, fill = 0): Grid {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0) {
    throw new RangeError(`A grid needs whole, non-negative sides; got ${width}×${height}.`);
  }
  return { width, height, data: new Float64Array(width * height).fill(fill) };
}

/** A grid from rows of numbers. Every row must be the same length. */
export function fromRows(rows: readonly (readonly number[])[]): Grid {
  const height = rows.length;
  const width = rows[0]?.length ?? 0;
  const out = grid(width, height);
  rows.forEach((row, y) => {
    if (row.length !== width)
      throw new RangeError(`Row ${y} has ${row.length} cells, not ${width}.`);
    row.forEach((v, x) => (out.data[y * width + x] = v));
  });
  return out;
}

/**
 * A grid from a picture drawn in text: `#` is 1, anything else is 0.
 * Used for the lab's built-in images so they read as what they are.
 */
export function fromPicture(lines: readonly string[]): Grid {
  return fromRows(lines.map((line) => [...line].map((c) => (c === "#" ? 1 : 0))));
}

export function toRows(g: Grid): number[][] {
  return Array.from({ length: g.height }, (_, y) =>
    Array.from(g.data.subarray(y * g.width, (y + 1) * g.width)),
  );
}

/** The value at (x, y), or 0 outside the grid — which is what zero padding means. */
export function at(g: Grid, x: number, y: number): number {
  if (x < 0 || y < 0 || x >= g.width || y >= g.height) return 0;
  return g.data[y * g.width + x] ?? 0;
}

export function withCell(g: Grid, x: number, y: number, value: number): Grid {
  if (x < 0 || y < 0 || x >= g.width || y >= g.height) return g;
  const data = g.data.slice();
  data[y * g.width + x] = value;
  return { width: g.width, height: g.height, data };
}

/**
 * `shape` drawn onto `field` with its top-left cell at (x, y). Where they
 * overlap the brighter pixel wins, so marks can touch without erasing each
 * other; whatever falls outside the field is dropped.
 */
export function stamp(field: Grid, shape: Grid, x: number, y: number): Grid {
  const data = field.data.slice();
  for (let v = 0; v < shape.height; v++) {
    for (let u = 0; u < shape.width; u++) {
      const fx = x + u;
      const fy = y + v;
      if (fx < 0 || fy < 0 || fx >= field.width || fy >= field.height) continue;
      const k = fy * field.width + fx;
      data[k] = Math.max(data[k] ?? 0, at(shape, u, v));
    }
  }
  return { width: field.width, height: field.height, data };
}

// --------------------------------------------------------------- geometry --

/**
 * How many positions a window of `kernel` cells takes along a side of
 * `input` cells, padded by `padding` on each end and moved `stride` at a time:
 *
 *   ⌊(n + 2p − k) / s⌋ + 1
 *
 * The floor is real: when the stride does not divide the span, the last few
 * cells of the padded input are never under the window. Zero when the kernel
 * does not fit at all.
 */
export function outputSize(input: number, kernel: number, padding = 0, stride = 1): number {
  if (stride < 1 || kernel < 1 || padding < 0)
    throw new RangeError("Invalid convolution geometry.");
  const span = input + 2 * padding - kernel;
  return span < 0 ? 0 : Math.floor(span / stride) + 1;
}

/** Padded cells at the far end that no window reaches: (n + 2p − k) mod s. */
export function leftover(input: number, kernel: number, padding = 0, stride = 1): number {
  const span = input + 2 * padding - kernel;
  return span < 0 ? 0 : span % stride;
}

/** Where, in unpadded input coordinates, output position `i` starts its window. */
export const windowStart = (i: number, padding: number, stride: number): number =>
  i * stride - padding;

// ------------------------------------------------------------- operations --

export interface Geometry {
  readonly padding?: number;
  readonly stride?: number;
}

/**
 * Cross-correlation with zero padding: the operation a convolution layer
 * computes. Output size follows `outputSize` on each axis.
 */
export function correlate(
  image: Grid,
  kernel: Grid,
  { padding = 0, stride = 1 }: Geometry = {},
): Grid {
  const ow = outputSize(image.width, kernel.width, padding, stride);
  const oh = outputSize(image.height, kernel.height, padding, stride);
  const out = grid(ow, oh);
  for (let i = 0; i < oh; i++) {
    for (let j = 0; j < ow; j++) {
      out.data[i * ow + j] = respond(image, kernel, j, i, { padding, stride });
    }
  }
  return out;
}

/** One output cell of `correlate`: the window at output column `j`, row `i`. */
export function respond(
  image: Grid,
  kernel: Grid,
  j: number,
  i: number,
  { padding = 0, stride = 1 }: Geometry = {},
): number {
  const x0 = windowStart(j, padding, stride);
  const y0 = windowStart(i, padding, stride);
  let sum = 0;
  for (let u = 0; u < kernel.height; u++) {
    for (let v = 0; v < kernel.width; v++) {
      sum += at(kernel, v, u) * at(image, x0 + v, y0 + u);
    }
  }
  return sum;
}

/** The nine (or k²) products behind one output cell, in reading order. */
export interface Term {
  readonly weight: number;
  readonly pixel: number;
}

export function terms(
  image: Grid,
  kernel: Grid,
  j: number,
  i: number,
  { padding = 0, stride = 1 }: Geometry = {},
): Term[] {
  const x0 = windowStart(j, padding, stride);
  const y0 = windowStart(i, padding, stride);
  const out: Term[] = [];
  for (let u = 0; u < kernel.height; u++) {
    for (let v = 0; v < kernel.width; v++) {
      out.push({ weight: at(kernel, v, u), pixel: at(image, x0 + v, y0 + u) });
    }
  }
  return out;
}

/** The kernel turned half a revolution: K[u][v] → K[h−1−u][w−1−v]. */
export function flip(kernel: Grid): Grid {
  const out = grid(kernel.width, kernel.height);
  const n = kernel.data.length;
  for (let k = 0; k < n; k++) out.data[k] = kernel.data[n - 1 - k] ?? 0;
  return out;
}

/** Convolution as mathematics defines it: correlation with the flipped kernel. */
export const convolve = (image: Grid, kernel: Grid, geometry: Geometry = {}): Grid =>
  correlate(image, flip(kernel), geometry);

/**
 * The image moved `dx` right and `dy` down, with zeros filling what is
 * uncovered and whatever leaves the edge discarded.
 */
export function shift(image: Grid, dx: number, dy: number): Grid {
  const out = grid(image.width, image.height);
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      out.data[y * image.width + x] = at(image, x - dx, y - dy);
    }
  }
  return out;
}

/** Same-size output, for an odd kernel at stride 1: padding (k − 1) / 2. */
export const samePadding = (kernel: number): number => (kernel - 1) / 2;

// --------------------------------------------------------------- readings --

export function sum(g: Grid): number {
  let s = 0;
  for (const v of g.data) s += v;
  return s;
}

export function extent(g: Grid): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const v of g.data) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return g.data.length ? { min, max } : { min: 0, max: 0 };
}

/** Largest |a − b| over two grids of the same size. */
export function maxDifference(a: Grid, b: Grid): number {
  if (a.width !== b.width || a.height !== b.height) throw new RangeError("Grids differ in size.");
  let d = 0;
  for (let k = 0; k < a.data.length; k++)
    d = Math.max(d, Math.abs((a.data[k] ?? 0) - (b.data[k] ?? 0)));
  return d;
}

/** The cell holding the largest value, first in reading order on a tie. */
export function argmax(g: Grid): { x: number; y: number; value: number } {
  let best = 0;
  for (let k = 1; k < g.data.length; k++) if ((g.data[k] ?? 0) > (g.data[best] ?? 0)) best = k;
  return { x: best % g.width, y: Math.floor(best / g.width), value: g.data[best] ?? 0 };
}

/**
 * Weights a fully connected layer would need to map this input to an output
 * of the same size as the convolution's — one per (input pixel, output cell)
 * pair — against the convolution's k². Bias terms are left out of both.
 */
export function weightCounts(input: number, kernel: number, padding = 0, stride = 1) {
  const o = outputSize(input, kernel, padding, stride);
  return { convolution: kernel * kernel, dense: input * input * o * o };
}

// ------------------------------------------------------- receptive field --

export interface Layer {
  readonly kernel: number;
  readonly stride: number;
  readonly padding: number;
}

/**
 * How many input cells, along one side, one cell of the last layer can see.
 *
 *   r₀ = 1,  jump₀ = 1
 *   r_l = r_{l−1} + (k_l − 1) · jump_{l−1},   jump_l = jump_{l−1} · s_l
 *
 * Padding moves the window but does not widen it. Square kernels make the
 * field square, so one side is the whole story.
 */
export function receptiveField(layers: readonly Layer[]): { size: number; jump: number } {
  let size = 1;
  let jump = 1;
  for (const layer of layers) {
    size += (layer.kernel - 1) * jump;
    jump *= layer.stride;
  }
  return { size, jump };
}

/**
 * The input cells (one axis, possibly reaching into the padding) that cell
 * `index` of the last layer depends on, as an inclusive range — and the
 * range at every layer on the way down, last layer first.
 */
export function dependencies(
  layers: readonly Layer[],
  index: number,
): { from: number; to: number }[] {
  let from = index;
  let to = index;
  const ranges = [{ from, to }];
  for (let l = layers.length - 1; l >= 0; l--) {
    const layer = layers[l];
    if (!layer) continue;
    from = from * layer.stride - layer.padding;
    to = to * layer.stride - layer.padding + layer.kernel - 1;
    ranges.push({ from, to });
  }
  return ranges;
}

/** Sizes of every layer's output along one side, input first. */
export function layerSizes(input: number, layers: readonly Layer[]): number[] {
  const sizes = [input];
  let n = input;
  for (const layer of layers) {
    n = outputSize(n, layer.kernel, layer.padding, layer.stride);
    sizes.push(n);
  }
  return sizes;
}

// --------------------------------------------------------------- learning --

/**
 * Fitting a kernel by gradient descent.
 *
 * The task: given an image x and the output t that some hidden kernel K*
 * produced from it, find weights w whose output matches. The loss is the
 * mean squared error over the N output cells,
 *
 *   L(w) = (1/N) Σ_c (w · p_c − t_c)²
 *
 * where p_c is the patch under cell c. It is a quadratic bowl in w, with
 * gradient (2/N) Σ_c (w · p_c − t_c) p_c and Hessian H = (2/N) Σ_c p_c p_cᵀ.
 * When the patches span all k² directions H is positive definite, the bowl
 * has exactly one bottom, and that bottom is K* itself, because K* makes
 * the loss zero. A step of 1/λ_max(H) then shrinks the error in every
 * direction and never overshoots, so descent from any start reaches K*.
 *
 * The patches are extracted once; each step is then k² · N multiply-adds.
 */
export interface Fit {
  /** One row of k² values per output cell. */
  readonly patches: readonly Float64Array[];
  readonly targets: Float64Array;
  readonly size: number;
  /** 1 / λ_max of the Hessian: the largest step that is safe in every direction. */
  readonly step: number;
}

export function prepareFit(image: Grid, target: Grid, size: number, geometry: Geometry = {}): Fit {
  const { padding = 0, stride = 1 } = geometry;
  const ow = outputSize(image.width, size, padding, stride);
  const oh = outputSize(image.height, size, padding, stride);
  if (target.width !== ow || target.height !== oh)
    throw new RangeError("Target size does not match.");
  const patches: Float64Array[] = [];
  const targets = new Float64Array(ow * oh);
  for (let i = 0; i < oh; i++) {
    for (let j = 0; j < ow; j++) {
      const p = new Float64Array(size * size);
      const x0 = windowStart(j, padding, stride);
      const y0 = windowStart(i, padding, stride);
      for (let u = 0; u < size; u++)
        for (let v = 0; v < size; v++) p[u * size + v] = at(image, x0 + v, y0 + u);
      patches.push(p);
      targets[i * ow + j] = at(target, j, i);
    }
  }
  return { patches, targets, size, step: 1 / largestEigenvalue(hessian(patches, size * size)) };
}

function hessian(patches: readonly Float64Array[], d: number): Float64Array {
  const h = new Float64Array(d * d);
  for (const p of patches) {
    for (let a = 0; a < d; a++) {
      const pa = p[a] ?? 0;
      if (pa === 0) continue;
      for (let b = 0; b < d; b++) h[a * d + b] = (h[a * d + b] ?? 0) + pa * (p[b] ?? 0);
    }
  }
  const scale = 2 / Math.max(patches.length, 1);
  for (let k = 0; k < h.length; k++) h[k] = (h[k] ?? 0) * scale;
  return h;
}

/** Power iteration on a symmetric positive semi-definite matrix. */
function largestEigenvalue(m: Float64Array): number {
  const d = Math.round(Math.sqrt(m.length));
  let v = new Float64Array(d).fill(1 / Math.sqrt(d));
  let lambda = 0;
  for (let iter = 0; iter < 500; iter++) {
    const next = new Float64Array(d);
    for (let a = 0; a < d; a++) {
      let s = 0;
      for (let b = 0; b < d; b++) s += (m[a * d + b] ?? 0) * (v[b] ?? 0);
      next[a] = s;
    }
    const norm = Math.hypot(...next);
    if (norm === 0) return 1;
    for (let a = 0; a < d; a++) next[a] = (next[a] ?? 0) / norm;
    v = next;
    if (Math.abs(norm - lambda) <= 1e-12 * norm) return norm;
    lambda = norm;
  }
  return lambda;
}

export function loss(fit: Fit, weights: Float64Array): number {
  let total = 0;
  fit.patches.forEach((p, c) => {
    let y = 0;
    for (let k = 0; k < p.length; k++) y += (weights[k] ?? 0) * (p[k] ?? 0);
    const e = y - (fit.targets[c] ?? 0);
    total += e * e;
  });
  return total / Math.max(fit.patches.length, 1);
}

export function gradient(fit: Fit, weights: Float64Array): Float64Array {
  const g = new Float64Array(weights.length);
  fit.patches.forEach((p, c) => {
    let y = 0;
    for (let k = 0; k < p.length; k++) y += (weights[k] ?? 0) * (p[k] ?? 0);
    const e = y - (fit.targets[c] ?? 0);
    for (let k = 0; k < p.length; k++) g[k] = (g[k] ?? 0) + e * (p[k] ?? 0);
  });
  const scale = 2 / Math.max(fit.patches.length, 1);
  for (let k = 0; k < g.length; k++) g[k] = (g[k] ?? 0) * scale;
  return g;
}

/** One step downhill, `rate` times the safe step (1 is the safe step itself). */
export function descend(fit: Fit, weights: Float64Array, rate = 1): Float64Array {
  const g = gradient(fit, weights);
  const next = new Float64Array(weights.length);
  for (let k = 0; k < weights.length; k++)
    next[k] = (weights[k] ?? 0) - rate * fit.step * (g[k] ?? 0);
  return next;
}

/**
 * The image with its mean brightness subtracted.
 *
 * Every patch of a bright image leans the same way — towards all nine
 * weights at once — and that one direction dominates the Hessian, so the
 * safe step is tiny and the other eight directions crawl. Taking the mean
 * out first, as networks do with their inputs, removes the lean: the fit
 * then settles in a few hundred steps rather than a few thousand, and still
 * lands on exactly the same kernel.
 */
export function centred(image: Grid): Grid {
  const mean = image.data.length ? sum(image) / image.data.length : 0;
  return { width: image.width, height: image.height, data: image.data.map((v) => v - mean) };
}

export const asKernel = (weights: Float64Array, size: number): Grid => ({
  width: size,
  height: size,
  data: weights,
});
