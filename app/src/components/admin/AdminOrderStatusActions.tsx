"use client";

import { useLanguage } from "@/context/LanguageContext";
import { OrderStatus } from "@/types";

export interface AdminOrderStatusActionsProps {
   currentStatus: OrderStatus;
   updating: boolean;
   onUpdateStatus: (newStatus: OrderStatus) => void;
}

export function AdminOrderStatusActions({
   currentStatus,
   updating,
   onUpdateStatus,
}: AdminOrderStatusActionsProps) {
   const { t } = useLanguage();

   const statusOptions: { status: OrderStatus; label: string; bg: string }[] = [
      { status: "pending", label: t("orders.statusPending"), bg: "hover:border-purple-300" },
      { status: "processing", label: t("orders.statusProcessing"), bg: "hover:border-amber-300" },
      { status: "shipped", label: t("orders.statusShipped"), bg: "hover:border-blue-300" },
      { status: "delivered", label: t("orders.statusDelivered"), bg: "hover:border-emerald-300" },
      { status: "cancelled", label: t("orders.statusCancelled"), bg: "hover:border-red-300" },
   ];

   return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t("admin.updateStatus")}</span>

         <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {statusOptions.map((item) => (
               <button
                  key={item.status}
                  type="button"
                  disabled={updating}
                  onClick={() => onUpdateStatus(item.status)}
                  className={`p-3 rounded-2xl font-bold text-xs border-2 transition-all cursor-pointer ${
                     currentStatus === item.status
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                        : `bg-gray-50 text-gray-700 border-gray-200 ${item.bg}`
                  }`}
               >
                  {item.label}
               </button>
            ))}
         </div>
      </div>
   );
}
