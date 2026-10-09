"use client";

import { AdminLoginFormFields } from "@/components/admin/AdminLoginFormFields";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AdminLoginForm() {
   const { t } = useLanguage();
   const { isAdmin, loginAdmin } = useAuth();
   const router = useRouter();
   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get("redirect") || "/admin";

   const [identifier, setIdentifier] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [touched, setTouched] = useState<{ identifier?: boolean; password?: boolean }>({});

   useEffect(() => {
      if (isAdmin) {
         router.replace(redirectUrl);
      }
   }, [isAdmin, redirectUrl, router]);

   const getIdentifierError = () => {
      if (!identifier.trim()) return t("validation.emailRequired") || "Please enter username or admin email.";
      return "";
   };

   const getPasswordError = () => {
      if (!password) return t("validation.passwordRequired") || "Please enter your password.";
      return "";
   };

   const identifierError = touched.identifier ? getIdentifierError() : "";
   const passwordError = touched.password ? getPasswordError() : "";

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched({ identifier: true, password: true });

      const idErr = getIdentifierError();
      const passErr = getPasswordError();
      if (idErr || passErr) return;

      setLoading(true);
      setError("");

      try {
         const res = await loginAdmin(identifier.trim(), password);
         if (res.success) {
            router.push(redirectUrl);
         } else {
            setError(t("adminLogin.error"));
         }
      } catch {
         setError(t("adminLogin.error"));
      } finally {
         setLoading(false);
      }
   };

   const handlePrefillDemo = () => {
      const demoUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
      const demoPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "AdminPassword123!";
      setIdentifier(demoUser);
      setPassword(demoPass);
      setTouched({ identifier: true, password: true });
      setError("");
   };

   return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans">
         {/* Top ambient decor matching admin layout */}
         <div className="absolute top-0 inset-x-0 h-80 bg-linear-to-b from-purple-100/60 via-purple-50/30 to-transparent pointer-events-none" />
         <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-175 h-87.5 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

         {/* Header navigation */}
         <header className="flex items-center justify-between w-full max-w-5xl mx-auto z-10">
            <Link
               href="/catalog"
               className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-2 px-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-100/80"
            >
               <ArrowLeft size={16} className="text-slate-500" />
               <span>{t("adminLogin.backToShop")}</span>
            </Link>

            <LanguageSwitcher variant="light" />
         </header>

         {/* Main Card */}
         <main className="w-full max-w-md mx-auto my-6 sm:my-10 z-10">
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-7 sm:p-9 shadow-xl shadow-slate-200/50 space-y-6">
               {/* Brand Header */}
               <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shadow-xs">
                     <img src="/images/logo-mark.png" alt="Logo" className="w-9 h-9 object-contain" />
                  </div>
                  <div>
                     <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/70 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                        <ShieldCheck size={13} className="text-primary" />
                        <span>{t("adminLogin.title")}</span>
                     </div>
                     <h1 className="text-2xl font-black tracking-tight text-slate-900">{t("catalog.adminDashboard")}</h1>
                     <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">{t("adminLogin.subtitle")}</p>
                  </div>
               </div>

               {/* Error Alert */}
               {error && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center animate-fadeIn">
                     {error}
                  </div>
               )}

               {/* Form */}
               <AdminLoginFormFields
                  identifier={identifier}
                  setIdentifier={setIdentifier}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  identifierError={identifierError}
                  passwordError={passwordError}
                  touched={touched}
                  setTouched={setTouched}
                  loading={loading}
                  onSubmit={handleSubmit}
                  onPrefillDemo={handlePrefillDemo}
               />

               {/* Security Notice */}
               <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{t("adminLogin.securityNotice")}</p>
               </div>
            </div>
         </main>

         {/* Footer branding */}
         <footer className="text-center text-xs text-slate-400 z-10 py-2">
            © {new Date().getFullYear()} {t("app.title")} • Administrative Management
         </footer>
      </div>
   );
}

export default function AdminLoginPage() {
   return (
      <Suspense
         fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
               <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
         }
      >
         <AdminLoginForm />
      </Suspense>
   );
}
