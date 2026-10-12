"use client";

import { CartEmptyState } from "./CartEmptyState";
import { CartFreeShippingBar } from "./CartFreeShippingBar";
import { CartHeader } from "./CartHeader";
import { CartItemCard } from "./CartItemCard";
import { CartSummaryCard } from "./CartSummaryCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { FREE_SHIPPING_THRESHOLD } from "@/services";
import { Trash2 } from "lucide-react";

export function CartView() {
  const {
    items,
    updateWeight,
    removeFromCart,
    clearCart,
    totalAmount,
    deliveryFee,
    grandTotal,
    totalItemsCount,
    isOffline,
  } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="via-background to-background min-h-screen bg-linear-to-b from-purple-50/40 pb-28">
      {/* Responsive Navigation Header */}
      <CartHeader
        totalItemsCount={totalItemsCount}
        totalAmount={totalAmount}
        isLoggedIn={!!user}
      />

      <main className="mx-auto max-w-5xl px-4 pt-4 sm:px-6 sm:pt-6">
        {isOffline && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900 sm:text-sm">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-amber-500" />
            <span>{t("network.cartOfflineNotice")}</span>
          </div>
        )}

        {!user ? (
          <CartEmptyState isGuest />
        ) : items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="space-y-6">
            {/* Gamified Free Delivery Threshold Meter */}
            <CartFreeShippingBar
              totalAmount={totalAmount}
              threshold={FREE_SHIPPING_THRESHOLD}
            />

            {/* Responsive 2-Column Desktop Grid / 1-Column Mobile */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Items List */}
              <div className="space-y-4 lg:col-span-7">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-extrabold tracking-wider text-gray-500 uppercase sm:text-sm">
                    {items.length} {t("cart.items")}
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    disabled={isOffline}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100/80 hover:text-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    <span>{t("cart.clearCart")}</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {items.map(({ product, weightKg }) => (
                    <CartItemCard
                      key={product.id}
                      product={product}
                      weightKg={weightKg}
                      onUpdateWeight={(w) => updateWeight(product.id, w)}
                      onRemove={() => removeFromCart(product.id)}
                      disabled={isOffline}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Order Summary Card (Sticky on desktop) */}
              <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
                <CartSummaryCard
                  totalAmount={totalAmount}
                  deliveryFee={deliveryFee}
                  grandTotal={grandTotal}
                  disabled={isOffline}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
