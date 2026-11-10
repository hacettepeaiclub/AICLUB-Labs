import { expect, it } from "vitest";
import { publishedLabs } from "@/labs/registry";
import { journeys } from "./journeyCopy";

it("gives every published lab a complete bilingual first move and distinct concept choices", () => {
  for (const { meta } of publishedLabs()) {
    for (const language of ["en", "tr"] as const) {
      const copy = journeys[meta.slug]?.[language];
      expect(copy, `${meta.slug}/${language}`).toBeDefined();
      if (!copy) throw new Error(`Missing journey: ${meta.slug}/${language}`);
      expect(copy.every((text) => text.trim().length > 0)).toBe(true);
      expect(new Set(copy.slice(4, 7)).size).toBe(3);
    }
  }
});
