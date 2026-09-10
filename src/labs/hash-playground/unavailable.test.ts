import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";
import { hashingUnavailable, sha256Hex } from "./hashUtils";

const read = (path: string) => readFileSync(path, "utf8");
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

/**
 * What the lab does when the browser will not hash.
 *
 * `crypto.subtle` is undefined outside a secure context, so a deployment over
 * plain HTTP has no hashing at all. The lab used to render an empty body: no
 * digest, no input, no explanation, and an unhandled TypeError in the console.
 */
describe("Web Crypto availability", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports nothing wrong when the API is there", () => {
    expect(hashingUnavailable()).toBeNull();
  });

  it("names an insecure context as itself", () => {
    vi.stubGlobal("crypto", {});
    vi.stubGlobal("window", { isSecureContext: false });
    expect(hashingUnavailable()).toBe("insecure-context");
  });

  it("does not blame HTTPS when the context is already secure", () => {
    // A hardened browser or an extension can withhold the API on https://
    // too; saying "use HTTPS" there would be wrong and unhelpful.
    vi.stubGlobal("crypto", {});
    vi.stubGlobal("window", { isSecureContext: true });
    expect(hashingUnavailable()).toBe("unsupported");
  });

  it("still rejects rather than returning a fake digest", async () => {
    // The lab's subject is a real SHA-256. There must be no fallback
    // implementation anywhere in the failure path.
    vi.stubGlobal("crypto", {});
    await expect(sha256Hex("hello world")).rejects.toBeInstanceOf(Error);
    const utils = stripComments(read("src/labs/hash-playground/hashUtils.ts"));
    for (const banned of ["md5", "fnv", "Math.random", "fallbackHash"]) {
      expect({ banned, found: utils.toLowerCase().includes(banned.toLowerCase()) }).toEqual({
        banned,
        found: false,
      });
    }
  });

  it("computes the same digest it always did", async () => {
    // Guards the requirement that none of this changed the algorithm.
    await expect(sha256Hex("hello world")).resolves.toBe(
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    );
  });
});

describe("the lab when hashing is unavailable", () => {
  const index = stripComments(read("src/labs/hash-playground/index.tsx"));

  it("renders an explanation instead of an empty page", () => {
    expect(index).toMatch(/if \(unavailable\)/);
    expect(index).toMatch(/role="alert"/);
    expect(index).toMatch(/t\.unavailable\.title/);
    // And the branch comes before the "still computing" null.
    expect(index.indexOf("if (unavailable)")).toBeLessThan(
      index.indexOf("if (!current || !derived) return null;"),
    );
  });

  it("picks the message that matches the detected cause", () => {
    expect(index).toMatch(/unavailable === "insecure-context"/);
    expect(index).toMatch(/t\.unavailable\.insecureContext/);
    expect(index).toMatch(/t\.unavailable\.unsupported/);
  });

  it("leaves no unhandled rejection at either call site", () => {
    const hook = stripComments(read("src/labs/hash-playground/useSha256.ts"));
    // The hook takes a rejection handler and still guards stale updates.
    expect(hook).toMatch(/cancelled/);
    expect(hook).toMatch(/console\.error/);
    expect(hook).toMatch(/if \(cancelled\) return;/);
    const determinism = stripComments(
      read("src/labs/hash-playground/components/DeterminismStage.tsx"),
    );
    expect(determinism).toMatch(/\.catch\(/);
  });

  it("explains itself in both languages, in plain words", () => {
    for (const dict of [en, tr]) {
      const copy = dict.labs["hash-playground"].unavailable;
      expect(copy.title.length).toBeGreaterThan(10);
      expect(copy.insecureContext.length).toBeGreaterThan(40);
      expect(copy.unsupported.length).toBeGreaterThan(40);
      expect(copy.note.length).toBeGreaterThan(20);
      // The secure-connection message says which connection to use.
      expect(copy.insecureContext.toLowerCase()).toMatch(/https/);
      // And nothing a visitor reads is a developer's sentence.
      const all = Object.values(copy).join(" ").toLowerCase();
      for (const banned of ["undefined", "typeerror", "crypto.subtle", "null"]) {
        expect({ banned, found: all.includes(banned) }).toEqual({ banned, found: false });
      }
    }
  });
});

describe("input bounds", () => {
  it("caps the hash message field", () => {
    expect(read("src/labs/hash-playground/components/MessageField.tsx")).toMatch(
      /maxLength=\{2000\}/,
    );
  });
});
