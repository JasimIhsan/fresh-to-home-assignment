"use client";

import { useLanguage } from "@/context/LanguageContext";
import { LogOut } from "lucide-react";

interface ProfileLogoutButtonProps {
   onLogout: () => void;
   loading: boolean;
}

export function ProfileLogoutButton({ onLogout, loading }: ProfileLogoutButtonProps) {
   const { t } = useLanguage();

   return (
      <button
         onClick={onLogout}
         disabled={loading}
         className="w-full bg-white hover:bg-red-50/80 border border-gray-100 hover:border-red-200 text-red-600 py-4 px-6 rounded-3xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
      >
         {loading ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
         ) : (
            <>
               <LogOut size={18} strokeWidth={2.2} />
               <span>{t("profile.logout")}</span>
            </>
         )}
      </button>
   );
}
