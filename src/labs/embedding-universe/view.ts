/**
 * Presentation logic for the universe — pure, and deliberately outside the
 * components.
 *
 * Every number and every position the lab draws is derived here from what the
 * engine produced. No component computes a similarity, a rank, a coordinate or
 * a label, and no component contains one: `lab.test.ts` reads the component
 * sources and fails if a vocabulary word or a measured value ever appears as a
 * literal. That is the structural guard against the failure this lab is most
 * exposed to — someone pasting in the map that looked good instead of drawing
 * the map the data produced.
 *
 * The one exception is `PREDICTION`, below, and it is an editorial choice
 * rather than a result: which word to open with is a teaching decision. What
 * that word's neighbours turn out to be is not.
 */

import { createRng } from "@/lib/random";
import type { Neighbour, Projection } from "./engine";
import type { VocabularyItem } from "./vocabulary";

// -------------------------------------------------------------- prediction ---

/**
 * The word section 1 opens on, and the three words it offers.
 *
 * `apple` was chosen by measurement, not taste. Its nearest neighbour in this
 * dataset is `software` (0.496) — because GloVe learned from Wikipedia and
 * Gigaword news text, where "apple" sits beside "software" far more often than
 * beside "banana". That is the lab's thesis arriving in the first ten seconds.
 *
 * The candidates matter as much as the anchor. `banana` is genuinely the 5th
 * nearest of 318, so someone who picks it has not made a mistake — the reveal
 * compares two true statements instead of marking an answer. There is no
 * arrangement of these three chips that produces a wrong choice, which is why
 * the interaction can never become a quiz however the copy is written.
 *
 * `dog` was considered and rejected: its nearest neighbour is `cat`, everyone
 * predicts `cat`, and the interaction would teach nothing.
 */
export const PREDICTION = {
  anchor: "apple",
  candidates: ["banana", "software", "tree"],
} as const;

/** How many neighbours the list shows, and how many get labels on the map. */
export const NEIGHBOUR_COUNT = 8;

// ------------------------------------------------------------------ search ---

/**
 * Fold a string for searching.
 *
 * Turkish is the reason this is not `toLowerCase()`. In Turkish "I" lowercases
 * to "ı" and "İ" to "i", so the invariant lowercase of a Turkish gloss does not
 * match what a Turkish keyboard produces. Lowercasing in the Turkish locale
 * first, then stripping diacritics, means `sac`, `saç` and `SAÇ` all reach
 * `sac` — and an English speaker who cannot type `ö` can still find `göz`.
 */
export function foldSearch(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // combining marks: s-cedilla, c-cedilla, umlauts and breve decompose to these
    .replace(/ı/g, "i") // dotless i is a letter, not a decomposition, so it needs its own pass
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .trim();
}

export interface SearchHit {
  readonly index: number;
  readonly item: VocabularyItem;
}

/**
 * Words matching a query, in vocabulary order.
 *
 * Both languages are searched, so a Turkish speaker can type `köpek` and land
 * on `dog`. Prefix matches sort ahead of interior ones, because someone typing
 * `car` means `car` before `scarf`. 318 items filter in well under a
 * millisecond, so there is no debounce: it would only add latency.
 */
export function searchWords(
  vocabulary: readonly VocabularyItem[],
  query: string,
  limit = 8,
): SearchHit[] {
  const needle = foldSearch(query);
  if (needle.length === 0) return [];
  const scored: Array<{ hit: SearchHit; rank: number }> = [];
  vocabulary.forEach((item, index) => {
    const en = foldSearch(item.en);
    const tr = foldSearch(item.tr);
    const at = Math.min(
      en.includes(needle) ? en.indexOf(needle) : Infinity,
      tr.includes(needle) ? tr.indexOf(needle) : Infinity,
    );
    if (at === Infinity) return;
    scored.push({ hit: { index, item }, rank: at });
  });
  scored.sort((a, b) => a.rank - b.rank || a.hit.index - b.hit.index);
  return scored.slice(0, limit).map((s) => s.hit);
}

