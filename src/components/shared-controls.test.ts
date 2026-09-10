import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";

const read = (path: string) => readFileSync(path, "utf8");

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
