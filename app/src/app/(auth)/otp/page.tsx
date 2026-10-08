"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, CheckCircle2, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function OtpVerificationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  const [touched, setTouched] = useState(false);

  const getOtpError = () => {
    const raw = otp.join("");
    if (!raw) return t("validation.otpRequired");
    if (raw.length < 6) return t("validation.otpRequired");
    if (!/^\d{6}$/.test(raw)) return t("validation.otpInvalid");
    return "";
  };

  const otpError = touched ? getOtpError() : "";

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (!touched) setTouched(true);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const err = getOtpError();
    if (err) return;

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setTimeout(() => {
        router.push("/catalog");
      }, 1500);
    }, 1000);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setOtp(["", "", "", "", "", ""]);
      setTouched(false);
      document.getElementById("otp-input-0")?.focus();
    }, 1200);
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
            {t("otp.backToLogin")}
          </Link>

          <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner">
            <Smartphone size={28} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("otp.title")}
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {t("otp.subtitle")}
          </p>

          {verified ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg">{t("otp.successTitle")}</h3>
              <p className="text-xs text-emerald-700">
                {t("otp.successDesc")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} noValidate className="space-y-6">
              <div>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-input-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onBlur={() => setTouched(true)}
                      className={`w-12 h-14 text-center font-bold text-xl rounded-xl transition-all shadow-xs ${
                        otpError
                          ? "border-2 border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                          : "bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white"
                      }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="mt-2.5 text-center text-xs text-red-600 font-medium animate-fadeIn">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck size={18} />
                <span>{verifying ? t("otp.verifying") : t("otp.verifyButton")}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  {resending ? t("otp.resending") : t("otp.resendCode")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
  );
}
