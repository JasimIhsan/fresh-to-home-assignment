"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { CheckCircle2, KeyRound, Mail, Smartphone } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
   const { t } = useLanguage();
   const [email, setEmail] = useState("");
   const [touched, setTouched] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const getEmailError = () => {
      if (!email.trim()) return t("validation.emailRequired");
      if (!emailRegex.test(email.trim())) return t("validation.emailInvalid");
      return "";
   };

   const emailError = touched ? getEmailError() : "";

   const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);

      const err = getEmailError();
      if (err) return;

      setLoading(true);
      setError(null);
      try {
         if (auth) {
            await sendPasswordResetEmail(auth, email.trim());
         }
         setSuccess(true);
      } catch (err: any) {
         console.error("Password reset error:", err);
         if (!auth) {
            setSuccess(true);
         } else {
            setError(err.message || t("forgotPassword.error"));
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <AuthCardWrapper
         title={t("forgotPassword.title")}
         subtitle={t("forgotPassword.subtitle")}
         backHref="/login"
         backLabel={t("forgotPassword.backToLogin")}
         badgeIcon={<KeyRound size={24} />}
         footer={
            <div className="text-center">
               <Link
                  href="/otp"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group"
               >
                  <Smartphone size={15} />
                  <span>{t("forgotPassword.otpLink")}</span>
               </Link>
            </div>
         }
      >
         {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-3 animate-fadeIn">
               <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 size={28} />
               </div>
               <h3 className="font-extrabold text-emerald-950 text-base">
                  {t("forgotPassword.successTitle")}
               </h3>
               <p className="text-xs text-emerald-700 leading-relaxed">
                  {t("forgotPassword.successDesc")}
               </p>
               <Link
                  href="/login"
                  className="block w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-md mt-4"
               >
                  {t("forgotPassword.backToLogin")}
               </Link>
            </div>
         ) : (
            <form onSubmit={handleReset} noValidate className="space-y-4">
               {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium animate-fadeIn">
                     {error}
                  </div>
               )}

               <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                     {t("login.email")}
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail
                           size={18}
                           className={emailError ? "text-red-400" : "text-gray-400"}
                        />
                     </div>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           if (!touched) setTouched(true);
                        }}
                        onBlur={() => setTouched(true)}
                        placeholder="ihre-email@beispiel.de"
                        className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/70 border-2 rounded-2xl text-gray-900 text-sm focus:outline-hidden transition-all ${
                           emailError
                              ? "border-red-400 focus:border-red-500 bg-red-50/20"
                              : "border-gray-100 focus:border-primary focus:bg-white"
                        }`}
                        aria-invalid={!!emailError}
                     />
                  </div>
                  {emailError && (
                     <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">
                        {emailError}
                     </p>
                  )}
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:opacity-95 active:scale-[0.99] transition-all text-base flex items-center justify-center disabled:opacity-50 mt-3 cursor-pointer"
               >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                     t("forgotPassword.sendLink")
                  )}
               </button>
            </form>
         )}
      </AuthCardWrapper>
   );
}
