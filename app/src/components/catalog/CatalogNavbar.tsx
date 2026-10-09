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

export const CatalogNavbar = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
}: CatalogNavbarProps) => {
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
      className={`bg-primary sticky top-0 z-40 rounded-b-3xl p-5 text-white shadow-lg transition-all duration-300 ease-in-out md:hidden ${
        isVisible ? "space-y-3.5 pb-5" : "space-y-0 pb-4"
      }`}
    >
      {/* Top Bar with Title and Cart/Login */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-black tracking-tight">
            {t("catalog.products")}
          </h1>
          <p className="mt-0.5 truncate text-xs text-white/80">
            {t("app.title")}
          </p>
        </div>

        <div className="flex shrink-0 items-center space-x-2">
          {user ? (
            <button
              onClick={openCart}
              className="relative shrink-0 cursor-pointer rounded-full bg-white/15 p-2.5 transition-colors hover:bg-white/25 active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingCart size={22} />
              {totalItemsCount > 0 && (
                <span className="bg-secondary animate-scale-in absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>
          ) : (
            <Link
              href="/login?redirect=/catalog"
              className="flex items-center space-x-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white transition-all hover:bg-white/30 active:scale-95 sm:text-sm"
            >
              <LogIn size={15} />
              <span>{t("catalog.login")}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Collapsible Search and Filters Wrapper */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isVisible
            ? "grid-rows-[1fr] pt-1 opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="space-y-3 overflow-hidden">
          {/* Mobile Search Input */}
          <div className="relative w-full">
            <div className="relative flex items-center rounded-2xl border border-white/25 bg-white/20 backdrop-blur-md transition-all duration-200 focus-within:border-white focus-within:bg-white focus-within:shadow-md">
              <Search
                size={18}
                className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-white/80 transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("catalog.searchPlaceholder")}
                className="w-full bg-transparent py-2.5 pr-9 pl-10 text-sm font-medium text-white outline-hidden transition-colors placeholder:text-white/75 focus:text-gray-900 focus:placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 cursor-pointer rounded-full p-1 text-white/80 transition-colors focus-within:text-gray-600 hover:bg-black/10 hover:text-gray-900"
                  aria-label={t("catalog.clearSearch")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Category Filter Pills */}
          <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? "text-primary bg-white shadow-sm"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                {cat === "all"
                  ? t("catalog.allCategories")
                  : t(`categories.${cat}`) !== `categories.${cat}`
                    ? t(`categories.${cat}`)
                    : cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
