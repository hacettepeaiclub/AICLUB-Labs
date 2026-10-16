import { describe, expect, it } from "vitest";
import { enLabs } from "@/i18n/labs/en";
import { trLabs } from "@/i18n/labs/tr";
import { orderedLabs } from "./registry";
import { GUIDES, RESOURCES } from "./learning";

type Copy = Record<
  string,
  { study?: { topics: Record<string, string>; notes: Record<string, string> } }
>;
const languages = { en: enLabs as unknown as Copy, tr: trLabs as unknown as Copy };

describe("learning guide", () => {
  it("has a guide for every lab on the home page", () => {
    for (const { meta } of orderedLabs()) {
      expect(GUIDES[meta.slug]?.length, meta.slug).toBeGreaterThan(0);
    }
  });

  it("names every idea, and says why every resource is there, in both languages", () => {
    for (const [slug, topics] of Object.entries(GUIDES)) {
      const ids = topics.flatMap((t) => t.items);
      expect(new Set(ids).size, `${slug}: a resource is listed twice`).toBe(ids.length);
      for (const [language, copy] of Object.entries(languages)) {
        const study = copy[slug]?.study;
        expect(Object.keys(study?.topics ?? {}), `${language}/${slug} topics`).toEqual(
          topics.map((t) => t.topic),
        );
        expect(Object.keys(study?.notes ?? {}).sort(), `${language}/${slug} notes`).toEqual(
          [...ids].sort(),
        );
      }
    }
  });

  it("gives every idea something to watch or read", () => {
    for (const [slug, topics] of Object.entries(GUIDES)) {
      for (const { topic, items } of topics)
        expect(items.length, `${slug}.${topic}`).toBeGreaterThan(0);
    }
  });

  it("links only to web addresses, and gives every video its length", () => {
    for (const [id, r] of Object.entries(RESOURCES)) {
      expect(r.url, id).toMatch(/^https?:\/\/[^\s]+$/);
      if (r.kind === "video" || r.kind === "lecture") {
        if (r.url.includes("youtube.com")) expect("length" in r && r.length, id).toBeTruthy();
      }
    }
  });
});
