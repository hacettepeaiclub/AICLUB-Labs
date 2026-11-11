import type { KeyboardEvent } from "react";
import { labColor } from "@/design/tokens";
import { usePaletteVersion } from "@/hooks";
import { GRID, PATCH, PATCHES, SIZE, type Picture } from "../engine";
import { grey } from "../view";

export interface PictureViewProps {
  picture: Picture;
  /** Patches covered by the hidden block. */
  hidden?: readonly number[];
  /** The patch outlined as chosen. */
  selected?: number | null;
  /** Makes every patch a button. */
  onPick?: (index: number) => void;
  patchLabel?: (n: number) => string;
  label: string;
}

/**
 * The picture as its 256 pixels, with the patch grid on top. The pixels are
 * drawn in their own greys in either theme: a picture is data, not chrome.
 */
export function PictureView({
  picture,
  hidden = [],
  selected = null,
  onPick,
  patchLabel,
  label,
}: PictureViewProps) {
  usePaletteVersion();
  const line = labColor("fgFaint", 0.6);
  const cover = labColor("ink800");
  const mark = labColor("data");

  const pixels = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      pixels.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1.02"
          height="1.02"
          fill={grey(picture.pixels[y * SIZE + x]!)}
        />,
      );
    }
  }

  const onKey = (index: number) => (event: KeyboardEvent<SVGRectElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPick?.(index);
    }
  };

  return (
    <svg
      viewBox={`-0.3 -0.3 ${SIZE + 0.6} ${SIZE + 0.6}`}
      role="img"
      aria-label={label}
      className="w-full"
    >
      <g aria-hidden="true">{pixels}</g>
      {Array.from({ length: GRID + 1 }, (_, i) => (
        <g key={i} aria-hidden="true">
          <line x1={i * PATCH} y1={0} x2={i * PATCH} y2={SIZE} stroke={line} strokeWidth="0.08" />
          <line x1={0} y1={i * PATCH} x2={SIZE} y2={i * PATCH} stroke={line} strokeWidth="0.08" />
        </g>
      ))}
      {hidden.map((i) => (
        <g key={`h${i}`} aria-hidden="true">
          <rect
            x={(i % GRID) * PATCH}
            y={Math.floor(i / GRID) * PATCH}
            width={PATCH}
            height={PATCH}
            fill={cover}
          />
          <text
            x={(i % GRID) * PATCH + PATCH / 2}
            y={Math.floor(i / GRID) * PATCH + PATCH / 2 + 0.7}
            textAnchor="middle"
            fontSize="2"
            fill={line}
          >
            ?
          </text>
        </g>
      ))}
      {Array.from({ length: PATCHES }, (_, i) => (
        <rect
          key={`p${i}`}
          data-patch={i}
          x={(i % GRID) * PATCH}
          y={Math.floor(i / GRID) * PATCH}
          width={PATCH}
          height={PATCH}
          fill="transparent"
          stroke={selected === i ? mark : "none"}
          strokeWidth="0.3"
          role={onPick ? "button" : undefined}
          tabIndex={onPick ? 0 : undefined}
          aria-label={onPick && patchLabel ? patchLabel(i + 1) : undefined}
          aria-pressed={onPick ? selected === i : undefined}
          onClick={onPick ? () => onPick(i) : undefined}
          onKeyDown={onPick ? onKey(i) : undefined}
          style={onPick ? { cursor: "pointer" } : undefined}
        />
      ))}
    </svg>
  );
}

/** One patch on its own, at the same greys. */
export function PatchView({ pixels, label }: { pixels: Float64Array; label: string }) {
  return (
    <svg viewBox={`0 0 ${PATCH} ${PATCH}`} role="img" aria-label={label} className="w-full">
      {Array.from(pixels, (v, k) => (
        <rect
          key={k}
          x={k % PATCH}
          y={Math.floor(k / PATCH)}
          width="1.02"
          height="1.02"
          fill={grey(v)}
        />
      ))}
    </svg>
  );
}
