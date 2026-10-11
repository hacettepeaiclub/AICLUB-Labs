import { useCallback, useEffect, useMemo, useRef } from "react";
import type { LoopOrder } from "./engine";
import type { BenchReply, BenchRequest } from "./bench";

type Race = Extract<BenchReply, { kind: "race" }>;

export interface Bench {
  /** Row against column over the 32 MB grid. */
  race: () => Promise<Race>;
  /** Cost per read at each stride, reported one stride at a time as it lands. */
  stride: (onPoint: (stride: number, nsPerRead: number) => void) => Promise<void>;
  /** One matrix product, in one loop order. */
  product: (order: LoopOrder) => Promise<number>;
}

/**
 * The page's handle on the benchmark worker.
 *
 * The worker is started on the first measurement, not when the lab opens —
 * most visitors scroll past a section before pressing its button, and a
 * worker that allocates 32 MB is not something to start speculatively. It is
 * ended when the lab is left. Requests are answered in order (the worker does
 * one thing at a time), so each is matched to its reply by id.
 */
export function useBench(): Bench {
  const worker = useRef<Worker | null>(null);
  const nextId = useRef(1);
  const listeners = useRef(new Map<number, (reply: BenchReply) => void>());

  useEffect(
    () => () => {
      worker.current?.terminate();
      worker.current = null;
    },
    [],
  );

  const send = useCallback((request: BenchRequest, listen: (reply: BenchReply) => void) => {
    if (!worker.current) {
      const w = new Worker(new URL("./bench.worker.ts", import.meta.url), { type: "module" });
      w.onmessage = (event: MessageEvent<BenchReply>) => {
        listeners.current.get(event.data.id)?.(event.data);
      };
      // A worker that cannot start, or dies, answers everything still waiting
      // with an error, so no button is left saying "measuring" for ever.
      w.onerror = (event) => {
        for (const [id, listen] of listeners.current) {
          listen({ kind: "error", id, message: event.message || "The measurement stopped." });
        }
      };
      worker.current = w;
    }
    listeners.current.set(request.id, listen);
    worker.current.postMessage(request);
  }, []);

  const ask = useCallback(
    <T>(build: (id: number) => BenchRequest, settle: (reply: BenchReply) => { value: T } | null) =>
      new Promise<T>((resolve, reject) => {
        const id = nextId.current++;
        send(build(id), (reply) => {
          if (reply.kind === "error") {
            listeners.current.delete(id);
            reject(new Error(reply.message));
            return;
          }
          // `null` means "not finished": keep listening for the next reply.
          const done = settle(reply);
          if (done) {
            listeners.current.delete(id);
            resolve(done.value);
          }
        });
      }),
    [send],
  );

  const race = useCallback(
    () =>
      ask<Race>(
        (id) => ({ kind: "race", id }),
        (reply) => (reply.kind === "race" ? { value: reply } : null),
      ),
    [ask],
  );

  const stride = useCallback(
    (onPoint: (stride: number, nsPerRead: number) => void) =>
      ask<void>(
        (id) => ({ kind: "stride", id }),
        (reply) => {
          if (reply.kind === "stride-point") onPoint(reply.stride, reply.nsPerRead);
          return reply.kind === "stride-done" ? { value: undefined } : null;
        },
      ),
    [ask],
  );

  const product = useCallback(
    (order: LoopOrder) =>
      ask<number>(
        (id) => ({ kind: "product", id, order }),
        (reply) => (reply.kind === "product" ? { value: reply.ms } : null),
      ),
    [ask],
  );

  return useMemo(() => ({ race, stride, product }), [race, stride, product]);
}
