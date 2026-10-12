"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Truck,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { formatEuro, formatKg, formatOrderDate } from "./format";

export interface OrderStatusBadgeConfig {
  label: string;
  bg: string;
  icon: React.ReactNode;
}

export function useOrderStatusBadge() {
  const { t } = useLanguage();

  return (status: OrderStatus): OrderStatusBadgeConfig => {
    switch (status) {
      case "delivered":
        return {
          label: t("orders.statusDelivered"),
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 size={13} />,
        };
      case "shipped":
        return {
          label: t("orders.statusShipped"),
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Truck size={13} />,
        };
      case "processing":
        return {
          label: t("orders.statusProcessing"),
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock size={13} />,
        };
      case "cancelled":
        return {
          label: t("orders.statusCancelled"),
          bg: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertCircle size={13} />,
        };
      default:
        return {
          label: t("orders.statusPending"),
          bg: "bg-purple-50 text-primary border-purple-200",
          icon: <Clock size={13} />,
        };
    }
  };
}

export interface CustomerOrderCardProps {
  readonly order: Order;
}

export function CustomerOrderCard({ order }: CustomerOrderCardProps) {
  const { t } = useLanguage();
  const getBadge = useOrderStatusBadge();
  const badge = getBadge(order.status);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between border-b border-gray-100 pb-3">
        <div>
          <span className="text-base font-bold text-gray-900">{order.id}</span>
          <p className="mt-0.5 text-xs text-gray-500">
            {formatOrderDate(order.createdAt, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
            badge.bg
          )}
        >
          {badge.icon}
          <span>{badge.label}</span>
        </span>
      </div>

      <div className="mb-4 flex-1 space-y-1.5 text-sm">
        {order.items.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between text-gray-700"
          >
            <span className="max-w-40 truncate sm:max-w-60">
              {item.product.name} ({formatKg(item.weightKg)} kg)
            </span>
            <span className="font-medium whitespace-nowrap">
              {formatEuro(item.weightKg * item.product.pricePerKg)} €
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
        <div>
          <span className="block text-xs font-medium text-gray-500">
            {t("orders.total")}
          </span>
          <span className="text-primary text-lg font-black">
            {formatEuro(order.totalAmount)} €
          </span>
        </div>

        <Link
          href={`/orders/${order.id}`}
          className="bg-primary-light text-primary hover:bg-primary inline-flex items-center space-x-1 rounded-xl px-4 py-2 text-xs font-bold transition-colors hover:text-white"
        >
          <span>{t("orders.viewDetails")}</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
