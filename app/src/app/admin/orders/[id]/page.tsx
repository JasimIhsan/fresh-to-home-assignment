"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getOrderById, updateOrderStatus } from "@/lib/store";
import { Order, OrderStatus } from "@/types";
import { AlertCircle, ArrowLeft, CheckCircle2, Package, Truck, User } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = use(params);
   const { id } = resolvedParams;
   const { t } = useLanguage();
   const [order, setOrder] = useState<Order | null>(null);
   const [loading, setLoading] = useState(true);
   const [updating, setUpdating] = useState(false);
   const [feedback, setFeedback] = useState<string | null>(null);

   useEffect(() => {
      const found = getOrderById(id);
      if (found) {
         setOrder(found);
      }
      setLoading(false);
   }, [id]);

   const handleUpdateStatus = (newStatus: OrderStatus) => {
      if (!order) return;
      setUpdating(true);
      const updated = updateOrderStatus(order.id, newStatus);
      if (updated) {
         setOrder({ ...updated });
         setFeedback(`${t("admin.statusUpdated")} "${newStatus.toUpperCase()}".`);
         setTimeout(() => setFeedback(null), 3000);
      }
      setUpdating(false);
   };

   if (loading) {
      return (
         <div className="min-h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
         </div>
      );
   }

   if (!order) {
      return (
         <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle size={48} className="mx-auto text-gray-400" />
            <h2 className="text-xl font-bold text-gray-800">{t("orderDetail.orderNotFound")}</h2>
            <Link href="/admin/orders" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">
               {t("orderDetail.backToOrders")}
            </Link>
         </div>
      );
   }

   return (
      <div className="w-full space-y-6 pb-16">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
               <Link href="/admin/orders" className="p-2 bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-100 cursor-pointer">
                  <ArrowLeft size={20} className="text-gray-600" />
               </Link>
               <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                     {t("orderDetail.title")} {order.id}
                  </h1>
                  <p className="text-gray-500 text-xs mt-0.5">
                     {t("orderDetail.placedOn")} {new Date(order.createdAt).toLocaleDateString()} {t("orderDetail.atTime")}{" "}
                     {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                     })}
                  </p>
               </div>
            </div>
         </div>

         {feedback && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2 animate-in fade-in">
               <CheckCircle2 size={16} className="text-emerald-600" />
               <span>{feedback}</span>
            </div>
         )}

         {/* Status Management Bar */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t("admin.updateStatus")}</span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
               {(
                  [
                     { status: "pending", label: t("orders.statusPending"), bg: "hover:border-purple-300" },
                     { status: "processing", label: t("orders.statusProcessing"), bg: "hover:border-amber-300" },
                     { status: "shipped", label: t("orders.statusShipped"), bg: "hover:border-blue-300" },
                     { status: "delivered", label: t("orders.statusDelivered"), bg: "hover:border-emerald-300" },
                     { status: "cancelled", label: t("orders.statusCancelled"), bg: "hover:border-red-300" },
                  ] as const
               ).map((item) => (
                  <button
                     key={item.status}
                     type="button"
                     disabled={updating}
                     onClick={() => handleUpdateStatus(item.status)}
                     className={`p-3 rounded-2xl font-bold text-xs border-2 transition-all cursor-pointer ${order.status === item.status ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]" : `bg-gray-50 text-gray-700 border-gray-200 ${item.bg}`}`}
                  >
                     {item.label}
                  </button>
               ))}
            </div>
         </div>

         {/* Customer and Delivery Details */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
               <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
                  <User size={18} className="text-primary" />
                  <span>{t("admin.customerData")}</span>
               </h3>

               <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                     <span className="text-gray-400">{t("signup.fullName")}:</span>
                     <span className="font-bold text-gray-900">{order.customerName || "Max Mustermann"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                     <span className="text-gray-400">{t("login.email")}:</span>
                     <span className="font-medium text-gray-900">{order.userEmail}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                     <span className="text-gray-400">{t("checkout.phone")}:</span>
                     <span className="font-medium text-gray-900">{order.phone || "-"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                     <span className="text-gray-400">User ID:</span>
                     <span className="font-mono text-[10px] text-gray-500">{order.userId}</span>
                  </div>
               </div>
            </div>

            {/* Delivery Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
               <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
                  <Truck size={18} className="text-primary" />
                  <span>{t("admin.deliveryAndPayment")}</span>
               </h3>

               <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                     <span className="text-gray-400">{t("orderDetail.address")}:</span>
                     <span className="font-bold text-gray-900 text-right max-w-50">{order.address}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                     <span className="text-gray-400">{t("orderDetail.timeSlot")}:</span>
                     <span className="font-medium text-gray-900">{order.deliverySlot || t("checkout.slotTagStandard")}</span>
                  </div>
                  <div className="flex justify-between py-1">
                     <span className="text-gray-400">{t("orderDetail.payment")}:</span>
                     <span className="font-medium text-gray-900">{order.paymentMethod || t("checkout.paymentCreditCard")}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Ordered Items Table */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
               <Package size={18} className="text-primary" />
               <span>
                  {t("orderDetail.itemsTitle")} ({order.items.length})
               </span>
            </h3>

            <div className="divide-y divide-gray-100">
               {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-sm">
                     <Link href={`/admin/products/${item.product.id}`} className="flex items-center space-x-3 group cursor-pointer">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover group-hover:ring-2 group-hover:ring-primary/20 transition-all" />
                        <div>
                           <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.product.name}</p>
                           <p className="text-xs text-gray-500">
                              {item.weightKg.toFixed(1).replace(".", ",")} kg × {item.product.pricePerKg.toFixed(2).replace(".", ",")} € / kg
                           </p>
                        </div>
                     </Link>
                     <span className="font-black text-gray-900">{(item.weightKg * item.product.pricePerKg).toFixed(2).replace(".", ",")} €</span>
                  </div>
               ))}
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-black text-primary">
               <span>{t("admin.orderTotal")}</span>
               <span>{order.totalAmount.toFixed(2).replace(".", ",")} €</span>
            </div>
         </div>

         {order.notes && (
            <div className="p-4 bg-purple-50 rounded-2xl text-xs text-primary">
               <span className="font-bold block mb-1">{t("admin.customerNotes")}</span>
               <p>{order.notes}</p>
            </div>
         )}
      </div>
   );
}
