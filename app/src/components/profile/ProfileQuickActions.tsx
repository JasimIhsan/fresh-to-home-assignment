"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ProfileQuickActionsProps {
   orderCount: number;
}

export function ProfileQuickActions({ orderCount }: ProfileQuickActionsProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/90 overflow-hidden">
         <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
               {t("profile.quickActions")}
            </h3>
         </div>

         <div className="divide-y divide-gray-100">
            <Link
               href="/orders"
               className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/80 transition-colors group cursor-pointer"
            >
               <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                     <Package size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                     <span className="block text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {t("orders.title")}
                     </span>
                     <span className="text-xs text-gray-400">
                        {orderCount > 0 ? `${orderCount} ${t("orders.title").toLowerCase()}` : t("orders.noOrders")}
                     </span>
                  </div>
               </div>
               <ChevronRight size={18} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
               href="/catalog"
               className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/80 transition-colors group cursor-pointer"
            >
               <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                     <ShoppingCart size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                     <span className="block text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {t("profile.products")}
                     </span>
                     <span className="text-xs text-gray-400">
                        {t("catalog.allCategories")}
                     </span>
                  </div>
               </div>
               <ChevronRight size={18} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
         </div>
      </div>
   );
}
