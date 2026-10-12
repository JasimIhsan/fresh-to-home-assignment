"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { LoginFormFields } from "@/components/auth/LoginFormFields";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { hasErrors, validateLoginForm } from "@/services";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const { t } = useLanguage();
  const { role, signIn } = useAuth();
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
  const redirectUrl =
    searchParams.get("redirect") || (role === "admin" ? "/admin" : "/catalog");

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
    if (result.error) {
      setError(
        result.error.code === "not_configured"
          ? result.error.message
          : t("login.error")
      );
      return;
    }
    router.push(redirectUrl);
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
              searchParams.get("redirect")
                ? `?redirect=${encodeURIComponent(searchParams.get("redirect")!)}`
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
