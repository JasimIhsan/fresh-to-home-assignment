"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Package } from "lucide-react";
import Link from "next/link";

export function CustomerOrdersEmpty() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-xs">
      <Package size={48} className="mx-auto text-gray-400" />
      <h3 className="text-lg font-bold text-gray-800">{t("orders.empty")}</h3>
      <p className="mx-auto max-w-sm text-sm text-gray-500">
        Sie haben aktuell keine Bestellungen in dieser Kategorie.
      </p>
      <Link
        href="/catalog"
        className="bg-primary inline-block rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:opacity-90"
      >
        {t("checkout.backToCatalog")}
      </Link>
    </div>
  );
}
