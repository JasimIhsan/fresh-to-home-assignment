"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff, KeyRound, Lock, Shield, Sparkles } from "lucide-react";
import React from "react";

export interface AdminLoginFormFieldsProps {
   identifier: string;
   setIdentifier: (val: string) => void;
   password: string;
   setPassword: (val: string) => void;
   showPassword: boolean;
   setShowPassword: (val: boolean) => void;
   identifierError: string;
   passwordError: string;
   touched: { identifier?: boolean; password?: boolean };
   setTouched: React.Dispatch<React.SetStateAction<{ identifier?: boolean; password?: boolean }>>;
   loading: boolean;
   onSubmit: (e: React.FormEvent) => void;
   onPrefillDemo: () => void;
}

export function AdminLoginFormFields({
   identifier,
   setIdentifier,
   password,
   setPassword,
   showPassword,
   setShowPassword,
   identifierError,
   passwordError,
   touched,
   setTouched,
   loading,
   onSubmit,
   onPrefillDemo,
}: AdminLoginFormFieldsProps) {
   const { t } = useLanguage();

   return (
      <form onSubmit={onSubmit} noValidate className="space-y-4">
         <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
               {t("adminLogin.usernameOrEmail")}
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={17} />
               </div>
               <input
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={identifier}
                  onChange={(e) => {
                     setIdentifier(e.target.value);
                     if (!touched.identifier) setTouched((prev) => ({ ...prev, identifier: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
                  placeholder="admin or admin@freshtohome.de"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden transition-all ${
                     identifierError
                        ? "border-red-400 focus:border-red-500 bg-red-50/20"
                        : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  }`}
               />
            </div>
            {identifierError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{identifierError}</p>}
         </div>

         <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
               {t("adminLogin.password")}
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={17} />
               </div>
               <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                     setPassword(e.target.value);
                     if (!touched.password) setTouched((prev) => ({ ...prev, password: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-11 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden transition-all ${
                     passwordError
                        ? "border-red-400 focus:border-red-500 bg-red-50/20"
                        : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  }`}
               />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
               >
                  <EyeOff size={18} />
               </button>
            </div>
            {passwordError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{passwordError}</p>}
         </div>

         {/* Demo Credential Shortcut */}
         <div className="pt-1 flex items-center justify-between text-xs">
            <button
               type="button"
               onClick={onPrefillDemo}
               className="inline-flex items-center gap-1.5 text-primary hover:text-purple-700 transition-colors font-semibold cursor-pointer"
            >
               <Sparkles size={13} />
               <span>{t("adminLogin.prefillDemo")}</span>
            </button>
         </div>

         {/* Submit Button */}
         <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-primary hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
         >
            {loading ? (
               <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("adminLogin.loggingIn")}</span>
               </>
            ) : (
               <>
                  <Shield size={16} />
                  <span>{t("adminLogin.submit")}</span>
               </>
            )}
         </button>
      </form>
   );
}
