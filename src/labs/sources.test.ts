import { describe, expect, it } from "vitest";
import { enLabs } from "@/i18n/labs/en";
import { trLabs } from "@/i18n/labs/tr";
import { SOURCES, formatSource, type SourceId } from "./sources";

/**
 * The bibliography is held to its registers.
 *
 * These are not "a Sources section exists" tests. Every DOI, year and venue
 * below was read from the DOI registry, the arXiv API or the book itself, and
 * is pinned here so that a later edit cannot quietly alter a citation into
 * something that no longer resolves.
 */

/** Exactly what each register returned, field by field. */
const VERIFIED: Record<SourceId, { year: number | null; doi: string | null; mustSay: string }> = {
  astar: { year: 1968, doi: "10.1109/TSSC.1968.300136", mustSay: "Hart" },
  dijkstra: { year: 1959, doi: "10.1007/BF01386390", mustSay: "Dijkstra" },
  backpropagation: { year: 1986, doi: "10.1038/323533a0", mustSay: "Rumelhart" },
  qLearning: { year: 1992, doi: "10.1007/BF00992698", mustSay: "Watkins" },
  gloveVectors: { year: 2014, doi: "10.3115/v1/D14-1162", mustSay: "Pennington" },
  subwordBpe: { year: 2016, doi: "10.18653/v1/P16-1162", mustSay: "Sennrich" },
  transformer: { year: 2017, doi: null, mustSay: "Vaswani" },
  adam: { year: 2015, doi: null, mustSay: "Kingma" },
  momentum: { year: 1964, doi: "10.1016/0041-5553(64)90137-5", mustSay: "Polyak" },
  simpson: { year: 1951, doi: "10.1111/j.2517-6161.1951.tb00088.x", mustSay: "Simpson" },
  sha2: { year: 2015, doi: "10.6028/NIST.FIPS.180-4", mustSay: "National Institute" },
  statisticalInference: { year: null, doi: null, mustSay: "Casella" },
  ieee754: { year: 2019, doi: "10.1109/IEEESTD.2019.8766229", mustSay: "IEEE" },
  goldberg: { year: 1991, doi: "10.1145/103162.103163", mustSay: "Goldberg" },
  ecma262: { year: 2024, doi: null, mustSay: "Ecma International" },
  bfloat16: { year: 2019, doi: null, mustSay: "Kalamkar" },
  mixedPrecision: { year: 2018, doi: null, mustSay: "Micikevicius" },
  lecunZip: { year: 1989, doi: "10.1162/neco.1989.1.4.541", mustSay: "LeCun" },
  convArithmetic: { year: 2016, doi: null, mustSay: "Dumoulin" },
  vgg: { year: 2015, doi: null, mustSay: "Simonyan" },
  alexnet: { year: 2017, doi: "10.1145/3065386", mustSay: "Krizhevsky" },
  hubelWiesel: { year: 1962, doi: "10.1113/jphysiol.1962.sp006837", mustSay: "Hubel" },
  peterson: { year: 1957, doi: "10.1147/rd.12.0130", mustSay: "Peterson" },
  linearProbing: { year: 1998, doi: "10.1007/PL00009236", mustSay: "Flajolet" },
  birthday: { year: 1966, doi: "10.2307/2315408", mustSay: "McKinney" },
  amortized: { year: 1985, doi: "10.1137/0606031", mustSay: "Tarjan" },
  javaApi: { year: 2023, doi: null, mustSay: "Oracle" },
};

/** Every lab that carries the shared Sources section, and what it cites. */
const LAB_SOURCES: Record<string, readonly SourceId[]> = {
  pathfinding: ["astar", "dijkstra"],
  "neural-playground": ["backpropagation"],
  "reward-playground": ["qLearning"],
  "embedding-universe": ["gloveVectors"],
  "embedding-universe-3d": ["gloveVectors"],
  tokenizer: ["subwordBpe"],
  attention: ["transformer"],
  "gradient-descent": ["momentum", "adam"],
  "hash-playground": ["sha2"],
  probability: ["statisticalInference", "simpson"],
  "floating-point": ["ieee754", "goldberg", "ecma262", "bfloat16", "mixedPrecision"],
  convolution: ["lecunZip", "convArithmetic", "vgg", "alexnet", "hubelWiesel"],
  "hash-table": ["peterson", "linearProbing", "birthday", "amortized", "javaApi"],
};

type Dict = typeof enLabs;
const labBlock = (dict: Dict, slug: string): Record<string, unknown> =>
  (dict as unknown as Record<string, Record<string, unknown>>)[slug] ?? {};

