"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { createOrder } from "@/lib/store";
import { ArrowLeft, Banknote, Clock, CreditCard, FileText, MapPin, Phone, ShieldCheck, ShoppingBag, User } from "lucide-react";
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
         router.push(`/checkout/success?orderId=${newOrder.id}`);
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
                  <LanguageSwitcher />
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
                           {/* Address Section */}
                           <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4">
                              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                 <MapPin size={20} className="text-primary" />
                                 {t("checkout.deliveryAddress")}
                              </h2>

                              <div>
                                 <label className="block text-xs font-semibold text-gray-700 mb-1">{t("checkout.fullName")}</label>
                                 <div className="relative">
                                    <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${fullNameError ? "text-red-400" : "text-gray-400"}`} />
                                    <input
                                       type="text"
                                       value={fullName}
                                       onChange={(e) => {
                                          setFullName(e.target.value);
                                          if (!touched.fullName) setTouched((prev) => ({ ...prev, fullName: true }));
                                       }}
                                       onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                                       placeholder="Max Mustermann"
                                       className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${fullNameError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"}`}
                                       aria-invalid={!!fullNameError}
                                    />
                                 </div>
                                 {fullNameError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{fullNameError}</p>}
                              </div>

                              <div>
                                 <label className="block text-xs font-semibold text-gray-700 mb-1">{t("checkout.street")}</label>
                                 <input
                                    type="text"
                                    value={street}
                                    onChange={(e) => {
                                       setStreet(e.target.value);
                                       if (!touched.street) setTouched((prev) => ({ ...prev, street: true }));
                                    }}
                                    onBlur={() => setTouched((prev) => ({ ...prev, street: true }))}
                                    placeholder="Musterstraße 123"
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${streetError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"}`}
                                    aria-invalid={!!streetError}
                                 />
                                 {streetError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{streetError}</p>}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                 <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t("checkout.zip")}</label>
                                    <input
                                       type="text"
                                       value={zip}
                                       onChange={(e) => {
                                          setZip(e.target.value);
                                          if (!touched.zip) setTouched((prev) => ({ ...prev, zip: true }));
                                       }}
                                       onBlur={() => setTouched((prev) => ({ ...prev, zip: true }))}
                                       placeholder="10115"
                                       className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${zipError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"}`}
                                       aria-invalid={!!zipError}
                                    />
                                    {zipError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{zipError}</p>}
                                 </div>
                                 <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t("checkout.city")}</label>
                                    <input
                                       type="text"
                                       value={city}
                                       onChange={(e) => {
                                          setCity(e.target.value);
                                          if (!touched.city) setTouched((prev) => ({ ...prev, city: true }));
                                       }}
                                       onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
                                       placeholder="Berlin"
                                       className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${cityError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"}`}
                                       aria-invalid={!!cityError}
                                    />
                                    {cityError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{cityError}</p>}
                                 </div>
                              </div>

                              <div>
                                 <label className="block text-xs font-semibold text-gray-700 mb-1">{t("checkout.phone")}</label>
                                 <div className="relative">
                                    <Phone size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${phoneError ? "text-red-400" : "text-gray-400"}`} />
                                    <input
                                       type="tel"
                                       value={phone}
                                       onChange={(e) => {
                                          setPhone(e.target.value);
                                          if (!touched.phone) setTouched((prev) => ({ ...prev, phone: true }));
                                       }}
                                       onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                                       placeholder="+49 170 1234567"
                                       className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${phoneError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"}`}
                                       aria-invalid={!!phoneError}
                                    />
                                 </div>
                                 {phoneError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{phoneError}</p>}
                              </div>
                           </div>

                           {/* Delivery Slot Selection */}
                           <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4">
                              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                 <Clock size={20} className="text-primary" />
                                 {t("checkout.deliverySlot")}
                              </h2>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {[
                                    { id: "morning", label: t("checkout.slotMorning"), tag: "Standard" },
                                    { id: "afternoon", label: t("checkout.slotAfternoon"), tag: "Beliebt" },
                                    { id: "evening", label: t("checkout.slotEvening"), tag: "Standard" },
                                    { id: "express", label: t("checkout.slotExpress"), tag: "+2.00 €" },
                                 ].map((slot) => (
                                    <label key={slot.id} className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${deliverySlot === slot.id ? "border-primary bg-primary-light/40 text-primary font-bold shadow-xs" : "border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"}`}>
                                       <div className="flex items-center space-x-2.5">
                                          <input type="radio" name="deliverySlot" checked={deliverySlot === slot.id} onChange={() => setDeliverySlot(slot.id)} className="text-primary focus:ring-primary h-4 w-4" />
                                          <span className="text-xs sm:text-sm">{slot.label}</span>
                                       </div>
                                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600 font-semibold">{slot.tag}</span>
                                    </label>
                                 ))}
                              </div>
                           </div>

                           {/* Payment Method Placeholder Selection */}
                           <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4">
                              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                 <CreditCard size={20} className="text-primary" />
                                 {t("checkout.paymentMethod")}
                              </h2>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {[
                                    { id: "card", label: t("checkout.paymentCreditCard"), icon: <CreditCard size={18} /> },
                                    { id: "paypal", label: t("checkout.paymentPaypal"), icon: <span className="font-black text-xs">PP</span> },
                                    { id: "applepay", label: t("checkout.paymentApplePay"), icon: <span className="font-black text-xs">Pay</span> },
                                    { id: "cod", label: t("checkout.paymentCod"), icon: <Banknote size={18} /> },
                                 ].map((pay) => (
                                    <label key={pay.id} className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${paymentMethod === pay.id ? "border-primary bg-primary-light/40 text-primary font-bold shadow-xs" : "border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"}`}>
                                       <input type="radio" name="paymentMethod" checked={paymentMethod === pay.id} onChange={() => setPaymentMethod(pay.id)} className="text-primary focus:ring-primary h-4 w-4 shrink-0" />
                                       <span className="p-1.5 rounded-md bg-white text-gray-700 shadow-2xs shrink-0">{pay.icon}</span>
                                       <span className="text-xs sm:text-sm font-semibold truncate">{pay.label}</span>
                                    </label>
                                 ))}
                              </div>

                              <div>
                                 <label className="block text-xs font-semibold text-gray-700 mb-1">{t("checkout.notes")}</label>
                                 <div className="relative">
                                    <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                                    <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("checkout.notesPlaceholder")} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all" />
                                 </div>
                              </div>
                           </div>
                        </form>
                     </div>

                     {/* Right Column: Order Summary & Place Order CTA */}
                     <div className="md:col-span-1 space-y-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4 sticky top-24">
                           <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">{t("checkout.orderSummary")}</h2>

                           <div className="space-y-3 divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
                              {items.map((item) => (
                                 <div key={item.product.id} className="pt-3 first:pt-0 flex justify-between items-center text-sm">
                                    <div className="pr-2">
                                       <p className="font-semibold text-gray-900 truncate max-w-45">{item.product.name}</p>
                                       <p className="text-xs text-gray-500">
                                          {item.weightKg.toFixed(1).replace(".", ",")} kg × {item.product.pricePerKg.toFixed(2).replace(".", ",")} €
                                       </p>
                                    </div>
                                    <span className="font-bold text-gray-800 whitespace-nowrap">{(item.weightKg * item.product.pricePerKg).toFixed(2).replace(".", ",")} €</span>
                                 </div>
                              ))}
                           </div>

                           <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600">
                              <div className="flex justify-between">
                                 <span>{t("cart.subtotal")}</span>
                                 <span>{totalAmount.toFixed(2).replace(".", ",")} €</span>
                              </div>
                              <div className="flex justify-between">
                                 <span>{t("cart.deliveryFee")}</span>
                                 <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">{t("cart.freeDelivery")}</span> : `${deliveryFee.toFixed(2).replace(".", ",")} €`}</span>
                              </div>
                           </div>

                           <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-black text-primary">
                              <span>{t("checkout.total")}</span>
                              <span>{grandTotal.toFixed(2).replace(".", ",")} €</span>
                           </div>

                           <button type="submit" form="checkout-form" disabled={submitting} className="w-full mt-4 bg-primary hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center cursor-pointer">
                              {submitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t("checkout.placeOrder")}
                           </button>

                           <div className="flex items-center space-x-2 text-[11px] text-gray-500 justify-center pt-2">
                              <ShieldCheck size={14} className="text-emerald-600" />
                              <span>{t("checkout.sslNotice")}</span>
                           </div>
                        </div>
                     </div>
                  </>
               )}
            </main>
         </div>
      </AuthGuard>
   );
}
