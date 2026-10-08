"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle2, Truck, ChevronRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredOrders } from "@/lib/store";
import { Order, OrderStatus } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function OrdersPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    if (user) {
      setOrders(getStoredOrders(user.uid));
    }
  }, [user]);

  const filteredOrders = useMemo(() => {
    if (selectedStatus === "all") return orders;
    return orders.filter((o) => o.status === selectedStatus);
  }, [orders, selectedStatus]);

  const getStatusBadge = (status: OrderStatus) => {
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

  return (
      <AuthGuard requireAuth>
        <div className="min-h-screen bg-background pb-20">
          <header className="bg-primary md:bg-transparent text-white md:text-gray-900 p-6 md:px-8 md:pt-8 md:pb-4 rounded-b-3xl md:rounded-none shadow-lg md:shadow-none sticky md:static top-0 z-40">
            <div className="flex justify-center md:justify-start items-center max-w-6xl mx-auto">
              <h1 className="text-xl md:text-3xl font-extrabold text-center md:text-left">{t("orders.title")}</h1>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 pt-4 md:pt-6 max-w-6xl mx-auto no-scrollbar">
              {["all", "pending", "processing", "shipped", "delivered"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedStatus === status
                      ? "bg-white md:bg-gray-900 text-primary md:text-white shadow-sm"
                      : "bg-white/15 md:bg-white md:border md:border-gray-200 text-white md:text-gray-600 hover:bg-white/25 md:hover:bg-gray-50"
                  }`}
                >
                  {status === "all" ? "Alle" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </header>

          <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto mt-2 md:mt-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-xs border border-gray-100 text-center space-y-4">
                <Package size={48} className="mx-auto text-gray-400" />
                <h3 className="font-bold text-lg text-gray-800">{t("orders.empty")}</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Sie haben aktuell keine Bestellungen in dieser Kategorie.
                </p>
                <Link
                  href="/catalog"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md hover:opacity-90 transition-all"
                >
                  {t("checkout.backToCatalog")}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md transition-all border border-gray-100 flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
                        <div>
                          <span className="font-bold text-gray-900 text-base">{order.id}</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm mb-4 flex-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700">
                            <span className="truncate max-w-40 sm:max-w-60">
                              {item.product?.name} ({item.weightKg?.toFixed(1).replace(".", ",")} kg)
                            </span>
                            <span className="font-medium whitespace-nowrap">
                              {(item.weightKg * (item.product?.pricePerKg || 0)).toFixed(2).replace(".", ",")} €
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 pt-3 mt-auto flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-500 block font-medium">{t("orders.total")}</span>
                          <span className="text-primary font-black text-lg">
                            {order.totalAmount?.toFixed(2).replace(".", ",")} €
                          </span>
                        </div>

                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-primary-light text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-colors"
                        >
                          <span>{t("orders.viewDetails")}</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </AuthGuard>
  );
}

