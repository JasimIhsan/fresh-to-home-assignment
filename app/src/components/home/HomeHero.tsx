"use client";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const HomeHero = () => {
   const { t } = useLanguage();
   return (
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium mb-8 text-white/90 shadow-xl animate-fade-in-up">
               <span className="flex text-green-400">
                  <ShieldCheck size={16} />
               </span>
               {t("hero.badge")}
            </div>

            {/* Hero Copy */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6 animate-fade-in-up animation-delay-100 drop-shadow-lg">
               {t("hero.title_1")} <br className="hidden md:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400 drop-shadow-none">{t("hero.title_2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200 drop-shadow-md">{t("hero.description")}</p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
               <Link href="/catalog" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-lg shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_40px_rgba(225,29,72,0.6)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2">
                  {t("hero.order_now")}
                  <ChevronRight size={20} />
               </Link>
               <Link href="/catalog" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shadow-xl">
                  {t("hero.view_products")}
               </Link>
            </div>
         </div>
      </section>
   );
};
