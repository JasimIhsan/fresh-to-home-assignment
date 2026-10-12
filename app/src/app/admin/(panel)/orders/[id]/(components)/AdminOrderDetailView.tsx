"use client";

import { updateOrderStatus } from "@/app/actions/order.actions";
import { AdminOrderCustomerDetails } from "./AdminOrderCustomerDetails";
import { AdminOrderItemsView } from "./AdminOrderItemsView";
import { AdminOrderStatusActions } from "./AdminOrderStatusActions";
import { useLanguage } from "@/context/LanguageContext";
import type { Order, OrderStatus } from "@/types";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";

const FEEDBACK_MS = 3000;

interface Feedback {
  readonly kind: "success" | "error";
  readonly message: string;
}

export function AdminOrderDetailView({
  order,
}: Readonly<{ order: Readonly<Order> }>) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setOptimisticStatus] = useOptimistic(order.status);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      const result = await updateOrderStatus(order.id, newStatus);
      if (!result.success) {
        setFeedback({ kind: "error", message: result.error });
        return;
      }
      setFeedback({
        kind: "success",
        message: `${t("admin.statusUpdated")} "${newStatus.toUpperCase()}".`,
      });
      router.refresh();
    });
  };

  // Fixed time zone keeps the server render and hydration identical.
  const locale = language === "en" ? "en-GB" : "de-DE";
  const createdAt = new Date(order.createdAt);
  const placedDate = createdAt.toLocaleDateString(locale, {
    timeZone: "Europe/Berlin",
  });
  const placedTime = createdAt.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });

  return (
    <div className="w-full space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/orders"
            aria-label={t("orderDetail.backToOrders")}
            className="cursor-pointer rounded-xl border border-gray-100 bg-white p-2 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              {t("orderDetail.title")} {order.id}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {t("orderDetail.placedOn")} {placedDate} {t("orderDetail.atTime")}{" "}
              {placedTime}
            </p>
          </div>
        </div>
      </div>

      {feedback?.kind === "success" && (
        <div
          role="status"
          className="animate-in fade-in flex items-center space-x-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800"
        >
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedback.message}</span>
        </div>
      )}
      {feedback?.kind === "error" && (
        <div
          role="alert"
          className="animate-in fade-in flex items-center space-x-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-800"
        >
          <AlertCircle size={16} className="text-red-600" />
          <span>{feedback.message}</span>
        </div>
      )}

      <AdminOrderStatusActions
        currentStatus={status}
        updating={isPending}
        onUpdateStatus={handleUpdateStatus}
      />

      <AdminOrderCustomerDetails order={order} />

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
