"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Order } from "@/types";

export interface OrderDeliveryInfoCardProps {
  order: Order;
}

export function OrderDeliveryInfoCard({ order }: OrderDeliveryInfoCardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
      <h3 className="text-lg font-bold text-gray-900">
        {t("orderDetail.deliveryDetails")}
      </h3>

      <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-1 rounded-2xl bg-gray-50 p-4">
          <span className="block font-semibold text-gray-400 uppercase">
            {t("orderDetail.address")}
          </span>
          <p className="text-sm font-bold text-gray-800">
            {order.customerName}
          </p>
          <p className="text-gray-600">{order.address}</p>
          {order.phone && <p className="text-gray-500">{order.phone}</p>}
        </div>

        <div className="space-y-2 rounded-2xl bg-gray-50 p-4">
          <div>
            <span className="block font-semibold text-gray-400 uppercase">
              {t("orderDetail.timeSlot")}
            </span>
            <p className="text-sm font-bold text-gray-800">
              {order.deliverySlot || "Standard (08:00 - 12:00)"}
            </p>
          </div>

          <div>
            <span className="block font-semibold text-gray-400 uppercase">
              {t("orderDetail.payment")}
            </span>
            <p className="text-sm font-bold text-gray-800">
              {order.paymentMethod || "Kreditkarte"}
            </p>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="text-primary rounded-2xl border border-purple-100 bg-purple-50 p-3.5 text-xs">
          <span className="mb-1 block font-bold">
            {t("orderDetail.customerNotes")}
          </span>
          <p className="leading-relaxed font-medium wrap-break-word whitespace-pre-wrap text-purple-950">
            {order.notes}
          </p>
        </div>
      )}
    </div>
  );
}
