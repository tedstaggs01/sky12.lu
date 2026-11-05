import type { Locale } from "@/lib/locale";
import { de } from "./de";
import { en } from "./en";
import { fr } from "./fr";

const messages = { en, de, fr };

export function getMessages(locale: Locale) {
  return messages[locale];
}

export type { Messages } from "./en";
