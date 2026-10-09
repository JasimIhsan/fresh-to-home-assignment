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

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: LogoutConfirmModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!loading) onClose();
        }}
        className="animate-in fade-in fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Responsive Dialog: Bottom Sheet on Mobile, Modal on Desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        className="animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 relative z-10 w-full rounded-t-3xl border border-gray-100 bg-white p-6 shadow-2xl duration-200 sm:p-7 md:max-w-md md:rounded-3xl"
      >
        {/* Mobile Sheet Handle */}
        {/* <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 md:hidden" /> */}

        {/* Desktop Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 hidden cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 md:flex"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-inner ring-4 ring-red-50/50">
            <LogOut size={26} strokeWidth={2.2} className="translate-x-0.5" />
          </div>

          <h2
            id="logout-dialog-title"
            className="text-xl font-black tracking-tight text-gray-900"
          >
            {t("profile.logoutConfirmTitle") || "Abmeldung bestätigen"}
          </h2>

          <p className="max-w-sm text-sm leading-relaxed text-gray-500">
            {t("profile.logoutConfirmDesc") ||
              "Möchten Sie sich wirklich von Ihrem Konto abmelden? Sie können sich jederzeit wieder anmelden."}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-2xl bg-gray-100 px-4 py-3.5 text-sm font-bold text-gray-700 transition-all duration-150 hover:bg-gray-200/80 active:scale-95 disabled:opacity-50"
          >
            {t("profile.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-all duration-150 hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
