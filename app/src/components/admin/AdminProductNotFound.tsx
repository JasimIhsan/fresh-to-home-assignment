"use client";

import { useLanguage } from "@/context/LanguageContext";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AdminProductNotFound() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto my-12 max-w-md space-y-4 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <AlertTriangle size={28} />
      </div>
      <h2 className="text-xl font-bold text-gray-900">
        {t("catalog.noResults")}
      </h2>
      <p className="text-sm text-gray-500">
        The requested product does not exist in the administrative inventory.
      </p>
      <div className="pt-2">
        <Link
          href="/admin/products"
          className="bg-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
        >
          <ArrowLeft size={16} />
          <span>{t("productDetail.back")}</span>
        </Link>
      </div>
    </div>
  );
}
