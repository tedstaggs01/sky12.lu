export const locales = ["en", "de", "fr"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
};

export function hasLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
