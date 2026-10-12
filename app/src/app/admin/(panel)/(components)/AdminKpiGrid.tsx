"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Clock, Package, ShoppingBag, TrendingUp } from "lucide-react";

export interface AdminKpiGridProps {
  readonly totalRevenue: number;
  readonly totalOrdersCount: number;
  readonly pendingCount: number;
  readonly activeProductsCount: number;
  readonly totalProductsCount: number;
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
        <div>
          <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {t("admin.totalRevenue")}
          </span>
          <span className="mt-1 block text-2xl font-black text-gray-900">
            {totalRevenue.toFixed(2).replace(".", ",")} €
          </span>
          <span className="mt-1 flex items-center text-[11px] font-bold text-emerald-600">
            <TrendingUp size={13} className="mr-1" /> {t("admin.revenueTrend")}
          </span>
        </div>
        <div className="text-primary flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50">
          <TrendingUp size={24} />
        </div>
      </div>

      {/* Total Orders */}
      <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
        <div>
          <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {t("admin.totalOrders")}
          </span>
          <span className="mt-1 block text-2xl font-black text-gray-900">
            {totalOrdersCount}
          </span>
          <span className="mt-1 block text-[11px] font-medium text-gray-500">
            {t("admin.successfulOrders")}
          </span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ShoppingBag size={24} />
        </div>
      </div>

      {/* Pending Orders */}
      <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
        <div>
          <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {t("admin.pendingOrders")}
          </span>
          <span className="mt-1 block text-2xl font-black text-amber-600">
            {pendingCount}
          </span>
          <span className="mt-1 block text-[11px] font-medium text-amber-700">
            Aktion erforderlich
          </span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Clock size={24} />
        </div>
      </div>

      {/* Active Products */}
      <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
        <div>
          <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {t("admin.activeProducts")}
          </span>
          <span className="mt-1 block text-2xl font-black text-gray-900">
            {activeProductsCount} / {totalProductsCount}
          </span>
          <span className="mt-1 block text-[11px] font-medium text-emerald-600">
            Live im Sortiment
          </span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Package size={24} />
        </div>
      </div>
    </div>
  );
}
