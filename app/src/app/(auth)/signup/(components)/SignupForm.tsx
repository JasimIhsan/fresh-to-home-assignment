"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { SignupFormFields } from "@/components/auth/SignupFormFields";
import { safeRedirectPath } from "@/components/auth/safe-redirect";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { hasErrors, validateSignupForm } from "@/services";
import { MailCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const { t } = useLanguage();
  const { signUp } = useAuth();
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
  const [confirmationSent, setConfirmationSent] = useState(false);
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

    const targetDestination = redirectParam || "/catalog";
    const result = await signUp(
      email,
      password,
      { name },
      { emailRedirectTo: `${window.location.origin}${targetDestination}` }
    );
    setLoading(false);

    if (result.error) {
      setError(
        result.error.code === "not_configured"
          ? result.error.message
          : t("signup.errorFailed")
      );
      return;
    }

    // With email confirmation enabled, no session is issued until the
    // user clicks the confirmation link
    if (result.data.needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }

    router.push(targetDestination);
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

      {confirmationSent ? (
        <div className="animate-fadeIn space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <MailCheck size={32} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-emerald-950">
              {t("signup.confirmTitle")}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">
              {t("signup.confirmDesc")}
            </p>
          </div>
        </div>
      ) : (
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
      )}
    </AuthCardWrapper>
  );
}
