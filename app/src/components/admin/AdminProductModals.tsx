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
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="animate-scaleUp w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Layers size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t("admin.adjustStockModalTitle")}
                </h3>
              </div>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={onStockAdjustmentSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setStockAdjustMode("set")}
                    className={`cursor-pointer rounded-lg py-2 transition-all ${
                      stockAdjustMode === "set"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500"
                    }`}
                  >
                    Set Exact Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockAdjustMode("add")}
                    className={`cursor-pointer rounded-lg py-2 transition-all ${
                      stockAdjustMode === "add"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500"
                    }`}
                  >
                    Add / Restock
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  {stockAdjustMode === "set"
                    ? t("admin.newStockValue")
                    : "Add Amount (kg)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                    className="focus:border-primary w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute top-3.5 right-4 text-xs font-bold text-slate-400">
                    kg
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Current stock level: <strong>{stockLevel} kg</strong>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {t("admin.cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-primary cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
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
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="animate-scaleUp w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1 text-center">
              <h3 className="text-lg font-bold text-slate-900">
                {t("admin.deleteProduct")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("admin.deleteConfirm")} This will permanently remove{" "}
                <strong className="text-slate-800">{productName}</strong> from
                both store catalogs and internal admin inventory.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                {t("admin.cancel")}
              </button>
              <button
                type="button"
                onClick={onDeleteConfirm}
                className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700"
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
