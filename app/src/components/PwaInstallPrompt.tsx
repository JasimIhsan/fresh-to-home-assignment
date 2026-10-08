"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Download, PlusSquare, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

export function PwaInstallPrompt() {
   const { t } = useLanguage();
   const [isIOS, setIsIOS] = useState(false);
   const [isStandalone, setIsStandalone] = useState(false);
   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
   const [showPrompt, setShowPrompt] = useState(false);

   useEffect(() => {
      console.log("[PWA] Component mounted. Initializing checks...");

      if ("serviceWorker" in navigator) {
         console.log("[PWA] Service Worker is supported. Attempting registration...");
         navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
               console.log("[PWA] ServiceWorker registration successful with scope: ", registration.scope);
            })
            .catch((err) => {
               console.error("[PWA] ServiceWorker registration failed: ", err);
            });
      } else {
         console.log("[PWA] Service Worker is NOT supported in this browser.");
      }

      // Check if device is iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);
      console.log("[PWA] Detected userAgent:", userAgent);
      console.log("[PWA] isIOS calculated as:", isIosDevice);

      // Check if app is already installed
      const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches || ("standalone" in window.navigator && (window.navigator as any).standalone);
      setIsStandalone(isStandaloneMode);
      console.log("[PWA] isStandaloneMode calculated as:", isStandaloneMode);

      // If not installed, show our custom prompt after a delay
      if (!isStandaloneMode) {
         console.log("[PWA] App is not installed. Setting 3 second timer for prompt...");
         setTimeout(() => {
            console.log("[PWA] 3 second timer finished. Setting showPrompt to true.");
            setShowPrompt(true);
         }, 3000);
      }

      // Capture standard install prompt for Android/Chrome
      console.log("[PWA] Registering 'beforeinstallprompt' event listener.");
      const handleBeforeInstallPrompt = (e: any) => {
         console.log("[PWA] ✅ 'beforeinstallprompt' EVENT FIRED!");
         e.preventDefault();
         setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
   }, []);

   const handleInstallClick = async () => {
      console.log("[PWA] Install button clicked. deferredPrompt exists:", !!deferredPrompt);
      if (deferredPrompt) {
         console.log("[PWA] Triggering deferredPrompt.prompt()...");
         deferredPrompt.prompt();
         const { outcome } = await deferredPrompt.userChoice;
         console.log("[PWA] User choice outcome:", outcome);
         if (outcome === "accepted") {
            setShowPrompt(false);
         }
         setDeferredPrompt(null);
      }
   };

   console.log(`[PWA] Render Evaluation -> isStandalone: ${isStandalone}, showPrompt: ${showPrompt}, isIOS: ${isIOS}, hasDeferredPrompt: ${!!deferredPrompt}`);

   if (isStandalone || !showPrompt || (!isIOS && !deferredPrompt)) {
      if (!isStandalone && showPrompt && !isIOS && !deferredPrompt) {
         console.log("[PWA] ⚠️ Prompt is hidden because it's not iOS and 'beforeinstallprompt' hasn't fired yet.");
      }
      return null;
   }

   return (
      <div className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-6 sm:right-6 sm:left-auto w-full sm:w-[400px] transition-all duration-500 animate-slide-in-right">
         {/* Mobile: bottom sheet style. Desktop: floating card style */}
         <div className="bg-black/50 backdrop-blur-2xl sm:rounded-3xl rounded-t-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t sm:border border-white/10 p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <button onClick={() => setShowPrompt(false)} className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10">
               <X size={18} />
            </button>

            <div className="flex items-start gap-5 pr-8">
               <div className="bg-primary/20 p-4 rounded-2xl text-primary shrink-0 shadow-inner">
                  <Download size={28} strokeWidth={2.5} />
               </div>
               <div>
                  <h3 className="font-extrabold text-white text-xl leading-tight mb-1.5">{t("install.title") || "Install App"}</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">{t("install.subtitle") || "Get the full experience on your home screen."}</p>
               </div>
            </div>

            {isIOS && !deferredPrompt ? (
               <div className="mt-4 text-sm text-white/90 bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
                  <p className="flex items-center gap-3 font-medium">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs shrink-0">1</span>
                     {t("install.iosStep1") || "Tap the Share button"}
                     <span className="bg-white/10 p-2 rounded-lg shadow-sm border border-white/10 ml-auto shrink-0">
                        <Share className="w-4 h-4 text-blue-400" />
                     </span>
                  </p>
                  <p className="flex items-center gap-3 font-medium">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs shrink-0">2</span>
                     {t("install.iosStep2") || "Select Add to Home Screen"}
                     <span className="bg-white/10 p-2 rounded-lg shadow-sm border border-white/10 ml-auto shrink-0">
                        <PlusSquare className="w-4 h-4 text-white/80" />
                     </span>
                  </p>
               </div>
            ) : (
               <button onClick={handleInstallClick} className="mt-4 w-full bg-primary text-primary-foreground font-bold text-base py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Download size={20} strokeWidth={2.5} />
                  {t("install.button") || "Install Now"}
               </button>
            )}
         </div>
      </div>
   );
}
