import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { isPaletteShortcut } from "./paletteShortcut";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useT } from "@/i18n";

/**
 * Standard page chrome: skip link, header, main region, footer.
 *
 * ## Why the transition is a CSS keyframe
 *
 * The main region fades and rises 8px when the route changes, and that is the
 * only page-level motion in the product. It used to be a Framer Motion variant
 * inside an `<AnimatePresence>`, which meant the library — 38 KB gzipped —
 * loaded before anything could paint, on every visit, to run a quarter-second
 * fade.
 *
 * Keying `<main>` on the path remounts it on navigation, and a remount
 * restarts a CSS animation. So the animation is declared once in `globals.css`
 * and needs no JavaScript at all — which also means the
 * `prefers-reduced-motion` block there clamps it like everything else, rather
 * than needing the preference read in JS and threaded through as a prop.
 *
 * What was lost: the *exit* half. `AnimatePresence` held the outgoing page
 * until it had faded out. Nothing else in the shell needed presence tracking,
 * and a 150ms fade-out that delays the next page is not worth the library.
 *
 * ## Why the finder is fetched, not bundled
 *
 * The ⌘K palette is on every page and opened on almost none of them. Bundled,
 * it put the dialog, its search and its list into the entry chunk that every
 * first paint waits for. Now the shell keeps only what has to be there before
 * anyone asks — the key it listens for — and the palette is requested when the
 * browser is otherwise idle on a device with a keyboard, or the moment the
 * header's button is pointed at. By the time someone presses ⌘K it is almost
 * always already here; if it is not, the dialog opens a beat later rather than
 * the page painting a beat later for everyone.
 */
const loadPalette = () => import("./LabPalette");
const LabPalette = lazy<ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void }>>(
  () =>
    loadPalette().then(
      (module) => ({ default: module.LabPalette }),
      // A chunk that will not load — usually a deploy that renamed it under an
      // open tab — leaves the finder closed rather than taking the page down
      // with it: there is no error boundary out here, and the grid is still one
      // link away.
      () => ({ default: () => null }),
    ),
);

/** A prefetch that fails must not surface; the real open will try again. */
const preloadPalette = () => {
  loadPalette().catch(() => {});
};

export function PageShell({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const t = useT();
  const { pathname } = useLocation();
  // Held here because two things open it — the header's button and the
  // shortcut — and the dialog has to agree with both.
  const [finding, setFinding] = useState(false);
  // Mounted on first use and kept, so closing it does not throw its chunk's
  // work away and the second open is instant.
  const [paletteMounted, setPaletteMounted] = useState(false);
  const openFinder = useCallback(() => {
    setPaletteMounted(true);
    setFinding(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isPaletteShortcut(event)) return;
      event.preventDefault();
      setPaletteMounted(true);
      setFinding((open) => !open);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Warm the palette once the page has settled, where a keyboard makes ⌘K
  // likely. A phone never shows the button and has no shortcut to press.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preloadPalette, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preloadPalette, 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        {t.shell.skipToContent}
      </a>
      <SiteHeader onFindLab={openFinder} onFindLabIntent={preloadPalette} />
      <main key={routeKey} id="main" className="page-enter flex-1">
        {/* Inside the chrome, not around it: a page that fails to render must
            still leave the visitor a header and a way somewhere else. */}
        <ErrorBoundary resetKey={pathname} showBackLink={pathname !== "/"}>
          {children}
        </ErrorBoundary>
      </main>
      <SiteFooter />
      {paletteMounted && (
        <Suspense fallback={null}>
          <LabPalette open={finding} onOpenChange={setFinding} />
        </Suspense>
      )}
    </div>
  );
}
