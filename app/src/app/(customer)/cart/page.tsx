"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { WeightStepper } from "@/components/ui/WeightStepper";
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight, ShieldCheck, Truck, ShoppingCart, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateWeight, removeFromCart, clearCart, totalAmount, totalItemsCount } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const FREE_SHIPPING_THRESHOLD = 50.0;
  const deliveryFee = totalAmount >= FREE_SHIPPING_THRESHOLD || totalAmount === 0 ? 0 : 4.90;
  const grandTotal = totalAmount + deliveryFee;
  const progressToFreeShipping = Math.min(100, Math.round((totalAmount / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Signature Brand Curved Header */}
      <header className="bg-primary text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors flex items-center cursor-pointer"
            aria-label={t("productDetail.back")}
          >
            <ArrowLeft size={22} />
          </button>

          <div className="text-center px-2 min-w-0">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white truncate">
              {t("cart.title")}
            </h1>
            {user && totalItemsCount > 0 && (
              <p className="text-xs text-white/80 mt-0.5 font-medium">
                {totalItemsCount} {t("cart.items")} • {totalAmount.toFixed(2).replace(".", ",")} €
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {!user ? (
          /* Guest / Not logged in state */
          <div className="bg-white p-8 sm:p-10 rounded-3xl text-center shadow-xs border border-gray-100 space-y-5">
            <div className="w-20 h-20 bg-primary-light rounded-3xl flex items-center justify-center text-primary mx-auto shadow-inner">
              <ShoppingBag size={38} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">{t("cart.notLoggedInTitle")}</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                {t("cart.notLoggedInDesc")}
              </p>
            </div>
            <Link
              href="/login?redirect=/cart"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-base"
            >
              <span>{t("cart.loginButton")}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart state */
          <div className="bg-white p-8 sm:p-12 rounded-3xl text-center shadow-xs border border-gray-100 space-y-5">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 mx-auto">
              <ShoppingCart size={38} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">{t("cart.empty")}</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                {t("cart.emptyDesc")}
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-base"
            >
              <Sparkles size={18} />
              <span>{t("cart.browseProducts")}</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress Card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 font-bold text-gray-800">
                  <Truck size={17} className="text-primary" />
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      {t("cart.freeDelivery")}
                    </span>
                  ) : (
                    <span>{t("cart.freeDeliveryThreshold")}</span>
                  )}
                </span>
                <span className="font-extrabold text-primary">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    amountNeededForFreeShipping === 0 ? "bg-emerald-500" : "bg-primary"
                  }`}
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
              {amountNeededForFreeShipping > 0 && (
                <p className="text-[11px] text-gray-500 text-right">
                  {amountNeededForFreeShipping.toFixed(2).replace(".", ",")} € bis zum kostenlosen Versand
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {items.length} {t("cart.items")}
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center space-x-1.5 cursor-pointer bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-xl"
                >
                  <Trash2 size={13} />
                  <span>{t("cart.clearCart")}</span>
                </button>
              </div>

              {items.map(({ product, weightKg }) => {
                const lineTotal = (product.pricePerKg * weightKg).toFixed(2).replace(".", ",");
                return (
                  <div
                    key={product.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-primary/20 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/catalog/${product.id}`}
                          className="font-black text-gray-900 hover:text-primary transition-colors text-base block truncate"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.category} • {product.pricePerKg.toFixed(2).replace(".", ",")} {t("catalog.perKg")}
                        </p>
                        <span className="text-sm sm:text-base font-black text-primary block mt-1">
                          {lineTotal} €
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
                      <WeightStepper
                        weight={weightKg}
                        onChange={(w) => updateWeight(product.id, w)}
                      />
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2.5 text-gray-400 hover:text-secondary hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title={t("cart.remove")}
                        aria-label={t("cart.remove")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Summary Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-black text-lg text-gray-900">{t("cart.orderSummary")}</h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-bold text-gray-900">{totalAmount.toFixed(2).replace(".", ",")} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center space-x-1.5">
                    <Truck size={15} className="text-primary" />
                    <span>{t("cart.deliveryFee")}</span>
                  </span>
                  <span className="font-bold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-extrabold">{t("cart.freeDelivery")}</span>
                    ) : (
                      `${deliveryFee.toFixed(2).replace(".", ",")} €`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-lg sm:text-xl font-black text-gray-900">
                  <span>{t("cart.total")}</span>
                  <span className="text-primary text-2xl tracking-tight">
                    {grandTotal.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all text-center block text-base sm:text-lg cursor-pointer active:scale-[0.99]"
              >
                {t("cart.checkout")}
              </Link>
            </div>

            {/* Quality assurance notice */}
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-2xl text-primary text-xs font-medium border border-purple-100/50">
              <ShieldCheck size={22} className="shrink-0 text-primary" />
              <span className="leading-relaxed">{t("cart.qualityNotice")}</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
