"use client";

import { AdminLoginFormFields } from "./AdminLoginFormFields";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const DEFAULT_REDIRECT = "/admin";

/** Only same-origin admin paths are valid post-login targets. */
function safeAdminRedirect(target: string | null): string {
  if (
    !target ||
    !target.startsWith("/admin") ||
    target.startsWith("//") ||
    target.startsWith("/admin/login")
  ) {
    return DEFAULT_REDIRECT;
  }
  return target;
}

export function AdminLoginForm() {
  const { t } = useLanguage();
  const { isAdmin, loginAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = safeAdminRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  useEffect(() => {
    if (isAdmin) router.replace(redirectUrl);
  }, [isAdmin, redirectUrl, router]);

  const getEmailError = () =>
    email.trim() ? "" : t("validation.emailRequired");
  const getPasswordError = () =>
    password ? "" : t("validation.passwordRequired");

  const emailError = touched.email ? getEmailError() : "";
  const passwordError = touched.password ? getPasswordError() : "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (getEmailError() || getPasswordError()) return;

    setLoading(true);
    setError("");
    try {
      const result = await loginAdmin(email.trim(), password);
      if (result.error) {
        setError(
          result.error.code === "invalid_credentials"
            ? t("adminLogin.error")
            : result.error.message
        );
        return;
      }
      router.replace(redirectUrl);
    } catch {
      setError(t("adminLogin.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          className="animate-fadeIn rounded-2xl border border-red-200 bg-red-50 p-3.5 text-center text-xs font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <AdminLoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        emailError={emailError}
        passwordError={passwordError}
        touched={touched}
        setTouched={setTouched}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </>
  );
}
