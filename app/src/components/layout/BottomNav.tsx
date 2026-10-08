"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: t("home.title") }, // adjust as needed
    { href: "/catalog", icon: Search, label: t("catalog.products") },
    { href: "/orders", icon: ShoppingBag, label: t("catalog.myOrders") },
    { href: "/profile", icon: User, label: t("catalog.profile") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                isActive ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={22} className={isActive ? "fill-primary/20" : ""} />
              <span className="text-[10px] font-semibold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
