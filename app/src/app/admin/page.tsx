"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  Plus,
  AlertTriangle,
  ChevronRight,
  Eye,
} from "lucide-react";
import { getStoredOrders, getStoredProducts } from "@/lib/store";
import { Order, Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

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

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => (p.stockKg ?? 100) < 30);
  }, [products]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t("admin.totalRevenue")}
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {totalRevenue.toFixed(2).replace(".", ",")} €
            </span>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center mt-1">
              <TrendingUp size={13} className="mr-1" /> {t("admin.revenueTrend")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-primary flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t("admin.totalOrders")}
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{orders.length}</span>
            <span className="text-[11px] text-gray-500 font-medium mt-1 block">
              {t("admin.successfulOrders")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t("admin.pendingOrders")}
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
            <span className="text-[11px] text-amber-700 font-medium mt-1 block">
              Aktion erforderlich
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t("admin.activeProducts")}
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {products.filter((p) => p.isAvailable).length} / {products.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              Live im Sortiment
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-bold text-lg text-gray-900">{t("admin.recentOrders")}</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{t("admin.viewAll")}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="pb-3 font-semibold">{t("checkout.orderNumber")}</th>
                  <th className="pb-3 font-semibold">{t("admin.customerData")}</th>
                  <th className="pb-3 font-semibold">{t("orders.status")}</th>
                  <th className="pb-3 font-semibold text-right">{t("orders.total")}</th>
                  <th className="pb-3 font-semibold text-right">{t("admin.actionRequired")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400 text-xs">
                      {t("orders.empty")}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 font-bold text-gray-900">{order.id}</td>
                      <td className="py-3.5">
                        <p className="font-semibold text-gray-800 text-xs">
                          {order.customerName || order.userEmail?.split("@")[0]}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate max-w-35">
                          {order.userEmail}
                        </p>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            order.status === "delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status === "shipped"
                              ? "bg-blue-50 text-blue-700"
                              : order.status === "processing"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-purple-50 text-primary"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-black text-gray-900 text-xs">
                        {order.totalAmount.toFixed(2).replace(".", ",")} €
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-lg inline-flex items-center transition-colors"
                          title={t("orders.viewDetails")}
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Inventory Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <span>{t("admin.stockOverview")}</span>
              </h3>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.manage")}
              </Link>
            </div>

            <div className="space-y-3">
              {products.slice(0, 4).map((p) => {
                const stock = p.stockKg ?? 50;
                const isLow = stock < 30;
                return (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}`}
                    className="block p-3 bg-gray-50 hover:bg-purple-50/60 border border-transparent hover:border-purple-100 rounded-2xl text-xs space-y-1.5 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 group-hover:text-primary transition-colors truncate max-w-37.5">
                        {p.name}
                      </span>
                      <span className={`font-black ${isLow ? "text-red-600" : "text-gray-700"}`}>
                        {stock} kg
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${isLow ? "bg-red-500" : "bg-primary"}`}
                        style={{ width: `${Math.min(100, (stock / 60) * 100)}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="bg-linear-to-br from-primary to-purple-800 text-white p-6 rounded-3xl shadow-md space-y-3">
            <h4 className="font-bold text-base">{t("admin.shopPreview")}</h4>
            <p className="text-xs opacity-80 leading-relaxed">
              {t("admin.shopPreviewDesc")}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors shadow-sm"
            >
              <span>{t("admin.openCustomerView")}</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
