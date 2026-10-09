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
    <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-7">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t("admin.inventoryPricing")}
            </h2>
            <p className="text-xs text-slate-500">
              Stock quotas, cost models & profit margin metrics
            </p>
          </div>
        </div>

        <button
          onClick={onOpenStockModal}
          className="bg-primary/10 hover:bg-primary/20 text-primary inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors"
        >
          <Layers size={14} />
          <span>{t("admin.quickAdjustStock")}</span>
        </button>
      </div>

      {/* Inventory KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className={`rounded-2xl border p-4 ${isLowStock ? "border-red-200 bg-red-50/60" : "border-slate-100 bg-slate-50"}`}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              {t("admin.inStock")}
            </span>
            {isLowStock ? (
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-700">
                Low Stock
              </span>
            ) : (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                Healthy
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-black ${isLowStock ? "text-red-600" : "text-slate-900"}`}
            >
              {stockLevel}
            </span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Available for sale:{" "}
            <strong className="text-slate-800">{availableStock} kg</strong>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            {t("admin.reserved")}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-600">
              {reservedStock}
            </span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Committed in active checkout orders
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            {t("admin.reorderPoint")}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-700">
              {reorderPoint}
            </span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Automatic replenishment trigger
          </div>
        </div>
      </div>

      {/* Financial & Margin Card */}
      <div className="space-y-4 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-400" />
            <span className="text-sm font-bold tracking-tight">
              Financial & Margins Breakdown
            </span>
          </div>
          <span className="font-mono text-xs font-extrabold text-emerald-400">
            +{marginPercentage.toFixed(1)}% Gross Margin
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <span className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {t("admin.wholesalePrice")}
            </span>
            <p className="text-lg font-black text-slate-200">
              {wholesaleCost.toFixed(2).replace(".", ",")} €
            </p>
          </div>

          <div>
            <span className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {t("admin.retailPrice")}
            </span>
            <p className="text-lg font-black text-emerald-400">
              {retailPrice.toFixed(2).replace(".", ",")} €
            </p>
          </div>

          <div>
            <span className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {t("admin.marginPerKg")}
            </span>
            <p className="text-lg font-black text-white">
              +{grossMargin.toFixed(2).replace(".", ",")} € / kg
            </p>
          </div>
        </div>

        {/* Progress visualizer for profit margin */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>
              Cost Allocation (Wholesale: {(100 - marginPercentage).toFixed(0)}
              %)
            </span>
            <span>Profit Spread ({marginPercentage.toFixed(0)}%)</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full bg-slate-500"
              style={{ width: `${Math.max(5, 100 - marginPercentage)}%` }}
            />
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${Math.max(5, marginPercentage)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
