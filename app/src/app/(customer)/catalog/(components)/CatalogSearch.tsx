"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";
import { useCatalogSearch } from "./useCatalogSearch";

interface CatalogSearchProps {
  readonly query: string;
  readonly category: string;
}

export const CatalogSearch = ({ query, category }: CatalogSearchProps) => {
  const { t } = useLanguage();
  const { inputRef, hasValue, isPending, onChange, clear, maxLength } =
    useCatalogSearch(query, category);

  return (
    <div className="relative w-full shrink-0 md:max-w-xs">
      <div className="bg-card border-border focus-within:border-primary focus-within:ring-primary/20 relative flex items-center rounded-xl border transition-all duration-200 focus-within:ring-2">
        {isPending ? (
          <Loader2
            size={16}
            className="text-muted-foreground pointer-events-none absolute left-3 animate-spin"
          />
        ) : (
          <Search
            size={16}
            className="text-muted-foreground pointer-events-none absolute left-3"
          />
        )}
        <input
          ref={inputRef}
          type="search"
          defaultValue={query}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("catalog.searchPlaceholder")}
          aria-label={t("catalog.searchPlaceholder")}
          className={cn(
            "text-foreground placeholder:text-muted-foreground w-full bg-transparent py-2.5 pr-8 pl-9 text-sm font-medium outline-hidden",
            "[&::-webkit-search-cancel-button]:hidden"
          )}
        />
        {hasValue && (
          <button
            type="button"
            onClick={clear}
            className="text-muted-foreground hover:text-foreground hover:bg-accent absolute right-2 cursor-pointer rounded-full p-1 transition-colors"
            aria-label={t("catalog.clearSearch")}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
