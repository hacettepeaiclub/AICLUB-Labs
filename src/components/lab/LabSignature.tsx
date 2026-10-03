import type { CSSProperties } from "react";
import { createRng } from "@/lib/random";

/**
 * A small drawing of what a lab is shaped like.
 *
 * ## What these are, and what they are not
 *
 * Not icons, and not illustrations. Each one is the diagram the lab is about,
 * reduced until only its structure is left: a grid with a route, a descent down
 * a contour, a sentence cut into pieces, a scatter with a few points joined.
 * Someone who has done the lab recognises it; someone who has not can still see
 * that the nine things on this page are nine different kinds of system.
 *
 * ## Where they appear
 *
 * Anywhere the collection points at a lab: the home grid, the card at the
 * bottom of a lab that names the next one, and the rows of the lab finder. It
 * lived under `components/home` while the grid was its only use, and moved
 * here when it stopped being one. It costs those other places nothing — the
 * home page is in the entry chunk, and so is this.
 *
 * ## Why they are not live
 *
 * A live miniature means importing that lab's engine, and nine engine imports
 * in the entry chunk would undo the lazy registry — a visitor would download
 * all nine labs to look at the home page. So the home page imports no engine
 * at all: it draws instead.
 *
 * They stay honest about that: every shape here is generated from a fixed seed
 * and drawn once, so nothing pretends to be computing. No state and no
 * `requestAnimationFrame`.
 *
 * ## How they move
 *
 * Only when asked: on hover (or once, on a touch screen, as the card comes
 * into view), each drawing replays its lab's own gesture in about a second —
 * the route is drawn, the search spreads by depth, the bars grow, the digest
 * flickers, the ball lands in the bowl. It is CSS only, keyed off four
 * classes in `globals.css`: `sig-draw` (a stroke drawn along its length; the
 * element carries `pathLength={1}`), `sig-pop`, `sig-grow` and `sig-blink`,
 * each delayed by `--d`. At rest every drawing is exactly the static one, so
 * reduced motion and devices without hover lose nothing.
 *
 * ## Why they all look related
 *
 * One viewBox, one stroke weight, one palette: inert marks in `fg-faint`,
 * structure in the lab's own field colour, and at most one element in `data`
 * to carry the eye. Eleven labs, one drawing language, rather than eleven
 * unrelated styles.
 *
 * The field colour arrives as `--c`, which the card already sets from
 * `CATEGORY_VAR` for its frame and brackets — so a drawing is coloured by
 * where it sits, not by anything it has to be told. It used to be `accent` for
 * every lab, which made a grid of eleven different kinds of system read as one
 * blue thing repeated, and left the six category colours doing no work beyond
 * a 7px dot. `data` stays shared on purpose: it means "the value that is
 * changing right now" everywhere in the product, and one constant among six
 * variables is what keeps the grid from becoming a chart of its own palette.
 *
 * The fallback in `var(--c, var(--accent))` is what the drawing is worth on
 * its own, outside a card.
 */

const W = 64;
const H = 40;

/** Deterministic per slug, so a card looks the same on every visit. */
const seeded = (slug: string) => {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return createRng(h >>> 0);
};

/** Animation delay for one element, in seconds. */
const at = (seconds: number): CSSProperties => ({ "--d": `${seconds}s` }) as CSSProperties;

const inert = "stroke-fg-faint/45";
const structure = "stroke-[rgb(var(--c,var(--accent)))]";
const live = "stroke-data";

/**
 * Fill steps for the hash digest, written out rather than interpolated: these
 * strings have to survive Tailwind's source scan, and a template literal does
 * not.
 */
const HASH_FILLS = [
  "fill-[rgb(var(--c,var(--accent))/0.25)]",
  "fill-[rgb(var(--c,var(--accent))/0.45)]",
  "fill-[rgb(var(--c,var(--accent))/0.7)]",
  "fill-[rgb(var(--c,var(--accent)))]",
];

/** `[x, width]` per input segment. Row 1 ends at 13.5, row 2 at 21. */
const HASH_INPUTS = [
  [
    [3, 6],
    [10.5, 3],
  ],
  [
    [3, 4],
    [8, 7],
    [16, 5],
  ],
] as const;

