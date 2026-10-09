"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, RotateCw, ShieldCheck, Smartphone } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
    <AuthCardWrapper
      title={t("otp.title")}
      subtitle={t("otp.subtitle")}
      backHref="/login"
      backLabel={t("otp.backToLogin")}
      badgeIcon={<Smartphone size={24} />}
      footer={
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold hover:underline disabled:opacity-50"
          >
            <RotateCw size={14} className={resending ? "animate-spin" : ""} />
            <span>{resending ? t("otp.resending") : t("otp.resendCode")}</span>
          </button>
        </div>
      }
    >
      {verified ? (
        <div className="animate-fadeIn space-y-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="text-base font-extrabold text-emerald-950">
            {t("otp.successTitle")}
          </h3>
          <p className="text-xs leading-relaxed text-emerald-700">
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
                  className={`h-14 w-12 rounded-2xl text-center text-xl font-black shadow-xs transition-all ${
                    otpError
                      ? "border-2 border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                      : "focus:border-primary border-2 border-gray-100 bg-gray-50/80 text-gray-900 focus:bg-white"
                  }`}
                />
              ))}
            </div>
            {otpError && (
              <p className="animate-fadeIn mt-2.5 text-center text-xs font-medium text-red-600">
                {otpError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="bg-primary shadow-primary/25 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
          >
            <ShieldCheck size={18} />
            <span>
              {verifying ? t("otp.verifying") : t("otp.verifyButton")}
            </span>
          </button>
        </form>
      )}
    </AuthCardWrapper>
  );
}
