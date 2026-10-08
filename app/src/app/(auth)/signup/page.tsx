"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
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
         const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

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
      } catch (err: any) {
         console.error("Signup error:", err);
         setError(t("signup.errorFailed"));
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-background flex flex-col px-6 py-8 sm:py-12 relative">
         {/* Top Navigation Bar: Back & Language Switcher aligned horizontally */}
         <div className="w-full flex items-center justify-between mb-6 sm:mb-8">
            <Link href="/catalog" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors font-medium">
               <ArrowLeft size={20} className="mr-2" /> {t("notFound.backHome")}
            </Link>

            <div className="bg-primary rounded-full shadow-lg">
               <LanguageSwitcher />
            </div>
         </div>

         <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-4">
            <h1 className="text-3xl font-extrabold text-primary mb-2">{t("signup.createAccount")}</h1>
            <p className="text-gray-500 mb-6">{t("signup.registerForOrder")}</p>

            {error && <div className="bg-red-50 text-secondary p-4 rounded-xl mb-6 text-sm border border-red-200">{error}</div>}

            <form onSubmit={handleSignup} noValidate className="space-y-4">
               <div>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon size={20} className={nameError ? "text-red-400" : "text-gray-400"} />
                     </div>
                     <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                           setName(e.target.value);
                           if (!touched.name) setTouched(prev => ({ ...prev, name: true }));
                        }}
                        onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                        className={`block w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-2xl text-gray-900 focus:outline-hidden transition-colors text-sm ${
                           nameError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-100 focus:border-primary"
                        }`}
                        placeholder={t("signup.fullName")}
                        aria-invalid={!!nameError}
                     />
                  </div>
                  {nameError && (
                     <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{nameError}</p>
                  )}
               </div>

               <div>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={20} className={emailError ? "text-red-400" : "text-gray-400"} />
                     </div>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           if (!touched.email) setTouched(prev => ({ ...prev, email: true }));
                        }}
                        onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                        className={`block w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-2xl text-gray-900 focus:outline-hidden transition-colors text-sm ${
                           emailError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-100 focus:border-primary"
                        }`}
                        placeholder={t("login.email")}
                        aria-invalid={!!emailError}
                     />
                  </div>
                  {emailError && (
                     <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{emailError}</p>
                  )}
               </div>

               <div>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={20} className={passwordError ? "text-red-400" : "text-gray-400"} />
                     </div>
                     <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                           setPassword(e.target.value);
                           if (!touched.password) setTouched(prev => ({ ...prev, password: true }));
                        }}
                        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                        className={`block w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl text-gray-900 focus:outline-hidden transition-colors text-sm ${
                           passwordError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-100 focus:border-primary"
                        }`}
                        placeholder={t("login.password")}
                        aria-invalid={!!passwordError}
                     />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-hidden">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
                  {passwordError && (
                     <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{passwordError}</p>
                  )}
               </div>

               <div>
                  <div className="flex items-start pt-1">
                     <div className="flex items-center h-5">
                        <input
                           id="consent"
                           type="checkbox"
                           checked={consent}
                           onChange={(e) => {
                              setConsent(e.target.checked);
                              if (!touched.consent) setTouched(prev => ({ ...prev, consent: true }));
                           }}
                           className={`w-4 h-4 text-primary bg-white border-2 rounded focus:ring-primary ${
                              consentError ? "border-red-400" : "border-gray-300"
                           }`}
                        />
                     </div>
                     <div className="ml-2.5 text-xs">
                        <label htmlFor="consent" className="text-gray-600 cursor-pointer">
                           {t("signup.consent")}
                           <Link href="/privacy" className="text-primary hover:underline font-semibold">
                              {t("signup.privacyPolicy")}
                           </Link>
                           {t("signup.consentEnd")}
                        </label>
                     </div>
                  </div>
                  {consentError && (
                     <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{consentError}</p>
                  )}
               </div>

               <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex justify-center items-center mt-2 cursor-pointer">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t("signup.submit")}
               </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
               {t("signup.alreadyHaveAccount")}{" "}
               <Link href={`/login${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : ""}`} className="font-bold text-primary hover:underline">
                  {t("signup.login")}
               </Link>
            </p>
         </div>
      </div>
   );
}

export default function SignupPage() {
   return (
      <Suspense
         fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
         }
      >
         <SignupForm />
      </Suspense>
   );
}
