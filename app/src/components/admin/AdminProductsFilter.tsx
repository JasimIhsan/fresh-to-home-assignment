"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Search } from "lucide-react";

export interface AdminProductsFilterProps {
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   categories: string[];
   selectedCategory: string;
   setSelectedCategory: (cat: string) => void;
}

export function AdminProductsFilter({
   searchQuery,
   setSearchQuery,
   categories,
   selectedCategory,
   setSelectedCategory,
}: AdminProductsFilterProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
         <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={t("catalog.searchPlaceholder")}
               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
            />
         </div>

         <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
               <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                     selectedCategory === cat ? "bg-primary text-white shadow-xs" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
               >
                  {cat === "all" ? t("catalog.allCategories") : t(`categories.${cat}`) !== `categories.${cat}` ? t(`categories.${cat}`) : cat}
               </button>
            ))}
         </div>
      </div>
   );
}
