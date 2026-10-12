"use client";

import { signUp } from "@/app/actions/auth.actions";
import { AuthCardWrapper } from "@/components/AuthCardWrapper";
import { SignupFormFields } from "./SignupFormFields";
import { authErrorKey } from "../../(components)/auth-error-key";
import { safeRedirectPath } from "../../(components)/safe-redirect";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { hasErrors, validateSignupForm } from "@/services";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const { t } = useLanguage();
  const { syncSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    consent?: boolean;
  }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = safeRedirectPath(searchParams.get("redirect"), "");

  const errors = validateSignupForm({ name, email, password, consent });
  const fieldError = (field: keyof typeof touched) => {
    const key = errors[field];
    return touched[field] && key ? t(key) : "";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, consent: true });
    if (hasErrors(errors)) return;

    setLoading(true);
    setError("");

    const result = await signUp({
      fullName: name,
      email,
      password,
      consent,
    });

    if (!result.success) {
      setLoading(false);
      setError(t(authErrorKey(result.error)));
      return;
    }

    // Email confirmation enabled: verify the emailed code before the
    // account is active and a session is issued
    if (result.data.needsVerification) {
      const params = new URLSearchParams({ email: result.data.email });
      if (redirectParam) params.set("redirect", redirectParam);
      router.push(`/otp?${params.toString()}`);
      return;
    }

    await syncSession();
    router.push(redirectParam || "/catalog");
  };

  return (
    <AuthCardWrapper
      title={t("signup.createAccount")}
      subtitle={t("signup.registerForOrder")}
      backHref="/login"
      backLabel={t("signup.login")}
      badgeIcon={<UserPlus size={24} />}
      footer={
        <p className="text-sm text-gray-600">
          {t("signup.alreadyHaveAccount")}{" "}
          <Link
            href={`/login${
              redirectParam
                ? `?redirect=${encodeURIComponent(redirectParam)}`
                : ""
            }`}
            className="text-primary font-bold hover:underline"
          >
            {t("signup.login")}
          </Link>
        </p>
      }
    >
      {error && (
        <div className="text-secondary animate-fadeIn mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
          {error}
        </div>
      )}

      <SignupFormFields
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        consent={consent}
        setConsent={setConsent}
        nameError={fieldError("name")}
        emailError={fieldError("email")}
        passwordError={fieldError("password")}
        consentError={fieldError("consent")}
        touched={touched}
        setTouched={setTouched}
        loading={loading}
        onSubmit={handleSignup}
      />
    </AuthCardWrapper>
  );
}
