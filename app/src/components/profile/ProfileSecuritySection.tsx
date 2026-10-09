"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight, ExternalLink, FileText, Shield } from "lucide-react";
import Link from "next/link";

interface ProfileSecuritySectionProps {
  isAdmin?: boolean;
}

export function ProfileSecuritySection({
  isAdmin,
}: ProfileSecuritySectionProps) {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100/90 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
        <h3 className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">
          {t("profile.security")}
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        <Link
          href="/privacy"
          className="group flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50/80 sm:p-5"
        >
          <div className="flex items-center gap-3.5">
            <div className="group-hover:bg-primary/10 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 transition-colors">
              <FileText
                size={20}
                className="group-hover:text-primary text-gray-600 transition-colors"
              />
            </div>
            <div>
              <span className="group-hover:text-primary block text-sm font-bold text-gray-900 transition-colors">
                {t("profile.privacy")}
              </span>
              <span className="text-xs text-gray-400">
                DSGVO & Nutzungsbedingungen
              </span>
            </div>
          </div>
          <ChevronRight
            size={18}
            className="group-hover:text-primary text-gray-400 transition-all group-hover:translate-x-0.5"
          />
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="group flex cursor-pointer items-center justify-between bg-purple-50/60 p-4 transition-colors hover:bg-purple-100/70 sm:p-5"
          >
            <div className="flex items-center gap-3.5">
              <div className="bg-primary shadow-primary/20 flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md">
                <Shield size={20} />
              </div>
              <div>
                <span className="text-primary block text-sm font-extrabold">
                  {t("profile.adminDashboard")}
                </span>
                <span className="text-primary/70 text-xs">
                  Verwaltung & Bestellübersicht
                </span>
              </div>
            </div>
            <ExternalLink
              size={18}
              className="text-primary/70 group-hover:text-primary transition-colors"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
