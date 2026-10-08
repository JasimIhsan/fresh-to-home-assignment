"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { WeightStepper } from "@/components/ui/WeightStepper";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredProducts } from "@/lib/store";
import { Product } from "@/types";
import { Check, ChevronDown, Globe, LogIn, LogOut, Package, Search, ShieldCheck, ShoppingCart, Sparkles, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function CatalogPage() {
   const { t, language, setLanguage } = useLanguage();
   const { user, role, signOut } = useAuth();
   const { addToCart, totalItemsCount, openCart } = useCart();
   const router = useRouter();

   const [products, setProducts] = useState<Product[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<string>("all");
   const [searchQuery, setSearchQuery] = useState("");
   const [debouncedQuery, setDebouncedQuery] = useState("");
   const [itemWeights, setItemWeights] = useState<Record<string, number>>({});
   const [addedProductId, setAddedProductId] = useState<string | null>(null);
   const [loggingOut, setLoggingOut] = useState(false);

   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
   const profileMenuRef = useRef<HTMLDivElement>(null);

   // Load products from store
   useEffect(() => {
      const loaded = getStoredProducts();
      setProducts(loaded);
   }, []);

   // Close dropdown on outside click or escape
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileMenuOpen(false);
         }
      };
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setIsProfileMenuOpen(false);
         }
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

   // Debounce search input (300ms)
   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedQuery(searchQuery.trim().toLowerCase());
      }, 300);

      return () => clearTimeout(timer);
   }, [searchQuery]);

   const categories = useMemo(() => {
      const uniqueCats = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
      const result = ["all", ...uniqueCats];
      return result;
   }, [products]);

   const filteredProducts = useMemo(() => {
      const res = products.filter((product) => {
         const matchesCategory = selectedCategory === "all" || product.category?.toLowerCase() === selectedCategory.toLowerCase();
         const matchesSearch = !debouncedQuery || product.name?.toLowerCase().includes(debouncedQuery) || product.description?.toLowerCase().includes(debouncedQuery) || (product.category && product.category.toLowerCase().includes(debouncedQuery));
         return matchesCategory && matchesSearch;
      });
      return res;
   }, [products, selectedCategory, debouncedQuery]);

   const handleWeightChange = (productId: string, weight: number) => {
      setItemWeights((prev) => ({
         ...prev,
         [productId]: weight,
      }));
   };

   const handleAddToCart = (product: Product) => {
      const weight = itemWeights[product.id] || 0.5;

      if (!user) {
         openCart();
         return;
      }

      const result = addToCart(product, weight);
      if (result.success) {
         setAddedProductId(product.id);
         setTimeout(() => {
            setAddedProductId((current) => (current === product.id ? null : current));
         }, 1500);
      }
   };

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
      <div className="min-h-screen bg-background">
         {/* Mobile Header */}
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
                              {/* User Info Header */}
                              <div className="px-4 py-2 border-b border-gray-100">
                                 <p className="text-xs text-gray-400 font-medium">{t("catalog.loggedInAs")}</p>
                                 <p className="text-sm font-semibold text-gray-900 truncate" title={user.email || ""}>
                                    {user.email}
                                 </p>
                                 {role === "admin" && <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">Admin</span>}
                              </div>

                              {/* Navigation Links */}
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

                              {/* Language Selector */}
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

                              {/* Logout Button */}
                              <div className="border-t border-gray-100 pt-1">
                                 <button
                                    onClick={() => {
                                       setIsProfileMenuOpen(false);
                                       handleLogout();
                                    }}
                                    disabled={loggingOut}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 text-left font-medium cursor-pointer"
                                 >
                                    {loggingOut ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <LogOut size={16} className="text-red-600" />}
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

         {/* Main Content */}
         <main className="p-6 md:px-0 md:py-8 max-w-full mx-auto space-y-6 md:space-y-8">
            {/* Desktop & Tablet Hero Section */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-12 lg:mb-20 mt-2 lg:mt-6 relative">
               {/* Left Content */}
               <div className="space-y-6 lg:space-y-8 lg:col-span-6 xl:col-span-5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-primary/10 to-purple-500/10 text-primary text-xs lg:text-sm font-extrabold border border-primary/20 backdrop-blur-md shadow-xs">
                     <Sparkles size={15} className="text-primary animate-pulse" />
                     <span>{t("catalog.heroBadge")}</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[1.08] lg:leading-[1.05]">
                     {t("catalog.heroTitle1")} <br />
                     <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-600 to-indigo-600">{t("catalog.heroTitle2")}</span>
                  </h1>

                  <p className="text-gray-500 text-base lg:text-xl leading-relaxed max-w-lg font-medium">{t("catalog.heroSubtitle")}</p>

                  {/* Search Input - Clean, Balanced, Proportional */}
                  <div className="relative w-full max-w-lg mt-6">
                     {/* Soft ambient glow */}
                     <div className="absolute -inset-1 bg-linear-to-r from-primary/25 via-purple-500/20 to-indigo-500/25 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition duration-300"></div>

                     {/* Search container */}
                     <div className="relative bg-white/95 backdrop-blur-xl p-1.5 rounded-2xl shadow-lg border border-purple-100 hover:border-purple-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 flex items-center">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-primary shrink-0 ml-1">
                           <Search size={18} className="stroke-[2.2]" />
                        </div>

                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("catalog.searchPlaceholder")} className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 font-medium px-3 py-2 outline-hidden text-sm md:text-base min-w-0" />

                        {searchQuery && (
                           <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0 mr-1 cursor-pointer" aria-label={t("catalog.clearSearch")} title={t("catalog.clearSearch")}>
                              <X size={15} />
                           </button>
                        )}

                        <button
                           onClick={() => {
                              const productsSection = document.getElementById("catalog-products-grid");
                              productsSection?.scrollIntoView({ behavior: "smooth" });
                           }}
                           className="bg-primary hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-sm hover:shadow-md transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                           <span>{t("catalog.products")}</span>
                        </button>
                     </div>
                  </div>
               </div>

               {/* Right Image/Graphic - Scaled cleanly on tablet & desktop */}
               <div className="lg:col-span-6 xl:col-span-7 relative h-90 md:h-105h-[560px] w-full flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
                  {/* Decorative glowing background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-125 bg-linear-to-tr from-purple-200/40 to-indigo-100/40 rounded-full blur-3xl -z-10"></div>

                  {/* Dynamic CSS for the blob animation */}
                  <style
                     dangerouslySetInnerHTML={{
                        __html: `
                     @keyframes blobShape {
                        0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                        33% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
                        66% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
                        100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                     }
                     .brush-blob {
                        animation: blobShape 15s ease-in-out infinite alternate;
                     }
                  `,
                     }}
                  />

                  {/* The Blob Container */}
                  <div className="relative w-[85%] md:w-[80%] lg:w-[90%] aspect-square max-w-115-h-[460px] shadow-2xl group brush-blob overflow-hidden bg-gray-100 border-6 lg:border-8 border-white">
                     <img src="/images/products/raw_beef_steak.jpg" alt="Premium Fresh Meat" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Floating Guarantee Badge */}
                  <div className="absolute bottom-4 md:bottom-6 left-2 md:left-4 lg:left-8 bg-white/95 backdrop-blur-xl px-4 py-2.5 md:px-5 md:py-3.5 rounded-2xl md:rounded-[2rem] shadow-xl border border-white flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                        <ShieldCheck size={22} />
                     </div>
                     <div>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">{t("catalog.guaranteeLabel")}</p>
                        <p className="text-sm md:text-base lg:text-lg text-gray-900 font-black">{t("catalog.guaranteeValue")}</p>
                     </div>
                  </div>

                  {/* Secondary Decorative Badge */}
                  <div className="absolute top-4 md:top-8 right-2 md:right-4 lg:right-10 bg-white/95 backdrop-blur-xl p-3 md:p-3.5 rounded-2xl md:rounded-3xl shadow-xl border border-white flex flex-col items-center gap-1.5 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                     <div className="flex -space-x-2.5">
                        <img src="/images/products/raw_salmon_fillet.jpg" className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-white object-cover shadow-xs" alt="Salmon" />
                        <img src="/images/products/raw_chicken_breast.jpg" className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-white object-cover shadow-xs" alt="Chicken" />
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-white bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">+</div>
                     </div>
                     <p className="text-[9px] md:text-[10px] font-bold text-gray-700 uppercase tracking-widest">{t("catalog.popularItems")}</p>
                  </div>
               </div>
            </div>

            {/* Desktop Categories Filter */}
            <div className="hidden md:flex flex-wrap gap-2 items-center">
               {categories.map((cat) => (
                  <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${selectedCategory === cat ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]" : "bg-white text-gray-600 hover:bg-purple-50 border border-gray-200 hover:border-purple-200"}`}
                  >
                     {cat === "all" ? t("catalog.allCategories") : t(`categories.${cat}`) !== `categories.${cat}` ? t(`categories.${cat}`) : cat}
                  </button>
               ))}
            </div>
            <div id="catalog-products-grid" className="scroll-mt-6">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="font-extrabold text-2xl text-gray-900">{debouncedQuery ? `${t("catalog.products")} (${filteredProducts.length})` : t("catalog.popularItems")}</h2>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
               {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                     <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search size={26} />
                     </div>
                     <h3 className="font-bold text-lg text-gray-900 mb-1">{t("catalog.noResults")}</h3>
                     <p className="text-sm text-gray-500 mb-4">{t("catalog.noResultsDesc")}</p>
                     <button
                        onClick={() => {
                           setSearchQuery("");
                           setSelectedCategory("all");
                        }}
                        className="px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-xl hover:bg-primary/20 transition-colors"
                     >
                        {t("catalog.products")}
                     </button>
                  </div>
               ) : (
                  filteredProducts.map((product) => {
                     const currentWeight = itemWeights[product.id] || 0.5;
                     const isAdded = addedProductId === product.id;

                     return (
                        <div key={product.id} className="bg-white rounded-3xl p-3 shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-full">
                           {/* Product Image Area */}
                           <div className="relative w-full aspect-4/3 sm:aspect-square rounded-[20px] overflow-hidden mb-4">
                              <Link href={`/catalog/${product.id}`} className="block w-full h-full cursor-pointer">
                                 <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                              </Link>

                              {/* Badges */}
                              <div className="absolute top-3 left-3">
                                 <span className="bg-white text-gray-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm border border-gray-100">{product.category ? (t(`categories.${product.category}`) !== `categories.${product.category}` ? t(`categories.${product.category}`) : product.category) : ""}</span>
                              </div>
                           </div>

                           {/* Product Info */}
                           <div className="flex-1 flex flex-col px-1">
                              {product.origin && (
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                    <Globe size={10} /> {product.origin}
                                 </p>
                              )}

                              <Link href={`/catalog/${product.id}`} className="hover:text-primary transition-colors block mb-1">
                                 <h3 className="font-bold text-[15px] text-gray-900 leading-[1.3] line-clamp-2">{product.name}</h3>
                              </Link>

                              <p className="text-[13px] text-gray-500 line-clamp-1 mb-4">{product.description}</p>

                              <div className="mt-auto flex flex-col gap-3">
                                 <div className="flex items-baseline gap-1">
                                    <span className="font-black text-xl text-gray-900">{product.pricePerKg.toFixed(2).replace(".", ",")} €</span>
                                    <span className="text-xs text-gray-500 font-medium">/ {t("catalog.perKg").replace("/ ", "")}</span>
                                 </div>

                                 <div className="flex items-center justify-between gap-2 mt-1 pt-1">
                                    <WeightStepper weight={currentWeight} onChange={(w) => handleWeightChange(product.id, w)} />

                                    <button
                                       onClick={() => handleAddToCart(product)}
                                       className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer shrink-0 ${isAdded ? "bg-emerald-500 text-white shadow-emerald-500/25" : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"}`}
                                       title={user ? t("catalog.addToCart") : t("catalog.loginToOrder")}
                                       aria-label={user ? t("catalog.addToCart") : t("catalog.loginToOrder")}
                                    >
                                       {isAdded ? <Check size={20} className="stroke-3" /> : <ShoppingCart size={20} className="stroke-[2.5]" />}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     );
                  })
               )}
            </div>
         </main>
      </div>
   );
}
