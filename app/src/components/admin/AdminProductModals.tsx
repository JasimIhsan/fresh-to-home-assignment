"use client";

import { useLanguage } from "@/context/LanguageContext";
import { AlertTriangle, Layers, XCircle } from "lucide-react";
import React from "react";

export interface AdminProductModalsProps {
   isStockModalOpen: boolean;
   setIsStockModalOpen: (open: boolean) => void;
   stockAdjustMode: "set" | "add";
   setStockAdjustMode: (mode: "set" | "add") => void;
   stockInput: string;
   setStockInput: (val: string) => void;
   stockLevel: number;
   onStockAdjustmentSubmit: (e: React.FormEvent) => void;
   isDeleteModalOpen: boolean;
   setIsDeleteModalOpen: (open: boolean) => void;
   productName: string;
   onDeleteConfirm: () => void;
}

export function AdminProductModals({
   isStockModalOpen,
   setIsStockModalOpen,
   stockAdjustMode,
   setStockAdjustMode,
   stockInput,
   setStockInput,
   stockLevel,
   onStockAdjustmentSubmit,
   isDeleteModalOpen,
   setIsDeleteModalOpen,
   productName,
   onDeleteConfirm,
}: AdminProductModalsProps) {
   const { t } = useLanguage();

   return (
      <>
         {/* Quick Stock Adjustment Modal */}
         {isStockModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
               <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                           <Layers size={16} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{t("admin.adjustStockModalTitle")}</h3>
                     </div>
                     <button
                        onClick={() => setIsStockModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                     >
                        <XCircle size={20} />
                     </button>
                  </div>

                  <form onSubmit={onStockAdjustmentSubmit} className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                           Adjustment Type
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                           <button
                              type="button"
                              onClick={() => setStockAdjustMode("set")}
                              className={`py-2 rounded-lg transition-all cursor-pointer ${
                                 stockAdjustMode === "set" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                              }`}
                           >
                              Set Exact Stock
                           </button>
                           <button
                              type="button"
                              onClick={() => setStockAdjustMode("add")}
                              className={`py-2 rounded-lg transition-all cursor-pointer ${
                                 stockAdjustMode === "add" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                              }`}
                           >
                              Add / Restock
                           </button>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                           {stockAdjustMode === "set" ? t("admin.newStockValue") : "Add Amount (kg)"}
                        </label>
                        <div className="relative">
                           <input
                              type="number"
                              step="1"
                              min="0"
                              required
                              value={stockInput}
                              onChange={(e) => setStockInput(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:outline-hidden"
                           />
                           <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">kg</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">
                           Current stock level: <strong>{stockLevel} kg</strong>
                        </p>
                     </div>

                     <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                        <button
                           type="button"
                           onClick={() => setIsStockModalOpen(false)}
                           className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                           {t("admin.cancel")}
                        </button>
                        <button
                           type="submit"
                           className="px-5 py-2.5 bg-primary hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                        >
                           Apply Stock Update
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Delete Confirmation Modal */}
         {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
               <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scaleUp">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                     <AlertTriangle size={24} />
                  </div>

                  <div className="text-center space-y-1">
                     <h3 className="font-bold text-lg text-slate-900">{t("admin.deleteProduct")}</h3>
                     <p className="text-xs text-slate-500">
                        {t("admin.deleteConfirm")} This will permanently remove <strong className="text-slate-800">{productName}</strong> from both store catalogs and internal admin inventory.
                     </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-3">
                     <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                     >
                        {t("admin.cancel")}
                     </button>
                     <button
                        type="button"
                        onClick={onDeleteConfirm}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                     >
                        {t("admin.deleteProduct")}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
