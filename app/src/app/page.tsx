"use client";

import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTrending } from "@/components/home/HomeTrending";

export default function Home() {
   return (
      <div className="relative min-h-screen flex flex-col font-sans selection:bg-primary/30 overflow-x-hidden text-white">
         <div className="fixed inset-0 -z-50">
            <img src="/images/products/raw_beef_steak.jpg" alt="Background" className="w-full h-full object-cover" />
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
