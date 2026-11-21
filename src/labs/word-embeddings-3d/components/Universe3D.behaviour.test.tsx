// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { restoreDom } from "@/test/dom";
import { VOCABULARY } from "../../word-embeddings/vocabulary";
import copy from "@/i18n/labs/en/word-embeddings-3d";
import { TAP_SLOP, Universe3D } from "./Universe3D";

/**
 * Tap selects, drag turns.
 *
 * Every drag that ended over a star used to select it, so turning the cloud to
 * look at a word's neighbours kept replacing the word. A cancelled gesture (the
 * browser taking it for a scroll) must not select either.
 */

// One star at the origin: it projects to the centre of the frame from every
// angle, so a pointer released at the centre is always on it.
const points = [{ x: 0, y: 0, z: 0 }];
const SIZE = 330;
const CENTRE = SIZE / 2;

function setup() {
  const onSelect = vi.fn();
  const view = render(
    <Universe3D
      points={points}
      vocabulary={VOCABULARY}
      selected={1}
      neighbours={[]}
      formatScore={(v) => v.toFixed(2)}
      onSelect={onSelect}
      copy={copy.map}
    />,
  );
  const svg = view.container.querySelector("svg");
  if (!svg) throw new Error("map did not render");
  svg.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: SIZE, height: SIZE, right: SIZE, bottom: SIZE }) as DOMRect;
  return { svg, onSelect, view };
}

const at = (x: number, y: number) => ({ clientX: x, clientY: y, pointerId: 1 });

beforeEach(() => {
  // jsdom has no PointerEvent; MouseEvent carries clientX/clientY.
  if (!("PointerEvent" in window)) {
    vi.stubGlobal("PointerEvent", MouseEvent);
  }
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  restoreDom();
});

describe("Universe3D pointer gestures", () => {
  it("selects the star under a tap", () => {
    const { svg, onSelect } = setup();
    fireEvent.pointerDown(svg, at(CENTRE, CENTRE));
    fireEvent.pointerUp(svg, at(CENTRE, CENTRE));
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("still counts a few pixels of finger wobble as a tap", () => {
    const { svg, onSelect } = setup();
    fireEvent.pointerDown(svg, at(CENTRE, CENTRE));
    fireEvent.pointerMove(svg, at(CENTRE + 3, CENTRE + 2));
    fireEvent.pointerUp(svg, at(CENTRE + 3, CENTRE + 2));
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("does not select when a drag ends over a star", () => {
    const { svg, onSelect } = setup();
    // Out and back: the release lands on the star, but the pointer travelled.
    fireEvent.pointerDown(svg, at(CENTRE, CENTRE));
    fireEvent.pointerMove(svg, at(CENTRE + TAP_SLOP * 4, CENTRE));
    fireEvent.pointerMove(svg, at(CENTRE, CENTRE));
    fireEvent.pointerUp(svg, at(CENTRE, CENTRE));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("forgets a cancelled gesture, and the next tap still selects", () => {
    const { svg, onSelect } = setup();
    fireEvent.pointerDown(svg, at(CENTRE, CENTRE));
    fireEvent.pointerCancel(svg, at(CENTRE, CENTRE));
    fireEvent.pointerUp(svg, at(CENTRE, CENTRE));
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.pointerDown(svg, at(CENTRE, CENTRE));
    fireEvent.pointerUp(svg, at(CENTRE, CENTRE));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("ignores a second finger: it neither resets nor ends the first gesture", () => {
    const { svg, onSelect } = setup();
    fireEvent.pointerDown(svg, at(CENTRE, CENTRE));
    fireEvent.pointerMove(svg, at(CENTRE + TAP_SLOP * 4, CENTRE));
    // A second finger lands and lifts on the star mid-drag.
    fireEvent.pointerDown(svg, { ...at(CENTRE, CENTRE), pointerId: 2 });
    fireEvent.pointerUp(svg, { ...at(CENTRE, CENTRE), pointerId: 2 });
    fireEvent.pointerMove(svg, at(CENTRE, CENTRE));
    fireEvent.pointerUp(svg, at(CENTRE, CENTRE));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("is the lab's stage and stays in the tab order", () => {
    const { view } = setup();
    const map = view.getByRole("listbox");
    expect(map.hasAttribute("data-stage")).toBe(true);
    expect(map.tabIndex).toBe(0);
  });
});

describe("Universe3D keyboard after a selection made elsewhere", () => {
  // Three stars so each word has an option element to point at.
  const three = [
    { x: 0, y: 0, z: 0 },
    { x: 20, y: 0, z: 0 },
    { x: -20, y: 0, z: 0 },
  ];
  const props = (selected: number, onSelect: (i: number) => void) => ({
    points: three,
    vocabulary: VOCABULARY,
    selected,
    neighbours: [
      { index: (selected + 1) % 3, similarity: 0.9 },
      { index: (selected + 2) % 3, similarity: 0.8 },
    ],
    formatScore: (v: number) => v.toFixed(2),
    onSelect,
    copy: copy.map,
  });

  it("moves the cursor to the new word, so Enter does not re-select the old one", () => {
    const onSelect = vi.fn();
    const view = render(<Universe3D {...props(0, onSelect)} />);
    const map = view.getByRole("listbox");
    // The visitor arrows to a neighbour, leaves the map, and picks word 2
    // from the neighbour list instead.
    fireEvent.focus(map);
    fireEvent.keyDown(map, { key: "ArrowRight" });
    fireEvent.blur(map);
    view.rerender(<Universe3D {...props(2, onSelect)} />);

    fireEvent.focus(map);
    const activeId = map.getAttribute("aria-activedescendant");
    const option = activeId ? view.container.querySelector(`[id="${activeId}"]`) : null;
    expect(option?.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(map, { key: "Enter" });
    expect(onSelect).not.toHaveBeenCalled();
  });
});
