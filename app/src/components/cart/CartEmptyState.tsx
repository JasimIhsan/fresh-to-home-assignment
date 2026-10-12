"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";

interface CartEmptyStateProps {
  readonly isGuest?: boolean;
}

export function CartEmptyState({ isGuest = false }: CartEmptyStateProps) {
  const { t } = useLanguage();

  if (isGuest) {
    return (
      <div className="mx-auto my-8 max-w-md space-y-6 rounded-3xl border border-gray-100/90 bg-white p-8 text-center shadow-xl shadow-purple-950/5 sm:p-12">
        <div className="bg-primary/10 text-primary mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-inner">
          <ShoppingBag size={38} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            {t("cart.notLoggedInTitle")}
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">
            {t("cart.notLoggedInDesc")}
          </p>
        </div>

        <Link
          href="/login?redirect=/cart"
          className="bg-primary shadow-primary/25 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-[0.99]"
        >
          <span>{t("cart.loginButton")}</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 max-w-md space-y-6 rounded-3xl border border-gray-100/90 bg-white p-8 text-center shadow-xl shadow-purple-950/5 sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
        <ShoppingCart size={38} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-gray-900">
          {t("cart.empty")}
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">
          {t("cart.emptyDesc")}
        </p>
      </div>

      <Link
        href="/catalog"
        className="bg-primary shadow-primary/25 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-[0.99]"
      >
        <Sparkles size={18} />
        <span>{t("cart.browseProducts")}</span>
      </Link>
    </div>
  );
}
