"use client";

import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTrending } from "@/components/home/HomeTrending";

export default function Home() {
  return (
    <div className="selection:bg-primary/30 relative flex min-h-screen flex-col overflow-x-hidden font-sans text-white">
      <div className="fixed inset-0 -z-50">
        <img
          src="/images/products/raw_beef_steak.jpg"
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" />
      </div>
      <HomeHeader />

      <main className="flex-1">
        <HomeHero />
        <HomeTrending />
      </main>

      <HomeFooter />

      <PwaInstallPrompt />
    </div>
  );
}
