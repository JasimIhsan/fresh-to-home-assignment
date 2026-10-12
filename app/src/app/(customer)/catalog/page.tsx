"use client";

import { CatalogNavbar } from "@/components/catalog/CatalogNavbar";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ALL_CATEGORIES, productService } from "@/services";
import { Product } from "@/types";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 9;

export default function CatalogPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToCart, openCart, isOffline } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [itemWeights, setItemWeights] = useState<Record<string, number>>({});
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setProducts(productService.list());
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

  const categories = useMemo(
    () => productService.getCategories(products),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      productService.filter(products, {
        category: selectedCategory,
        query: debouncedQuery,
      }),
    [products, selectedCategory, debouncedQuery]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
      setTimeout(
        () => setAddedProductId((curr) => (curr === product.id ? null : curr)),
        1500
      );
    }
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary/20 flex min-h-screen flex-col pb-16 font-sans">
      <CatalogNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Header Area */}
        <div className="hidden flex-col justify-between gap-6 md:flex md:flex-row md:items-end">
          <div>
            <h1 className="text-foreground text-3xl font-extrabold tracking-tight md:text-4xl">
              {t("catalog.products")}
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              {t("catalog.heroSubtitle")}
            </p>
          </div>
          <CatalogSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Filters */}
        <div className="hidden md:block">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProducts.length === 0 ? (
            <div className="bg-card text-card-foreground border-border col-span-full rounded-2xl border p-8 py-16 text-center shadow-sm">
              <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full">
                <Search size={26} />
              </div>
              <h3 className="text-foreground mb-1 text-lg font-bold">
                {t("catalog.noResults")}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {t("catalog.noResultsDesc")}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(ALL_CATEGORIES);
                }}
                className="bg-primary hover:bg-primary/90 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all"
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
