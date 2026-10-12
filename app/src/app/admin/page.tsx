"use client";

import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { AdminRecentOrdersTable } from "@/components/admin/AdminRecentOrdersTable";
import { AdminStockAlertsCard } from "@/components/admin/AdminStockAlertsCard";
import { useLanguage } from "@/context/LanguageContext";
import { orderService, productService } from "@/services";
import { Order, Product } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setOrders(orderService.list());
    setProducts(productService.list());
  }, []);

  const {
    totalRevenue,
    openOrderCount: pendingCount,
    recentOrders,
  } = useMemo(() => orderService.getDashboardStats(orders), [orders]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {t("admin.dashboard")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t("admin.subtitle")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="bg-primary inline-flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-purple-700"
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <AdminRecentOrdersTable orders={recentOrders} />
        <AdminStockAlertsCard products={products} />
      </div>
    </div>
  );
}
