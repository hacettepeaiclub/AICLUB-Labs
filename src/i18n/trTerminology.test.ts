import { describe, expect, it } from "vitest";
import { journeys } from "@/components/lab/journeyCopy";
import { tr } from "./tr";
import { trLabs } from "./labs/tr";

/**
 * Approved Turkish terminology, enforced only where a rule is a hard ban
 * (docs/language/tr-terminology.md, docs/language/tr-style.md). Whether a
 * sentence reads as natural Turkish cannot be checked with a word list, so
 * nothing here tries to.
 */

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (typeof value === "function") out.push(value.toString());
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

const allTurkish = [
  ...strings(tr),
  ...strings(trLabs),
  ...Object.values(journeys).flatMap((j) => [...j.tr]),
];

describe("approved Turkish terminology", () => {
  const banned: [RegExp, string][] = [
    [/ana ?kütle/iu, "population is 'evren'"],
    [/reddetme bölge|red bölge/iu, "rejection region is 'ret bölgesi'"],
    [/yanlış alarm/iu, "a false positive in a test is 'I. tip hata'"],
    [/H(?:₀|0) kabul/iu, "H₀ is 'reddedilemez', never accepted"],
    [/I\. tip hata oranı/iu, "α is the probability of a Type I error, not its rate"],
    [/çift kuyruk/iu, "a two-sided test is 'iki yönlü', its tails 'iki kuyruk'"],
  ];

  for (const [pattern, why] of banned) {
    it(`never uses ${pattern.source}: ${why}`, () => {
      expect(allTurkish.filter((text) => pattern.test(text))).toEqual([]);
    });
  }
});

describe("register in labs already moved to 'sen'", () => {
  // Labs rewritten under docs/language/tr-style.md. Add a slug here when its
  // copy has been moved over; the rest of the site still mixes registers.
  const migrated = [
    "hypothesis-testing",
    "pca",
    "generalization",
    "backpropagation",
    "multilayer-perceptrons",
    "convolution",
    "attention",
  ] as const;

  // Second-person plural endings: "-ınız/-iniz" (sizin, …siniz). Plural
  // imperatives ("-in") are left to review: the same ending is a genitive.
  const plural = /[ıiuü]n[ıiuü]z\b/u;

  for (const slug of migrated) {
    it(`${slug} does not address the reader as 'siz'`, () => {
      const copy = [...strings(trLabs[slug]), ...(journeys[slug]?.tr ?? [])];
      expect(copy.filter((text) => plural.test(text))).toEqual([]);
    });
  }
});
