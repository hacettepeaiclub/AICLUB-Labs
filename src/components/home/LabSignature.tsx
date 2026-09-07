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
 * all nine labs to look at the home page. The hero runs one real engine
 * (`SortingPreview`) because one is affordable; the grid draws instead.
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

function Shape({ slug }: { slug: string }) {
  const rng = seeded(slug);

  switch (slug) {
    case "hash-playground": {
      // Fixed-width blocks: any input, always the same number of bits out.
      return (
        <g>
          {Array.from({ length: 16 }, (_, i) => (
            <rect
              key={i}
              x={2 + i * 3.9}
              y={20 - (4 + rng() * 12) / 2}
              width={2.6}
              height={4 + rng() * 12}
              className={i === 6 ? "fill-data" : "fill-fg-faint/45"}
            />
          ))}
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
      return (
        <g fill="none" strokeWidth={0.6}>
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 10 }, (_, c) => (
              <rect key={`${r}-${c}`} x={2 + c * 6} y={4 + r * 5.4} width={5} height={4.4} className={inert} />
            )),
          )}
          <polyline
            points="4.5,6 10.5,6 16.5,11 22.5,16 34.5,16 40.5,22 52.5,22 58.5,28"
            strokeWidth={1.4}
            className={structure}
          />
          <circle cx={58.5} cy={28} r={2} className="fill-data stroke-none" />
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
