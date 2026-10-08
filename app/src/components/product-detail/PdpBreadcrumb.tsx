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
         className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-8"
      >
         <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors duration-150"
         >
            <Home size={13} />
            <span>{t("app.title")}</span>
         </Link>
         <ChevronRight size={13} className="text-gray-300" />
         <Link
            href="/catalog"
            className="hover:text-primary transition-colors duration-150 capitalize"
         >
            {category}
         </Link>
         <ChevronRight size={13} className="text-gray-300" />
         <span className="text-gray-700 font-semibold truncate max-w-[200px]">{productName}</span>
      </nav>
   );
}
