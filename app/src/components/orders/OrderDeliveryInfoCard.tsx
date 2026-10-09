"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Order } from "@/types";

export interface OrderDeliveryInfoCardProps {
   order: Order;
}

export function OrderDeliveryInfoCard({ order }: OrderDeliveryInfoCardProps) {
   const { t } = useLanguage();

   return (
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
   );
}
