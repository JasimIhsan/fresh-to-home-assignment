"use client";

import { useAuth, UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: UserRole;
  guestOnly?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = false,
  requireRole,
  guestOnly = false,
  redirectTo,
  fallback,
}: AuthGuardProps) {
  const { user, role, loading, isAdmin, isAuthenticated, adminSession } =
    useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Guest-only pages (e.g. Login, Signup) — redirect logged-in users away
    if (guestOnly && (user || adminSession)) {
      router.replace(redirectTo ?? (isAdmin ? "/admin" : "/catalog"));
      return;
    }

    // If page strictly requires admin role
    if (requireRole === "admin") {
      if (!isAdmin) {
        router.replace(
          `/admin/login?redirect=${encodeURIComponent(pathname ?? "/admin")}`
        );
        return;
      }
    }

    // Auth-required customer pages — redirect guests to customer login
    if (requireAuth && !isAuthenticated) {
      if (requireRole === "admin") {
        router.replace(
          `/admin/login?redirect=${encodeURIComponent(pathname ?? "/admin")}`
        );
      } else {
        router.replace(
          `/login?redirect=${encodeURIComponent(pathname ?? "/catalog")}`
        );
      }
      return;
    }

    // Role-required pages — redirect if role doesn't match
    if (requireRole && requireRole !== "admin" && role !== requireRole) {
      router.replace(redirectTo ?? "/catalog");
    }
  }, [
    user,
    role,
    loading,
    guestOnly,
    requireAuth,
    requireRole,
    redirectTo,
    pathname,
    router,
    isAdmin,
    isAuthenticated,
    adminSession,
  ]);

  // Still loading auth state
  if (loading) {
    return (
      fallback ?? (
        <div className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
          {/* Background decorations */}
          <div className="bg-primary/10 absolute top-1/3 left-1/4 h-72 w-72 animate-pulse rounded-full blur-3xl" />
          <div
            className="bg-primary/5 absolute right-1/4 bottom-1/3 h-72 w-72 animate-pulse rounded-full blur-3xl"
            style={{ animationDelay: "1s" }}
          />

          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Abstract Premium Spinner */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Outer Track */}
              <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />

              {/* Fast Spin Ring */}
              <div
                className="border-t-primary border-r-primary absolute inset-0 animate-spin rounded-full border-[3px] border-transparent"
                style={{ animationDuration: "1s" }}
              />

              {/* Reverse Slow Spin Ring */}
              <div
                className="border-b-primary/60 border-l-primary/60 absolute inset-3 animate-spin rounded-full border-[3px] border-transparent"
                style={{
                  animationDuration: "2s",
                  animationDirection: "reverse",
                }}
              />

              {/* Inner Pulsing Dot */}
              <div className="bg-primary shadow-primary/50 h-3.5 w-3.5 animate-pulse rounded-full shadow-[0_0_12px_rgba(0,0,0,0.15)]" />
            </div>

            {/* Text */}
            <div className="flex flex-col items-center">
              <h3 className="text-xs font-black tracking-[0.25em] text-gray-400 uppercase">
                Loading
              </h3>
            </div>
          </div>
        </div>
      )
    );
  }

  // Redirecting — render nothing to avoid a flash of restricted content
  if (guestOnly && (user || adminSession)) return null;
  if (requireRole === "admin" && !isAdmin) return null;
  if (requireAuth && !isAuthenticated) return null;
  if (requireRole && requireRole !== "admin" && user && role !== requireRole) {
    return (
      <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <ShieldAlert size={36} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {t("authGuard.accessDenied")}
        </h2>
        <p className="mx-auto mb-6 max-w-md text-gray-600">
          {t("authGuard.accessDeniedDesc")}
        </p>
        <button
          onClick={() => router.push("/catalog")}
          className="bg-primary cursor-pointer rounded-xl px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:opacity-90"
        >
          {t("authGuard.backToShop")}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
