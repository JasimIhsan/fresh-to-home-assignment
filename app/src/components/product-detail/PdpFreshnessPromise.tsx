"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck } from "lucide-react";

/**
 * Freshness Promise – brand differentiator & trust signal.
 * Placed below CTA to re-assure post-click anxiety.
 */
export function PdpFreshnessPromise() {
   const { t } = useLanguage();

   return (
      <div className="relative overflow-hidden bg-linear-to-br from-purple-900 via-primary to-violet-800 text-white p-6 rounded-3xl shadow-lg">
         {/* Decorative blobs */}
         <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
         <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

         <div className="relative space-y-2.5">
            <div className="flex items-center gap-2.5">
               <div className="w-9 h-9 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-purple-200" />
               </div>
               <h3 className="font-extrabold text-base tracking-tight">
                  {t("productDetail.freshnessPromise")}
               </h3>
            </div>
            <p className="text-purple-100/90 text-sm leading-relaxed pl-13">
               {t("productDetail.freshnessDesc")}
            </p>
         </div>
      </div>
   );
}
