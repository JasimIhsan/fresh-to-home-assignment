"use client";

import { useLanguage } from "@/context/LanguageContext";
import { DollarSign, Layers, TrendingUp } from "lucide-react";

export interface AdminProductInventoryPricingProps {
   stockLevel: number;
   reservedStock: number;
   availableStock: number;
   reorderPoint: number;
   isLowStock: boolean;
   retailPrice: number;
   wholesaleCost: number;
   grossMargin: number;
   marginPercentage: number;
   onOpenStockModal: () => void;
}

export function AdminProductInventoryPricing({
   stockLevel,
   reservedStock,
   availableStock,
   reorderPoint,
   isLowStock,
   retailPrice,
   wholesaleCost,
   grossMargin,
   marginPercentage,
   onOpenStockModal,
}: AdminProductInventoryPricingProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
         <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
               <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp size={18} />
               </div>
               <div>
                  <h2 className="font-bold text-base text-slate-900">{t("admin.inventoryPricing")}</h2>
                  <p className="text-xs text-slate-500">Stock quotas, cost models & profit margin metrics</p>
               </div>
            </div>

            <button
               onClick={onOpenStockModal}
               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
               <Layers size={14} />
               <span>{t("admin.quickAdjustStock")}</span>
            </button>
         </div>

         {/* Inventory KPI Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border ${isLowStock ? "bg-red-50/60 border-red-200" : "bg-slate-50 border-slate-100"}`}>
               <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                     {t("admin.inStock")}
                  </span>
                  {isLowStock ? (
                     <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                        Low Stock
                     </span>
                  ) : (
                     <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                        Healthy
                     </span>
                  )}
               </div>
               <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${isLowStock ? "text-red-600" : "text-slate-900"}`}>
                     {stockLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kg</span>
               </div>
               <div className="mt-2 text-[11px] text-slate-500">
                  Available for sale: <strong className="text-slate-800">{availableStock} kg</strong>
               </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1.5">
                  {t("admin.reserved")}
               </span>
               <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-600">{reservedStock}</span>
                  <span className="text-xs font-bold text-slate-500">kg</span>
               </div>
               <div className="mt-2 text-[11px] text-slate-500">Committed in active checkout orders</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1.5">
                  {t("admin.reorderPoint")}
               </span>
               <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-700">{reorderPoint}</span>
                  <span className="text-xs font-bold text-slate-500">kg</span>
               </div>
               <div className="mt-2 text-[11px] text-slate-500">Automatic replenishment trigger</div>
            </div>
         </div>

         {/* Financial & Margin Card */}
         <div className="p-5 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
               <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-400" />
                  <span className="font-bold text-sm tracking-tight">Financial & Margins Breakdown</span>
               </div>
               <span className="text-xs font-mono text-emerald-400 font-extrabold">
                  +{marginPercentage.toFixed(1)}% Gross Margin
               </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                     {t("admin.wholesalePrice")}
                  </span>
                  <p className="text-lg font-black text-slate-200">{wholesaleCost.toFixed(2).replace(".", ",")} €</p>
               </div>

               <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                     {t("admin.retailPrice")}
                  </span>
                  <p className="text-lg font-black text-emerald-400">{retailPrice.toFixed(2).replace(".", ",")} €</p>
               </div>

               <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                     {t("admin.marginPerKg")}
                  </span>
                  <p className="text-lg font-black text-white">+{grossMargin.toFixed(2).replace(".", ",")} € / kg</p>
               </div>
            </div>

            {/* Progress visualizer for profit margin */}
            <div className="space-y-1.5 pt-1">
               <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Cost Allocation (Wholesale: {(100 - marginPercentage).toFixed(0)}%)</span>
                  <span>Profit Spread ({marginPercentage.toFixed(0)}%)</span>
               </div>
               <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="h-full bg-slate-500" style={{ width: `${Math.max(5, 100 - marginPercentage)}%` }} />
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.max(5, marginPercentage)}%` }} />
               </div>
            </div>
         </div>
      </div>
   );
}
