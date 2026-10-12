"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buildCatalogHref } from "./catalog-url";
import { categoryLabel } from "./categoryLabel";

interface CategoryFilterProps {
  readonly categories: readonly string[];
  readonly selectedCategory: string;
  readonly query: string;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  query,
}: CategoryFilterProps) => {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("catalog.allCategories")}
      className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto px-0.5 py-1.5"
    >
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <Link
            key={cat}
            href={buildCatalogHref({ query, category: cat })}
            replace
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-bold whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-primary border-primary text-white shadow-sm"
                : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border-border"
            )}
          >
            {categoryLabel(cat, t)}
          </Link>
        );
      })}
    </nav>
  );
};
