import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import { AtmStage } from "./components/AtmStage";
import { FixStage } from "./components/FixStage";
import { GameStage } from "./components/GameStage";
import { OddsStage } from "./components/OddsStage";
import { OrdersStage } from "./components/OrdersStage";

/**
 * Race condition.
 *
 * One idea: **when threads share memory, the result can depend on the order
 * the scheduler picks — and one line of code is several steps, with gaps
 * another thread can fall into.**
 *
 * ## Order
 *
 * The visitor is the scheduler first, and loses an update with their own
 * hand. Then every order at once, to show theirs was no accident: eighteen of
 * twenty lose. Then why code like that still passes its tests: a real
 * scheduler rarely switches inside three steps, until it does. Then the two
 * standard fixes, which the visitor tries and fails to break. Last, a race
 * with no `++` in it — a check and an act, each atomic — so the lesson is the
 * gap, not the increment.
 *
 * ## Honesty
 *
 * Everything is simulated, and the page says so. A web page cannot share a
 * plain variable between two threads without cross-origin isolation, which
 * this site does not enable. For the first, second, fourth and fifth sections
 * that costs nothing: a race is a property of the order of steps, and every
 * order is enumerated exactly (`engine.ts`). The third section's scheduler is
 * a model — it switches at random — and its caption says so.
 */
export default function RaceCondition() {
  const t = useLabCopy("race-condition");

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — You are the scheduler. */}
      <section aria-labelledby="rc-game-heading">
        <h2 id="rc-game-heading" className="sr-only">
          {t.game.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.game.question}</p>
        <GameStage />
      </section>

      {/* 2 — Every order: yours was no accident. */}
      <LabSection kicker={t.orders.kicker} title={t.orders.title} lede={t.orders.lede}>
        <OrdersStage />
      </LabSection>

      {/* 3 — At scale: rare, which is why it ships. */}
      <LabSection kicker={t.odds.kicker} title={t.odds.title} lede={t.odds.lede}>
        <OddsStage />
      </LabSection>

      {/* 4 — The fixes, tried by hand. */}
      <LabSection kicker={t.fix.kicker} title={t.fix.title} lede={t.fix.lede}>
        <FixStage />
      </LabSection>

      {/* 5 — Your turn: check, then act. */}
      <LabSection kicker={t.atm.kicker} title={t.atm.title} lede={t.atm.lede}>
        <AtmStage />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
      <LabSources
        title={t.sources.title}
        entries={[
          { id: "ostep", supports: t.sources.ostep },
          { id: "mutex", supports: t.sources.mutex },
          { id: "concurrencyBugs", supports: t.sources.concurrencyBugs },
          { id: "therac", supports: t.sources.therac },
        ]}
      />
    </div>
  );
}
