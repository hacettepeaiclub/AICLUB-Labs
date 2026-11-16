import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { failedFile, isLoadFailure } from "./loadFailure";

const ORIGIN = "https://labs.example";

describe("load failures", () => {
  it("recognises a lazy page that could not be downloaded, in each browser's wording", () => {
    for (const message of [
      `Failed to fetch dynamically imported module: ${ORIGIN}/assets/index-abc.js`,
      `error loading dynamically imported module: ${ORIGIN}/assets/index-abc.js`,
      "Importing a module script failed.",
      "Unable to preload CSS for /assets/index-abc.css",
    ]) {
      expect({ message, load: isLoadFailure(new TypeError(message)) }).toEqual({
        message,
        load: true,
      });
    }
  });

  it("treats anything else thrown while rendering as the page breaking", () => {
    expect(isLoadFailure(new TypeError("Cannot read properties of undefined (reading 'x')"))).toBe(
      false,
    );
    expect(isLoadFailure(new Error('No en copy for the "x" lab'))).toBe(false);
    expect(isLoadFailure("a string")).toBe(false);
  });

  it("names the failed file only when it is on this site", () => {
    const fetchError = new TypeError(
      `Failed to fetch dynamically imported module: ${ORIGIN}/assets/lab-1.js`,
    );
    expect(failedFile(fetchError, ORIGIN)).toBe(`${ORIGIN}/assets/lab-1.js`);
    expect(failedFile(new Error("Unable to preload CSS for /assets/a.css"), ORIGIN)).toBe(
      `${ORIGIN}/assets/a.css`,
    );
    expect(
      failedFile(
        new TypeError("Failed to fetch dynamically imported module: https://x.test/a.js"),
        ORIGIN,
      ),
    ).toBeNull();
    expect(failedFile(new TypeError("Importing a module script failed."), ORIGIN)).toBeNull();
  });

  it("asks only this site, and never through a cache", () => {
    const source = readFileSync("src/components/layout/loadFailure.ts", "utf8");
    expect(source).toMatch(/fetch\(import\.meta\.env\.BASE_URL/);
    expect(source.match(/cache: "no-store"/g)).toHaveLength(2);
  });
});
