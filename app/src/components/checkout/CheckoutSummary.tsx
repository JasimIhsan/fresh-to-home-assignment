"use client";

import { useLanguage } from "@/context/LanguageContext";
import { formatEuro, formatKg } from "@/components/orders/format";
import type { CartItem } from "@/types";
import { ShieldCheck } from "lucide-react";

export interface CheckoutSummaryProps {
  readonly items: readonly CartItem[];
  readonly totalAmount: number;
  readonly deliveryFee: number;
  readonly grandTotal: number;
  readonly submitting: boolean;
}

export function CheckoutSummary({
  items,
  totalAmount,
  deliveryFee,
  grandTotal,
  submitting,
}: CheckoutSummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="sticky top-24 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <h2 className="border-b border-gray-100 pb-3 text-lg font-bold text-gray-900">
        {t("checkout.orderSummary")}
      </h2>

      <div className="max-h-60 space-y-3 divide-y divide-gray-50 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between pt-3 text-sm first:pt-0"
          >
            <div className="pr-2">
              <p className="max-w-45 truncate font-semibold text-gray-900">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatKg(item.weightKg)} kg ×{" "}
                {formatEuro(item.product.pricePerKg)} €
              </p>
            </div>
            <span className="font-bold whitespace-nowrap text-gray-800">
              {formatEuro(item.weightKg * item.product.pricePerKg)} €
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>{t("cart.subtotal")}</span>
          <span>{formatEuro(totalAmount)} €</span>
        </div>
        <div className="flex justify-between">
          <span>{t("cart.deliveryFee")}</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="font-bold text-emerald-600">
                {t("cart.freeDelivery")}
              </span>
            ) : (
              `${formatEuro(deliveryFee)} €`
            )}
          </span>
        </div>
      </div>

      <div className="text-primary flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-black">
        <span>{t("checkout.total")}</span>
        <span>{formatEuro(grandTotal)} €</span>
      </div>

      <button
        type="submit"
        form="checkout-form"
        disabled={submitting}
        className="bg-primary mt-4 flex w-full cursor-pointer items-center justify-center rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl disabled:opacity-50"
      >
        {submitting ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          t("checkout.placeOrder")
        )}
      </button>

      <div className="flex items-center justify-center space-x-2 pt-2 text-[11px] text-gray-500">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>{t("checkout.sslNotice")}</span>
      </div>
    </div>
  );
}
