"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const HomeFooter = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/40 pt-16 pb-8 text-white backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <img
                src="/icons/icon-192x192.png"
                alt="Frisch nach Hause Logo"
                className="h-6 w-6 rounded-md object-contain"
              />
              <span className="text-lg font-bold tracking-tight">
                Frisch nach Hause
              </span>
            </div>
            <p className="mb-6 max-w-xs text-sm text-white/70">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              {t("footer.delivery_slots")}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">
              {t("footer.product_title")}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.sourcing")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.cut_guide")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.storage")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.halal")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">
              {t("footer.company_title")}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.qs")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.delivery_zones")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.support")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">
              {t("footer.legal_title")}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("footer.cookie")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/70 md:flex-row">
          <p>{t("footer.rights").replace("{year}", year.toString())}</p>
          <div className="flex gap-4">
            <Link href="#" className="transition-colors hover:text-white">
              {t("footer.social.twitter")}
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              {t("footer.social.instagram")}
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              {t("footer.social.facebook")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
