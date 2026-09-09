import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { COLS, GOAL, ROWS, START, TILE, colOf, rowOf } from "../world";
import { ARROWS, cellKind, type CellKind } from "../view";

export interface RoomGridProps {
  /** Where the agent is standing. */
  agent: number;
  /** Cells walked so far this episode, drawn as a trail. */
  path?: readonly number[];
  /** Greedy action per cell, `-1` where there is none. Draws the policy. */
  policy?: Int8Array | null;
  /** `max_a Q(s,a)` per cell, for the tint. Tint is never the only channel. */
  values?: Float64Array | null;
  /** Cell the inspector is on, ringed. */
  selected?: number | null;
  onSelect?: (cell: number) => void;
  /** Spoken description of the whole picture. */
  label: string;
  className?: string;
}

const KIND_CLASS: Record<CellKind, string> = {
  // A wall must read as solid in both themes or the room has no shape and the
  // detour has no visible reason.
  wall: "bg-fg-faint/50",
  floor: "bg-line/[0.04]",
  start: "bg-line/[0.04] ring-1 ring-line/20",
  tile: "bg-signal-amber/20 ring-2 ring-signal-amber",
  goal: "bg-signal-green/20 ring-2 ring-signal-green",
};

/**
 * The room: floor, walls, the marked square, the door, and whatever the caller
 * wants drawn on top of it.
 *
 * Real DOM elements rather than a canvas, so a wall is a wall in the document
 * and every square with a number in it can be reached, focused and read. The
 * overlay uses a `0 0 6 6` viewBox, so a cell centre is `(col + 0.5,
 * row + 0.5)` and nothing here ever measures the DOM — no `ResizeObserver`, no
 * layout read, exact at any size.
 *
 * ## Channels
 *
 * Nothing is carried by colour alone. The door and the marked square each have
 * a glyph as well as a ring; the policy is an arrow glyph, not a hue; the value
 * tint sits *behind* a printed number and a direction, never instead of them.
 * The agent is a filled disc with a contrasting outline, so it survives both
 * themes and greyscale.
 *
 * When `onSelect` is given the squares become buttons and the grid becomes a
 * real `role="grid"`; without it the whole thing is one labelled image, because
 * a page full of focusable cells nobody can act on is worse than a picture.
 */
export function RoomGrid({
  agent,
  path,
  policy,
  values,
  selected,
  onSelect,
  label,
  className,
}: RoomGridProps) {
  const copy = useT().labs["reward-playground"];
  const interactive = typeof onSelect === "function";

  const visits = new Map<number, number>();
  if (path) {
    for (let i = 1; i < path.length; i++) {
      const cell = path[i]!;
      visits.set(cell, (visits.get(cell) ?? 0) + 1);
    }
  }

  let largest = 0;
  if (values) for (const value of values) largest = Math.max(largest, Math.abs(value));

  const cells = Array.from({ length: ROWS * COLS }, (_, index) => index);

  return (
    <div
      className={cn("rounded border border-line/10 bg-ink-950 p-3", className)}
      {...(interactive ? {} : { role: "img", "aria-label": label })}
    >
      <div className="relative aspect-square w-full">
        <div
          className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1"
          {...(interactive ? { role: "grid", "aria-label": label } : { "aria-hidden": true })}
        >
          {cells.map((index) => {
            const kind = cellKind(index);
            const isWallCell = kind === "wall";
            const value = values?.[index] ?? 0;
            const action = policy?.[index] ?? -1;
            const tint = largest > 0 ? Math.min(1, Math.abs(value) / largest) : 0;

            const body = (
              <>
                {!isWallCell && values && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 rounded-sm",
                      value > 0 ? "bg-signal-green" : "bg-signal-rose",
                    )}
                    style={{ opacity: tint * 0.28 }}
                  />
                )}
                {!isWallCell && (visits.get(index) ?? 0) > 0 && (
                  <span aria-hidden className="absolute inset-0 rounded-sm bg-accent/15" />
                )}
                {index === GOAL && (
                  <span aria-hidden className="relative font-mono text-body text-signal-green">
                    ⌂
                  </span>
                )}
                {index === TILE && (
                  <span aria-hidden className="relative font-mono text-body text-signal-amber">
                    ✦
                  </span>
                )}
                {!isWallCell && index !== GOAL && index !== TILE && action >= 0 && (
                  <span aria-hidden className="relative font-mono text-body leading-none text-fg">
                    {ARROWS[action as 0 | 1 | 2 | 3]}
                  </span>
                )}
                {!isWallCell && values && index !== GOAL && (
                  <span
                    aria-hidden
                    className="relative mt-0.5 font-mono text-[0.55rem] leading-none tabular-nums text-fg-muted"
                  >
                    {value.toFixed(1)}
                  </span>
                )}
              </>
            );

            const shared = cn(
              "relative flex flex-col items-center justify-center rounded-sm",
              KIND_CLASS[kind],
              index === START && kind !== "tile" && kind !== "goal" && "ring-1 ring-line/20",
              selected === index && "ring-2 ring-accent",
            );

            if (!interactive) {
              // Still draws its contents: a non-interactive room is a picture
              // of the policy, not an empty board. Only the wrapper's role
              // changes — the whole grid is described by one label instead of
              // thirty-six focusable cells nobody can act on.
              return (
                <div key={index} aria-hidden className={shared}>
                  {body}
                </div>
              );
            }

            const spoken = isWallCell
              ? copy.learn.wallCell(rowOf(index) + 1, colOf(index) + 1)
              : copy.learn.cellLabel(
                  rowOf(index) + 1,
                  colOf(index) + 1,
                  value.toFixed(2),
                  action < 0 ? copy.learn.noAction : copy.learn.actions[action as 0 | 1 | 2 | 3],
                );

            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                aria-selected={selected === index}
                aria-label={spoken}
                tabIndex={selected === index ? 0 : -1}
                disabled={isWallCell}
                onClick={() => onSelect(index)}
                className={cn(
                  shared,
                  "min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
                  isWallCell && "cursor-default",
                )}
              >
                {body}
              </button>
            );
          })}
        </div>

        {/* The trail and the agent, on top of everything. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${COLS} ${ROWS}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          {path && path.length > 1 && (
            <polyline
              points={path.map((c) => `${colOf(c) + 0.5},${rowOf(c) + 0.5}`).join(" ")}
              fill="none"
              className="stroke-accent/60"
              strokeWidth={0.07}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          <circle
            cx={colOf(agent) + 0.5}
            cy={rowOf(agent) + 0.5}
            r={0.22}
            className="fill-accent"
          />
          <circle
            cx={colOf(agent) + 0.5}
            cy={rowOf(agent) + 0.5}
            r={0.3}
            className="fill-none stroke-fg/70"
            strokeWidth={0.05}
          />
        </svg>
      </div>
    </div>
  );
}
