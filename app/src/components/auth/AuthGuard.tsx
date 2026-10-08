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

export function AuthGuard({ children, requireAuth = false, requireRole, guestOnly = false, redirectTo, fallback }: AuthGuardProps) {
   const { user, role, loading, isAdmin, isAuthenticated, adminSession } = useAuth();
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
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname ?? "/admin")}`);
            return;
         }
      }

      // Auth-required customer pages — redirect guests to customer login
      if (requireAuth && !isAuthenticated) {
         if (requireRole === "admin") {
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname ?? "/admin")}`);
         } else {
            router.replace(`/login?redirect=${encodeURIComponent(pathname ?? "/catalog")}`);
         }
         return;
      }

      // Role-required pages — redirect if role doesn't match
      if (requireRole && requireRole !== "admin" && role !== requireRole) {
         router.replace(redirectTo ?? "/catalog");
      }
   }, [user, role, loading, guestOnly, requireAuth, requireRole, redirectTo, pathname, router, isAdmin, isAuthenticated, adminSession]);

   // Still loading auth state
   if (loading) {
      return (
         fallback ?? (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
               {/* Background decorations */}
               <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
               <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

               <div className="relative z-10 flex flex-col items-center space-y-8">
                  {/* Abstract Premium Spinner */}
                  <div className="relative flex items-center justify-center w-20 h-20">
                     {/* Outer Track */}
                     <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />

                     {/* Fast Spin Ring */}
                     <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary animate-spin" style={{ animationDuration: "1s" }} />

                     {/* Reverse Slow Spin Ring */}
                     <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-b-primary/60 border-l-primary/60 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />

                     {/* Inner Pulsing Dot */}
                     <div className="w-3.5 h-3.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(0,0,0,0.15)] shadow-primary/50" />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col items-center">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Loading</h3>
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
         <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
               <ShieldAlert size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("authGuard.accessDenied")}</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">{t("authGuard.accessDeniedDesc")}</p>
            <button onClick={() => router.push("/catalog")} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer">
               {t("authGuard.backToShop")}
            </button>
         </div>
      );
   }

   return <>{children}</>;
}
