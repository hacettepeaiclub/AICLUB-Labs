import { useCallback, useMemo, useState } from "react";
import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { changedBitFlags, changedHexChars, countChangedBits, hexToBits } from "./hashUtils";
import { useHashHistory, useSha256 } from "./useSha256";
import { useSound } from "./useSound";
import { HashInput } from "./components/HashInput";
import { HashEngine } from "./components/HashEngine";
import { HashOutput } from "./components/HashOutput";
import { AvalanchePanel } from "./components/AvalanchePanel";
import { BitMatrix } from "./components/BitMatrix";
import { PropertyCards } from "./components/PropertyCards";
import { UsageCards } from "./components/UsageCards";
import { CollisionChallenge } from "./components/CollisionChallenge";

/**
 * Hash Playground — the whole experience is driven by one piece of state
 * (the input string). Every section below derives from the current digest,
 * the previous digest, and the diff between them.
 */
export default function HashPlayground() {
  const t = useT().labs["hash-playground"];
  const [input, setInput] = useState("hello world");
  const hash = useSha256(input);
  const { prev, current, version } = useHashHistory(hash);
  const { muted, toggleMuted, play } = useSound();

  const handleInputChange = useCallback(
    (next: string) => {
      play(next.length < input.length ? "pop" : "tick");
      setInput(next);
    },
    [input.length, play],
  );

  const handleCopy = useCallback(() => play("tick"), [play]);
  const handleCelebrate = useCallback(() => play("success"), [play]);

  const derived = useMemo(() => {
    if (!current) return null;
    return {
      bits: hexToBits(current),
      changedChars: prev ? changedHexChars(prev, current) : new Array<boolean>(64).fill(false),
      changedFlags: prev ? changedBitFlags(prev, current) : new Array<boolean>(256).fill(false),
      changedBits: prev ? countChangedBits(prev, current) : 0,
    };
  }, [prev, current]);

  if (!current || !derived) return null;

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1 + 2 — Hero input, the hash engine, and the live digest */}
      <section aria-labelledby="hashing-heading">
        <h2 id="hashing-heading" className="sr-only">
          {t.liveHashing}
        </h2>
        <HashInput
          value={input}
          onChange={handleInputChange}
          muted={muted}
          onToggleMute={toggleMuted}
        />
        <HashEngine version={version} />
        <HashOutput
          hash={current}
          changed={derived.changedChars}
          version={version}
          onCopy={handleCopy}
        />
      </section>

      {/* 3 — Avalanche */}
      <LabSection
        kicker={t.avalanche.kicker}
        title={t.avalanche.title}
        lede={t.avalanche.lede}
      >
        <AvalanchePanel
          prev={prev}
          current={current}
          changedChars={derived.changedChars}
          changedBits={derived.changedBits}
          version={version}
        />
      </LabSection>

      {/* 4 — Bit matrix */}
      <LabSection
        kicker={t.bits.kicker}
        title={t.bits.title}
        lede={t.bits.lede}
      >
        <BitMatrix bits={derived.bits} changedFlags={derived.changedFlags} version={version} />
      </LabSection>

      {/* 5 — Properties */}
      <LabSection
        kicker={t.properties.kicker}
        title={t.properties.title}
        lede={t.properties.lede}
      >
        <PropertyCards />
      </LabSection>

      {/* 6 — Real world */}
      <LabSection kicker={t.usage.kicker} title={t.usage.title}>
        <UsageCards />
      </LabSection>

      {/* 7 — Collision challenge */}
      <LabSection
        kicker={t.challenge.kicker}
        title={t.challenge.title}
        lede={t.challenge.lede}
      >
        <CollisionChallenge onCelebrate={handleCelebrate} />
      </LabSection>

      {/* 8 — Recap */}
      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
    </div>
  );
}
