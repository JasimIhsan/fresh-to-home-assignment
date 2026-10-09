"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Banknote, CreditCard, FileText } from "lucide-react";
import React from "react";

export interface CheckoutPaymentFormProps {
   paymentMethod: string;
   setPaymentMethod: (method: string) => void;
   notes: string;
   setNotes: (notes: string) => void;
}

export function CheckoutPaymentForm({
   paymentMethod,
   setPaymentMethod,
   notes,
   setNotes,
}: CheckoutPaymentFormProps) {
   const { t } = useLanguage();

   const paymentOptions = [
      { id: "card", label: t("checkout.paymentCreditCard"), icon: <CreditCard size={18} /> },
      { id: "paypal", label: t("checkout.paymentPaypal"), icon: <span className="font-black text-xs">PP</span> },
      { id: "applepay", label: t("checkout.paymentApplePay"), icon: <span className="font-black text-xs">Pay</span> },
      { id: "cod", label: t("checkout.paymentCod"), icon: <Banknote size={18} /> },
   ];

   return (
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4">
         <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            {t("checkout.paymentMethod")}
         </h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentOptions.map((pay) => (
               <label
                  key={pay.id}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${
                     paymentMethod === pay.id
                        ? "border-primary bg-primary-light/40 text-primary font-bold shadow-xs"
                        : "border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
                  }`}
               >
                  <input
                     type="radio"
                     name="paymentMethod"
                     checked={paymentMethod === pay.id}
                     onChange={() => setPaymentMethod(pay.id)}
                     className="text-primary focus:ring-primary h-4 w-4 shrink-0"
                  />
                  <span className="p-1.5 rounded-md bg-white text-gray-700 shadow-2xs shrink-0">{pay.icon}</span>
                  <span className="text-xs sm:text-sm font-semibold truncate">{pay.label}</span>
               </label>
            ))}
         </div>

         <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t("checkout.notes")}</label>
            <div className="relative">
               <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
               <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("checkout.notesPlaceholder")}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
               />
            </div>
         </div>
      </div>
   );
}
