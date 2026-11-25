import { useMemo } from "react";
import { useLanguage } from "@/i18n";
import { formatSmall as smallText, formatValue as valueText } from "../view";

/**
 * The lab's number formats, in the reader's language.
 *
 * `view.ts` fixes how many digits a value carries; this only chooses the
 * decimal separator, a comma in Turkish.
 */
export function useNumberFormat(): {
  formatValue: (value: number, digits?: number) => string;
  formatSmall: (value: number) => string;
} {
  const { language } = useLanguage();
  return useMemo(() => {
    const local = (text: string) => (language === "tr" ? text.replace(".", ",") : text);
    return {
      formatValue: (value: number, digits?: number) => local(valueText(value, digits)),
      formatSmall: (value: number) => local(smallText(value)),
    };
  }, [language]);
}
