"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderDetailHeaderProps {
  readonly orderId: string;
}

export function OrderDetailHeader({ orderId }: OrderDetailHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="bg-primary sticky top-0 z-40 rounded-b-3xl px-4 py-3.5 text-white shadow-lg md:static md:rounded-none md:bg-transparent md:px-8 md:pt-8 md:pb-6 md:text-gray-900 md:shadow-none">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/orders"
          className="z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white/15 transition-all hover:bg-white/25 active:scale-95 md:border md:border-gray-200 md:bg-transparent md:text-gray-700 md:hover:bg-gray-100"
          aria-label={t("orderDetail.backToOrders")}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Link>
        <div className="mx-2 flex-1 text-center md:mx-0 md:ml-4 md:flex-initial md:text-left">
          <h1 className="flex items-center justify-center gap-1.5 truncate text-base font-extrabold md:justify-start md:text-3xl">
            <span>{t("orderDetail.title")}</span>
            <span className="text-xs font-medium text-white/80 md:text-lg md:text-gray-400">
              #{orderId}
            </span>
          </h1>
        </div>
        <div
          className="pointer-events-none w-10 shrink-0 md:hidden"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
