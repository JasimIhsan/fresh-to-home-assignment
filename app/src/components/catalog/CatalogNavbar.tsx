"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { LogIn, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CatalogNavbarProps {
   searchQuery: string;
   setSearchQuery: (q: string) => void;
   categories: string[];
   selectedCategory: string;
   setSelectedCategory: (cat: string) => void;
}

export const CatalogNavbar = ({ searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory }: CatalogNavbarProps) => {
   const { t } = useLanguage();
   const { user } = useAuth();
   const { totalItemsCount, openCart } = useCart();

   const [isVisible, setIsVisible] = useState(true);
   const lastScrollY = useRef(0);

   useEffect(() => {
      const handleScroll = () => {
         const currentScrollY = window.scrollY;
         const scrollDifference = currentScrollY - lastScrollY.current;

         // Always expand at the very top of the page
         if (currentScrollY <= 20) {
            setIsVisible(true);
         } else if (searchQuery.trim().length > 0) {
            // Keep visible if user is actively searching
            setIsVisible(true);
         } else if (scrollDifference > 10 && currentScrollY > 70) {
            // Scrolling down -> collapse
            setIsVisible(false);
         } else if (scrollDifference < -10) {
            // Scrolling up -> expand
            setIsVisible(true);
         }

         lastScrollY.current = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
   }, [searchQuery]);

   return (
      <header
         className={`bg-primary text-white p-5 rounded-b-3xl shadow-lg sticky top-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
            isVisible ? "space-y-3.5 pb-5" : "space-y-0 pb-4"
         }`}
      >
         {/* Top Bar with Title and Cart/Login */}
         <div className="flex justify-between items-center gap-3">
            <div className="min-w-0 flex-1">
               <h1 className="text-2xl font-black tracking-tight truncate">{t("catalog.products")}</h1>
               <p className="text-xs text-white/80 mt-0.5 truncate">{t("app.title")}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
               {user ? (
                  <button onClick={openCart} className="relative p-2.5 bg-white/15 hover:bg-white/25 rounded-full transition-colors cursor-pointer shrink-0 active:scale-95" aria-label="Open Cart">
                     <ShoppingCart size={22} />
                     {totalItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md animate-scale-in">{totalItemsCount}</span>}
                  </button>
               ) : (
                  <Link href="/login?redirect=/catalog" className="flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap active:scale-95">
                     <LogIn size={15} />
                     <span>{t("catalog.login")}</span>
                  </Link>
               )}
            </div>
         </div>

         {/* Collapsible Search and Filters Wrapper */}
         <div
            className={`grid transition-all duration-300 ease-in-out ${
               isVisible ? "grid-rows-[1fr] opacity-100 pt-1" : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
         >
            <div className="overflow-hidden space-y-3">
               {/* Mobile Search Input */}
               <div className="relative w-full">
                  <div className="relative flex items-center bg-white/20 backdrop-blur-md rounded-2xl border border-white/25 focus-within:bg-white focus-within:border-white focus-within:shadow-md transition-all duration-200">
                     <Search size={18} className="absolute left-3.5 text-white/80 group-focus-within:text-primary pointer-events-none transition-colors" />
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("catalog.searchPlaceholder")}
                        className="w-full bg-transparent text-white focus:text-gray-900 placeholder:text-white/75 focus:placeholder:text-gray-400 pl-10 pr-9 py-2.5 outline-hidden text-sm font-medium transition-colors"
                     />
                     {searchQuery && (
                        <button
                           onClick={() => setSearchQuery("")}
                           className="absolute right-2.5 p-1 rounded-full text-white/80 hover:text-gray-900 hover:bg-black/10 focus-within:text-gray-600 transition-colors cursor-pointer"
                           aria-label={t("catalog.clearSearch")}
                        >
                           <X size={16} />
                        </button>
                     )}
                  </div>
               </div>

               {/* Mobile Category Filter Pills */}
               <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
                  {categories.map((cat) => (
                     <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                           selectedCategory === cat ? "bg-white text-primary shadow-sm" : "bg-white/15 text-white hover:bg-white/25"
                        }`}
                     >
                        {cat === "all" ? t("catalog.allCategories") : t(`categories.${cat}`) !== `categories.${cat}` ? t(`categories.${cat}`) : cat}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </header>
   );
};

