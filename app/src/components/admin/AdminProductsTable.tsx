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
                  {products.length === 0 ? (
                     <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                           {t("catalog.noResults")}
                        </td>
                     </tr>
                  ) : (
                     products.map((p) => (
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
                                 onClick={() => onToggleAvailability(p)}
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
                                    onClick={() => onDelete(p.id)}
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
   );
}
