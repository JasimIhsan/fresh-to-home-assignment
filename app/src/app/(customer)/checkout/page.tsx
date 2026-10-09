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
         <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-primary text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-40 md:hidden">
               <div className="flex justify-between items-center max-w-4xl mx-auto">
                  <Link href="/cart" className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center cursor-pointer">
                     <ArrowLeft size={22} />
                  </Link>
                  <h1 className="text-xl font-bold">{t("checkout.title")}</h1>
                  <div className="w-9" />
               </div>
            </header>

            <main className="p-6 md:px-0 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4">
               {items.length === 0 ? (
                  <div className="col-span-12 bg-white p-12 rounded-3xl shadow-xs border border-gray-100 text-center">
                     <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={32} />
                     </div>
                     <h2 className="text-xl font-bold text-gray-800 mb-2">{t("cart.empty")}</h2>
                     <Link href="/catalog" className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
                        {t("cart.browseProducts")}
                     </Link>
                  </div>
               ) : (
                  <>
                     {/* Left Column: Delivery & Payment Details */}
                     <div className="md:col-span-2 space-y-6">
                        <form id="checkout-form" onSubmit={handlePlaceOrder} noValidate className="space-y-6">
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

                           <CheckoutSlotSelector deliverySlot={deliverySlot} setDeliverySlot={setDeliverySlot} />

                           <CheckoutPaymentForm paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} notes={notes} setNotes={setNotes} />
                        </form>
                     </div>

                     {/* Right Column: Order Summary & Place Order CTA */}
                     <div className="md:col-span-1 space-y-4">
                        <CheckoutSummary items={items} totalAmount={totalAmount} deliveryFee={deliveryFee} grandTotal={grandTotal} submitting={submitting} />
                     </div>
                  </>
               )}
            </main>

            {/* Fullscreen Success Overlay */}
            {isSuccessOverlay && (
               <div className="fixed inset-0 z-50 bg-primary flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-300 select-none" role="status" aria-live="polite">
                  {/* Success Badge */}
                  <div className="relative mb-6">
                     {/* Soft ambient ring */}
                     <div className="absolute inset-0 rounded-full bg-white/20 animate-ping duration-1000" />
                     <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl shadow-black/25 animate-in zoom-in-75 duration-300">
                        <Check size={56} className="stroke-[3.5] text-primary" />
                     </div>
                  </div>

                  {/* Order placed successfully text */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 animate-in slide-in-from-bottom-4 duration-300 delay-100">{t("checkout.orderPlacedSuccessfully") || "Order placed successfully"}</h2>
                  <p className="text-white/80 text-sm sm:text-base font-medium max-w-sm animate-in slide-in-from-bottom-3 duration-300 delay-150">{t("checkout.orderSuccessDesc")}</p>
               </div>
            )}
         </div>
      </AuthGuard>
   );
}
