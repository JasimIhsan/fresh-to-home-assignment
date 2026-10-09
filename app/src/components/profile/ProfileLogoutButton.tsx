"use client";

import { useLanguage } from "@/context/LanguageContext";
import { LogOut } from "lucide-react";

interface ProfileLogoutButtonProps {
  onLogout: () => void;
  loading: boolean;
}

export function ProfileLogoutButton({
  onLogout,
  loading,
}: ProfileLogoutButtonProps) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-3xl border border-gray-100 bg-white px-6 py-4 text-sm font-bold text-red-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50/80 active:scale-[0.99] disabled:opacity-50"
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
      ) : (
        <>
          <LogOut size={18} strokeWidth={2.2} />
          <span>{t("profile.logout")}</span>
        </>
      )}
    </button>
  );
}
