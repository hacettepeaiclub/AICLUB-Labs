import { useRef, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useDrag, usePaletteVersion } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import {
  MATRICES,
  apply3,
  between3,
  direction3,
  eigen3,
  stretch3,
  turn3,
  type MatrixName,
  type Vec3,
} from "../engine";
import { COLOR } from "../view";

const ORDER: readonly MatrixName[] = ["stretch", "shear", "skew", "rotate"];
/** Within this many degrees of an eigen line, and turned by less than `FOUND_TURN`: found. */
const FOUND_NEAR = 1.5;
const FOUND_TURN = 1;
/** Plot units per unit of space, and how long v is drawn. */
const K = 14;
const LENGTH = 0.95;
/** How far lines through the origin reach, in units of space. */
const REACH = 5;
/** Degrees of view turn per pixel dragged. */
const DRAG = 0.5;

interface View {
  readonly yaw: number;
  readonly pitch: number;
}
const START: View = { yaw: -120, pitch: 22 };

/** Where a point of space lands on the picture, seen from this view (no perspective). */
function project({ yaw, pitch }: View, [x, y, z]: Vec3): readonly [number, number] {
  const a = (yaw * Math.PI) / 180;
  const p = (pitch * Math.PI) / 180;
  const across = x * Math.cos(a) - y * Math.sin(a);
  const deep = x * Math.sin(a) + y * Math.cos(a);
  const up = z * Math.cos(p) + deep * Math.sin(p);
  return [50 + across * K, 50 - up * K];
}

/** The eight corners of the cube from −1 to 1, and its twelve edges. */
const CORNERS: Vec3[] = [-1, 1].flatMap((x) =>
  [-1, 1].flatMap((y) => [-1, 1].map((z): Vec3 => [x, y, z])),
);
const EDGES = CORNERS.flatMap((c, i) =>
  CORNERS.map((d, j) => [i, j, c, d] as const).filter(
    ([, j, , d]) => j > i && c.filter((v, k) => v !== d[k]).length === 1,
  ),
);
/** Three great circles of the unit sphere: its image is the matrix's egg. */
const CIRCLES: Vec3[][] = [0, 1, 2].map((axis) =>
  Array.from({ length: 49 }, (_, i) => {
    const t = (i * 2 * Math.PI) / 48;
    const p: [number, number, number] = [0, 0, 0];
    p[(axis + 1) % 3] = Math.cos(t);
    p[(axis + 2) % 3] = Math.sin(t);
    return p;
  }),
);

/**
 * Section 1: a matrix bends space, and turns almost every direction. Aim v
 * with the two sliders until Av lands on the same line, and that direction
 * is an eigenvector; the stretch there is its eigenvalue. Drag the picture
 * to look at it from another side.
 */
