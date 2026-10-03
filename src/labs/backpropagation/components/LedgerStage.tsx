import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  backward,
  consumers,
  forward,
  LEDGER_PARAMS,
  ledgerGraph,
  localGradients,
  numericGradient,
} from "../engine";
import { formatValue } from "../view";

const GRAPH = ledgerGraph();
const VALUES = forward(GRAPH, LEDGER_PARAMS);
const ADJ = backward(GRAPH, VALUES);
const READERS = consumers(GRAPH);
const ROOT = GRAPH.nodes.length - 1;

/**
 * Where each node sits, by index into `ledgerGraph`:
 *   0 w, 1 x, 2 b, 3 y, 4 w·x, 5 z, 6 h, 7 h − y, 8 e, 9 w², 10 0.1·w², 11 L
 */
const POS: readonly { x: number; y: number }[] = [
  { x: 60, y: 150 },
  { x: 60, y: 50 },
  { x: 250, y: 190 },
  { x: 500, y: 200 },
  { x: 180, y: 80 },
  { x: 310, y: 80 },
  { x: 430, y: 80 },
  { x: 560, y: 80 },
  { x: 680, y: 80 },
  { x: 180, y: 260 },
  { x: 430, y: 260 },
  { x: 790, y: 170 },
];
const W = 850;
const H = 310;

/** Nodes the visitor fills in: everything but the two constants. */
const FILLABLE = GRAPH.nodes.map((n) => n.op !== "const");

/**
 * Section 4: be the backward pass.
 *
 * The graph of a real loss — one neuron, a squared error, and a weight-decay
 * penalty — with every forward value already written in. The visitor fills
 * in the backward values by tapping nodes, and the page refuses a node whose
 * readers are not all done yet, saying which one is missing. That refusal is
 * the lesson about order: a node's gradient is the sum of what flows back
 * from everything that used it, so it cannot be known before they are.
 *
 * `w` is read twice. Its tap shows the two contributions arriving and being
 * added, and when the last node is filled the visitor's total is checked
 * against the numeric gradient.
 */
