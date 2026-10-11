import type { Language } from "@/app/preferences";
import type { Thread } from "./engine";

/**
 * The two threads' colours, used the same way in every section: A cyan, B
 * rose. Never the only cue — every chip and card also carries the letter.
 * Green and amber stay free for the outcome: an update kept, an update lost.
 */
export const THREAD_STYLE: Record<
  Thread,
  { border: string; text: string; line: string; chip: string; fill: string }
> = {
  0: {
    border: "border-signal-cyan/40",
    text: "text-signal-cyan",
    line: "bg-signal-cyan/15 ring-1 ring-signal-cyan/40",
    chip: "bg-signal-cyan/20 text-signal-cyan",
    fill: "fill-signal-cyan",
  },
  1: {
    border: "border-signal-rose/40",
    text: "text-signal-rose",
    line: "bg-signal-rose/15 ring-1 ring-signal-rose/40",
    chip: "bg-signal-rose/20 text-signal-rose",
    fill: "fill-signal-rose",
  },
};

const locale = (language: Language) => (language === "tr" ? "tr-TR" : "en-GB");

/** A count, grouped the reader's way: 100,000 or 100.000. */
export const formatCount = (value: number, language: Language): string =>
  new Intl.NumberFormat(locale(language), { maximumFractionDigits: 0 }).format(value);

/** A mean, with one decimal at most. */
export const formatMean = (value: number, language: Language): string =>
  new Intl.NumberFormat(locale(language), { maximumFractionDigits: 1 }).format(value);
