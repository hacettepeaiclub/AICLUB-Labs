import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { pageTransition } from "@/design/motion";
import { useT } from "@/i18n";

/** Standard page chrome: skip link, header, animated main region, footer. */
export function PageShell({ children }: { children: ReactNode }) {
  const t = useT();
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
        {children}
      </motion.main>
      <SiteFooter />
    </div>
  );
}
