import { useEffect, useRef } from "react";

/**
 * Drive a simulation with requestAnimationFrame.
 *
 * The callback receives delta time in seconds (capped at 100ms so a background
 * tab doesn't produce a giant physics step on return). Pass `running: false`
 * to pause without unmounting.
 */
export function useRafLoop(onFrame: (dtSec: number, elapsedSec: number) => void, running = true) {
  const callbackRef = useRef(onFrame);
  callbackRef.current = onFrame;

  useEffect(() => {
    if (!running) return;

    let frameId = 0;
    let last = performance.now();
    const start = last;

    const tick = (now: number) => {
      const dtSec = Math.min((now - last) / 1000, 0.1);
      last = now;
      callbackRef.current(dtSec, (now - start) / 1000);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [running]);
}
