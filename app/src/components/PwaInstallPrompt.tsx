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
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-slide-in-right">
         <div className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between border-t-4 border-primary relative">
            <button onClick={() => setShowPrompt(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
               <X size={20} />
            </button>

            <div className="flex items-center mb-4 sm:mb-0">
               <div className="bg-primary-light p-3 rounded-full mr-4 text-primary">
                  <Download size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-gray-800 text-lg">{t("install.title")}</h3>
                  <p className="text-sm text-gray-500">{t("install.subtitle")}</p>
               </div>
            </div>

            {isIOS && !deferredPrompt ? (
               <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg flex flex-col gap-2">
                  <p className="flex items-center gap-2">
                     {t("install.iosStep1")}
                     <span className="bg-white p-1 rounded shadow-sm border border-gray-200">
                        <Share className="w-4 h-4 text-blue-500" />
                     </span>
                  </p>
                  <p className="flex items-center gap-2">
                     {t("install.iosStep2")}
                     <span className="bg-white p-1 rounded shadow-sm border border-gray-200">
                        <PlusSquare className="w-4 h-4 text-gray-700" />
                     </span>
                  </p>
               </div>
            ) : (
               <button onClick={handleInstallClick} className="w-full sm:w-auto bg-primary text-white font-bold py-2 px-6 rounded-xl shadow-md hover:bg-opacity-90 transition-all">
                  {t("install.button")}
               </button>
            )}
         </div>
      </div>
   );
}
