"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Plus } from "lucide-react";
import Link from "next/link";

export function AdminProductsHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {t("admin.products")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("admin.productsSubtitle")}
        </p>
      </div>

      <Link
        href="/admin/products/new"
        className="bg-primary inline-flex items-center space-x-2 self-start rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-purple-700 sm:self-auto"
      >
        <Plus size={18} />
        <span>{t("admin.addProduct")}</span>
      </Link>
    </div>
  );
}
