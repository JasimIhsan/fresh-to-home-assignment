"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/index";

export interface AdminOrderStatusActionsProps {
  readonly currentStatus: OrderStatus;
  readonly updating: boolean;
  readonly onUpdateStatus: (newStatus: OrderStatus) => void;
}

export function AdminOrderStatusActions({
  currentStatus,
  updating,
  onUpdateStatus,
}: AdminOrderStatusActionsProps) {
  const { t } = useLanguage();

  const statusOptions: { status: OrderStatus; label: string; bg: string }[] = [
    {
      status: "pending",
      label: t("orders.statusPending"),
      bg: "hover:border-purple-300",
    },
    {
      status: "processing",
      label: t("orders.statusProcessing"),
      bg: "hover:border-amber-300",
    },
    {
      status: "shipped",
      label: t("orders.statusShipped"),
      bg: "hover:border-blue-300",
    },
    {
      status: "delivered",
      label: t("orders.statusDelivered"),
      bg: "hover:border-emerald-300",
    },
    {
      status: "cancelled",
      label: t("orders.statusCancelled"),
      bg: "hover:border-red-300",
    },
  ];

  return (
    <div className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <span className="block text-xs font-bold tracking-wider text-gray-400 uppercase">
        {t("admin.updateStatus")}
      </span>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {statusOptions.map((item) => (
          <button
            key={item.status}
            type="button"
            disabled={updating}
            onClick={() => onUpdateStatus(item.status)}
            aria-pressed={currentStatus === item.status}
            className={cn(
              "cursor-pointer rounded-2xl border-2 p-3 text-xs font-bold transition-all disabled:cursor-wait disabled:opacity-70",
              currentStatus === item.status
                ? "bg-primary border-primary shadow-primary/20 scale-[1.02] text-white shadow-md"
                : "border-gray-200 bg-gray-50 text-gray-700",
              currentStatus !== item.status && item.bg
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
