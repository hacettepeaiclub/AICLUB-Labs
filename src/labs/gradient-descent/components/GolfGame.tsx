import { useEffect, useMemo, useRef, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLocalStorage, useReducedMotion } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { gradient } from "../engine";
import {
  BOUND,
  CLUBS,
  CUP,
  FREE_LIMIT,
  clubById,
  lieAfter,
  planRound,
  play,
  runFixed,
  scoreName,
  slopeAt,
  solveFixed,
  solveFree,
  strokesOf,
  type ClubId,
  type HolePlan,
  type Shot,
} from "../golf";
import { LandscapeCanvas } from "./LandscapeCanvas";

interface Card {
  readonly plan: HolePlan;
  /** Strokes taken, or null while the hole is still being played. */
  readonly strokes: number | null;
}

type Phase =
  | { kind: "intro" }
  | {
      kind: "hole";
      index: number;
      shots: Shot[];
      /** The one club of a one-club hole, once chosen. */
      fixed: ClubId | null;
      /** What that club's run scored, penalties and the stroke limit included. */
      fixedScore: number | null;
      /** How many of `shots` are on the map yet: a one-club run is revealed a stroke at a time. */
      shown: number;
    }
  | { kind: "end"; previousBest: number | null };

/** Milliseconds between strokes when a one-club hole plays itself out. */
const AUTO_MS = 140;

const signedPar = (d: number): string => (d > 0 ? `+${d}` : d < 0 ? `−${-d}` : "E");

/**
 * Section 4, between the step-size section and momentum: gradient golf.
 *
 * Sections 1 to 3 show that the step size is capped by the curvature and
 * that one step size cannot suit two curvatures. Here the visitor finds both
 * out by losing strokes. The ball is the parameter, the cup is the minimum,
 * and a stroke is one step of plain gradient descent: the slope chooses the
 * direction, and the visitor chooses only the club, η. Nothing aims; nothing
 * is eased. The ball jumps to where `strike()` puts it, exactly as the lab's
 * engine would step.
 *
 * Six holes, a fresh tee on every round, and par computed for that tee by
 * searching the same clubs the visitor holds — so par is always reachable
 * and the scorecard is honest. The last two holes hand over one club for
 * every stroke, which is a fixed learning rate, and the stroke count is the
 * price of the landscape's condition number.
 */
