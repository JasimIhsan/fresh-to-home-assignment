"use client";

import { CATALOG_PATH } from "@/components/catalog/catalog-url";
import { useLanguage } from "@/context/LanguageContext";
import { Search } from "lucide-react";
import Link from "next/link";

export function CatalogEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="bg-card text-card-foreground border-border rounded-2xl border p-8 py-16 text-center shadow-sm">
      <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full">
        <Search size={26} />
      </div>
      <h3 className="text-foreground mb-1 text-lg font-bold">
        {t("catalog.noResults")}
      </h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {t("catalog.noResultsDesc")}
      </p>
      <Link
        href={CATALOG_PATH}
        replace
        scroll={false}
        className="bg-primary hover:bg-primary/90 inline-block cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all"
      >
        {t("catalog.products")}
      </Link>
    </div>
  );
}
