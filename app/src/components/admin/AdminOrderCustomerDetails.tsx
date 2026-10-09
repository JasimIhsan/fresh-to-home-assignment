"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Order } from "@/types";
import { Truck, User } from "lucide-react";

export interface AdminOrderCustomerDetailsProps {
   order: Order;
}

export function AdminOrderCustomerDetails({ order }: AdminOrderCustomerDetailsProps) {
   const { t } = useLanguage();

   return (
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
   );
}
