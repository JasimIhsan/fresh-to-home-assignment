"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Check, Heart, ShoppingCart } from "lucide-react";

interface PdpAddToCartProps {
  isAdded: boolean;
  isLoggedIn: boolean;
  calculatedPrice: string;
  onAddToCart: () => void;
  weight: number;
  isOffline?: boolean;
}

export function PdpAddToCart({
  isAdded,
  isLoggedIn,
  calculatedPrice,
  onAddToCart,
  weight,
  isOffline = false,
}: PdpAddToCartProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Primary CTA */}
      <button
        id="add-to-cart-btn"
        onClick={onAddToCart}
        disabled={isOffline}
        className={cn(
          "flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-bold shadow-xl transition-all duration-200 select-none",
          isOffline
            ? "cursor-not-allowed bg-gray-200 text-gray-500 shadow-none"
            : isAdded
              ? "scale-[0.99] cursor-pointer bg-emerald-500 text-white shadow-emerald-500/30"
              : "bg-primary shadow-primary/30 hover:shadow-primary/50 cursor-pointer text-white hover:bg-purple-700 active:scale-[0.98]"
        )}
        aria-live="polite"
      >
        {isOffline ? (
          <span>{t("network.cartOfflineBadge")}</span>
        ) : isAdded ? (
          <>
            <Check size={20} strokeWidth={3} />
            <span>{t("catalog.addedToCart")}</span>
          </>
        ) : (
          <>
            <ShoppingCart size={20} strokeWidth={2.5} />
            <span>
              {isLoggedIn
                ? t("productDetail.addToCart")
                : t("catalog.loginToOrder")}
            </span>
            {isLoggedIn && (
              <span className="border-l border-white/20 pl-3 text-sm font-semibold text-white/70">
                {calculatedPrice} €
              </span>
            )}
          </>
        )}
      </button>

      {/* Secondary Action */}
      <button
        className="hover:text-primary hover:border-primary/30 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-50"
        aria-label={t("productDetail.wishlist")}
      >
        <Heart size={16} strokeWidth={2} />
        <span>{t("productDetail.wishlist")}</span>
      </button>

      {/* Weight context reminder */}
      <p className="text-center text-[11px] font-medium text-gray-400">
        {t("productDetail.weightContext").replace(
          "{weight}",
          weight.toFixed(1).replace(".", ",")
        )}
      </p>
    </div>
  );
}
