"use client";

import { placeOrder } from "@/app/actions/order.actions";
import {
  CheckoutAddressForm,
  type CheckoutTouched,
} from "./CheckoutAddressForm";
import { CheckoutPaymentForm } from "./CheckoutPaymentForm";
import { CheckoutSlotSelector } from "./CheckoutSlotSelector";
import { CheckoutSummary } from "./CheckoutSummary";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { hasErrors, validateCheckoutForm } from "@/services";
import { AlertCircle, ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const SLOT_LABEL_KEYS: Readonly<Record<string, string>> = {
  morning: "checkout.slotMorning",
  afternoon: "checkout.slotAfternoon",
  evening: "checkout.slotEvening",
  express: "checkout.slotExpress",
};

const PAYMENT_LABEL_KEYS: Readonly<Record<string, string>> = {
  card: "checkout.paymentCreditCard",
  paypal: "checkout.paymentPaypal",
  applepay: "checkout.paymentApplePay",
  cod: "checkout.paymentCod",
};

/** How long the success overlay shows before moving to the confirmation page. */
const SUCCESS_REDIRECT_MS = 3000;

export function CheckoutForm() {
  const { t } = useLanguage();
  const { items, totalAmount, deliveryFee, grandTotal, clearCart } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("morning");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState<CheckoutTouched>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Show the success overlay briefly, then open the confirmation page.
  useEffect(() => {
    if (!placedOrderId) return;
    const timer = setTimeout(() => {
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(placedOrderId)}`
      );
    }, SUCCESS_REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [placedOrderId, router]);

  const errors = validateCheckoutForm({ fullName, street, zip, city, phone });
  const fieldError = (field: keyof CheckoutTouched) => {
    const key = errors[field];
    return touched[field] && key ? t(key) : "";
  };

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      street: true,
      zip: true,
      city: true,
      phone: true,
    });
    if (hasErrors(errors) || items.length === 0) return;

    setSubmitError(null);
    startTransition(async () => {
      // The server re-validates and prices the order from the database;
      // only product ids and weights are sent.
      const result = await placeOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          weightKg: item.weightKg,
        })),
        fullName,
        street,
        zip,
        city,
        phone,
        deliverySlot: SLOT_LABEL_KEYS[deliverySlot]
          ? t(SLOT_LABEL_KEYS[deliverySlot])
          : deliverySlot,
        paymentMethod: PAYMENT_LABEL_KEYS[paymentMethod]
          ? t(PAYMENT_LABEL_KEYS[paymentMethod])
          : paymentMethod,
        notes,
      });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }
      clearCart();
      setPlacedOrderId(result.data.id);
    });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-primary sticky top-0 z-40 rounded-b-3xl p-6 text-white shadow-lg md:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/cart"
            aria-label={t("cart.title")}
            className="flex cursor-pointer items-center rounded-full p-2 transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-xl font-bold">{t("checkout.title")}</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="mx-auto mt-4 grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-3 md:gap-8 md:px-0">
        {items.length === 0 && !placedOrderId ? (
          <div className="col-span-12 rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <ShoppingBag size={32} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">
              {t("cart.empty")}
            </h2>
            <Link
              href="/catalog"
              className="bg-primary mt-4 inline-block rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              {t("cart.browseProducts")}
            </Link>
          </div>
        ) : (
          <>
            {/* Left Column: Delivery & Payment Details */}
            <div className="space-y-6 md:col-span-2">
              {submitError && (
                <div
                  role="alert"
                  className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form
                id="checkout-form"
                onSubmit={handlePlaceOrder}
                noValidate
                className="space-y-6"
              >
                <CheckoutAddressForm
                  fullName={fullName}
                  setFullName={setFullName}
                  street={street}
                  setStreet={setStreet}
                  zip={zip}
                  setZip={setZip}
                  city={city}
                  setCity={setCity}
                  phone={phone}
                  setPhone={setPhone}
                  touched={touched}
                  setTouched={setTouched}
                  fullNameError={fieldError("fullName")}
                  streetError={fieldError("street")}
                  zipError={fieldError("zip")}
                  cityError={fieldError("city")}
                  phoneError={fieldError("phone")}
                />

                <CheckoutSlotSelector
                  deliverySlot={deliverySlot}
                  setDeliverySlot={setDeliverySlot}
                />

                <CheckoutPaymentForm
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  notes={notes}
                  setNotes={setNotes}
                />
              </form>
            </div>

            {/* Right Column: Order Summary & Place Order CTA */}
            <div className="space-y-4 md:col-span-1">
              <CheckoutSummary
                items={items}
                totalAmount={totalAmount}
                deliveryFee={deliveryFee}
                grandTotal={grandTotal}
                submitting={isPending || !!placedOrderId}
              />
            </div>
          </>
        )}
      </main>

      {/* Fullscreen Success Overlay */}
      {placedOrderId && (
        <div
          className="bg-primary animate-in fade-in fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center text-white duration-300 select-none"
          role="status"
          aria-live="polite"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-white/20 duration-1000" />
            <div className="text-primary animate-in zoom-in-75 relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl shadow-black/25 duration-300 sm:h-28 sm:w-28">
              <Check size={56} className="text-primary stroke-[3.5]" />
            </div>
          </div>

          <h2 className="animate-in slide-in-from-bottom-4 mb-2 text-2xl font-extrabold tracking-tight text-white delay-100 duration-300 sm:text-3xl">
            {t("checkout.orderPlacedSuccessfully")}
          </h2>
          <p className="animate-in slide-in-from-bottom-3 max-w-sm text-sm font-medium text-white/80 delay-150 duration-300 sm:text-base">
            {t("checkout.orderSuccessDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
