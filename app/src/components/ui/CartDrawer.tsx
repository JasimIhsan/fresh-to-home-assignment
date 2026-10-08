"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, Lock, LogIn, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CartDrawer() {
   const { t } = useLanguage();
   const { user } = useAuth();
   const { items, isCartOpen, closeCart, updateWeight, removeFromCart, totalAmount, totalItemsCount } = useCart();
   const router = useRouter();

   // Manage body scroll lock
   useEffect(() => {
      if (isCartOpen) {
         const originalOverflow = document.body.style.overflow;
         document.body.style.overflow = "hidden";
         return () => {
            document.body.style.overflow = originalOverflow;
         };
      } else {
         document.body.style.overflow = "";
      }
   }, [isCartOpen]);

   // Handle Escape key to close drawer
   useEffect(() => {
      if (!isCartOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            closeCart();
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isCartOpen, closeCart]);

   const handleLoginClick = () => {
      closeCart();
      router.push("/login?redirect=/catalog");
   };

   const handleCheckoutClick = () => {
      closeCart();
      router.push("/checkout");
   };

   return (
      <div className={`fixed inset-0 z-50 flex justify-end overflow-hidden transition-all duration-300 ${isCartOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"}`} aria-hidden={!isCartOpen}>
         {/* Backdrop with Blur & Fade transition */}
         <div className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-in-out cursor-pointer ${isCartOpen ? "opacity-100" : "opacity-0"}`} onClick={closeCart} aria-hidden="true" />

         {/* Drawer Panel - 90% width on mobile, capped cleanly on larger screens with Slide In/Out transition */}
         <div className={`relative w-[90%] sm:w-110 max-w-[90vw] sm:max-w-110 bg-white h-full shadow-2xl flex flex-col z-10 rounded-l-3xl overflow-hidden transition-transform duration-300 ease-out transform will-change-transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-primary text-white shadow-md rounded-tl-3xl">
               <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                     <ShoppingBag size={20} className="text-white" />
                  </div>
                  <div className="min-w-0">
                     <h2 className="text-lg font-black tracking-tight text-white truncate">{t("cart.title")}</h2>
                     {user && totalItemsCount > 0 && (
                        <span className="text-xs text-white/80 font-medium">
                           {totalItemsCount} {t("cart.items")}
                        </span>
                     )}
                  </div>
               </div>
               <button onClick={closeCart} className="p-2 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer shrink-0" aria-label="Close cart">
                  <X size={20} />
               </button>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-gray-50/50">
               {!user ? (
                  /* Guest / Not logged in state */
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                     <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary shadow-inner">
                        <Lock size={30} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-900">{t("cart.notLoggedInTitle")}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xs">{t("cart.notLoggedInDesc")}</p>
                     </div>
                     <button onClick={handleLoginClick} className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3.5 px-5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md cursor-pointer">
                        <LogIn size={18} />
                        <span>{t("cart.loginButton")}</span>
                     </button>
                  </div>
               ) : items.length === 0 ? (
                  /* Empty Cart state */
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                     <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 shadow-xs">
                        <ShoppingBag size={28} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-800">{t("cart.empty")}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">{t("cart.emptyDesc")}</p>
                     </div>
                     <button onClick={closeCart} className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/15 text-primary font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
                        <Sparkles size={16} />
                        <span>{t("cart.browseProducts")}</span>
                     </button>
                  </div>
               ) : (
                  /* Items list */
                  <div className="space-y-3">
                     {items.map((item) => {
                        const itemTotal = item.product.pricePerKg * item.weightKg;
                        return (
                           <div key={item.product.id} className="p-3 sm:p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-primary/20 transition-all space-y-2.5">
                              <div className="flex items-start gap-3">
                                 {/* Item Image */}
                                 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                 </div>

                                 {/* Item Details */}
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-1">
                                       <h4 className="font-bold text-sm text-gray-900 truncate leading-snug">{item.product.name}</h4>
                                       <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-secondary p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0" title={t("cart.remove")} aria-label={t("cart.remove")}>
                                          <Trash2 size={15} />
                                       </button>
                                    </div>
                                    <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                                       {item.product.pricePerKg.toFixed(2).replace(".", ",")} {t("catalog.perKg")}
                                    </p>
                                 </div>
                              </div>

                              {/* Weight Stepper & Line Total */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                 <div className="flex items-center bg-gray-100/80 rounded-lg p-1 border border-gray-200/60">
                                    <button onClick={() => updateWeight(item.product.id, item.weightKg - 0.5)} className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-gray-700 hover:text-primary shadow-xs transition-colors cursor-pointer" aria-label="Decrease weight">
                                       <Minus size={13} />
                                    </button>
                                    <span className="text-xs font-bold text-gray-900 min-w-14 text-center px-1">{item.weightKg.toFixed(1).replace(".", ",")} kg</span>
                                    <button onClick={() => updateWeight(item.product.id, item.weightKg + 0.5)} className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-gray-700 hover:text-primary shadow-xs transition-colors cursor-pointer" aria-label="Increase weight">
                                       <Plus size={13} />
                                    </button>
                                 </div>

                                 <div className="text-right">
                                    <span className="text-sm sm:text-base font-black text-primary">{itemTotal.toFixed(2).replace(".", ",")} €</span>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               )}
            </div>

            {/* Footer */}
            {user && items.length > 0 && (
               <div className="p-4 sm:p-5 bg-white border-t border-gray-100 shadow-xl space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-semibold text-gray-500">{t("cart.total")}</span>
                     <span className="text-xl font-black text-primary tracking-tight">{totalAmount.toFixed(2).replace(".", ",")} €</span>
                  </div>
                  <button onClick={handleCheckoutClick} className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 sm:py-4 px-5 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-primary/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] cursor-pointer">
                     <span>{t("cart.checkout")}</span>
                     <ArrowRight size={18} />
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
