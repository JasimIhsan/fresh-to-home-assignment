"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Truck, MapPin, Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderById } from "@/lib/store";
import { Order } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";

function OrderConfirmationContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-50">
            <CheckCircle2 size={44} className="stroke-[2.5]" />
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            {t("checkout.orderConfirmed")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 mb-2">
            {t("checkout.orderSuccess")}
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {t("checkout.orderSuccessDesc")}
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 p-5 rounded-2xl text-left border border-gray-100 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs text-gray-400 font-medium">{t("checkout.orderNumber")}</span>
                <p className="font-bold text-gray-900 text-base">{order.id}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase">
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="flex items-start space-x-2 text-gray-700">
                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{order.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock size={16} className="text-gray-400 shrink-0" />
                <span>{order.deliverySlot || "Standard"}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm font-bold">
              <span className="text-gray-600">{t("checkout.total")}</span>
              <span className="text-primary text-base font-extrabold">
                {order.totalAmount.toFixed(2).replace(".", ",")} €
              </span>
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="space-y-3 pt-2">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="w-full py-4 bg-primary hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-base"
            >
              <Truck size={20} />
              <span>{t("checkout.trackOrder")}</span>
            </Link>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm transition-colors text-center"
            >
              {t("checkout.myOrders")}
            </Link>
            <Link
              href="/catalog"
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors text-center"
            >
              {t("checkout.backToCatalog")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
      <AuthGuard requireAuth>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <OrderConfirmationContent />
        </Suspense>
      </AuthGuard>
  );
}
