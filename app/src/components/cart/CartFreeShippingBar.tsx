"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, Truck } from "lucide-react";

interface CartFreeShippingBarProps {
   totalAmount: number;
   threshold: number;
}

export function CartFreeShippingBar({ totalAmount, threshold }: CartFreeShippingBarProps) {
   const { t } = useLanguage();

   const isFree = totalAmount >= threshold && totalAmount > 0;
   const progress = Math.min(100, Math.round((totalAmount / threshold) * 100));
   const amountNeeded = Math.max(0, threshold - totalAmount);

   return (
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100/90 shadow-sm space-y-2.5">
         <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-2 font-bold text-gray-800">
               <div className="w-7 h-7 rounded-xl bg-purple-50 text-primary flex items-center justify-center">
                  <Truck size={15} />
               </div>
               {isFree ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                     <CheckCircle2 size={16} className="text-emerald-600" />
                     {t("cart.freeDelivery")}
                  </span>
               ) : (
                  <span>{t("cart.freeDeliveryThreshold")}</span>
               )}
            </span>
            <span className="font-extrabold text-primary tabular-nums">{progress}%</span>
         </div>

         <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
               className={`h-full transition-all duration-500 rounded-full ${
                  isFree ? "bg-emerald-500" : "bg-primary"
               }`}
               style={{ width: `${progress}%` }}
            />
         </div>

         {!isFree && amountNeeded > 0 && (
            <p className="text-[11px] text-gray-500 text-right font-medium">
               <strong className="text-gray-800 font-bold">
                  {amountNeeded.toFixed(2).replace(".", ",")} €
               </strong>{" "}
               bis zum kostenlosen Versand
            </p>
         )}
      </div>
   );
}
