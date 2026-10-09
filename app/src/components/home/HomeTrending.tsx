"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function HomeTrending() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-transparent px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="mb-3 text-3xl font-black tracking-tight text-white md:text-5xl">
              {t("trending.title")}
            </h2>
            <p className="text-base font-medium text-white/80 md:text-lg">
              {t("trending.subtitle")}
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-primary hover:text-primary/80 group hidden items-center gap-2 font-bold transition-colors md:flex"
          >
            {t("trending.view_all")}
            <ArrowRight className="groups-hover:translate-x-1 h-5 w-5 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid w-full grid-cols-1 gap-4 md:h-150 md:grid-cols-3 md:gap-6">
          {/* Main Large Card - Beef */}
          <Link
            href="/catalog"
            className="group relative col-span-1 block h-87.5 min-h-0 w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] md:col-span-2 md:h-full"
          >
            <img
              src="/images/products/raw_beef_steak.jpg"
              alt="Premium Beef"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>

            <div className="absolute right-6 bottom-6 left-6 md:bottom-8 md:left-8">
              <div className="mb-4 h-1.5 w-10 origin-left transform rounded-full bg-red-500 transition-transform duration-300 group-hover:scale-x-150"></div>
              <h3 className="mb-2 text-3xl font-black text-white md:text-5xl">
                {t("trending.categories.beef")}
              </h3>
              <div className="flex items-center justify-between">
                <p className="font-medium text-white/80 md:text-lg">
                  Premium Cut • Grass-fed
                </p>
                <div className="translate-y-4 rounded-full bg-white/20 p-3 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:p-4">
                  <ShoppingBag className="h-5 w-5 text-white md:h-6 md:w-6" />
                </div>
              </div>
            </div>
          </Link>

          {/* Right Column Stack */}
          <div className="col-span-1 grid h-auto min-h-0 grid-cols-1 gap-4 sm:grid-cols-2 md:h-full md:grid-cols-1 md:grid-rows-2 md:gap-6">
            {/* Top Right - Chicken */}
            <Link
              href="/catalog"
              className="group relative block h-62.5 min-h-0 w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] md:h-full"
            >
              <img
                src="/images/products/raw_chicken_breast.jpg"
                alt="Fresh Chicken"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="absolute right-6 bottom-6 left-6">
                <div className="mb-3 h-1 w-8 origin-left transform rounded-full bg-orange-400 transition-transform duration-300 group-hover:scale-x-150"></div>
                <h3 className="mb-1 text-2xl font-bold text-white">
                  {t("trending.categories.chicken")}
                </h3>
                <span className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                  {t("trending.shop_now")}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Bottom Right - Lamb */}
            <Link
              href="/catalog"
              className="group relative block h-62.5 min-h-0 w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] md:h-full"
            >
              <img
                src="/images/products/raw_lamb_chops.jpg"
                alt="Lamb Cuts"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="absolute right-6 bottom-6 left-6">
                <div className="mb-3 h-1 w-8 origin-left transform rounded-full bg-amber-600 transition-transform duration-300 group-hover:scale-x-150"></div>
                <h3 className="mb-1 text-2xl font-bold text-white">
                  {t("trending.categories.lamb")}
                </h3>
                <span className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                  {t("trending.shop_now")}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
