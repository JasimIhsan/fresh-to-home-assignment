"use client";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryFilterProps {
   categories: string[];
   selectedCategory: string;
   setSelectedCategory: (cat: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
   const { t } = useLanguage();

   return (
      <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-0.5 no-scrollbar w-full">
         {categories.map((cat) => (
            <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  selectedCategory === cat
                     ? "bg-primary text-white border-primary shadow-sm"
                     : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border-border"
               }`}
            >
               {cat === "all" ? t("catalog.allCategories") : t(`categories.${cat}`) !== `categories.${cat}` ? t(`categories.${cat}`) : cat}
            </button>
         ))}
      </div>
   );
};
