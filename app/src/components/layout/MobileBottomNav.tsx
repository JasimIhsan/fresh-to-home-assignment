"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Home, Package, ShoppingBag, ShoppingCart, User as UserIcon } from "lucide-react";
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
         isActive: pathname === "/profile" || pathname === "/login" || pathname === "/signup",
      },
   ];

   return (
      <nav
         className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100/90 rounded-t-3xl shadow-2xl shadow-purple-950/10 px-2 py-2 safe-area-inset-bottom"
         role="navigation"
         aria-label="Mobile Navigation"
      >
         <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item) => {
               const Icon = item.icon;
               const active = item.isActive;

               return (
                  <Link
                     key={item.href + item.label}
                     href={item.href}
                     className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 group ${
                        active
                           ? "text-primary font-bold"
                           : "text-gray-400 hover:text-gray-600 font-medium"
                     }`}
                  >
                     <div
                        className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                           active
                              ? "bg-primary/10 text-primary scale-105 shadow-xs"
                              : "text-gray-500 group-hover:bg-gray-50"
                        }`}
                     >
                        <Icon size={20} strokeWidth={active ? 2.5 : 2} />

                        {/* Cart count badge */}
                        {item.badge !== null && item.badge !== undefined && (
                           <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm animate-bounce-once">
                              {item.badge}
                           </span>
                        )}
                     </div>

                     <span
                        className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                           active ? "text-primary font-bold" : "text-gray-500"
                        }`}
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
