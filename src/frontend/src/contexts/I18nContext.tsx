import el from "@/i18n/el";
import en from "@/i18n/en";
import ro from "@/i18n/ro";
import { createContext, useContext, useState } from "react";

export type Language = "en" | "el" | "ro";

type Translations = typeof en;
type TranslationKey = keyof Translations;

const TRANSLATIONS: Record<Language, Translations> = { en, el, ro };

interface I18nContextValue {
  t: (key: TranslationKey) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextValue>({
  t: (key) => key,
  language: "en",
  setLanguage: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("privechat-language");
    if (stored === "en" || stored === "el" || stored === "ro") return stored;
    const nav = navigator.language.slice(0, 2);
    if (nav === "el") return "el";
    if (nav === "ro") return "ro";
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("privechat-language", lang);
  };

  const t = (key: TranslationKey): string =>
    TRANSLATIONS[language][key] ?? TRANSLATIONS.en[key] ?? key;

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
