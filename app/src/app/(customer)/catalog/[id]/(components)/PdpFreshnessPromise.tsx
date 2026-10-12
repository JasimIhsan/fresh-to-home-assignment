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
    <div className="via-primary relative overflow-hidden rounded-3xl bg-linear-to-br from-purple-900 to-violet-800 p-6 text-white shadow-lg">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck size={20} className="text-purple-200" />
          </div>
          <h3 className="text-base font-extrabold tracking-tight">
            {t("productDetail.freshnessPromise")}
          </h3>
        </div>
        <p className="pl-13 text-sm leading-relaxed text-purple-100/90">
          {t("productDetail.freshnessDesc")}
        </p>
      </div>
    </div>
  );
}
