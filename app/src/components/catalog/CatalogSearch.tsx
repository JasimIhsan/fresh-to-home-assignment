"use client";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CatalogSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const CatalogSearch = ({
  searchQuery,
  setSearchQuery,
}: CatalogSearchProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full shrink-0 md:max-w-xs">
      <div className="bg-card border-border focus-within:border-primary focus-within:ring-primary/20 relative flex items-center rounded-xl border transition-all duration-200 focus-within:ring-2">
        <Search
          size={16}
          className="text-muted-foreground pointer-events-none absolute left-3"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("catalog.searchPlaceholder")}
          className="text-foreground placeholder:text-muted-foreground w-full bg-transparent py-2.5 pr-8 pl-9 text-sm font-medium outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
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