// ---------------------------------------------------------------- viewport ---

export interface Point {
  readonly x: number;
  readonly y: number;
}

/** The longer side of the frame, in viewBox units. The shorter side follows the data. */
export const VIEWBOX = 100;
/** Room at the edges so a point on the extreme never sits half outside the frame. */
export const VIEW_PADDING = 6;

export interface Viewport {
  readonly points: readonly Point[];
  /** viewBox width — always `VIEWBOX` when the data is wider than it is tall. */
  readonly width: number;
  /** viewBox height, in the same units. */
  readonly height: number;
}

/**
 * Project PCA coordinates into the viewBox.
 *
 * Both axes are scaled by the *same* factor, taken from the wider one. Scaling
 * them independently would stretch the cloud to fill the square and quietly
 * misrepresent the shape — and section 2 is about the projection already
 * misleading you, so the drawing must not add distortion of its own.
 *
 * The y axis is flipped because PCA counts upwards and SVG counts downwards.
 *
 * The frame is sized to the data rather than forced square. This cloud is
 * 1.11 times wider than it is tall, so a square viewBox spent about a fifth of
 * its area on margin that could never contain a point — which is why the map
 * had to be small to fit at all. Returning the real extent lets the frame be
 * filled. It changes no coordinate's relationship to any other: one scale
 * factor still applies to both axes.
 */
export function toViewport(projection: Projection, count: number): Viewport {
  const coords = projection.coordinates;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const x = coords[i * 2]!;
    const y = coords[i * 2 + 1]!;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const inner = VIEWBOX - VIEW_PADDING * 2;
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const span = Math.max(spanX, spanY);
  const scale = span > 0 ? inner / span : 0;
  const width = spanX * scale + VIEW_PADDING * 2;
  const height = spanY * scale + VIEW_PADDING * 2;

  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    points.push({
      x: VIEW_PADDING + (coords[i * 2]! - minX) * scale,
      y: height - (VIEW_PADDING + (coords[i * 2 + 1]! - minY) * scale),
    });
  }
  return { points, width, height };
}

/**
 * The point nearest a position in viewBox units, or `null` if nothing is close.
 *
 * This is why there are no invisible hit targets. One transparent rectangle
 * catches every pointer and touch, and 318 squared distances resolve it in
 * well under a millisecond — which also means a fingertip never has to find a
 * three-pixel circle, because the nearest point wins whether or not the tap
 * landed on it.
 */
