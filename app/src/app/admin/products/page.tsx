"use client";

import { AdminProductsFilter } from "@/components/admin/AdminProductsFilter";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import { useLanguage } from "@/context/LanguageContext";
import { ALL_CATEGORIES, productService } from "@/services";
import { Product } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AdminProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  const refreshProducts = () => {
    setProducts(productService.list());
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const categories = useMemo(
    () => productService.getCategories(products),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      productService.filter(products, {
        category: selectedCategory,
        query: searchQuery,
      }),
    [products, selectedCategory, searchQuery]
  );

  const handleToggleAvailability = (product: Product) => {
    productService.toggleAvailability(product);
    refreshProducts();
  };

  const handleDelete = (id: string) => {
    if (confirm(t("admin.deleteConfirm"))) {
      productService.delete(id);
      refreshProducts();
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Header & CTA */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {t("admin.products")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("admin.productsSubtitle")}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-primary inline-flex items-center space-x-2 self-start rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-purple-700 sm:self-auto"
        >
          <Plus size={18} />
          <span>{t("admin.addProduct")}</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <AdminProductsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Products Table */}
      <AdminProductsTable
        products={filteredProducts}
        onToggleAvailability={handleToggleAvailability}
        onDelete={handleDelete}
      />
    </div>
  );
}
