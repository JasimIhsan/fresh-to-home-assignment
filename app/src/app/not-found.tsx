"use client";

import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
        <AlertCircle size={48} className="text-secondary" />
      </div>

      <h1 className="text-primary mb-2 text-4xl font-bold">404</h1>
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        {t("notFound.title")}
      </h2>

      <p className="mb-8 max-w-sm text-center text-gray-500">
        {t("notFound.description")}
      </p>

      <Link
        href="/"
        className="bg-primary flex items-center rounded-xl px-6 py-3 font-bold text-white shadow-md transition-opacity hover:opacity-90"
      >
        <ArrowLeft className="mr-2" size={20} />
        {t("notFound.backHome")}
      </Link>
    </div>
  );
}
