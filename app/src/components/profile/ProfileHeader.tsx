"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ProfileHeader() {
   const { t } = useLanguage();

   return (
      <>
         {/* Mobile Header with brand curve */}
         <header className="bg-primary text-white px-5 py-4 rounded-b-3xl shadow-lg sticky top-0 z-40 md:hidden flex items-center justify-center">
            <h1 className="text-base font-extrabold tracking-tight">{t("profile.title")}</h1>
         </header>

         {/* Desktop Navigation Bar */}
         <div className="hidden md:block max-w-5xl mx-auto px-6 pt-8">
            <div className="flex items-center justify-between">
               <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-gray-500 hover:text-primary transition-all duration-150 group"
               >
                  <span className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-xs flex items-center justify-center group-hover:border-primary/30 group-hover:text-primary transition-all">
                     <ArrowLeft size={16} strokeWidth={2.5} />
                  </span>
                  <span>{t("notFound.backHome")}</span>
               </Link>
            </div>
         </div>
      </>
   );
}

