"use client";

import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, User } from "lucide-react";

export interface CheckoutAddressFormProps {
   fullName: string;
   setFullName: (val: string) => void;
   street: string;
   setStreet: (val: string) => void;
   zip: string;
   setZip: (val: string) => void;
   city: string;
   setCity: (val: string) => void;
   phone: string;
   setPhone: (val: string) => void;
   touched: {
      fullName?: boolean;
      street?: boolean;
      zip?: boolean;
      city?: boolean;
      phone?: boolean;
   };
   setTouched: React.Dispatch<
      React.SetStateAction<{
         fullName?: boolean;
         street?: boolean;
         zip?: boolean;
         city?: boolean;
         phone?: boolean;
      }>
   >;
   fullNameError: string;
   streetError: string;
   zipError: string;
   cityError: string;
   phoneError: string;
}

export function CheckoutAddressForm({
   fullName,
   setFullName,
   street,
   setStreet,
   zip,
   setZip,
   city,
   setCity,
   phone,
   setPhone,
   touched,
   setTouched,
   fullNameError,
   streetError,
   zipError,
   cityError,
   phoneError,
}: CheckoutAddressFormProps) {
   const { t } = useLanguage();

   return (
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
   );
}
