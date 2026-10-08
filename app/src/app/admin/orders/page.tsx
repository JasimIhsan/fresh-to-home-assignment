"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getStoredOrders, updateOrderStatus } from "@/lib/store";
import { Order, OrderStatus } from "@/types";
import { Eye, Phone, Search } from "lucide-react";
import Link from "next/link";
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
         const matchQuery = !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) || (o.userEmail && o.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) || (o.address && o.address.toLowerCase().includes(searchQuery.toLowerCase()));
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
         <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
               <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("catalog.searchPlaceholder")} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all" />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
               {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((st) => (
                  <button key={st} onClick={() => setSelectedStatus(st)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedStatus === st ? "bg-primary text-white shadow-xs" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                     {st === "all" ? t("orders.all") : t(`orders.status${st.charAt(0).toUpperCase() + st.slice(1)}` as any) || st}
                  </button>
               ))}
            </div>
         </div>

         {/* Orders Table */}
         <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                        <th className="py-3.5 px-6 font-semibold">{t("checkout.orderNumber")}</th>
                        <th className="py-3.5 px-4 font-semibold">{t("admin.customerData")}</th>
                        <th className="py-3.5 px-4 font-semibold">{t("orderDetail.timeSlot")}</th>
                        <th className="py-3.5 px-4 font-semibold">{t("cart.items")}</th>
                        <th className="py-3.5 px-4 font-semibold">{t("orders.total")}</th>
                        <th className="py-3.5 px-4 font-semibold">{t("orders.status")}</th>
                        <th className="py-3.5 px-6 font-semibold text-right">{t("admin.actionRequired")}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredOrders.length === 0 ? (
                        <tr>
                           <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                              {t("orders.empty")}
                           </td>
                        </tr>
                     ) : (
                        filteredOrders.map((order) => (
                           <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                              <td className="py-4 px-6 font-bold text-gray-900">
                                 <div>{order.id}</div>
                                 <span className="text-[11px] text-gray-400 font-normal">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </td>

                              <td className="py-4 px-4">
                                 <p className="font-bold text-gray-900 text-xs">{order.customerName || order.userEmail?.split("@")[0]}</p>
                                 <p className="text-[11px] text-gray-500 truncate max-w-45">{order.address}</p>
                                 {order.phone && (
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                       <Phone size={10} /> {order.phone}
                                    </p>
                                 )}
                              </td>

                              <td className="py-4 px-4 text-xs font-medium text-gray-700">
                                 <span className="px-2 py-1 bg-gray-100 rounded-lg inline-block whitespace-nowrap">{order.deliverySlot || "Standard"}</span>
                              </td>

                              <td className="py-4 px-4 text-xs text-gray-600">
                                 <span className="font-semibold">
                                    {order.items?.length || 0} {t("cart.items")}
                                 </span>
                                 <p className="text-[11px] text-gray-400 truncate max-w-35">{order.items?.map((i) => i.product.name).join(", ")}</p>
                              </td>

                              <td className="py-4 px-4 font-black text-gray-900">{order.totalAmount.toFixed(2).replace(".", ",")} €</td>

                              <td className="py-4 px-4">
                                 <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer outline-hidden transition-colors ${
                                       order.status === "delivered"
                                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                          : order.status === "shipped"
                                            ? "bg-blue-50 text-blue-800 border-blue-200"
                                            : order.status === "processing"
                                              ? "bg-amber-50 text-amber-800 border-amber-200"
                                              : order.status === "cancelled"
                                                ? "bg-red-50 text-red-800 border-red-200"
                                                : "bg-purple-50 text-primary border-purple-200"
                                    }`}
                                 >
                                    <option value="pending">{t("orders.statusPending")}</option>
                                    <option value="processing">{t("orders.statusProcessing")}</option>
                                    <option value="shipped">{t("orders.statusShipped")}</option>
                                    <option value="delivered">{t("orders.statusDelivered")}</option>
                                    <option value="cancelled">{t("orders.statusCancelled")}</option>
                                 </select>
                              </td>

                              <td className="py-4 px-6 text-right">
                                 <Link href={`/admin/orders/${order.id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-purple-50 rounded-xl inline-flex items-center transition-colors" title={t("orders.viewDetails")}>
                                    <Eye size={18} />
                                 </Link>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
