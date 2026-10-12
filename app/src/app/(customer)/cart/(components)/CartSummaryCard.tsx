"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

interface CartSummaryCardProps {
  readonly totalAmount: number;
  readonly deliveryFee: number;
  readonly grandTotal: number;
  readonly disabled?: boolean;
}

export function CartSummaryCard({
  totalAmount,
  deliveryFee,
  grandTotal,
  disabled = false,
}: CartSummaryCardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5 rounded-3xl border border-gray-100/90 bg-white p-6 shadow-xl shadow-purple-950/5 sm:p-7">
      <h3 className="text-lg font-black tracking-tight text-gray-900">
        {t("cart.orderSummary")}
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t("cart.subtotal")}</span>
          <span className="font-bold text-gray-900 tabular-nums">
            {totalAmount.toFixed(2).replace(".", ",")} €
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1.5">
            <Truck size={15} className="text-primary" />
            <span>{t("cart.deliveryFee")}</span>
          </span>
          <span className="font-bold">
            {deliveryFee === 0 ? (
              <span className="font-extrabold text-emerald-600">
                {t("cart.freeDelivery")}
              </span>
            ) : (
              <span className="text-gray-900 tabular-nums">
                {deliveryFee.toFixed(2).replace(".", ",")} €
              </span>
            )}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-gray-100 pt-3.5">
          <span className="text-base font-extrabold text-gray-900">
            {t("cart.total")}
          </span>
          <div className="text-right">
            <span className="text-primary text-2xl font-black tracking-tight tabular-nums sm:text-3xl">
              {grandTotal.toFixed(2).replace(".", ",")} €
            </span>
            <span className="block text-[11px] font-medium text-gray-400">
              inkl. MwSt. • Kühlversand
            </span>
          </div>
        </div>
      </div>

      {disabled ? (
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-gray-200 py-4 text-center text-base font-bold text-gray-500 opacity-80 transition-all"
        >
          <span>{t("network.cartOfflineBadge")}</span>
        </button>
      ) : (
        <Link
          href="/checkout"
          className="bg-primary shadow-primary/25 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-center text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-[0.99]"
        >
          <span>{t("cart.checkout")}</span>
          <ArrowRight size={18} />
        </Link>
      )}

      {/* Quality & Freshness Guarantee Badge */}
      <div className="text-primary flex items-center gap-3 rounded-2xl border border-purple-100/50 bg-purple-50/60 p-3.5 text-xs font-medium">
        <ShieldCheck size={20} className="text-primary shrink-0" />
        <span className="leading-tight">{t("cart.qualityNotice")}</span>
      </div>
    </div>
  );
}
