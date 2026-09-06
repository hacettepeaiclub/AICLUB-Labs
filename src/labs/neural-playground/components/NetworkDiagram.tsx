import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { useCanvas2D, useElementSize, useRepaintFlag } from "@/hooks";
import { palette } from "@/design/tokens";
import { formatNumber } from "@/lib/format";
import { clamp } from "@/lib/math";
import { maxAbsWeight, type Mlp } from "../engine";
import { createNeuronFieldPainter, type NeuronNode } from "../paint";

export interface NetworkDiagramProps {
  netRef: MutableRefObject<Mlp>;
  /** Neurons per layer, input first — drives the layout. */
  sizes: readonly number[];
  running: boolean;
  /** Bump to repaint a paused diagram. */
  revision?: number;
}

const NODE_SIZE = 44;
const ROW_GAP = 16;
const PAD_Y = 34;
const MIN_HEIGHT = 220;

interface LayoutNode extends NeuronNode {
  label: string;
}

interface Layout {
  nodes: LayoutNode[];
  columns: { x: number; label: string }[];
  height: number;
}

const layerLabel = (layer: number, total: number): string => {
  if (layer === 0) return "Input";
  if (layer === total - 1) return "Output";
  return `Hidden ${layer}`;
};

const nodeLabel = (layer: number, index: number, total: number): string => {
  if (layer === 0) return index === 0 ? "x₁" : "x₂";
  if (layer === total - 1) return "ŷ";
  return `h${layer}·${index + 1}`;
};

function computeLayout(sizes: readonly number[], width: number): Layout {
  const tallest = Math.max(...sizes);
  const height = Math.max(MIN_HEIGHT, tallest * NODE_SIZE + (tallest - 1) * ROW_GAP + PAD_Y * 2);
  const columnWidth = width / sizes.length;
  const nodes: LayoutNode[] = [];
  const columns: { x: number; label: string }[] = [];

  sizes.forEach((count, layer) => {
    const x = columnWidth * (layer + 0.5);
    columns.push({ x, label: layerLabel(layer, sizes.length) });
    const span = count * NODE_SIZE + (count - 1) * ROW_GAP;
    const top = (height - span) / 2 + NODE_SIZE / 2;
    for (let index = 0; index < count; index++) {
      nodes.push({
        layer,
        index,
        cx: x,
        cy: top + index * (NODE_SIZE + ROW_GAP),
        size: NODE_SIZE,
        label: nodeLabel(layer, index, sizes.length),
      });
    }
  });

  return { nodes, columns, height };
}

const rgbString = (triplet: string, alpha: number) => `rgb(${triplet} / ${alpha})`;

/**
 * The network itself, drawn live.
 *
 * Each node shows that neuron's own response across the input square — so you
 * can watch simple stripes in the first hidden layer get combined into the
 * shape in the output node. Connections are colored by sign and weighted by
 * magnitude, straight from the live arrays.
 *
 * Edges and thumbnails are canvas (they repaint every frame); the hover and
 * focus targets are an SVG layer on top, so the diagram stays keyboard
 * operable without one DOM node per connection.
 */
