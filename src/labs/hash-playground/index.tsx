import { useMemo, useState } from "react";
import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { changedBitFlags, changedHexChars, countChangedBits, hexToBits } from "./hashUtils";
import { useHashHistory, useSha256 } from "./useSha256";
import { AvalancheStage } from "./components/AvalancheStage";
import { CollisionStage } from "./components/CollisionStage";
import { DeterminismStage } from "./components/DeterminismStage";
import { DigestStage } from "./components/DigestStage";
import { UsageList } from "./components/UsageList";

/**
 * Hash Playground.
 *
 * One idea: **a hash does not keep your message. It produces a fixed-size
 * fingerprint of it, and the smallest possible edit produces an unrecognisable
 * one.**
 *
 * The whole page is still driven by one piece of state — the message — and
 * every section derives from the current digest, the digest it replaced, and
 * the difference between them. Sections 1 and 3 both mount a field bound to
 * that one string, so the instruction "change one character" never requires
 * scrolling back to obey it.
 *
 * ## Order
 *
 * What comes out, then that it comes out the same way twice, then what one
 * keystroke does to it, then how far you can push two messages towards
 * agreeing. Each section is a consequence of the one before, and none of them
 * names a property the visitor has not already watched happen.
 */
export default function HashPlayground() {
  const t = useT().labs["hash-playground"];
  const [input, setInput] = useState("hello world");
  const { hash, unavailable } = useSha256(input);
  const { prev, current } = useHashHistory(hash);

  const derived = useMemo(() => {
    if (!current) return null;
    return {
      bits: hexToBits(current),
      changedChars: prev ? changedHexChars(prev, current) : new Array<boolean>(64).fill(false),
      changedBits: prev ? changedBitFlags(prev, current) : new Array<boolean>(256).fill(false),
      changedCount: prev ? countChangedBits(prev, current) : 0,
    };
  }, [prev, current]);

  // The browser cannot hash. Say so, in the shell, rather than rendering an
  // empty page: `return null` here used to leave a lab with a title and
  // nothing under it, and no clue why.
  if (unavailable) {
    return (
      <div role="alert" className="card-surface mx-auto max-w-prose p-6">
        <h2 className="text-title text-fg">{t.unavailable.title}</h2>
        <p className="mt-2 text-body-sm text-fg-muted">
          {unavailable === "insecure-context"
            ? t.unavailable.insecureContext
            : t.unavailable.unsupported}
        </p>
        <p className="mt-3 text-caption text-fg-faint">{t.unavailable.note}</p>
      </div>
    );
  }

  // Still computing the first digest. A brief null, not a failure.
  if (!current || !derived) return null;

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — Behaviour first: a question, a field, and what comes out of it.
          Nothing is named except the function doing the work. */}
      <section aria-labelledby="hash-out-heading">
        <h2 id="hash-out-heading" className="sr-only">
          {t.hero.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.hero.question}</p>
        <DigestStage input={input} onInputChange={setInput} hash={current} />
      </section>

      {/* 2 — The same message again. A property, demonstrated rather than
          claimed on a card. */}
      <LabSection
        kicker={t.determinism.kicker}
        title={t.determinism.title}
        lede={t.determinism.lede}
      >
        <DeterminismStage input={input} />
      </LabSection>

      {/* 3 — One character, and the whole answer. */}
      <LabSection kicker={t.avalanche.kicker} title={t.avalanche.title} lede={t.avalanche.lede}>
        <AvalancheStage
          input={input}
          onInputChange={setInput}
          prev={prev}
          current={current}
          changedChars={derived.changedChars}
          bits={derived.bits}
          changedBits={derived.changedBits}
          changedCount={derived.changedCount}
        />
      </LabSection>

      {/* 4 — How close can two different messages get? */}
      <LabSection kicker={t.challenge.kicker} title={t.challenge.title} lede={t.challenge.lede}>
        <CollisionStage />
      </LabSection>

      {/* 5 — Five sentences, as five sentences. */}
      <LabSection kicker={t.usage.kicker} title={t.usage.title} lede={t.usage.lede}>
        <UsageList />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
    </div>
  );
}
