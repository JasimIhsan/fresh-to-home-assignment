"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CartHeaderProps {
  readonly totalItemsCount: number;
  readonly totalAmount: number;
  readonly isLoggedIn: boolean;
}

export function CartHeader({
  totalItemsCount,
  totalAmount,
  isLoggedIn,
}: CartHeaderProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile Header with signature purple curve */}
      <header className="bg-primary sticky top-0 z-40 flex items-center justify-center rounded-b-3xl px-4 py-3.5 text-white shadow-lg md:hidden">
        <div className="mx-2 min-w-0 text-center">
          <h1 className="truncate text-base font-extrabold tracking-tight">
            {t("cart.title")}
          </h1>
          {isLoggedIn && totalItemsCount > 0 && (
            <p className="truncate text-[11px] font-semibold text-white/80">
              {totalItemsCount} {t("cart.items")} •{" "}
              {totalAmount.toFixed(2).replace(".", ",")} €
            </p>
          )}
        </div>
      </header>

      {/* Desktop Navigation Top Bar */}
      <div className="mx-auto hidden max-w-5xl px-6 pt-8 pb-2 md:block">
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
