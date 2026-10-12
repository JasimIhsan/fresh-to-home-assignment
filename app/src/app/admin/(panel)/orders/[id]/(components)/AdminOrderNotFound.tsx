"use client";

import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function AdminOrderNotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-3xl border border-gray-100 bg-white p-12 text-center">
      <AlertCircle size={48} className="mx-auto text-gray-400" />
      <h2 className="text-xl font-bold text-gray-800">
        {t("orderDetail.orderNotFound")}
      </h2>
      <Link
        href="/admin/orders"
        className="bg-primary inline-block rounded-xl px-6 py-3 text-sm font-bold text-white"
      >
        {t("orderDetail.backToOrders")}
      </Link>
    </div>
  );
}
