import { useMemo, useState } from "react";
import { Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabCopy } from "@/i18n/labs";
import { PATCH, patchOf, pictures } from "../engine";
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
  const picture = useMemo(() => pictures(seed, 1)[0]!, [seed]);
  const numbers = patchOf(picture, selected);
  const kind = t.kinds[picture.textures[selected]!];

  return (
    <Stage
      width="wide"
      caption={copy.caption}
      viewport={
        <div className="grid grid-cols-2 items-start gap-3 rounded-lg border border-line/20 bg-ink-900 p-4 sm:gap-4">
          <PictureView
            picture={picture}
            selected={selected}
            onPick={setSelected}
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
                      <td key={col} className="text-caption text-fg">
                        {t.decimal(numbers[row * PATCH + col]!, 2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-caption text-fg-muted">{copy.kindNote(kind)}</p>
          </div>
        </div>
      }
      primary={
        <Button variant="secondary" onClick={() => setSeed(seed + 1)}>
          {copy.another}
        </Button>
      }
      controls="stack"
    />
  );
}
