"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { isOptimizableImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Lock,
  LogIn,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CartDrawer() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    items,
    isCartOpen,
    closeCart,
    updateWeight,
    removeFromCart,
    totalAmount,
    totalItemsCount,
  } = useCart();
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
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end overflow-hidden transition-all duration-300",
        isCartOpen
          ? "pointer-events-auto visible"
          : "pointer-events-none invisible delay-300"
      )}
      aria-hidden={!isCartOpen}
    >
      {/* Backdrop with Blur & Fade transition */}
      <div
        className={cn(
          "fixed inset-0 cursor-pointer bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-in-out",
          isCartOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel - 90% width on mobile, capped cleanly on larger screens with Slide In/Out transition */}
      <div
        className={cn(
          "relative z-10 flex h-full w-[90%] max-w-[90vw] transform flex-col overflow-hidden rounded-l-3xl bg-white shadow-2xl transition-transform duration-300 ease-out will-change-transform sm:w-110 sm:max-w-110",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="bg-primary flex items-center justify-between rounded-tl-3xl p-5 text-white shadow-md">
          <div className="flex min-w-0 items-center space-x-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black tracking-tight text-white">
                {t("cart.title")}
              </h2>
              {user && totalItemsCount > 0 && (
                <span className="text-xs font-medium text-white/80">
                  {totalItemsCount} {t("cart.items")}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={closeCart}
            className="shrink-0 cursor-pointer rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 space-y-3.5 overflow-y-auto bg-gray-50/50 p-4 sm:p-5">
          {!user ? (
            /* Guest / Not logged in state */
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-4 text-center">
              <div className="bg-primary-light text-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner">
                <Lock size={30} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {t("cart.notLoggedInTitle")}
                </h3>
                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-gray-500 sm:text-sm">
                  {t("cart.notLoggedInDesc")}
                </p>
              </div>
              <button
                onClick={handleLoginClick}
                className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-xl px-5 py-3.5 font-bold text-white shadow-md transition-all"
              >
                <LogIn size={18} />
                <span>{t("cart.loginButton")}</span>
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart state */
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400 shadow-xs">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {t("cart.empty")}
                </h3>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-500 sm:text-sm">
                  {t("cart.emptyDesc")}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="bg-primary/10 hover:bg-primary/15 text-primary inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors sm:text-sm"
              >
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
                  <div
                    key={item.product.id}
                    className="hover:border-primary/20 space-y-2.5 rounded-2xl border border-gray-100 bg-white p-3 shadow-xs transition-all sm:p-3.5"
                  >
                    <div className="flex items-start gap-3">
                      {/* Item Image */}
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100 sm:h-16 sm:w-16">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          sizes="64px"
                          unoptimized={
                            !isOptimizableImage(item.product.imageUrl)
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="truncate text-sm leading-snug font-bold text-gray-900">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="hover:text-secondary shrink-0 cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-50"
                            title={t("cart.remove")}
                            aria-label={t("cart.remove")}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                          {item.product.pricePerKg.toFixed(2).replace(".", ",")}{" "}
                          {t("catalog.perKg")}
                        </p>
                      </div>
                    </div>

                    {/* Weight Stepper & Line Total */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                      <div className="flex items-center rounded-lg border border-gray-200/60 bg-gray-100/80 p-1">
                        <button
                          onClick={() =>
                            updateWeight(item.product.id, item.weightKg - 0.5)
                          }
                          className="hover:text-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-white text-gray-700 shadow-xs transition-colors"
                          aria-label="Decrease weight"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="min-w-14 px-1 text-center text-xs font-bold text-gray-900">
                          {item.weightKg.toFixed(1).replace(".", ",")} kg
                        </span>
                        <button
                          onClick={() =>
                            updateWeight(item.product.id, item.weightKg + 0.5)
                          }
                          className="hover:text-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-white text-gray-700 shadow-xs transition-colors"
                          aria-label="Increase weight"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-primary text-sm font-black sm:text-base">
                          {itemTotal.toFixed(2).replace(".", ",")} €
                        </span>
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
          <div className="space-y-3 border-t border-gray-100 bg-white p-4 shadow-xl sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">
                {t("cart.total")}
              </span>
              <span className="text-primary text-xl font-black tracking-tight">
                {totalAmount.toFixed(2).replace(".", ",")} €
              </span>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="bg-primary hover:bg-primary/95 shadow-primary/25 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.99] sm:py-4 sm:text-base"
            >
              <span>{t("cart.checkout")}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
