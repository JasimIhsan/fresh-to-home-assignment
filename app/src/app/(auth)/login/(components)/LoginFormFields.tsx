"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface LoginFormFieldsProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  emailError: string;
  passwordError: string;
  touched: { email?: boolean; password?: boolean };
  setTouched: React.Dispatch<
    React.SetStateAction<{ email?: boolean; password?: boolean }>
  >;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginFormFields({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  emailError,
  passwordError,
  touched,
  setTouched,
  loading,
  onSubmit,
}: Readonly<LoginFormFieldsProps>) {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
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
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (!touched.email)
                setTouched((prev) => ({ ...prev, email: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            className={cn(
              "block w-full rounded-2xl border-2 bg-gray-50/70 py-3.5 pr-4 pl-11 text-sm text-gray-900 transition-all focus:outline-hidden",
              emailError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-100 focus:bg-white"
            )}
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

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">
            {t("login.password")}
          </label>
          <Link
            href="/forgot-password"
            className="text-primary text-xs font-semibold hover:underline"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Lock
              size={18}
              className={passwordError ? "text-red-400" : "text-gray-400"}
            />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            maxLength={128}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!touched.password)
                setTouched((prev) => ({ ...prev, password: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            className={cn(
              "block w-full rounded-2xl border-2 bg-gray-50/70 py-3.5 pr-11 pl-11 text-sm text-gray-900 transition-all focus:outline-hidden",
              passwordError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-100 focus:bg-white"
            )}
            placeholder={t("login.password")}
            aria-invalid={!!passwordError}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-hidden"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError && (
          <p className="animate-fadeIn mt-1.5 ml-1 text-xs font-medium text-red-600">
            {passwordError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary shadow-primary/25 mt-2 flex w-full cursor-pointer items-center justify-center rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          t("login.submit")
        )}
      </button>
    </form>
  );
}
