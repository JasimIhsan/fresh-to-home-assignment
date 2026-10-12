"use client";

import { updateOrderStatus } from "@/app/actions/order.actions";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import { Eye, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

export interface AdminOrdersTableProps {
  readonly orders: readonly Order[];
}

const STATUS_SELECT: Readonly<Record<OrderStatus, string>> = {
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  shipped: "border-blue-200 bg-blue-50 text-blue-800",
  processing: "border-amber-200 bg-amber-50 text-amber-800",
  cancelled: "border-red-200 bg-red-50 text-red-800",
  pending: "text-primary border-purple-200 bg-purple-50",
};

const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

/** Fixed locale/time zone so server and client render the same string. */
const DATE_FORMAT = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "short",
  timeZone: "Europe/Berlin",
});

function formatOrderDate(iso: string): string {
  return DATE_FORMAT.format(new Date(iso));
}

function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic<
    ReadonlyMap<string, OrderStatus>,
    { readonly id: string; readonly status: OrderStatus }
  >(new Map(), (current, { id, status }) => new Map(current).set(id, status));

  const handleStatusChange = (orderId: string, value: string) => {
    if (!isOrderStatus(value)) return;
    setError(null);
    startTransition(async () => {
      setOptimisticStatus({ id: orderId, status: value });
      const result = await updateOrderStatus(orderId, value);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
      {error && (
        <p
          role="alert"
          className="border-b border-red-100 bg-red-50 px-6 py-3 text-xs font-semibold text-red-700"
        >
          {error}
        </p>
      )}
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
              orders.map((order) => {
                const status = optimisticStatus.get(order.id) ?? order.status;
                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-gray-50/70"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div>{order.id}</div>
                      <span className="text-[11px] font-normal text-gray-400">
                        {formatOrderDate(order.createdAt)}
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
                        value={status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        aria-label={t("orders.status")}
                        className={cn(
                          "cursor-pointer rounded-xl border px-2.5 py-1.5 text-xs font-bold outline-hidden transition-colors",
                          STATUS_SELECT[status]
                        )}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
