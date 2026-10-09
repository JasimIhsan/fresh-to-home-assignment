"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { LoginFormFields } from "@/components/auth/LoginFormFields";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const { t } = useLanguage();
  const { role } = useAuth();
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const getEmailError = () => {
    if (!email.trim()) return t("validation.emailRequired");
    if (!emailRegex.test(email.trim())) return t("validation.emailInvalid");
    return "";
  };

  const getPasswordError = () => {
    if (!password) return t("validation.passwordRequired");
    if (password.length < 6) return t("validation.passwordMinLength");
    return "";
  };

  const emailError = touched.email ? getEmailError() : "";
  const passwordError = touched.password ? getPasswordError() : "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const eError = getEmailError();
    const pError = getPasswordError();
    if (eError || pError) {
      return;
    }

    if (!auth) {
      setError("Firebase is not configured.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Mutual exclusivity: ensure any admin session is cleared when customer logs in
      if (typeof window !== "undefined") {
        localStorage.removeItem("fth_admin_session");
      }
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push(redirectUrl);
    } catch {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
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
