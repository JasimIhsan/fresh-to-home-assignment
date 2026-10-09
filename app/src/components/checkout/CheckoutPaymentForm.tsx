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
    {
      id: "card",
      label: t("checkout.paymentCreditCard"),
      icon: <CreditCard size={18} />,
    },
    {
      id: "paypal",
      label: t("checkout.paymentPaypal"),
      icon: <span className="text-xs font-black">PP</span>,
    },
    {
      id: "applepay",
      label: t("checkout.paymentApplePay"),
      icon: <span className="text-xs font-black">Pay</span>,
    },
    {
      id: "cod",
      label: t("checkout.paymentCod"),
      icon: <Banknote size={18} />,
    },
  ];

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <CreditCard size={20} className="text-primary" />
        {t("checkout.paymentMethod")}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {paymentOptions.map((pay) => (
          <label
            key={pay.id}
            className={`flex cursor-pointer items-center space-x-3 rounded-2xl border-2 p-3.5 transition-all ${
              paymentMethod === pay.id
                ? "border-primary bg-primary-light/40 text-primary font-bold shadow-xs"
                : "border-gray-100 bg-gray-50 font-medium text-gray-700 hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === pay.id}
              onChange={() => setPaymentMethod(pay.id)}
              className="text-primary focus:ring-primary h-4 w-4 shrink-0"
            />
            <span className="shrink-0 rounded-md bg-white p-1.5 text-gray-700 shadow-2xs">
              {pay.icon}
            </span>
            <span className="truncate text-xs font-semibold sm:text-sm">
              {pay.label}
            </span>
          </label>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">
          {t("checkout.notes")}
        </label>
        <div className="relative">
          <FileText
            size={16}
            className="absolute top-3.5 left-3.5 text-gray-400"
          />
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("checkout.notesPlaceholder")}
            className="focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}
