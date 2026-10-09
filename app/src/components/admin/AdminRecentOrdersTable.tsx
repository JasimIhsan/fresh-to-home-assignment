"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Order } from "@/types";
import { ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";

export interface AdminRecentOrdersTableProps {
   orders: Order[];
}

export function AdminRecentOrdersTable({ orders }: AdminRecentOrdersTableProps) {
   const { t } = useLanguage();

   return (
      <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
         <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-bold text-lg text-gray-900">{t("admin.recentOrders")}</h2>
            <Link
               href="/admin/orders"
               className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
               <span>{t("admin.viewAll")}</span>
               <ArrowUpRight size={14} />
            </Link>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                     <th className="pb-3 font-semibold">{t("checkout.orderNumber")}</th>
                     <th className="pb-3 font-semibold">{t("admin.customerData")}</th>
                     <th className="pb-3 font-semibold">{t("orders.status")}</th>
                     <th className="pb-3 font-semibold text-right">{t("orders.total")}</th>
                     <th className="pb-3 font-semibold text-right">{t("admin.actionRequired")}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {orders.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-400 text-xs">
                           {t("orders.empty")}
                        </td>
                     </tr>
                  ) : (
                     orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                           <td className="py-3.5 font-bold text-gray-900">{order.id}</td>
                           <td className="py-3.5">
                              <p className="font-semibold text-gray-800 text-xs">
                                 {order.customerName || order.userEmail?.split("@")[0]}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate max-w-35">
                                 {order.userEmail}
                              </p>
                           </td>
                           <td className="py-3.5">
                              <span
                                 className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                    order.status === "delivered"
                                       ? "bg-emerald-50 text-emerald-700"
                                       : order.status === "shipped"
                                       ? "bg-blue-50 text-blue-700"
                                       : order.status === "processing"
                                       ? "bg-amber-50 text-amber-700"
                                       : "bg-purple-50 text-primary"
                                 }`}
                              >
                                 {order.status}
                              </span>
                           </td>
                           <td className="py-3.5 text-right font-black text-gray-900 text-xs">
                              {order.totalAmount.toFixed(2).replace(".", ",")} €
                           </td>
                           <td className="py-3.5 text-right">
                              <Link
                                 href={`/admin/orders/${order.id}`}
                                 className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-lg inline-flex items-center transition-colors"
                                 title={t("orders.viewDetails")}
                              >
                                 <Eye size={16} />
                              </Link>
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
