"use client";

import translations from "@/i18n/translations.json";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

const translationData = translations as unknown as Record<
  Language,
  TranslationTree
>;

function resolveTranslation(path: string, lang: Language): string {
  const keys = path.split(".");

  // Try selected language
  let current: TranslationTree | string | undefined = translationData[lang];
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
    let fallback: TranslationTree | string | undefined = translationData["de"];
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

const LANGUAGE_STORAGE_KEY = "app_language";
const DEFAULT_LANGUAGE: Language = "de";

const languageListeners = new Set<() => void>();
/** In-memory fallback when localStorage is unavailable. */
let memoryLanguage: Language = DEFAULT_LANGUAGE;

function readStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "de" || saved === "en") return saved;
  } catch {
    // Storage blocked — fall through to the in-memory value
  }
  return memoryLanguage;
}

function subscribeLanguage(listener: () => void): () => void {
  languageListeners.add(listener);
  // Keep tabs in sync when another tab changes the language
  const onStorage = (e: StorageEvent) => {
    if (e.key === LANGUAGE_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    languageListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const LanguageContext = createContext<LanguageContextType>({
  language: "de",
  setLanguage: () => {},
  t: (key: string) => resolveTranslation(key, "de"),
});

export function LanguageProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Server render and hydration use "de"; the saved choice is read from
  // localStorage after hydration via useSyncExternalStore (no mismatch).
  const language = useSyncExternalStore(
    subscribeLanguage,
    readStoredLanguage,
    () => DEFAULT_LANGUAGE
  );

  const handleSetLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore localStorage errors (private browsing / disabled storage)
    }
    memoryLanguage = lang;
    for (const listener of languageListeners) listener();
  }, []);

  const t = useCallback(
    (path: string): string => {
      return resolveTranslation(path, language);
    },
    [language]
  );

  const value = useMemo<LanguageContextType>(
    () => ({ language, setLanguage: handleSetLanguage, t }),
    [language, handleSetLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
