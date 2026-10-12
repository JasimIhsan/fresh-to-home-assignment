"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardWrapperProps {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  badgeIcon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCardWrapper({
  title,
  subtitle,
  backHref = "/catalog",
  backLabel,
  badgeIcon,
  children,
  footer,
}: Readonly<AuthCardWrapperProps>) {
  return (
    <div className="via-background to-background selection:bg-primary/20 flex min-h-screen flex-col justify-between bg-linear-to-b from-purple-50/40 px-4 py-6 sm:py-10">
      {/* Top Navigation Bar: Back link & Language Switcher */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <Link
          href={backHref}
          className="hover:text-primary group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-all duration-150 active:scale-95"
        >
          <span className="group-hover:border-primary/30 group-hover:text-primary flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-xs transition-all">
            <ArrowLeft size={16} strokeWidth={2.5} />
          </span>
          <span className="hidden sm:inline">{backLabel || "Zurück"}</span>
        </Link>

        <LanguageSwitcher variant="light" className="rounded-xl shadow-xs" />
      </div>

      {/* Main Auth Card */}
      <div className="mx-auto my-auto w-full max-w-md py-6">
        {/* Brand Logo Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="group mb-3 flex items-center gap-2.5">
            <div className="bg-primary shadow-primary/25 flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/icons/icon-192x192.png"
                alt="Frisch nach Hause"
                width={28}
                height={28}
                priority
                className="h-7 w-7 rounded-lg object-contain"
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Frisch nach Hause
            </span>
          </Link>
        </div>

        {/* Elevated Card */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-100/90 bg-white p-6 shadow-xl shadow-purple-900/5 backdrop-blur-xl sm:p-8">
          {/* Decorative subtle background gradient blob */}
          <div className="bg-primary/5 pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-2xl" />

          {/* Card Header */}
          <div className="relative z-10 mb-6">
            {badgeIcon && (
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner">
                {badgeIcon}
              </div>
            )}
            <h1 className="text-2xl leading-tight font-black tracking-tight text-gray-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              {subtitle}
            </p>
          </div>

          {/* Card Body */}
          <div className="relative z-10">{children}</div>
        </div>

        {/* Footer Text */}
        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>

      {/* Bottom Trust/Security Note */}
      <div className="mx-auto w-full max-w-md pt-4 text-center">
        <p className="text-[11px] text-gray-400">
          🔒 Frisch nach Hause • Verschlüsselt & DSGVO-konform
        </p>
      </div>
    </div>
  );
}
