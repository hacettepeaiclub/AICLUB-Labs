import { useMemo } from "react";
import { useLanguage } from "@/i18n";

const LOCALE = { en: "en-US", tr: "tr-TR" } as const;

/**
 * `formatNumber` and `formatPercent` from `./format`, in the reader's language.
 *
 * Digits and rounding are the same in both languages; Turkish only changes the
 * separators (0,5 and 1.234) and puts the percent sign first (%85).
 */
export function useFormat(): {
  formatNumber: (n: number, maxFractionDigits?: number) => string;
  formatPercent: (fraction: number, digits?: number) => string;
} {
  const { language } = useLanguage();
  return useMemo(
    () => ({
      formatNumber: (n: number, maxFractionDigits = 2) =>
        new Intl.NumberFormat(LOCALE[language], {
          maximumFractionDigits: maxFractionDigits,
        }).format(n),
      formatPercent: (fraction: number, digits = 0) => {
        const text = (fraction * 100).toFixed(digits);
        return language === "tr" ? `%${text.replace(".", ",")}` : `${text}%`;
      },
    }),
    [language],
  );
}
