"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export function Navbar() {
   const { t } = useLanguage();
   const { user, role, signOut } = useAuth();
   const { totalItemsCount, openCart } = useCart();
   const router = useRouter();
   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

   const handleLogout = async () => {
      await signOut();
      router.push("/");
   };

   return (
      <nav className="hidden md:block bg-primary text-white shadow-lg sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="font-extrabold text-xl tracking-tight flex items-center gap-2.5">
               <img src="/images/logo-mark.png" alt="Frisch nach Hause Logo" className="w-9 h-9 object-contain drop-shadow-sm" />
               <span>{t("app.title")}</span>
            </Link>

            {/* Links */}
            <div className="flex items-center space-x-6 flex-1 justify-center">
               <Link href="/catalog" className="text-sm font-semibold hover:text-white/80 transition-colors">
                  {t("catalog.products")}
               </Link>
               <Link href="/orders" className="text-sm font-semibold hover:text-white/80 transition-colors">
                  {t("catalog.myOrders")}
               </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 relative">
               <LanguageSwitcher />

               {user && (
                  <button onClick={openCart} className="relative p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                     <ShoppingCart size={20} />
                     {totalItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{totalItemsCount}</span>}
                  </button>
               )}

               {user ? (
                  <div className="relative">
                     <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-transform">
                        {user.email?.charAt(0).toUpperCase()}
                     </button>
                     {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 text-gray-800 z-50">
                           <div className="px-4 py-2 border-b border-gray-100 mb-1">
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                           </div>
                           <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsProfileMenuOpen(false)}>
                              {t("catalog.profile")}
                           </Link>
                           {role === "admin" && (
                              <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50 text-primary font-medium" onClick={() => setIsProfileMenuOpen(false)}>
                                 {t("catalog.adminDashboard")}
                              </Link>
                           )}
                           <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t border-gray-100">
                              {t("catalog.logout")}
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <Link href="/login" className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors">
                     {t("catalog.login")}
                  </Link>
               )}
            </div>
         </div>
      </nav>
   );
}
