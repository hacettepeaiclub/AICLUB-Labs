import { describe, expect, it } from "vitest";
import tailwindConfig from "../../tailwind.config";
import { FONT_SIZES, cn } from "./cn";

describe("cn", () => {
  it("keeps a type-scale size when a text colour is merged after it", () => {
    // The exact failure: <Figure> composes its size and its tone separately,
    // so the two arrive as different arguments. Before the fix this returned
    // "mt-1 font-mono tabular-nums text-fg" — the size was gone.
    expect(cn("mt-1 font-mono text-title tabular-nums", "text-fg")).toBe(
      "mt-1 font-mono text-title tabular-nums text-fg",
    );
  });

  it("keeps every size in the scale beside every kind of colour", () => {
    const colours = ["text-fg", "text-fg-muted", "text-fg-faint", "text-accent", "text-data"];
    for (const size of FONT_SIZES) {
      for (const colour of colours) {
        const merged = cn(`text-${size}`, colour);
        expect(merged, `${size} + ${colour}`).toBe(`text-${size} ${colour}`);
      }
    }
  });

  it("still lets one size override another, last one winning", () => {
    expect(cn("text-body", "text-caption")).toBe("text-caption");
    // The conditional shape every lab writes: a size, then maybe another one.
    const emphasised: boolean = false;
    expect(cn("text-display-md", emphasised && "text-title")).toBe("text-display-md");
    expect(cn("text-body-sm", "text-body-lg")).toBe("text-body-lg");
  });

  it("still lets one colour override another", () => {
    expect(cn("text-fg", "text-accent")).toBe("text-accent");
    expect(cn("text-title text-fg-muted", "text-fg")).toBe("text-title text-fg");
  });

  it("leaves Tailwind's own sizes and unrelated conflicts alone", () => {
    expect(cn("text-lg", "text-sm")).toBe("text-sm");
    expect(cn("text-lg", "text-fg")).toBe("text-lg text-fg");
    expect(cn("p-4", "p-6")).toBe("p-6");
  });

  it("names exactly the scale the Tailwind config declares", () => {
    // The two lists are maintained by hand in two files; this is what stops
    // them drifting apart the next time the scale grows a step.
    // Read the actual object so formatting and quoted/unquoted keys cannot
    // change which sizes this check sees.
    const declared = Object.keys(tailwindConfig.theme.extend.fontSize);
    expect(declared.length).toBeGreaterThan(5);
    expect([...FONT_SIZES].sort()).toEqual(declared.sort());
  });
});
