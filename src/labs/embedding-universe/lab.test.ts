import { readFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { labs, publishedLabs } from "../registry";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";
import { embeddingUniverseMeta } from "./meta";
import { VOCABULARY } from "./vocabulary";
import { decodeInt16, type DatasetMeta } from "./dataset";
import { nearestNeighbours, pca, similarityRanks, totalVarianceExplained } from "./engine";
import {
  NEIGHBOUR_COUNT,
  PREDICTION,
  VIEWBOX,
  VIEW_PADDING,
  barWidth,
  decorativeStars,
  foldSearch,
  hiddenDimensions,
  labelledPoints,
  nearestPoint,
  placeLabels,
  pointRole,
  searchWords,
  toViewport,
} from "./view";

/**
 * Phase 2 gates: the interface.
 *
 * `engine.test.ts` proves the numbers are right. This file proves the interface
 * is showing *those* numbers rather than a memory of them — components are read
 * as text and fail if any vocabulary word or measured constant appears in one.
 * The repo has no DOM test runner, so the components are checked by source and
 * everything computable is checked as pure logic in `view.ts`, which is why
 * `view.ts` exists at all.
 */

const DIR = "src/labs/embedding-universe/";
const COMPONENTS = [
  "index.tsx",
  "components/UniverseMap.tsx",
  "components/PredictionCard.tsx",
  "components/NeighbourList.tsx",
  "components/WordSearch.tsx",
  "components/ProjectionReveal.tsx",
];
const read = (path: string) => readFileSync(DIR + path, "utf8");
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

const copy = en.labs["embedding-universe"];

// Real data, so the view helpers are exercised on the shipped vectors.
const meta = JSON.parse(
  readFileSync("public/labs/embedding-universe/dataset.json", "utf8"),
) as DatasetMeta;
const raw = readFileSync("public/labs/embedding-universe/" + meta.int16.file);
const set = decodeInt16(
  raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
  meta.wordCount,
  meta.dimensions,
);
const projection = pca(set.vectors, set.count, set.dimensions, 2);
const viewport = toViewport(projection, set.count);
const points = viewport.points;

// ------------------------------------------------------ registry + meta ----

describe("registry", () => {
  it("is registered once and is reachable", () => {
    const entries = labs.filter((lab) => lab.meta.slug === embeddingUniverseMeta.slug);
    expect(entries).toHaveLength(1);
    expect(publishedLabs().some((lab) => lab.meta.slug === embeddingUniverseMeta.slug)).toBe(true);
  });

  it("is lazily imported, so its dataset never loads with the home page", () => {
    expect(read("../registry.ts")).toMatch(/lazy\(\(\) => import\("\.\/embedding-universe"\)\)/);
  });

  it("has coherent metadata", () => {
    expect(embeddingUniverseMeta.category).toBe("machine-learning");
    expect(embeddingUniverseMeta.minutes).toBeGreaterThan(0);
    expect(embeddingUniverseMeta.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Set(labs.map((l) => l.meta.slug)).size).toBe(labs.length);
  });
});

// ------------------------------------------------------------- the copy ----

describe("copy", () => {
  it("exists in both languages with the same shape", () => {
    const trCopy = tr.labs["embedding-universe"];
    expect(trCopy).toBeDefined();
    expect(Object.keys(trCopy).sort()).toEqual(Object.keys(copy).sort());
  });

  it("keeps every interpolated string a function of the same arity in both languages", () => {
    const walk = (a: unknown, b: unknown, path: string) => {
      if (typeof a === "function") {
        expect({ path, arity: (b as (...args: unknown[]) => string).length }).toEqual({
          path,
          arity: (a as (...args: unknown[]) => string).length,
        });
        return;
      }
      if (typeof a === "string") {
        expect({ path, empty: (b as string).trim().length === 0 }).toEqual({ path, empty: false });
        return;
      }
      if (Array.isArray(a)) {
        expect({ path, len: (b as unknown[]).length }).toEqual({ path, len: a.length });
        return;
      }
      if (a && typeof a === "object") {
        for (const key of Object.keys(a as object)) {
          walk(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
            `${path}.${key}`,
          );
        }
      }
    };
    walk(copy, tr.labs["embedding-universe"], "embedding-universe");
  });

  it("states plainly that the space is English and Turkish labels are glosses", () => {
    for (const dict of [copy, tr.labs["embedding-universe"]]) {
      expect(dict.honesty.turkish.length).toBeGreaterThan(60);
      expect(dict.honesty.source).toMatch(/GloVe/);
      expect(dict.honesty.source).toMatch(/Gigaword/);
    }
    expect(copy.honesty.turkish).toMatch(/not a Turkish embedding space/i);
    expect(tr.labs["embedding-universe"].honesty.turkish).toMatch(/Türkçe gömme uzayı değildir/i);
  });

  /**
   * Every sentence the visitor can actually read.
   *
   * Rendered, not serialised: keys and parameter names are not copy, and
   * scanning them for banned words flags things like `scoreHeader` that no one
   * ever sees. Interpolated strings are called with a placeholder so what gets
   * checked is the sentence, exactly as it reaches the screen.
   */
  const rendered = (dict: unknown, out: string[] = []): string[] => {
    if (typeof dict === "string") out.push(dict);
    else if (typeof dict === "function") {
      const fn = dict as (...args: unknown[]) => string;
      out.push(fn(...Array.from({ length: fn.length }, () => "1")));
    } else if (Array.isArray(dict)) dict.forEach((v) => rendered(v, out));
    else if (dict && typeof dict === "object") {
      Object.values(dict as object).forEach((v) => rendered(v, out));
    }
    return out;
  };

  it("never says the embedding is only a few percent visible", () => {
    // The banned framing. The variance figure describes these axes on this
    // dataset; it does not describe how much of "the embedding" you can see.
    const all = rendered([copy, tr.labs["embedding-universe"]]).join("\n");
    expect(all).not.toMatch(/only\s+\S*%?\s*of\s+the\s+embedding/i);
    expect(all).not.toMatch(/embedding'?in\s+(yalnızca|sadece)/i);
    expect(copy.projection.varianceBody("X%", 298)).toMatch(/variance in this dataset/i);
  });

  it("forms English ordinals correctly, including the teens", () => {
    const ordinal = copy.projection.ordinal;
    const cases: Array<[number, string]> = [
      [1, "1st"],
      [2, "2nd"],
      [3, "3rd"],
      [4, "4th"],
      [11, "11th"],
      [12, "12th"],
      [13, "13th"],
      [15, "15th"],
      [21, "21st"],
      [22, "22nd"],
      [23, "23rd"],
      [101, "101st"],
      [111, "111th"],
      [317, "317th"],
    ];
    for (const [n, want] of cases) expect({ n, got: ordinal(n) }).toEqual({ n, got: want });
    // Turkish appends a period to any number, with no irregular forms.
    const trOrdinal = tr.labs["embedding-universe"].projection.ordinal;
    for (const [n] of cases) expect(trOrdinal(n)).toBe(`${n}.`);
  });

  it("does not double the percent sign in either language", () => {
    // `formatPercent` already appends "%"; a template that adds its own
    // produced "%39.5%" in Turkish.
    for (const dict of [copy, tr.labs["embedding-universe"]]) {
      const body = dict.projection.hiddenBody("a", "b", "1st", 317, "0.30", "39.5%");
      expect(body).toContain("39.5%");
      expect(body).not.toMatch(/%\s*39\.5%/);
      expect(body.match(/%/g) ?? []).toHaveLength(1);
    }
  });

  it("uses no quiz language anywhere", () => {
    const all = rendered([copy, tr.labs["embedding-universe"]]).join("\n").toLowerCase();
    for (const banned of [
      "correct",
      "incorrect",
      "wrong",
      "score",
      "points",
      "streak",
      "try again",
      "doğru cevap",
      "yanlış",
      "puan",
      "skor",
      "tekrar dene",
    ]) {
      expect({ banned, found: all.includes(banned) }).toEqual({ banned, found: false });
    }
  });
});

// ------------------------------------------------ no hardcoded results -----

describe("nothing displayed is written down", () => {
  it("no component contains a vocabulary word as a string literal", () => {
    const words = new Set(VOCABULARY.map((w) => w.id.toLowerCase()));
    for (const file of COMPONENTS) {
      // Structural JSX attributes are markup, not content. `type="button"` is
      // not the lab naming a word, and `button` happens to be in the vocabulary
      // — so these are removed before the scan rather than allow-listed after.
      const code = stripComments(read(file))
        .replace(/\b(?:type|role|autoComplete|inputMode|htmlFor|textAnchor|fill)="[^"]*"/g, "")
        .replace(/\baria-[a-zA-Z]+="[^"]*"/g, "");
      const literals = [...code.matchAll(/"([^"\\]*)"|'([^'\\]*)'/g)].map((m) => m[1] ?? m[2] ?? "");
      for (const literal of literals) {
        expect({ file, literal, isWord: words.has(literal.trim().toLowerCase()) }).toMatchObject({
          isWord: false,
        });
      }
    }
  });

  it("no component contains a measured engine output", () => {
    // Every number section 2 shows, as it appears at three decimal places or
    // more. If one of these ever turns up in a component, the lab has stopped
    // reporting and started reciting.
    for (const file of COMPONENTS) {
      const code = stripComments(read(file));
      expect({ file, found: code.match(/\b\d+\.\d{3,}\b/g) ?? [] }).toMatchObject({ found: [] });
      expect({ file, found: code.match(/\b0\.29\d|\b39\.\d|\b9\.54\d/g) ?? [] }).toMatchObject({
        found: [],
      });
    }
  });

  it("the section-2 pair words come from distortion(), not from the component", () => {
    const code = stripComments(read("components/ProjectionReveal.tsx"));
    // It is handed pairs and looks their words up by index. It cannot name one.
    expect(code).toMatch(/hidden\.a|hidden\.b/);
    expect(code).toMatch(/falsePair\./);
    expect(code).toMatch(/vocabulary\[index\]/);
    expect(code).not.toMatch(/VOCABULARY/);
  });

  it("the variance figure comes from varianceExplained(), not from the component", () => {
    expect(stripComments(read("index.tsx"))).toMatch(/varianceExplained\(/);
    expect(stripComments(read("index.tsx"))).toMatch(/totalVarianceExplained\(/);
    const reveal = stripComments(read("components/ProjectionReveal.tsx"));
    expect(reveal).toMatch(/formatPercent\(combined/);
    expect(reveal).not.toMatch(/varianceExplained\(/);
  });

  it("the engine is reached only through the hook", () => {
    for (const file of COMPONENTS.filter((f) => f !== "index.tsx")) {
      const code = stripComments(read(file));
      expect({ file, callsPca: /\bpca\(/.test(code) }).toMatchObject({ callsPca: false });
      expect({ file, callsDistortion: /\bdistortion\(/.test(code) }).toMatchObject({
        callsDistortion: false,
      });
    }
    expect(stripComments(read("useUniverse.ts"))).toMatch(/pca\(/);
    expect(stripComments(read("useUniverse.ts"))).toMatch(/distortion\(/);
  });

  it("the prediction words live in view.ts as an editorial choice, not in a component", () => {
    expect(PREDICTION.anchor.length).toBeGreaterThan(0);
    expect(PREDICTION.candidates).toHaveLength(3);
    for (const id of [PREDICTION.anchor, ...PREDICTION.candidates]) {
      expect(VOCABULARY.some((w) => w.id === id)).toBe(true);
    }
    expect(stripComments(read("index.tsx"))).toMatch(/PREDICTION\.candidates/);
  });
});

// ------------------------------------------------ the prediction is fair ---

describe("the prediction cannot be scored", () => {
  const anchorIndex = VOCABULARY.findIndex((w) => w.id === PREDICTION.anchor);
  const ranks = similarityRanks(set.vectors, set.count, set.dimensions);

  it("every candidate is a genuine near neighbour, so no choice is a mistake", () => {
    for (const id of PREDICTION.candidates) {
      const index = VOCABULARY.findIndex((w) => w.id === id);
      const rank = ranks[anchorIndex * set.count + index] as number;
      // Comfortably inside the top ten percent of 318 words. This is the
      // property that makes the reveal a comparison rather than a verdict.
      expect({ id, rank, ok: rank > 0 && rank <= set.count * 0.1 }).toMatchObject({ ok: true });
    }
  });

  it("exactly one candidate is the nearest word, and it is the surprising one", () => {
    const nearest = nearestNeighbours(set.vectors, set.count, set.dimensions, anchorIndex, 1)[0];
    const winners = PREDICTION.candidates.filter(
      (id) => VOCABULARY.findIndex((w) => w.id === id) === nearest?.index,
    );
    expect(winners).toHaveLength(1);
  });
});

// ------------------------------------------------------------ view logic ---

describe("search folding", () => {
  it("folds Turkish diacritics in both directions", () => {
    const pairs: Array<[string, string]> = [
      ["saç", "sac"],
      ["SAÇ", "sac"],
      ["köpek", "kopek"],
      ["KÖPEK", "kopek"],
      ["ağaç", "agac"],
      ["şeker", "seker"],
      ["ördek", "ordek"],
      ["üzüm", "uzum"],
      ["ılık", "ilik"],
      ["İstanbul", "istanbul"],
    ];
    for (const [input, expected] of pairs) {
      expect({ input, folded: foldSearch(input) }).toEqual({ input, folded: expected });
    }
  });

  it("finds an English word by typing its Turkish gloss, with or without diacritics", () => {
    const dog = VOCABULARY.find((w) => w.tr === foldSearch(w.tr) ? false : true);
    expect(dog).toBeDefined();
    for (const item of VOCABULARY.slice(0, 40)) {
      const byGloss = searchWords(VOCABULARY, item.tr, 20);
      expect({ tr: item.tr, found: byGloss.some((h) => h.item.id === item.id) }).toMatchObject({
        found: true,
      });
      const folded = searchWords(VOCABULARY, foldSearch(item.tr), 20);
      expect({ tr: item.tr, found: folded.some((h) => h.item.id === item.id) }).toMatchObject({
        found: true,
      });
    }
  });

  it("finds every word by its own English label", () => {
    for (const item of VOCABULARY) {
      const hits = searchWords(VOCABULARY, item.en, 20);
      expect({ en: item.en, found: hits.some((h) => h.item.id === item.id) }).toMatchObject({
        found: true,
      });
    }
  });

  it("prefers a prefix match over an interior one", () => {
    const hits = searchWords(VOCABULARY, "car", 8);
    expect(hits[0]?.item.en.startsWith("car")).toBe(true);
  });

  it("returns nothing for an empty query and for nonsense", () => {
    expect(searchWords(VOCABULARY, "")).toHaveLength(0);
    expect(searchWords(VOCABULARY, "   ")).toHaveLength(0);
    expect(searchWords(VOCABULARY, "zzzzqq")).toHaveLength(0);
  });
});

describe("viewport mapping", () => {
  it("puts every point inside the padded frame", () => {
    expect(points).toHaveLength(set.count);
    for (const point of points) {
      expect(point.x).toBeGreaterThanOrEqual(VIEW_PADDING - 1e-9);
      expect(point.x).toBeLessThanOrEqual(viewport.width - VIEW_PADDING + 1e-9);
      expect(point.y).toBeGreaterThanOrEqual(VIEW_PADDING - 1e-9);
      expect(point.y).toBeLessThanOrEqual(viewport.height - VIEW_PADDING + 1e-9);
      expect(Number.isFinite(point.x) && Number.isFinite(point.y)).toBe(true);
    }
  });

  it("sizes the frame to the data, leaving no dead margin on either axis", () => {
    const spanX = Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x));
    const spanY = Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y));
    // The cloud touches the padding on all four sides: that is what makes the
    // map fillable instead of a square with a fifth of it permanently blank.
    expect(spanX).toBeCloseTo(viewport.width - VIEW_PADDING * 2, 6);
    expect(spanY).toBeCloseTo(viewport.height - VIEW_PADDING * 2, 6);
    expect(Math.max(viewport.width, viewport.height)).toBeCloseTo(VIEWBOX, 6);
    // Not square, and not stretched to become square.
    expect(viewport.width).not.toBeCloseTo(viewport.height, 1);
  });

  it("uses one scale for both axes, so the cloud is not distorted", () => {
    const coords = projection.coordinates;
    let dataX = -Infinity;
    let dataY = -Infinity;
    let minX = Infinity;
    let minY = Infinity;
    for (let i = 0; i < set.count; i++) {
      minX = Math.min(minX, coords[i * 2] as number);
      minY = Math.min(minY, coords[i * 2 + 1] as number);
      dataX = Math.max(dataX, coords[i * 2] as number);
      dataY = Math.max(dataY, coords[i * 2 + 1] as number);
    }
    const spanX = Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x));
    const spanY = Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y));
    // Screen aspect must equal data aspect exactly — one scale factor, both axes.
    expect(spanX / spanY).toBeCloseTo((dataX - minX) / (dataY - minY), 9);
  });

  it("preserves relative distances up to the single scale factor", () => {
    const coords = projection.coordinates;
    const d2 = (i: number, j: number) =>
      Math.hypot(
        (coords[i * 2] as number) - (coords[j * 2] as number),
        (coords[i * 2 + 1] as number) - (coords[j * 2 + 1] as number),
      );
    const dv = (i: number, j: number) =>
      Math.hypot(points[i]!.x - points[j]!.x, points[i]!.y - points[j]!.y);
    const scale = dv(0, 1) / d2(0, 1);
    for (let i = 0; i < 40; i++) {
      const a = i * 3;
      const b = (i * 7 + 5) % set.count;
      if (a === b || a >= set.count) continue;
      expect(dv(a, b)).toBeCloseTo(d2(a, b) * scale, 6);
    }
  });
});

describe("nearest-point hit testing", () => {
  it("agrees with brute force across the frame", () => {
    for (let gx = 0; gx <= 20; gx++) {
      for (let gy = 0; gy <= 20; gy++) {
        const x = (gx / 20) * VIEWBOX;
        const y = (gy / 20) * VIEWBOX;
        let best = -1;
        let bestDistance = Infinity;
        points.forEach((point, index) => {
          const distance = Math.hypot(point.x - x, point.y - y);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        const got = nearestPoint(points, x, y);
        if (bestDistance <= 12) expect({ x, y, got }).toEqual({ x, y, got: best });
        else expect({ x, y, got }).toEqual({ x, y, got: null });
      }
    }
  });

  it("returns the point itself when asked at its own position", () => {
    for (let i = 0; i < set.count; i += 17) {
      expect(nearestPoint(points, points[i]!.x, points[i]!.y)).toBe(i);
    }
  });

  it("gives up rather than selecting something far away", () => {
    expect(nearestPoint(points, -500, -500)).toBeNull();
  });
});

describe("labels and roles", () => {
  const neighbours = nearestNeighbours(set.vectors, set.count, set.dimensions, 0, NEIGHBOUR_COUNT);

  it("labels the selection, its neighbours and the hover — and nothing else", () => {
    const labels = labelledPoints(0, neighbours, 5, []);
    expect(labels.has(0)).toBe(true);
    for (const n of neighbours) expect(labels.has(n.index)).toBe(true);
    expect(labels.has(5)).toBe(true);
    expect(labels.size).toBeLessThanOrEqual(NEIGHBOUR_COUNT + 2);
    // Never 318 labels: that is the thing that would make this SVG expensive.
    expect(labels.size).toBeLessThan(set.count / 10);
  });

  it("labels only the highlighted pair when section 2 is driving", () => {
    const labels = labelledPoints(0, neighbours, 7, [40, 90]);
    expect([...labels].sort((a, b) => a - b)).toEqual([40, 90]);
    // the previous selection and its neighbours stop competing for attention
    expect(labels.has(0)).toBe(false);
    for (const n of neighbours) expect(labels.has(n.index)).toBe(false);
  });

  it("dims everything except the pair while a distortion mode is on", () => {
    const indices = new Set(neighbours.map((n) => n.index));
    expect(pointRole(40, 0, indices, [40, 90])).toBe("highlighted");
    expect(pointRole(0, 0, indices, [40, 90])).toBe("dimmed");
    expect(pointRole(0, 0, indices, [])).toBe("selected");
    expect(pointRole(neighbours[0]!.index, 0, indices, [])).toBe("neighbour");
    expect(pointRole(311, 0, indices, [])).toBe("base");
  });

  it("drops labels that would print on top of each other, keeping the first", () => {
    const at = (x: number, y: number, text: string) => ({
      index: Math.round(x * 1000 + y),
      text,
      size: 3,
      point: { x, y },
    });
    // Three words stacked on the same spot: only the highest priority survives.
    const stacked = placeLabels([at(50, 50, "first"), at(50, 50, "second"), at(50, 51, "third")]);
    expect(stacked).toHaveLength(1);
    expect(stacked[0]?.text).toBe("first");

    // Far apart, all survive.
    const spread = placeLabels([at(10, 10, "one"), at(50, 50, "two"), at(90, 90, "three")]);
    expect(spread).toHaveLength(3);
  });

  it("never drops a pinned label, even on a coincident point", () => {
    // The false-neighbour pair sits almost on top of itself — that is the
    // finding — so both words have to survive or section 2 shows one blob.
    const pair = [
      { index: 1, text: "hair", size: 2.8, point: { x: 50, y: 50 }, pinned: true },
      { index: 2, text: "dolphin", size: 2.8, point: { x: 50.1, y: 50.1 }, pinned: true },
    ];
    const placed = placeLabels(pair);
    expect(placed).toHaveLength(2);
    expect(placed.map((p) => p.text).sort()).toEqual(["dolphin", "hair"]);
    // and they must not be printed on the same line
    expect(Math.abs((placed[0]?.y ?? 0) - (placed[1]?.y ?? 0))).toBeGreaterThan(2);
  });

  it("keeps every label inside the frame, so nothing is clipped", () => {
    const edges = [
      { index: 1, text: "tomato", size: 2.8, point: { x: VIEWBOX - 1, y: 50 } },
      { index: 2, text: "hardware", size: 2.8, point: { x: 0.5, y: 50 } },
      { index: 3, text: "top", size: 2.8, point: { x: 50, y: 0.2 } },
    ];
    for (const placed of placeLabels(edges)) {
      const half = (placed.text.length * placed.size * 0.6) / 2;
      // Strictly inside, not flush: a word touching the border reads as cut off
      // even when every letter of it is drawn.
      expect(placed.x - half).toBeGreaterThan(0);
      expect(placed.x + half).toBeLessThan(VIEWBOX);
      expect(placed.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("never drops the first label, whatever it collides with", () => {
    const many = Array.from({ length: 9 }, (_, i) => ({
      index: i,
      text: "overlapping",
      size: 3,
      point: { x: 50, y: 50 },
    }));
    const placed = placeLabels(many);
    expect(placed).toHaveLength(1);
    expect(placed[0]?.index).toBe(0);
  });

  it("names every neighbour on the real map, never two stars to one label", () => {
    // The identity question this map exists to answer: if a label is dropped
    // because two neighbours landed close together, one word is left unnamed
    // and its star is indistinguishable from the three hundred around it.
    const neighboursHere = nearestNeighbours(set.vectors, set.count, set.dimensions, 0, NEIGHBOUR_COUNT);
    const order = [0, ...neighboursHere.map((n) => n.index)];
    const placed = placeLabels(
      order.flatMap((index) => {
        const point = points[index];
        const item = VOCABULARY[index];
        return point && item
          ? [{ index, text: item.en, size: index === 0 ? 4.4 : 3.3, point, pinned: true }]
          : [];
      }),
      viewport.width,
      viewport.height,
    );
    expect(placed).toHaveLength(order.length);
    expect(new Set(placed.map((p) => p.index)).size).toBe(order.length);
  });

  it("declutters the real map without hiding the selection", () => {
    const neighboursHere = nearestNeighbours(set.vectors, set.count, set.dimensions, 0, NEIGHBOUR_COUNT);
    const order = [0, ...neighboursHere.map((n) => n.index)];
    const placed = placeLabels(
      order.flatMap((index) => {
        const point = points[index];
        const item = VOCABULARY[index];
        return point && item
          ? [{ index, text: item.en, size: index === 0 ? 3.4 : 2.8, point }]
          : [];
      }),
    );
    expect(placed[0]?.index).toBe(0);
    expect(placed.length).toBeLessThanOrEqual(order.length);
    // Whatever survives must genuinely not overlap.
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i]!;
        const b = placed[j]!;
        const aw = (a.text.length * a.size * 0.6) / 2;
        const bw = (b.text.length * b.size * 0.6) / 2;
        const overlaps =
          Math.abs(a.x - b.x) < aw + bw && Math.abs(a.y - b.y) < (a.size + b.size) * 0.65;
        expect({ a: a.text, b: b.text, overlaps }).toMatchObject({ overlaps: false });
      }
    }
  });

  it("scales bars against the strongest neighbour and clamps negatives", () => {
    expect(barWidth(0.5, 0.5)).toBe(100);
    expect(barWidth(0.25, 0.5)).toBe(50);
    expect(barWidth(-0.2, 0.5)).toBe(0);
    expect(barWidth(0.5, 0)).toBe(0);
  });
});

describe("derived figures", () => {
  it("derives the hidden dimensions rather than stating them", () => {
    expect(hiddenDimensions(set.dimensions, 2)).toBe(set.dimensions - 2);
    expect(hiddenDimensions(meta.dimensions, 2)).toBe(298);
  });

  it("the variance the lab shows is the variance the engine computed", () => {
    const share = totalVarianceExplained(projection);
    expect(share).toBeGreaterThan(0);
    expect(share).toBeLessThan(0.5);
    // The sentence is built from the engine's number, whatever it happens to be.
    expect(copy.projection.varianceBody(`${(share * 100).toFixed(4)}%`, 298)).toContain(
      `${(share * 100).toFixed(4)}%`,
    );
  });
});

// --------------------------------------------------- decoration vs data ----

describe("decorative stars are decoration and nothing else", () => {
  const stars = decorativeStars(viewport.width, viewport.height);

  it("are seeded, so the background never reshuffles between loads", () => {
    expect(decorativeStars(viewport.width, viewport.height)).toEqual(stars);
  });

  it("are few, and stay inside the frame", () => {
    expect(stars.length).toBeGreaterThan(15);
    expect(stars.length).toBeLessThan(40);
    for (const star of stars) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(viewport.width);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(viewport.height);
    }
  });

  it("are far fainter than the faintest real point, so the two never blur together", () => {
    // A base embedding point renders at 0.5 opacity. Decoration tops out well
    // below that; if it ever crept up, a viewer could mistake it for a word.
    for (const star of stars) {
      expect(star.opacity).toBeLessThan(0.15);
      expect(star.opacity).toBeGreaterThan(0);
    }
    expect(Math.max(...stars.map((s) => s.opacity))).toBeLessThan(0.5 / 3);
  });

  it("cannot be selected: hit testing only ever sees embedding points", () => {
    // `nearestPoint` is given the projection's points and nothing else, so no
    // pointer, tap or keystroke can land on decoration.
    const source = stripComments(read("components/UniverseMap.tsx"));
    expect(source).toMatch(/nearestPoint\(points,/);
    expect(source).not.toMatch(/nearestPoint\(stars/);
    // Every decorative shape — nebula fields, contour rings, drifting stars —
    // lives inside the one aria-hidden, pointer-events-none group, which ends
    // where the pointer surface begins. Bounded on code, not on a comment:
    // comments are stripped above, and a missing marker would silently widen
    // this slice until it swallowed the data layer and passed for the wrong
    // reason.
    const decorStart = source.indexOf('aria-hidden="true"');
    const decorEnd = source.indexOf("<rect", decorStart);
    expect(decorStart).toBeGreaterThan(-1);
    expect(decorEnd).toBeGreaterThan(decorStart);
    const decor = source.slice(decorStart, decorEnd);
    expect(decor).toMatch(/pointer-events-none/);
    expect(decor).toMatch(/stars\.map/);
    expect(decor).toMatch(/rings\.map/);
    expect(decor).not.toMatch(/role="option"/);
  });

  it("only decoration is animated, and only when motion is allowed", () => {
    const source = read("components/UniverseMap.tsx");
    // The keyframes exist at all only when motion is permitted.
    expect(source).toMatch(/!reduced && \(\s*<style>/);
    // Every `animation:` in the file is guarded on `reduced`.
    for (const at of [...source.matchAll(/animation:/g)].map((m) => m.index ?? 0)) {
      const before = source.slice(Math.max(0, at - 220), at);
      expect({ at, guarded: /reduced/.test(before) }).toMatchObject({ guarded: true });
    }
    // Only the decorative drift moves anything. The other two keyframes are
    // opacity-only, so nothing that carries data can ever change position.
    const keyframes = source.slice(source.indexOf("@keyframes"), source.indexOf("</style>"));
    const moving = [...keyframes.matchAll(/@keyframes\s+([\w-]+)\s*\{([^@]*?)\}\s*(?=@|$)/g)].filter(
      (m) => /transform|translate|\bcx\b|\bcy\b/.test(m[2] ?? ""),
    );
    expect(moving.map((m) => m[1])).toEqual(["eu-drift"]);
    // …and the drift is applied inside the decorative group only.
    const decor = source.slice(
      source.indexOf('aria-hidden="true"'),
      source.indexOf("One transparent surface"),
    );
    expect(decor).toMatch(/eu-drift/);
    expect(source.slice(source.indexOf("the 318 words"))).not.toMatch(/eu-drift/);
  });

  it("no embedding point is moved by anything", () => {
    const source = read("components/UniverseMap.tsx");
    const pointsBlock = source.slice(
      source.indexOf("the 318 words"),
      source.indexOf("Drawn focus indicator"),
    );
    // A selected star may pulse — that is opacity. Nothing may translate it.
    expect(pointsBlock).not.toMatch(/transform=/);
    expect(pointsBlock).not.toMatch(/eu-drift/);
    expect(pointsBlock).toMatch(/cx=\{point\.x\}/);
    expect(pointsBlock).toMatch(/cy=\{point\.y\}/);
  });
});

describe("embedding coordinates are stable", () => {
  it("are a pure function of the projection, unaffected by decoration", () => {
    const again = toViewport(projection, set.count);
    expect(again.points).toEqual(points);
    expect(again.width).toBe(viewport.width);
    expect(again.height).toBe(viewport.height);
  });

  it("keep every pairwise distance proportional to the projection's own", () => {
    const coords = projection.coordinates;
    const d2 = (i: number, j: number) =>
      Math.hypot(
        (coords[i * 2] as number) - (coords[j * 2] as number),
        (coords[i * 2 + 1] as number) - (coords[j * 2 + 1] as number),
      );
    const dv = (i: number, j: number) =>
      Math.hypot(
        (points[i]?.x ?? 0) - (points[j]?.x ?? 0),
        (points[i]?.y ?? 0) - (points[j]?.y ?? 0),
      );
    const scale = dv(0, 1) / d2(0, 1);
    for (let i = 2; i < set.count; i += 11) {
      expect(dv(0, i)).toBeCloseTo(d2(0, i) * scale, 6);
    }
  });
});

// ------------------------------------------------------ styling tokens ----

describe("colour utilities name tokens that actually exist", () => {
  /**
   * Tailwind silently emits nothing for an undefined colour.
   *
   * `bg-bg` and `ring-offset-bg` both looked plausible and both produced no CSS
   * at all, which left the sticky map transparent and the list scrolling
   * visibly through it. Neither the compiler nor a DOM assertion can see that —
   * the class is on the element, it just does nothing — so it is checked here.
   */
  const config = readFileSync("tailwind.config.ts", "utf8");
  const groups = new Set(
    [...config.matchAll(/^\s{8}([a-z][a-zA-Z0-9]*): \{/gm)].map((m) => m[1] as string),
  );
  const known = new Set([
    ...groups,
    "transparent",
    "current",
    "inherit",
    "white",
    "black",
    "none",
    // Structural ring utilities, not colours: `ring-offset-2` and `ring-inset`
    // both look like `ring-<name>` to the pattern below.
    "offset",
    "inset",
  ]);

  it("every bg / fill / stroke / ring utility resolves", () => {
    for (const file of COMPONENTS) {
      const source = read(file);
      const used = [...source.matchAll(/\b(?:bg|fill|stroke|ring-offset|ring)-([a-z][a-zA-Z0-9]*)/g)];
      for (const match of used) {
        const base = match[1] as string;
        expect({ file, utility: match[0], base, known: known.has(base) }).toMatchObject({
          known: true,
        });
      }
    }
  });

  it("the map is the hero: full column width, shaped by the data", () => {
    // Comments stripped: this is about what the class list does, and the
    // comments here explain what it used to do.
    const source = stripComments(read("components/UniverseMap.tsx"));
    // Sized by the cloud's own extent rather than forced square, and no longer
    // capped against viewport height — that cap only ever existed to stop a
    // sticky block swallowing the page, and nothing is sticky now.
    expect(source).toMatch(/aspect-\[\d+\/\d+\]/);
    expect(source).toMatch(/max-w-\[\d+rem\]/);
    expect(source).not.toMatch(/42vh|min\(34rem/);
    expect(stripComments(read("index.tsx"))).not.toMatch(/\bsticky\b/);
  });
});

// ------------------------------------------------------- shipped assets ----

describe("assets", () => {
  it("only the int16 file is in the served tree", () => {
    expect(existsSync("public/labs/embedding-universe/vectors.i16.bin")).toBe(true);
    expect(existsSync("public/labs/embedding-universe/vectors.f32.bin")).toBe(false);
  });

  it("the float32 reference is kept, outside the served tree", () => {
    expect(existsSync(DIR + "fixtures/vectors.f32.bin")).toBe(true);
  });

  it("no runtime module reads the float32 reference", () => {
    for (const file of [...COMPONENTS, "useUniverse.ts", "view.ts"]) {
      expect({ file, reads: read(file).includes("f32.bin") }).toMatchObject({ reads: false });
    }
    // The hook asks for whatever `dataset.json` names as the int16 file, so it
    // cannot drift into requesting the reference.
    expect(stripComments(read("useUniverse.ts"))).toMatch(/meta\.int16\.file/);
  });

  it("if the build has run, the reference is absent from dist", () => {
    if (!existsSync("dist")) return;
    expect(existsSync("dist/labs/embedding-universe/vectors.f32.bin")).toBe(false);
    expect(existsSync("dist/labs/embedding-universe/vectors.i16.bin")).toBe(true);
  });
});
