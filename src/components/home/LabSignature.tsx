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
 * ## Why they are not live
 *
 * A live miniature means importing that lab's engine, and nine engine imports
 * in the entry chunk would undo the lazy registry — a visitor would download
 * all nine labs to look at the home page. So the home page imports no engine
 * at all: it draws instead.
 *
 * They stay honest about that: every shape here is generated from a fixed seed
 * and drawn once, so nothing pretends to be computing. No animation, no state,
 * no `requestAnimationFrame`.
 *
 * ## Why they all look related
 *
 * One viewBox, one stroke weight, one palette — inert marks in `fg-faint`,
 * structure in `accent`, and at most one element in `data` to carry the eye.
 * Nine labs, one drawing language, rather than nine unrelated styles.
 */

const W = 64;
const H = 40;

/** Deterministic per slug, so a card looks the same on every visit. */
const seeded = (slug: string) => {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return createRng(h >>> 0);
};

const inert = "stroke-fg-faint/45";
const structure = "stroke-accent";
const live = "stroke-data";

/**
 * Fill steps for the hash digest, written out rather than interpolated: these
 * strings have to survive Tailwind's source scan, and a template literal does
 * not.
 */
const HASH_FILLS = ["fill-accent/25", "fill-accent/45", "fill-accent/70", "fill-accent"];

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
                  className={structure}
                />
                {Array.from({ length: CELLS }, (_, i) => {
                  const digest = HASH_FILLS[Math.floor(rng() * HASH_FILLS.length)] ?? "fill-accent";
                  return (
                    <rect
                      key={`out-${row}-${i}`}
                      x={OUT_X + i * PITCH}
                      y={midY - 4.5}
                      width={CELL_W}
                      height={9}
                      className={row === 1 && i === 4 ? "fill-data" : digest}
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
          {layers.slice(0, -1).map((count, l) =>
            Array.from({ length: count }, (_, i) =>
              Array.from({ length: layers[l + 1] ?? 0 }, (_, j) => (
                <line
                  key={`${l}-${i}-${j}`}
                  x1={xs[l]}
                  y1={(H / (count + 1)) * (i + 1)}
                  x2={xs[l + 1]}
                  y2={(H / ((layers[l + 1] ?? 1) + 1)) * (j + 1)}
                  className={inert}
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
                className={l === 1 && i === 1 ? "fill-data stroke-data" : "fill-ink-950 stroke-accent"}
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
                    ? "fill-accent"
                    : depth === FRONTIER
                      ? "fill-accent/55"
                      : depth < FRONTIER
                        ? "fill-accent/25"
                        : "fill-fg-faint/20";
              return (
                <rect
                  key={`${r}-${c}`}
                  x={X0 + c * PITCH}
                  y={Y0 + r * PITCH}
                  width={SIZE}
                  height={SIZE}
                  className={fill}
                />
              );
            }),
          )}
          <polyline
            points={`${cx(1)},${cy(3)} ${cx(3)},${cy(3)} ${cx(3)},${cy(2)} ${cx(5)},${cy(2)} ${cx(5)},${cy(1)} ${cx(8)},${cy(1)}`}
            fill="none"
            strokeWidth={1.4}
            className={structure}
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
              className={i > 13 ? "fill-accent" : "fill-fg-faint/45"}
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
                className={i === 3 ? "fill-data" : "fill-fg-faint/40"}
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
              className={structure}
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
          <polyline points="6,6 16,11 26,16 34,19 38,20" strokeWidth={1.4} className={structure} />
          <circle cx={40} cy={20} r={2} className="fill-data stroke-none" />
        </g>
      );
    }
    case "attention": {
      const xs = [8, 19, 30, 41, 52];
      return (
        <g fill="none" strokeWidth={0.6}>
          {xs.map((x, i) => (
            <rect key={i} x={x - 3.5} y={26} width={7} height={7} rx={1} className={i === 2 ? "fill-data stroke-none" : "fill-fg-faint/40 stroke-none"} />
          ))}
          {[0, 1, 3, 4].map((i) => (
            <path
              key={`a-${i}`}
              d={`M30 26 Q ${(30 + xs[i]!) / 2} ${8 + Math.abs(2 - i) * 3} ${xs[i]} 26`}
              className={i === 4 ? live : structure}
              strokeWidth={i === 4 ? 1.2 : 0.6}
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
              <rect key={`${r}-${c}`} x={17 + c * 6} y={5 + r * 6} width={5} height={5} className={inert} />
            )),
          )}
          <rect x={17} y={29} width={5} height={5} className="fill-accent stroke-none" />
          <rect x={41} y={5} width={5} height={5} className="fill-data stroke-none" />
          <polyline points="19.5,31.5 19.5,19.5 31.5,19.5 31.5,7.5 43.5,7.5" strokeWidth={1.2} className={structure} />
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
            <circle key={i} cx={p.x} cy={p.y} r={i === 7 ? 2 : 0.9} className={i === 7 ? "fill-data" : "fill-fg-faint/50"} />
          ))}
          {near.map((p, i) => (
            <line key={`l-${i}`} x1={hub.x} y1={hub.y} x2={p.x} y2={p.y} strokeWidth={0.5} className={structure} />
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
