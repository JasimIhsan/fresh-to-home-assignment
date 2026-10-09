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
         const matchStatus = selectedStatus === "all" || o.status === selectedStatus;
         const matchQuery =
            !searchQuery ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (o.userEmail && o.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (o.address && o.address.toLowerCase().includes(searchQuery.toLowerCase()));
         return matchStatus && matchQuery;
      });
   }, [orders, selectedStatus, searchQuery]);

   const handleStatusChange = (orderId: string, status: OrderStatus) => {
      updateOrderStatus(orderId, status);
      refreshOrders();
   };

   return (
      <div className="space-y-6 max-w-6xl mx-auto">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{t("admin.orders")}</h1>
               <p className="text-gray-500 text-sm mt-1">{t("admin.ordersSubtitle")}</p>
            </div>

            <span className="self-start sm:self-auto px-4 py-2 bg-white rounded-2xl text-xs font-bold text-gray-700 border border-gray-200 shadow-xs">
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
