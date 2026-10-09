"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BeforeInstallPromptEvent, NavigatorWithNetwork } from "@/types";
import { Download, PlusSquare, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

export function PwaInstallPrompt() {
  const { t } = useLanguage();
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    console.log("[PWA] Component mounted. Initializing checks...");

    if ("serviceWorker" in navigator) {
      console.log(
        "[PWA] Service Worker is supported. Attempting registration..."
      );
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[PWA] ServiceWorker registration successful with scope: ",
            registration.scope
          );
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
    const navWithNetwork = window.navigator as NavigatorWithNetwork;
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean(navWithNetwork.standalone);
    setIsStandalone(isStandaloneMode);
    console.log("[PWA] isStandaloneMode calculated as:", isStandaloneMode);

    // If not installed, show our custom prompt after a delay
    if (!isStandaloneMode) {
      console.log(
        "[PWA] App is not installed. Setting 3 second timer for prompt..."
      );
      setTimeout(() => {
        console.log(
          "[PWA] 3 second timer finished. Setting showPrompt to true."
        );
        setShowPrompt(true);
      }, 3000);
    }

    // Capture standard install prompt for Android/Chrome
    console.log("[PWA] Registering 'beforeinstallprompt' event listener.");
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("[PWA] ✅ 'beforeinstallprompt' EVENT FIRED!");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallClick = async () => {
    console.log(
      "[PWA] Install button clicked. deferredPrompt exists:",
      !!deferredPrompt
    );
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

  console.log(
    `[PWA] Render Evaluation -> isStandalone: ${isStandalone}, showPrompt: ${showPrompt}, isIOS: ${isIOS}, hasDeferredPrompt: ${!!deferredPrompt}`
  );

  if (isStandalone || !showPrompt || (!isIOS && !deferredPrompt)) {
    if (!isStandalone && showPrompt && !isIOS && !deferredPrompt) {
      console.log(
        "[PWA] ⚠️ Prompt is hidden because it's not iOS and 'beforeinstallprompt' hasn't fired yet."
      );
    }
    return null;
  }

  return (
    <div className="animate-slide-in-right fixed right-0 bottom-0 left-0 z-50 w-full transition-all duration-500 sm:right-6 sm:bottom-6 sm:left-auto sm:w-100">
      {/* Mobile: bottom sheet style. Desktop: floating card style */}
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-t-[2.5rem] border-t border-white/10 bg-black/50 p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-3xl sm:border sm:p-8">
        {/* Ambient glow */}
        <div className="bg-primary/20 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />

        <button
          onClick={() => setShowPrompt(false)}
          className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-5 pr-8">
          <div className="bg-primary/20 text-primary shrink-0 rounded-2xl p-4 shadow-inner">
            <Download size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="mb-1.5 text-xl leading-tight font-extrabold text-white">
              {t("install.title") || "Install App"}
            </h3>
            <p className="text-sm leading-relaxed font-medium text-white/70">
              {t("install.subtitle") ||
                "Get the full experience on your home screen."}
            </p>
          </div>
        </div>

        {isIOS && !deferredPrompt ? (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/90">
            <p className="flex items-center gap-3 font-medium">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
                1
              </span>
              {t("install.iosStep1") || "Tap the Share button"}
              <span className="ml-auto shrink-0 rounded-lg border border-white/10 bg-white/10 p-2 shadow-sm">
                <Share className="h-4 w-4 text-blue-400" />
              </span>
            </p>
            <p className="flex items-center gap-3 font-medium">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
                2
              </span>
              {t("install.iosStep2") || "Select Add to Home Screen"}
              <span className="ml-auto shrink-0 rounded-lg border border-white/10 bg-white/10 p-2 shadow-sm">
                <PlusSquare className="h-4 w-4 text-white/80" />
              </span>
            </p>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="bg-primary text-primary-foreground mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-95"
          >
            <Download size={20} strokeWidth={2.5} />
            {t("install.button") || "Install Now"}
          </button>
        )}
      </div>
    </div>
  );
}
