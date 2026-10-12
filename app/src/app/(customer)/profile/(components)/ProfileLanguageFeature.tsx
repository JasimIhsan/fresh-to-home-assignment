"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Check, Globe } from "lucide-react";

const LANGUAGES = [
  {
    code: "de" as const,
    label: "Deutsch",
    subtitle: "Standard (Deutschland)",
    flag: "🇩🇪",
  },
  {
    code: "en" as const,
    label: "English",
    subtitle: "International",
    flag: "🇬🇧",
  },
];

export function ProfileLanguageFeature() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100/90 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-primary" />
          <h3 className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">
            {t("language.switcherLabel") || "Sprache / Language"}
          </h3>
        </div>
        <span className="text-primary bg-primary/10 rounded-full px-2 py-0.5 text-[11px] font-bold">
          {language.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2.5 p-4 sm:p-5">
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              aria-pressed={isSelected}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 text-primary ring-primary/20 shadow-xs ring-1"
                  : "border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50/80"
              )}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl leading-none">{lang.flag}</span>
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <span>{lang.label}</span>
                    {isSelected && (
                      <span className="py-0.2 bg-primary rounded-md px-1.5 text-[10px] font-extrabold text-white uppercase">
                        Aktiv
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{lang.subtitle}</span>
                </div>
              </div>

              {isSelected ? (
                <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-white shadow-xs">
                  <Check size={16} strokeWidth={2.5} />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-transparent">
                  <div className="h-2 w-2 rounded-full bg-transparent" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
