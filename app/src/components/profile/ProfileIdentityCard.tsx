"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, ShieldCheck } from "lucide-react";

interface ProfileIdentityCardProps {
  readonly displayName: string;
  readonly email?: string | null;
}

export function ProfileIdentityCard({
  displayName: rawName,
  email,
}: ProfileIdentityCardProps) {
  const { t } = useLanguage();
  const displayName = rawName || t("profile.customer");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-100/90 bg-white p-6 shadow-xl shadow-purple-950/5 backdrop-blur-xl sm:p-7">
      {/* Ambient background glow elements */}
      <div className="bg-primary/10 pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-purple-200/20 blur-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Monogram Avatar with gradient frame & verification badge */}
        <div className="relative mb-4">
          <div className="from-primary shadow-primary/20 h-24 w-24 rounded-3xl bg-linear-to-tr to-purple-500 p-1 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white">
              <span className="text-primary text-3xl font-black">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-white bg-emerald-500 text-white shadow-md">
            <ShieldCheck size={14} strokeWidth={2.5} />
          </div>
        </div>

        {/* User display name & email */}
        <h2 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
          {displayName}
        </h2>
        {email && (
          <p className="mt-1 flex max-w-full items-center gap-1.5 truncate text-xs font-medium text-gray-500 sm:text-sm">
            <Mail size={13} className="shrink-0 text-gray-400" />
            <span className="truncate">{email}</span>
          </p>
        )}
      </div>
    </div>
  );
}
