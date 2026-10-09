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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        isScrolled || isMobileMenuOpen
          ? "bg-black/50 backdrop-blur-xl border-white/10 shadow-lg text-white"
          : "bg-transparent border-transparent text-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icons/icon-192x192.png" alt="Frisch nach Hause Logo" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-bold text-xl tracking-tight text-white">Frisch nach Hause</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link href="#fresh-cuts" className="hover:text-white transition-colors">{t("header.fresh_cuts")}</Link>
          <Link href="#specialty" className="hover:text-white transition-colors">{t("header.specialty")}</Link>
          <Link href="#quality" className="hover:text-white transition-colors">{t("header.quality_promise")}</Link>
          <Link href="#delivery" className="hover:text-white transition-colors">{t("header.delivery_areas")}</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleLanguage} className="flex items-center gap-1.5 text-sm font-medium hover:text-white transition-colors text-white/80 mr-2">
            <Globe size={16} /> {language.toUpperCase()}
          </button>
          {!user && (
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors text-white/80">
              {t("home.login")}
            </Link>
          )}
          <Link href="/catalog" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 active:scale-95 inline-flex items-center justify-center">
            {t("header.order_button")}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleLanguage} className="p-2 text-white font-medium text-sm flex items-center gap-1">
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
          "md:hidden fixed inset-x-0 top-16 bottom-0 bg-black/75 backdrop-blur-2xl transition-transform duration-300 ease-in-out z-40 overflow-y-auto border-t border-white/10",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full px-6 py-8">
          <nav className="flex flex-col gap-6 text-[17px] font-medium text-white/70">
            <Link href="#fresh-cuts" className="hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {t("header.fresh_cuts")}
            </Link>
            <Link href="#specialty" className="hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {t("header.specialty")}
            </Link>
            <Link href="#quality" className="hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {t("header.quality_promise")}
            </Link>
            <Link href="#delivery" className="hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {t("header.delivery_areas")}
            </Link>
            
            {!user && (
              <>
                <div className="h-px w-full bg-white/10 my-2" />
                <Link href="/login" className="hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("home.login")}
                </Link>
              </>
            )}
          </nav>

          <div className="mt-8">
            <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-primary text-primary-foreground px-4 py-3.5 rounded-full text-base font-medium active:scale-95 transition-all flex items-center justify-center">
              {t("header.order_button")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
