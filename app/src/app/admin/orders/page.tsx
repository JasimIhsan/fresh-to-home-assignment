"use client";

import { AdminOrdersFilter } from "@/components/admin/AdminOrdersFilter";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { useLanguage } from "@/context/LanguageContext";
import { ALL_STATUSES, orderService } from "@/services";
import { Order, OrderStatus } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(ALL_STATUSES);

  const refreshOrders = () => {
    setOrders(orderService.list());
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const filteredOrders = useMemo(
    () =>
      orderService.filter(orders, {
        status: selectedStatus,
        query: searchQuery,
      }),
    [orders, selectedStatus, searchQuery]
  );

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    orderService.updateStatus(orderId, status);
    refreshOrders();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {t("admin.orders")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("admin.ordersSubtitle")}
          </p>
        </div>

        <span className="self-start rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-xs sm:self-auto">
          {t("admin.totalOrders")}: {orders.length}
        </span>
      </div>

      {/* Filters & Search */}
      <AdminOrdersFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Orders Table */}
      <AdminOrdersTable
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
