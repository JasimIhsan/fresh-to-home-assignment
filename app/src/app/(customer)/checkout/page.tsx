"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CheckoutAddressForm } from "@/components/checkout/CheckoutAddressForm";
import { CheckoutPaymentForm } from "@/components/checkout/CheckoutPaymentForm";
import { CheckoutSlotSelector } from "@/components/checkout/CheckoutSlotSelector";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { createOrder } from "@/lib/store";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("morning");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccessOverlay, setIsSuccessOverlay] = useState(false);
  const [touched, setTouched] = useState<{
    fullName?: boolean;
    street?: boolean;
    zip?: boolean;
    city?: boolean;
    phone?: boolean;
  }>({});

  const deliveryFee = totalAmount > 50 || totalAmount === 0 ? 0 : 4.9;
  const grandTotal = totalAmount + deliveryFee;

  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,15}$/;

  const getFullNameError = () => {
    if (!fullName.trim()) return t("validation.nameRequired");
    if (fullName.trim().length < 2) return t("validation.nameMinLength");
    return "";
  };

  const getStreetError = () => {
    if (!street.trim()) return t("validation.streetRequired");
    return "";
  };

  const getZipError = () => {
    if (!zip.trim()) return t("validation.zipRequired");
    if (zip.trim().length < 3) return t("validation.zipRequired");
    return "";
  };

  const getCityError = () => {
    if (!city.trim()) return t("validation.cityRequired");
    return "";
  };

  const getPhoneError = () => {
    if (!phone.trim()) return t("validation.phoneRequired");
    if (!phoneRegex.test(phone.trim())) return t("validation.phoneInvalid");
    return "";
  };

  const fullNameError = touched.fullName ? getFullNameError() : "";
  const streetError = touched.street ? getStreetError() : "";
  const zipError = touched.zip ? getZipError() : "";
  const cityError = touched.city ? getCityError() : "";
  const phoneError = touched.phone ? getPhoneError() : "";

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      street: true,
      zip: true,
      city: true,
      phone: true,
    });

    const fnErr = getFullNameError();
    const strErr = getStreetError();
    const zipErr = getZipError();
    const cityErr = getCityError();
    const phErr = getPhoneError();

    if (fnErr || strErr || zipErr || cityErr || phErr) {
      return;
    }

    if (!user || items.length === 0) return;

    setSubmitting(true);
    try {
      const slotLabels: Record<string, string> = {
        morning: t("checkout.slotMorning"),
        afternoon: t("checkout.slotAfternoon"),
        evening: t("checkout.slotEvening"),
        express: t("checkout.slotExpress"),
      };

      const paymentLabels: Record<string, string> = {
        card: t("checkout.paymentCreditCard"),
        paypal: t("checkout.paymentPaypal"),
        applepay: t("checkout.paymentApplePay"),
        cod: t("checkout.paymentCod"),
      };

      const newOrder = createOrder({
        userId: user.uid,
        userEmail: user.email || "kunde@beispiel.de",
        customerName: fullName.trim() || user.email?.split("@")[0] || "Kunde",
        phone: phone.trim(),
        items,
        totalAmount: grandTotal,
        status: "pending",
        address: `${street.trim()}, ${zip.trim()} ${city.trim()}`,
        deliverySlot: slotLabels[deliverySlot] || deliverySlot,
        paymentMethod: paymentLabels[paymentMethod] || paymentMethod,
        notes,
      });

      clearCart();
      setIsSuccessOverlay(true);

      setTimeout(() => {
        router.push(`/checkout/success?orderId=${newOrder.id}`);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard requireAuth>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <header className="bg-primary sticky top-0 z-40 rounded-b-3xl p-6 text-white shadow-lg md:hidden">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <Link
              href="/cart"
              className="flex cursor-pointer items-center rounded-full p-2 transition-colors hover:bg-white/20"
            >
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-xl font-bold">{t("checkout.title")}</h1>
            <div className="w-9" />
          </div>
        </header>

        <main className="mx-auto mt-4 grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-3 md:gap-8 md:px-0">
          {items.length === 0 ? (
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
                    fullNameError={fullNameError}
                    streetError={streetError}
                    zipError={zipError}
                    cityError={cityError}
                    phoneError={phoneError}
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
                  submitting={submitting}
                />
              </div>
            </>
          )}
        </main>

        {/* Fullscreen Success Overlay */}
        {isSuccessOverlay && (
          <div
            className="bg-primary animate-in fade-in fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center text-white duration-300 select-none"
            role="status"
            aria-live="polite"
          >
            {/* Success Badge */}
            <div className="relative mb-6">
              {/* Soft ambient ring */}
              <div className="absolute inset-0 animate-ping rounded-full bg-white/20 duration-1000" />
              <div className="text-primary animate-in zoom-in-75 relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl shadow-black/25 duration-300 sm:h-28 sm:w-28">
                <Check size={56} className="text-primary stroke-[3.5]" />
              </div>
            </div>

            {/* Order placed successfully text */}
            <h2 className="animate-in slide-in-from-bottom-4 mb-2 text-2xl font-extrabold tracking-tight text-white delay-100 duration-300 sm:text-3xl">
              {t("checkout.orderPlacedSuccessfully") ||
                "Order placed successfully"}
            </h2>
            <p className="animate-in slide-in-from-bottom-3 max-w-sm text-sm font-medium text-white/80 delay-150 duration-300 sm:text-base">
              {t("checkout.orderSuccessDesc")}
            </p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
