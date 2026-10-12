"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface PdpBreadcrumbProps {
  category: string;
  productName: string;
}

export function PdpBreadcrumb({ category, productName }: PdpBreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-8 hidden items-center gap-1.5 text-xs font-medium text-gray-400 md:flex"
    >
      <Link
        href="/"
        className="hover:text-primary flex items-center gap-1 transition-colors duration-150"
      >
        <Home size={13} />
        <span>{t("app.title")}</span>
      </Link>
      <ChevronRight size={13} className="text-gray-300" />
      <Link
        href="/catalog"
        className="hover:text-primary capitalize transition-colors duration-150"
      >
        {category}
      </Link>
      <ChevronRight size={13} className="text-gray-300" />
      <span className="max-w-50 truncate font-semibold text-gray-700">
        {productName}
      </span>
    </nav>
  );
}
