import { describe, expect, it } from "vitest";
import { labs, nextLab, orderedLabs, publishedLabs } from "./registry";

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
      "cryptographic-hashing",
      "floating-point",
      "hash-tables",
      "sorting",
      "graph-search",
      "tokenization",
      "gradient-descent",
      "multilayer-perceptrons",
      "backpropagation",
      "convolution",
      "attention",
      "reinforcement-learning",
      "word-embeddings",
      "hypothesis-testing",
      "probability",
    ]);
  });

  it("shows every published lab, and only published labs", () => {
    // Nothing is curated away and nothing is held back behind a second click,
    // so this count is also the promise the page makes in its own heading.
    //
    // Ten no longer divides by three: the `lg:grid-cols-3` grid now ends on a
    // single card. That is a home-page layout decision rather than a registry
    // one, and it is left to the home page to answer.
    const shown = orderedLabs();
    expect(shown).toHaveLength(15);
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

describe("each lab points at the next one", () => {
  it("follows the collection's reading order", () => {
    expect(nextLab("cryptographic-hashing")?.meta.slug).toBe("floating-point");
    expect(nextLab("floating-point")?.meta.slug).toBe("hash-tables");
    expect(nextLab("hash-tables")?.meta.slug).toBe("sorting");
    expect(nextLab("multilayer-perceptrons")?.meta.slug).toBe("backpropagation");
    expect(nextLab("backpropagation")?.meta.slug).toBe("convolution");
    expect(nextLab("convolution")?.meta.slug).toBe("attention");
    expect(nextLab("tokenization")?.meta.slug).toBe("gradient-descent");
  });

  it("stops at the end rather than wrapping round to the start", () => {
    // The order is an argument with a conclusion. A loop would say something
    // else, so the last lab has no next and its page says the collection is
    // finished instead.
    const last = orderedLabs().at(-1)!.meta.slug;
    expect(nextLab(last)).toBeUndefined();
  });

  it("gives a draft, which is outside the order, no next either", () => {
    const draft = labs.find((lab) => lab.meta.draft)!.meta.slug;
    expect(nextLab(draft)).toBeUndefined();
  });

  it("gives an unknown slug nothing, rather than the first lab", () => {
    expect(nextLab("not-a-lab")).toBeUndefined();
  });
});
