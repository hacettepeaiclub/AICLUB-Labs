import { memo, useRef, type PointerEvent } from "react";
import { labColor } from "@/design/tokens";
import { usePaletteVersion } from "@/hooks";
import { GRID, PATCH, PATCHES, SIZE, type Picture } from "../engine";
import { grey } from "../view";
import "./picture.css";

export interface PictureViewProps {
  picture: Picture;
  hidden?: readonly number[];
  selected?: number | null;
  selectedPixel?: number | null;
  onPick?: (index: number) => void;
  dragSelect?: boolean;
  patchLabel?: (n: number) => string;
  label: string;
}

/** Native HTML hit areas keep keyboard focus in CSS pixels, outside SVG units. */
export const PictureView = memo(function PictureView({
  picture,
  hidden = [],
  selected = null,
  selectedPixel = null,
  onPick,
  dragSelect = false,
  patchLabel,
  label,
}: PictureViewProps) {
  usePaletteVersion();
  const dragging = useRef(false);
  const last = useRef(-1);
  const line = labColor("fgFaint", 0.6),
    cover = labColor("ink800"),
    mark = labColor("data");
  const pickAt = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(GRID - 1, Math.floor(((event.clientX - rect.left) / rect.width) * GRID)),
    );
    const y = Math.max(
      0,
      Math.min(GRID - 1, Math.floor(((event.clientY - rect.top) / rect.height) * GRID)),
    );
    const index = y * GRID + x;
    if (index !== last.current) {
      last.current = index;
      onPick?.(index);
    }
  };
  return (
    <div
      className="relative w-full"
      role={onPick ? "group" : undefined}
      aria-label={onPick ? label : undefined}
    >
      <svg
        viewBox={`-0.3 -0.3 ${SIZE + 0.6} ${SIZE + 0.6}`}
        role={onPick ? undefined : "img"}
        aria-label={onPick ? undefined : label}
        aria-hidden={onPick ? true : undefined}
        className="block w-full"
      >
        {Array.from(picture.pixels, (v, k) => (
          <rect
            key={k}
            x={k % SIZE}
            y={Math.floor(k / SIZE)}
            width="1.02"
            height="1.02"
            fill={grey(v)}
          />
        ))}
        {Array.from({ length: GRID + 1 }, (_, i) => (
          <g key={i}>
            <line x1={i * PATCH} y1={0} x2={i * PATCH} y2={SIZE} stroke={line} strokeWidth="0.08" />
            <line x1={0} y1={i * PATCH} x2={SIZE} y2={i * PATCH} stroke={line} strokeWidth="0.08" />
          </g>
        ))}
        {hidden.map((i) => (
          <g key={i}>
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
        {selected !== null && (
          <rect
            x={(selected % GRID) * PATCH}
            y={Math.floor(selected / GRID) * PATCH}
            width={PATCH}
            height={PATCH}
            fill="none"
            stroke={mark}
            strokeWidth="0.12"
          />
        )}
        {selectedPixel !== null && (
          <rect
            x={selectedPixel % SIZE}
            y={Math.floor(selectedPixel / SIZE)}
            width="1"
            height="1"
            fill="none"
            stroke={labColor("accent")}
            strokeWidth="0.12"
          />
        )}
      </svg>
      {onPick && (
        <div
          className="jepa-picture-grid"
          style={{ touchAction: dragSelect ? "none" : "manipulation" }}
          onPointerDown={
            dragSelect
              ? (e) => {
                  dragging.current = true;
                  last.current = -1;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  pickAt(e);
                }
              : undefined
          }
          onPointerMove={
            dragSelect
              ? (e) => {
                  if (dragging.current) pickAt(e);
                }
              : undefined
          }
          onPointerUp={
            dragSelect
              ? () => {
                  dragging.current = false;
                }
              : undefined
          }
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          {Array.from({ length: PATCHES }, (_, i) => (
            <button
              key={i}
              type="button"
              data-patch={i}
              aria-label={patchLabel?.(i + 1) ?? String(i + 1)}
              aria-pressed={selected === i}
              onClick={() => onPick(i)}
              className="jepa-picture-cell"
            />
          ))}
        </div>
      )}
    </div>
  );
});

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
