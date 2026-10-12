"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { totalItemsCount } = useCart();
  const pathname = usePathname();

  // Do not render bottom nav on PDP pages because PDP has its own fixed sticky CTA action bar
  const isPdpPage = pathname.startsWith("/catalog/") && pathname !== "/catalog";
  if (isPdpPage) {
    return null;
  }

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/catalog",
      label: t("catalog.products"),
      icon: ShoppingBag,
      isActive: pathname.startsWith("/catalog"),
    },
    {
      href: "/cart",
      label: t("profile.cart"),
      icon: ShoppingCart,
      isActive: pathname === "/cart",
      badge: totalItemsCount > 0 ? totalItemsCount : null,
    },
    {
      href: user ? "/orders" : "/login",
      label: t("orders.title"),
      icon: Package,
      isActive: pathname.startsWith("/orders"),
    },
    {
      href: user ? "/profile" : "/login",
      label: t("catalog.profile"),
      icon: UserIcon,
      isActive:
        pathname === "/profile" ||
        pathname === "/login" ||
        pathname === "/signup",
    },
  ];

  return (
    <nav
      className="safe-area-inset-bottom fixed right-0 bottom-0 left-0 z-40 rounded-t-3xl border-t border-gray-100/90 bg-white/95 px-2 py-2 shadow-2xl shadow-purple-950/10 backdrop-blur-xl md:hidden"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl px-3 py-1.5 transition-all duration-200 active:scale-95",
                active
                  ? "text-primary font-bold"
                  : "font-medium text-gray-400 hover:text-gray-600"
              )}
            >
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary scale-105 shadow-xs"
                    : "text-gray-500 group-hover:bg-gray-50"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />

                {/* Cart count badge */}
                {item.badge !== null && item.badge !== undefined && (
                  <span className="bg-secondary animate-bounce-once absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-black text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "mt-0.5 text-[10px] tracking-tight transition-colors",
                  active ? "text-primary font-bold" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
