"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="flex h-screen flex-col overflow-hidden bg-slate-50 font-sans md:flex-row">
        {/* Mobile Header */}
        <header className="z-30 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/images/logo-mark.png"
                alt="Logo"
                className="h-6 w-6 object-contain"
              />
              <span className="font-semibold text-slate-900">
                {t("catalog.adminDashboard")}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Overlay */}
        {mobileDrawerOpen && (
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 transition-opacity md:hidden"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:static ${mobileDrawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
            <div className="flex items-center gap-2.5 text-slate-900">
              <img
                src="/images/logo-mark.png"
                alt="Logo"
                className="h-7 w-7 object-contain"
              />
              <span className="text-lg font-bold tracking-tight">
                {t("app.title")}
              </span>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-4 py-6">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isNavActive(item.href, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <Icon
                      size={18}
                      className={active ? "text-slate-900" : "text-slate-500"}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div>
              <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {t("admin.quickActions")}
              </p>
              <Link
                href="/admin/products/new"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/admin/products/new" ? "text-primary bg-slate-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <PlusCircle
                  size={18}
                  className={
                    pathname === "/admin/products/new"
                      ? "text-primary"
                      : "text-slate-500"
                  }
                />
                {t("admin.addProduct") || "Add Product"}
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-4 border-t border-slate-200 p-4">
            <div className="hidden px-2 md:block">
              <div className="flex items-center rounded-xl border border-slate-200/60 bg-slate-100/80 p-1 shadow-inner">
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all duration-200 ${language === "en" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"}`}
                >
                  <span className="text-sm leading-none">🇬🇧</span>
                  EN
                </button>
                <button
                  onClick={() => setLanguage("de")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all duration-200 ${language === "de" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"}`}
                >
                  <span className="text-sm leading-none">🇩🇪</span>
                  DE
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              <Link
                href="/catalog"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Store size={18} className="text-slate-500" />
                {t("admin.viewShop")}
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                disabled={loggingOut}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut size={18} className="text-red-500" />
                <span>{t("catalog.logout")}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="h-full w-full">{children}</div>
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
