"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Order, OrderStatus } from "@/types";
import { Eye, Phone } from "lucide-react";
import Link from "next/link";

export interface AdminOrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export function AdminOrdersTable({
  orders,
  onStatusChange,
}: AdminOrdersTableProps) {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-gray-400 uppercase">
              <th className="px-6 py-3.5 font-semibold">
                {t("checkout.orderNumber")}
              </th>
              <th className="px-4 py-3.5 font-semibold">
                {t("admin.customerData")}
              </th>
              <th className="px-4 py-3.5 font-semibold">
                {t("orderDetail.timeSlot")}
              </th>
              <th className="px-4 py-3.5 font-semibold">{t("cart.items")}</th>
              <th className="px-4 py-3.5 font-semibold">{t("orders.total")}</th>
              <th className="px-4 py-3.5 font-semibold">
                {t("orders.status")}
              </th>
              <th className="px-6 py-3.5 text-right font-semibold">
                {t("admin.actionRequired")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-gray-400"
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
                  <td className="px-6 py-4 font-bold text-gray-900">
                    <div>{order.id}</div>
                    <span className="text-[11px] font-normal text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-xs font-bold text-gray-900">
                      {order.customerName || order.userEmail?.split("@")[0]}
                    </p>
                    <p className="max-w-45 truncate text-[11px] text-gray-500">
                      {order.address}
                    </p>
                    {order.phone && (
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-400">
                        <Phone size={10} /> {order.phone}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4 text-xs font-medium text-gray-700">
                    <span className="inline-block rounded-lg bg-gray-100 px-2 py-1 whitespace-nowrap">
                      {order.deliverySlot || "Standard"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-xs text-gray-600">
                    <span className="font-semibold">
                      {order.items?.length || 0} {t("cart.items")}
                    </span>
                    <p className="max-w-35 truncate text-[11px] text-gray-400">
                      {order.items?.map((i) => i.product.name).join(", ")}
                    </p>
                  </td>

                  <td className="px-4 py-4 font-black text-gray-900">
                    {order.totalAmount.toFixed(2).replace(".", ",")} €
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`cursor-pointer rounded-xl border px-2.5 py-1.5 text-xs font-bold outline-hidden transition-colors ${
                        order.status === "delivered"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : order.status === "shipped"
                            ? "border-blue-200 bg-blue-50 text-blue-800"
                            : order.status === "processing"
                              ? "border-amber-200 bg-amber-50 text-amber-800"
                              : order.status === "cancelled"
                                ? "border-red-200 bg-red-50 text-red-800"
                                : "text-primary border-purple-200 bg-purple-50"
                      }`}
                    >
                      <option value="pending">
                        {t("orders.statusPending")}
                      </option>
                      <option value="processing">
                        {t("orders.statusProcessing")}
                      </option>
                      <option value="shipped">
                        {t("orders.statusShipped")}
                      </option>
                      <option value="delivered">
                        {t("orders.statusDelivered")}
                      </option>
                      <option value="cancelled">
                        {t("orders.statusCancelled")}
                      </option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-primary inline-flex items-center rounded-xl p-2 text-gray-400 transition-colors hover:bg-purple-50"
                      title={t("orders.viewDetails")}
                    >
                      <Eye size={18} />
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
