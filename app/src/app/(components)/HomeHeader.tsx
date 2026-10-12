"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export const HomeHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        isScrolled || isMobileMenuOpen
          ? "border-white/10 bg-black/50 text-white shadow-lg backdrop-blur-xl"
          : "border-transparent bg-transparent text-white"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/icon-192x192.png"
            alt="Frisch nach Hause Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-white">
            Frisch nach Hause
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          <Link
            href="#fresh-cuts"
            className="transition-colors hover:text-white"
          >
            {t("header.fresh_cuts")}
          </Link>
          <Link
            href="#specialty"
            className="transition-colors hover:text-white"
          >
            {t("header.specialty")}
          </Link>
          <Link href="#quality" className="transition-colors hover:text-white">
            {t("header.quality_promise")}
          </Link>
          <Link href="#delivery" className="transition-colors hover:text-white">
            {t("header.delivery_areas")}
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleLanguage}
            className="mr-2 flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <Globe size={16} /> {language.toUpperCase()}
          </button>
          {!user && (
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("home.login")}
            </Link>
          )}
          <Link
            href="/catalog"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/40 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium shadow-md transition-all active:scale-95"
          >
            {t("header.order_button")}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 p-2 text-sm font-medium text-white"
          >
            <Globe size={16} /> {language.toUpperCase()}
          </button>
          <button
            className="p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-black/75 backdrop-blur-2xl transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col px-6 py-8">
          <nav className="flex flex-col gap-6 text-[17px] font-medium text-white/70">
            <Link
              href="#fresh-cuts"
              className="transition-colors hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("header.fresh_cuts")}
            </Link>
            <Link
              href="#specialty"
              className="transition-colors hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("header.specialty")}
            </Link>
            <Link
              href="#quality"
              className="transition-colors hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("header.quality_promise")}
            </Link>
            <Link
              href="#delivery"
              className="transition-colors hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("header.delivery_areas")}
            </Link>

            {!user && (
              <>
                <div className="my-2 h-px w-full bg-white/10" />
                <Link
                  href="/login"
                  className="transition-colors hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("home.login")}
                </Link>
              </>
            )}
          </nav>

          <div className="mt-8">
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-primary text-primary-foreground flex w-full items-center justify-center rounded-full px-4 py-3.5 text-base font-medium transition-all active:scale-95"
            >
              {t("header.order_button")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
