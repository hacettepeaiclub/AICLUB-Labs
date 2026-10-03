import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { at, correlate, extent, sum, withCell } from "../engine";
import { PRESET_ORDER, PRESETS, scene, type PresetId } from "../pictures";
import { formatValue } from "../view";
import { GridView } from "./GridView";
import { Panel } from "./Panel";
import { kernelOf, KernelEditor, textOf } from "./KernelEditor";

const SIZE = 32;
const PICTURE = scene(SIZE);

/** Which preset, if any, the nine cells currently spell. */
const presetOf = (cells: readonly string[]): PresetId | "custom" =>
  PRESET_ORDER.find((id) => textOf(PRESETS[id]).every((c, k) => c === cells[k])) ?? "custom";

/**
 * Section 2: nine numbers, and what they do to a picture.
 *
 * The same sliding sum as the section before, now over a 32×32 picture with
 * padding, so the output is the same size as the input and the two can be
 * read side by side. The presets are starting points; every cell is
 * editable, and the visitor can draw on the picture to give a kernel
 * something new to find.
 *
 * One reading carries most of the lesson: the sum of the weights. On a flat
 * patch every pixel is the same, so the output is that brightness times the
 * sum — 1 keeps it, 0 erases it, which is why every edge detector's weights
 * add up to zero.
 */
export function KernelStage() {
  const lab = useLabs().convolution;
  const t = lab.kernels;
  const [saved, save] = useLocalControls("acl:convolution:kernel", {
    cells: textOf(PRESETS.vertical),
  });
  // A stored value that is not nine strings is a stale or edited one.
  const cells =
    Array.isArray(saved.cells) &&
    saved.cells.length === 9 &&
    saved.cells.every((c) => typeof c === "string")
      ? saved.cells
      : textOf(PRESETS.vertical);
  const [picture, setPicture] = useState(PICTURE);
  const drawn = picture !== PICTURE;

  const kernel = useMemo(() => kernelOf(cells), [cells]);
  const output = useMemo(
    () => (kernel ? correlate(picture, kernel, { padding: 1 }) : null),
    [picture, kernel],
  );
  const preset = presetOf(cells);
  const range = output ? extent(output) : null;

  const brush = (x: number, y: number) =>
    setPicture((g) => {
      let next = g;
      for (const [dx, dy] of [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ] as const) {
        if (at(g, x + dx, y + dy) < 1) next = withCell(next, x + dx, y + dy, 1);
      }
      return next;
    });

  const legend = (
    <span className="flex gap-3">
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-accent" />
        {t.legend.positive}
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-signal-rose" />
        {t.legend.negative}
      </span>
    </span>
  );

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={
        kernel && range
          ? t.announce(formatValue(sum(kernel)), formatValue(range.min), formatValue(range.max))
          : ""
      }
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_7.5rem_minmax(0,1fr)] sm:items-start sm:gap-4">
            <Panel label={t.input} note={t.drawHint}>
              <GridView grid={picture} kind="image" onCell={brush} paint ariaLabel={t.inputLabel} />
            </Panel>
            <KernelEditor
              cells={cells}
              onChange={(next) => save({ cells: next })}
              label={t.editorLabel}
              cellLabel={lab.cellLabel}
              invalid={lab.invalidWeight}
              className="order-last col-span-2 mx-auto w-40 sm:order-none sm:col-span-1 sm:w-full"
            />
            <Panel label={t.output} note={output && range && range.min < -1e-9 ? legend : null}>
              {output ? (
                <GridView grid={output} kind="auto" ariaLabel={t.outputLabel} />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded border border-dashed border-line/15 p-4 text-center text-caption text-fg-faint">
                  {lab.invalidWeight}
                </div>
              )}
            </Panel>
          </div>
          <p className="text-body-sm text-fg-muted">{t.notes[preset]}</p>
        </div>
      }
      primary={
        <Segmented
          label={t.presetLabel}
          value={preset === "custom" ? ("" as PresetId) : preset}
          options={PRESET_ORDER.map((id) => ({ value: id, label: t.presets[id] }))}
          onChange={(id) => save({ cells: textOf(PRESETS[id]) })}
        />
      }
      secondary={
        <Button
          variant="secondary"
          onClick={() => setPicture(PICTURE)}
          disabled={!drawn}
          className="min-h-[44px] w-full"
        >
          {t.restore}
        </Button>
      }
      secondaryLabel={t.pictureLabel}
      figures={
        <>
          <Figure
            label={t.figures.sum}
            value={kernel ? formatValue(sum(kernel)) : "—"}
            hint={t.figures.sumHint}
            tone="accent"
          />
          <Figure
            label={t.figures.range}
            value={range ? `${formatValue(range.min)} … ${formatValue(range.max)}` : "—"}
          />
        </>
      }
    />
  );
}
