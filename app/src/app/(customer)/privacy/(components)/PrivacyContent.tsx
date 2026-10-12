"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export function PrivacyContent() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="via-background to-background selection:bg-primary/20 relative mx-auto flex min-h-screen max-w-3xl flex-col bg-linear-to-b from-purple-50/40 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex w-full items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-primary group inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-500 transition-all duration-150 active:scale-95"
          aria-label={t("productDetail.back")}
        >
          <span className="group-hover:border-primary/30 group-hover:text-primary flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-xs transition-all">
            <ArrowLeft size={16} strokeWidth={2.5} />
          </span>
          <span className="font-bold">{t("productDetail.back")}</span>
        </button>
      </div>

      <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xs">
        <div className="text-primary flex items-center space-x-3">
          <Shield size={32} />
          <h1 className="text-3xl font-extrabold">{t("privacy.title")}</h1>
        </div>

        <div className="prose prose-purple max-w-none space-y-4 text-gray-700">
          <p className="font-semibold text-gray-900">{t("privacy.summary")}</p>
          <p className="text-sm leading-relaxed">{t("privacy.p1")}</p>
          <h2 className="mt-4 text-lg font-bold text-gray-900">
            {t("privacy.h2")}
          </h2>
          <p className="text-sm leading-relaxed">{t("privacy.p2")}</p>
        </div>
      </div>
    </div>
  );
}
