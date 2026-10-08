"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function HomeTrending() {
   const { t } = useLanguage();

   return (
      <section className="py-16 md:py-24 bg-transparent px-4 sm:px-6 lg:px-8 w-full text-white">
         <div className="max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-end mb-10">
               <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">{t("trending.title")}</h2>
                  <p className="text-white/80 font-medium text-base md:text-lg">{t("trending.subtitle")}</p>
               </div>
               <Link href="/catalog" className="hidden md:flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors group">
                  {t("trending.view_all")}
                  <ArrowRight className="w-5 h-5 groups-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:h-150 w-full">
               {/* Main Large Card - Beef */}
               <Link href="/catalog" className="group relative col-span-1 md:col-span-2 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 block h-[350px] md:h-full min-h-0 w-full border border-white/10">
                  <img src="/images/products/raw_beef_steak.jpg" alt="Premium Beef" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6">
                     <div className="w-10 h-1.5 bg-red-500 rounded-full mb-4 transform origin-left transition-transform duration-300 group-hover:scale-x-150"></div>
                     <h3 className="text-white font-black text-3xl md:text-5xl mb-2">{t("trending.categories.beef")}</h3>
                     <div className="flex items-center justify-between">
                        <p className="text-white/80 font-medium md:text-lg">Premium Cut • Grass-fed</p>
                        <div className="bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                           <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                     </div>
                  </div>
               </Link>

               {/* Right Column Stack */}
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 md:gap-6 col-span-1 h-auto md:h-full min-h-0">
                  {/* Top Right - Chicken */}
                  <Link href="/catalog" className="group relative rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 block h-[250px] md:h-full min-h-0 w-full border border-white/10">
                     <img src="/images/products/raw_chicken_breast.jpg" alt="Fresh Chicken" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                     <div className="absolute bottom-6 left-6 right-6">
                        <div className="w-8 h-1 bg-orange-400 rounded-full mb-3 transform origin-left transition-transform duration-300 group-hover:scale-x-150"></div>
                        <h3 className="text-white font-bold text-2xl mb-1">{t("trending.categories.chicken")}</h3>
                        <span className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:text-white transition-colors">
                           {t("trending.shop_now")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </div>
                  </Link>

                  {/* Bottom Right - Lamb */}
                  <Link href="/catalog" className="group relative rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 block h-[250px] md:h-full min-h-0 w-full border border-white/10">
                     <img src="/images/products/raw_lamb_chops.jpg" alt="Lamb Cuts" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                     <div className="absolute bottom-6 left-6 right-6">
                        <div className="w-8 h-1 bg-amber-600 rounded-full mb-3 transform origin-left transition-transform duration-300 group-hover:scale-x-150"></div>
                        <h3 className="text-white font-bold text-2xl mb-1">{t("trending.categories.lamb")}</h3>
                        <span className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:text-white transition-colors">
                           {t("trending.shop_now")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </div>
                  </Link>
               </div>
            </div>
         </div>
      </section>
   );
}
