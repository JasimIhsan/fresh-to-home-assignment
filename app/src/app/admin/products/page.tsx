"use client";

import { AdminProductsFilter } from "@/components/admin/AdminProductsFilter";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import { useLanguage } from "@/context/LanguageContext";
import { deleteProduct, getStoredProducts, saveProduct } from "@/lib/store";
import { Product } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AdminProductsPage() {
   const { t } = useLanguage();
   const [products, setProducts] = useState<Product[]>([]);
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");

   const refreshProducts = () => {
      setProducts(getStoredProducts());
   };

   useEffect(() => {
      refreshProducts();
   }, []);

   const categories = useMemo(() => {
      const cats = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
      return ["all", ...cats];
   }, [products]);

   const filteredProducts = useMemo(() => {
      return products.filter((p) => {
         const matchCat = selectedCategory === "all" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
         const matchQuery =
            !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
         return matchCat && matchQuery;
      });
   }, [products, selectedCategory, searchQuery]);

   const handleToggleAvailability = (product: Product) => {
      const updated = { ...product, isAvailable: !product.isAvailable };
      saveProduct(updated);
      refreshProducts();
   };

   const handleDelete = (id: string) => {
      if (confirm(t("admin.deleteConfirm"))) {
         deleteProduct(id);
         refreshProducts();
      }
   };

   return (
      <div className="space-y-6 max-w-6xl mx-auto">
         {/* Top Header & CTA */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{t("admin.products")}</h1>
               <p className="text-gray-500 text-sm mt-1">{t("admin.productsSubtitle")}</p>
            </div>

            <Link
               href="/admin/products/new"
               className="inline-flex items-center space-x-2 bg-primary hover:bg-purple-700 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
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