function Shape({ slug }: { slug: string }) {
  const rng = seeded(slug);

  switch (slug) {
    case "hash-playground": {
      /*
       * Two inputs of visibly different length, one function, two outputs of
       * identical width and identical cell count.
       *
       * The previous drawing was a row of bars of varying height, which reads
       * as a waveform and — worse — implies the output changes size with the
       * input. That is the opposite of the lesson. Here the only thing that
       * varies on the right is the fill inside cells whose geometry never
       * moves, so the picture says what the lab says: different input, same
       * shape of answer.
       */
      const CELLS = 7;
      const CELL_W = 4.2;
      const PITCH = 5.2;
      const OUT_X = 26.6;
      return (
        <g>
          {HASH_INPUTS.map((segments, row) => {
            const midY = row === 0 ? 10.5 : 28.5;
            return (
              <g key={row}>
                {segments.map(([x, w], i) => (
                  <rect
                    key={`in-${row}-${i}`}
                    x={x}
                    y={midY - 1}
                    width={w}
                    height={2}
                    rx={1}
                    className="fill-fg-faint/55"
                  />
                ))}
                {/* the function — the one thing both rows pass through */}
                <polyline
                  points={`22,${midY - 3} 24.6,${midY} 22,${midY + 3}`}
                  fill="none"
                  strokeWidth={1}
                  pathLength={1}
                  className={`${structure} sig-draw`}
                  style={at(row * 0.2)}
                />
                {Array.from({ length: CELLS }, (_, i) => {
                  const digest =
                    HASH_FILLS[Math.floor(rng() * HASH_FILLS.length)] ??
                    "fill-[rgb(var(--c,var(--accent)))]";
                  return (
                    <rect
                      key={`out-${row}-${i}`}
                      x={OUT_X + i * PITCH}
                      y={midY - 4.5}
                      width={CELL_W}
                      height={9}
                      className={`${row === 1 && i === 4 ? "fill-data" : digest} sig-blink`}
                      style={at(0.15 + row * 0.2 + i * 0.04)}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
      );
    }
    case "neural-playground": {
      const layers = [3, 4, 2];
      const xs = [10, 32, 54];
      return (
        <g fill="none" strokeWidth={0.6}>
          {layers
            .slice(0, -1)
            .map((count, l) =>
              Array.from({ length: count }, (_, i) =>
                Array.from({ length: layers[l + 1] ?? 0 }, (_, j) => (
                  <line
                    key={`${l}-${i}-${j}`}
                    x1={xs[l]}
                    y1={(H / (count + 1)) * (i + 1)}
                    x2={xs[l + 1]}
                    y2={(H / ((layers[l + 1] ?? 1) + 1)) * (j + 1)}
                    pathLength={1}
                    className={`${inert} sig-draw`}
                    style={at(l * 0.3)}
                  />
                )),
              ),
            )}
          {layers.map((count, l) =>
            Array.from({ length: count }, (_, i) => (
              <circle
                key={`n-${l}-${i}`}
                cx={xs[l]}
                cy={(H / (count + 1)) * (i + 1)}
                r={2.2}
                className={`${l === 1 && i === 1 ? "fill-data stroke-data" : "fill-ink-950 stroke-[rgb(var(--c,var(--accent)))]"} sig-pop`}
                style={at(l * 0.3 + 0.1)}
              />
            )),
          )}
        </g>
      );
    }
    case "pathfinding": {
      /*
       * A wavefront, not a chart.
       *
       * The previous drawing was a smooth polyline sloping down across a grid,
       * which is a line graph — and, worse, the same gesture as the gradient
       * descent signature two tiles away. Nothing in it showed the thing the
       * lab is actually about: that a search does not walk to the goal, it
       * spreads until it finds one.
       *
       * So the grid is shaded by distance from the start. The settled cells
       * are dim, the ring at the edge of the search is bright — that ring is
       * the frontier, the only place the algorithm can grow from — and the
       * goal is still outside it, unreached. The route is drawn in right
       * angles, because a grid search cannot move diagonally and a curve here
       * would be a lie.
       */
      const COLS = 10;
      const ROWS = 6;
      const PITCH = 6.2;
      const SIZE = 5.4;
      const X0 = 1;
      const Y0 = 1.4;
      const cx = (c: number) => X0 + c * PITCH + SIZE / 2;
      const cy = (r: number) => Y0 + r * PITCH + SIZE / 2;
      const start = { c: 1, r: 3 };
      const goal = { c: 8, r: 1 };
      /** Where the frontier has got to. Cells at exactly this depth are it. */
      const FRONTIER = 3;
      return (
        <g>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const depth = Math.abs(c - start.c) + Math.abs(r - start.r);
              const fill =
                c === goal.c && r === goal.r
                  ? "fill-data"
                  : depth === 0
                    ? "fill-[rgb(var(--c,var(--accent)))]"
                    : depth === FRONTIER
                      ? "fill-[rgb(var(--c,var(--accent))/0.55)]"
                      : depth < FRONTIER
                        ? "fill-[rgb(var(--c,var(--accent))/0.25)]"
                        : "fill-fg-faint/20";
              return (
                <rect
                  key={`${r}-${c}`}
                  x={X0 + c * PITCH}
                  y={Y0 + r * PITCH}
                  width={SIZE}
                  height={SIZE}
                  className={depth <= FRONTIER ? `${fill} sig-pop` : fill}
                  style={depth <= FRONTIER ? at(depth * 0.1) : undefined}
                />
              );
            }),
          )}
          <polyline
            points={`${cx(1)},${cy(3)} ${cx(3)},${cy(3)} ${cx(3)},${cy(2)} ${cx(5)},${cy(2)} ${cx(5)},${cy(1)} ${cx(8)},${cy(1)}`}
            fill="none"
            strokeWidth={1.4}
            pathLength={1}
            className={`${structure} sig-draw`}
            style={at(0.45)}
          />
        </g>
      );
    }
    case "sorting-race": {
      return (
        <g>
          {Array.from({ length: 18 }, (_, i) => (
            <rect
              key={i}
              x={2 + i * 3.5}
              y={H - 3 - (i + 1) * 1.85}
              width={2.4}
              height={(i + 1) * 1.85}
              className={`${i > 13 ? "fill-[rgb(var(--c,var(--accent)))]" : "fill-fg-faint/45"} sig-grow`}
              style={at(i * 0.03)}
            />
          ))}
        </g>
      );
    }
    case "tokenizer": {
      const widths = [7, 12, 5, 9, 14, 6];
      let x = 3;
      return (
        <g>
          {widths.map((w, i) => {
            const el = (
              <rect
                key={i}
                x={x}
                y={16}
                width={w}
                height={8}
                rx={1}
                className={`${i === 3 ? "fill-data" : "fill-fg-faint/40"} sig-pop`}
                style={at(0.3 + i * 0.07)}
              />
            );
            x += w + 2.4;
            return el;
          })}
          {widths.slice(1).map((_, i) => (
            <line
              key={`c-${i}`}
              x1={3 + widths.slice(0, i + 1).reduce((a, b) => a + b, 0) + (i + 1) * 2.4 - 1.2}
              y1={12}
              x2={3 + widths.slice(0, i + 1).reduce((a, b) => a + b, 0) + (i + 1) * 2.4 - 1.2}
              y2={28}
              strokeWidth={0.6}
              pathLength={1}
              className={`${structure} sig-draw`}
              style={at(i * 0.06)}
            />
          ))}
        </g>
      );
    }
    case "gradient-descent": {
      return (
        <g fill="none" strokeWidth={0.6}>
          {[14, 10.5, 7, 3.5].map((r, i) => (
            <ellipse key={i} cx={40} cy={20} rx={r * 1.5} ry={r} className={inert} />
          ))}
          <polyline
            points="6,6 16,11 26,16 34,19 38,20"
            strokeWidth={1.4}
            pathLength={1}
            className={`${structure} sig-draw`}
          />
          <circle
            cx={40}
            cy={20}
            r={2}
            className="fill-data stroke-none sig-pop"
            style={at(0.75)}
          />
        </g>
      );
    }
    case "attention": {
      const xs = [8, 19, 30, 41, 52];
      return (
        <g fill="none" strokeWidth={0.6}>
          {xs.map((x, i) => (
            <rect
              key={i}
              x={x - 3.5}
              y={26}
              width={7}
              height={7}
              rx={1}
              className={i === 2 ? "fill-data stroke-none" : "fill-fg-faint/40 stroke-none"}
            />
          ))}
          {[0, 1, 3, 4].map((i) => (
            <path
              key={`a-${i}`}
              d={`M30 26 Q ${(30 + xs[i]!) / 2} ${8 + Math.abs(2 - i) * 3} ${xs[i]} 26`}
              className={`${i === 4 ? live : structure} sig-draw`}
              strokeWidth={i === 4 ? 1.2 : 0.6}
              pathLength={1}
              style={at(i * 0.12)}
            />
          ))}
        </g>
      );
    }
    case "reward-playground": {
      return (
        <g fill="none" strokeWidth={0.6}>
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => (
              <rect
                key={`${r}-${c}`}
                x={17 + c * 6}
                y={5 + r * 6}
                width={5}
                height={5}
                className={inert}
              />
            )),
          )}
          <rect
            x={17}
            y={29}
            width={5}
            height={5}
            className="fill-[rgb(var(--c,var(--accent)))] stroke-none"
          />
          <rect
            x={41}
            y={5}
            width={5}
            height={5}
            className="fill-data stroke-none sig-pop"
            style={at(0.8)}
          />
          <polyline
            points="19.5,31.5 19.5,19.5 31.5,19.5 31.5,7.5 43.5,7.5"
            strokeWidth={1.2}
            pathLength={1}
            className={`${structure} sig-draw`}
          />
        </g>
      );
    }
    case "hypothesis-testing": {
      /*
       * Two sampling distributions, a boundary, and the tail past it. The
       * shape of the lab: the overlap is the problem and the vertical line is
       * the decision. Both curves are the same normal drawn twice at an
       * offset — the density formula, not a hand-drawn bell.
       */
      const bell = (centre: number, sd: number) => {
        const pts: string[] = [];
        for (let i = 0; i <= 48; i++) {
          const x = 4 + (i / 48) * 56;
          const z = (x - centre) / sd;
          pts.push(`${x.toFixed(1)},${(34 - Math.exp(-0.5 * z * z) * 25).toFixed(1)}`);
        }
        return pts.join(" ");
      };
      const CUT = 38;
      const tail: string[] = [];
      for (let i = 0; i <= 20; i++) {
        const x = CUT + (i / 20) * (60 - CUT);
        const z = (x - 26) / 7;
        tail.push(`${x.toFixed(1)},${(34 - Math.exp(-0.5 * z * z) * 25).toFixed(1)}`);
      }
      return (
        <g fill="none" strokeWidth={0.9}>
          <line x1={4} y1={34} x2={60} y2={34} className={inert} strokeWidth={0.5} />
          <polygon
            points={`${CUT},34 ${tail.join(" ")} 60,34`}
            className="fill-fg-faint/30 stroke-none"
          />
          <polyline points={bell(26, 7)} className={structure} />
          <polyline
            points={bell(42, 7)}
            className="stroke-data sig-pop"
            strokeDasharray="2.5 2"
            style={at(0.1)}
          />
          <line
            x1={CUT}
            y1={6}
            x2={CUT}
            y2={34}
            className={`${inert} sig-grow`}
            strokeDasharray="1.5 1.5"
            style={at(0.45)}
          />
        </g>
      );
    }
    case "probability": {
      /*
       * Three doors, one of them open. The lab's opening experiment, and the
       * only one of its four whose shape survives at this size. The open door
       * is the host's move — the thing that carries the information — so it is
       * the one that differs.
       */
      const DOOR_W = 14;
      const GAP = 7;
      const left = (i: number) => 8 + i * (DOOR_W + GAP);
      return (
        <g strokeWidth={0.9}>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={left(i)}
              y={7}
              width={DOOR_W}
              height={26}
              rx={1}
              fill="none"
              className={i === 1 ? inert : structure}
              strokeDasharray={i === 1 ? "2 1.6" : undefined}
            />
          ))}
          {/* The opened door: swung back, with nothing behind it. */}
          <polyline
            points={`${left(1)},7 ${left(1) - 5},11 ${left(1) - 5},29 ${left(1)},33`}
            fill="none"
            pathLength={1}
            className={`${inert} sig-draw`}
          />
          {/* Handles, so a rectangle reads as a door. */}
          {[0, 2].map((i) => (
            <circle
              key={i}
              cx={left(i) + DOOR_W - 3}
              cy={20}
              r={1.1}
              className={`${i === 2 ? "fill-data stroke-none" : "fill-fg-faint/60 stroke-none"} sig-pop`}
              style={at(i === 2 ? 0.55 : 0.35)}
            />
          ))}
        </g>
      );
    }
    case "floating-point": {
      /*
       * The two things the lab is about, one above the other: a number as a
       * row of bits in three groups — one sign, a short exponent, a longer
       * fraction — and the ruler those bits can write on.
       *
       * The ruler is computed, not drawn by eye. Its ticks are every value of
       * a tiny float with four values per doubling, so the gaps double at
       * each power of two exactly as they do in float32. One tick is live: the
       * nearest value to a mark that sits between two of them.
       */
      const BITS = [0, 0, 1, 1, 1, 0, 0, 1, 1, 0] as const;
      const scale = 7; // CSS units per unit of value: 0 … 8 spans 4 … 60
      const ticks: number[] = [0, 0.25, 0.5, 0.75];
      for (let e = 0; e < 3; e++) for (let m = 0; m < 4; m++) ticks.push((1 + m / 4) * 2 ** e);
      ticks.push(8);
      const LIVE = 9; // the tick at 2.5
      let x = 6;
      const cells = BITS.map((bit, i) => {
        const group = i === 0 ? 0 : i <= 3 ? 1 : 2; // sign, exponent, fraction
        if (i === 1 || i === 4) x += 2.2; // a gap between the groups
        const cell = { x, bit, group, i };
        x += 4.6;
        return cell;
      });
      return (
        <g>
          {cells.map((c) => (
            <rect
              key={c.i}
              x={c.x}
              y={5}
              width={3.8}
              height={7}
              rx={0.6}
              className={`${
                c.bit === 1
                  ? c.group === 1
                    ? "fill-[rgb(var(--c,var(--accent)))]"
                    : "fill-[rgb(var(--c,var(--accent))/0.55)]"
                  : "fill-fg-faint/25"
              } sig-blink`}
              style={at(c.i * 0.05)}
            />
          ))}
          <line x1={4} y1={30} x2={60} y2={30} strokeWidth={0.8} className={inert} />
          {ticks.map((v, i) => (
            <line
              key={`t-${i}`}
              x1={4 + v * scale}
              y1={i === LIVE ? 24 : 26.5}
              x2={4 + v * scale}
              y2={30}
              strokeWidth={i === LIVE ? 1.4 : 0.9}
              className={`${i === LIVE ? live : structure} sig-grow`}
              style={at(0.35 + i * 0.03)}
            />
          ))}
          {/* the number asked for, a little off the tick it is stored as */}
          <circle
            cx={4 + 2.63 * scale}
            cy={34.5}
            r={1.1}
            className="fill-fg-faint/60 sig-pop"
            style={at(0.95)}
          />
        </g>
      );
    }
    case "hash-table": {
      /*
       * A row of slots with one run of full ones. A key drops onto its home
       * inside the run, finds it taken, and hops right slot by slot to the
       * first free one, which is where it lands: linear probing, and the
       * reason a run grows. Every position is fixed, so the drawing is the
       * same on every visit.
       */
      const SLOTS = 10;
      const P = 5.6; // pitch
      const C = 4.6; // slot width
      const X0 = 4;
      const Y = 22;
      const FULL = new Set([1, 3, 4, 5, 6, 8]);
      const HOME = 3;
      const LAND = 7;
      const cx = (i: number) => X0 + i * P + C / 2;
      const hops = Array.from({ length: LAND - HOME }, (_, k) => HOME + k);
      return (
        <g>
          {Array.from({ length: SLOTS }, (_, i) => (
            <rect
              key={i}
              x={X0 + i * P}
              y={Y}
              width={C}
              height={C}
              rx={0.7}
              className={
                i === LAND
                  ? "fill-data sig-pop"
                  : FULL.has(i)
                    ? "fill-[rgb(var(--c,var(--accent))/0.45)]"
                    : "fill-fg-faint/25"
              }
              style={i === LAND ? at(0.85) : undefined}
            />
          ))}
          {/* the key, arriving at its home */}
          <line
            x1={cx(HOME)}
            y1={7}
            x2={cx(HOME)}
            y2={Y - 2}
            strokeWidth={0.8}
            pathLength={1}
            className={`${structure} sig-draw`}
            style={at(0.05)}
          />
          <circle cx={cx(HOME)} cy={6} r={1.4} className="fill-fg-faint/60" />
          {hops.map((i, k) => (
            <path
              key={i}
              d={`M ${cx(i)} ${Y - 1} Q ${(cx(i) + cx(i + 1)) / 2} ${Y - 5.5} ${cx(i + 1)} ${Y - 1}`}
              fill="none"
              strokeWidth={0.7}
              pathLength={1}
              className={`${live} sig-draw`}
              style={at(0.3 + k * 0.13)}
            />
          ))}
        </g>
      );
    }
    case "convolution": {
      /*
       * A picture, a 3×3 window on it, and the output it is filling in: the
       * cells already computed in the field colour, the one being computed
       * now in `data`, joined to the window that made it. The picture holds a
       * vertical stroke, the kind of thing the lab's first kernel finds.
       */
      const P = 4.6; // pitch of one cell
      const C = 4; // side of one cell
      const IN = { x: 4, y: 6, n: 6 };
      const OUT = { x: 41, y: 10.6, n: 4 };
      const WIN = { col: 2, row: 1 };
      const done = WIN.row * OUT.n + WIN.col; // cells computed before this one
      return (
        <g>
          {Array.from({ length: IN.n * IN.n }, (_, k) => {
            const col = k % IN.n;
            const row = Math.floor(k / IN.n);
            return (
              <rect
                key={`i-${k}`}
                x={IN.x + col * P}
                y={IN.y + row * P}
                width={C}
                height={C}
                rx={0.6}
                className={
                  col === 3 ? "fill-[rgb(var(--c,var(--accent))/0.55)]" : "fill-fg-faint/25"
                }
              />
            );
          })}
          <rect
            x={IN.x + WIN.col * P - 0.7}
            y={IN.y + WIN.row * P - 0.7}
            width={2 * P + C + 1.4}
            height={2 * P + C + 1.4}
            rx={1}
            strokeWidth={0.9}
            className={`fill-none ${structure} sig-pop`}
            style={at(0.1)}
          />
          {Array.from({ length: OUT.n * OUT.n }, (_, k) => {
            const col = k % OUT.n;
            const row = Math.floor(k / OUT.n);
            return (
              <rect
                key={`o-${k}`}
                x={OUT.x + col * P}
                y={OUT.y + row * P}
                width={C}
                height={C}
                rx={0.6}
                className={`${
                  k === done
                    ? "fill-data"
                    : k < done
                      ? "fill-[rgb(var(--c,var(--accent))/0.45)]"
                      : "fill-fg-faint/25"
                } sig-pop`}
                style={at(0.2 + k * 0.04)}
              />
            );
          })}
          <line
            x1={IN.x + WIN.col * P + 2 * P + C + 0.7}
            y1={IN.y + WIN.row * P + P + C / 2}
            x2={OUT.x + WIN.col * P}
            y2={OUT.y + WIN.row * P + C / 2}
            strokeWidth={0.6}
            pathLength={1}
            className={`${live} sig-draw`}
            style={at(0.3)}
          />
        </g>
      );
    }
    case "embedding-universe":
    default: {
      const pts = Array.from({ length: 26 }, () => ({ x: 4 + rng() * 56, y: 4 + rng() * 32 }));
      const hub = pts[7] ?? { x: 32, y: 20 };
      const near = pts.slice(0, 4);
      return (
        <g>
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === 7 ? 2 : 0.9}
              className={i === 7 ? "fill-data sig-pop" : "fill-fg-faint/50"}
            />
          ))}
          {near.map((p, i) => (
            <line
              key={`l-${i}`}
              x1={hub.x}
              y1={hub.y}
              x2={p.x}
              y2={p.y}
              strokeWidth={0.5}
              pathLength={1}
              className={`${structure} sig-draw`}
              style={at(0.15 + i * 0.1)}
            />
          ))}
        </g>
      );
    }
  }
}

export function LabSignature({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className={className} role="presentation">
      <Shape slug={slug} />
    </svg>
  );
}