export function NetworkDiagram({ netRef, sizes, running, revision = 0 }: NetworkDiagramProps) {
  const tooltipId = useId();
  const [containerRef, { width }] = useElementSize<HTMLDivElement>();
  const layout = useMemo(() => computeLayout(sizes, width || 640), [sizes, width]);
  const [hovered, setHovered] = useState<LayoutNode | null>(null);
  const [readout, setReadout] = useState<number | null>(null);

  const painterRef = useRef<ReturnType<typeof createNeuronFieldPainter> | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const hoveredRef = useRef<LayoutNode | null>(null);
  hoveredRef.current = hovered;
  const { markDirty, version } = useRepaintFlag();

  useEffect(markDirty, [layout, revision, running, hovered, markDirty]);

  const canvasRef = useCanvas2D(
    useCallback(
      ({ ctx, width: w, height: h }) => {
        painterRef.current ??= createNeuronFieldPainter();

        const net = netRef.current;
        const { nodes } = layoutRef.current;
        const focus = hoveredRef.current;
        ctx.clearRect(0, 0, w, h);

        const scale = Math.max(maxAbsWeight(net), 0.001);
        for (let l = 0; l < net.weights.length; l++) {
          const weights = net.weights[l]!;
          const fanIn = net.sizes[l]!;
          const fanOut = net.sizes[l + 1]!;
          const from = nodes.filter((n) => n.layer === l);
          const to = nodes.filter((n) => n.layer === l + 1);

          for (let o = 0; o < fanOut; o++) {
            const target = to[o];
            if (!target) continue;
            for (let i = 0; i < fanIn; i++) {
              const source = from[i];
              if (!source) continue;
              const weight = weights[o * fanIn + i] ?? 0;
              const strength = clamp(Math.abs(weight) / scale, 0, 1);
              const incident =
                !focus ||
                (focus.layer === l && focus.index === i) ||
                (focus.layer === l + 1 && focus.index === o);
              const alpha = (0.1 + strength * 0.75) * (incident ? 1 : 0.15);

              ctx.beginPath();
              ctx.moveTo(source.cx + source.size / 2, source.cy);
              ctx.lineTo(target.cx - target.size / 2, target.cy);
              ctx.lineWidth = 0.6 + strength * 3.2;
              ctx.strokeStyle = rgbString(
                weight >= 0 ? palette().accent : palette().signalCyan,
                Number(alpha.toFixed(3)),
              );
              ctx.stroke();
            }
          }
        }

        painterRef.current.draw(ctx, net, nodes);

        for (const node of nodes) {
          const half = node.size / 2;
          const isFocus = focus?.layer === node.layer && focus.index === node.index;
          ctx.beginPath();
          ctx.roundRect(node.cx - half, node.cy - half, node.size, node.size, 6);
          ctx.lineWidth = isFocus ? 2 : 1;
          ctx.strokeStyle = isFocus ? rgbString(palette().fg, 0.9) : rgbString(palette().fg, 0.14);
          ctx.stroke();
        }
      },
      [netRef],
    ),
    running,
    version,
  );

  /**
   * The bias — not the activation.
   *
   * `net.acts` holds whatever input was pushed through last (a cell of the
   * heatmap sweep, or a data point), so reading it here would report a number
   * that looks meaningful and isn't. The bias is a real learned parameter of
   * this neuron, it is the one thing the thumbnail cannot show, and watching
   * it drift during training is the point.
   */
  useEffect(() => {
    if (!hovered || hovered.layer === 0) {
      setReadout(null);
      return;
    }
    const read = () => setReadout(netRef.current.biases[hovered.layer - 1]?.[hovered.index] ?? 0);
    read();
    if (!running) return;
    const id = window.setInterval(read, 120);
    return () => window.clearInterval(id);
  }, [hovered, running, netRef]);

  const isFocused = (node: LayoutNode) =>
    hovered?.layer === node.layer && hovered.index === node.index;

  return (
    <div className="card-surface p-4 sm:p-6">
      <div ref={containerRef} className="relative w-full" style={{ height: layout.height }}>
        <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />
        <svg
          className="absolute inset-0 size-full"
          role="group"
          aria-label={`Network diagram: ${sizes.join(" to ")} neurons. Each node shows what that neuron responds to across the input square.`}
        >
          {layout.columns.map((column) => (
            <text
              key={column.label}
              x={column.x}
              y={16}
              textAnchor="middle"
              className="fill-fg-faint font-mono"
              fontSize={10}
            >
              {column.label}
            </text>
          ))}
          {layout.nodes.map((node) => (
            <g key={`${node.layer}-${node.index}`}>
              {/* Focusing a neuron reveals its details — it does not *do*
                  anything, so it is not a button. It is an inspectable item
                  described by the tooltip it opens. The focus ring is drawn as
                  a stroke because the global ring is a box-shadow, which SVG
                  does not render. */}
              <rect
                x={node.cx - node.size / 2}
                y={node.cy - node.size / 2}
                width={node.size}
                height={node.size}
                rx={6}
                fill="transparent"
                tabIndex={0}
                aria-label={`Neuron ${node.label}`}
                aria-describedby={isFocused(node) ? tooltipId : undefined}
                className="cursor-help focus-visible:stroke-accent focus-visible:stroke-2"
                onMouseEnter={() => setHovered(node)}
                onMouseLeave={() => setHovered((prev) => (prev === node ? null : prev))}
                onFocus={() => setHovered(node)}
                onBlur={() => setHovered((prev) => (prev === node ? null : prev))}
              />
              <text
                x={node.cx}
                y={node.cy + node.size / 2 + 13}
                textAnchor="middle"
                className="fill-fg-faint font-mono"
                fontSize={9}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {hovered && (
          <span
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full
              whitespace-nowrap rounded border border-line/15 bg-ink-700 px-2.5 py-1.5
              font-mono text-caption text-fg shadow-card"
            style={{ left: hovered.cx, top: hovered.cy - hovered.size / 2 - 6 }}
          >
            {hovered.label}
            {readout === null ? (
              <span className="ml-1.5 text-fg-faint">input</span>
            ) : (
              <>
                <span className="mx-1.5 text-fg-faint">bias</span>
                <span className={readout >= 0 ? "text-accent" : "text-signal-cyan"}>
                  {formatNumber(readout, 2)}
                </span>
              </>
            )}
          </span>
        )}
      </div>

      <p className="mt-4 text-center text-caption text-fg-faint">
        Each square is one neuron&rsquo;s own picture of the input. Lines are weights —
        <span className="mx-1 text-accent">blue pushes up</span>,
        <span className="mx-1 text-signal-cyan">cyan pushes down</span>, thickness is strength.
      </p>
    </div>
  );
}
