"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Package, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ProfileStatsProps {
   orderCount: number;
}

export function ProfileStats({ orderCount }: ProfileStatsProps) {
   const { t } = useLanguage();

   return (
      <div className="grid grid-cols-2 gap-3.5">
         <Link href="/orders" className="bg-white p-5 rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col items-center justify-center text-center group cursor-pointer">
            <div className="w-12 h-12 bg-purple-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-2.5 transition-colors">
               <Package size={22} className="text-primary" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">{orderCount}</span>
            <span className="text-xs font-bold text-gray-500 mt-0.5">{t("orders.title")}</span>
         </Link>

         <Link href="/cart" className="bg-white p-5 rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col items-center justify-center text-center group cursor-pointer">
            <div className="w-12 h-12 bg-purple-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-2.5 transition-colors">
               <ShoppingCart size={22} className="text-primary" />
            </div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider mb-0.5">{t("profile.toCheckout")}</span>
            <span className="text-xs font-bold text-gray-500">{t("profile.cart")}</span>
         </Link>
      </div>
   );
}
