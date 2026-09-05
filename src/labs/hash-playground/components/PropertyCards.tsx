import { motion, useReducedMotion } from "framer-motion";
import { cardInteraction, fadeUp, staggerChildren } from "@/design/motion";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

type PropertyKey = "deterministic" | "fixedLength" | "oneWay" | "avalanche";

interface Property {
  key: PropertyKey;
  accent: string;
}

const PROPERTIES: Property[] = [
  { key: "deterministic", accent: "text-signal-green" },
  { key: "fixedLength", accent: "text-signal-cyan" },
  { key: "oneWay", accent: "text-signal-amber" },
  { key: "avalanche", accent: "text-signal-rose" },
];

/** The four defining properties, as a staggered grid of hoverable cards. */
export function PropertyCards() {
  const t = useT().labs["hash-playground"].properties.items;
  const reduced = useReducedMotion();

  return (
    <motion.ul
      variants={staggerChildren(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {PROPERTIES.map((prop) => (
        <motion.li key={prop.key} variants={fadeUp(reduced)} {...(reduced ? {} : cardInteraction)}>
          <div className="card-surface group flex h-full flex-col p-6 transition-shadow duration-base hover:shadow-card-hover md:p-8">
            <h3 className={cn("text-overline uppercase", prop.accent)}>{t[prop.key].title}</h3>
            <div className="mt-5 flex-1">
              <p className="text-title text-fg">{t[prop.key].top}</p>
              <p
                aria-hidden
                className="my-2 text-title text-fg-faint transition-transform duration-base ease-out-back group-hover:translate-y-1"
              >
                ↓
              </p>
              <p className="text-title text-fg">{t[prop.key].bottom}</p>
            </div>
            <p className="mt-5 border-t border-line/10 pt-4 text-body-sm text-fg-muted">
              {t[prop.key].detail}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
