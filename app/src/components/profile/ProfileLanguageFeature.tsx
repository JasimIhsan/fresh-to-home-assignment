"use client";

import { useLanguage } from "@/context/LanguageContext";
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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/90 overflow-hidden">
         <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Globe size={16} className="text-primary" />
               <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                  {t("language.switcherLabel") || "Sprache / Language"}
               </h3>
            </div>
            <span className="text-[11px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
               {language.toUpperCase()}
            </span>
         </div>

         <div className="p-4 sm:p-5 space-y-2.5">
            {LANGUAGES.map((lang) => {
               const isSelected = language === lang.code;
               return (
                  <button
                     key={lang.code}
                     type="button"
                     onClick={() => setLanguage(lang.code)}
                     className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                           ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
                           : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 text-gray-700"
                     }`}
                  >
                     <div className="flex items-center gap-3.5">
                        <span className="text-2xl leading-none">{lang.flag}</span>
                        <div>
                           <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <span>{lang.label}</span>
                              {isSelected && (
                                 <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-md bg-primary text-white">
                                    Aktiv
                                 </span>
                              )}
                           </div>
                           <span className="text-xs text-gray-400">{lang.subtitle}</span>
                        </div>
                     </div>

                     {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                           <Check size={16} strokeWidth={2.5} />
                        </div>
                     ) : (
                        <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-transparent">
                           <div className="w-2 h-2 rounded-full bg-transparent" />
                        </div>
                     )}
                  </button>
               );
            })}
         </div>
      </div>
   );
}
