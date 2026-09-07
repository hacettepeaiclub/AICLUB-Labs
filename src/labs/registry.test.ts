import { describe, expect, it } from "vitest";
import { labs, orderedLabs, publishedLabs } from "./registry";

/**
 * The home page shows the whole collection in one grid, so the order of that
 * grid is a product decision rather than an implementation detail — it is the
 * order someone meets the ideas in. It is written down in `LAB_ORDER`, and it
 * is written down again here, because a sequence that lives in exactly one
 * place can be changed by accident.
 */
describe("the collection has an order, and it is the one we chose", () => {
  it("reads foundations first and machine learning last", () => {
    expect(orderedLabs().map((lab) => lab.meta.slug)).toEqual([
      "hash-playground",
      "sorting-race",
      "pathfinding",
      "tokenizer",
      "gradient-descent",
      "neural-playground",
      "attention",
      "reward-playground",
      "embedding-universe",
    ]);
  });

  it("shows every published lab, and only published labs", () => {
    // Nine tiles, three rows of three. Nothing is curated away and nothing is
    // held back behind a second click, so this count is also the promise the
    // page makes in its own heading.
    const shown = orderedLabs();
    expect(shown).toHaveLength(9);
    expect(shown.map((lab) => lab.meta.slug).sort()).toEqual(
      publishedLabs()
        .map((lab) => lab.meta.slug)
        .sort(),
    );
    expect(shown.some((lab) => lab.meta.draft)).toBe(false);
    // The 3-D prototype is registered and routable, and stays off the grid.
    expect(labs.some((lab) => lab.meta.draft)).toBe(true);
  });

  it("is stable — the grid never reshuffles between renders", () => {
    expect(orderedLabs().map((lab) => lab.meta.slug)).toEqual(
      orderedLabs().map((lab) => lab.meta.slug),
    );
  });
});
