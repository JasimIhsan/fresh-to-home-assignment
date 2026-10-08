"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderById } from "@/lib/store";
import { Order, OrderStatus } from "@/types";
import { AlertCircle, ArrowLeft, CheckCircle2, Package } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = use(params);
   const { id } = resolvedParams;
   const { t } = useLanguage();
   const { user } = useAuth();
   const [order, setOrder] = useState<Order | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const found = getOrderById(id);
      if (found) {
         setOrder(found);
      }
      setLoading(false);
   }, [id]);

   const steps: { key: OrderStatus; label: string; desc: string }[] = [
      { key: "pending", label: t("orderDetail.stepPending"), desc: t("orderDetail.stepPendingDesc") },
      { key: "processing", label: t("orderDetail.stepProcessing"), desc: t("orderDetail.stepProcessingDesc") },
      { key: "shipped", label: t("orderDetail.stepShipped"), desc: t("orderDetail.stepShippedDesc") },
      { key: "delivered", label: t("orderDetail.stepDelivered"), desc: t("orderDetail.stepDeliveredDesc") },
   ];

   const getStepIndex = (status: OrderStatus) => {
      switch (status) {
         case "pending":
            return 0;
         case "processing":
            return 1;
         case "shipped":
            return 2;
         case "delivered":
            return 3;
         case "cancelled":
            return -1;
         default:
            return 0;
      }
   };

   const currentStepIndex = order ? getStepIndex(order.status) : 0;

   return (
      <AuthGuard requireAuth>
         <div className="min-h-screen bg-background pb-20">
            <header className="bg-primary md:bg-transparent text-white md:text-gray-900 px-4 py-3.5 md:px-8 md:pt-8 md:pb-6 rounded-b-3xl md:rounded-none shadow-lg md:shadow-none sticky md:static top-0 z-40">
               <div className="flex items-center justify-between max-w-6xl mx-auto relative">
                  <Link href="/orders" className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 md:bg-transparent md:hover:bg-gray-100 md:border md:border-gray-200 md:text-gray-700 active:scale-95 flex items-center justify-center transition-all cursor-pointer shrink-0 z-10" aria-label={t("orderDetail.backToOrders")}>
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
                        {/* Live Tracking Progress Card */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 space-y-6">
                           <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                              <div>
                                 <h2 className="text-xl font-bold text-gray-900">{t("orderDetail.trackingTitle")}</h2>
                                 <p className="text-xs text-gray-500 mt-0.5">
                                    {t("orderDetail.placedOn")} {new Date(order.createdAt).toLocaleDateString()} {t("orderDetail.atTime")}{" "}
                                    {new Date(order.createdAt).toLocaleTimeString([], {
                                       hour: "2-digit",
                                       minute: "2-digit",
                                    })}
                                 </p>
                              </div>
                              <span className="px-3 py-1 bg-purple-50 text-primary border border-purple-200 rounded-full text-xs font-bold uppercase tracking-wider">{order.status}</span>
                           </div>

                           {order.status === "cancelled" ? (
                              <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 flex items-center space-x-3">
                                 <AlertCircle size={24} className="shrink-0" />
                                 <div>
                                    <h4 className="font-bold text-sm">{t("orderDetail.cancelledTitle")}</h4>
                                    <p className="text-xs">{t("orderDetail.cancelledDesc")}</p>
                                 </div>
                              </div>
                           ) : (
                              <div className="relative pl-12 space-y-10 sm:space-y-12 my-3 before:absolute before:left-4.25 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
                                 {steps.map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    return (
                                       <div key={step.key} className="relative flex items-start">
                                          <div className={`absolute -left-12 top-0.5 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isCompleted ? "bg-primary text-white shadow-md shadow-primary/25 ring-4 ring-purple-100" : "bg-white text-gray-400 border-2 border-gray-300"}`}>
                                             {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                                          </div>
                                          <div className="pt-0.5 space-y-1">
                                             <h4 className={`font-bold text-sm sm:text-base ${isCurrent ? "text-primary font-extrabold" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step.label}</h4>
                                             <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           )}
                        </div>

                        {/* Items in Order */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 space-y-4">
                           <h3 className="font-bold text-lg text-gray-900 flex items-center space-x-2">
                              <Package size={20} className="text-primary" />
                              <span>{t("orderDetail.itemsTitle")}</span>
                           </h3>

                           <div className="divide-y divide-gray-100">
                              {order.items.map((item, idx) => (
                                 <div key={idx} className="py-3 flex justify-between items-center text-sm">
                                    <div className="flex items-center space-x-3">
                                       <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover" />
                                       <div>
                                          <p className="font-semibold text-gray-900">{item.product.name}</p>
                                          <p className="text-xs text-gray-500">
                                             {item.weightKg.toFixed(1).replace(".", ",")} kg × {item.product.pricePerKg.toFixed(2).replace(".", ",")} € / kg
                                          </p>
                                       </div>
                                    </div>
                                    <span className="font-bold text-gray-900">{(item.weightKg * item.product.pricePerKg).toFixed(2).replace(".", ",")} €</span>
                                 </div>
                              ))}
                           </div>

                           <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-black text-primary">
                              <span>{t("orders.total")}</span>
                              <span>{order.totalAmount.toFixed(2).replace(".", ",")} €</span>
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-1 space-y-6">
                        {/* Delivery and Payment Details */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 space-y-4">
                           <h3 className="font-bold text-lg text-gray-900">{t("orderDetail.deliveryDetails")}</h3>

                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 text-xs">
                              <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                                 <span className="text-gray-400 font-semibold uppercase block">{t("orderDetail.address")}</span>
                                 <p className="font-bold text-gray-800 text-sm">{order.customerName}</p>
                                 <p className="text-gray-600">{order.address}</p>
                                 {order.phone && <p className="text-gray-500">{order.phone}</p>}
                              </div>

                              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                                 <div>
                                    <span className="text-gray-400 font-semibold uppercase block">{t("orderDetail.timeSlot")}</span>
                                    <p className="font-bold text-gray-800 text-sm">{order.deliverySlot || "Standard (08:00 - 12:00)"}</p>
                                 </div>

                                 <div>
                                    <span className="text-gray-400 font-semibold uppercase block">{t("orderDetail.payment")}</span>
                                    <p className="font-bold text-gray-800 text-sm">{order.paymentMethod || "Kreditkarte"}</p>
                                 </div>
                              </div>
                           </div>

                           {order.notes && (
                              <div className="p-3.5 bg-purple-50 rounded-2xl text-xs text-primary border border-purple-100">
                                 <span className="font-bold block mb-1">{t("orderDetail.customerNotes")}</span>
                                 <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-purple-950 font-medium">{order.notes}</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               )}
            </main>
         </div>
      </AuthGuard>
   );
}
