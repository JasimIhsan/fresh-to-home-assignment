"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, Smartphone } from "lucide-react";
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
      // Even in mock or error mode, show success for demonstration if firebase credentials not configured
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
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-background relative">
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-primary rounded-full shadow-lg">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            {t("forgotPassword.backToLogin")}
          </Link>

          <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner">
            <KeyRound size={28} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("forgotPassword.title")}
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {t("forgotPassword.subtitle")}
          </p>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900">
                {t("forgotPassword.successTitle")}
              </h3>
              <p className="text-xs text-emerald-700">
                {t("forgotPassword.successDesc")}
              </p>
              <Link
                href="/login"
                className="block w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all mt-4"
              >
                {t("forgotPassword.backToLogin")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} noValidate className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      emailError ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!touched) setTouched(true);
                    }}
                    onBlur={() => setTouched(true)}
                    placeholder="ihre-email@beispiel.de"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${
                      emailError
                        ? "border-red-400 focus:border-red-500 bg-red-50/20"
                        : "border-gray-200 focus:border-primary"
                    }`}
                    aria-invalid={!!emailError}
                  />
                </div>
                {emailError && (
                  <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition-all text-sm flex items-center justify-center disabled:opacity-50 cursor-pointer"
              >
                {loading ? t("forgotPassword.sending") : t("forgotPassword.sendLink")}
              </button>

              <div className="pt-4 border-t border-gray-100 text-center">
                <Link
                  href="/otp"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline space-x-1"
                >
                  <Smartphone size={14} className="mr-1" />
                  <span>{t("forgotPassword.otpLink")}</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
  );
}
