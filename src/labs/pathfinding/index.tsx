import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { PathfindingStage } from "./components/PathfindingStage";
import { PathChallenge } from "./components/PathChallenge";

/**
 * Pathfinding.
 *
 * Each algorithm arrives where the previous one runs out: BFS is enough until
 * the ground stops being uniform, Dijkstra fixes that but looks everywhere,
 * and A* keeps Dijkstra's answer while looking in the right direction. Every
 * section is the same engine under a different question.
 */
export default function Pathfinding() {
  const t = useT().labs.pathfinding;

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1 — Behaviour first: no algorithm names, one button. */}
      <section aria-label={t.findTheWay}>
        <PathfindingStage
          preset="simple"
          algorithms={["bfs"]}
          caption={t.intro.caption}
        />
      </section>

      {/* 2 — Now name what was just watched, one move at a time. */}
      <LabSection
        kicker={t.bfs.kicker}
        title={t.bfs.title}
        lede={t.bfs.lede}
      >
        <PathfindingStage
          preset="detour"
          algorithms={["bfs"]}
          caption={t.bfs.caption}
        />
      </LabSection>

      {/* 3 — Break the assumption BFS was resting on. */}
      <LabSection
        kicker={t.cost.kicker}
        title={t.cost.title}
        lede={t.cost.lede}
      >
        <PathfindingStage
          preset="swamp"
          algorithms={["bfs", "dijkstra"]}
          allowMud
          compare
          emphasis="cost"
          caption={t.cost.caption}
        />
      </LabSection>

      {/* 4 — Dijkstra is right but indiscriminate. */}
      <LabSection
        kicker={t.astar.kicker}
        title={t.astar.title}
        lede={t.astar.lede}
      >
        <PathfindingStage
          preset="open"
          algorithms={["dijkstra", "astar"]}
          compare
          emphasis="explored"
          caption={t.astar.caption}
        />
      </LabSection>

      {/* 5 — Both axes at once. */}
      <LabSection
        kicker={t.challenge.kicker}
        title={t.challenge.title}
        lede={t.challenge.lede}
      >
        <PathChallenge />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
    </div>
  );
}
