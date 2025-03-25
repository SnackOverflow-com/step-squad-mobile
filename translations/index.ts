import en from "./locales/en.json";
import hr from "./locales/hr.json";

export const messages = {
  en,
  hr,
};

export type SupportedLocale = keyof typeof messages;

export const defaultLocale = "en";
