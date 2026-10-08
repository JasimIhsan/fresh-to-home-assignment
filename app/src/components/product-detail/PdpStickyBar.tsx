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
}

export function PdpStickyBar({
   calculatedPrice,
   isAdded,
   isLoggedIn,
   onAddToCart,
}: PdpStickyBarProps) {
   const { t } = useLanguage();
   const { totalItemsCount } = useCart();

   return (
      <div
         className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 rounded-t-3xl shadow-2xl shadow-black/10 px-4 py-3 safe-area-inset-bottom"
         role="region"
         aria-label={t("productDetail.addToCart")}
      >
         <div className="flex items-center gap-3 max-w-lg mx-auto">
            {/* Price Chip */}
            <div className="flex-shrink-0 text-right">
               <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block leading-none mb-0.5">
                  {t("productDetail.total")}
               </span>
               <span className="text-xl font-black text-primary tabular-nums leading-none">
                  {calculatedPrice} €
               </span>
            </div>

            {/* Primary CTA */}
            <button
               onClick={onAddToCart}
               className={`flex-1 h-14 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-lg select-none ${
                  isAdded
                     ? "bg-emerald-500 text-white shadow-emerald-500/40"
                     : "bg-primary hover:bg-purple-700 active:scale-[0.98] text-white shadow-primary/40"
               }`}
               aria-live="polite"
               id="sticky-add-to-cart-btn"
            >
               <ShoppingCart size={19} strokeWidth={2.5} />
               <span>
                  {isAdded
                     ? t("catalog.addedToCart")
                     : isLoggedIn
                     ? t("productDetail.addToCart")
                     : t("catalog.loginToOrder")}
               </span>
               {totalItemsCount > 0 && isLoggedIn && !isAdded && (
                  <span className="ml-1 min-w-[20px] h-5 bg-white/20 text-white text-[11px] font-black rounded-full flex items-center justify-center px-1.5">
                     {totalItemsCount}
                  </span>
               )}
            </button>
         </div>
      </div>
   );
}