export function GolfGame() {
  const copy = useLabCopy("gradient-descent");
  const g = copy.golf;
  const reduced = useReducedMotion() ?? false;
  // Planned when the visitor starts, not on mount: a round is six searches.
  const [round, setRound] = useState<HolePlan[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [club, setClub] = useState<ClubId>("iron9");
  const [best, setBest] = useLocalStorage<number | null>("acl:gradient-descent:golf-best", null);
  const [announcement, setAnnouncement] = useState("");

  const plan = phase.kind === "hole" ? round[phase.index] : undefined;
  const shots = useMemo(
    () => (phase.kind === "hole" ? phase.shots.slice(0, phase.shown) : []),
    [phase],
  );
  const lie = plan ? lieAfter(plan.tee, shots) : { x: 0, y: 0 };
  const strokes = strokesOf(shots);
  const last = shots[shots.length - 1];
  const holed = last?.result === "holed";
  const fixedDone =
    phase.kind === "hole" && phase.fixed !== null && phase.shown >= phase.shots.length;
  const pickedUp = plan?.spec.mode === "free" && !holed && strokes >= FREE_LIMIT;
  const finished = phase.kind === "hole" && (holed || pickedUp || fixedDone);
  const score = phase.kind === "hole" && phase.fixedScore !== null ? phase.fixedScore : strokes;

  // A one-club hole plays itself out, one stroke at a time.
  const timer = useRef(0);
  useEffect(() => {
    if (phase.kind !== "hole" || phase.fixed === null || phase.shown >= phase.shots.length) return;
    timer.current = window.setTimeout(
      () => setPhase((p) => (p.kind === "hole" ? { ...p, shown: p.shown + 1 } : p)),
      reduced ? 0 : AUTO_MS,
    );
    return () => window.clearTimeout(timer.current);
  }, [phase, reduced]);

  // Record the hole once it is over.
  useEffect(() => {
    if (!finished || phase.kind !== "hole") return;
    setCards((cs) =>
      cs.map((c, i) => (i === phase.index && c.strokes === null ? { ...c, strokes: score } : c)),
    );
  }, [finished, phase, score]);

  const newRound = () => {
    const next = planRound(Math.random);
    setRound(next);
    setCards(next.map((p) => ({ plan: p, strokes: null })));
    setClub("iron9");
    setPhase({ kind: "hole", index: 0, shots: [], fixed: null, fixedScore: null, shown: 0 });
    setAnnouncement(
      g.announce.hole(1, g.holes[next[0]?.spec.id ?? "bowl"].name, next[0]?.par ?? 0),
    );
  };

  const hit = () => {
    if (phase.kind !== "hole" || !plan || finished || plan.spec.mode !== "free") return;
    const shot = play(plan.spec.landscape, lie, clubById(club));
    const all = [...shots, shot];
    setPhase({ ...phase, shots: all, shown: all.length });
    setAnnouncement(
      shot.result === "holed"
        ? g.announce.holed(strokesOf(all))
        : shot.result === "out"
          ? g.out
          : g.announce.rolled(strokesOf(all)),
    );
  };

  const playOut = () => {
    if (phase.kind !== "hole" || !plan || plan.spec.mode !== "fixed" || phase.fixed) return;
    const run = runFixed(plan.spec.landscape, plan.tee, clubById(club));
    setPhase({ ...phase, fixed: club, fixedScore: run.strokes, shots: [...run.shots], shown: 0 });
  };

  const nextHole = () => {
    if (phase.kind !== "hole") return;
    if (phase.index + 1 < round.length) {
      const i = phase.index + 1;
      setPhase({ kind: "hole", index: i, shots: [], fixed: null, fixedScore: null, shown: 0 });
      const p = round[i];
      if (p) setAnnouncement(g.announce.hole(i + 1, g.holes[p.spec.id].name, p.par));
    } else {
      const total = cards.reduce((sum, c) => sum + ((c.strokes ?? 0) - c.plan.par), 0);
      setPhase({ kind: "end", previousBest: best });
      if (best === null || total < best) setBest(total);
      setAnnouncement(g.announce.round(signedPar(total)));
    }
  };

  // The path the ball has taken, for the map: tee, then every lie.
  const path = useMemo(() => {
    if (!plan) return new Float64Array(0);
    const points = [plan.tee, ...shots.filter((s) => s.result !== "out").map((s) => s.to)];
    const out = new Float64Array(points.length * 2);
    points.forEach((p, i) => {
      out[2 * i] = p.x;
      out[2 * i + 1] = p.y;
    });
    return out;
  }, [plan, shots]);

  const downhill = plan ? gradient(plan.spec.landscape, lie) : { x: 0, y: 0 };
  const total = cards.reduce(
    (sum, c) => sum + (c.strokes === null ? 0 : c.strokes - c.plan.par),
    0,
  );

  return (
    <Stage
      width="full"
      caption={g.caption}
      announcement={announcement}
      viewport={
        phase.kind === "intro" ? (
          <Intro />
        ) : phase.kind === "end" ? (
          <RoundEnd cards={cards} total={total} previousBest={phase.previousBest} />
        ) : plan ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-caption uppercase tracking-wide text-fg-faint">
                {g.holeLabel(phase.index + 1, round.length)} · {g.holes[plan.spec.id].name}
              </p>
              <p className="text-body-sm text-fg-muted">
                {plan.spec.mode === "free" ? g.freeRule : g.fixedRule}
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[30rem]">
              <LandscapeCanvas
                landscape={plan.spec.landscape}
                extent={BOUND}
                path={path}
                pathLength={path.length / 2}
                start={plan.tee}
                current={lie}
                descentArrow={finished ? undefined : { x: -downhill.x, y: -downhill.y }}
                label={g.mapLabel(g.holes[plan.spec.id].name, strokes)}
                sizeClass="aspect-square w-full"
              />
              {/* The cup, to scale, over the minimum. The canvas sits inside a
                  1px border and 8px of padding, so the overlay does too. */}
              <div aria-hidden className="pointer-events-none absolute inset-[9px]">
                <span
                  className={cn(
                    "absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
                    holed ? "border-signal-green bg-signal-green/25" : "border-fg/70 bg-ink-950/60",
                  )}
                  style={{ width: `${(CUP / BOUND) * 100}%` }}
                />
              </div>
              {last?.result === "out" && !finished && (
                <p className="verdict-enter absolute inset-x-0 top-4 mx-auto w-fit rounded border border-signal-rose/50 bg-ink-950/90 px-3 py-1 text-body-sm text-signal-rose">
                  {g.out}
                </p>
              )}
            </div>
            <ShotLog shots={shots} />
            {finished && (
              <HoleResult plan={plan} strokes={score} holed={holed} fixed={phase.fixed} />
            )}
            {/* On a phone the card would push the clubs off the screen
                mid-hole, so there it waits for the hole to end. */}
            <div className={cn(!finished && "hidden lg:block")}>
              <Scorecard cards={cards} current={phase.index} />
            </div>
          </div>
        ) : null
      }
      primary={
        <div className="space-y-3">
          {phase.kind === "intro" && (
            <Button className="w-full" onClick={newRound}>
              {g.start}
            </Button>
          )}
          {phase.kind === "end" && (
            <Button className="w-full" onClick={newRound}>
              {g.again}
            </Button>
          )}
          {phase.kind === "hole" && plan && !finished && phase.fixed === null && (
            <>
              <fieldset>
                <legend className="mb-2 text-caption text-fg-muted">{g.clubLabel}</legend>
                <div className="grid grid-cols-3 gap-1.5">
                  {CLUBS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={club === c.id}
                      onClick={() => setClub(c.id)}
                      className={cn(
                        "flex min-h-11 flex-col items-center justify-center rounded border px-1 py-1 transition-colors duration-fast",
                        club === c.id
                          ? "border-accent bg-accent-fill text-accent-fg"
                          : "border-line/15 text-fg-muted hover:border-line/35 hover:text-fg",
                      )}
                    >
                      <span className="text-caption">{g.clubs[c.id]}</span>
                      <span className="font-mono text-caption tabular-nums">η {c.eta}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {plan.spec.mode === "free" ? (
                <Button className="w-full" onClick={hit}>
                  {g.hit(g.clubs[club])}
                </Button>
              ) : (
                <Button className="w-full" onClick={playOut}>
                  {g.playOut(g.clubs[club])}
                </Button>
              )}
            </>
          )}
          {phase.kind === "hole" && finished && (
            <Button className="w-full" onClick={nextHole}>
              {phase.index + 1 < round.length ? g.nextHole : g.finish}
            </Button>
          )}
        </div>
      }
      figures={
        phase.kind === "hole" && plan ? (
          <>
            <Figure label={g.figures.par} value={String(plan.par)} />
            <Figure label={g.figures.strokes} value={String(strokes)} tone="accent" />
            <Figure
              label={g.figures.slope}
              value={slopeAt(plan.spec.landscape, lie).toFixed(2)}
              hint={g.figures.slopeHint}
            />
            <Figure label={g.figures.round} value={signedPar(total)} />
          </>
        ) : (
          <Figure label={g.figures.best} value={best === null ? "—" : signedPar(best)} />
        )
      }
    />
  );
}

// ================================================================= intro ===

function Intro() {
  const g = useLabCopy("gradient-descent").golf;
  return (
    <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4 sm:p-5">
      <p className="font-mono text-caption uppercase tracking-wide text-fg-faint">
        {g.intro.kicker}
      </p>
      <p className="max-w-prose text-body text-fg">{g.intro.story}</p>
      <ul className="max-w-prose list-disc space-y-1.5 pl-5 text-body-sm text-fg-muted">
        {g.intro.rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================== shot log ===

function ShotLog({ shots }: { shots: readonly Shot[] }) {
  const g = useLabCopy("gradient-descent").golf;
  if (shots.length === 0) return <p className="text-body-sm text-fg-muted">{g.firstShot}</p>;
  const recent = shots.slice(-3);
  return (
    <ol className="space-y-1 font-mono text-caption tabular-nums text-fg-muted">
      {recent.map((s, i) => {
        const club = clubById(s.club);
        const distance = Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y);
        return (
          <li
            key={shots.length - recent.length + i}
            className={cn(
              s.result === "out" && "text-signal-rose",
              s.result === "holed" && "text-signal-green",
            )}
          >
            {g.shotLine(
              shots.length - recent.length + i + 1,
              g.clubs[s.club],
              String(club.eta),
              s.slope.toFixed(2),
              distance.toFixed(2),
            )}{" "}
            {s.result === "out" ? g.results.out : s.result === "holed" ? g.results.holed : ""}
          </li>
        );
      })}
    </ol>
  );
}

// =========================================================== hole result ===

function HoleResult({
  plan,
  strokes,
  holed,
  fixed,
}: {
  plan: HolePlan;
  strokes: number;
  holed: boolean;
  fixed: ClubId | null;
}) {
  const g = useLabCopy("gradient-descent").golf;
  const name = scoreName(strokes, plan.par);
  const good = name === "holeInOne" || name === "eagle" || name === "birdie" || name === "par";
  const l = plan.spec.landscape;
  const parLine =
    plan.spec.mode === "free"
      ? (solveFree(l, plan.tee)?.clubs ?? []).map((id) => g.clubs[id]).join(" → ")
      : g.clubs[solveFixed(l, plan.tee).club];

  return (
    <div
      className={cn(
        "verdict-enter space-y-2 rounded border px-4 py-3",
        good
          ? "border-signal-green/40 bg-signal-green/10"
          : "border-signal-amber/40 bg-signal-amber/10",
      )}
    >
      <p className="text-body text-fg">
        <span className={cn("font-semibold", good ? "text-signal-green" : "text-signal-amber")}>
          {holed || plan.spec.mode === "free" ? g.scoreNames[name] : g.didNotFinish}
        </span>{" "}
        {g.holeScore(strokes, plan.par)}
      </p>
      <p className="text-body-sm text-fg-muted">
        {plan.spec.mode === "free" ? g.parLine(parLine) : g.fixedLine(parLine, plan.par)}
        {fixed && !holed ? ` ${g.fixedFail(g.clubs[fixed])}` : ""}
      </p>
      <p className="text-body-sm text-fg">{g.holes[plan.spec.id].lesson}</p>
    </div>
  );
}

// ============================================================= scorecard ===

function Scorecard({ cards, current }: { cards: readonly Card[]; current: number }) {
  const g = useLabCopy("gradient-descent").golf;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-center font-mono text-caption tabular-nums">
        <caption className="sr-only">{g.scorecard.title}</caption>
        <thead>
          <tr className="text-fg-faint">
            <th scope="row" className="py-1 pr-2 text-left font-normal">
              {g.scorecard.hole}
            </th>
            {cards.map((_, i) => (
              <th
                key={i}
                scope="col"
                className={cn("py-1 font-normal", i === current && "text-fg")}
              >
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="text-fg-muted">
            <th scope="row" className="py-1 pr-2 text-left font-normal">
              {g.scorecard.par}
            </th>
            {cards.map((c, i) => (
              <td key={i} className="py-1">
                {c.plan.par}
              </td>
            ))}
          </tr>
          <tr className="text-fg">
            <th scope="row" className="py-1 pr-2 text-left font-normal text-fg-muted">
              {g.scorecard.you}
            </th>
            {cards.map((c, i) => (
              <td
                key={i}
                className={cn(
                  "py-1",
                  c.strokes !== null && c.strokes < c.plan.par && "text-signal-green",
                  c.strokes !== null && c.strokes > c.plan.par && "text-signal-amber",
                )}
              >
                {c.strokes ?? "·"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ============================================================= round end ===

function RoundEnd({
  cards,
  total,
  previousBest,
}: {
  cards: readonly Card[];
  total: number;
  previousBest: number | null;
}) {
  const g = useLabCopy("gradient-descent").golf;
  return (
    <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4 text-center sm:p-5">
      <p className="font-mono text-caption uppercase tracking-wide text-fg-faint">{g.end.kicker}</p>
      <p className="font-mono text-display-lg tabular-nums text-fg">{signedPar(total)}</p>
      <p className="text-body-sm text-fg-muted">{g.end.relative}</p>
      {previousBest !== null && total < previousBest && (
        <p className="text-body-sm text-signal-green">{g.end.newBest}</p>
      )}
      <Scorecard cards={cards} current={-1} />
      <ol className="mx-auto max-w-prose space-y-2 text-left text-body-sm text-fg">
        {g.end.takeaways.map((line, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-mono text-fg-faint">{i + 1}</span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
