"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, Truck } from "lucide-react";

interface CartFreeShippingBarProps {
  readonly totalAmount: number;
  readonly threshold: number;
}

export function CartFreeShippingBar({
  totalAmount,
  threshold,
}: CartFreeShippingBarProps) {
  const { t } = useLanguage();

  const isFree = totalAmount >= threshold && totalAmount > 0;
  const progress = Math.min(100, Math.round((totalAmount / threshold) * 100));
  const amountNeeded = Math.max(0, threshold - totalAmount);

  return (
    <div className="space-y-2.5 rounded-3xl border border-gray-100/90 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="flex items-center gap-2 font-bold text-gray-800">
          <div className="text-primary flex h-7 w-7 items-center justify-center rounded-xl bg-purple-50">
            <Truck size={15} />
          </div>
          {isFree ? (
            <span className="flex items-center gap-1 font-extrabold text-emerald-700">
              <CheckCircle2 size={16} className="text-emerald-600" />
              {t("cart.freeDelivery")}
            </span>
          ) : (
            <span>{t("cart.freeDeliveryThreshold")}</span>
          )}
        </span>
        <span className="text-primary font-extrabold tabular-nums">
          {progress}%
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isFree ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {!isFree && amountNeeded > 0 && (
        <p className="text-right text-[11px] font-medium text-gray-500">
          <strong className="font-bold text-gray-800">
            {amountNeeded.toFixed(2).replace(".", ",")} €
          </strong>{" "}
          bis zum kostenlosen Versand
        </p>
      )}
    </div>
  );
}
