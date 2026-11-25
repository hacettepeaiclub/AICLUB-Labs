import { useMemo } from "react";
import { useLanguage } from "@/i18n";
import { factor as factorText, formatLoss as lossText, formatValue as valueText } from "../view";

/**
 * The lab's number formats, in the reader's language.
 *
 * `view.ts` fixes how many digits a value carries; this only chooses the
 * decimal separator, a comma in Turkish.
 */
export function useNumberFormat(): {
  formatValue: (value: number, digits?: number) => string;
  factor: (value: number) => string;
  formatLoss: (value: number) => string;
} {
  const { language } = useLanguage();
  return useMemo(() => {
    const local = (text: string) => (language === "tr" ? text.replace(".", ",") : text);
    return {
      formatValue: (value: number, digits?: number) => local(valueText(value, digits)),
      factor: (value: number) => local(factorText(value)),
      formatLoss: (value: number) => local(lossText(value)),
    };
  }, [language]);
}
