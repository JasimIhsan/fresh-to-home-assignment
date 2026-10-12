"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useLanguage } from "@/context/LanguageContext";
import { orderService } from "@/services";
import { Order } from "@/types";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function OrderConfirmationContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = orderService.getById(orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  const formattedDate = order
    ? new Date(order.createdAt).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Top Accent Hero Banner - Full Width on Web Screen */}
      <div className="from-primary/10 via-primary/5 relative bg-linear-to-b to-transparent px-4 pt-12 pb-16 text-center sm:px-6 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Animated Icon Pill */}
          <div className="animate-in zoom-in-75 inline-flex items-center justify-center rounded-3xl bg-emerald-500/10 p-3 text-emerald-600 shadow-sm ring-8 ring-emerald-500/5 duration-300 sm:p-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 sm:h-14 sm:w-14">
              <CheckCircle2 size={32} className="stroke-[2.5]" />
            </div>
          </div>

          <div>
            <span className="mb-3 inline-block rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-black tracking-wider text-emerald-700 uppercase">
              {t("checkout.orderConfirmed")}
            </span>
            <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl">
              {t("checkout.orderSuccess")}
            </h1>
            <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm leading-relaxed sm:text-base">
              {t("checkout.orderSuccessDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto -mt-6 max-w-4xl space-y-6 px-4 sm:px-6">
        {/* 2-Column Balanced Cards for Web */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {/* Left Card: Order Summary & Receipt */}
          <div className="bg-card text-card-foreground border-border flex flex-col justify-between space-y-5 rounded-3xl border p-6 shadow-sm sm:p-7">
            <div className="space-y-5">
              <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                    {t("checkout.orderNumber")}
                  </span>
                  <p className="text-foreground mt-0.5 font-mono text-lg font-black">
                    #{order?.id || orderId || "---"}
                  </p>
                </div>
                {order && (
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-extrabold tracking-wide uppercase">
                      {t(
                        `orders.status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`
                      ) || order.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Order Items Preview */}
              {order && order.items && order.items.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    {t("orderDetail.itemsTitle") || "Artikel"} (
                    {order.items.length})
                  </h2>
                  <div className="divide-border/60 max-h-64 divide-y overflow-y-auto pr-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 py-3 text-sm"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="border-border/80 h-12 w-12 shrink-0 rounded-xl border object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-foreground truncate font-bold">
                              {item.product.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {item.weightKg.toFixed(1).replace(".", ",")} kg ×{" "}
                              {item.product.pricePerKg
                                .toFixed(2)
                                .replace(".", ",")}{" "}
                              €/kg
                            </p>
                          </div>
                        </div>
                        <span className="text-foreground shrink-0 font-extrabold">
                          {(item.weightKg * item.product.pricePerKg)
                            .toFixed(2)
                            .replace(".", ",")}{" "}
                          €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Total Breakdown */}
            {order && (
              <div className="border-border mt-auto flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                    {t("checkout.total")}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    inkl. MwSt. & Kühlverpackung
                  </span>
                </div>
                <span className="text-primary text-2xl font-black">
                  {order.totalAmount.toFixed(2).replace(".", ",")} €
                </span>
              </div>
            )}
          </div>

          {/* Right Card: Delivery Info */}
          {order && (
            <div className="bg-card text-card-foreground border-border flex flex-col justify-between space-y-4 rounded-3xl border p-6 shadow-sm sm:p-7">
              <div className="space-y-4">
                <h2 className="text-foreground border-border flex items-center gap-2 border-b pb-3 text-sm font-bold tracking-wider uppercase">
                  <Truck size={17} className="text-primary" />
                  <span>
                    {t("orderDetail.deliveryDetails") || "Lieferdetails"}
                  </span>
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-muted-foreground mt-0.5 shrink-0"
                    />
                    <div>
                      <span className="text-foreground block font-bold">
                        {order.customerName}
                      </span>
                      <span className="text-muted-foreground block leading-relaxed">
                        {order.address}
                      </span>
                      {order.phone && (
                        <span className="text-muted-foreground/80 mt-0.5 block text-xs">
                          {order.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Clock
                      size={18}
                      className="text-muted-foreground shrink-0"
                    />
                    <div>
                      <span className="text-muted-foreground block text-xs">
                        {t("orderDetail.timeSlot")}
                      </span>
                      <span className="text-foreground font-semibold">
                        {order.deliverySlot || "Standard (08:00 - 12:00)"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <CreditCard
                      size={18}
                      className="text-muted-foreground shrink-0"
                    />
                    <div>
                      <span className="text-muted-foreground block text-xs">
                        {t("orderDetail.payment")}
                      </span>
                      <span className="text-foreground font-semibold">
                        {order.paymentMethod || "Kreditkarte"}
                      </span>
                    </div>
                  </div>

                  {formattedDate && (
                    <div className="flex items-center gap-3 pt-1">
                      <Calendar
                        size={18}
                        className="text-muted-foreground shrink-0"
                      />
                      <div>
                        <span className="text-muted-foreground block text-xs">
                          {t("orderDetail.placedOn") || "Bestelldatum"}
                        </span>
                        <span className="text-foreground font-semibold">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  )}

                  {order.notes && (
                    <div className="bg-muted/60 text-muted-foreground border-border mt-2 rounded-xl border p-3 text-xs">
                      <span className="text-foreground mb-0.5 block font-bold">
                        {t("orderDetail.customerNotes")}
                      </span>
                      <p className="italic">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust / Freshness Guarantee Banner */}
        <div className="bg-primary/5 border-primary/10 flex items-center justify-center gap-3 rounded-2xl border p-4 text-center sm:text-left">
          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <ShieldCheck size={22} />
          </div>
          <p className="text-foreground/80 text-xs leading-relaxed font-medium sm:text-sm">
            {t("checkout.sslNotice")}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="mx-auto max-w-xl space-y-3 pt-2">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="bg-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 text-center text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-98"
            >
              <Truck size={20} />
              <span>{t("checkout.trackOrder")}</span>
            </Link>
          )}

          <div className="flex gap-3">
            <Link
              href="/orders"
              className="flex-1 rounded-xl bg-gray-100 py-3 text-center text-sm font-bold text-gray-800 transition-colors hover:bg-gray-200"
            >
              {t("checkout.myOrders")}
            </Link>
            <Link
              href="/catalog"
              className="flex-1 rounded-xl border border-gray-200 py-3 text-center text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t("checkout.backToCatalog")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <AuthGuard requireAuth>
      <Suspense
        fallback={
          <div className="bg-background flex min-h-screen items-center justify-center">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        }
      >
        <OrderConfirmationContent />
      </Suspense>
    </AuthGuard>
  );
}
