"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const HomeFooter = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl pt-16 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/icons/icon-192x192.png" alt="Frisch nach Hause Logo" className="w-6 h-6 rounded-md object-contain" />
              <span className="font-bold text-lg tracking-tight">Frisch nach Hause</span>
            </div>
            <p className="text-white/70 text-sm max-w-xs mb-6">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-2 text-sm text-white/70">
               <div className="w-2 h-2 rounded-full bg-green-500" />
               {t("footer.delivery_slots")}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.product_title")}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.sourcing")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.cut_guide")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.storage")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.halal")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.company_title")}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.qs")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.delivery_zones")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.support")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.legal_title")}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.cookie")}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/70">
          <p>{t("footer.rights").replace("{year}", year.toString())}</p>
          <div className="flex gap-4">
             <Link href="#" className="hover:text-white transition-colors">{t("footer.social.twitter")}</Link>
             <Link href="#" className="hover:text-white transition-colors">{t("footer.social.instagram")}</Link>
             <Link href="#" className="hover:text-white transition-colors">{t("footer.social.facebook")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
