"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight, ExternalLink, FileText, Shield } from "lucide-react";
import Link from "next/link";

interface ProfileSecuritySectionProps {
   isAdmin?: boolean;
}

export function ProfileSecuritySection({ isAdmin }: ProfileSecuritySectionProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/90 overflow-hidden">
         <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
               {t("profile.security")}
            </h3>
         </div>

         <div className="divide-y divide-gray-100">
            <Link
               href="/privacy"
               className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/80 transition-colors group cursor-pointer"
            >
               <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                     <FileText size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                     <span className="block text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {t("profile.privacy")}
                     </span>
                     <span className="text-xs text-gray-400">DSGVO & Nutzungsbedingungen</span>
                  </div>
               </div>
               <ChevronRight size={18} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            {isAdmin && (
               <Link
                  href="/admin"
                  className="flex items-center justify-between p-4 sm:p-5 bg-purple-50/60 hover:bg-purple-100/70 transition-colors group cursor-pointer"
               >
                  <div className="flex items-center gap-3.5">
                     <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                        <Shield size={20} />
                     </div>
                     <div>
                        <span className="block text-sm font-extrabold text-primary">
                           {t("profile.adminDashboard")}
                        </span>
                        <span className="text-xs text-primary/70">Verwaltung & Bestellübersicht</span>
                     </div>
                  </div>
                  <ExternalLink size={18} className="text-primary/70 group-hover:text-primary transition-colors" />
               </Link>
            )}
         </div>
      </div>
   );
}
