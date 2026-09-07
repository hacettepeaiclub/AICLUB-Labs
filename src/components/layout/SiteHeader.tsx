import { Link, NavLink } from "react-router-dom";
import { useTheme } from "@/app/ThemeProvider";
import type { Language, ThemeName } from "@/app/preferences";
import logoMark from "@/assets/aiclub-mark-white.png";
import { useLanguage, useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { PreferenceToggle } from "./PreferenceToggle";

export function SiteHeader() {
  const t = useT();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const languages: readonly { value: Language; label: string; title: string }[] = [
    { value: "en", label: t.preferences.english, title: t.preferences.englishFull },
    { value: "tr", label: t.preferences.turkish, title: t.preferences.turkishFull },
  ];

  const themes: readonly { value: ThemeName; label: string }[] = [
    { value: "light", label: t.preferences.light },
    { value: "dark", label: t.preferences.dark },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/10 bg-ink-950/80 backdrop-blur-md">
      {/* The header takes a tighter gutter than `.shell` at the smallest
          widths. At 360px the two preference pills plus the wordmark overran
          the viewport by 18px; the page gutter is generous for reading and too
          generous for a control bar. Everything else on the page keeps
          `.shell`. */}
      <div className="mx-auto flex min-h-16 w-full max-w-shell flex-wrap items-center justify-between gap-x-2 gap-y-1 px-4 py-2 sm:gap-x-3 sm:px-6 md:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 rounded">
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded bg-accent-fill p-1.5">
            <img src={logoMark} alt="" className="h-full w-full object-contain" />
          </span>
          {/* The wordmark stays at every width. It used to be the first thing
              dropped, which left a phone showing a 32px deer and two preference
              toggles — a header where the controls outranked the product's own
              name. The theme toggle yields instead; it is the least urgent
              control on the page. */}
          <span className="font-display text-body-sm font-semibold tracking-tight text-fg sm:text-body">
            {t.shell.brand} <span className="text-fg-muted">{t.shell.brandSuffix}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label={t.shell.primaryNav} className="hidden sm:block">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "rounded px-3 py-2 text-body-sm font-medium transition-colors duration-fast",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                )
              }
            >
              {t.shell.allLabs}
            </NavLink>
          </nav>

          <PreferenceToggle
            label={t.preferences.languageLabel}
            value={language}
            options={languages}
            onChange={setLanguage}
          />
          <PreferenceToggle
            label={t.preferences.themeLabel}
            value={theme}
            options={themes}
            onChange={setTheme}
          />
        </div>
      </div>
    </header>
  );
}
