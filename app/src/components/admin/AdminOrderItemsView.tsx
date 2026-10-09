"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CartItem } from "@/types";
import { Package } from "lucide-react";
import Link from "next/link";

export interface AdminOrderItemsViewProps {
   items: CartItem[];
   totalAmount: number;
}

export function AdminOrderItemsView({ items, totalAmount }: AdminOrderItemsViewProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
         <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
            <Package size={18} className="text-primary" />
            <span>
               {t("orderDetail.itemsTitle")} ({items.length})
            </span>
         </h3>

         <div className="divide-y divide-gray-100">
            {items.map((item, idx) => (
               <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <Link href={`/admin/products/${item.product.id}`} className="flex items-center space-x-3 group cursor-pointer">
                     <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                     />
                     <div>
                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                           {item.weightKg.toFixed(1).replace(".", ",")} kg × {item.product.pricePerKg.toFixed(2).replace(".", ",")} € / kg
                        </p>
                     </div>
                  </Link>
                  <span className="font-black text-gray-900">
                     {(item.weightKg * item.product.pricePerKg).toFixed(2).replace(".", ",")} €
                  </span>
               </div>
            ))}
         </div>

         <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-black text-primary">
            <span>{t("admin.orderTotal")}</span>
            <span>{totalAmount.toFixed(2).replace(".", ",")} €</span>
         </div>
      </div>
   );
}
