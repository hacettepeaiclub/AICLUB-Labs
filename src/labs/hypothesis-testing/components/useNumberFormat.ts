import { useMemo } from "react";
import { useLanguage } from "@/i18n";
import { coord as coordText, prob as probText, withDecimalSeparator } from "../view";

/**
 * The lab's two number formats, in the reader's language.
 *
 * `view.ts` fixes how many digits a value carries; this only chooses the
 * decimal separator, a comma in Turkish. Every number a component prints goes
 * through one of these, so a figure, its slider and the sentence about it
 * cannot disagree.
 */
export function useNumberFormat(): {
  coord: (value: number) => string;
  prob: (value: number) => string;
} {
  const { language } = useLanguage();
  return useMemo(
    () => ({
      coord: (value: number) => withDecimalSeparator(coordText(value), language),
      prob: (value: number) => withDecimalSeparator(probText(value), language),
    }),
    [language],
  );
}
