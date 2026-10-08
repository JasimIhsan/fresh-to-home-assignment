"use client";

import { useLanguage } from "@/context/LanguageContext";
import { LogOut, X } from "lucide-react";
import { useEffect } from "react";

interface LogoutConfirmModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   loading?: boolean;
}

export function LogoutConfirmModal({ isOpen, onClose, onConfirm, loading = false }: LogoutConfirmModalProps) {
   const { t } = useLanguage();

   // Handle escape key and lock body scroll
   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape" && !loading) {
            onClose();
         }
      };

      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

      return () => {
         document.body.style.overflow = "";
         window.removeEventListener("keydown", handleKeyDown);
      };
   }, [isOpen, loading, onClose]);

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
         {/* Backdrop */}
         <div
            onClick={() => {
               if (!loading) onClose();
            }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            aria-hidden="true"
         />

         {/* Responsive Dialog: Bottom Sheet on Mobile, Modal on Desktop */}
         <div role="dialog" aria-modal="true" aria-labelledby="logout-dialog-title" className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 z-10 animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">
            {/* Mobile Sheet Handle */}
            {/* <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 md:hidden" /> */}

            {/* Desktop Close Button */}
            <button type="button" onClick={onClose} disabled={loading} className="hidden md:flex absolute right-5 top-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer" aria-label="Close dialog">
               <X size={18} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center space-y-3">
               <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-1 shadow-inner ring-4 ring-red-50/50">
                  <LogOut size={26} strokeWidth={2.2} className="translate-x-0.5" />
               </div>

               <h2 id="logout-dialog-title" className="text-xl font-black text-gray-900 tracking-tight">
                  {t("profile.logoutConfirmTitle") || "Abmeldung bestätigen"}
               </h2>

               <p className="text-sm text-gray-500 max-w-sm leading-relaxed">{t("profile.logoutConfirmDesc") || "Möchten Sie sich wirklich von Ihrem Konto abmelden? Sie können sich jederzeit wieder anmelden."}</p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
               <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-2xl font-bold text-sm transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50">
                  {t("profile.cancel")}
               </button>

               <button type="button" onClick={onConfirm} disabled={loading} className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-red-600/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50">
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                     <>
                        <LogOut size={16} strokeWidth={2.2} />
                        <span>{t("profile.logout") || "Abmelden"}</span>
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
}
