"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ChevronDown, Globe, LogIn, LogOut, Package, Search, ShieldCheck, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface CatalogNavbarProps {
   searchQuery: string;
   setSearchQuery: (q: string) => void;
   categories: string[];
   selectedCategory: string;
   setSelectedCategory: (cat: string) => void;
}

export const CatalogNavbar = ({ searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory }: CatalogNavbarProps) => {
   const { t, language, setLanguage } = useLanguage();
   const { user, role, signOut } = useAuth();
   const { totalItemsCount, openCart } = useCart();
   const router = useRouter();

   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
   const [loggingOut, setLoggingOut] = useState(false);
   const profileMenuRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileMenuOpen(false);
         }
      };
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") setIsProfileMenuOpen(false);
      };
      if (isProfileMenuOpen) {
         document.addEventListener("mousedown", handleClickOutside);
         document.addEventListener("keydown", handleKeyDown);
      }
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [isProfileMenuOpen]);

   const handleLogout = async () => {
      setLoggingOut(true);
      try {
         await signOut();
         router.push("/");
      } finally {
         setLoggingOut(false);
      }
   };

   return (
      <header className="bg-primary text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-40 space-y-4 md:hidden">
         <div className="flex justify-between items-center gap-3">
            <div className="min-w-0 flex-1">
               <h1 className="text-2xl font-black tracking-tight truncate">{t("catalog.products")}</h1>
               <p className="text-xs text-white/80 mt-0.5 truncate">{t("app.title")}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
               {user && (
                  <button onClick={openCart} className="relative p-2.5 bg-white/15 hover:bg-white/25 rounded-full transition-colors cursor-pointer shrink-0" aria-label="Open Cart">
                     <ShoppingCart size={22} />
                     {totalItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md animate-scale-in">{totalItemsCount}</span>}
                  </button>
               )}
               {user ? (
                  <div className="relative shrink-0" ref={profileMenuRef}>
                     <button
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 bg-white/15 hover:bg-white/25 rounded-full transition-all focus:outline-hidden border border-white/20 cursor-pointer"
                        aria-expanded={isProfileMenuOpen}
                        aria-haspopup="true"
                        aria-label="User Profile Menu"
                     >
                        <div className="w-7 h-7 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xs shadow-xs">{user.email ? user.email.charAt(0).toUpperCase() : <User size={16} />}</div>
                        <ChevronDown size={14} className={`text-white/80 transition-transform duration-200 hidden sm:block ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                     </button>

                     {isProfileMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-60 bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                           <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-xs text-gray-400 font-medium">{t("catalog.loggedInAs")}</p>
                              <p className="text-sm font-semibold text-gray-900 truncate" title={user.email || ""}>{user.email}</p>
                              {role === "admin" && <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">Admin</span>}
                           </div>

                           <div className="py-1">
                              <Link href="/profile" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                 <User size={16} className="text-gray-500" />
                                 <span>{t("catalog.profile")}</span>
                              </Link>
                              <Link href="/cart" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                 <ShoppingCart size={16} className="text-gray-500" />
                                 <span>{t("cart.title")}</span>
                              </Link>
                              <Link href="/orders" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                 <Package size={16} className="text-gray-500" />
                                 <span>{t("catalog.myOrders")}</span>
                              </Link>
                              {role === "admin" && (
                                 <Link href="/admin" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors">
                                    <ShieldCheck size={16} className="text-primary" />
                                    <span>{t("catalog.adminDashboard")}</span>
                                 </Link>
                              )}
                           </div>

                           <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                 <Globe size={15} className="text-gray-400" />
                                 <span>{t("language.switcherLabel")}</span>
                              </div>
                              <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200">
                                 <button onClick={() => setLanguage("de")} className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${language === "de" ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}>
                                    DE
                                 </button>
                                 <button onClick={() => setLanguage("en")} className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${language === "en" ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}>
                                    EN
                                 </button>
                              </div>
                           </div>

                           <div className="border-t border-gray-100 pt-1">
                              <button
                                 onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    handleLogout();
                                 }}
                                 disabled={loggingOut}
                                 className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-secondary hover:bg-secondary/10 transition-colors disabled:opacity-50 text-left font-medium cursor-pointer"
                              >
                                 {loggingOut ? <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div> : <LogOut size={16} className="text-secondary" />}
                                 <span>{t("catalog.logout")}</span>
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="flex items-center space-x-2 shrink-0">
                     <LanguageSwitcher />
                     <Link href="/login?redirect=/catalog" className="flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap">
                        <LogIn size={15} />
                        <span>{t("catalog.login")}</span>
                     </Link>
                  </div>
               )}
            </div>
         </div>

         {/* Mobile Search Input */}
         <div className="relative w-full">
            <div className="relative flex items-center bg-white/20 backdrop-blur-md rounded-2xl border border-white/25 focus-within:bg-white focus-within:border-white focus-within:shadow-md transition-all duration-200">
               <Search size={18} className="absolute left-3.5 text-white/80 group-focus-within:text-primary pointer-events-none transition-colors" />
               <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("catalog.searchPlaceholder")} className="w-full bg-transparent text-white focus:text-gray-900 placeholder:text-white/75 focus:placeholder:text-gray-400 pl-10 pr-9 py-3 outline-hidden text-sm font-medium transition-colors" />
               {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 p-1 rounded-full text-white/80 hover:text-gray-900 hover:bg-black/10 focus-within:text-gray-600 transition-colors cursor-pointer" aria-label={t("catalog.clearSearch")}>
                     <X size={16} />
                  </button>
               )}
            </div>
         </div>

         {/* Mobile Category Filter Pills */}
         <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 w-full">
            {categories.map((cat) => (
               <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat ? "bg-white text-primary shadow-sm" : "bg-white/15 text-white hover:bg-white/25"}`}>
                  {cat === "all" ? t("catalog.allCategories") : t(`categories.${cat}`) !== `categories.${cat}` ? t(`categories.${cat}`) : cat}
               </button>
            ))}
         </div>
      </header>
   );
};
