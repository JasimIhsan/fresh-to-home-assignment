"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface SignupFormFieldsProps {
   name: string;
   setName: (val: string) => void;
   email: string;
   setEmail: (val: string) => void;
   password: string;
   setPassword: (val: string) => void;
   showPassword: boolean;
   setShowPassword: (val: boolean) => void;
   consent: boolean;
   setConsent: (val: boolean) => void;
   nameError: string;
   emailError: string;
   passwordError: string;
   consentError: string;
   touched: {
      name?: boolean;
      email?: boolean;
      password?: boolean;
      consent?: boolean;
   };
   setTouched: React.Dispatch<
      React.SetStateAction<{
         name?: boolean;
         email?: boolean;
         password?: boolean;
         consent?: boolean;
      }>
   >;
   loading: boolean;
   onSubmit: (e: React.FormEvent) => void;
}

export function SignupFormFields({
   name,
   setName,
   email,
   setEmail,
   password,
   setPassword,
   showPassword,
   setShowPassword,
   consent,
   setConsent,
   nameError,
   emailError,
   passwordError,
   consentError,
   touched,
   setTouched,
   loading,
   onSubmit,
}: SignupFormFieldsProps) {
   const { t } = useLanguage();

   return (
      <form onSubmit={onSubmit} noValidate className="space-y-4">
         <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
               {t("signup.fullName")}
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon size={18} className={nameError ? "text-red-400" : "text-gray-400"} />
               </div>
               <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                     setName(e.target.value);
                     if (!touched.name) setTouched((prev) => ({ ...prev, name: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/70 border-2 rounded-2xl text-gray-900 text-sm focus:outline-hidden transition-all ${
                     nameError
                        ? "border-red-400 focus:border-red-500 bg-red-50/20"
                        : "border-gray-100 focus:border-primary focus:bg-white"
                  }`}
                  placeholder={t("signup.fullName")}
                  aria-invalid={!!nameError}
               />
            </div>
            {nameError && (
               <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{nameError}</p>
            )}
         </div>

         <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
               {t("login.email")}
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className={emailError ? "text-red-400" : "text-gray-400"} />
               </div>
               <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                     setEmail(e.target.value);
                     if (!touched.email) setTouched((prev) => ({ ...prev, email: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/70 border-2 rounded-2xl text-gray-900 text-sm focus:outline-hidden transition-all ${
                     emailError
                        ? "border-red-400 focus:border-red-500 bg-red-50/20"
                        : "border-gray-100 focus:border-primary focus:bg-white"
                  }`}
                  placeholder={t("login.email")}
                  aria-invalid={!!emailError}
               />
            </div>
            {emailError && (
               <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{emailError}</p>
            )}
         </div>

         <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
               {t("login.password")}
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className={passwordError ? "text-red-400" : "text-gray-400"} />
               </div>
               <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                     setPassword(e.target.value);
                     if (!touched.password) setTouched((prev) => ({ ...prev, password: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  className={`block w-full pl-11 pr-11 py-3.5 bg-gray-50/70 border-2 rounded-2xl text-gray-900 text-sm focus:outline-hidden transition-all ${
                     passwordError
                        ? "border-red-400 focus:border-red-500 bg-red-50/20"
                        : "border-gray-100 focus:border-primary focus:bg-white"
                  }`}
                  placeholder={t("login.password")}
                  aria-invalid={!!passwordError}
               />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-hidden cursor-pointer"
               >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>
            {passwordError && (
               <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{passwordError}</p>
            )}
         </div>

         <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer group select-none">
               <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                     setConsent(e.target.checked);
                     if (!touched.consent) setTouched((prev) => ({ ...prev, consent: true }));
                  }}
                  className={`mt-0.5 w-4 h-4 text-primary bg-white border-2 rounded focus:ring-primary cursor-pointer ${
                     consentError ? "border-red-400" : "border-gray-300"
                  }`}
               />
               <span className="text-xs text-gray-600 leading-relaxed">
                  {t("signup.consent")}{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-semibold">
                     {t("signup.privacyPolicy")}
                  </Link>{" "}
                  {t("signup.consentEnd")}
               </span>
            </label>
            {consentError && (
               <p className="mt-1.5 ml-6 text-xs text-red-600 font-medium animate-fadeIn">{consentError}</p>
            )}
         </div>

         <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex justify-center items-center mt-3 cursor-pointer"
         >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
               t("signup.submit")
            )}
         </button>
      </form>
   );
}
