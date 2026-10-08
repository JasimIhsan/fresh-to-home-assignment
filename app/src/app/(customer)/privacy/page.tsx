"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12 relative max-w-3xl mx-auto">
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-primary rounded-full shadow-lg">
          <LanguageSwitcher />
        </div>
      </div>

      <Link
        href="/catalog"
        className="inline-flex items-center text-gray-500 hover:text-primary mb-8 self-start transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> {t("notFound.backHome")}
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-xs border border-gray-100 space-y-6">
        <div className="flex items-center space-x-3 text-primary">
          <Shield size={32} />
          <h1 className="text-3xl font-extrabold">{t("privacy.title")}</h1>
        </div>

        <div className="prose prose-purple max-w-none text-gray-700 space-y-4">
          <p className="font-semibold text-gray-900">
            {t("privacy.summary")}
          </p>
          <p className="text-sm leading-relaxed">
            {t("privacy.p1")}
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-4">{t("privacy.h2")}</h2>
          <p className="text-sm leading-relaxed">
            {t("privacy.p2")}
          </p>
        </div>
      </div>
    </div>
  );
}

