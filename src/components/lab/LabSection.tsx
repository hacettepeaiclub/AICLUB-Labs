import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/design/motion";

export interface LabSectionProps {
  /** Short uppercase label above the heading, e.g. "The avalanche effect". */
  kicker: string;
  title: string;
  /** Optional one-paragraph introduction between the heading and the content. */
  lede?: string;
  children: ReactNode;
}

/**
 * One chapter of a lab's scrollytelling page: kicker, heading, optional lede,
 * then the interactive part.
 *
 * Entrances fire once when the section scrolls into view and degrade to
 * opacity-only under reduced motion, so every lab's rhythm down the page is
 * the same without each one re-deciding it.
 */
export function LabSection({ kicker, title, lede, children }: LabSectionProps) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      variants={fadeUp(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <p className="text-overline uppercase text-accent">{kicker}</p>
      <h2 className="mt-3 text-display-md text-fg">{title}</h2>
      {lede && <p className="mt-3 max-w-prose text-body text-fg-muted">{lede}</p>}
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}
