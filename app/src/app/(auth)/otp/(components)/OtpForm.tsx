"use client";

import { resendSignupOtp, verifySignupOtp } from "@/app/actions/auth.actions";
import { AuthCardWrapper } from "@/components/AuthCardWrapper";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { OTP_LENGTH, validateOtp } from "@/services";
import { CheckCircle2, MailCheck, RotateCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { authErrorKey } from "../../(components)/auth-error-key";

const EMPTY_OTP: readonly string[] = Array.from(
  { length: OTP_LENGTH },
  () => ""
);

/** Matches Supabase's per-address window between confirmation emails. */
const RESEND_COOLDOWN_SECONDS = 60;

interface OtpFormProps {
  readonly email: string;
  /** Same-origin path to continue to once the account is verified. */
  readonly redirectTo: string;
  /** True when a code was sent right before landing here (fresh sign up). */
  readonly codeJustSent: boolean;
}

export function OtpForm({ email, redirectTo, codeJustSent }: OtpFormProps) {
  const { t } = useLanguage();
  const { syncSession } = useAuth();
  const router = useRouter();
  const [otp, setOtp] = useState<readonly string[]>(EMPTY_OTP);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(
    codeJustSent ? RESEND_COOLDOWN_SECONDS : 0
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const code = otp.join("");
  const otpErrorKey = validateOtp(code);
  const otpError = touched && otpErrorKey ? t(otpErrorKey) : "";

  const focusInput = (index: number) =>
    document.getElementById(`otp-input-${index}`)?.focus();

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const next = [...otp];
    if (value.length > 1) {
      // Pasted or autofilled code: spread the digits across the inputs
      const digits = value.slice(0, OTP_LENGTH - index).split("");
      digits.forEach((digit, offset) => (next[index + offset] = digit));
      setOtp(next);
      focusInput(Math.min(index + digits.length, OTP_LENGTH - 1));
    } else {
      next[index] = value;
      setOtp(next);
      if (value && index < OTP_LENGTH - 1) focusInput(index + 1);
    }
    if (!touched) setTouched(true);
    setError("");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (otpErrorKey) return;

    setVerifying(true);
    setError("");
    setNotice("");
    const result = await verifySignupOtp({ email, token: code });

    if (!result.success) {
      setVerifying(false);
      setError(t(authErrorKey(result.error)));
      return;
    }

    await syncSession();
    setVerifying(false);
    setVerified(true);
    router.replace(redirectTo);
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setNotice("");
    const result = await resendSignupOtp({ email });
    setResending(false);

    if (!result.success) {
      setError(t(authErrorKey(result.error)));
      if (result.error === "resend_cooldown") {
        setCooldown(RESEND_COOLDOWN_SECONDS);
      }
      return;
    }
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setOtp(EMPTY_OTP);
    setTouched(false);
    setNotice(t("otp.resent"));
    focusInput(0);
  };

  return (
    <AuthCardWrapper
      title={t("otp.title")}
      subtitle={t("otp.subtitle")}
      backHref="/signup"
      backLabel={t("otp.backToSignup")}
      badgeIcon={<MailCheck size={24} />}
      footer={
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || verified || cooldown > 0}
            className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold hover:underline disabled:opacity-50"
          >
            <RotateCw size={14} className={cn(resending && "animate-spin")} />
            <span aria-live="polite">
              {resending
                ? t("otp.resending")
                : cooldown > 0
                  ? t("otp.resendIn").replace("{seconds}", String(cooldown))
                  : t("otp.resendCode")}
            </span>
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
          <p className="truncate text-center text-sm font-bold text-gray-900">
            {email}
          </p>

          {error && (
            <div className="text-secondary animate-fadeIn rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
              {error}
            </div>
          )}
          {notice && (
            <div className="animate-fadeIn rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              {notice}
            </div>
          )}

          <div>
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={OTP_LENGTH}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onBlur={() => setTouched(true)}
                  aria-label={`${t("otp.title")} ${i + 1}`}
                  className={cn(
                    "h-14 w-12 rounded-2xl text-center text-xl font-black shadow-xs transition-all",
                    otpError
                      ? "border-2 border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                      : "focus:border-primary border-2 border-gray-100 bg-gray-50/80 text-gray-900 focus:bg-white"
                  )}
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
