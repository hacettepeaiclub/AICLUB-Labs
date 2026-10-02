import { describe, expect, it } from "vitest";
import { fold, search } from "./labSearch";

const entries = [
  { title: "Hash Playground", rest: "Change one character. Systems hash-playground" },
  { title: "Sorting Race", rest: "Draw the data. Algorithms sorting-race" },
  {
    title: "Gradyan İnişi",
    rest: "Bir arazinin şekli. Makine Öğrenmesi Gradient Descent gradient-descent",
  },
  { title: "Olasılık Laboratuvarı", rest: "Şansa dair. Kuram Probability Lab probability" },
  { title: "Graph Search", rest: "Algorithms pathfinding" },
];
const titles = (query: string) => search(query, entries).map((entry) => entry.title);

describe("fold", () => {
  it("makes the Turkish I's one letter, in both cases", () => {
    // `toLowerCase()` alone turns İ into i + a combining dot, and leaves ı as
    // a letter of its own — so neither would match a plain i.
    expect(fold("İstatistik")).toBe("istatistik");
    expect(fold("olasılık")).toBe("olasilik");
  });

  it("drops the diacritics a fast typist leaves out", () => {
    expect(fold("Öğrenmesi şekli çok güzel")).toBe("ogrenmesi sekli cok guzel");
  });
});

describe("search", () => {
  it("returns everything, in the order given, for an empty query", () => {
    expect(titles("")).toEqual(entries.map((entry) => entry.title));
    expect(titles("   ")).toEqual(entries.map((entry) => entry.title));
  });

  it("finds a Turkish title typed without its Turkish letters", () => {
    expect(titles("olasilik")).toEqual(["Olasılık Laboratuvarı"]);
    expect(titles("gradyan inisi")).toEqual(["Gradyan İnişi"]);
  });

  it("finds a lab by its English name while the page is in Turkish", () => {
    expect(titles("gradient")).toEqual(["Gradyan İnişi"]);
  });

  it("finds a lab by its field", () => {
    expect(titles("algorithms")).toEqual(["Sorting Race", "Graph Search"]);
  });

  it("ranks a title that starts with the query above one that only contains it", () => {
    // "gr" is also inside "Playground", which comes first in the collection —
    // and still has to come last here, behind the two titles that begin with it.
    expect(titles("gr")).toEqual(["Gradyan İnişi", "Graph Search", "Hash Playground"]);
  });

  it("needs every word of the query, not any", () => {
    expect(titles("sorting algorithms")).toEqual(["Sorting Race"]);
    expect(titles("sorting probability")).toEqual([]);
  });

  it("returns nothing, rather than everything, for a query nothing matches", () => {
    expect(titles("quantum")).toEqual([]);
  });
});
