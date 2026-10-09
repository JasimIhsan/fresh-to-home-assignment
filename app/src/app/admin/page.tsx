"use client";

import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { AdminRecentOrdersTable } from "@/components/admin/AdminRecentOrdersTable";
import { AdminStockAlertsCard } from "@/components/admin/AdminStockAlertsCard";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredOrders, getStoredProducts } from "@/lib/store";
import { Order, Product } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AdminDashboardPage() {
   const { t } = useLanguage();
   const [orders, setOrders] = useState<Order[]>([]);
   const [products, setProducts] = useState<Product[]>([]);

   useEffect(() => {
      setOrders(getStoredOrders());
      setProducts(getStoredProducts());
   }, []);

   const totalRevenue = useMemo(() => {
      return orders
         .filter((o) => o.status !== "cancelled")
         .reduce((sum, o) => sum + o.totalAmount, 0);
   }, [orders]);

   const pendingCount = useMemo(() => {
      return orders.filter((o) => o.status === "pending" || o.status === "processing").length;
   }, [orders]);

   const recentOrders = useMemo(() => {
      return orders.slice(0, 5);
   }, [orders]);

   return (
      <div className="space-y-8 max-w-6xl mx-auto">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {t("admin.dashboard")}
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                  {t("admin.subtitle")}
               </p>
            </div>

            <div className="flex items-center gap-3">
               <Link
                  href="/admin/products/new"
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all"
               >
                  <Plus size={18} />
                  <span>{t("admin.addProduct")}</span>
               </Link>
            </div>
         </div>

         {/* KPI Stats Grid */}
         <AdminKpiGrid
            totalRevenue={totalRevenue}
            totalOrdersCount={orders.length}
            pendingCount={pendingCount}
            activeProductsCount={products.filter((p) => p.isAvailable).length}
            totalProductsCount={products.length}
         />

         {/* Main Grid: Recent Orders & Stock Alerts */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <AdminRecentOrdersTable orders={recentOrders} />
            <AdminStockAlertsCard products={products} />
         </div>
      </div>
   );
}
