import { describe, expect, it } from "vitest";
import { enLabs } from "@/i18n/labs/en";
import { trLabs } from "@/i18n/labs/tr";
import { orderedLabs } from "@/labs/registry";
import { TOURS, tourFor } from "./tours";

type Copy = Record<
  string,
  { tour?: { intro: string; stages: Record<string, Record<string, string>> } }
>;
const languages = { en: enLabs as unknown as Copy, tr: trLabs as unknown as Copy };
const tours = TOURS as unknown as Record<
  string,
  Record<string, readonly { id: string; action?: { kind: string; to?: number } }[]>
>;

describe("guided tours", () => {
  it("covers every lab on the home page", () => {
    for (const { meta } of orderedLabs()) {
      expect(tourFor(meta.slug), meta.slug).toBeDefined();
    }
  });

  it("names the same stages, in the same order, as the copy does", () => {
    // Order is meaning here: a stage gets the tour at its position on the page.
    for (const [slug, stages] of Object.entries(tours)) {
      for (const [language, copy] of Object.entries(languages)) {
        expect(Object.keys(copy[slug]?.tour?.stages ?? {}), `${language}/${slug}`).toEqual(
          Object.keys(stages),
        );
      }
    }
  });

  it("has a sentence for every step and a step for every sentence, in both languages", () => {
    for (const [slug, stages] of Object.entries(tours)) {
      for (const [stage, steps] of Object.entries(stages)) {
        const ids = steps.map((step) => step.id);
        expect(new Set(ids).size, `${slug}.${stage}: step ids repeat`).toBe(ids.length);
        expect(ids.length, `${slug}.${stage}`).toBeGreaterThan(0);
        for (const [language, copy] of Object.entries(languages)) {
          const texts = copy[slug]?.tour?.stages[stage] ?? {};
          expect(Object.keys(texts).sort(), `${language}/${slug}.${stage}`).toEqual(
            [...ids].sort(),
          );
        }
      }
    }
  });

  it("keeps the welcome and each step short enough to read beside the control", () => {
    for (const [language, copy] of Object.entries(languages)) {
      for (const [slug, lab] of Object.entries(copy)) {
        if (!lab.tour) continue;
        expect(lab.tour.intro.length, `${language}/${slug} intro`).toBeLessThanOrEqual(220);
        for (const [stage, texts] of Object.entries(lab.tour.stages)) {
          for (const [id, text] of Object.entries(texts)) {
            expect(text.length, `${language}/${slug}.${stage}.${id}`).toBeLessThanOrEqual(170);
          }
        }
      }
    }
  });

  it("only slides to a point on the track", () => {
    for (const stages of Object.values(tours)) {
      for (const steps of Object.values(stages)) {
        for (const { action } of steps) {
          if (action?.kind === "slide") {
            expect(action.to).toBeGreaterThanOrEqual(0);
            expect(action.to).toBeLessThanOrEqual(1);
          }
        }
      }
    }
  });
});
