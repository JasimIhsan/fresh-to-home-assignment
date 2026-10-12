"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface CheckoutSlotSelectorProps {
  readonly deliverySlot: string;
  readonly setDeliverySlot: (slot: string) => void;
}

export function CheckoutSlotSelector({
  deliverySlot,
  setDeliverySlot,
}: CheckoutSlotSelectorProps) {
  const { t } = useLanguage();

  const slots = [
    {
      id: "morning",
      label: t("checkout.slotMorning"),
      tag: t("checkout.slotTagStandard"),
    },
    {
      id: "afternoon",
      label: t("checkout.slotAfternoon"),
      tag: t("checkout.slotTagPopular"),
    },
    {
      id: "evening",
      label: t("checkout.slotEvening"),
      tag: t("checkout.slotTagStandard"),
    },
    { id: "express", label: t("checkout.slotExpress"), tag: "+2.00 €" },
  ];

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Clock size={20} className="text-primary" />
        {t("checkout.deliverySlot")}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {slots.map((slot) => (
          <label
            key={slot.id}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 transition-all",
              deliverySlot === slot.id
                ? "border-primary bg-primary-light/40 text-primary font-bold shadow-xs"
                : "border-gray-100 bg-gray-50 font-medium text-gray-700 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center space-x-2.5">
              <input
                type="radio"
                name="deliverySlot"
                checked={deliverySlot === slot.id}
                onChange={() => setDeliverySlot(slot.id)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-xs sm:text-sm">{slot.label}</span>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-600">
              {slot.tag}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
