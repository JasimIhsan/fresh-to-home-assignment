"use client";

import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

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
                  className="font-bold text-primary hover:underline"
               >
                  {t("login.createAccount")}
               </Link>
            </p>
         }
      >
         {error && (
            <div className="bg-red-50 text-secondary p-4 rounded-2xl mb-5 text-sm border border-red-200 animate-fadeIn">
               {error}
            </div>
         )}

         <form onSubmit={handleLogin} noValidate className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {t("login.email")}
               </label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Mail size={18} className={emailError ? "text-red-400" : "text-gray-400"} />
                  </div>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => {
                        setEmail(e.target.value);
                        if (!touched.email) setTouched((prev) => ({ ...prev, email: true }));
                     }}
                     onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                     className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/70 border-2 rounded-2xl text-gray-900 text-sm focus:outline-hidden transition-all ${
                        emailError
                           ? "border-red-400 focus:border-red-500 bg-red-50/20"
                           : "border-gray-100 focus:border-primary focus:bg-white"
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
               <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                     {t("login.password")}
                  </label>
                  <Link
                     href="/forgot-password"
                     className="text-xs font-semibold text-primary hover:underline"
                  >
                     {t("login.forgotPassword")}
                  </Link>
               </div>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Lock size={18} className={passwordError ? "text-red-400" : "text-gray-400"} />
                  </div>
                  <input
                     type={showPassword ? "text" : "password"}
                     value={password}
                     onChange={(e) => {
                        setPassword(e.target.value);
                        if (!touched.password) setTouched((prev) => ({ ...prev, password: true }));
                     }}
                     onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                     className={`block w-full pl-11 pr-11 py-3.5 bg-gray-50/70 border-2 rounded-2xl text-gray-900 text-sm focus:outline-hidden transition-all ${
                        passwordError
                           ? "border-red-400 focus:border-red-500 bg-red-50/20"
                           : "border-gray-100 focus:border-primary focus:bg-white"
                     }`}
                     placeholder={t("login.password")}
                     aria-invalid={!!passwordError}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     aria-label={showPassword ? "Hide password" : "Show password"}
                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-hidden cursor-pointer"
                  >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
               {passwordError && (
                  <p className="mt-1.5 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{passwordError}</p>
               )}
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex justify-center items-center mt-2 cursor-pointer"
            >
               {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               ) : (
                  t("login.submit")
               )}
            </button>
         </form>
      </AuthCardWrapper>
   );
}

export default function LoginPage() {
   return (
      <Suspense
         fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
               <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
         }
      >
         <LoginForm />
      </Suspense>
   );
}
