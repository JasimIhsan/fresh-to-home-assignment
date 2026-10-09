"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrderDeliveryInfoCard } from "@/components/orders/OrderDeliveryInfoCard";
import { OrderItemList } from "@/components/orders/OrderItemList";
import { OrderTrackingProgress } from "@/components/orders/OrderTrackingProgress";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderById } from "@/lib/store";
import { Order } from "@/types";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = getOrderById(id);
    if (found) {
      setOrder(found);
    }
    setLoading(false);
  }, [id]);

  return (
    <AuthGuard requireAuth>
      <div className="bg-background min-h-screen pb-20">
        <header className="bg-primary sticky top-0 z-40 rounded-b-3xl px-4 py-3.5 text-white shadow-lg md:static md:rounded-none md:bg-transparent md:px-8 md:pt-8 md:pb-6 md:text-gray-900 md:shadow-none">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/orders"
              className="z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white/15 transition-all hover:bg-white/25 active:scale-95 md:border md:border-gray-200 md:bg-transparent md:text-gray-700 md:hover:bg-gray-100"
              aria-label={t("orderDetail.backToOrders")}
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <div className="mx-2 flex-1 text-center md:mx-0 md:ml-4 md:flex-initial md:text-left">
              <h1 className="flex items-center justify-center gap-1.5 truncate text-base font-extrabold md:justify-start md:text-3xl">
                <span>{t("orderDetail.title")}</span>
                <span className="text-xs font-medium text-white/80 md:text-lg md:text-gray-400">
                  #{id}
                </span>
              </h1>
            </div>
            <div
              className="pointer-events-none w-10 shrink-0 md:hidden"
              aria-hidden="true"
            />
          </div>
        </header>

        <main className="mx-auto mt-2 max-w-6xl p-4 md:mt-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-gray-100 bg-white p-12 shadow-xs">
              <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          ) : !order ? (
            <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-xs">
              <AlertCircle size={48} className="mx-auto text-gray-400" />
              <h2 className="text-xl font-bold text-gray-800">
                {t("orderDetail.orderNotFound")}
              </h2>
              <Link
                href="/orders"
                className="bg-primary inline-block rounded-2xl px-6 py-3 text-sm font-bold text-white"
              >
                {t("orderDetail.backToOrders")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <OrderTrackingProgress
                  status={order.status}
                  createdAt={order.createdAt}
                />
                <OrderItemList
                  items={order.items}
                  totalAmount={order.totalAmount}
                />
              </div>

              <div className="space-y-6 lg:col-span-1">
                <OrderDeliveryInfoCard order={order} />
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
