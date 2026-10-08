"use client";

import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
   const { t } = useLanguage();

   return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
         <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={48} className="text-secondary" />
         </div>

         <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
         <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("notFound.title")}</h2>

         <p className="text-gray-500 text-center max-w-sm mb-8">{t("notFound.description")}</p>

         <Link href="/" className="flex items-center bg-background text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
            <ArrowLeft className="mr-2" size={20} />
            {t("notFound.backHome")}
         </Link>
      </div>
   );
}