describe("the verified bibliography", () => {
  it("carries the exact year and DOI each register returned", () => {
    for (const [id, expected] of Object.entries(VERIFIED) as [
      SourceId,
      (typeof VERIFIED)[SourceId],
    ][]) {
      const source = SOURCES[id];
      expect({ id, year: source.year }).toEqual({ id, year: expected.year });
      expect({ id, doi: source.doi }).toEqual({ id, doi: expected.doi });
      expect({ id, named: source.authors.includes(expected.mustSay) }).toEqual({
        id,
        named: true,
      });
    }
  });

  it("claims no bibliographic field it could not verify", () => {
    for (const id of Object.keys(SOURCES) as SourceId[]) {
      const source = SOURCES[id];
      expect(source.authors.length, id).toBeGreaterThan(3);
      expect(source.title.length, id).toBeGreaterThan(5);
      expect(source.venue.length, id).toBeGreaterThan(5);
      // A work without a DOI must offer a stable address instead, or nothing.
      if (source.doi === null && source.url !== null) {
        expect(source.url, id).toMatch(/^https:\/\//);
      }
      // The textbook is the one entry with no year, because the copy read for
      // this work carries no copyright page. Everything else has one.
      if (id !== "statisticalInference") expect(source.year, id).not.toBeNull();
    }
  });

  it("holds no placeholder anywhere", () => {
    const all = JSON.stringify(SOURCES).toLowerCase();
    for (const banned of [
      "todo",
      "tbd",
      "xx",
      "lorem",
      "placeholder",
      "example.com",
      "forthcoming",
    ]) {
      expect({ banned, found: all.includes(banned) }).toEqual({ banned, found: false });
    }
  });

  it("formats a citation without inventing punctuation around a missing year", () => {
    expect(formatSource("astar")).toContain("(1968)");
    expect(formatSource("astar")).toContain("Hart, P. E., Nilsson, N. J., & Raphael, B.");
    // No year, and therefore no empty parentheses.
    expect(formatSource("statisticalInference")).not.toMatch(/\(\s*\)/);
    expect(formatSource("statisticalInference")).toContain("Casella");
    // And no doubled full stop where the author list already ends in one.
    for (const id of Object.keys(SOURCES) as SourceId[]) {
      expect(formatSource(id), id).not.toMatch(/\.\./);
    }
  });
});

describe("each lab's sources", () => {
  it("cites only records that exist, in both languages", () => {
    for (const [slug, ids] of Object.entries(LAB_SOURCES)) {
      for (const dict of [enLabs, trLabs]) {
        const block = labBlock(dict as Dict, slug);
        const sources = block.sources as Record<string, string> | undefined;
        expect(sources, slug).toBeDefined();
        expect(typeof sources?.title, slug).toBe("string");
        expect((sources?.title ?? "").length, slug).toBeGreaterThan(3);
        for (const id of ids) {
          expect({ slug, id, present: typeof sources?.[id] === "string" }).toEqual({
            slug,
            id,
            present: true,
          });
          expect(SOURCES[id], `${slug} cites an unknown record ${id}`).toBeDefined();
        }
      }
    }
  });

  it("keeps EN and TR source keys in exact parity", () => {
    for (const slug of Object.keys(LAB_SOURCES)) {
      const enKeys = Object.keys(labBlock(enLabs, slug).sources as object).sort();
      const trKeys = Object.keys(labBlock(trLabs, slug).sources as object).sort();
      expect({ slug, keys: trKeys }).toEqual({ slug, keys: enKeys });
    }
  });

  it("explains what every source supports, in both languages, with no stub", () => {
    for (const [slug, ids] of Object.entries(LAB_SOURCES)) {
      for (const [name, dict] of [
        ["en", enLabs],
        ["tr", trLabs],
      ] as const) {
        const sources = labBlock(dict as Dict, slug).sources as Record<string, string>;
        for (const id of ids) {
          const text = sources[id] ?? "";
          expect({ slug, name, id, long: text.length > 40 }).toEqual({
            slug,
            name,
            id,
            long: true,
          });
          for (const banned of ["TODO", "TBD", "lorem", "placeholder"]) {
            expect({ slug, id, banned, found: text.includes(banned) }).toEqual({
              slug,
              id,
              banned,
              found: false,
            });
          }
        }
      }
    }
  });

  it("does not claim a source describes our implementation", () => {
    // A source supports a method; it does not describe this lab. If that ever
    // stops being true of the wording, the claim has been overstated.
    for (const [slug, ids] of Object.entries(LAB_SOURCES)) {
      const sources = labBlock(enLabs, slug).sources as Record<string, string>;
      for (const id of ids) {
        const text = (sources[id] ?? "").toLowerCase();
        for (const banned of [
          "describes this lab",
          "this paper describes our",
          "is our implementation",
        ]) {
          expect({ slug, id, banned, found: text.includes(banned) }).toEqual({
            slug,
            id,
            banned,
            found: false,
          });
        }
      }
    }
  });

  it("leaves a lab with no verified source uncited rather than padded", () => {
    // Sorting Race has no source that met the standard. It must not grow an
    // empty Sources section for symmetry.
    const sorting = labBlock(enLabs, "sorting-race");
    expect(sorting.sources).toBeUndefined();
  });

  it("preserves the Hypothesis Testing grounding untouched", () => {
    // That lab has its own, older sources shape, page-verified against the
    // book. This pass must not have flattened it into the shared one.
    const ht = labBlock(enLabs, "hypothesis-testing").sources as Record<string, string>;
    expect(ht.theory).toContain("Casella");
    expect(ht.theory).toContain("2nd edition");
    expect(ht.notation).toContain("Def. 8.3.1");
    expect(ht.pages).toContain("No publication year");
  });
});
