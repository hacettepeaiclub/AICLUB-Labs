import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { PageShell } from "@/components/layout/PageShell";
import { HomePage } from "@/pages/HomePage";
import { LabPage } from "@/pages/LabPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  // Block body on purpose: `scrollTo` returns a Promise in current Chrome, and
  // a concise arrow would hand that back to React as a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageShell key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/labs/:slug" element={<LabPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageShell>
    </AnimatePresence>
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
