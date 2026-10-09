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
      <Link
        href="/orders"
        className="hover:border-primary/20 group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-gray-100/90 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div className="group-hover:bg-primary/10 mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 transition-colors">
          <Package size={22} className="text-primary" />
        </div>
        <span className="text-2xl font-black tracking-tight text-gray-900">
          {orderCount}
        </span>
        <span className="mt-0.5 text-xs font-bold text-gray-500">
          {t("orders.title")}
        </span>
      </Link>

      <Link
        href="/cart"
        className="hover:border-primary/20 group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-gray-100/90 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div className="group-hover:bg-primary/10 mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 transition-colors">
          <ShoppingCart size={22} className="text-primary" />
        </div>
        <span className="text-primary mb-0.5 text-xs font-extrabold tracking-wider uppercase">
          {t("profile.toCheckout")}
        </span>
        <span className="text-xs font-bold text-gray-500">
          {t("profile.cart")}
        </span>
      </Link>
    </div>
  );
}
