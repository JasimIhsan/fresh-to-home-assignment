"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
   const { t } = useLanguage();
   const router = useRouter();

   return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-background to-background flex flex-col px-4 sm:px-6 py-8 sm:py-12 relative max-w-3xl mx-auto selection:bg-primary/20">
         <div className="flex items-center justify-between mb-8 w-full">
            <button
               onClick={() => router.back()}
               className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-all duration-150 group active:scale-95 cursor-pointer"
               aria-label={t("productDetail.back")}
            >
               <span className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-xs flex items-center justify-center group-hover:border-primary/30 group-hover:text-primary transition-all">
                  <ArrowLeft size={16} strokeWidth={2.5} />
               </span>
               <span className="font-bold">{t("productDetail.back")}</span>
            </button>
         </div>

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

