// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Figure } from "./Figure";

afterEach(cleanup);

describe("Figure label", () => {
  it("keeps Greek symbols out of the capitals transform", () => {
    const { container } = render(<Figure label="μ₀ and α" value="0.10" />);
    const kept = [...container.querySelectorAll(".normal-case")].map((n) => n.textContent);
    expect(kept).toEqual(["μ", "α"]);
    expect(container.querySelector("p")?.textContent).toBe("μ₀ and α");
  });

  it("leaves a label without symbols as plain text", () => {
    const { container } = render(<Figure label="Power" value="0.80" />);
    expect(container.querySelector(".normal-case")).toBeNull();
  });
});
