"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface AdminStockAlertsCardProps {
   products: Product[];
}

export function AdminStockAlertsCard({ products }: AdminStockAlertsCardProps) {
   const { t } = useLanguage();

   return (
      <div className="lg:col-span-4 space-y-6">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
               <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <span>{t("admin.stockOverview")}</span>
               </h3>
               <Link
                  href="/admin/products"
                  className="text-xs font-semibold text-primary hover:underline"
               >
                  {t("admin.manage")}
               </Link>
            </div>

            <div className="space-y-3">
               {products.slice(0, 4).map((p) => {
                  const stock = p.stockKg ?? 50;
                  const isLow = stock < 30;
                  return (
                     <Link
                        key={p.id}
                        href={`/admin/products/${p.id}`}
                        className="block p-3 bg-gray-50 hover:bg-purple-50/60 border border-transparent hover:border-purple-100 rounded-2xl text-xs space-y-1.5 transition-all group cursor-pointer"
                     >
                        <div className="flex justify-between items-center">
                           <span className="font-bold text-gray-800 group-hover:text-primary transition-colors truncate max-w-37.5">
                              {p.name}
                           </span>
                           <span className={`font-black ${isLow ? "text-red-600" : "text-gray-700"}`}>
                              {stock} kg
                           </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                           <div
                              className={`h-1.5 rounded-full ${isLow ? "bg-red-500" : "bg-primary"}`}
                              style={{ width: `${Math.min(100, (stock / 60) * 100)}%` }}
                           />
                        </div>
                     </Link>
                  );
               })}
            </div>
         </div>

         {/* Quick Shop Links */}
         <div className="bg-linear-to-br from-primary to-purple-800 text-white p-6 rounded-3xl shadow-md space-y-3">
            <h4 className="font-bold text-base">{t("admin.shopPreview")}</h4>
            <p className="text-xs opacity-80 leading-relaxed">
               {t("admin.shopPreviewDesc")}
            </p>
            <Link
               href="/catalog"
               className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors shadow-sm"
            >
               <span>{t("admin.openCustomerView")}</span>
               <ChevronRight size={14} />
            </Link>
         </div>
      </div>
   );
}
