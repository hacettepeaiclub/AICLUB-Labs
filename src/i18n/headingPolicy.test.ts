import { describe, expect, it } from "vitest";
import { en } from "./en";
import { tr } from "./tr";
import { enLabs } from "./labs/en";
import { trLabs } from "./labs/tr";
import { isEnglishHeading } from "./headingPolicy";

describe("English headings and Turkish teaching copy", () => {
  it("keeps the same canonical headings in both languages", () => {
    function compare(a: unknown, b: unknown, key = "") {
      if (!a || typeof a !== "object" || Array.isArray(a)) return;
      for (const [name, value] of Object.entries(a)) {
        const next = key ? `${key}.${name}` : name;
        const other = (b as Record<string, unknown>)[name];
        if (isEnglishHeading(next) && typeof value === "string") expect(other, next).toBe(value);
        else compare(value, other, next);
      }
    }
    compare(en, tr);
    for (const slug of Object.keys(enLabs) as (keyof typeof enLabs)[])
      compare(enLabs[slug], trLabs[slug]);
  });

  it("keeps the excluded word out of Turkish copy, including inflected forms", () => {
    const strings: string[] = [];
    function collect(value: unknown) {
      if (typeof value === "string") strings.push(value);
      else if (typeof value === "function") strings.push(value.toString());
      else if (value && typeof value === "object") Object.values(value).forEach(collect);
    }
    collect(tr);
    collect(trLabs);
    expect(strings.filter((text) => /düzen(?:ek|eğ)/iu.test(text))).toEqual([]);
  });
});
