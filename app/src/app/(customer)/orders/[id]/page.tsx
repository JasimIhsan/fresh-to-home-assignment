"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrderDeliveryInfoCard } from "@/components/orders/OrderDeliveryInfoCard";
import { OrderItemList } from "@/components/orders/OrderItemList";
import { OrderTrackingProgress } from "@/components/orders/OrderTrackingProgress";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderById } from "@/lib/store";
import { Order } from "@/types";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = use(params);
   const { id } = resolvedParams;
   const { t } = useLanguage();
   const [order, setOrder] = useState<Order | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const found = getOrderById(id);
      if (found) {
         setOrder(found);
      }
      setLoading(false);
   }, [id]);

   return (
      <AuthGuard requireAuth>
         <div className="min-h-screen bg-background pb-20">
            <header className="bg-primary md:bg-transparent text-white md:text-gray-900 px-4 py-3.5 md:px-8 md:pt-8 md:pb-6 rounded-b-3xl md:rounded-none shadow-lg md:shadow-none sticky md:static top-0 z-40">
               <div className="flex items-center justify-between max-w-6xl mx-auto relative">
                  <Link
                     href="/orders"
                     className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 md:bg-transparent md:hover:bg-gray-100 md:border md:border-gray-200 md:text-gray-700 active:scale-95 flex items-center justify-center transition-all cursor-pointer shrink-0 z-10"
                     aria-label={t("orderDetail.backToOrders")}
                  >
                     <ArrowLeft size={20} strokeWidth={2.5} />
                  </Link>
                  <div className="flex-1 mx-2 text-center md:text-left md:flex-initial md:mx-0 md:ml-4">
                     <h1 className="text-base md:text-3xl font-extrabold flex items-center justify-center md:justify-start gap-1.5 truncate">
                        <span>{t("orderDetail.title")}</span>
                        <span className="text-white/80 md:text-gray-400 font-medium text-xs md:text-lg">#{id}</span>
                     </h1>
                  </div>
                  <div className="w-10 md:hidden shrink-0 pointer-events-none" aria-hidden="true" />
               </div>
            </header>

            <main className="p-4 md:p-8 max-w-6xl mx-auto mt-2 md:mt-4">
               {loading ? (
                  <div className="bg-white p-12 rounded-3xl shadow-xs border border-gray-100 flex items-center justify-center">
                     <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
               ) : !order ? (
                  <div className="bg-white p-12 rounded-3xl shadow-xs border border-gray-100 text-center space-y-4">
                     <AlertCircle size={48} className="mx-auto text-gray-400" />
                     <h2 className="text-xl font-bold text-gray-800">{t("orderDetail.orderNotFound")}</h2>
                     <Link href="/orders" className="inline-block bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm">
                        {t("orderDetail.backToOrders")}
                     </Link>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 space-y-6">
                        <OrderTrackingProgress status={order.status} createdAt={order.createdAt} />
                        <OrderItemList items={order.items} totalAmount={order.totalAmount} />
                     </div>

                     <div className="lg:col-span-1 space-y-6">
                        <OrderDeliveryInfoCard order={order} />
                     </div>
                  </div>
               )}
            </main>
         </div>
      </AuthGuard>
   );
}
