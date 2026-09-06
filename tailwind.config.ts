import type { Config } from "tailwindcss";

/**
 * AI Club Labs — Tailwind theme.
 *
 * Every color maps to a CSS custom property declared in src/styles/globals.css,
 * so themes can be swapped (or a lab can locally tint the UI) without touching
 * this file. Never hardcode hex values in components.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // The theme lives on a data attribute rather than a class, so the
  // no-flash script and the CSS token blocks key off the same thing.
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Surfaces (dark-first)
        ink: {
          950: "rgb(var(--ink-950) / <alpha-value>)", // page background
          900: "rgb(var(--ink-900) / <alpha-value>)", // raised surface
          800: "rgb(var(--ink-800) / <alpha-value>)", // card / panel
          700: "rgb(var(--ink-700) / <alpha-value>)", // hover surface
        },
        // Strokes
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        // Text
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
          faint: "rgb(var(--fg-faint) / <alpha-value>)",
        },
        // Brand accent (navy blue → used sparingly)
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          // The surface a label sits on. See the note in globals.css.
          fill: "rgb(var(--accent-fill) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
        },
        // Semantic / categorical (lab categories, states)
        signal: {
          cyan: "rgb(var(--signal-cyan) / <alpha-value>)",
          green: "rgb(var(--signal-green) / <alpha-value>)",
          amber: "rgb(var(--signal-amber) / <alpha-value>)",
          rose: "rgb(var(--signal-rose) / <alpha-value>)",
          blue: "rgb(var(--signal-blue) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      // Type scale — 1.25 ratio, clamped for fluid headings
      fontSize: {
        "display-xl": ["clamp(2.5rem, 1.5rem + 4vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["clamp(2rem, 1.25rem + 2.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-md": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "title": ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        "overline": ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.12em", fontWeight: "600" }],
      },
      // Spacing is Tailwind's default 4px grid; these named steps are for
      // page-level rhythm so sections stay consistent across labs.
      spacing: {
        "section": "clamp(4rem, 2rem + 6vw, 8rem)",
        "prose": "65ch",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        card: "1rem",
        pill: "9999px",
      },
      boxShadow: {
        // Elevation reads completely differently on a light ground, so these
        // are theme variables rather than fixed values.
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.4), 0 0 32px -4px rgb(var(--accent) / 0.35)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "450ms",
      },
      maxWidth: {
        shell: "72rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
