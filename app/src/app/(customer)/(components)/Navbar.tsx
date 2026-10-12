"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingCart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Only needed once the user asks to log out; keep it out of the initial bundle.
const LogoutConfirmModal = dynamic(() =>
  import("@/components/LogoutConfirmModal").then((m) => m.LogoutConfirmModal)
);

export function Navbar() {
  const { t } = useLanguage();
  const { user, role, signOut } = useAuth();
  const { totalItemsCount, openCart } = useCart();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      setShowLogoutModal(false);
      setIsProfileMenuOpen(false);
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="bg-primary sticky top-0 z-50 hidden text-white shadow-lg md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight"
          >
            <Image
              src="/images/logo-mark.png"
              alt="Frisch nach Hause Logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 object-contain drop-shadow-sm"
            />
            <span>{t("app.title")}</span>
          </Link>

          {/* Links */}
          <div className="flex flex-1 items-center justify-center space-x-6">
            <Link
              href="/catalog"
              className="text-sm font-semibold transition-colors hover:text-white/80"
            >
              {t("catalog.products")}
            </Link>
            <Link
              href="/orders"
              className="text-sm font-semibold transition-colors hover:text-white/80"
            >
              {t("catalog.myOrders")}
            </Link>
          </div>

          {/* Actions */}
          <div className="relative flex items-center space-x-4">
            {user && (
              <button
                onClick={openCart}
                aria-label="Open Cart"
                className="relative cursor-pointer rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <ShoppingCart size={20} />
                {totalItemsCount > 0 && (
                  <span className="bg-secondary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  aria-expanded={isProfileMenuOpen}
                  aria-label={t("catalog.profile")}
                  className="text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-xs font-bold shadow-xs transition-transform hover:scale-105"
                >
                  {user.email?.charAt(0).toUpperCase()}
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 text-gray-800 shadow-xl">
                    <div className="mb-1 border-b border-gray-100 px-4 py-2">
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t("catalog.profile")}
                    </Link>
                    {role === "admin" && (
                      <Link
                        href="/admin"
                        className="text-primary block px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {t("catalog.adminDashboard")}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="mt-1 w-full cursor-pointer border-t border-gray-100 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      {t("catalog.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-white/30"
              >
                {t("catalog.login")}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {showLogoutModal && (
        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          loading={loggingOut}
        />
      )}
    </>
  );
}
