"use client";

import { useLanguage } from "@/context/LanguageContext";

export function AdminOrdersHeading() {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t("admin.orders")}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{t("admin.ordersSubtitle")}</p>
    </div>
  );
}

export function AdminOrdersCount({ count }: Readonly<{ count: number }>) {
  const { t } = useLanguage();
  return (
    <span className="self-start rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-xs sm:self-auto">
      {t("admin.totalOrders")}: {count}
    </span>
  );
}
