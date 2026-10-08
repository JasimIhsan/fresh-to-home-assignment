"use client";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CatalogSearchProps {
   searchQuery: string;
   setSearchQuery: (q: string) => void;
}

export const CatalogSearch = ({ searchQuery, setSearchQuery }: CatalogSearchProps) => {
   const { t } = useLanguage();

   return (
      <div className="relative w-full md:max-w-xs shrink-0">
         <div className="relative flex items-center bg-card rounded-xl border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
            <Search size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={t("catalog.searchPlaceholder")}
               className="w-full bg-transparent text-foreground placeholder:text-muted-foreground pl-9 pr-8 py-2.5 outline-hidden text-sm font-medium"
            />
            {searchQuery && (
               <button onClick={() => setSearchQuery("")} className="absolute right-2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer" aria-label={t("catalog.clearSearch")}>
                  <X size={14} />
               </button>
            )}
         </div>
      </div>
   );
};
