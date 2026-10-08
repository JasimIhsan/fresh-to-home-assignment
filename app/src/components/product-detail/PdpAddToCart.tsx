"use client";

import { useLanguage } from "@/context/LanguageContext";
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
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 select-none shadow-xl ${
               isOffline
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                  : isAdded
                  ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-[0.99] cursor-pointer"
                  : "bg-primary hover:bg-purple-700 active:scale-[0.98] text-white shadow-primary/30 hover:shadow-primary/50 cursor-pointer"
            }`}
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
                     <span className="text-white/70 text-sm font-semibold border-l border-white/20 pl-3">
                        {calculatedPrice} €
                     </span>
                  )}
               </>
            )}
         </button>

         {/* Secondary Action */}
         <button
            className="w-full py-3 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-primary hover:border-primary/30 transition-all duration-200 cursor-pointer"
            aria-label={t("productDetail.wishlist")}
         >
            <Heart size={16} strokeWidth={2} />
            <span>{t("productDetail.wishlist")}</span>
         </button>

         {/* Weight context reminder */}
         <p className="text-center text-[11px] text-gray-400 font-medium">
            {t("productDetail.weightContext").replace(
               "{weight}",
               weight.toFixed(1).replace(".", ",")
            )}
         </p>
      </div>
   );
}
