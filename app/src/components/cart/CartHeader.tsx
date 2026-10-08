"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CartHeaderProps {
   totalItemsCount: number;
   totalAmount: number;
   isLoggedIn: boolean;
}

export function CartHeader({ totalItemsCount, totalAmount, isLoggedIn }: CartHeaderProps) {
   const { t } = useLanguage();

   return (
      <>
         {/* Mobile Header with signature purple curve */}
         <header className="bg-primary text-white px-4 py-3.5 rounded-b-3xl shadow-lg sticky top-0 z-40 md:hidden flex items-center justify-center">
            <div className="text-center min-w-0 mx-2">
               <h1 className="text-base font-extrabold tracking-tight truncate">
                  {t("cart.title")}
               </h1>
               {isLoggedIn && totalItemsCount > 0 && (
                  <p className="text-[11px] text-white/80 font-semibold truncate">
                     {totalItemsCount} {t("cart.items")} • {totalAmount.toFixed(2).replace(".", ",")} €
                  </p>
               )}
            </div>
         </header>

         {/* Desktop Navigation Top Bar */}
         <div className="hidden md:block max-w-5xl mx-auto px-6 pt-8 pb-2">
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

