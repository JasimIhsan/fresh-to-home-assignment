"use client";

import { AuthCardWrapper } from "@/components/AuthCardWrapper";
import { LoginFormFields } from "./LoginFormFields";
import { safeRedirectPath } from "../../(components)/safe-redirect";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { hasErrors, validateLoginForm } from "@/services";
import { AuthService } from "@/services/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = safeRedirectPath(searchParams.get("redirect"), "");

  const errors = validateLoginForm({ email, password });
  const emailError = touched.email && errors.email ? t(errors.email) : "";
  const passwordError =
    touched.password && errors.password ? t(errors.password) : "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (hasErrors(errors)) return;

    setLoading(true);
    setError("");

    const result = await signIn(email, password);
    setLoading(false);
    if (result.error?.code === "email_not_confirmed") {
      // Sign up was never finished: verify the emailed code first
      const params = new URLSearchParams({ email: email.trim() });
      if (redirectParam) params.set("redirect", redirectParam);
      router.push(`/otp?${params.toString()}`);
      return;
    }
    if (result.error) {
      setError(
        result.error.code === "not_configured"
          ? result.error.message
          : t("login.error")
      );
      return;
    }
    const isAdmin =
      AuthService.parseUserMetadata(result.data.user).role === "admin";
    router.push(redirectParam || (isAdmin ? "/admin" : "/catalog"));
  };

  return (
    <AuthCardWrapper
      title={t("login.welcomeBack")}
      subtitle={t("login.loginToContinue")}
      backHref="/catalog"
      backLabel={t("notFound.backHome")}
      badgeIcon={<LogIn size={24} />}
      footer={
        <p className="text-sm text-gray-600">
          {t("login.noAccount")}{" "}
          <Link
            href={`/signup${
              redirectParam
                ? `?redirect=${encodeURIComponent(redirectParam)}`
                : ""
            }`}
            className="text-primary font-bold hover:underline"
          >
            {t("login.createAccount")}
          </Link>
        </p>
      }
    >
      {error && (
        <div className="text-secondary animate-fadeIn mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
          {error}
        </div>
      )}

      <LoginFormFields
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
        onSubmit={handleLogin}
      />
    </AuthCardWrapper>
  );
}
