import { useT } from "@/i18n";

/** Where a problem report or a suggestion goes. Not translated: it is an address. */
const FEEDBACK_EMAIL = "metehan.data@gmail.com";

const linkClass =
  "underline decoration-line/30 underline-offset-2 transition-colors duration-fast hover:text-fg";

/**
 * The footer: what this is, who made it, and where to write.
 *
 * Labs is a product of Hacettepe AI Club, not a second copy of its website —
 * so the relationship is one line and one link, not an About section. Anyone
 * who wants the community follows it; anyone who wants a lab never has to.
 *
 * The mark is not repeated here. The header already carries it on every page,
 * and a second, smaller copy in a badge at the bottom said nothing the top of
 * the page had not.
 */
export function SiteFooter() {
  const t = useT();
  // The club's name goes wherever the sentence puts it: last in English,
  // first in Turkish.
  const [beforeOrg, afterOrg] = t.shell.developedBy.split("{org}");

  return (
    <footer className="mt-auto border-t border-line/10">
      <div className="shell flex flex-wrap items-end justify-between gap-x-8 gap-y-4 py-8">
        <div className="space-y-1 text-caption leading-snug text-fg-faint">
          <p className="font-display text-body-sm font-semibold text-fg">
            {t.shell.brand} {t.shell.brandSuffix}
          </p>
          <p>
            {beforeOrg}
            <a href="https://www.hacettepeaiclub.com/" target="_blank" rel="noreferrer" className={linkClass}>
              {t.shell.parentOrg}
            </a>
            {afterOrg}
          </p>
          <p>
            {t.shell.feedback}{" "}
            <a href={`mailto:${FEEDBACK_EMAIL}`} className={linkClass}>
              {FEEDBACK_EMAIL}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-fg-faint">
          <span className="font-mono text-accent">{t.shell.hashtag}</span>
          <a
            href="https://github.com/hacettepeaiclub/AICLUB-Labs"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            {t.shell.sourceLink}
          </a>
          <p className="tabular-nums">{t.shell.footerRights(new Date().getFullYear())}</p>
        </div>
      </div>
    </footer>
  );
}
