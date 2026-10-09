"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { CheckCircle2, Edit2, Eye, Tag, Trash2, XCircle } from "lucide-react";
import Link from "next/link";

export interface AdminProductsTableProps {
  products: Product[];
  onToggleAvailability: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function AdminProductsTable({
  products,
  onToggleAvailability,
  onDelete,
}: AdminProductsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-gray-400 uppercase">
              <th className="px-6 py-3.5 font-semibold">
                {t("admin.productName")}
              </th>
              <th className="px-4 py-3.5 font-semibold">
                {t("admin.category")}
              </th>
              <th className="px-4 py-3.5 font-semibold">
                {t("admin.pricePerKg")}
              </th>
              <th className="px-4 py-3.5 font-semibold">
                {t("admin.stockKg")}
              </th>
              <th className="px-4 py-3.5 font-semibold">
                {t("orders.status")}
              </th>
              <th className="px-6 py-3.5 text-right font-semibold">
                {t("admin.actionRequired")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  {t("catalog.noResults")}
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="group flex cursor-pointer items-center space-x-3.5"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="group-hover:ring-primary/20 h-12 w-12 shrink-0 rounded-xl bg-gray-100 object-cover transition-all group-hover:ring-2"
                      />
                      <div>
                        <p className="group-hover:text-primary font-bold text-gray-900 transition-colors">
                          {p.name}
                        </p>
                        <p className="max-w-xs truncate text-xs text-gray-400">
                          {p.description}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      <Tag size={12} />
                      <span>
                        {p.category
                          ? t(`categories.${p.category}`) !==
                            `categories.${p.category}`
                            ? t(`categories.${p.category}`)
                            : p.category
                          : ""}
                      </span>
                    </span>
                  </td>

                  <td className="px-4 py-4 font-black text-gray-900">
                    {p.pricePerKg.toFixed(2).replace(".", ",")} €
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-bold ${
                        (p.stockKg ?? 0) < 30 ? "text-red-600" : "text-gray-700"
                      }`}
                    >
                      {p.stockKg ?? 50} kg
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => onToggleAvailability(p)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                        p.isAvailable
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {p.isAvailable ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      <span>
                        {p.isAvailable
                          ? t("admin.active")
                          : t("admin.inactive")}
                      </span>
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="hover:text-primary rounded-xl p-2 text-gray-400 transition-colors hover:bg-purple-50"
                        title={t("admin.productDetails")}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="hover:text-primary rounded-xl p-2 text-gray-400 transition-colors hover:bg-purple-50"
                        title={t("admin.editProduct")}
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="cursor-pointer rounded-xl p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
  );
}
