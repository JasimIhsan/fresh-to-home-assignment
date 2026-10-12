"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

type Touched = { email?: boolean; password?: boolean };

const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

export interface AdminLoginFormFieldsProps {
  readonly email: string;
  readonly setEmail: (val: string) => void;
  readonly password: string;
  readonly setPassword: (val: string) => void;
  readonly showPassword: boolean;
  readonly setShowPassword: (val: boolean) => void;
  readonly emailError: string;
  readonly passwordError: string;
  readonly touched: Touched;
  readonly setTouched: Dispatch<SetStateAction<Touched>>;
  readonly loading: boolean;
  readonly onSubmit: (e: FormEvent) => void;
}

export function AdminLoginFormFields({
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
}: AdminLoginFormFieldsProps) {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="admin-email"
          className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase"
        >
          {t("login.email")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Mail size={17} />
          </div>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            maxLength={MAX_EMAIL_LENGTH}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (!touched.email)
                setTouched((prev) => ({ ...prev, email: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            placeholder="admin@freshtohome.de"
            aria-invalid={!!emailError}
            className={cn(
              "w-full rounded-xl border bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-hidden",
              emailError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary focus:ring-primary/10 border-slate-200 focus:ring-2"
            )}
          />
        </div>
        {emailError && (
          <p className="mt-1 ml-1 text-xs font-medium text-red-600">
            {emailError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase"
        >
          {t("adminLogin.password")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock size={17} />
          </div>
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            maxLength={MAX_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!touched.password)
                setTouched((prev) => ({ ...prev, password: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            placeholder="••••••••••••"
            aria-invalid={!!passwordError}
            className={cn(
              "w-full rounded-xl border bg-slate-50 py-3 pr-11 pl-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-hidden",
              passwordError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary focus:ring-primary/10 border-slate-200 focus:ring-2"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError && (
          <p className="mt-1 ml-1 text-xs font-medium text-red-600">
            {passwordError}
          </p>
        )}
      </div>

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
