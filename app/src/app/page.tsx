"use client";

import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight, ShoppingBag, Sparkles, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
   const { t } = useLanguage();
   const { user, isAdmin } = useAuth();

   return (
      <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden relative">
         {/* Image Section */}
         <div className="relative h-[50vh] md:h-screen md:w-1/2 lg:w-[55%] shrink-0">
            <img src="/images/products/raw_beef_steak.jpg" alt="Premium Fresh Meat" className="w-full h-full object-cover" />
            
            {/* Mobile Gradients: Dark at top for header text readability, dark at bottom for contrast */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-transparent md:hidden pointer-events-none"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent md:hidden pointer-events-none"></div>
            
            {/* Desktop Gradients */}
            <div className="absolute inset-0 hidden md:block bg-linear-to-r from-transparent to-black/20 pointer-events-none"></div>
            
            {/* Mobile Header Overlay */}
            <header className="absolute top-0 w-full flex justify-between items-center px-6 pt-8 pb-6 z-20 md:hidden">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 p-1">
                     <img src="/images/logo-mark.png" alt="Logo" className="w-full h-full object-contain drop-shadow" />
                  </div>
                  <span className="font-black text-xl tracking-tight text-white drop-shadow-md">
                     {t("app.title")}
                  </span>
               </div>
               {/* LanguageSwitcher wrapped in a solid container so white text is visible, or we use a primary color wrapper */}
               <div className="z-50 bg-primary rounded-full shadow-lg border border-white/10">
                  <LanguageSwitcher />
               </div>
            </header>

            {/* Desktop Hero Overlay Text */}
            <div className="hidden md:flex absolute bottom-12 left-12 right-12 text-white z-10 flex-col drop-shadow-lg">
               <div className="w-16 h-1.5 bg-primary mb-6 rounded-full shadow-lg shadow-primary/50"></div>
               <h2 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                  Frisch vom Metzger <br /> direkt zu dir.
               </h2>
               <p className="text-xl text-white/95 font-medium max-w-lg">Premium-Qualität, handverlesen und perfekt gekühlt an deine Haustür geliefert.</p>
            </div>
         </div>

         {/* Content Section */}
         <div className="flex-1 flex flex-col px-6 pb-10 pt-8 md:pt-12 md:px-12 lg:px-20 z-10 -mt-10 md:mt-0 bg-white rounded-t-[2.5rem] md:rounded-none relative shadow-[0_-20px_40px_rgba(0,0,0,0.15)] md:shadow-none justify-center">
            
            {/* Desktop Header */}
            <header className="hidden md:flex justify-between items-center mb-auto pt-4 w-full">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 flex items-center justify-center shadow-md shadow-purple-500/10 p-1.5">
                     <img src="/images/logo-mark.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-2xl tracking-tight text-gray-900">{t("app.title")}</span>
               </div>
               <div className="z-50 bg-primary rounded-full shadow-lg border border-white/10">
                  <LanguageSwitcher />
               </div>
            </header>

            {/* Main Text Content */}
            <div className="mt-4 md:mt-auto space-y-5 max-w-xl">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-primary text-xs font-black uppercase tracking-wider border border-purple-100 shadow-xs">
                  <Sparkles size={14} className="text-primary" />
                  <span>100% Premium Quality</span>
               </div>

               <h1 className="text-[2.75rem] sm:text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[1.05]">
                  {t("app.title")}
               </h1>

               <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
                  {t("app.subtitle")}
               </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 md:mb-auto space-y-4 max-w-md w-full">
               <Link href="/catalog" className="w-full flex items-center justify-between px-8 bg-primary text-white py-4 rounded-[1.25rem] font-bold text-lg shadow-xl shadow-primary/30 active:scale-[0.98] transition-all hover:bg-purple-700 group">
                  <span>{t("home.orderNow")}</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                     <ChevronRight size={18} className="text-white" />
                  </div>
               </Link>

               {!user && !isAdmin ? (
                  <Link href="/login" className="w-full flex items-center justify-center bg-purple-50 text-primary py-4 rounded-[1.25rem] font-bold text-base hover:bg-purple-100 transition-all active:scale-[0.98]">
                     {t("home.login")}
                  </Link>
               ) : (
                  <div className="flex gap-3">
                     {user && (
                        <Link href="/profile" className="flex-1 flex items-center justify-center space-x-2 bg-purple-50 text-primary py-4 rounded-[1.25rem] font-bold text-base hover:bg-purple-100 transition-all active:scale-[0.98]">
                           <User size={18} />
                           <span className="truncate">{user.email?.split("@")[0]}</span>
                        </Link>
                     )}
                     {isAdmin && (
                        <Link href="/admin" className="px-6 flex items-center justify-center bg-gray-100 text-gray-900 rounded-[1.25rem] font-bold text-sm hover:bg-gray-200 transition-all active:scale-[0.98]">
                           Admin
                        </Link>
                     )}
                  </div>
               )}
            </div>

            {/* Footer */}
            <footer className="pt-8 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 border-t border-gray-100 w-full">
               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <Link href="/privacy" className="hover:text-gray-800 transition-colors font-semibold">
                     {t("signup.privacyPolicy")}
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/catalog" className="hover:text-gray-800 transition-colors font-semibold">
                     {t("catalog.products")}
                  </Link>
               </div>
               <p className="font-medium">
                  © {new Date().getFullYear()} {t("app.title")}. {t("home.allRightsReserved")}
               </p>
            </footer>
         </div>

         <PwaInstallPrompt />
      </div>
   );
}
