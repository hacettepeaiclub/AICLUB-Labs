import { describe, expect, it } from "vitest";
import { en } from "./en";
import { tr } from "./tr";

type Node = Record<string, unknown>;

/** Every leaf path in a dictionary, as dotted keys. */
function paths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [`${prefix}[]`];
  if (typeof value === "object" && value !== null) {
    return Object.entries(value as Node).flatMap(([key, child]) =>
      paths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

/** Every leaf, with its value, so types and arities can be compared. */
function leaves(value: unknown, prefix = ""): [string, unknown][] {
  if (Array.isArray(value)) return [[`${prefix}[]`, value]];
  if (typeof value === "object" && value !== null) {
    return Object.entries(value as Node).flatMap(([key, child]) =>
      leaves(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [[prefix, value]];
}

const enPaths = paths(en);
const trPaths = paths(tr);
const enLeaves = new Map(leaves(en));
const trLeaves = new Map(leaves(tr));

describe("coverage", () => {
  it("has the same keys in both languages", () => {
    // TypeScript already enforces this at compile time; the test is here so a
    // failure reads as "a translation is missing" rather than as a type error
    // five files away.
    expect(trPaths.sort()).toEqual(enPaths.sort());
  });

  it("translates a substantial amount of text", () => {
    // A guard against the dictionary quietly shrinking.
    expect(enPaths.length).toBeGreaterThan(300);
  });

  it("has no empty or missing values", () => {
    for (const [path, value] of enLeaves) {
      expect(value, `en.${path}`).toBeDefined();
      if (typeof value === "string") expect(value.trim(), `en.${path}`).not.toBe("");
    }
    for (const [path, value] of trLeaves) {
      expect(value, `tr.${path}`).toBeDefined();
      if (typeof value === "string") expect(value.trim(), `tr.${path}`).not.toBe("");
    }
  });

  it("keeps functions as functions, with the same arity", () => {
    for (const [path, value] of enLeaves) {
      if (typeof value !== "function") continue;
      const other = trLeaves.get(path);
      expect(typeof other, `tr.${path} should be a function`).toBe("function");
      expect((other as (...args: never[]) => string).length, `tr.${path} arity`).toBe(value.length);
    }
  });

  it("keeps arrays the same length, so no recap line is dropped", () => {
    for (const [path, value] of enLeaves) {
      if (!Array.isArray(value)) continue;
      const other = trLeaves.get(path);
      expect(Array.isArray(other), `tr.${path}`).toBe(true);
      expect((other as unknown[]).length, `tr.${path} length`).toBe(value.length);
    }
  });

  it("never returns undefined from an interpolated string", () => {
    // Call every function with plausible arguments and check it produces text.
    for (const [path, value] of trLeaves) {
      if (typeof value !== "function") continue;
      const fn = value as (...args: unknown[]) => unknown;
      const args = Array.from({ length: fn.length }, (_, i) => (i === 0 ? 2 : "x"));
      // A couple of signatures take a list rather than a scalar.
      const result = path.includes("missingWords") ? fn(["a", "b"]) : fn(...args);
      expect(typeof result, `tr.${path}`).toBe("string");
      expect(String(result)).not.toContain("undefined");
    }
  });
});

describe("Turkish quality", () => {
  /** Strings that are legitimately identical in both languages. */
  const SHARED = new Set([
    "shell.brand",
    "shell.brandSuffix",
    "preferences.english",
    "preferences.englishFull",
    "preferences.turkish",
    "preferences.turkishFull",
    "home.kicker",
    "labs.hash-playground.usage.items.git.label",
    "labs.hash-playground.usage.items.https.label",
    "labs.neural-playground.neuron.bias",
    "labs.neural-playground.playground.activation",
    "labs.neural-playground.neuron.activation",
    "labs.neural-playground.datasets.xor.label",
    "labs.tokenizer.compare.samples.tr-sea",
    "labs.tokenizer.compare.samples.tr-visit",
  ]);

  it("actually translates the prose", () => {
    const untranslated: string[] = [];
    for (const [path, value] of enLeaves) {
      if (typeof value !== "string" || SHARED.has(path)) continue;
      // Short labels can coincide; long prose never should.
      if (value.length < 12) continue;
      if (trLeaves.get(path) === value) untranslated.push(path);
    }
    expect(untranslated).toEqual([]);
  });

  it("keeps one Turkish term per concept", () => {
    const all = [...trLeaves.values()]
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter((v): v is string => typeof v === "string")
      .join("\n");

    // Terms that were deliberately chosen; a second spelling would mean the
    // same idea is being named two ways in one product.
    const forbidden: [RegExp, string][] = [
      [/\bçarpışma\b/i, "collision is 'çakışma' everywhere"],
      [/\bkelime dağarcığı\b/i, "vocabulary is 'sözlük' everywhere"],
      [/\bkorpus\b/i, "corpus is 'derlem' everywhere"],
      [/\bnöral ağ\b/i, "neural network is 'yapay sinir ağı'"],
      [/\bkayıp fonksiyonu değeri\b/i, "loss is just 'kayıp'"],
      [/\bters çevirme sayısı\b/i, "inversion is 'terslik'"],
      [/\bjeton\b/i, "token stays 'token'"],
      [/\bsembolleştirici\b/i, "tokenizer stays 'tokenizer'"],
    ];
    for (const [pattern, why] of forbidden) {
      expect(pattern.test(all), why).toBe(false);
    }
  });

  it("uses Turkish number conventions", () => {
    const percentages = [...trLeaves.entries()].filter(
      ([, v]) => typeof v === "string" && /%/.test(v),
    );
    for (const [path, value] of percentages) {
      // In Turkish the sign leads: %50, never 50%.
      expect(String(value), `tr.${path}`).not.toMatch(/\d\s*%/);
    }
  });

  it("keeps technical terms that have no honest Turkish equivalent", () => {
    const tokenizer = tr.labs.tokenizer;
    expect(tokenizer.title).toContain("Tokenizer");
    expect(tokenizer.honesty).toContain("BPE");
    expect(tr.labs["hash-playground"].title).toContain("Hash");
    expect(tr.labs["neural-playground"].stats.epoch).toBe("Epok");
  });

  it("translates every recap line", () => {
    for (const slug of Object.keys(en.labs) as (keyof typeof en.labs)[]) {
      const source = en.labs[slug].recap.lessons;
      const target = tr.labs[slug].recap.lessons;
      expect(target).toHaveLength(source.length);
      for (let i = 0; i < source.length; i++) {
        expect(target[i], `${slug} recap ${i}`).not.toBe(source[i]);
        expect(String(target[i]).length).toBeGreaterThan(10);
      }
    }
  });
});

describe("lab identity", () => {
  it("covers every registered lab", async () => {
    const { labs } = await import("@/labs/registry");
    const slugs = labs.map((lab) => lab.meta.slug).sort();
    expect(Object.keys(en.labs).sort()).toEqual(slugs);
  });

  it("gives every lab a title and a one-line description in both languages", () => {
    for (const slug of Object.keys(en.labs) as (keyof typeof en.labs)[]) {
      for (const dict of [en, tr]) {
        expect(dict.labs[slug].title.length).toBeGreaterThan(3);
        expect(dict.labs[slug].description.length).toBeGreaterThan(20);
        expect(dict.labs[slug].description.length).toBeLessThan(140);
      }
    }
  });
});
