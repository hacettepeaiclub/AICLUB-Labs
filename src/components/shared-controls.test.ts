import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";

const read = (path: string) => readFileSync(path, "utf8");

/** Relative luminance, then the WCAG ratio. Two small formulas, no library. */
const luminance = ([r, g, b]: number[]) => {
  const channel = (value: number) => {
    const v = (value ?? 0) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r ?? 0) + 0.7152 * channel(g ?? 0) + 0.0722 * channel(b ?? 0);
};
const ratio = (a: number[], b: number[]) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/** Every `--name: r g b;` inside the block a selector opens. */
const tokensIn = (css: string, selector: string) => {
  const start = css.indexOf(selector);
  const block = css.slice(start, css.indexOf("}", start));
  const found: Record<string, number[]> = {};
  for (const [, name, value] of block.matchAll(/--([\w-]+):\s*(\d+ \d+ \d+);/g)) {
    if (name && value) found[name] = value.split(" ").map(Number);
  }
  return found;
};

describe("text contrast", () => {
  // `theme.test.ts` owns the full palette table and floors faint at 3:1, the
  // large-text rule. But this tier carries 11px overlines and 12px captions —
  // kickers, Figure labels, hints — which is normal-size text, so 4.5:1 is the
  // rule that applies. The visual QA measured 3.85:1 dark and 3.62:1 light.
  const css = read("src/styles/globals.css");
  const themes = [
    ["dark", tokensIn(css, ":root,")],
    ["light", tokensIn(css, ':root[data-theme="light"]')],
  ] as const;

  it("puts faint text above 4.5:1 on every surface it is used on", () => {
    for (const [name, theme] of themes) {
      const faint = theme["fg-faint"];
      expect(faint, `${name} has --fg-faint`).toBeDefined();
      for (const surface of ["ink-950", "ink-900", "ink-800", "ink-700"]) {
        const ground = theme[surface];
        expect(ground, `${name} has --${surface}`).toBeDefined();
        expect(
          Math.round(ratio(faint!, ground!) * 100) / 100,
          `${name}: fg-faint on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("keeps muted and body text above it", () => {
    // Faint is the quietest tier; lifting it must not overtake the two above.
    for (const [name, theme] of themes) {
      const page = theme["ink-950"]!;
      expect(ratio(theme["fg-muted"]!, page), name).toBeGreaterThan(
        ratio(theme["fg-faint"]!, page),
      );
      expect(ratio(theme["fg"]!, page), name).toBeGreaterThan(ratio(theme["fg-muted"]!, page));
    }
  });
});

describe("ghost buttons", () => {
  it("carry a boundary at rest, not only on hover", () => {
    // Without one they read as a line of muted text: "Run 1,000 rounds",
    // "Back to the start" are real actions and were not recognisable as such.
    const source = read("src/components/ui/Button.tsx");
    const ghost = source.slice(
      source.indexOf("ghost:"),
      source.indexOf("};", source.indexOf("ghost:")),
    );
    expect(ghost).toMatch(/(?<!hover:)border border-line/);
    expect(ghost).toMatch(/hover:/);
  });
});

/**
 * The shared controls, checked at the source rather than in a DOM: the suite
 * runs in node, and these are all single declarations that a redesign could
 * quietly undo. The measured heights in the comments come from Chrome at
 * 1440x900 with the collection open.
 */
describe("touch targets", () => {
  it("gives a Button a 44px default height", () => {
    // Was h-10 (40px), which six labs were individually overriding.
    const source = read("src/components/ui/Button.tsx");
    expect(source).toMatch(/md:\s*"h-11 /);
    expect(source).not.toMatch(/md:\s*"h-10 /);
  });

  it("gives a Segmented option a 44px minimum", () => {
    // The <input> is sr-only, so the <label> is the entire target: 37.6px.
    const source = read("src/components/ui/Segmented.tsx");
    const label = source.slice(source.indexOf("htmlFor={id}"));
    expect(label).toMatch(/min-h-11/);
    expect(label).toMatch(/items-center/);
  });

  it("gives a range slider a 44px grab area over a 6px track", () => {
    // The element was 24px tall; the painted track is unchanged.
    const source = read("src/styles/globals.css");
    const rule = source.slice(source.indexOf(".lab-range {"));
    expect(rule.slice(0, rule.indexOf("}"))).toMatch(/h-11/);
    expect(source).toMatch(/background-size: 100% 0\.375rem/);
  });

  it("gives the language and theme pills a minimum in both directions", () => {
    expect(read("src/components/layout/PreferenceToggle.tsx")).toMatch(/min-h-11 min-w-11/);
  });

  it("keeps no lab overriding a shared control's height downwards", () => {
    // A lab may make a target bigger; nothing may make one smaller.
    for (const file of ["src/components/ui/Button.tsx", "src/components/ui/Segmented.tsx"]) {
      expect(read(file)).not.toMatch(/min-h-(?:0|px|1|2|3|4|5|6|7|8|9|10)\b/);
    }
  });
});

describe("LabSection", () => {
  const source = read("src/components/lab/LabSection.tsx");

  it("renders the kicker it is given", () => {
    expect(source).toMatch(/\{kicker &&/);
    expect(source).toMatch(/\{kicker\}/);
  });

  it("renders nothing at all when there is no kicker", () => {
    // The guard, not a wrapper that is always there and sometimes empty.
    expect(source).not.toMatch(/kicker \?\? ""/);
    expect(source).toMatch(/kicker\?: string/);
  });

  it("keeps the kicker subordinate to the heading", () => {
    const kickerLine = source.split("\n").find((line) => line.includes("{kicker}")) ?? "";
    expect(kickerLine).toMatch(/text-overline/);
    expect(kickerLine).toMatch(/text-fg-faint/);
    // A paragraph, so a screen reader's heading list stays the section titles.
    expect(kickerLine).toMatch(/<p /);
    expect(kickerLine).not.toMatch(/<h[1-6]/);
  });

  it("has a kicker to render, in both languages, wherever one is written", () => {
    // The strings existed before anything displayed them; this is what keeps
    // the two dictionaries from drifting now that they are visible.
    const count = (dict: unknown) => JSON.stringify(dict).match(/"kicker":/g)?.length ?? 0;
    expect(count(en)).toBeGreaterThan(20);
    expect(count(tr)).toBe(count(en));
  });
});
