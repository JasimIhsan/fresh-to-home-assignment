"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Clock, Package, ShoppingBag, TrendingUp } from "lucide-react";

export interface AdminKpiGridProps {
   totalRevenue: number;
   totalOrdersCount: number;
   pendingCount: number;
   activeProductsCount: number;
   totalProductsCount: number;
}

export function AdminKpiGrid({
   totalRevenue,
   totalOrdersCount,
   pendingCount,
   activeProductsCount,
   totalProductsCount,
}: AdminKpiGridProps) {
   const { t } = useLanguage();

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Total Revenue */}
         <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  {t("admin.totalRevenue")}
               </span>
               <span className="text-2xl font-black text-gray-900 mt-1 block">
                  {totalRevenue.toFixed(2).replace(".", ",")} €
               </span>
               <span className="text-[11px] text-emerald-600 font-bold flex items-center mt-1">
                  <TrendingUp size={13} className="mr-1" /> {t("admin.revenueTrend")}
               </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-primary flex items-center justify-center">
               <TrendingUp size={24} />
            </div>
         </div>

         {/* Total Orders */}
         <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  {t("admin.totalOrders")}
               </span>
               <span className="text-2xl font-black text-gray-900 mt-1 block">{totalOrdersCount}</span>
               <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                  {t("admin.successfulOrders")}
               </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <ShoppingBag size={24} />
            </div>
         </div>

         {/* Pending Orders */}
         <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  {t("admin.pendingOrders")}
               </span>
               <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
               <span className="text-[11px] text-amber-700 font-medium mt-1 block">
                  Aktion erforderlich
               </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
               <Clock size={24} />
            </div>
         </div>

         {/* Active Products */}
         <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  {t("admin.activeProducts")}
               </span>
               <span className="text-2xl font-black text-gray-900 mt-1 block">
                  {activeProductsCount} / {totalProductsCount}
               </span>
               <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                  Live im Sortiment
               </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <Package size={24} />
            </div>
         </div>
      </div>
   );
}
