"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { ALL_CATEGORIES } from "@/services/index";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

const SEARCH_DEBOUNCE_MS = 300;
const MAX_QUERY_LENGTH = 100;

export interface AdminProductsFilterProps {
  readonly categories: readonly string[];
  readonly selectedCategory: string;
  readonly initialQuery: string;
}

/** Search and category filter, synced to the URL so the server filters. */
export function AdminProductsFilter({
  categories,
  selectedCategory,
  initialQuery,
}: AdminProductsFilterProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const queryRef = useRef(initialQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const navigate = (query: string, category: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== ALL_CATEGORIES)
      params.set("category", category);
    const search = params.toString();
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleQueryChange = (value: string) => {
    queryRef.current = value.trim().slice(0, MAX_QUERY_LENGTH);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => navigate(queryRef.current, selectedCategory),
      SEARCH_DEBOUNCE_MS
    );
  };

  const categoryLabel = (cat: string) => {
    if (cat === ALL_CATEGORIES) return t("catalog.allCategories");
    const key = `categories.${cat}`;
    const translated = t(key);
    return translated !== key ? translated : cat;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-xs transition-opacity sm:flex-row sm:p-5",
        isPending && "opacity-70"
      )}
    >
      <div className="relative w-full sm:w-80">
        <Search
          size={18}
          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          defaultValue={initialQuery}
          maxLength={MAX_QUERY_LENGTH}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={t("catalog.searchPlaceholder")}
          aria-label={t("catalog.searchPlaceholder")}
          className="focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:bg-white focus:outline-hidden"
        />
      </div>

      <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => navigate(queryRef.current, cat)}
            aria-pressed={selectedCategory === cat}
            className={cn(
              "cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all",
              selectedCategory === cat
                ? "bg-primary text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>
    </div>
  );
}
