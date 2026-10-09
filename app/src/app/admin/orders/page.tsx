"use client";

import { AdminOrdersFilter } from "@/components/admin/AdminOrdersFilter";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredOrders, updateOrderStatus } from "@/lib/store";
import { Order, OrderStatus } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus =
        selectedStatus === "all" || o.status === selectedStatus;
      const matchQuery =
        !searchQuery ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerName &&
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.userEmail &&
          o.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.address &&
          o.address.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchQuery;
    });
  }, [orders, selectedStatus, searchQuery]);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
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
