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
    <div className="overflow-hidden rounded-3xl border border-gray-100/90 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
        <h3 className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">
          {t("profile.quickActions")}
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        <Link
          href="/orders"
          className="group flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50/80 sm:p-5"
        >
          <div className="flex items-center gap-3.5">
            <div className="group-hover:bg-primary/10 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 transition-colors">
              <Package
                size={20}
                className="group-hover:text-primary text-gray-600 transition-colors"
              />
            </div>
            <div>
              <span className="group-hover:text-primary block text-sm font-bold text-gray-900 transition-colors">
                {t("orders.title")}
              </span>
              <span className="text-xs text-gray-400">
                {orderCount > 0
                  ? `${orderCount} ${t("orders.title").toLowerCase()}`
                  : t("orders.noOrders")}
              </span>
            </div>
          </div>
          <ChevronRight
            size={18}
            className="group-hover:text-primary text-gray-400 transition-all group-hover:translate-x-0.5"
          />
        </Link>

        <Link
          href="/catalog"
          className="group flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50/80 sm:p-5"
        >
          <div className="flex items-center gap-3.5">
            <div className="group-hover:bg-primary/10 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 transition-colors">
              <ShoppingCart
                size={20}
                className="group-hover:text-primary text-gray-600 transition-colors"
              />
            </div>
            <div>
              <span className="group-hover:text-primary block text-sm font-bold text-gray-900 transition-colors">
                {t("profile.products")}
              </span>
              <span className="text-xs text-gray-400">
                {t("catalog.allCategories")}
              </span>
            </div>
          </div>
          <ChevronRight
            size={18}
            className="group-hover:text-primary text-gray-400 transition-all group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
