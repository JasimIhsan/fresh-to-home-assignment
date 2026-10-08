"use client";

import translations from "@/i18n/translations.json";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Language = "de" | "en";

interface LanguageContextType {
   language: Language;
   setLanguage: (lang: Language) => void;
   t: (key: string) => string;
}

function resolveTranslation(path: string, lang: Language): string {
   const keys = path.split(".");

   // Try selected language
   let current: any = (translations as any)[lang];
   let found = true;
   for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
         current = current[key];
      } else {
         found = false;
         break;
      }
   }
   if (found && typeof current === "string") {
      return current;
   }

   // Fallback to German if not found
   if (lang !== "de") {
      let fallback: any = (translations as any)["de"];
      let fallbackFound = true;
      for (const key of keys) {
         if (fallback && typeof fallback === "object" && key in fallback) {
            fallback = fallback[key];
         } else {
            fallbackFound = false;
            break;
         }
      }
      if (fallbackFound && typeof fallback === "string") {
         return fallback;
      }
   }

   return path;
}

const LanguageContext = createContext<LanguageContextType>({
   language: "de",
   setLanguage: () => {},
   t: (key: string) => resolveTranslation(key, "de"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
   const [language, setLanguage] = useState<Language>("de");

   useEffect(() => {
      // Load saved language on mount
      try {
         const saved = localStorage.getItem("app_language") as Language;
         if (saved && (saved === "de" || saved === "en")) {
            setLanguage(saved);
         }
      } catch {
         // Ignore localStorage errors (e.g. private browsing or disabled storage)
      }
   }, []);

   const handleSetLanguage = useCallback((lang: Language) => {
      setLanguage(lang);
      try {
         localStorage.setItem("app_language", lang);
      } catch {
         // Ignore localStorage errors
      }
   }, []);

   const t = useCallback(
      (path: string): string => {
         return resolveTranslation(path, language);
      },
      [language]
   );

   return <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
   return useContext(LanguageContext);
}
