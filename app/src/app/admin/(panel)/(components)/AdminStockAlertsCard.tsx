"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface StockAlertItem {
  readonly id: string;
  readonly name: string;
  readonly stockKg: number;
}

export interface AdminStockAlertsCardProps {
  readonly items: readonly StockAlertItem[];
}

const LOW_STOCK_KG = 30;

export function AdminStockAlertsCard({ items }: AdminStockAlertsCardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 lg:col-span-4">
      <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <AlertTriangle size={18} className="text-amber-500" />
            <span>{t("admin.stockOverview")}</span>
          </h3>
          <Link
            href="/admin/products"
            className="text-primary text-xs font-semibold hover:underline"
          >
            {t("admin.manage")}
          </Link>
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-400">
              {t("catalog.noResults")}
            </p>
          )}
          {items.map((p) => {
            const stock = p.stockKg;
            const isLow = stock < LOW_STOCK_KG;
            return (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="group block cursor-pointer space-y-1.5 rounded-2xl border border-transparent bg-gray-50 p-3 text-xs transition-all hover:border-purple-100 hover:bg-purple-50/60"
              >
                <div className="flex items-center justify-between">
                  <span className="group-hover:text-primary max-w-37.5 truncate font-bold text-gray-800 transition-colors">
                    {p.name}
                  </span>
                  <span
                    className={cn(
                      "font-black",
                      isLow ? "text-red-600" : "text-gray-700"
                    )}
                  >
                    {stock} kg
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={cn(
                      "h-1.5 rounded-full",
                      isLow ? "bg-red-500" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(100, (stock / 60) * 100)}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Shop Links */}
      <div className="from-primary space-y-3 rounded-3xl bg-linear-to-br to-purple-800 p-6 text-white shadow-md">
        <h4 className="text-base font-bold">{t("admin.shopPreview")}</h4>
        <p className="text-xs leading-relaxed opacity-80">
          {t("admin.shopPreviewDesc")}
        </p>
        <Link
          href="/catalog"
          className="text-primary inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold shadow-sm transition-colors hover:bg-gray-100"
        >
          <span>{t("admin.openCustomerView")}</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
