import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { PageShell } from "@/components/layout/PageShell";
import { LabPage } from "@/pages/LabPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/**
 * The home page is its own chunk. A visitor who arrives on a lab, which is
 * how a shared link arrives, never needed the grid or the field of marks
 * behind it, and they were most of the entry bundle. The home page's own HTML
 * asks for the chunk alongside the entry (tools/prerender.mjs), so arriving
 * on the home page costs no extra round trip.
 */
const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  // Block body on purpose: `scrollTo` returns a Promise in current Chrome, and
  // a concise arrow would hand that back to React as a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * The routes, inside the chrome.
 *
 * The shell itself is not keyed. It used to be — the whole thing, header and
 * footer included, was thrown away and rebuilt on every navigation so that
 * `AnimatePresence` could cross-fade it. That also replayed the header's
 * load-time signal on every click, which it is not meant to do. Only the main
 * region is keyed now, which is the only part that actually changes.
 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageShell routeKey={location.pathname}>
      <Routes location={location}>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <HomePage />
            </Suspense>
          }
        />
        <Route path="/labs/:slug" element={<LabPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Outside the routes on purpose: the shell remounts on every
          navigation, and the room the pages stand in should not. */}
      <AmbientBackground />
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
