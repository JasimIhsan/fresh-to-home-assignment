"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
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
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";

// Only needed once the user asks to log out.
const LogoutConfirmModal = dynamic(() =>
  import("@/components/LogoutConfirmModal").then((m) => m.LogoutConfirmModal)
);

const NAV_ITEMS = [
  {
    href: "/admin",
    labelKey: "admin.dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/products",
    labelKey: "catalog.products",
    icon: Package,
    exact: false,
  },
  {
    href: "/admin/orders",
    labelKey: "admin.orders",
    icon: ShoppingBag,
    exact: false,
  },
] as const;

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "de", flag: "🇩🇪", label: "DE" },
] as const;

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const { signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const closeDrawer = () => setMobileDrawerOpen(false);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileDrawerOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileDrawerOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.replace("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 font-sans md:flex-row">
      {/* Mobile Header */}
      <header className="z-30 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo-mark.png"
              alt="Logo"
              width={24}
              height={24}
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
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:static",
          mobileDrawerOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-2.5 text-slate-900">
            <Image
              src="/images/logo-mark.png"
              alt="Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="text-lg font-bold tracking-tight">
              {t("app.title")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-4 py-6">
          {/* Active-link state reads the URL, so it streams in after the shell. */}
          <Suspense
            fallback={
              <AdminNavLinks pathname={null} onNavigate={closeDrawer} />
            }
          >
            <ActiveAdminNavLinks onNavigate={closeDrawer} />
          </Suspense>
        </div>

        <div className="space-y-4 border-t border-slate-200 p-4">
          <div className="hidden px-2 md:block">
            <div className="flex items-center rounded-xl border border-slate-200/60 bg-slate-100/80 p-1 shadow-inner">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all duration-200",
                    language === lang.code
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
                      : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                  )}
                >
                  <span className="text-sm leading-none">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/catalog"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Store size={18} className="text-slate-500" />
              {t("admin.viewShop")}
            </Link>
            <button
              type="button"
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

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="h-full w-full">{children}</div>
      </main>

      {showLogoutModal && (
        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          loading={loggingOut}
        />
      )}
    </div>
  );
}

function ActiveAdminNavLinks({
  onNavigate,
}: Readonly<{ onNavigate: () => void }>) {
  return <AdminNavLinks pathname={usePathname()} onNavigate={onNavigate} />;
}

function AdminNavLinks({
  pathname,
  onNavigate,
}: Readonly<{ pathname: string | null; onNavigate: () => void }>) {
  const { t } = useLanguage();
  const isNavActive = (href: string, exact: boolean) =>
    pathname !== null &&
    (exact ? pathname === href : pathname.startsWith(href));
  const isNewProduct = pathname === "/admin/products/new";

  return (
    <>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                size={18}
                className={active ? "text-slate-900" : "text-slate-500"}
              />
              {t(item.labelKey)}
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
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isNewProduct
              ? "text-primary bg-slate-100"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <PlusCircle
            size={18}
            className={isNewProduct ? "text-primary" : "text-slate-500"}
          />
          {t("admin.addProduct")}
        </Link>
      </div>
    </>
  );
}
