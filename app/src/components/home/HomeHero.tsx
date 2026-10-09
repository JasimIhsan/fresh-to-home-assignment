"use client";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const HomeHero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden pt-32 pb-20 text-white md:pt-48 md:pb-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Social Proof Badge */}
        <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-medium text-white/90 shadow-xl backdrop-blur-md">
          <span className="flex text-green-400">
            <ShieldCheck size={16} />
          </span>
          {t("hero.badge")}
        </div>

        {/* Hero Copy */}
        <h1 className="animate-fade-in-up animation-delay-100 mx-auto mb-6 max-w-4xl text-4xl leading-[1.1] font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
          {t("hero.title_1")} <br className="hidden md:block" />
          <span className="from-primary bg-linear-to-r to-rose-400 bg-clip-text text-transparent drop-shadow-none">
            {t("hero.title_2")}
          </span>
        </h1>

        <p className="animate-fade-in-up animation-delay-200 mx-auto mb-10 max-w-2xl text-lg text-white/80 drop-shadow-md md:text-xl">
          {t("hero.description")}
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up animation-delay-300 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/catalog"
            className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-medium shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(225,29,72,0.6)] active:scale-95 sm:w-auto"
          >
            {t("hero.order_now")}
            <ChevronRight size={20} />
          </Link>
          <Link
            href="/catalog"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-medium text-white shadow-xl backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20 active:scale-95 sm:w-auto"
          >
            {t("hero.view_products")}
          </Link>
        </div>
      </div>
    </section>
  );
};
