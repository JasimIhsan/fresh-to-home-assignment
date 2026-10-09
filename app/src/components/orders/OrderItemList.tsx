"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CartItem } from "@/types";
import { Package } from "lucide-react";

export interface OrderItemListProps {
   items: CartItem[];
   totalAmount: number;
}

export function OrderItemList({ items, totalAmount }: OrderItemListProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 space-y-4">
         <h3 className="font-bold text-lg text-gray-900 flex items-center space-x-2">
            <Package size={20} className="text-primary" />
            <span>{t("orderDetail.itemsTitle")}</span>
         </h3>

         <div className="divide-y divide-gray-100">
            {items.map((item, idx) => (
               <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-3">
                     <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover" />
                     <div>
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                           {item.weightKg.toFixed(1).replace(".", ",")} kg × {item.product.pricePerKg.toFixed(2).replace(".", ",")} € / kg
                        </p>
                     </div>
                  </div>
                  <span className="font-bold text-gray-900">
                     {(item.weightKg * item.product.pricePerKg).toFixed(2).replace(".", ",")} €
                  </span>
               </div>
            ))}
         </div>

         <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-black text-primary">
            <span>{t("orders.total")}</span>
            <span>{totalAmount.toFixed(2).replace(".", ",")} €</span>
         </div>
      </div>
   );
}
