import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/app/ThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Optional decoration must not take down the page if its chunk fails.
const FaultyTerminal = lazy(() =>
  import("@/components/backgrounds/FaultyTerminal").catch(() => ({ default: () => <></> })),
);

export function AmbientBackground() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const hero = pathname === "/";
  // Freeze every lab route, including its loading/paused state. This covers
  // independent canvas and CSS loops without coupling the labs to decoration.
  const paused = pathname.startsWith("/labs/");

  useEffect(() => {
    // Let the page and existing fog paint before requesting the WebGL chunk.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  return (
    <div aria-hidden className="ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-terminal" data-mode={hero ? "hero" : "ambient"}>
        {ready && theme === "dark" && !reduced && (
          <Suspense fallback={null}>
            <FaultyTerminal
              tint="#A7EF9E"
              glyphs="blocks"
              scale={1.5}
              digitSize={1.2}
              timeScale={hero ? 0.5 : 0.035}
              brightness={0.75}
              glow={0.5}
              persistence={0.5}
              mouseStrength={0.5}
              mouseGlow={0.6}
              curvature={0.1}
              vignette={0.25}
              clickEffect={hero ? "glitch" : "none"}
              mouseReact={hero}
              glitchAmount={hero ? 1 : 0}
              flickerAmount={hero ? 1 : 0}
              pageLoadAnimation={false}
              dpr={hero ? 1.5 : 1}
              pause={paused}
            />
          </Suspense>
        )}
      </div>
      <i className="ambient-fog" />
    </div>
  );
}
