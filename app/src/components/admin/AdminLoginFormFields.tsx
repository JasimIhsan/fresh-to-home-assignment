"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff, KeyRound, Lock, Shield, Sparkles } from "lucide-react";
import React from "react";

export interface AdminLoginFormFieldsProps {
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  identifierError: string;
  passwordError: string;
  touched: { identifier?: boolean; password?: boolean };
  setTouched: React.Dispatch<
    React.SetStateAction<{ identifier?: boolean; password?: boolean }>
  >;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPrefillDemo: () => void;
}

export function AdminLoginFormFields({
  identifier,
  setIdentifier,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  identifierError,
  passwordError,
  touched,
  setTouched,
  loading,
  onSubmit,
  onPrefillDemo,
}: AdminLoginFormFieldsProps) {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
          {t("adminLogin.usernameOrEmail")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <KeyRound size={17} />
          </div>
          <input
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (!touched.identifier)
                setTouched((prev) => ({ ...prev, identifier: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
            placeholder="admin or admin@freshtohome.de"
            className={`w-full rounded-xl border bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-hidden ${
              identifierError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary focus:ring-primary/10 border-slate-200 focus:ring-2"
            }`}
          />
        </div>
        {identifierError && (
          <p className="mt-1 ml-1 text-xs font-medium text-red-600">
            {identifierError}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
          {t("adminLogin.password")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock size={17} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!touched.password)
                setTouched((prev) => ({ ...prev, password: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            placeholder="••••••••••••"
            className={`w-full rounded-xl border bg-slate-50 py-3 pr-11 pl-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-hidden ${
              passwordError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary focus:ring-primary/10 border-slate-200 focus:ring-2"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeOff size={18} />
          </button>
        </div>
        {passwordError && (
          <p className="mt-1 ml-1 text-xs font-medium text-red-600">
            {passwordError}
          </p>
        )}
      </div>

      {/* Demo Credential Shortcut */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <button
          type="button"
          onClick={onPrefillDemo}
          className="text-primary inline-flex cursor-pointer items-center gap-1.5 font-semibold transition-colors hover:text-purple-700"
        >
          <Sparkles size={13} />
          <span>{t("adminLogin.prefillDemo")}</span>
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-primary shadow-primary/20 mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-purple-700 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>{t("adminLogin.loggingIn")}</span>
          </>
        ) : (
          <>
            <Shield size={16} />
            <span>{t("adminLogin.submit")}</span>
          </>
        )}
      </button>
    </form>
  );
}
