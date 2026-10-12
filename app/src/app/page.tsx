import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTrending } from "@/components/home/HomeTrending";
import { cacheLife } from "next/cache";
import Image from "next/image";

/** Cached so the clock read doesn't make the static shell dynamic. */
async function getCopyrightYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Home() {
  const year = await getCopyrightYear();

  return (
    <div className="selection:bg-primary/30 relative flex min-h-screen flex-col overflow-x-hidden font-sans text-white">
      <div className="fixed inset-0 -z-50">
        <Image
          src="/images/products/raw_beef_steak.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" />
      </div>
      <HomeHeader />

      <main className="flex-1">
        <HomeHero />
        <HomeTrending />
      </main>

      <HomeFooter year={year} />

      <PwaInstallPrompt />
    </div>
  );
}
