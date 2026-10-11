import type { Language } from "@/app/preferences";

/**
 * How the lab writes its numbers: in the reader's language (a decimal comma
 * in Turkish), and never with more precision than the measurement has. A
 * browser's timer is coarsened to a fraction of a millisecond, so times keep
 * one decimal at most.
 */

const locale = (language: Language) => (language === "tr" ? "tr-TR" : "en-GB");

export function formatNumber(value: number, language: Language, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale(language), {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

/** A ratio, always with one decimal so "×3.0" reads as measured, not rounded. */
export function formatRatio(value: number, language: Language): string {
  if (!Number.isFinite(value)) return "—";
  return `×${new Intl.NumberFormat(locale(language), {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)}`;
}