export function MatrixStage() {
  const t = useLabCopy("pca");
  const copy = t.turn;
  usePaletteVersion();
  const [name, setName] = useState<MatrixName>("stretch");
  const [around, setAround] = useState(20);
  const [tilt, setTilt] = useState(15);
  const [found, setFound] = useState<readonly number[]>([]);
  const [message, setMessage] = useState("");
  const [view, setView] = useState<View>(START);
  const grab = useRef<{ x: number; y: number; view: View } | null>(null);

  const drag = useDrag({
    onStart: (p) => {
      grab.current = { x: p.x, y: p.y, view };
    },
    onMove: (p) => {
      const g = grab.current;
      if (!g) return;
      setView({
        yaw: g.view.yaw - (p.x - g.x) * DRAG,
        pitch: Math.max(-85, Math.min(85, g.view.pitch + (p.y - g.y) * DRAG)),
      });
    },
    onEnd: () => {
      grab.current = null;
    },
    onCancel: () => {
      grab.current = null;
    },
  });

  const m = MATRICES[name];
  const eigens = eigen3(m);
  const v = direction3(around, tilt);
  const turned = turn3(m, v);
  const scale = stretch3(m, v);
  const av = apply3(m, v);

  const aim = (nextAround: number, nextTilt: number) => {
    setAround(nextAround);
    setTilt(nextTilt);
    const d = direction3(nextAround, nextTilt);
    if (turn3(m, d) >= FOUND_TURN) return;
    const index = eigens.findIndex((e) => between3(e.vector, d) < FOUND_NEAR);
    if (index < 0 || found.includes(index)) return;
    const next = [...found, index];
    setFound(next);
    const said = copy.announceFound(t.decimal(eigens[index]!.value, 2));
    setMessage(next.length === eigens.length ? `${said} ${copy.allFound}` : said);
  };

  const onMatrix = (next: MatrixName) => {
    setName(next);
    setFound([]);
    setMessage("");
  };

  const at = (p: Vec3) => project(view, p);
  const segment = (from: Vec3, to: Vec3) => {
    const [x1, y1] = at(from);
    const [x2, y2] = at(to);
    return { x1, y1, x2, y2 };
  };
  const through = (u: Vec3) =>
    segment(
      [-u[0] * REACH, -u[1] * REACH, -u[2] * REACH],
      [u[0] * REACH, u[1] * REACH, u[2] * REACH],
    );
  const arrow = (to: Vec3, color: string, key: string) => {
    const [x, y] = at(to);
    return (
      <g key={key}>
        {/* A drop line to the floor, so the eye can read the height. */}
        <line
          {...segment(to, [to[0], to[1], 0])}
          stroke={color}
          strokeWidth="0.3"
          strokeDasharray="0.8 0.8"
        />
        <line x1="50" y1="50" x2={x} y2={y} stroke={color} strokeWidth="1.4" />
        <circle cx={x} cy={y} r="1.6" fill={color} />
      </g>
    );
  };
  const rows = [0, 3, 6].map((r) =>
    [m[r]!, m[r + 1]!, m[r + 2]!].map((x) => t.decimal(x, 1)).join("  "),
  );

  return (
    <Stage
      width="wide"
      caption={copy.caption}
      announcement={message}
      viewport={
        <div className="space-y-3 rounded-lg border border-line/20 bg-ink-900 p-4">
          <svg
            viewBox="0 0 100 100"
            role="img"
            aria-label={copy.planeLabel(t.degrees(turned))}
            className="mx-auto max-h-[28rem] w-full"
            style={{ touchAction: "pan-y", cursor: "grab", userSelect: "none" }}
            {...drag}
          >
            {(["x", "y", "z"] as const).map((label, k) => {
              const end: [number, number, number] = [0, 0, 0];
              end[k] = 3.4;
              const [lx, ly] = at([end[0] * 1.08, end[1] * 1.08, end[2] * 1.08]);
              return (
                <g key={label}>
                  <line
                    {...segment([-end[0], -end[1], -end[2]], end)}
                    stroke={COLOR.axis()}
                    strokeWidth="0.25"
                  />
                  <text x={lx} y={ly} fontSize="3" textAnchor="middle" fill={COLOR.text()}>
                    {label}
                  </text>
                </g>
              );
            })}
            {EDGES.map(([i, j, c, d]) => (
              <line
                key={`${i}-${j}`}
                {...segment(apply3(m, c), apply3(m, d))}
                stroke={COLOR.grid()}
                strokeWidth="0.35"
              />
            ))}
            {CIRCLES.map((circle, k) => (
              <polyline
                key={k}
                points={circle
                  .map((p) => at(apply3(m, p)))
                  .map(([x, y]) => `${x},${y}`)
                  .join(" ")}
                fill="none"
                stroke={COLOR.axis()}
                strokeWidth="0.3"
              />
            ))}
            {eigens.map((e, i) =>
              found.includes(i) ? (
                <line key={i} {...through(e.vector)} stroke={COLOR.stays()} strokeWidth="0.6" />
              ) : null,
            )}
            <line {...through(v)} stroke={COLOR.v()} strokeWidth="0.3" strokeDasharray="1 1" />
            {arrow([v[0] * LENGTH, v[1] * LENGTH, v[2] * LENGTH], COLOR.v(), "v")}
            {arrow([av[0] * LENGTH, av[1] * LENGTH, av[2] * LENGTH], COLOR.av(), "av")}
          </svg>
          <p className="text-caption text-fg-muted">
            <span style={{ color: COLOR.v() }}>●</span> {copy.legendV} ·{" "}
            <span style={{ color: COLOR.av() }}>●</span> {copy.legendAv} ·{" "}
            <span style={{ color: COLOR.stays() }}>●</span> {copy.legendFound}
          </p>
          <p className="text-caption text-fg-muted">{copy.dragHint}</p>
          <p className="font-mono text-caption text-fg-muted">
            {copy.matrixEntries(rows[0]!, rows[1]!, rows[2]!)}
          </p>
          {name === "rotate" && <p className="text-body-sm text-fg-muted">{copy.rotateNote}</p>}
        </div>
      }
      primary={
        <div className="space-y-4">
          <LabSlider
            label={copy.direction}
            min={0}
            max={179.5}
            step={0.5}
            value={around}
            onChange={(next) => aim(next, tilt)}
            format={t.degrees}
          />
          <LabSlider
            label={copy.tilt}
            min={-90}
            max={90}
            step={0.5}
            value={tilt}
            onChange={(next) => aim(around, next)}
            format={t.degrees}
          />
          <Segmented
            label={copy.matrix}
            value={name}
            options={ORDER.map((id) => ({ value: id, label: copy.matrices[id] }))}
            onChange={onMatrix}
          />
        </div>
      }
      figures={
        <>
          <Figure label={copy.turned} value={t.degrees(turned)} tone="accent" />
          <Figure label={copy.stretch} value={`×${t.decimal(scale, 2)}`} />
          <Figure label={copy.found} value={copy.foundCount(found.length, eigens.length)} />
        </>
      }
    />
  );
}
