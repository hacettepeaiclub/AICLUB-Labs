import { labColor } from "@/design/tokens";
import { usePaletteVersion } from "@/hooks";
import type { MapPoint } from "../engine";
import { kindColor, mapRange } from "../view";

export interface MapGuess {
  readonly guess: { x: number; y: number };
  readonly goal: { x: number; y: number };
}

export interface MapViewProps {
  points: readonly MapPoint[];
  guesses?: readonly MapGuess[];
  label: string;
}

const S = 100;

/**
 * The vectors laid flat, one dot per patch, coloured by the kind the model
 * never sees. The frame fits the points, down to a floor, so a collapse
 * still shows as the cloud shrinking.
 */
export function MapView({ points, guesses = [], label }: MapViewProps) {
  usePaletteVersion();
  const axis = labColor("fgFaint", 0.35);
  const ring = labColor("fg");
  const farthest = Math.max(
    0,
    ...points.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))),
    ...guesses.flatMap(({ guess, goal }) => [guess.x, guess.y, goal.x, goal.y].map(Math.abs)),
  );
  const range = mapRange(farthest);
  const at = (v: number) => ((v + range) / (2 * range)) * S;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label={label} className="w-full">
      <line x1={S / 2} y1={2} x2={S / 2} y2={S - 2} stroke={axis} strokeWidth="0.3" />
      <line x1={2} y1={S / 2} x2={S - 2} y2={S / 2} stroke={axis} strokeWidth="0.3" />
      {points.map((p, i) => (
        <circle key={i} cx={at(p.x)} cy={at(-p.y)} r="1.3" fill={kindColor(p.texture, 0.75)} />
      ))}
      {guesses.map(({ guess, goal }, i) => (
        <g key={`g${i}`}>
          <line
            x1={at(guess.x)}
            y1={at(-guess.y)}
            x2={at(goal.x)}
            y2={at(-goal.y)}
            stroke={ring}
            strokeWidth="0.4"
            strokeDasharray="1 1"
          />
          <circle cx={at(goal.x)} cy={at(-goal.y)} r="1.6" fill={ring} />
          <circle
            cx={at(guess.x)}
            cy={at(-guess.y)}
            r="2.4"
            fill="none"
            stroke={ring}
            strokeWidth="0.6"
          />
        </g>
      ))}
    </svg>
  );
}

/** The kinds and their colours, under the map. */
export function KindLegend({
  kinds,
}: {
  kinds: readonly { texture: MapPoint["texture"]; name: string }[];
}) {
  usePaletteVersion();
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-fg-muted">
      {kinds.map(({ texture, name }) => (
        <li key={texture} className="flex items-center gap-2">
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden="true">
            <circle cx="5" cy="5" r="5" fill={kindColor(texture)} />
          </svg>
          {name}
        </li>
      ))}
    </ul>
  );
}
