import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "./Badge";
import { cardInteraction, fadeUp } from "@/design/motion";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_STYLE, type LabMeta } from "@/labs/types";

/** Home-page tile linking to one experiment. */
export function LabCard({ meta }: { meta: LabMeta }) {
  const reduced = useReducedMotion();
  const t = useT();
  const copy = useLabMeta(meta.slug);
  const category = CATEGORY_STYLE[meta.category];

  return (
    <motion.article variants={fadeUp(reduced)} {...(reduced ? {} : cardInteraction)}>
      <Link
        to={`/labs/${meta.slug}`}
        className="card-surface group flex h-full flex-col gap-4 p-6 transition-shadow
          duration-base hover:shadow-card-hover"
      >
        <div className="flex items-center gap-2">
          <Badge dotClassName={category.dot}>{t.category[meta.category]}</Badge>
          <Badge>{t.shell.minutes(meta.minutes)}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-title text-fg transition-colors duration-fast group-hover:text-accent">
            {copy?.title ?? meta.title}
          </h3>
          <p className="mt-2 text-body-sm text-fg-muted">{copy?.description ?? meta.description}</p>
        </div>
        <span className="text-caption font-medium text-fg-faint transition-colors duration-fast group-hover:text-accent">
          {t.shell.openLab}
        </span>
      </Link>
    </motion.article>
  );
}
