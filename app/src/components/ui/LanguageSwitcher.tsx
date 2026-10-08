"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
   { code: "de" as const, label: "Deutsch", short: "DE" },
   { code: "en" as const, label: "English", short: "EN" },
];

interface LanguageSwitcherProps {
   variant?: "default" | "light" | "outline";
   className?: string;
}

export function LanguageSwitcher({ variant = "default", className = "" }: LanguageSwitcherProps) {
   const { language, setLanguage } = useLanguage();
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      }

      function handleKeyDown(event: KeyboardEvent) {
         if (event.key === "Escape") {
            setIsOpen(false);
         }
      }

      if (isOpen) {
         document.addEventListener("mousedown", handleClickOutside);
         document.addEventListener("keydown", handleKeyDown);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [isOpen]);

   // Trigger button styles based on variant
   const buttonStyles = {
      // Default: For purple/dark backgrounds (customer header, banner)
      default: "bg-white/20 hover:bg-white/30 text-white border-white/30 focus:ring-white/50",
      // Light: For clean white/slate backgrounds (admin login, admin layout header, light panels)
      light: "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200/90 shadow-2xs focus:ring-primary/20",
      // Outline: Subtle transparent bordered button
      outline: "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 focus:ring-slate-300",
   }[variant];

   return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
         <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Change Language"
            aria-expanded={isOpen}
            aria-haspopup="true"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 active:scale-95 cursor-pointer ${buttonStyles}`}
         >
            <Globe size={15} className={variant === "default" ? "text-white" : "text-slate-500"} />
            <span className="text-xs font-bold uppercase tracking-wider">{language}</span>
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl border border-slate-200/80 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
               <div className="space-y-1" role="menu" aria-orientation="vertical">
                  {LANGUAGES.map((lang) => {
                     const isSelected = language === lang.code;
                     return (
                        <button
                           key={lang.code}
                           role="menuitem"
                           onClick={() => {
                              setLanguage(lang.code);
                              setIsOpen(false);
                           }}
                           className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected ? "bg-primary/10 text-primary font-bold" : "text-slate-700 hover:bg-slate-100"
                           }`}
                        >
                           <div className="flex items-center gap-2">
                              <span className={`text-[11px] uppercase tracking-wider font-bold w-5 text-left ${isSelected ? "text-primary" : "text-slate-400"}`}>
                                 {lang.short}
                              </span>
                              <span>{lang.label}</span>
                           </div>
                           {isSelected && <Check size={14} className="text-primary stroke-[2.5]" />}
                        </button>
                     );
                  })}
               </div>
            </div>
         )}
      </div>
   );
}
