"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Order } from "@/types";
import { ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";

export interface AdminRecentOrdersTableProps {
  orders: Order[];
}

export function AdminRecentOrdersTable({
  orders,
}: AdminRecentOrdersTableProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs lg:col-span-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">
          {t("admin.recentOrders")}
        </h2>
        <Link
          href="/admin/orders"
          className="text-primary flex items-center gap-1 text-xs font-bold hover:underline"
        >
          <span>{t("admin.viewAll")}</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
              <th className="pb-3 font-semibold">
                {t("checkout.orderNumber")}
              </th>
              <th className="pb-3 font-semibold">{t("admin.customerData")}</th>
              <th className="pb-3 font-semibold">{t("orders.status")}</th>
              <th className="pb-3 text-right font-semibold">
                {t("orders.total")}
              </th>
              <th className="pb-3 text-right font-semibold">
                {t("admin.actionRequired")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-xs text-gray-400"
                >
                  {t("orders.empty")}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="py-3.5 font-bold text-gray-900">{order.id}</td>
                  <td className="py-3.5">
                    <p className="text-xs font-semibold text-gray-800">
                      {order.customerName || order.userEmail?.split("@")[0]}
                    </p>
                    <p className="max-w-35 truncate text-[11px] text-gray-400">
                      {order.userEmail}
                    </p>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase ${
                        order.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "shipped"
                            ? "bg-blue-50 text-blue-700"
                            : order.status === "processing"
                              ? "bg-amber-50 text-amber-700"
                              : "text-primary bg-purple-50"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-xs font-black text-gray-900">
                    {order.totalAmount.toFixed(2).replace(".", ",")} €
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-200"
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
