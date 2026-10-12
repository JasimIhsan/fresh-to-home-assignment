"use client";

import { AdminLoginFormFields } from "@/components/admin/AdminLoginFormFields";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { authService } from "@/services";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AdminLoginForm() {
  const { t } = useLanguage();
  const { isAdmin, loginAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{
    identifier?: boolean;
    password?: boolean;
  }>({});

  useEffect(() => {
    if (isAdmin) {
      router.replace(redirectUrl);
    }
  }, [isAdmin, redirectUrl, router]);

  const getIdentifierError = () => {
    if (!identifier.trim())
      return (
        t("validation.emailRequired") || "Please enter username or admin email."
      );
    return "";
  };

  const getPasswordError = () => {
    if (!password)
      return t("validation.passwordRequired") || "Please enter your password.";
    return "";
  };

  const identifierError = touched.identifier ? getIdentifierError() : "";
  const passwordError = touched.password ? getPasswordError() : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ identifier: true, password: true });

    const idErr = getIdentifierError();
    const passErr = getPasswordError();
    if (idErr || passErr) return;

    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(identifier.trim(), password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setError(t("adminLogin.error"));
      }
    } catch {
      setError(t("adminLogin.error"));
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillDemo = () => {
    const demo = authService.getAdminDemoCredentials();
    setIdentifier(demo.username);
    setPassword(demo.password);
    setTouched({ identifier: true, password: true });
    setError("");
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 p-4 font-sans sm:p-8">
      {/* Top ambient decor matching admin layout */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-purple-100/60 via-purple-50/30 to-transparent" />
      <div className="bg-primary/10 pointer-events-none absolute -top-24 left-1/2 h-87.5 w-175 -translate-x-1/2 rounded-full blur-3xl" />

      {/* Header navigation */}
      <header className="z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-2xs transition-colors hover:bg-slate-100/80 hover:text-slate-900"
        >
          <ArrowLeft size={16} className="text-slate-500" />
          <span>{t("adminLogin.backToShop")}</span>
        </Link>

        <LanguageSwitcher variant="light" />
      </header>

      {/* Main Card */}
      <main className="z-10 mx-auto my-6 w-full max-w-md sm:my-10">
        <div className="space-y-6 rounded-[2rem] border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 shadow-xs">
              <img
                src="/images/logo-mark.png"
                alt="Logo"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-100 px-3 py-1 text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                <ShieldCheck size={13} className="text-primary" />
                <span>{t("adminLogin.title")}</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {t("catalog.adminDashboard")}
              </h1>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                {t("adminLogin.subtitle")}
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="animate-fadeIn rounded-2xl border border-red-200 bg-red-50 p-3.5 text-center text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <AdminLoginFormFields
            identifier={identifier}
            setIdentifier={setIdentifier}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            identifierError={identifierError}
            passwordError={passwordError}
            touched={touched}
            setTouched={setTouched}
            loading={loading}
            onSubmit={handleSubmit}
            onPrefillDemo={handlePrefillDemo}
          />

          {/* Security Notice */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[11px] leading-relaxed font-medium text-slate-500">
              {t("adminLogin.securityNotice")}
            </p>
          </div>
        </div>
      </main>

      {/* Footer branding */}
      <footer className="z-10 py-2 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {t("app.title")} • Administrative
        Management
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
