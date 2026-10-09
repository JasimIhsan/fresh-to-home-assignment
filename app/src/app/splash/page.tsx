"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function SplashScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-linear-to-b from-purple-900 via-purple-950 to-neutral-950 p-6 text-white">
      {/* Background Decorative Rings */}
      <div className="bg-primary/20 pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      {/* Top bar */}
      <div className="z-10 flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg shadow-md">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">FreshToHome</span>
        </div>
      </div>

      {/* Center Hero Animation & Branding */}
      <div className="z-10 my-auto flex flex-col items-center py-8 text-center">
        <div className="relative mb-8">
          <div className="from-primary flex h-32 w-32 animate-bounce items-center justify-center rounded-3xl bg-linear-to-tr to-purple-500 shadow-2xl ring-4 shadow-purple-500/30 ring-white/10">
            <ShoppingBag size={64} className="text-white" />
          </div>
          <span className="bg-secondary absolute -right-2 -bottom-2 rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-lg">
            {t("splash.freshBadge")}
          </span>
        </div>

        <h1 className="mb-4 bg-linear-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          {t("splash.welcome")}
        </h1>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-300">
          {t("splash.tagline")}
        </p>

        {/* Feature Badges */}
        <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3 text-xs font-medium text-gray-200">
          <div className="flex flex-col items-center space-y-1.5 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
            <ShieldCheck size={20} className="text-primary-light" />
            <span>{t("splash.premiumCut")}</span>
          </div>
          <div className="flex flex-col items-center space-y-1.5 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
            <Truck size={20} className="text-primary-light" />
            <span>{t("splash.chilledVan")}</span>
          </div>
          <div className="flex flex-col items-center space-y-1.5 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
            <Clock size={20} className="text-primary-light" />
            <span>{t("splash.fastSlot")}</span>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="z-10 mx-auto w-full max-w-sm space-y-3 pb-6">
        <Link
          href="/catalog"
          className="bg-primary hover:shadow-primary/50 group flex w-full items-center justify-center space-x-2 rounded-2xl py-4 text-lg font-bold text-white shadow-xl transition-all hover:bg-purple-600"
        >
          <span>{t("splash.getStarted")}</span>
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        {!user && (
          <Link
            href="/login"
            className="block w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
          >
            {t("splash.alreadyMember")}
          </Link>
        )}
      </div>
    </div>
  );
}
