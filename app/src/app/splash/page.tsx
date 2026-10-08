"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";
import Link from "next/link";

export default function SplashScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-900 via-purple-950 to-neutral-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="flex justify-between items-center z-10 pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">FreshToHome</span>
        </div>
      </div>

      {/* Center Hero Animation & Branding */}
      <div className="flex flex-col items-center text-center my-auto py-8 z-10">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-3xl bg-linear-to-tr from-primary to-purple-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 ring-4 ring-white/10 animate-bounce">
            <ShoppingBag size={64} className="text-white" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
            {t("splash.freshBadge")}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-linear-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
          {t("splash.welcome")}
        </h1>
        <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
          {t("splash.tagline")}
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-8 text-xs font-medium text-gray-200">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex flex-col items-center space-y-1.5 border border-white/10">
            <ShieldCheck size={20} className="text-primary-light" />
            <span>{t("splash.premiumCut")}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex flex-col items-center space-y-1.5 border border-white/10">
            <Truck size={20} className="text-primary-light" />
            <span>{t("splash.chilledVan")}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex flex-col items-center space-y-1.5 border border-white/10">
            <Clock size={20} className="text-primary-light" />
            <span>{t("splash.fastSlot")}</span>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="w-full max-w-sm mx-auto space-y-3 z-10 pb-6">
        <Link
          href="/catalog"
          className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-primary/50 transition-all text-lg group"
        >
          <span>{t("splash.getStarted")}</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        {!user && (
          <Link
            href="/login"
            className="w-full block text-center bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3.5 rounded-2xl backdrop-blur-md transition-all text-sm"
          >
            {t("splash.alreadyMember")}
          </Link>
        )}
      </div>
    </div>
  );
}
