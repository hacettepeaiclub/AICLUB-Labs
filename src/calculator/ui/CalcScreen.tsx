import { STAT_LIST_ROWS, type DisplayModel, type ResultView } from "../engine/machine";

/**
 * The calculator's display: a dark well with phosphor-green characters, the
 * same green the rest of the site is lit with.
 *
 * It draws `display(state)` and nothing else; what is on screen is decided by
 * the machine. Hidden from screen readers, because `summarize` below says the
 * same thing in words and the page announces that instead.
 */
export function CalcScreen({ view }: { view: DisplayModel }) {
  return (
    <div aria-hidden className="calc-screen">
      <div className="calc-status">
        <span className="calc-flag" data-flag="shift" data-on={view.shift || undefined}>
          S
        </span>
        <span className="calc-flag" data-flag="alpha" data-on={view.alpha || undefined}>
          A
        </span>
        {view.pending && <span className="calc-dim">{view.pending}</span>}
        <span className="calc-dim">{view.angle}</span>
        <span className="calc-dim ml-auto">{view.mode}</span>
      </div>
      <div className="calc-body">
        <Body view={view} />
      </div>
    </div>
  );
}

/** Rows of a table shown at once, around the active one. */
const TABLE_ROWS = 4;

function Body({ view }: { view: DisplayModel }) {
  const body = view.body;
  switch (body.kind) {
    case "calc":
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="calc-input">
            {body.input.map((text, i) => (
              <span key={i}>
                {body.cursor === i && <Caret />}
                {text}
              </span>
            ))}
            {body.cursor === body.input.length && <Caret />}
          </p>
          {body.result && <Result result={body.result} label={body.label} />}
        </div>
      );
    case "menu":
      return (
        <div className="calc-small flex h-full flex-col">
          {body.title && <p className="calc-dim mb-1 truncate">{body.title}</p>}
          <ul
            className="calc-menu"
            data-columns={body.selected !== null ? body.columns : body.items.length > 4 ? 2 : 1}
          >
            {body.items.map((entry, i) => (
              <li
                key={entry.key + entry.label}
                className="truncate"
                data-active={body.selected === i || undefined}
              >
                {entry.key && <span className="calc-dim">{entry.key}:</span>}
                {entry.label}
              </li>
            ))}
          </ul>
          {body.pages > 1 && (
            <p className="calc-more">
              {body.page > 0 ? "◀ " : ""}
              {body.page + 1}/{body.pages}
              {body.page < body.pages - 1 ? " ▶" : ""}
            </p>
          )}
        </div>
      );
    case "table": {
      const active = Math.max(
        0,
        body.rows.findIndex((row) => row.active !== null),
      );
      const start = Math.max(0, Math.min(active - 2, body.rows.length - TABLE_ROWS));
      const width = Math.max(1, ...body.rows.map((row) => row.cells.length));
      const columns = `minmax(2rem,auto) repeat(${width}, minmax(0, 1fr))`;
      return (
        <div className="calc-small flex h-full flex-col">
          {body.title && <p className="calc-dim truncate">{body.title}</p>}
          {body.columns.length > 0 && (
            <div className="calc-colhead calc-dim" style={{ gridTemplateColumns: columns }}>
              <span />
              {body.columns.map((name) => (
                <span key={name} className="text-center">
                  {name}
                </span>
              ))}
            </div>
          )}
          {body.rows.slice(start, start + TABLE_ROWS).map((row, i) => (
            <div key={start + i} className="calc-row" style={{ gridTemplateColumns: columns }}>
              <span>{row.head}</span>
              {row.cells.map((cell, j) => (
                <span key={j} className="calc-cell" data-active={row.active === j || undefined}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
          <p className="mt-auto truncate text-right">{body.entry ?? ""}</p>
        </div>
      );
    }
    case "list":
      return (
        <div className="calc-list flex h-full flex-col">
          {body.title && <p className="calc-dim">{body.title}</p>}
          {body.rows.slice(body.top, body.top + STAT_LIST_ROWS).map((row) => (
            <div key={row.label} className="flex justify-between gap-2">
              <span>{row.label}</span>
              <span>= {row.value}</span>
            </div>
          ))}
          <p className="calc-more">
            {body.top > 0 ? "▲ " : ""}
            {body.top + STAT_LIST_ROWS < body.total ? "▼" : ""}
          </p>
        </div>
      );
    case "matrixEditor":
      return (
        <div className="calc-small flex h-full flex-col">
          <p className="calc-dim mb-1">{body.name}</p>
          <MatrixGrid
            cells={body.cells.map((row) => row.map((cell) => cell.text))}
            active={body.cells.flatMap((row) => row.map((cell) => cell.active))}
          />
          <p className="mt-auto truncate text-right">{body.entry ?? ""}</p>
        </div>
      );
    case "prompt":
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="calc-input">
            {body.title}
            {body.entry !== null && (
              <>
                {" "}
                {body.entry}
                <Caret />
              </>
            )}
          </p>
          <p className="calc-result">{body.value}</p>
        </div>
      );
    case "answer":
      return (
        <div className="flex h-full flex-col justify-between">
          <div className="calc-small">
            {body.lines.map((line) => (
              <p key={line} className="calc-dim truncate">
                {line}
              </p>
            ))}
          </div>
          <div>
            <p className="calc-result">
              {body.label && <span className="calc-label">{body.label}</span>}
              {body.value}
            </p>
            {body.note && <p className="calc-more">{body.note}</p>}
          </div>
        </div>
      );
    case "error":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center">
          <p className="calc-error">{body.title}</p>
          {body.hints.map((hint) => (
            <p key={hint} className="calc-dim text-caption">
              {hint}
            </p>
          ))}
        </div>
      );
  }
}

function Result({ result, label }: { result: ResultView; label: string | null }) {
  if (result.kind === "matrix") {
    return (
      <div className="calc-small flex items-end justify-end gap-2">
        <span className="calc-dim">Ans =</span>
        <MatrixGrid cells={result.cells} />
      </div>
    );
  }
  return (
    <p className="calc-result">
      {label && <span className="calc-label">{label}</span>}
      {result.text}
    </p>
  );
}

/** A matrix between square brackets, its cells in columns. */
function MatrixGrid({ cells, active }: { cells: string[][]; active?: boolean[] }) {
  const width = cells[0]?.length ?? 1;
  return (
    <div className="calc-matrix">
      <span aria-hidden className="calc-bracket" />
      <div className="calc-matrix-grid" style={{ gridTemplateColumns: `repeat(${width}, auto)` }}>
        {cells.flat().map((text, i) => (
          <span key={i} className="calc-cell" data-active={active?.[i] || undefined}>
            {text}
          </span>
        ))}
      </div>
      <span aria-hidden className="calc-bracket" />
    </div>
  );
}

function Caret() {
  return <span className="calc-caret guide-caret" />;
}

/** The screen in words, for the live region. */
export function summarize(view: DisplayModel): string {
  const body = view.body;
  switch (body.kind) {
    case "calc": {
      const input = body.input.join("");
      if (!body.result) return input;
      const result =
        body.result.kind === "number"
          ? body.result.text
          : body.result.cells.map((row) => row.join(", ")).join("; ");
      return `${input} ${body.label ?? "="} ${result}`;
    }
    case "menu":
      return [
        body.title,
        ...body.items.map((entry, i) =>
          entry.key
            ? `${entry.key}: ${entry.label}`
            : `${entry.label}${body.selected === i ? " (selected)" : ""}`,
        ),
      ]
        .filter(Boolean)
        .join(", ");
    case "table": {
      const row = body.rows.find((r) => r.active !== null);
      const cell = row && row.active !== null ? row.cells[row.active] : "";
      return [body.title, `${row?.head ?? ""}: ${body.entry ?? cell ?? ""}`]
        .filter(Boolean)
        .join(", ");
    }
    case "list":
      return [
        body.title,
        ...body.rows
          .slice(body.top, body.top + STAT_LIST_ROWS)
          .map((row) => `${row.label} = ${row.value}`),
      ]
        .filter(Boolean)
        .join(", ");
    case "matrixEditor":
      return `${body.name}: ${body.cells.map((row) => row.map((c) => c.text).join(", ")).join("; ")}`;
    case "prompt":
      return `${body.title} ${body.entry ?? body.value}`;
    case "answer":
      return [...body.lines, `${body.label} ${body.value}`, body.note].filter(Boolean).join(", ");
    case "error":
      return body.title;
  }
}
