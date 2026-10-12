"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { NavigatorWithNetwork } from "@/types/index";
import { CheckCircle2, RefreshCw, SignalLow, WifiOff, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

    const navWithNetwork = navigator as NavigatorWithNetwork;
    const connection =
      navWithNetwork.connection ||
      navWithNetwork.mozConnection ||
      navWithNetwork.webkitConnection;

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

      if (
        response.ok ||
        response.status === 304 ||
        response.type === "opaque"
      ) {
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

    const navWithNetwork = navigator as NavigatorWithNetwork;
    const connection =
      navWithNetwork.connection ||
      navWithNetwork.mozConnection ||
      navWithNetwork.webkitConnection;

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
        <div className="animate-in fade-in slide-in-from-top-4 fixed top-5 left-1/2 z-100 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all duration-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-100" />
          <span>{t("network.onlineRestored")}</span>
        </div>
      )}

      {/* Slow Network Pill matching app card styling */}
      {shouldShowSlowBanner && (
        <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-24 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-white/95 p-3.5 text-xs text-gray-900 shadow-2xl shadow-amber-950/10 backdrop-blur-xl duration-200 sm:text-sm md:bottom-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/60">
              <SignalLow className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="truncate font-bold text-gray-900">
                {t("network.slowTitle")}
              </p>
              <p className="truncate text-xs text-gray-500">
                {t("network.slowDesc")}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={checkRealConnectivity}
              disabled={isReconnecting}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-amber-500/20 transition hover:bg-amber-600 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw
                className={cn(
                  "h-3.5 w-3.5",
                  isReconnecting ? "animate-spin" : ""
                )}
              />
              <span>{t("network.retry")}</span>
            </button>
            <button
              type="button"
              onClick={() => setDismissedSlow(true)}
              className="cursor-pointer rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Offline Bottom Sheet on Mobile / Modal on Desktop matching LogoutConfirmModal UI */}
      {isOffline && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <div
            className="animate-in fade-in fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="offline-dialog-title"
            className="animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 relative z-10 w-full rounded-t-3xl border border-gray-100 bg-white p-6 text-gray-900 shadow-2xl duration-200 select-none sm:p-7 md:max-w-md md:rounded-3xl"
          >
            {/* Handle bar on mobile */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200 md:hidden" />

            {/* Icon & Title */}
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-inner ring-4 ring-red-50/50">
                <WifiOff size={28} strokeWidth={2.2} />
              </div>

              <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                Frisch nach Hause
              </span>

              <h2
                id="offline-dialog-title"
                className="text-xl font-black tracking-tight text-gray-900"
              >
                {t("network.offlineTitle")}
              </h2>

              <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                {t("network.offlineDesc")}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={checkRealConnectivity}
                disabled={isReconnecting}
                className="bg-primary shadow-primary/20 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-150 hover:bg-purple-700 active:scale-95 disabled:opacity-50"
              >
                {isReconnecting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <RefreshCw size={16} strokeWidth={2.2} />
                    <span>{t("network.retry")}</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] font-medium text-gray-400">
                {t("network.cachedNotice")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
