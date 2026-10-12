"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AdminLoginScreenProps {
  readonly children: ReactNode;
  readonly footerYear: ReactNode;
}

export function AdminLoginScreen({
  children,
  footerYear,
}: AdminLoginScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 p-4 font-sans sm:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-purple-100/60 via-purple-50/30 to-transparent" />
      <div className="bg-primary/10 pointer-events-none absolute -top-24 left-1/2 h-87.5 w-175 -translate-x-1/2 rounded-full blur-3xl" />

      <header className="z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-2xs transition-colors hover:bg-slate-100/80 hover:text-slate-900"
        >
          <ArrowLeft size={16} className="text-slate-500" />
          <span>{t("adminLogin.backToShop")}</span>
        </Link>

        <LanguageSwitcher variant="light" />
      </header>

      <main className="z-10 mx-auto my-6 w-full max-w-md sm:my-10">
        <div className="space-y-6 rounded-[2rem] border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 shadow-xs">
              <Image
                src="/images/logo-mark.png"
                alt="Logo"
                width={36}
                height={36}
                priority
                className="h-9 w-9 object-contain"
              />
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-100 px-3 py-1 text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                <ShieldCheck size={13} className="text-primary" />
                <span>{t("adminLogin.title")}</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {t("catalog.adminDashboard")}
              </h1>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                {t("adminLogin.subtitle")}
              </p>
            </div>
          </div>

          {children}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[11px] leading-relaxed font-medium text-slate-500">
              {t("adminLogin.securityNotice")}
            </p>
          </div>
        </div>
      </main>

      <footer className="z-10 py-2 text-center text-xs text-slate-400">
        © {footerYear} {t("app.title")} • Administrative Management
      </footer>
    </div>
  );
}
