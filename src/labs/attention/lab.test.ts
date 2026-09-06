import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { labs, publishedLabs } from "../registry";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";
import { attentionMeta } from "./meta";
import { attend, ranked, rowWeights, weightAt } from "./engine";
import { LAB_MODEL } from "./lexicon";
import {
  QUERY_INDEX,
  TARGET_INDEX,
  TOKEN_COUNT,
  displayTokens,
  embedVariant,
  type Variant,
} from "./sentences";
import {
  ARC_THRESHOLD,
  MAX_ARCS,
  arcTargets,
  isNearTie,
  percent,
  rowPercents,
  tokenViews,
  topTargets,
} from "./view";

const run = (variant: Variant) => attend(LAB_MODEL, embedVariant(variant), TOKEN_COUNT);
const BASE = run("ball");
const DOG = run("dog");
const MIRROR = run("mirror");
const WORDS = displayTokens("ball");

// ============================================================== registry ===

describe("registry", () => {
  it("registers the lab exactly once", () => {
    expect(labs.filter((lab) => lab.meta.slug === attentionMeta.slug)).toHaveLength(1);
  });

  it("keeps every slug unique", () => {
    const slugs = labs.map((lab) => lab.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("shows up on the home page", () => {
    expect(publishedLabs().map((lab) => lab.meta.slug)).toContain("attention");
  });

  it("is an intro-level lab that says how long it takes", () => {
    expect(attentionMeta.category).toBe("machine-learning");
    expect(attentionMeta.difficulty).toBe("intro");
    expect(attentionMeta.minutes).toBeGreaterThan(0);
  });

  it("has copy in both languages", () => {
    expect(en.labs.attention.title.length).toBeGreaterThan(3);
    expect(tr.labs.attention.title.length).toBeGreaterThan(3);
    expect(en.labs.attention.recap.lessons).toHaveLength(3);
    expect(tr.labs.attention.recap.lessons).toHaveLength(3);
  });
});

// ============================ every displayed number comes from the engine ===

describe("the numbers on screen", () => {
  it("takes every token's weight straight from the attention matrix", () => {
    for (const [variant, attention] of [
      ["ball", BASE],
      ["dog", DOG],
      ["mirror", MIRROR],
    ] as const) {
      const words = displayTokens(variant);
      for (let selected = 0; selected < TOKEN_COUNT; selected++) {
        const views = tokenViews(attention, selected, words);
        expect(views).toHaveLength(TOKEN_COUNT);
        for (const view of views) {
          expect(view.weight).toBe(weightAt(attention, selected, view.index));
          expect(view.word).toBe(words[view.index]);
        }
      }
    }
  });

  it("shows percentages that are the engine's weights rounded, nothing else", () => {
    for (let selected = 0; selected < TOKEN_COUNT; selected++) {
      const percents = rowPercents(BASE, selected);
      const row = rowWeights(BASE, selected);
      for (let j = 0; j < TOKEN_COUNT; j++) {
        expect(percents[j]).toBe(Math.round(row[j]! * 100));
      }
      // Rounding ten shares can drift a point either way; it must never be
      // further off than that, which would mean a different distribution.
      const total = percents.reduce((sum, value) => sum + value, 0);
      expect(Math.abs(total - 100)).toBeLessThanOrEqual(2);
    }
  });

  it("ranks the summary list the same way the engine ranks the row", () => {
    for (let selected = 0; selected < TOKEN_COUNT; selected++) {
      const top = topTargets(BASE, selected);
      const engineTop = ranked(BASE, selected).slice(0, 3);
      expect(top.map((e) => e.index)).toEqual(engineTop.map((e) => e.index));
      for (const entry of top) expect(entry.weight).toBe(weightAt(BASE, selected, entry.index));
    }
  });
});

// ================================================= the two interactions =====

describe("selecting a different token", () => {
  it("changes which words are emphasised", () => {
    const pronoun = tokenViews(BASE, QUERY_INDEX, WORDS);
    const noun = tokenViews(BASE, TARGET_INDEX, WORDS);
    expect(pronoun.map((v) => v.weight)).not.toEqual(noun.map((v) => v.weight));
  });

  it("moves the top of the ranked list somewhere else entirely", () => {
    expect(topTargets(BASE, QUERY_INDEX)[0]!.index).not.toBe(
      topTargets(BASE, TARGET_INDEX)[0]!.index,
    );
  });

  it("recomputes nothing — the same matrix serves every selection", () => {
    // Two different selections must read the same object, not two runs.
    const a = attend(LAB_MODEL, embedVariant("ball"), TOKEN_COUNT);
    const first = tokenViews(a, 0, WORDS);
    const second = tokenViews(a, 5, WORDS);
    expect(first[0]!.weight).toBe(weightAt(a, 0, 0));
    expect(second[0]!.weight).toBe(weightAt(a, 5, 0));
  });
});

describe("changing the context word", () => {
  it("ball → mirror leaves the pronoun's view of `cat` untouched", () => {
    expect(weightAt(MIRROR, QUERY_INDEX, TARGET_INDEX)).toBe(
      weightAt(BASE, QUERY_INDEX, TARGET_INDEX),
    );
    expect(rowPercents(MIRROR, QUERY_INDEX)).toEqual(rowPercents(BASE, QUERY_INDEX));
  });

  it("ball → dog visibly reduces it, by enough to see", () => {
    const before = weightAt(BASE, QUERY_INDEX, TARGET_INDEX);
    const after = weightAt(DOG, QUERY_INDEX, TARGET_INDEX);
    expect(after).toBeLessThan(before);
    expect(percent(before) - percent(after)).toBeGreaterThanOrEqual(15);
  });

  it("ball → dog puts a new competitor into the top of the list", () => {
    const before = topTargets(BASE, QUERY_INDEX).map((e) => e.index);
    const after = topTargets(DOG, QUERY_INDEX).map((e) => e.index);
    expect(after).not.toEqual(before);
  });
});

// ======================================================== presentation =====

describe("presentation rules", () => {
  it("never draws more than three arcs, and never one to the selected word", () => {
    for (const attention of [BASE, DOG, MIRROR]) {
      for (let selected = 0; selected < TOKEN_COUNT; selected++) {
        const arcs = arcTargets(attention, selected);
        expect(arcs.length).toBeLessThanOrEqual(MAX_ARCS);
        for (const arc of arcs) {
          expect(arc.index).not.toBe(selected);
          expect(arc.weight).toBeGreaterThanOrEqual(ARC_THRESHOLD);
        }
      }
    }
  });

  it("keeps a flat row looking quiet rather than uniformly loud", () => {
    // A determiner's row is nearly uniform. Emphasis is measured against a
    // fixed reference, so all ten words stay faint; scaling to the row maximum
    // would have made every one of them look strong.
    const flat = tokenViews(BASE, 0, WORDS);
    for (const view of flat) expect(view.emphasis).toBeLessThan(0.45);

    const decisive = tokenViews(BASE, QUERY_INDEX, WORDS);
    expect(Math.max(...decisive.map((v) => v.emphasis))).toBe(1);
  });

  it("flags the near-ties the engine actually produces", () => {
    // Measured in Phase 1: selecting a noun gives two verbs almost the same
    // share, because this model has no syntax. The UI has to say so.
    expect(isNearTie(BASE, TARGET_INDEX)).toBe(true);
    expect(isNearTie(BASE, QUERY_INDEX)).toBe(false);
    expect(isNearTie(DOG, QUERY_INDEX)).toBe(true);
  });

  it("prints a percentage only on the few worth reading", () => {
    for (let selected = 0; selected < TOKEN_COUNT; selected++) {
      const shown = tokenViews(BASE, selected, WORDS).filter((v) => v.showPercent);
      expect(shown.length).toBeLessThanOrEqual(3);
      for (const view of shown) expect(view.weight).toBeGreaterThanOrEqual(0.1);
    }
  });
});

// ================================= no hardcoded attention values in the UI ===

describe("no hardcoded attention values in the UI", () => {
  const SOURCES = [
    "src/labs/attention/index.tsx",
    "src/labs/attention/components/SentenceView.tsx",
    "src/labs/attention/components/AttentionTrace.tsx",
  ];
  const read = (path: string) => readFileSync(path, "utf8");

  /** Every weight the engine actually produces, in the shapes it would be pasted in. */
  const measured = (() => {
    const decimals = new Set<string>();
    const integers = new Set<number>();
    for (const attention of [BASE, DOG, MIRROR]) {
      for (let i = 0; i < TOKEN_COUNT; i++) {
        for (const entry of ranked(attention, i)) {
          if (entry.weight < 0.05) continue;
          decimals.add(entry.weight.toFixed(2));
          decimals.add(entry.weight.toFixed(3));
          decimals.add(entry.weight.toFixed(4));
          integers.add(percent(entry.weight));
        }
      }
    }
    return { decimals, integers };
  })();

  it("contains none of the distributions the engine actually produces, as decimals", () => {
    // The exact failure this guards against: a developer pasting the
    // impressive-looking numbers in rather than rendering the computed ones.
    for (const path of SOURCES) {
      const source = read(path);
      for (const value of measured.decimals) {
        const pattern = new RegExp(`(?<![\\w.-])${value.replace(/\./g, "\\.")}(?![\\w.])`);
        expect(pattern.test(source), `${path} contains the measured weight ${value}`).toBe(false);
      }
    }
  });

  it("never prints one of those weights as a literal percentage", () => {
    // Scoped to the numbers the engine actually produces, because a bare
    // integer is ambiguous: `mt-10` is a margin and `"50%"` is a CSS centre
    // offset, neither of which is an attention weight.
    for (const path of SOURCES) {
      const source = read(path);
      for (const value of measured.integers) {
        expect(source.includes(`${value}%`), `${path} contains "${value}%"`).toBe(false);
        // A bare small integer is a step number or an index far more often
        // than it is a weight, so the braced shapes are only checked for
        // values large enough to be unambiguous.
        if (value < 15) continue;
        for (const shape of [`{${value}}`, `>${value}<`]) {
          expect(source.includes(shape), `${path} contains the literal ${shape}`).toBe(false);
        }
      }
    }
  });

  it("keeps the calculation out of the components entirely", () => {
    for (const path of SOURCES.slice(1)) {
      expect(read(path), `${path} should not run the engine`).not.toMatch(/\battend\s*\(/);
    }
    // Exactly one place calls it.
    expect(read(SOURCES[0]!)).toMatch(/\battend\s*\(/);
  });

  it("derives everything it shows from the view helpers", () => {
    const sentence = read(SOURCES[1]!);
    expect(sentence).toMatch(/from "\.\.\/view"/);
    expect(sentence).toMatch(/tokenViews/);
    expect(sentence).toMatch(/topTargets/);
    const trace = read(SOURCES[2]!);
    expect(trace).toMatch(/from "\.\.\/engine"/);
    expect(trace).toMatch(/rowWeights|ranked/);
  });

  it("has no prose of its own — every string comes from the dictionary", () => {
    for (const path of SOURCES) {
      const source = read(path);
      // A JSX text node of two or more words would be untranslated copy.
      expect(source, `${path} has bare JSX prose`).not.toMatch(/>\s*[A-Z][a-z]+ [a-z]+[^<{]*</);
    }
  });
});
