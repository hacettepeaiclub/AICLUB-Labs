import { motion, useReducedMotion } from "framer-motion";
import { cardInteraction, fadeUp, staggerChildren } from "@/design/motion";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

type ConceptKey = "forward" | "loss" | "backprop" | "descent";

interface Concept {
  key: ConceptKey;
  step: string;
  accent: string;
}

const CONCEPTS: Concept[] = [
  { key: "forward", step: "01", accent: "text-signal-cyan" },
  { key: "loss", step: "02", accent: "text-signal-rose" },
  { key: "backprop", step: "03", accent: "text-signal-amber" },
  { key: "descent", step: "04", accent: "text-signal-green" },
];

/** The training loop, one card per stage — the vocabulary, after the demos. */
export function ConceptCards() {
  const t = useT().labs["neural-playground"];
  const reduced = useReducedMotion();

  return (
    <motion.ol
      variants={staggerChildren(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {CONCEPTS.map((concept) => (
        <motion.li
          key={concept.key}
          variants={fadeUp(reduced)}
          {...(reduced ? {} : cardInteraction)}
        >
          <div className="card-surface flex h-full flex-col p-6 transition-shadow duration-base hover:shadow-card-hover md:p-8">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-caption text-fg-faint">{concept.step}</span>
              <h3 className={cn("text-overline uppercase", concept.accent)}>{t.loop.cards[concept.key].title}</h3>
            </div>
            <p className="mt-5 flex-1 text-title text-fg">{t.loopCards[concept.key].headline}</p>
            <p className="mt-5 border-t border-line/10 pt-4 text-body-sm text-fg-muted">
              {t.loop.cards[concept.key].body}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
