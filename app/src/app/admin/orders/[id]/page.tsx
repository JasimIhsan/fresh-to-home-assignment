"use client";

import { AdminOrderCustomerDetails } from "@/components/admin/AdminOrderCustomerDetails";
import { AdminOrderItemsView } from "@/components/admin/AdminOrderItemsView";
import { AdminOrderStatusActions } from "@/components/admin/AdminOrderStatusActions";
import { useLanguage } from "@/context/LanguageContext";
import { orderService } from "@/services";
import { Order, OrderStatus } from "@/types";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const found = orderService.getById(id);
    if (found) {
      setOrder(found);
    }
    setLoading(false);
  }, [id]);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    const updated = orderService.updateStatus(order.id, newStatus);
    if (updated) {
      setOrder({ ...updated });
      setFeedback(`${t("admin.statusUpdated")} "${newStatus.toUpperCase()}".`);
      setTimeout(() => setFeedback(null), 3000);
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-3xl border border-gray-100 bg-white p-12 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400" />
        <h2 className="text-xl font-bold text-gray-800">
          {t("orderDetail.orderNotFound")}
        </h2>
        <Link
          href="/admin/orders"
          className="bg-primary inline-block rounded-xl px-6 py-3 text-sm font-bold text-white"
        >
          {t("orderDetail.backToOrders")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/orders"
            className="cursor-pointer rounded-xl border border-gray-100 bg-white p-2 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              {t("orderDetail.title")} {order.id}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {t("orderDetail.placedOn")}{" "}
              {new Date(order.createdAt).toLocaleDateString()}{" "}
              {t("orderDetail.atTime")}{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="animate-in fade-in flex items-center space-x-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Status Management Bar */}
      <AdminOrderStatusActions
        currentStatus={order.status}
        updating={updating}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Customer and Delivery Details */}
      <AdminOrderCustomerDetails order={order} />

      {/* Ordered Items Table */}
      <AdminOrderItemsView
        items={order.items}
        totalAmount={order.totalAmount}
      />

      {order.notes && (
        <div className="text-primary rounded-2xl bg-purple-50 p-4 text-xs">
          <span className="mb-1 block font-bold">
            {t("admin.customerNotes")}
          </span>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  );
}
