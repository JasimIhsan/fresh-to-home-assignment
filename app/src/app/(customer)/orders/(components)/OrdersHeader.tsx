"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ORDER_FILTER_STATUSES, type OrderFilterStatus } from "./order-filter";

const STATUS_LABEL_KEYS: Readonly<Record<OrderFilterStatus, string>> = {
  all: "orders.all",
  pending: "orders.statusPending",
  processing: "orders.statusProcessing",
  shipped: "orders.statusShipped",
  delivered: "orders.statusDelivered",
};

interface OrdersHeaderProps {
  readonly activeStatus: OrderFilterStatus;
}

export function OrdersHeader({ activeStatus }: OrdersHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="bg-primary sticky top-0 z-40 rounded-b-3xl p-6 text-white shadow-lg md:static md:rounded-none md:bg-transparent md:px-8 md:pt-8 md:pb-4 md:text-gray-900 md:shadow-none">
      <div className="mx-auto flex max-w-6xl items-center justify-center md:justify-start">
        <h1 className="text-center text-xl font-extrabold md:text-left md:text-3xl">
          {t("orders.title")}
        </h1>
      </div>

      {/* Status filters live in the URL so the server filters the list */}
      <nav
        aria-label={t("orders.status")}
        className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto pt-4 pb-1 md:pt-6"
      >
        {ORDER_FILTER_STATUSES.map((status) => (
          <Link
            key={status}
            href={status === "all" ? "/orders" : `/orders?status=${status}`}
            scroll={false}
            aria-current={activeStatus === status ? "page" : undefined}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all md:py-2 md:text-sm",
              activeStatus === status
                ? "text-primary bg-white shadow-sm md:bg-gray-900 md:text-white"
                : "bg-white/15 text-white hover:bg-white/25 md:border md:border-gray-200 md:bg-white md:text-gray-600 md:hover:bg-gray-50"
            )}
          >
            {t(STATUS_LABEL_KEYS[status])}
          </Link>
        ))}
      </nav>
    </header>
  );
}