export function nearestPoint(points: readonly Point[], x: number, y: number, within = 12): number | null {
  let best = -1;
  let bestDistance = Infinity;
  for (let i = 0; i < points.length; i++) {
    const point = points[i]!;
    const dx = point.x - x;
    const dy = point.y - y;
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return best >= 0 && bestDistance <= within * within ? best : null;
}

// ------------------------------------------------------------------ labels ---

/**
 * Which points get a text label.
 *
 * Never all of them. 318 labels is an unreadable thicket, and the labels — not
 * the dots — are what makes an SVG this size expensive. Only the selected word,
 * the neighbours currently listed beside it, and whatever the pointer is over
 * are named, so at most ten `<text>` nodes exist at any moment.
 */
export function labelledPoints(
  selected: number | null,
  neighbours: readonly Neighbour[],
  hovered: number | null,
  highlighted: readonly number[] = [],
): Set<number> {
  // While section 2 is demonstrating a pair, only that pair is named. Leaving
  // the previous selection's neighbours labelled left eight other words
  // competing for attention with the two the sentence is about.
  if (highlighted.length > 0) return new Set(highlighted);

  const out = new Set<number>();
  if (selected !== null) out.add(selected);
  for (const n of neighbours) out.add(n.index);
  if (hovered !== null) out.add(hovered);
  return out;
}

export interface LabelCandidate {
  readonly index: number;
  readonly text: string;
  readonly size: number;
  readonly point: Point;
  /**
   * Never drop this one; move it instead.
   *
   * Section 2's whole demonstration is a pair of points, and its second pair
   * sits almost on top of the first — that is the finding. Dropping the
   * colliding label left one unlabelled blob where two named words should be.
   */
  readonly pinned?: boolean;
}

export interface PlacedLabel extends LabelCandidate {
  readonly x: number;
  readonly y: number;
}

/** Rough text extent in viewBox units. The font is monospace, so this is close. */
const MONO_ASPECT = 0.6;
/** Breathing room between a label and the frame edge, in viewBox units. */
const LABEL_INSET = 1.5;

/**
 * Drop labels that would print on top of one another.
 *
 * The projection puts related words close together — that is the whole point —
 * so the eight neighbours of a word land in a huddle and their labels overlap
 * into a smear. `dolphin` printed across `dog` and `puppy` across `cat` in the
 * first build of this map.
 *
 * Greedy, in priority order: the selection is placed first and never dropped,
 * then each neighbour in rank order takes its place only if it clears
 * everything already there. Losing the eighth label is a much smaller loss than
 * making the first one unreadable.
 */
export function placeLabels(
  candidates: readonly LabelCandidate[],
  frameWidth: number = VIEWBOX,
  frameHeight: number = VIEWBOX,
): PlacedLabel[] {
  const placed: PlacedLabel[] = [];
  const boxes: Array<{ x0: number; x1: number; y0: number; y1: number }> = [];
  for (const candidate of candidates) {
    const width = candidate.text.length * candidate.size * MONO_ASPECT;
    // Keep the whole word inside the frame. An SVG clips at its viewBox, so a
    // label on a point near the right edge lost its last letters. The extra
    // inset is so it does not sit flush against the border either, which reads
    // as clipped even when every letter is present.
    const half = width / 2 + LABEL_INSET;
    const x = Math.max(half, Math.min(frameWidth - half, candidate.point.x));
    const y = Math.max(candidate.size, candidate.point.y - candidate.size * 0.95);
    const boxAt = (at: number) => ({
      x0: x - width / 2,
      x1: x + width / 2,
      y0: at - candidate.size,
      y1: at + candidate.size * 0.3,
    });
    const clashesAt = (at: number) =>
      boxes.some((other) => {
        const box = boxAt(at);
        return box.x0 < other.x1 && box.x1 > other.x0 && box.y0 < other.y1 && box.y1 > other.y0;
      });

    if (!clashesAt(y)) {
      boxes.push(boxAt(y));
      placed.push({ ...candidate, x, y });
      continue;
    }
    if (!candidate.pinned) continue;

    // Pinned: step it away from the point until it is clear, then settle for
    // the furthest tried rather than vanishing.
    let settled = y;
    for (const offset of [1, -1, 2, -2, 3, -3]) {
      const shifted = y + offset * candidate.size * 1.5;
      if (shifted - candidate.size < 0 || shifted > frameHeight) continue;
      settled = shifted;
      if (!clashesAt(shifted)) break;
    }
    boxes.push(boxAt(settled));
    placed.push({ ...candidate, x, y: settled });
  }
  return placed;
}

/** How a point should be drawn. Never colour alone — every state also changes size or ring. */
export type PointRole = "base" | "selected" | "neighbour" | "highlighted" | "dimmed";

export function pointRole(
  index: number,
  selected: number | null,
  neighbourIndices: ReadonlySet<number>,
  highlighted: readonly number[],
): PointRole {
  if (highlighted.length > 0) {
    return highlighted.includes(index) ? "highlighted" : "dimmed";
  }
  if (index === selected) return "selected";
  return neighbourIndices.has(index) ? "neighbour" : "base";
}

// ----------------------------------------------------------------- figures ---

/**
 * Bar width for a similarity, as a percentage.
 *
 * Scaled against the strongest neighbour in the list rather than against 1.0,
 * so the bars have visible differences instead of all sitting near a third of
 * the track. Cosines can be negative, which clamps to zero width. The bar is
 * redundant: the number beside it is always present and always readable.
 */
export function barWidth(similarity: number, strongest: number): number {
  if (!(strongest > 0)) return 0;
  return Math.max(0, Math.min(100, (similarity / strongest) * 100));
}

/** Dimensions the projection could not show. Derived, never typed. */
export const hiddenDimensions = (dimensions: number, shown: number): number => dimensions - shown;

// ------------------------------------------------------------ decoration ---

export interface DecorStar {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly opacity: number;
  /** Seconds for one drift cycle. Ignored entirely under reduced motion. */
  readonly duration: number;
  readonly delay: number;
  /** How far it drifts, in viewBox units. Deliberately about a point's width. */
  readonly travel: number;
}

/**
 * A handful of purely decorative stars.
 *
 * These are not data and never touch it. They carry no word, no vector and no
 * coordinate from the projection; `nearestPoint` cannot return one; they are
 * inside an `aria-hidden` group and take no pointer events. They exist so the
 * frame reads as a field rather than a panel with dots on it.
 *
 * Two rules keep them from lying. They are drawn far fainter than the faintest
 * real point, so nothing decorative can be mistaken for a word. And they are
 * seeded, so the same stars appear in the same places on every load — a
 * background that reshuffled itself would imply something had changed.
 *
 * Only these may move. The 318 embedding points are fixed by the projection and
 * nothing in this file animates them.
 */
export function decorativeStars(frameWidth: number, frameHeight: number, count = 24): DecorStar[] {
  const rng = createRng(0xd3c0);
  return Array.from({ length: count }, () => {
    const duration = 26 + rng() * 34;
    return {
      x: rng() * frameWidth,
      y: rng() * frameHeight,
      r: 0.35 + rng() * 0.55,
      // Well under the base point's opacity, which is what keeps the two
      // populations visually separate.
      opacity: 0.05 + rng() * 0.07,
      duration,
      delay: -rng() * duration,
      travel: 0.6 + rng() * 1.1,
    };
  });
}

// ------------------------------------------------------- constellation ---

export interface Link {
  readonly from: Point;
  readonly to: Point;
  /** 0..1 by neighbour rank — the nearest link is drawn strongest. */
  readonly weight: number;
}

/**
 * Lines from the selected word to each of its listed neighbours.
 *
 * These are an explanatory overlay and nothing more. The embedding has no edges
 * — every word is related to every other word by some cosine, and drawing 318
 * of those would be a grey wash. What is drawn is "these are the eight the
 * panel is listing", so the eye can find them among three hundred points. The
 * copy says so too; a viewer should never come away thinking the model stores
 * links.
 *
 * Weight follows rank, so the constellation reads as an ordering rather than a
 * set of equal wires.
 */
export function constellationLinks(
  points: readonly Point[],
  selected: number | null,
  neighbours: readonly Neighbour[],
): Link[] {
  if (selected === null) return [];
  const origin = points[selected];
  if (!origin) return [];
  return neighbours.flatMap((neighbour, rank) => {
    const to = points[neighbour.index];
    if (!to) return [];
    return [{ from: origin, to, weight: 1 - rank / Math.max(1, neighbours.length) }];
  });
}

/**
 * Faint rings around the cloud's own centre.
 *
 * Derived from the real coordinates rather than drawn at arbitrary radii, so
 * they trace where the data actually thins out. Decoration all the same: they
 * carry no reading and are hidden from assistive technology.
 */
export function contourRings(points: readonly Point[], count = 3): Array<{ cx: number; cy: number; r: number }> {
  if (points.length === 0) return [];
  let cx = 0;
  let cy = 0;
  for (const point of points) {
    cx += point.x;
    cy += point.y;
  }
  cx /= points.length;
  cy /= points.length;
  let furthest = 0;
  for (const point of points) {
    furthest = Math.max(furthest, Math.hypot(point.x - cx, point.y - cy));
  }
  return Array.from({ length: count }, (_, i) => ({
    cx,
    cy,
    r: (furthest * (i + 1)) / count,
  }));
}
