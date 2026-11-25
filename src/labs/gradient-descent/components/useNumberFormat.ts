import { useLanguage } from "@/i18n";
import { formatNumber } from "@/lib/format";

export function useNumberFormat() {
  const { language } = useLanguage();
  const decimal = (text: string) => (language === "tr" ? text.replace(".", ",") : text);

  return {
    decimal,
    formatNumber: (value: number, digits: number) =>
      language === "tr"
        ? new Intl.NumberFormat("tr-TR", { maximumFractionDigits: digits }).format(value)
        : formatNumber(value, digits),
  };
}
