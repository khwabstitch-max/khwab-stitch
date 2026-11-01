import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Default to English ("en"), or restore user selection from localStorage
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem("khwab_lang") || "en";
    } catch {
      return "en";
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("khwab_lang", newLang);
    } catch {}
  };

  /**
   * Returns English or Hindi text based on active language
   * @param {string} en - English string
   * @param {string} hi - Hindi string
   * @returns {string}
   */
  const t = (en, hi) => {
    if (lang === "hi") return hi || en;
    return en || hi;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "en",
      setLang: () => {},
      t: (en, hi) => en,
    };
  }
  return ctx;
}

