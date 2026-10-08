"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

interface CartSummaryCardProps {
   totalAmount: number;
   deliveryFee: number;
   grandTotal: number;
}

export function CartSummaryCard({ totalAmount, deliveryFee, grandTotal }: CartSummaryCardProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100/90 shadow-xl shadow-purple-950/5 space-y-5">
         <h3 className="font-black text-lg text-gray-900 tracking-tight">
            {t("cart.orderSummary")}
         </h3>

         <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
               <span>{t("cart.subtotal")}</span>
               <span className="font-bold text-gray-900 tabular-nums">
                  {totalAmount.toFixed(2).replace(".", ",")} €
               </span>
            </div>

            <div className="flex justify-between text-gray-600">
               <span className="flex items-center gap-1.5">
                  <Truck size={15} className="text-primary" />
                  <span>{t("cart.deliveryFee")}</span>
               </span>
               <span className="font-bold">
                  {deliveryFee === 0 ? (
                     <span className="text-emerald-600 font-extrabold">{t("cart.freeDelivery")}</span>
                  ) : (
                     <span className="text-gray-900 tabular-nums">{deliveryFee.toFixed(2).replace(".", ",")} €</span>
                  )}
               </span>
            </div>

            <div className="border-t border-gray-100 pt-3.5 flex justify-between items-baseline">
               <span className="text-base font-extrabold text-gray-900">{t("cart.total")}</span>
               <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight tabular-nums">
                     {grandTotal.toFixed(2).replace(".", ",")} €
                  </span>
                  <span className="block text-[11px] text-gray-400 font-medium">
                     inkl. MwSt. • Kühlversand
                  </span>
               </div>
            </div>
         </div>

         <Link
            href="/checkout"
            className="w-full py-4 bg-primary hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all text-center flex items-center justify-center gap-2 text-base cursor-pointer active:scale-[0.99]"
         >
            <span>{t("cart.checkout")}</span>
            <ArrowRight size={18} />
         </Link>

         {/* Quality & Freshness Guarantee Badge */}
         <div className="flex items-center gap-3 p-3.5 bg-purple-50/60 rounded-2xl text-primary text-xs font-medium border border-purple-100/50">
            <ShieldCheck size={20} className="shrink-0 text-primary" />
            <span className="leading-tight">{t("cart.qualityNotice")}</span>
         </div>
      </div>
   );
}
