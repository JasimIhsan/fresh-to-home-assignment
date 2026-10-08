"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function LoginForm() {
   const { t } = useLanguage();
   const { role } = useAuth();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get("redirect") || (role === "admin" ? "/admin" : "/catalog");

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
         await signInWithEmailAndPassword(auth, email.trim(), password);
         router.push(redirectUrl);
      } catch (err: any) {
         setError(t("login.error"));
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
            <h1 className="text-3xl font-extrabold text-primary mb-2">{t("login.welcomeBack")}</h1>
            <p className="text-gray-500 mb-8">{t("login.loginToContinue")}</p>

            {error && <div className="bg-red-50 text-secondary p-4 rounded-xl mb-6 text-sm border border-red-200">{error}</div>}

            <form onSubmit={handleLogin} noValidate className="space-y-5">
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
                        className={`block w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl text-gray-900 focus:outline-hidden transition-colors ${
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
                        className={`block w-full pl-12 pr-12 py-4 bg-white border-2 rounded-2xl text-gray-900 focus:outline-hidden transition-colors ${
                           passwordError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-100 focus:border-primary"
                        }`}
                        placeholder={t("login.password")}
                        aria-invalid={!!passwordError}
                     />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-hidden">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                     </button>
                  </div>
                  {passwordError && (
                     <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{passwordError}</p>
                  )}
               </div>

               <div className="flex items-center justify-end">
                  <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                     {t("login.forgotPassword")}
                  </Link>
               </div>

               <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex justify-center items-center cursor-pointer">
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t("login.submit")}
               </button>
            </form>

            <p className="mt-8 text-center text-gray-600">
               {t("login.noAccount")}{" "}
               <Link href={`/signup${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : ""}`} className="font-bold text-primary hover:underline">
                  {t("login.createAccount")}
               </Link>
            </p>
         </div>
      </div>
   );
}

export default function LoginPage() {
   return (
      // <Suspense
      //    fallback={
      //       <div className="min-h-screen bg-background flex items-center justify-center">
      //          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      //       </div>
      //    }
      // >
      //    <LoginForm />
      // </Suspense>
      <>
         <LoginForm />
      </>
   );
}
