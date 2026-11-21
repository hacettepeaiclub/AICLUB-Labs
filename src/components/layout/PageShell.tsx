import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { reloadPage } from "./loadFailure";
import { Button } from "@/components/ui";
import { isPaletteShortcut } from "./paletteShortcut";
import { track } from "@/app/analytics";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useOnline } from "@/hooks/useOnline";
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
type FinderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismissUnavailable: () => void;
};

const LabPalette = lazy<ComponentType<FinderProps>>(() =>
  loadPalette().then(
    (module) => ({ default: module.LabPalette }),
    () => ({ default: FinderUnavailable }),
  ),
);

/** Keep speculative failures quiet until someone asks to open the finder. */
const preloadPalette = () => {
  loadPalette().catch(() => {});
};

function FinderPending({ onPendingChange }: { onPendingChange: (pending: boolean) => void }) {
  useEffect(() => {
    onPendingChange(true);
    return () => onPendingChange(false);
  }, [onPendingChange]);
  return null;
}

function FinderUnavailable({ open, onOpenChange, onDismissUnavailable }: FinderProps) {
  const t = useT();
  if (!open) return null;

  return (
    <div className="shell pointer-events-none fixed inset-x-0 bottom-16 z-40 flex justify-center">
      <div className="card-surface pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <p role="alert" className="text-body-sm font-medium text-fg">
          {t.palette.unavailable}
        </p>
        <Button
          variant="ghost"
          onClick={(event) => {
            const button = event.currentTarget;
            void reloadPage(() => button.isConnected);
          }}
        >
          {t.shell.errors.reload}
        </Button>
        <Link
          to="/"
          onClick={() => onOpenChange(false)}
          className="inline-flex min-h-11 items-center text-body-sm text-fg-muted underline decoration-line/30
            underline-offset-2 transition-colors duration-fast hover:text-fg"
        >
          {t.shell.errors.backToLabs}
        </Link>
        <Button variant="ghost" onClick={onDismissUnavailable}>
          {t.preferences.dismiss}
        </Button>
      </div>
    </div>
  );
}

function useRouteHeadingFocus(routeKey: string) {
  const mainRef = useRef<HTMLElement>(null);
  const previousRoute = useRef(routeKey);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || previousRoute.current === routeKey) return;
    previousRoute.current = routeKey;

    // A lazy route may commit its heading after the new main mounts.
    // Give a closing dialog time to return focus before choosing a destination.
    let frame: number | undefined;
    const focusHeading = () => {
      const heading = main.querySelector("h1");
      if (!heading) return;
      observer.disconnect();
      frame = requestAnimationFrame(() => {
        if (
          !heading.isConnected ||
          document.activeElement !== document.body ||
          document.querySelector("dialog[open]")
        )
          return;
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      });
    };
    const observer = new MutationObserver(focusHeading);
    observer.observe(main, { childList: true, subtree: true });
    focusHeading();
    return () => {
      observer.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [routeKey]);

  return mainRef;
}

export function PageShell({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const t = useT();
  const { pathname } = useLocation();
  const mainRef = useRouteHeadingFocus(routeKey);
  // Held here because two things open it — the header's button and the
  // shortcut — and the dialog has to agree with both.
  const [finding, setFinding] = useState(false);
  const [finderPending, setFinderPending] = useState(false);
  // Mounted on first use and kept, so closing it does not throw its chunk's
  // work away and the second open is instant.
  const [paletteMounted, setPaletteMounted] = useState(false);
  const finderOpener = useRef<HTMLElement | null>(null);
  const openFinder = useCallback((via: "button" | "key") => {
    const focused = document.activeElement;
    finderOpener.current = focused instanceof HTMLElement ? focused : null;
    track("finder_open", { via });
    setPaletteMounted(true);
    setFinding(true);
  }, []);

  useEffect(() => {
    setFinding(false);
  }, [pathname]);

  const dismissUnavailable = () => {
    setFinding(false);
    finderOpener.current?.focus({ preventScroll: true });
  };

  // The shortcut toggles, and only an opening is counted; the listener is
  // bound once, so it reads whether the finder is open from here.
  const findingRef = useRef(finding);
  findingRef.current = finding;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isPaletteShortcut(event)) return;
      event.preventDefault();
      if (findingRef.current) setFinding(false);
      else openFinder("key");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openFinder]);

  // Warm the palette once the page has settled on devices where a keyboard
  // shortcut is likely. Touch devices fetch when the finder is requested.
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
      <SiteHeader onFindLab={() => openFinder("button")} onFindLabIntent={preloadPalette} />
      <OfflineNotice />
      {/* Keep the live region mounted before Suspense supplies its text. */}
      <div
        role="status"
        aria-label={t.palette.label}
        className="shell pointer-events-none fixed inset-x-0 bottom-16 z-40 flex justify-center"
      >
        {finding && finderPending && (
          <p className="card-surface px-4 py-3 text-body-sm text-fg">{t.palette.loading}</p>
        )}
      </div>
      {paletteMounted && (
        <Suspense fallback={finding && <FinderPending onPendingChange={setFinderPending} />}>
          <LabPalette
            open={finding}
            onOpenChange={setFinding}
            onDismissUnavailable={dismissUnavailable}
          />
        </Suspense>
      )}
      <main ref={mainRef} key={routeKey} id="main" className="page-enter flex-1">
        {/* Inside the chrome, not around it: a page that fails to render must
            still leave the visitor a header and a way somewhere else. */}
        <ErrorBoundary resetKey={pathname} showBackLink={pathname !== "/"}>
          {children}
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  );
}

/**
 * A notice below the header while the browser says it is offline.
 *
 * Everything a lab does runs here, in the page, so the open lab keeps
 * working; what does not is opening anything not yet downloaded. The line
 * says so before the visitor finds out by clicking. The live region is
 * always mounted so a screen reader hears it appear.
 */
function OfflineNotice() {
  const t = useT();
  const online = useOnline();
  return (
    <div role="status">
      {!online && (
        <p
          className="border-b border-line/10 bg-ink-900 px-4 py-2 text-center font-mono
            text-caption text-fg-muted"
        >
          {t.shell.offlineNotice}
        </p>
      )}
    </div>
  );
}
