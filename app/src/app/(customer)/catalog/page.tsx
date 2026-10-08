"use client";

import { CatalogNavbar } from "@/components/catalog/CatalogNavbar";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredProducts } from "@/lib/store";
import { Product } from "@/types";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 9;

export default function CatalogPage() {
   const { t } = useLanguage();
   const { user } = useAuth();
   const { addToCart, openCart, isOffline } = useCart();

   const [products, setProducts] = useState<Product[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<string>("all");
   const [searchQuery, setSearchQuery] = useState("");
   const [debouncedQuery, setDebouncedQuery] = useState("");
   const [itemWeights, setItemWeights] = useState<Record<string, number>>({});
   const [addedProductId, setAddedProductId] = useState<string | null>(null);

   // Pagination state
   const [currentPage, setCurrentPage] = useState(1);

   useEffect(() => {
      setProducts(getStoredProducts());
   }, []);

   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedQuery(searchQuery.trim().toLowerCase());
      }, 300);
      return () => clearTimeout(timer);
   }, [searchQuery]);

   // Reset to first page when filters change
   useEffect(() => {
      setCurrentPage(1);
   }, [searchQuery, selectedCategory]);

   const categories = useMemo(() => {
      return ["all", ...Array.from(new Set(products.map((p) => p.category))).filter(Boolean)];
   }, [products]);

   const filteredProducts = useMemo(() => {
      return products.filter((product) => {
         const matchesCategory = selectedCategory === "all" || product.category?.toLowerCase() === selectedCategory.toLowerCase();
         const matchesSearch = !debouncedQuery || product.name?.toLowerCase().includes(debouncedQuery) || product.description?.toLowerCase().includes(debouncedQuery) || (product.category && product.category.toLowerCase().includes(debouncedQuery));
         return matchesCategory && matchesSearch;
      });
   }, [products, selectedCategory, debouncedQuery]);

   // Calculate pagination
   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
   const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

   const handleWeightChange = (productId: string, weight: number) => {
      setItemWeights((prev) => ({ ...prev, [productId]: weight }));
   };

   const handleAddToCart = (product: Product) => {
      const weight = itemWeights[product.id] || 0.5;
      if (!user) {
         openCart();
         return;
      }
      if (addToCart(product, weight).success) {
         setAddedProductId(product.id);
         setTimeout(() => setAddedProductId((curr) => (curr === product.id ? null : curr)), 1500);
      }
   };

   return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 pb-16">
         <CatalogNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

         <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
            {/* Header Area */}
            <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                     {t("catalog.products")}
                  </h1>
                  <p className="text-muted-foreground mt-2 font-medium">{t("catalog.heroSubtitle")}</p>
               </div>
               <CatalogSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            {/* Filters */}
            <div className="hidden md:block">
               <CategoryFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {paginatedProducts.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-card text-card-foreground rounded-2xl border border-border p-8 shadow-sm">
                     <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search size={26} />
                     </div>
                     <h3 className="font-bold text-lg text-foreground mb-1">{t("catalog.noResults")}</h3>
                     <p className="text-sm text-muted-foreground mb-4">{t("catalog.noResultsDesc")}</p>
                     <button
                        onClick={() => {
                           setSearchQuery("");
                           setSelectedCategory("all");
                        }}
                        className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
                     >
                        {t("catalog.products")}
                     </button>
                  </div>
               ) : (
                  paginatedProducts.map((product) => (
                     <ProductCard
                        key={product.id}
                        product={product}
                        currentWeight={itemWeights[product.id] || 0.5}
                        isAdded={addedProductId === product.id}
                        isLoggedIn={!!user}
                        onWeightChange={handleWeightChange}
                        onAddToCart={handleAddToCart}
                        isOffline={isOffline}
                     />
                  ))
               )}
            </div>

            {/* Pagination Controls */}
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
            />
         </main>
      </div>
   );
}
