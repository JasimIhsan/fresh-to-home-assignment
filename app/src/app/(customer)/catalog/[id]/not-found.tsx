"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function ProductNotFound() {
  const { t } = useLanguage();

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-3xl">
        {t("productDetail.notFoundIcon")}
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900">
        {t("notFound.title")}
      </h2>
      <p className="max-w-xs text-sm text-gray-400">
        {t("catalog.noResultsDesc")}
      </p>
      <Link
        href="/catalog"
        className="bg-primary shadow-primary/30 mt-2 inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:bg-purple-700 active:scale-95"
      >
        {t("productDetail.back")}
      </Link>
    </div>
  );
}
