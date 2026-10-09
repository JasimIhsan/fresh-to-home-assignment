"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderById } from "@/lib/store";
import { Order } from "@/types";
import { Calendar, CheckCircle2, Clock, CreditCard, MapPin, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function OrderConfirmationContent() {
   const { t } = useLanguage();
   const searchParams = useSearchParams();
   const orderId = searchParams.get("orderId");
   const [order, setOrder] = useState<Order | null>(null);

   useEffect(() => {
      if (orderId) {
         const found = getOrderById(orderId);
         if (found) setOrder(found);
      }
   }, [orderId]);

   const formattedDate = order
      ? new Date(order.createdAt).toLocaleDateString(undefined, {
           day: "2-digit",
           month: "short",
           year: "numeric",
        })
      : "";

   return (
      <div className="min-h-screen bg-background pb-20">
         {/* Top Accent Hero Banner */}
         <div className="relative bg-linear-to-b from-primary/10 via-primary/5 to-transparent pt-12 pb-16 px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
               {/* Animated Icon Pill */}
               <div className="inline-flex items-center justify-center p-3 sm:p-3.5 bg-emerald-500/10 text-emerald-600 rounded-3xl ring-8 ring-emerald-500/5 shadow-sm animate-in zoom-in-75 duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                     <CheckCircle2 size={32} className="stroke-[2.5]" />
                  </div>
               </div>

               <div>
                  <span className="inline-block px-3 py-1 text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full mb-3">{t("checkout.orderConfirmed")}</span>
                  <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{t("checkout.orderSuccess")}</h1>
                  <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">{t("checkout.orderSuccessDesc")}</p>
               </div>
            </div>
         </div>

         {/* Main Container */}
         <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 space-y-6">
            {/* 2-Column Balanced Cards for Web */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
               {/* Left Card: Order Summary & Receipt */}
               <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-7 border border-border shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-5">
                     <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                        <div>
                           <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">{t("checkout.orderNumber")}</span>
                           <p className="text-lg font-black text-foreground font-mono mt-0.5">#{order?.id || orderId || "---"}</p>
                        </div>
                        {order && (
                           <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">{t(`orders.status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`) || order.status}</span>
                           </div>
                        )}
                     </div>

                     {/* Order Items Preview */}
                     {order && order.items && order.items.length > 0 && (
                        <div className="space-y-3">
                           <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {t("orderDetail.itemsTitle") || "Artikel"} ({order.items.length})
                           </h2>
                           <div className="divide-y divide-border/60 max-h-64 overflow-y-auto pr-1">
                              {order.items.map((item, idx) => (
                                 <div key={idx} className="py-3 flex items-center justify-between gap-3 text-sm">
                                    <div className="flex items-center gap-3 min-w-0">
                                       <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover border border-border/80 shrink-0" />
                                       <div className="min-w-0">
                                          <p className="font-bold text-foreground truncate">{item.product.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                             {item.weightKg.toFixed(1).replace(".", ",")} kg × {item.product.pricePerKg.toFixed(2).replace(".", ",")} €/kg
                                          </p>
                                       </div>
                                    </div>
                                    <span className="font-extrabold text-foreground shrink-0">{(item.weightKg * item.product.pricePerKg).toFixed(2).replace(".", ",")} €</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Total Breakdown */}
                  {order && (
                     <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                        <div>
                           <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">{t("checkout.total")}</span>
                           <span className="text-xs text-muted-foreground">inkl. MwSt. & Kühlverpackung</span>
                        </div>
                        <span className="text-2xl font-black text-primary">{order.totalAmount.toFixed(2).replace(".", ",")} €</span>
                     </div>
                  )}
               </div>

               {/* Right Card: Delivery Info */}
               {order && (
                  <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-7 border border-border shadow-sm flex flex-col justify-between space-y-4">
                     <div className="space-y-4">
                        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-border">
                           <Truck size={17} className="text-primary" />
                           <span>{t("orderDetail.deliveryDetails") || "Lieferdetails"}</span>
                        </h2>

                        <div className="space-y-4 text-xs sm:text-sm">
                           <div className="flex items-start gap-3">
                              <MapPin size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                              <div>
                                 <span className="font-bold text-foreground block">{order.customerName}</span>
                                 <span className="text-muted-foreground leading-relaxed block">{order.address}</span>
                                 {order.phone && <span className="text-muted-foreground/80 text-xs mt-0.5 block">{order.phone}</span>}
                              </div>
                           </div>

                           <div className="flex items-center gap-3 pt-1">
                              <Clock size={18} className="text-muted-foreground shrink-0" />
                              <div>
                                 <span className="text-xs text-muted-foreground block">{t("orderDetail.timeSlot")}</span>
                                 <span className="font-semibold text-foreground">{order.deliverySlot || "Standard (08:00 - 12:00)"}</span>
                              </div>
                           </div>

                           <div className="flex items-center gap-3 pt-1">
                              <CreditCard size={18} className="text-muted-foreground shrink-0" />
                              <div>
                                 <span className="text-xs text-muted-foreground block">{t("orderDetail.payment")}</span>
                                 <span className="font-semibold text-foreground">{order.paymentMethod || "Kreditkarte"}</span>
                              </div>
                           </div>

                           {formattedDate && (
                              <div className="flex items-center gap-3 pt-1">
                                 <Calendar size={18} className="text-muted-foreground shrink-0" />
                                 <div>
                                    <span className="text-xs text-muted-foreground block">{t("orderDetail.placedOn") || "Bestelldatum"}</span>
                                    <span className="font-semibold text-foreground">{formattedDate}</span>
                                 </div>
                              </div>
                           )}

                           {order.notes && (
                              <div className="p-3 bg-muted/60 rounded-xl text-xs text-muted-foreground border border-border mt-2">
                                 <span className="font-bold block text-foreground mb-0.5">{t("orderDetail.customerNotes")}</span>
                                 <p className="italic">{order.notes}</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Trust / Freshness Guarantee Banner */}
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center justify-center gap-3 text-center sm:text-left">
               <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} />
               </div>
               <p className="text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed">{t("checkout.sslNotice")}</p>
            </div>

            {/* Action CTAs */}
            <div className="max-w-xl mx-auto space-y-3 pt-2">
               {orderId && (
                  <Link href={`/orders/${orderId}`} className="w-full py-4 px-6 bg-primary hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base active:scale-98 cursor-pointer text-center">
                     <Truck size={20} />
                     <span>{t("checkout.trackOrder")}</span>
                  </Link>
               )}

               <div className="flex gap-3">
                  <Link href="/orders" className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm transition-colors text-center">
                     {t("checkout.myOrders")}
                  </Link>
                  <Link href="/catalog" className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors text-center">
                     {t("checkout.backToCatalog")}
                  </Link>
               </div>
            </div>
         </main>
      </div>
   );
}

export default function OrderConfirmationPage() {
   return (
      <AuthGuard requireAuth>
         <Suspense
            fallback={
               <div className="min-h-screen bg-background flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               </div>
            }
         >
            <OrderConfirmationContent />
         </Suspense>
      </AuthGuard>
   );
}
