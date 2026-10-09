"use client";

import { useLanguage } from "@/context/LanguageContext";
import { OrderStatus } from "@/types";
import { AlertCircle, CheckCircle2, Clock, Truck } from "lucide-react";
import React from "react";

export interface OrderStatusBadgeConfig {
   label: string;
   bg: string;
   icon: React.ReactNode;
}

export function useOrderStatusBadge() {
   const { t } = useLanguage();

   return (status: OrderStatus): OrderStatusBadgeConfig => {
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
}

export interface CustomerOrderCardProps {
   order: import("@/types").Order;
}

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CustomerOrderCard({ order }: CustomerOrderCardProps) {
   const { t } = useLanguage();
   const getBadge = useOrderStatusBadge();
   const badge = getBadge(order.status);

   return (
      <div className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md transition-all border border-gray-100 flex flex-col h-full">
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

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
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
}
