"use client";

import { useLanguage } from "@/context/LanguageContext";
import { OrderStatus } from "@/types";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface OrderTrackingProgressProps {
   status: OrderStatus;
   createdAt: string;
}

export function OrderTrackingProgress({ status, createdAt }: OrderTrackingProgressProps) {
   const { t } = useLanguage();

   const steps: { key: OrderStatus; label: string; desc: string }[] = [
      { key: "pending", label: t("orderDetail.stepPending"), desc: t("orderDetail.stepPendingDesc") },
      { key: "processing", label: t("orderDetail.stepProcessing"), desc: t("orderDetail.stepProcessingDesc") },
      { key: "shipped", label: t("orderDetail.stepShipped"), desc: t("orderDetail.stepShippedDesc") },
      { key: "delivered", label: t("orderDetail.stepDelivered"), desc: t("orderDetail.stepDeliveredDesc") },
   ];

   const getStepIndex = (st: OrderStatus) => {
      switch (st) {
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

   const currentStepIndex = getStepIndex(status);

   return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 space-y-6">
         <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
               <h2 className="text-xl font-bold text-gray-900">{t("orderDetail.trackingTitle")}</h2>
               <p className="text-xs text-gray-500 mt-0.5">
                  {t("orderDetail.placedOn")} {new Date(createdAt).toLocaleDateString()} {t("orderDetail.atTime")}{" "}
                  {new Date(createdAt).toLocaleTimeString([], {
                     hour: "2-digit",
                     minute: "2-digit",
                  })}
               </p>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-primary border border-purple-200 rounded-full text-xs font-bold uppercase tracking-wider">
               {status}
            </span>
         </div>

         {status === "cancelled" ? (
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
                        <div
                           className={`absolute -left-12 top-0.5 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isCompleted
                                 ? "bg-primary text-white shadow-md shadow-primary/25 ring-4 ring-purple-100"
                                 : "bg-white text-gray-400 border-2 border-gray-300"
                           }`}
                        >
                           {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                        </div>
                        <div className="pt-0.5 space-y-1">
                           <h4
                              className={`font-bold text-sm sm:text-base ${
                                 isCurrent ? "text-primary font-extrabold" : isCompleted ? "text-gray-900" : "text-gray-400"
                              }`}
                           >
                              {step.label}
                           </h4>
                           <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
}
