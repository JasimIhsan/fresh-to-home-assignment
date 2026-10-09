"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { SignupFormFields } from "@/components/auth/SignupFormFields";
import { UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignupForm() {
  const { t } = useLanguage();
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getNameError = () => {
    if (!name.trim()) return t("validation.nameRequired");
    if (name.trim().length < 2) return t("validation.nameMinLength");
    return "";
  };

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

  const getConsentError = () => {
    if (!consent) return t("validation.consentRequired");
    return "";
  };

  const nameError = touched.name ? getNameError() : "";
  const emailError = touched.email ? getEmailError() : "";
  const passwordError = touched.password ? getPasswordError() : "";
  const consentError = touched.consent ? getConsentError() : "";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, consent: true });

    const nError = getNameError();
    const eError = getEmailError();
    const pError = getPasswordError();
    const cError = getConsentError();

    if (nError || eError || pError || cError) {
      return;
    }

    if (!auth) {
      setError("Firebase is not configured.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Mutual exclusivity: ensure any admin session is cleared when customer signs up
      if (typeof window !== "undefined") {
        localStorage.removeItem("fth_admin_session");
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Customer signup always provisions 'customer' account
      const finalRole: UserRole = "customer";

      // Persist name and role in Firebase Auth's displayName metadata
      await updateProfile(userCredential.user, {
        displayName: JSON.stringify({
          name: name.trim(),
          role: finalRole,
        }),
      });

      const redirectParam = searchParams.get("redirect");
      const targetDestination = redirectParam || "/catalog";
      router.push(targetDestination);
    } catch {
      setError(t("signup.errorFailed"));
    } finally {
      setLoading(false);
    }
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
              searchParams.get("redirect")
                ? `?redirect=${encodeURIComponent(searchParams.get("redirect")!)}`
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
        nameError={nameError}
        emailError={emailError}
        passwordError={passwordError}
        consentError={consentError}
        touched={touched}
        setTouched={setTouched}
        loading={loading}
        onSubmit={handleSignup}
      />
    </AuthCardWrapper>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
