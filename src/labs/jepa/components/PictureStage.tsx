import { useMemo, useState } from "react";
import { Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabCopy } from "@/i18n/labs";
import { GRID, PATCH, SIZE, patchOf, pictures } from "../engine";
import { grey } from "../view";
import { PictureView } from "./PictureView";

/**
 * Section 1: what the model is given. A picture is 256 brightness values,
 * cut into 16 patches of 16; pick one and read its numbers. The kind under
 * it is shown to the visitor and said to be withheld from the model.
 */
export function PictureStage() {
  const t = useLabCopy("jepa");
  const copy = t.picture;
  const [seed, setSeed] = useState(3);
  // A stripe patch, so the first numbers read are a pattern, not a flat grey.
  const [selected, setSelected] = useState(1);
  const [pixel, setPixel] = useState(0);
  const [edits, setEdits] = useState<Record<number, number>>({});
  const picture = useMemo(() => {
    const source = pictures(seed, 1)[0]!;
    const pixels = source.pixels.slice();
    for (const [index, value] of Object.entries(edits)) pixels[Number(index)] = value;
    return { ...source, pixels };
  }, [seed, edits]);
  const selectedPixel =
    (Math.floor(selected / GRID) * PATCH + Math.floor(pixel / PATCH)) * SIZE +
    (selected % GRID) * PATCH +
    (pixel % PATCH);
  const numbers = patchOf(picture, selected);
  const kind = t.kinds[picture.textures[selected]!];

  return (
    <Stage
      width="wide"
      caption={copy.caption}
      viewport={
        <div className="grid items-start gap-4 rounded-lg border border-line/20 bg-ink-900 p-4 sm:grid-cols-2">
          <PictureView
            picture={picture}
            selected={selected}
            onPick={(n) => {
              setSelected(n);
              setPixel(0);
            }}
            selectedPixel={selectedPixel}
            patchLabel={copy.patchLabel}
            label={copy.pictureLabel}
          />
          <div className="min-w-0">
            <p className="text-overline uppercase text-fg-muted">
              {copy.numbersTitle(selected + 1)}
            </p>
            <table className="mt-2 w-full font-mono tabular-nums" aria-label={copy.numbersLabel}>
              <tbody>
                {Array.from({ length: PATCH }, (_, row) => (
                  <tr key={row}>
                    {Array.from({ length: PATCH }, (_, col) => (
                      <td key={col} className="p-0.5 text-caption">
                        <button
                          type="button"
                          data-pixel={row * PATCH + col}
                          aria-label={`${t.pixel.selected} ${row * PATCH + col + 1}`}
                          aria-pressed={pixel === row * PATCH + col}
                          onClick={() => setPixel(row * PATCH + col)}
                          className="min-h-11 w-full rounded-sm border-2 px-1 font-mono"
                          style={{
                            background: grey(numbers[row * PATCH + col]!),
                            color: numbers[row * PATCH + col]! > 0.55 ? "#101018" : "#f8fafc",
                            borderColor:
                              pixel === row * PATCH + col ? "rgb(var(--accent))" : "transparent",
                          }}
                        >
                          {t.decimal(numbers[row * PATCH + col]!, 2)}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-caption text-fg-muted">{copy.kindNote(kind)}</p>
            <label className="mt-4 block space-y-2 text-body-sm text-fg">
              {t.pixel.label}
              <input
                data-pixel-brightness
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={picture.pixels[selectedPixel]}
                onChange={(e) => setEdits({ ...edits, [selectedPixel]: Number(e.target.value) })}
                className="min-h-11 w-full accent-accent"
              />
            </label>
            <p className="text-caption text-fg-muted">{t.pixel.hint}</p>
          </div>
        </div>
      }
      primary={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setSeed(seed + 1);
              setEdits({});
            }}
          >
            {copy.another}
          </Button>
          <Button variant="ghost" onClick={() => setEdits({})}>
            {t.pixel.reset}
          </Button>
        </div>
      }
      controls="stack"
    />
  );
}
