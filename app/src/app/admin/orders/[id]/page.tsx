"use client";

import { AdminOrderCustomerDetails } from "@/components/admin/AdminOrderCustomerDetails";
import { AdminOrderItemsView } from "@/components/admin/AdminOrderItemsView";
import { AdminOrderStatusActions } from "@/components/admin/AdminOrderStatusActions";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderById, updateOrderStatus } from "@/lib/store";
import { Order, OrderStatus } from "@/types";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
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
         <AdminOrderStatusActions
            currentStatus={order.status}
            updating={updating}
            onUpdateStatus={handleUpdateStatus}
         />

         {/* Customer and Delivery Details */}
         <AdminOrderCustomerDetails order={order} />

         {/* Ordered Items Table */}
         <AdminOrderItemsView items={order.items} totalAmount={order.totalAmount} />

         {order.notes && (
            <div className="p-4 bg-purple-50 rounded-2xl text-xs text-primary">
               <span className="font-bold block mb-1">{t("admin.customerNotes")}</span>
               <p>{order.notes}</p>
            </div>
         )}
      </div>
   );
}
