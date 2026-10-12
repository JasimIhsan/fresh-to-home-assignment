"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { MapPin, Phone, User } from "lucide-react";

export interface CheckoutTouched {
  fullName?: boolean;
  street?: boolean;
  zip?: boolean;
  city?: boolean;
  phone?: boolean;
}

export interface CheckoutAddressFormProps {
  readonly fullName: string;
  readonly setFullName: (val: string) => void;
  readonly street: string;
  readonly setStreet: (val: string) => void;
  readonly zip: string;
  readonly setZip: (val: string) => void;
  readonly city: string;
  readonly setCity: (val: string) => void;
  readonly phone: string;
  readonly setPhone: (val: string) => void;
  readonly touched: Readonly<CheckoutTouched>;
  readonly setTouched: React.Dispatch<React.SetStateAction<CheckoutTouched>>;
  readonly fullNameError: string;
  readonly streetError: string;
  readonly zipError: string;
  readonly cityError: string;
  readonly phoneError: string;
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
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <MapPin size={20} className="text-primary" />
        {t("checkout.deliveryAddress")}
      </h2>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">
          {t("checkout.fullName")}
        </label>
        <div className="relative">
          <User
            size={16}
            className={cn(
              "absolute top-1/2 left-3.5 -translate-y-1/2",
              fullNameError ? "text-red-400" : "text-gray-400"
            )}
          />
          <input
            type="text"
            value={fullName}
            maxLength={120}
            onChange={(e) => {
              setFullName(e.target.value);
              if (!touched.fullName)
                setTouched((prev) => ({ ...prev, fullName: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
            placeholder="Max Mustermann"
            className={cn(
              "w-full rounded-xl border bg-gray-50 py-3 pr-4 pl-10 text-sm transition-all focus:bg-white focus:outline-hidden",
              fullNameError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-200"
            )}
            aria-invalid={!!fullNameError}
          />
        </div>
        {fullNameError && (
          <p className="animate-fadeIn mt-1 ml-1 text-xs font-medium text-red-600">
            {fullNameError}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">
          {t("checkout.street")}
        </label>
        <input
          type="text"
          value={street}
          maxLength={200}
          onChange={(e) => {
            setStreet(e.target.value);
            if (!touched.street)
              setTouched((prev) => ({ ...prev, street: true }));
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, street: true }))}
          placeholder="Musterstraße 123"
          className={cn(
            "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden",
            streetError
              ? "border-red-400 bg-red-50/20 focus:border-red-500"
              : "focus:border-primary border-gray-200"
          )}
          aria-invalid={!!streetError}
        />
        {streetError && (
          <p className="animate-fadeIn mt-1 ml-1 text-xs font-medium text-red-600">
            {streetError}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            {t("checkout.zip")}
          </label>
          <input
            type="text"
            value={zip}
            maxLength={12}
            onChange={(e) => {
              setZip(e.target.value);
              if (!touched.zip) setTouched((prev) => ({ ...prev, zip: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, zip: true }))}
            placeholder="10115"
            className={cn(
              "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden",
              zipError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-200"
            )}
            aria-invalid={!!zipError}
          />
          {zipError && (
            <p className="animate-fadeIn mt-1 ml-1 text-xs font-medium text-red-600">
              {zipError}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            {t("checkout.city")}
          </label>
          <input
            type="text"
            value={city}
            maxLength={80}
            onChange={(e) => {
              setCity(e.target.value);
              if (!touched.city)
                setTouched((prev) => ({ ...prev, city: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
            placeholder="Berlin"
            className={cn(
              "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden",
              cityError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-200"
            )}
            aria-invalid={!!cityError}
          />
          {cityError && (
            <p className="animate-fadeIn mt-1 ml-1 text-xs font-medium text-red-600">
              {cityError}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">
          {t("checkout.phone")}
        </label>
        <div className="relative">
          <Phone
            size={16}
            className={cn(
              "absolute top-1/2 left-3.5 -translate-y-1/2",
              phoneError ? "text-red-400" : "text-gray-400"
            )}
          />
          <input
            type="tel"
            value={phone}
            maxLength={40}
            onChange={(e) => {
              setPhone(e.target.value);
              if (!touched.phone)
                setTouched((prev) => ({ ...prev, phone: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            placeholder="+49 170 1234567"
            className={cn(
              "w-full rounded-xl border bg-gray-50 py-3 pr-4 pl-10 text-sm transition-all focus:bg-white focus:outline-hidden",
              phoneError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-200"
            )}
            aria-invalid={!!phoneError}
          />
        </div>
        {phoneError && (
          <p className="animate-fadeIn mt-1 ml-1 text-xs font-medium text-red-600">
            {phoneError}
          </p>
        )}
      </div>
    </div>
  );
}
