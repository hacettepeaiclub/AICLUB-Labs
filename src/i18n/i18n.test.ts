import { describe, expect, it } from "vitest";
import { en } from "./en";
import { tr } from "./tr";
import { enLabs } from "./labs/en";
import { trLabs } from "./labs/tr";

/**
 * The shell dictionary and the lab prose ship as separate chunks, but they are
 * one contract: every structural check below reads the pair as one object, the
 * way a component that has both loaded sees it.
 */
const enAll = { ...en, labs: enLabs };
const trAll = { ...tr, labs: trLabs };

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

const enPaths = paths(enAll);
const trPaths = paths(trAll);
const enLeaves = new Map(leaves(enAll));
const trLeaves = new Map(leaves(trAll));

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
    // "Gradient descent" and "BPE tokenization" are the names of the methods
    // in Turkish technical writing too; translating them would invent terms
    // nobody uses.
    "labMeta.gradient-descent.term",
    "labMeta.tokenization.term",
    "labs.gradient-descent.optimizers.gd",
    "labs.cryptographic-hashing.usage.items.git.label",
    "labs.cryptographic-hashing.usage.items.https.label",
    "labs.multilayer-perceptrons.neuron.bias",
    "labs.multilayer-perceptrons.playground.activation",
    "labs.multilayer-perceptrons.neuron.activation",
    "labs.multilayer-perceptrons.datasets.xor.label",
    "labs.tokenization.compare.samples.tr-sea",
    "labs.tokenization.compare.samples.tr-visit",
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
    expect(tr.labMeta.tokenization.term).toContain("tokenization");
    expect(trLabs.tokenization.honesty).toContain("BPE");
    expect(tr.labMeta["cryptographic-hashing"].term).toContain("hash");
    expect(trLabs["multilayer-perceptrons"].stats.epoch).toBe("Epok");
  });

  it("translates every recap line", () => {
    for (const slug of Object.keys(enLabs) as (keyof typeof enLabs)[]) {
      const source = enLabs[slug].recap.lessons;
      const target = trLabs[slug].recap.lessons;
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
    expect(Object.keys(enLabs).sort()).toEqual(slugs);
  });

  it("gives every lab a title, its subject's term and a one-line description in both languages", () => {
    for (const slug of Object.keys(enLabs) as (keyof typeof enLabs)[]) {
      for (const dict of [en, tr]) {
        expect(dict.labMeta[slug].title.length).toBeGreaterThan(3);
        expect(dict.labMeta[slug].term.length).toBeGreaterThan(3);
        // The term names the subject; it must not just repeat the title.
        expect(dict.labMeta[slug].term).not.toBe(dict.labMeta[slug].title);
        expect(dict.labMeta[slug].description.length).toBeGreaterThan(20);
        expect(dict.labMeta[slug].description.length).toBeLessThan(140);
      }
    }
  });
});

describe("footer credit", () => {
  it("puts the club's name in the sentence exactly once, in both languages", () => {
    // The footer splits on the placeholder and links whatever sits between
    // the halves. A translation that drops it would drop the link silently.
    for (const dict of [en, tr]) {
      expect(dict.shell.developedBy.split("{org}")).toHaveLength(2);
      expect(dict.shell.developedBy).toContain("Metehan Özcan");
    }
  });
});
