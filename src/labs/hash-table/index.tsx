import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { AddressStage } from "./components/AddressStage";
import { BirthdayStage } from "./components/BirthdayStage";
import { ChallengeStage } from "./components/ChallengeStage";
import { CompareStage } from "./components/CompareStage";
import { ModulusStage } from "./components/ModulusStage";
import { ProbeStage } from "./components/ProbeStage";
import { ResizeStage } from "./components/ResizeStage";

/**
 * Hash Table.
 *
 * One idea: **a hash table computes where a key lives instead of searching
 * for it — and stays fast only while it is kept from getting full.**
 *
 * ## Order
 *
 * The address, then the collisions that arrive much sooner than expected,
 * then what one strategy does about them as the table fills, then both
 * strategies against their formulas, then the resize that keeps the load
 * down, then the keys that defeat a careless table size. The challenge
 * closes it with three things to make a hash table do.
 *
 * ## Honesty
 *
 * The hash is Java's `String.hashCode` exactly, tested against the
 * specification computed with BigInt. Costs in the probing and comparison
 * sections are measured on real tables, not drawn from the formulas, and
 * the formulas are tested against simulation; the birthday curve is the
 * exact product, not an approximation.
 */
export default function HashTable() {
  const t = useLabs()["hash-table"];

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — Behaviour first: a word becomes a bucket. */}
      <section aria-labelledby="ht-address-heading">
        <h2 id="ht-address-heading" className="sr-only">
          {t.address.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.address.question}</p>
        <AddressStage />
      </section>

      {/* 2 — Two keys, one bucket: sooner than anyone guesses. */}
      <LabSection kicker={t.birthday.kicker} title={t.birthday.title} lede={t.birthday.lede}>
        <BirthdayStage />
      </LabSection>

      {/* 3 — One array, and keys that step aside. */}
      <LabSection kicker={t.probe.kicker} title={t.probe.title} lede={t.probe.lede}>
        <ProbeStage />
      </LabSection>

      {/* 4 — Both strategies, measured against their formulas. */}
      <LabSection kicker={t.compare.kicker} title={t.compare.title} lede={t.compare.lede}>
        <CompareStage />
      </LabSection>

      {/* 5 — Doubling, and what it costs on average. */}
      <LabSection kicker={t.resize.kicker} title={t.resize.title} lede={t.resize.lede}>
        <ResizeStage />
      </LabSection>

      {/* 6 — Keys that share a step, and a size that shares it too. */}
      <LabSection kicker={t.modulus.kicker} title={t.modulus.title} lede={t.modulus.lede}>
        <ModulusStage />
      </LabSection>

      {/* 7 — Three things to make a table do. */}
      <LabSection kicker={t.challenge.kicker} title={t.challenge.title} lede={t.challenge.lede}>
        <ChallengeStage />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
      <LabSources
        title={t.sources.title}
        entries={[
          { id: "peterson", supports: t.sources.peterson },
          { id: "linearProbing", supports: t.sources.linearProbing },
          { id: "birthday", supports: t.sources.birthday },
          { id: "amortized", supports: t.sources.amortized },
          { id: "javaApi", supports: t.sources.javaApi },
        ]}
      />
    </div>
  );
}
