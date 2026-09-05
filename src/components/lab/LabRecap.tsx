import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerChildren } from "@/design/motion";
import { useT } from "@/i18n";

export interface LabRecapProps {
  /** One line per takeaway, revealed in order. */
  lessons: readonly string[];
  /** Closing note under the list — a parting thought, not a summary. */
  footer?: ReactNode;
  /** Override only if the default heading doesn't fit the lab's voice. */
  title?: string;
}

/** Closing checklist — the takeaways, revealed one by one. */
export function LabRecap({ lessons, footer, title }: LabRecapProps) {
  const reduced = useReducedMotion();
  const t = useT();
  const heading = title ?? t.common.recapTitle;

  return (
    <motion.div
      variants={staggerChildren(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="card-surface p-6 md:p-10"
    >
      <motion.h3 variants={fadeUp(reduced)} className="text-display-md text-fg">
        {heading}
      </motion.h3>
      <ul className="mt-6 space-y-3">
        {lessons.map((lesson) => (
          <motion.li
            key={lesson}
            variants={fadeUp(reduced)}
            className="flex items-start gap-3 text-body text-fg-muted"
          >
            <span
              aria-hidden
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill bg-signal-green/15 text-caption text-signal-green"
            >
              ✓
            </span>
            {lesson}
          </motion.li>
        ))}
      </ul>
      {footer && (
        <motion.p variants={fadeUp(reduced)} className="mt-8 text-body-sm text-fg-faint">
          {footer}
        </motion.p>
      )}
    </motion.div>
  );
}
