"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Package } from "lucide-react";
import Link from "next/link";

export function CustomerOrdersEmpty() {
   const { t } = useLanguage();

   return (
      <div className="bg-white p-12 rounded-3xl shadow-xs border border-gray-100 text-center space-y-4">
         <Package size={48} className="mx-auto text-gray-400" />
         <h3 className="font-bold text-lg text-gray-800">{t("orders.empty")}</h3>
         <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Sie haben aktuell keine Bestellungen in dieser Kategorie.
         </p>
         <Link
            href="/catalog"
            className="inline-block bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md hover:opacity-90 transition-all"
         >
            {t("checkout.backToCatalog")}
         </Link>
      </div>
   );
}