export function LedgerStage() {
  const lab = useLabs().backpropagation;
  const t = lab.ledger;
  const [done, setDone] = useState<ReadonlySet<number>>(() => new Set([ROOT]));
  const [picked, setPicked] = useState<number>(ROOT);
  const [refusal, setRefusal] = useState<{ node: number; waiting: number } | null>(null);

  const ready = (i: number) => (READERS[i] ?? []).every((r) => done.has(r));
  const tap = (i: number) => {
    if (!FILLABLE[i]) return;
    if (done.has(i)) {
      setPicked(i);
      setRefusal(null);
      return;
    }
    const waiting = (READERS[i] ?? []).find((r) => !done.has(r));
    if (waiting !== undefined) {
      setRefusal({ node: i, waiting });
      return;
    }
    setDone((d) => new Set(d).add(i));
    setPicked(i);
    setRefusal(null);
  };

  const total = GRAPH.nodes.filter((_, i) => FILLABLE[i]).length;
  const filled = [...done].filter((i) => FILLABLE[i]).length;
  const complete = filled === total;
  const numericW = useMemo(() => numericGradient(GRAPH, LEDGER_PARAMS, "w"), []);

  const name = (i: number) => GRAPH.nodes[i]?.name ?? "";
  /** How node i's adjoint is made: one term per reader. */
  const terms = (i: number) =>
    (READERS[i] ?? []).map((r) => {
      const node = GRAPH.nodes[r];
      const k = node?.args.indexOf(i) ?? 0;
      const local = node ? (localGradients(node, r, VALUES)[k] ?? 0) : 0;
      return { reader: r, upstream: ADJ[r] ?? 0, local, product: (ADJ[r] ?? 0) * local };
    });

  const shown = refusal ? null : picked;
  const explanation =
    shown === null
      ? null
      : shown === ROOT
        ? { title: t.rootLine, parts: [] }
        : { title: t.nodeLine(name(shown)), parts: terms(shown) };

  return (
    <Stage
      width="full"
      controls="stack"
      caption={t.caption}
      announcement={
        refusal
          ? t.refused(name(refusal.node), name(refusal.waiting))
          : t.filledAnnounce(name(picked), formatValue(ADJ[picked] ?? 0, 4))
      }
      viewport={
        <div className="space-y-3 rounded border border-line/10 bg-ink-950 p-3">
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="group"
              aria-label={t.diagramLabel}
              className="block h-auto w-full min-w-[40rem]"
            >
              {GRAPH.nodes.map((node, i) =>
                node.args.map((a, k) => (
                  <line
                    key={`${i}-${k}`}
                    x1={POS[a]?.x}
                    y1={POS[a]?.y}
                    x2={POS[i]?.x}
                    y2={POS[i]?.y}
                    className={done.has(i) && FILLABLE[a] ? "stroke-data/50" : "stroke-line/20"}
                    strokeWidth={done.has(i) && done.has(a) ? 2.5 : 1.5}
                  />
                )),
              )}
              {GRAPH.nodes.map((node, i) => {
                const p = POS[i] ?? { x: 0, y: 0 };
                const isDone = done.has(i);
                const can = FILLABLE[i] && !isDone && ready(i);
                const refused = refusal?.node === i;
                const waitingOn = refusal?.waiting === i;
                return (
                  <g
                    key={i}
                    role={FILLABLE[i] ? "button" : undefined}
                    tabIndex={FILLABLE[i] ? 0 : undefined}
                    aria-label={
                      FILLABLE[i]
                        ? isDone
                          ? t.nodeDone(
                              name(i),
                              formatValue(VALUES[i] ?? 0, 3),
                              formatValue(ADJ[i] ?? 0, 4),
                            )
                          : t.nodeOpen(name(i), formatValue(VALUES[i] ?? 0, 3))
                        : t.nodeConst(name(i), formatValue(VALUES[i] ?? 0, 3))
                    }
                    onClick={() => tap(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        tap(i);
                      }
                    }}
                    className={cn(
                      FILLABLE[i] && "cursor-pointer",
                      "outline-none focus-visible:[&>rect]:stroke-accent",
                    )}
                  >
                    <rect
                      x={p.x - 52}
                      y={p.y - 28}
                      width={104}
                      height={56}
                      rx={10}
                      className={cn(
                        node.op === "const" ? "fill-ink-900 stroke-line/15" : "fill-ink-800",
                        isDone && FILLABLE[i] && "stroke-data",
                        can && "stroke-accent",
                        refused && "stroke-signal-amber",
                        waitingOn && "stroke-signal-amber",
                        !isDone &&
                          !can &&
                          !refused &&
                          !waitingOn &&
                          node.op !== "const" &&
                          "stroke-line/25",
                      )}
                      strokeWidth={can || refused || waitingOn ? 2.5 : 1.5}
                      strokeDasharray={waitingOn ? "5 4" : undefined}
                    />
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      className="fill-fg-muted font-mono"
                      fontSize={12}
                    >
                      {name(i)}
                    </text>
                    <text
                      x={p.x}
                      y={p.y + 5}
                      textAnchor="middle"
                      className="fill-fg font-mono"
                      fontSize={12}
                    >
                      {formatValue(VALUES[i] ?? 0, 3)}
                    </text>
                    {FILLABLE[i] && (
                      <text
                        x={p.x}
                        y={p.y + 20}
                        textAnchor="middle"
                        className={cn("font-mono", isDone ? "fill-data" : "fill-fg-faint")}
                        fontSize={11}
                      >
                        {isDone ? `∂ ${formatValue(ADJ[i] ?? 0, 3)}` : "∂ ?"}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="min-h-[5.5rem] border-t border-line/10 pt-3 text-body-sm">
            {refusal ? (
              <p className="text-signal-amber">
                {t.refused(name(refusal.node), name(refusal.waiting))}
              </p>
            ) : explanation ? (
              <div className="space-y-1">
                <p className="text-fg">{explanation.title}</p>
                {explanation.parts.map((part) => (
                  <p
                    key={part.reader}
                    className="font-mono text-caption text-fg-muted sm:text-body-sm"
                  >
                    {t.term(name(part.reader))} {formatValue(part.upstream, 4)} ×{" "}
                    {formatValue(part.local, 4)} ={" "}
                    <span className="text-fg">{formatValue(part.product, 4)}</span>
                  </p>
                ))}
                {explanation.parts.length > 1 && (
                  <p className="font-mono text-caption text-data sm:text-body-sm">
                    {t.sum(
                      explanation.parts.map((p) => formatValue(p.product, 4)).join(" + "),
                      formatValue(ADJ[shown ?? 0] ?? 0, 4),
                    )}
                  </p>
                )}
              </div>
            ) : null}
            {complete && (
              <p className="mt-2 text-signal-green">
                {t.checked(formatValue(ADJ[0] ?? 0, 6), formatValue(numericW, 6))}
              </p>
            )}
          </div>
        </div>
      }
      primary={
        <Button
          variant="secondary"
          onClick={() => {
            setDone(new Set([ROOT]));
            setPicked(ROOT);
            setRefusal(null);
          }}
          disabled={filled <= 1}
          className="min-h-[44px] w-full"
        >
          {t.reset}
        </Button>
      }
      figures={
        <>
          <Figure
            label={t.figures.filled}
            value={`${filled} / ${total}`}
            tone={complete ? "accent" : "default"}
          />
          <Figure
            label={t.figures.w}
            value={done.has(0) ? formatValue(ADJ[0] ?? 0, 4) : "?"}
            hint={t.figures.wHint}
          />
        </>
      }
    />
  );
}
