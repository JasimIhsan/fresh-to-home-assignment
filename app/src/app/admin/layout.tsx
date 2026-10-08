"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutDashboard, LogOut, Menu, Package, PlusCircle, ShoppingBag, Store, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   const { user, signOut } = useAuth();
   const { t, language, setLanguage } = useLanguage();
   const router = useRouter();
   const pathname = usePathname();
   const [loggingOut, setLoggingOut] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

   useEffect(() => {
      setMobileDrawerOpen(false);
   }, [pathname]);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape" && mobileDrawerOpen) {
            setMobileDrawerOpen(false);
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [mobileDrawerOpen]);

   useEffect(() => {
      if (mobileDrawerOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }
      return () => {
         document.body.style.overflow = "";
      };
   }, [mobileDrawerOpen]);

   const handleLogout = async () => {
      setLoggingOut(true);
      try {
         await signOut();
         router.push("/admin/login");
      } finally {
         setLoggingOut(false);
      }
   };

   const navItems = [
      {
         href: "/admin",
         label: t("admin.dashboard"),
         icon: LayoutDashboard,
         exact: true,
      },
      {
         href: "/admin/products",
         label: t("catalog.products"),
         icon: Package,
         exact: false,
      },
      {
         href: "/admin/orders",
         label: t("admin.orders"),
         icon: ShoppingBag,
         exact: false,
      },
   ];

   const isNavActive = (href: string, exact: boolean) => {
      return exact ? pathname === href : pathname?.startsWith(href);
   };

   // Admin Login route has its own dedicated full-page presentation without admin sidebar/shell
   if (pathname === "/admin/login") {
      return <>{children}</>;
   }

   return (
      <AuthGuard requireAuth requireRole="admin">
         <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-30 shrink-0">
               <div className="flex items-center gap-3">
                  <button onClick={() => setMobileDrawerOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors" aria-label="Open navigation">
                     <Menu size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                     <img src="/images/logo-mark.png" alt="Logo" className="w-6 h-6 object-contain" />
                     <span className="font-semibold text-slate-900">{t("catalog.adminDashboard")}</span>
                  </div>
               </div>
            </header>

            {/* Mobile Overlay */}
            {mobileDrawerOpen && <div onClick={() => setMobileDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity" aria-hidden="true" />}

            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${mobileDrawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
               {/* Header */}
               <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-2.5 text-slate-900">
                     <img src="/images/logo-mark.png" alt="Logo" className="w-7 h-7 object-contain" />
                     <span className="font-bold text-lg tracking-tight">{t("app.title")}</span>
                  </div>
                  <button onClick={() => setMobileDrawerOpen(false)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
                     <X size={20} />
                  </button>
               </div>

               {/* Navigation */}
               <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
                  <nav className="space-y-1">
                     {navItems.map((item) => {
                        const active = isNavActive(item.href, item.exact);
                        const Icon = item.icon;
                        return (
                           <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                              <Icon size={18} className={active ? "text-slate-900" : "text-slate-500"} />
                              {item.label}
                           </Link>
                        );
                     })}
                  </nav>

                  <div>
                     <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t("admin.quickActions")}</p>
                     <Link href="/admin/products/new" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${pathname === "/admin/products/new" ? "bg-slate-100 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                        <PlusCircle size={18} className={pathname === "/admin/products/new" ? "text-primary" : "text-slate-500"} />
                        {t("admin.addProduct") || "Add Product"}
                     </Link>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-4 border-t border-slate-200 space-y-4">
                  <div className="hidden md:block px-2">
                     <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 shadow-inner">
                        <button onClick={() => setLanguage("en")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${language === "en" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}>
                           <span className="text-sm leading-none">🇬🇧</span>
                           EN
                        </button>
                        <button onClick={() => setLanguage("de")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${language === "de" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}>
                           <span className="text-sm leading-none">🇩🇪</span>
                           DE
                        </button>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1">
                     <Link href="/catalog" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors">
                        <Store size={18} className="text-slate-500" />
                        {t("admin.viewShop")}
                     </Link>
                     <button
                        onClick={() => setShowLogoutModal(true)}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                     >
                        <LogOut size={18} className="text-red-500" />
                        <span>{t("catalog.logout")}</span>
                     </button>
                  </div>
               </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
               <div className="w-full h-full">{children}</div>
            </main>

            <LogoutConfirmModal
               isOpen={showLogoutModal}
               onClose={() => setShowLogoutModal(false)}
               onConfirm={handleLogout}
               loading={loggingOut}
            />
         </div>
      </AuthGuard>
   );
}
