"use client";

import { AuthCardWrapper } from "@/components/AuthCardWrapper";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { hasErrors, validateNewPassword } from "@/services";
import { authService } from "@/services/auth";
import { CheckCircle2, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const errors = validateNewPassword({ password, confirmPassword });
  const passwordError = touched && errors.password ? t(errors.password) : "";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (hasErrors(errors)) return;

    setLoading(true);
    setError(null);
    const result = await authService.updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError(result.error.message || t("resetPassword.error"));
      return;
    }
    setSuccess(true);
  };

  const inputClass = cn(
    "block w-full rounded-2xl border-2 bg-gray-50/70 py-3.5 pr-4 pl-11 text-sm text-gray-900 transition-all focus:outline-hidden",
    passwordError
      ? "border-red-400 bg-red-50/20 focus:border-red-500"
      : "focus:border-primary border-gray-100 focus:bg-white"
  );

  const renderBody = () => {
    if (authLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      );
    }

    if (success) {
      return (
        <div className="animate-fadeIn space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-emerald-950">
              {t("resetPassword.successTitle")}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">
              {t("resetPassword.successDesc")}
            </p>
          </div>
          <Link
            href="/catalog"
            className="bg-primary inline-block w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-95"
          >
            {t("resetPassword.continue")}
          </Link>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="space-y-4 text-center">
          <div className="text-secondary rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
            {t("resetPassword.invalidLink")}
          </div>
          <Link
            href="/forgot-password"
            className="bg-primary inline-block w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-95"
          >
            {t("resetPassword.requestNew")}
          </Link>
        </div>
      );
    }

    return (
      <form onSubmit={handleUpdate} noValidate className="space-y-5">
        {error && (
          <div className="text-secondary animate-fadeIn rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
            {error}
          </div>
        )}

        {[
          {
            label: t("resetPassword.newPassword"),
            value: password,
            setValue: setPassword,
            autoComplete: "new-password",
          },
          {
            label: t("resetPassword.confirmPassword"),
            value: confirmPassword,
            setValue: setConfirmPassword,
            autoComplete: "new-password",
          },
        ].map((field) => (
          <div key={field.label}>
            <label className="mb-2 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {field.label}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock
                  size={18}
                  className={cn(
                    passwordError ? "text-red-400" : "text-gray-400"
                  )}
                />
              </div>
              <input
                type="password"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                onBlur={() => setTouched(true)}
                autoComplete={field.autoComplete}
                maxLength={128}
                className={inputClass}
                placeholder={field.label}
                aria-invalid={!!passwordError}
              />
            </div>
          </div>
        ))}

        {passwordError && (
          <p className="animate-fadeIn -mt-2 ml-1 text-xs font-medium text-red-600">
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary shadow-primary/25 flex w-full cursor-pointer items-center justify-center rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            t("resetPassword.submit")
          )}
        </button>
      </form>
    );
  };

  return (
    <AuthCardWrapper
      title={t("resetPassword.title")}
      subtitle={t("resetPassword.subtitle")}
      backHref="/login"
      backLabel={t("forgotPassword.backToLogin")}
      badgeIcon={<KeyRound size={24} />}
    >
      {renderBody()}
    </AuthCardWrapper>
  );
}
