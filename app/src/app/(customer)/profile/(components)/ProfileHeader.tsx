"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ProfileHeader() {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile Header with brand curve */}
      <header className="bg-primary sticky top-0 z-40 flex items-center justify-center rounded-b-3xl px-5 py-4 text-white shadow-lg md:hidden">
        <h1 className="text-base font-extrabold tracking-tight">
          {t("profile.title")}
        </h1>
      </header>

      {/* Desktop Navigation Bar */}
      <div className="mx-auto hidden max-w-5xl px-6 pt-8 md:block">
        <div className="flex items-center justify-between">
          <Link
            href="/catalog"
            className="hover:text-primary group inline-flex items-center gap-2.5 text-sm font-semibold text-gray-500 transition-all duration-150"
          >
            <span className="group-hover:border-primary/30 group-hover:text-primary flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-xs transition-all">
              <ArrowLeft size={16} strokeWidth={2.5} />
            </span>
            <span>{t("notFound.backHome")}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
