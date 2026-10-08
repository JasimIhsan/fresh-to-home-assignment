"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  Eye,
} from "lucide-react";
import { getStoredProducts, deleteProduct, saveProduct } from "@/lib/store";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t("admin.products")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t("admin.productsSubtitle")}
          </p>
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
                selectedCategory === cat
                  ? "bg-primary text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat === "all" ? t("catalog.allCategories") : (t(`categories.${cat}`) !== `categories.${cat}` ? t(`categories.${cat}`) : cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                <th className="py-3.5 px-6 font-semibold">{t("admin.productName")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("admin.category")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("admin.pricePerKg")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("admin.stockKg")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("orders.status")}</th>
                <th className="py-3.5 px-6 font-semibold text-right">{t("admin.actionRequired")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    {t("catalog.noResults")}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="flex items-center space-x-3.5 group cursor-pointer"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100 group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                        />
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>
                        </div>
                      </Link>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <Tag size={12} />
                        <span>{p.category ? (t(`categories.${p.category}`) !== `categories.${p.category}` ? t(`categories.${p.category}`) : p.category) : ""}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-black text-gray-900">
                      {p.pricePerKg.toFixed(2).replace(".", ",")} €
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`font-bold text-xs ${
                          (p.stockKg ?? 0) < 30 ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        {p.stockKg ?? 50} kg
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleAvailability(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          p.isAvailable
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {p.isAvailable ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        <span>{p.isAvailable ? t("admin.active") : t("admin.inactive")}</span>
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-purple-50 rounded-xl transition-colors"
                          title={t("admin.productDetails")}
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-purple-50 rounded-xl transition-colors"
                          title={t("admin.editProduct")}
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title={t("admin.deleteProduct")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
