"use client";

import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartFreeShippingBar } from "@/components/cart/CartFreeShippingBar";
import { CartHeader } from "@/components/cart/CartHeader";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartSummaryCard } from "@/components/cart/CartSummaryCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Trash2 } from "lucide-react";

export default function CartPage() {
   const { items, updateWeight, removeFromCart, clearCart, totalAmount, totalItemsCount, isOffline } = useCart();
   const { user } = useAuth();
   const { t } = useLanguage();

   const FREE_SHIPPING_THRESHOLD = 50.0;
   const deliveryFee = totalAmount >= FREE_SHIPPING_THRESHOLD || totalAmount === 0 ? 0 : 4.9;
   const grandTotal = totalAmount + deliveryFee;

   return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-background to-background pb-28">
         {/* Responsive Navigation Header */}
         <CartHeader
            totalItemsCount={totalItemsCount}
            totalAmount={totalAmount}
            isLoggedIn={!!user}
         />

         <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
            {isOffline && (
               <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
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
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                     {/* Left Column: Items List */}
                     <div className="lg:col-span-7 space-y-4">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider">
                              {items.length} {t("cart.items")}
                           </span>
                           <button
                              type="button"
                              onClick={clearCart}
                              disabled={isOffline}
                              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                     <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
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
