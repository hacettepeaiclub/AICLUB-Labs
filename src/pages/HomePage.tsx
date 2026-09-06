import { motion, useReducedMotion } from "framer-motion";
import { LabCard } from "@/components/ui";
import { fadeUp, staggerChildren } from "@/design/motion";
import { useT } from "@/i18n";
import { publishedLabs } from "@/labs/registry";

export function HomePage() {
  const reduced = useReducedMotion();
  const t = useT();
  const labs = publishedLabs();

  return (
    <div className="shell" style={{ paddingTop: "5vh" }}>
      <motion.section
        variants={staggerChildren()}
        initial="hidden"
        animate="visible"
        className="max-w-prose"
      >
        <motion.h1 variants={fadeUp(reduced)} className="mt-2 text-display-xl text-fg">
          {t.home.title}
        </motion.h1>
        <motion.p variants={fadeUp(reduced)} className="mt-6 text-body-lg text-fg-muted">
          {t.home.lede}
        </motion.p>
      </motion.section>

      <section aria-label={t.home.experiments} className="mt-16">
        {labs.length === 0 ? (
          <div className="card-surface grid place-items-center px-6 py-20 text-center">
            <p className="text-title text-fg">{t.home.emptyTitle}</p>
            <p className="mt-2 max-w-md text-body-sm text-fg-muted">{t.home.emptyBody}</p>
          </div>
        ) : (
          <motion.div
            variants={staggerChildren()}
            initial="hidden"
            animate="visible"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {labs.map((lab) => (
              <LabCard key={lab.meta.slug} meta={lab.meta} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
