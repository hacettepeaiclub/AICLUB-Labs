import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { pageTransition } from "@/design/motion";
import { useT } from "@/i18n";

/** Standard page chrome: skip link, header, animated main region, footer. */
export function PageShell({ children }: { children: ReactNode }) {
  const t = useT();
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        {t.shell.skipToContent}
      </a>
      <SiteHeader />
      <motion.main
        id="main"
        className="flex-1"
        variants={pageTransition}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {/* Inside the chrome, not around it: a page that fails to render must
            still leave the visitor a header and a way somewhere else. */}
        <ErrorBoundary resetKey={pathname} showBackLink={pathname !== "/"}>
          {children}
        </ErrorBoundary>
      </motion.main>
      <SiteFooter />
    </div>
  );
}
