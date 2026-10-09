"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingCart } from "lucide-react";

interface PdpStickyBarProps {
  calculatedPrice: string;
  isAdded: boolean;
  isLoggedIn: boolean;
  onAddToCart: () => void;
  productName: string;
  isOffline?: boolean;
}

export function PdpStickyBar({
  calculatedPrice,
  isAdded,
  isLoggedIn,
  onAddToCart,
  productName,
  isOffline = false,
}: PdpStickyBarProps) {
  const { t } = useLanguage();
  const { totalItemsCount } = useCart();

  return (
    <div
      className="safe-area-inset-bottom fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border-t border-gray-100 bg-white/95 px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur-xl md:hidden"
      role="region"
      aria-label={t("productDetail.addToCart")}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        {/* Price Chip */}
        <div className="shrink-0 text-right">
          <span className="mb-0.5 block text-[10px] leading-none font-semibold tracking-wider text-gray-400 uppercase">
            {t("productDetail.total")}
          </span>
          <span className="text-primary text-xl leading-none font-black tabular-nums">
            {calculatedPrice} €
          </span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onAddToCart}
          disabled={isOffline}
          className={`flex h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl text-[15px] font-bold shadow-lg transition-all duration-200 select-none ${
            isOffline
              ? "cursor-not-allowed bg-gray-200 text-gray-500 shadow-none"
              : isAdded
                ? "cursor-pointer bg-emerald-500 text-white shadow-emerald-500/40"
                : "bg-primary shadow-primary/40 cursor-pointer text-white hover:bg-purple-700 active:scale-[0.98]"
          }`}
          aria-live="polite"
          id="sticky-add-to-cart-btn"
        >
          {isOffline ? (
            <span>{t("network.cartOfflineBadge")}</span>
          ) : (
            <>
              <ShoppingCart size={19} strokeWidth={2.5} />
              <span>
                {isAdded
                  ? t("catalog.addedToCart")
                  : isLoggedIn
                    ? t("productDetail.addToCart")
                    : t("catalog.loginToOrder")}
              </span>
              {totalItemsCount > 0 && isLoggedIn && !isAdded && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-black text-white">
                  {totalItemsCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
