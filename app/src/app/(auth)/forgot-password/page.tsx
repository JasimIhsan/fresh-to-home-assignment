"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { CheckCircle2, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      if (!auth) {
        setSuccess(true);
      } else {
        const errMessage =
          err instanceof Error ? err.message : t("forgotPassword.error");
        setError(errMessage || t("forgotPassword.error"));
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
        <p className="text-sm text-gray-600">
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            {t("forgotPassword.backToLogin")}
          </Link>
        </p>
      }
    >
      {success ? (
        <div className="animate-fadeIn space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-emerald-950">
              {t("forgotPassword.successTitle")}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">
              {t("forgotPassword.successDesc")}
            </p>
          </div>
          <Link
            href="/login"
            className="bg-primary inline-block w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-95"
          >
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} noValidate className="space-y-5">
          {error && (
            <div className="text-secondary animate-fadeIn rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("login.email")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
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
                className={`block w-full rounded-2xl border-2 bg-gray-50/70 py-3.5 pr-4 pl-11 text-sm text-gray-900 transition-all focus:outline-hidden ${
                  emailError
                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                    : "focus:border-primary border-gray-100 focus:bg-white"
                }`}
                placeholder={t("login.email")}
                aria-invalid={!!emailError}
              />
            </div>
            {emailError && (
              <p className="animate-fadeIn mt-1.5 ml-1 text-xs font-medium text-red-600">
                {emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary shadow-primary/25 flex w-full cursor-pointer items-center justify-center rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              t("forgotPassword.sendResetLink")
            )}
          </button>
        </form>
      )}
    </AuthCardWrapper>
  );
}
