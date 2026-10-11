import {
  PRODUCT_N,
  RACE_N,
  STRIDES,
  STRIDE_LENGTH,
  bestOf,
  fill,
  multiply,
  race,
  sumStride,
  type BenchReply,
  type BenchRequest,
} from "./bench";

/**
 * The stopwatch, off the main thread (see `bench.ts`).
 *
 * The arrays are made on first use and kept for the worker's life, so a
 * second measurement does not pay for allocating 32 MB again; the page ends
 * the worker when the lab is left, and the memory goes with it.
 */

const scope = globalThis as unknown as {
  postMessage: (reply: BenchReply) => void;
  onmessage: ((event: MessageEvent<BenchRequest>) => void) | null;
};

const now = () => performance.now();

let grid: Float64Array | null = null;
let strip: Float64Array | null = null;
let matrices: { a: Float64Array; b: Float64Array; c: Float64Array } | null = null;

scope.onmessage = (event) => {
  const request = event.data;
  try {
    if (request.kind === "race") {
      grid ??= fill(new Float64Array(RACE_N * RACE_N));
      scope.postMessage({ kind: "race", id: request.id, ...race(grid, RACE_N, 5, now) });
    } else if (request.kind === "stride") {
      strip ??= fill(new Float64Array(STRIDE_LENGTH));
      for (const stride of STRIDES) {
        const { ms } = bestOf(3, () => sumStride(strip!, stride), now);
        scope.postMessage({
          kind: "stride-point",
          id: request.id,
          stride,
          nsPerRead: (ms * 1e6) / STRIDE_LENGTH,
        });
      }
      scope.postMessage({ kind: "stride-done", id: request.id });
    } else {
      const n = PRODUCT_N;
      matrices ??= {
        a: fill(new Float64Array(n * n), 13),
        b: fill(new Float64Array(n * n), 7),
        c: new Float64Array(n * n),
      };
      const { a, b, c } = matrices;
      // Compile this order's loop on a small product first, so the timed one
      // measures memory rather than the JIT.
      const warm = 64;
      multiply(request.order, a, b, c.fill(0), warm);
      let ms = Infinity;
      for (let r = 0; r < 2; r++) {
        c.fill(0);
        const t = now();
        multiply(request.order, a, b, c, n);
        ms = Math.min(ms, now() - t);
      }
      scope.postMessage({ kind: "product", id: request.id, order: request.order, ms });
    }
  } catch (error) {
    scope.postMessage({
      kind: "error",
      id: request.id,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
