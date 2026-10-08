"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, RefreshCw, SignalLow, WifiOff, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function NetworkStatusWatcher() {
   const { t } = useLanguage();
   const [isOnline, setIsOnline] = useState(true);
   const [isSlow, setIsSlow] = useState(false);
   const [isReconnecting, setIsReconnecting] = useState(false);
   const [showRestored, setShowRestored] = useState(false);
   const [dismissedSlow, setDismissedSlow] = useState(false);

   // Check slow network using Network Information API if available
   const checkConnectionQuality = useCallback(() => {
      if (typeof window === "undefined") return;

      if (!navigator.onLine) {
         setIsOnline(false);
         setIsSlow(false);
         return;
      }

      const connection =
         (navigator as any).connection ||
         (navigator as any).mozConnection ||
         (navigator as any).webkitConnection;

      if (connection) {
         const effectiveType = connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
         const rtt = connection.rtt; // round-trip time in ms
         const downlink = connection.downlink; // bandwidth in Mbps

         const isSlowCondition =
            effectiveType === "slow-2g" ||
            effectiveType === "2g" ||
            (rtt && rtt > 1800) ||
            (downlink && downlink < 0.35) ||
            (effectiveType === "3g" && rtt && rtt > 1200);

         setIsSlow(Boolean(isSlowCondition));
      }
   }, []);

   const checkRealConnectivity = useCallback(async () => {
      if (typeof window === "undefined") return;
      setIsReconnecting(true);

      try {
         const startTime = Date.now();
         const controller = new AbortController();
         const timeoutId = setTimeout(() => controller.abort(), 4000);

         const response = await fetch(`/favicon.ico?_t=${Date.now()}`, {
            method: "HEAD",
            cache: "no-store",
            signal: controller.signal,
         });

         clearTimeout(timeoutId);
         const latency = Date.now() - startTime;

         if (response.ok || response.status === 304 || response.type === "opaque") {
            const wasOffline = !isOnline;
            setIsOnline(true);
            setIsSlow(latency > 2500);

            if (wasOffline) {
               setShowRestored(true);
               setTimeout(() => setShowRestored(false), 3500);
            }
         } else {
            setIsOnline(false);
         }
      } catch {
         if (!navigator.onLine) {
            setIsOnline(false);
         } else {
            setIsSlow(true);
         }
      } finally {
         setIsReconnecting(false);
      }
   }, [isOnline]);

   useEffect(() => {
      if (typeof window === "undefined") return;

      setIsOnline(navigator.onLine);
      checkConnectionQuality();

      const handleOnline = () => {
         setIsOnline(true);
         setShowRestored(true);
         setTimeout(() => setShowRestored(false), 3500);
         checkConnectionQuality();
         checkRealConnectivity();
      };

      const handleOffline = () => {
         setIsOnline(false);
         setShowRestored(false);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const connection =
         (navigator as any).connection ||
         (navigator as any).mozConnection ||
         (navigator as any).webkitConnection;

      if (connection) {
         connection.addEventListener("change", checkConnectionQuality);
      }

      const interval = setInterval(() => {
         checkConnectionQuality();
      }, 25000);

      return () => {
         window.removeEventListener("online", handleOnline);
         window.removeEventListener("offline", handleOffline);
         if (connection) {
            connection.removeEventListener("change", checkConnectionQuality);
         }
         clearInterval(interval);
      };
   }, [checkConnectionQuality, checkRealConnectivity]);

   const isOffline = !isOnline;
   const shouldShowSlowBanner = isOnline && isSlow && !dismissedSlow;

   return (
      <>
         {/* Toast when back online */}
         {showRestored && (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 border border-emerald-500/40 flex items-center gap-2.5 text-sm font-bold transition-all duration-300 animate-in fade-in slide-in-from-top-4">
               <CheckCircle2 className="w-4 h-4 text-emerald-100 shrink-0" />
               <span>{t("network.onlineRestored")}</span>
            </div>
         )}

         {/* Slow Network Pill matching app card styling */}
         {shouldShowSlowBanner && (
            <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-[calc(100%-2rem)] bg-white/95 backdrop-blur-xl border border-amber-200/80 text-gray-900 p-3.5 rounded-2xl shadow-2xl shadow-amber-950/10 flex items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
               <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 ring-4 ring-amber-50/60">
                     <SignalLow className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                     <p className="font-bold text-gray-900 truncate">{t("network.slowTitle")}</p>
                     <p className="text-gray-500 text-xs truncate">{t("network.slowDesc")}</p>
                  </div>
               </div>

               <div className="flex items-center gap-1.5 shrink-0">
                  <button
                     type="button"
                     onClick={checkRealConnectivity}
                     disabled={isReconnecting}
                     className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm shadow-amber-500/20 disabled:opacity-60"
                  >
                     <RefreshCw className={`w-3.5 h-3.5 ${isReconnecting ? "animate-spin" : ""}`} />
                     <span>{t("network.retry")}</span>
                  </button>
                  <button
                     type="button"
                     onClick={() => setDismissedSlow(true)}
                     className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                     aria-label="Dismiss"
                  >
                     <X className="w-4 h-4" />
                  </button>
               </div>
            </div>
         )}

         {/* Offline Bottom Sheet on Mobile / Modal on Desktop matching LogoutConfirmModal UI */}
         {isOffline && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
               {/* Backdrop */}
               <div
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
                  aria-hidden="true"
               />

               {/* Dialog Container */}
               <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="offline-dialog-title"
                  className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 z-10 animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 text-gray-900 select-none"
               >
                  {/* Handle bar on mobile */}
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 md:hidden" />

                  {/* Icon & Title */}
                  <div className="flex flex-col items-center text-center space-y-3">
                     <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-1 shadow-inner ring-4 ring-red-50/50">
                        <WifiOff size={28} strokeWidth={2.2} />
                     </div>

                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                        Frisch nach Hause
                     </span>

                     <h2 id="offline-dialog-title" className="text-xl font-black text-gray-900 tracking-tight">
                        {t("network.offlineTitle")}
                     </h2>

                     <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                        {t("network.offlineDesc")}
                     </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-7 flex flex-col gap-3">
                     <button
                        type="button"
                        onClick={checkRealConnectivity}
                        disabled={isReconnecting}
                        className="w-full py-3.5 px-4 bg-primary hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-primary/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                     >
                        {isReconnecting ? (
                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                           <>
                              <RefreshCw size={16} strokeWidth={2.2} />
                              <span>{t("network.retry")}</span>
                           </>
                        )}
                     </button>

                     <p className="text-center text-[11px] text-gray-400 font-medium">
                        {t("network.cachedNotice")}
                     </p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
