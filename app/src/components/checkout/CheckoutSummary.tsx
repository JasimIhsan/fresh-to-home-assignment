"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CartItem } from "@/types";
import { ShieldCheck } from "lucide-react";

export interface CheckoutSummaryProps {
   items: CartItem[];
   totalAmount: number;
   deliveryFee: number;
   grandTotal: number;
   submitting: boolean;
}

export function CheckoutSummary({
   items,
   totalAmount,
   deliveryFee,
   grandTotal,
   submitting,
}: CheckoutSummaryProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4 sticky top-24">
         <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">{t("checkout.orderSummary")}</h2>

         <div className="space-y-3 divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
               <div key={item.product.id} className="pt-3 first:pt-0 flex justify-between items-center text-sm">
                  <div className="pr-2">
                     <p className="font-semibold text-gray-900 truncate max-w-45">{item.product.name}</p>
                     <p className="text-xs text-gray-500">
                        {item.weightKg.toFixed(1).replace(".", ",")} kg × {item.product.pricePerKg.toFixed(2).replace(".", ",")} €
                     </p>
                  </div>
                  <span className="font-bold text-gray-800 whitespace-nowrap">
                     {(item.weightKg * item.product.pricePerKg).toFixed(2).replace(".", ",")} €
                  </span>
               </div>
            ))}
         </div>

         <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
               <span>{t("cart.subtotal")}</span>
               <span>{totalAmount.toFixed(2).replace(".", ",")} €</span>
            </div>
            <div className="flex justify-between">
               <span>{t("cart.deliveryFee")}</span>
               <span>
                  {deliveryFee === 0 ? (
                     <span className="text-emerald-600 font-bold">{t("cart.freeDelivery")}</span>
                  ) : (
                     `${deliveryFee.toFixed(2).replace(".", ",")} €`
                  )}
               </span>
            </div>
         </div>

         <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-black text-primary">
            <span>{t("checkout.total")}</span>
            <span>{grandTotal.toFixed(2).replace(".", ",")} €</span>
         </div>

         <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            className="w-full mt-4 bg-primary hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center cursor-pointer"
         >
            {submitting ? (
               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
               t("checkout.placeOrder")
            )}
         </button>

         <div className="flex items-center space-x-2 text-[11px] text-gray-500 justify-center pt-2">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>{t("checkout.sslNotice")}</span>
         </div>
      </div>
   );
}
