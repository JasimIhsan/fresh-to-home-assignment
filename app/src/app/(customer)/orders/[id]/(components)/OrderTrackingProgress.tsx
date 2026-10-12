"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/index";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { formatOrderDate, formatOrderTime } from "@/lib/format";

export interface OrderTrackingProgressProps {
  readonly status: OrderStatus;
  readonly createdAt: string;
}

export function OrderTrackingProgress({
  status,
  createdAt,
}: OrderTrackingProgressProps) {
  const { t } = useLanguage();

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: "pending",
      label: t("orderDetail.stepPending"),
      desc: t("orderDetail.stepPendingDesc"),
    },
    {
      key: "processing",
      label: t("orderDetail.stepProcessing"),
      desc: t("orderDetail.stepProcessingDesc"),
    },
    {
      key: "shipped",
      label: t("orderDetail.stepShipped"),
      desc: t("orderDetail.stepShippedDesc"),
    },
    {
      key: "delivered",
      label: t("orderDetail.stepDelivered"),
      desc: t("orderDetail.stepDeliveredDesc"),
    },
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
    <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {t("orderDetail.trackingTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            {t("orderDetail.placedOn")} {formatOrderDate(createdAt)}{" "}
            {t("orderDetail.atTime")} {formatOrderTime(createdAt)}
          </p>
        </div>
        <span className="text-primary rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold tracking-wider uppercase">
          {status}
        </span>
      </div>

      {status === "cancelled" ? (
        <div className="flex items-center space-x-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={24} className="shrink-0" />
          <div>
            <h4 className="text-sm font-bold">
              {t("orderDetail.cancelledTitle")}
            </h4>
            <p className="text-xs">{t("orderDetail.cancelledDesc")}</p>
          </div>
        </div>
      ) : (
        <div className="relative my-3 space-y-10 pl-12 before:absolute before:top-4 before:bottom-4 before:left-4.25 before:w-0.5 before:bg-gray-200 sm:space-y-12">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.key} className="relative flex items-start">
                <div
                  className={cn(
                    "absolute top-0.5 -left-12 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isCompleted
                      ? "bg-primary shadow-primary/25 text-white shadow-md ring-4 ring-purple-100"
                      : "border-2 border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                </div>
                <div className="space-y-1 pt-0.5">
                  <h4
                    className={cn(
                      "text-sm font-bold sm:text-base",
                      isCurrent
                        ? "text-primary font-extrabold"
                        : isCompleted
                          ? "text-gray-900"
                          : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
