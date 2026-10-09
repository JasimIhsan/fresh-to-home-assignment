"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface SignupFormFieldsProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  consent: boolean;
  setConsent: (val: boolean) => void;
  nameError: string;
  emailError: string;
  passwordError: string;
  consentError: string;
  touched: {
    name?: boolean;
    email?: boolean;
    password?: boolean;
    consent?: boolean;
  };
  setTouched: React.Dispatch<
    React.SetStateAction<{
      name?: boolean;
      email?: boolean;
      password?: boolean;
      consent?: boolean;
    }>
  >;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignupFormFields({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  consent,
  setConsent,
  nameError,
  emailError,
  passwordError,
  consentError,
  touched,
  setTouched,
  loading,
  onSubmit,
}: SignupFormFieldsProps) {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-bold tracking-wider text-gray-700 uppercase">
          {t("signup.fullName")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <UserIcon
              size={18}
              className={nameError ? "text-red-400" : "text-gray-400"}
            />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!touched.name)
                setTouched((prev) => ({ ...prev, name: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            className={`block w-full rounded-2xl border-2 bg-gray-50/70 py-3.5 pr-4 pl-11 text-sm text-gray-900 transition-all focus:outline-hidden ${
              nameError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-100 focus:bg-white"
            }`}
            placeholder={t("signup.fullName")}
            aria-invalid={!!nameError}
          />
        </div>
        {nameError && (
          <p className="animate-fadeIn mt-1.5 ml-1 text-xs font-medium text-red-600">
            {nameError}
          </p>
        )}
      </div>

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
              if (!touched.email)
                setTouched((prev) => ({ ...prev, email: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
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

      <div>
        <label className="mb-2 block text-xs font-bold tracking-wider text-gray-700 uppercase">
          {t("login.password")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Lock
              size={18}
              className={passwordError ? "text-red-400" : "text-gray-400"}
            />
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
            className={`block w-full rounded-2xl border-2 bg-gray-50/70 py-3.5 pr-11 pl-11 text-sm text-gray-900 transition-all focus:outline-hidden ${
              passwordError
                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                : "focus:border-primary border-gray-100 focus:bg-white"
            }`}
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

      <div className="pt-1">
        <label className="group flex cursor-pointer items-start gap-2.5 select-none">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (!touched.consent)
                setTouched((prev) => ({ ...prev, consent: true }));
            }}
            className={`text-primary focus:ring-primary mt-0.5 h-4 w-4 cursor-pointer rounded border-2 bg-white ${
              consentError ? "border-red-400" : "border-gray-300"
            }`}
          />
          <span className="text-xs leading-relaxed text-gray-600">
            {t("signup.consent")}{" "}
            <Link
              href="/privacy"
              className="text-primary font-semibold hover:underline"
            >
              {t("signup.privacyPolicy")}
            </Link>{" "}
            {t("signup.consentEnd")}
          </span>
        </label>
        {consentError && (
          <p className="animate-fadeIn mt-1.5 ml-6 text-xs font-medium text-red-600">
            {consentError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary shadow-primary/25 mt-3 flex w-full cursor-pointer items-center justify-center rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          t("signup.submit")
        )}
      </button>
    </form>
  );
}
