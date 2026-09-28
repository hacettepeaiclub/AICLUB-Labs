import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
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
 */
export function PageShell({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const t = useT();
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        {t.shell.skipToContent}
      </a>
      <SiteHeader />
      <main key={routeKey} id="main" className="page-enter flex-1">
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
