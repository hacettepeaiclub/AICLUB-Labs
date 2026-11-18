import type { CSSProperties } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "@/app/ThemeProvider";
import type { Language, ThemeName } from "@/app/preferences";
import logoMark from "@/assets/aiclub-mark-white.webp";
import { useLanguage, useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { CALCULATOR_PATH } from "@/lib/paths";
import { track } from "@/app/analytics";
import { Kbd } from "@/components/ui";
import { PALETTE_SHORTCUT } from "./paletteShortcut";
import { PreferenceToggle, type ToggleOption } from "./PreferenceToggle";

const SunIcon = (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden
  >
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </svg>
);

const MoonIcon = (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1z" />
  </svg>
);

/**
 * The header: settled, one line, and still.
 *
 * Nothing in it moves on its own except the mark, once, on load: a signal runs
 * up the logo's own strands, and again when it is hovered. A light that used
 * to follow the pointer along the hairline below was removed: it answered
 * the cursor but told the visitor nothing.
 */
export function SiteHeader({
  onFindLab,
  onFindLabIntent,
}: {
  onFindLab: () => void;
  /** Pointed at or focused: a good moment to start fetching the finder. */
  onFindLabIntent: () => void;
}) {
  const t = useT();
  const { language, setLanguage, failed, dismissFailure } = useLanguage();
  const { theme, setTheme } = useTheme();

  const languages: readonly ToggleOption<Language>[] = [
    { value: "en", label: t.preferences.english, title: t.preferences.englishFull },
    { value: "tr", label: t.preferences.turkish, title: t.preferences.turkishFull },
  ];

  const themes: readonly ToggleOption<ThemeName>[] = [
    { value: "light", label: t.preferences.light, icon: SunIcon },
    { value: "dark", label: t.preferences.dark, icon: MoonIcon },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/10 bg-ink-950/95">
      {/* The header takes a tighter gutter than `.shell` at the smallest
          widths. At 360px the two preference pills plus the wordmark overran
          the viewport by 18px; the page gutter is generous for reading and too
          generous for a control bar. Everything else on the page keeps
          `.shell`. */}
      <div className="mx-auto flex min-h-16 w-full max-w-shell flex-wrap items-center justify-between gap-x-2 gap-y-1 px-4 py-2 sm:gap-x-3 sm:px-6 md:px-10">
        <Link to="/" className="brand-link flex shrink-0 items-center gap-2.5 rounded">
          <span
            aria-hidden
            className="brand-mark block h-8 w-[31px] shrink-0"
            style={{ "--mark": `url(${logoMark})` } as CSSProperties}
          />
          {/* The wordmark stays at every width. It used to be the first thing
              dropped, which left a phone showing a 32px deer and two preference
              toggles — a header where the controls outranked the product's own
              name. The theme toggle yields instead; it is the least urgent
              control on the page. */}
          {/* Letter-spacing is what makes the wordmark read as a mark, and
              also what makes it wide. Below `sm` it is tightened to the least
              that still reads as spaced, so the wordmark and both toggles
              stay on one line down to a 360px screen. */}
          <span className="whitespace-nowrap font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-fg sm:text-body-sm sm:tracking-[0.22em]">
            {t.shell.brand} <span className="brand-suffix">{t.shell.brandSuffix}</span>
          </span>
        </Link>

        <div className="flex max-w-full flex-wrap items-center gap-1.5 sm:gap-3">
          <nav aria-label={t.shell.primaryNav} className="hidden sm:flex">
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
            <NavLink
              to={CALCULATOR_PATH}
              className={({ isActive }) =>
                cn(
                  "rounded px-3 py-2 text-body-sm font-medium transition-colors duration-fast",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                )
              }
            >
              {t.shell.calculator}
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={(event) => {
              // Some touch browsers do not focus a button on tap. Give the
              // native dialog a stable focus target to restore on close.
              event.currentTarget.focus({ preventScroll: true });
              onFindLab();
            }}
            onPointerEnter={onFindLabIntent}
            onFocus={onFindLabIntent}
            aria-label={t.palette.open}
            aria-haspopup="dialog"
            aria-keyshortcuts={PALETTE_SHORTCUT === "⌘K" ? "Meta+K" : "Control+K"}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded border border-line/20
              bg-ink-800/50 text-body-sm text-fg-muted transition-colors duration-fast
              hover:border-line/30 hover:text-fg sm:pl-3 sm:pr-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
            <span className="hidden sm:inline">{t.palette.open}</span>
            <span className="hidden sm:inline">
              <Kbd>{PALETTE_SHORTCUT}</Kbd>
            </span>
          </button>

          <details className="relative sm:hidden">
            <summary
              className="cursor-pointer rounded border border-line/20 p-2"
              aria-label={language === "tr" ? "Gezinme" : "Navigation"}
            >
              ☰
            </summary>
            <nav
              onClick={(event) => {
                const menu = event.currentTarget.closest("details");
                if (menu) menu.open = false;
              }}
              style={{ top: "100%", minWidth: "12rem", right: 0, zIndex: 50 }}
              className="absolute grid gap-2 rounded border border-line/20 bg-ink-950 p-3"
            >
              <Link className="p-2" to="/">
                {t.shell.allLabs}
              </Link>
              <Link className="p-2" to={CALCULATOR_PATH}>
                {t.shell.calculator}
              </Link>
            </nav>
          </details>
          <PreferenceToggle
            label={t.preferences.languageLabel}
            value={language}
            options={languages}
            onChange={(to) => {
              track("language", { to });
              setLanguage(to);
            }}
          />
          <PreferenceToggle
            label={t.preferences.themeLabel}
            value={theme}
            options={themes}
            onChange={(to) => {
              track("theme", { to });
              setTheme(to);
            }}
          />
        </div>
      </div>
      {/* A switch that could not download its language leaves the page as it
          was; this says so, in the language the page is still in. The live
          region is always in the accessibility tree — hidden visually while
          empty, never with display:none — so the message is announced when it
          appears. The button sits outside it so it is not read twice. */}
      <div
        className={cn(
          "mx-auto w-full max-w-shell items-center justify-end gap-3 px-4 sm:px-6 md:px-10",
          failed && "flex pb-2",
        )}
      >
        <p role="status" className={failed ? "text-body-sm text-fg-muted" : "sr-only"}>
          {failed &&
            t.preferences.languageFailed(
              failed === "tr" ? t.preferences.turkishFull : t.preferences.englishFull,
            )}
        </p>
        {failed && (
          <button
            type="button"
            onClick={dismissFailure}
            className="rounded px-2 py-1 text-body-sm text-fg underline decoration-line/30 underline-offset-2"
          >
            {t.preferences.dismiss}
          </button>
        )}
      </div>
    </header>
  );
}
