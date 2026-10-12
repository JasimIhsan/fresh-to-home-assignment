"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CustomerOrderCard } from "@/components/orders/CustomerOrderCard";
import { CustomerOrdersEmpty } from "@/components/orders/CustomerOrdersEmpty";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ALL_STATUSES, orderService } from "@/services";
import { Order } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(ALL_STATUSES);

  useEffect(() => {
    if (user) {
      setOrders(orderService.listForCustomer(user.id));
    }
  }, [user]);

  const filteredOrders = useMemo(
    () => orderService.filter(orders, { status: selectedStatus }),
    [orders, selectedStatus]
  );

  return (
    <AuthGuard requireAuth>
      <div className="bg-background min-h-screen pb-20">
        <header className="bg-primary sticky top-0 z-40 rounded-b-3xl p-6 text-white shadow-lg md:static md:rounded-none md:bg-transparent md:px-8 md:pt-8 md:pb-4 md:text-gray-900 md:shadow-none">
          <div className="mx-auto flex max-w-6xl items-center justify-center md:justify-start">
            <h1 className="text-center text-xl font-extrabold md:text-left md:text-3xl">
              {t("orders.title")}
            </h1>
          </div>

          {/* Status Filters */}
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto pt-4 pb-1 md:pt-6">
            {["all", "pending", "processing", "shipped", "delivered"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all md:py-2 md:text-sm ${
                    selectedStatus === status
                      ? "text-primary bg-white shadow-sm md:bg-gray-900 md:text-white"
                      : "bg-white/15 text-white hover:bg-white/25 md:border md:border-gray-200 md:bg-white md:text-gray-600 md:hover:bg-gray-50"
                  }`}
                >
                  {status === "all"
                    ? "Alle"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </header>

        <main className="mx-auto mt-2 max-w-6xl p-4 sm:p-6 md:mt-4 md:p-8">
          {filteredOrders.length === 0 ? (
            <CustomerOrdersEmpty />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {filteredOrders.map((order) => (
                <CustomerOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
