import { useCallback, useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks";

export type SoundName = "tick" | "pop" | "success";

/**
 * Tiny synthesized UI sounds — no audio files, just short oscillator blips.
 * Muted by default when the user prefers reduced motion; the choice persists.
 * The AudioContext is created lazily on the first (user-gesture-driven) play.
 */
export function useSound() {
  const prefersQuiet =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [muted, setMuted] = useLocalStorage<boolean>(
    "acl:hash-playground:muted",
    prefersQuiet,
  );

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((name: SoundName) => {
    if (mutedRef.current || typeof window === "undefined" || !window.AudioContext) return;
    try {
      const ctx = (ctxRef.current ??= new AudioContext());
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime;

      const blip = (
        freq: number,
        opts: { at?: number; dur?: number; vol?: number; to?: number; type?: OscillatorType } = {},
      ) => {
        const { at = 0, dur = 0.06, vol = 0.03, to, type = "sine" } = opts;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t + at);
        if (to) osc.frequency.exponentialRampToValueAtTime(to, t + at + dur);
        gain.gain.setValueAtTime(vol, t + at);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t + at);
        osc.stop(t + at + dur + 0.02);
      };

      if (name === "tick") blip(1800, { dur: 0.045, vol: 0.022 });
      if (name === "pop") blip(320, { dur: 0.09, vol: 0.045, to: 140 });
      if (name === "success") {
        blip(660, { dur: 0.16, vol: 0.05, type: "triangle" });
        blip(880, { at: 0.09, dur: 0.2, vol: 0.05, type: "triangle" });
      }
    } catch {
      // Audio unavailable — the experience works silently.
    }
  }, []);

  const toggleMuted = useCallback(() => setMuted((m) => !m), [setMuted]);

  return { muted, toggleMuted, play };
}
