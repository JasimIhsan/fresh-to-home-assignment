"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Clock } from "lucide-react";

export interface CheckoutSlotSelectorProps {
   deliverySlot: string;
   setDeliverySlot: (slot: string) => void;
}

export function CheckoutSlotSelector({ deliverySlot, setDeliverySlot }: CheckoutSlotSelectorProps) {
   const { t } = useLanguage();

   const slots = [
      { id: "morning", label: t("checkout.slotMorning"), tag: "Standard" },
      { id: "afternoon", label: t("checkout.slotAfternoon"), tag: "Beliebt" },
      { id: "evening", label: t("checkout.slotEvening"), tag: "Standard" },
      { id: "express", label: t("checkout.slotExpress"), tag: "+2.00 €" },
   ];

   return (
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4">
         <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            {t("checkout.deliverySlot")}
         </h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.map((slot) => (
               <label
                  key={slot.id}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                     deliverySlot === slot.id
                        ? "border-primary bg-primary-light/40 text-primary font-bold shadow-xs"
                        : "border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
                  }`}
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
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600 font-semibold">
                     {slot.tag}
                  </span>
               </label>
            ))}
         </div>
      </div>
   );
}
