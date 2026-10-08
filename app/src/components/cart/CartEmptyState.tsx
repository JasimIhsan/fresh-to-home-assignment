"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";

interface CartEmptyStateProps {
   isGuest?: boolean;
}

export function CartEmptyState({ isGuest = false }: CartEmptyStateProps) {
   const { t } = useLanguage();

   if (isGuest) {
      return (
         <div className="bg-white p-8 sm:p-12 rounded-3xl text-center shadow-xl shadow-purple-950/5 border border-gray-100/90 space-y-6 max-w-md mx-auto my-8">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto shadow-inner">
               <ShoppingBag size={38} />
            </div>

            <div className="space-y-2">
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {t("cart.notLoggedInTitle")}
               </h2>
               <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {t("cart.notLoggedInDesc")}
               </p>
            </div>

            <Link
               href="/login?redirect=/cart"
               className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:bg-purple-700 active:scale-[0.99] transition-all text-base w-full cursor-pointer"
            >
               <span>{t("cart.loginButton")}</span>
               <ArrowRight size={18} />
            </Link>
         </div>
      );
   }

   return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl text-center shadow-xl shadow-purple-950/5 border border-gray-100/90 space-y-6 max-w-md mx-auto my-8">
         <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 mx-auto">
            <ShoppingCart size={38} />
         </div>

         <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t("cart.empty")}</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
               {t("cart.emptyDesc")}
            </p>
         </div>

         <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:bg-purple-700 active:scale-[0.99] transition-all text-base w-full cursor-pointer"
         >
            <Sparkles size={18} />
            <span>{t("cart.browseProducts")}</span>
         </Link>
      </div>
   );
}
