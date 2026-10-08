"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

interface AuthCardWrapperProps {
   title: string;
   subtitle: string;
   backHref?: string;
   backLabel?: string;
   badgeIcon?: ReactNode;
   children: ReactNode;
   footer?: ReactNode;
}

export function AuthCardWrapper({
   title,
   subtitle,
   backHref = "/catalog",
   backLabel,
   badgeIcon,
   children,
   footer,
}: AuthCardWrapperProps) {
   return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-background to-background flex flex-col justify-between px-4 py-6 sm:py-10 selection:bg-primary/20">
         {/* Top Navigation Bar: Back link & Language Switcher */}
         <div className="w-full max-w-md mx-auto flex items-center justify-between">
            <Link
               href={backHref}
               className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-all duration-150 group active:scale-95"
            >
               <span className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-xs flex items-center justify-center group-hover:border-primary/30 group-hover:text-primary transition-all">
                  <ArrowLeft size={16} strokeWidth={2.5} />
               </span>
               <span className="hidden sm:inline">{backLabel || "Zurück"}</span>
            </Link>

            <LanguageSwitcher variant="light" className="shadow-xs rounded-xl" />
         </div>

         {/* Main Auth Card */}
         <div className="w-full max-w-md mx-auto my-auto py-6">
            {/* Brand Logo Header */}
            <div className="flex flex-col items-center text-center mb-6">
               <Link href="/" className="flex items-center gap-2.5 mb-3 group">
                  <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-200">
                     <img
                        src="/icons/icon-192x192.png"
                        alt="Frisch nach Hause"
                        className="w-7 h-7 object-contain rounded-lg"
                     />
                  </div>
                  <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                     Frisch nach Hause
                  </span>
               </Link>
            </div>

            {/* Elevated Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-900/5 border border-gray-100/90 relative overflow-hidden backdrop-blur-xl">
               {/* Decorative subtle background gradient blob */}
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

               {/* Card Header */}
               <div className="relative z-10 mb-6">
                  {badgeIcon && (
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
                        {badgeIcon}
                     </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                     {title}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{subtitle}</p>
               </div>

               {/* Card Body */}
               <div className="relative z-10">{children}</div>
            </div>

            {/* Footer Text */}
            {footer && <div className="mt-6 text-center">{footer}</div>}
         </div>

         {/* Bottom Trust/Security Note */}
         <div className="w-full max-w-md mx-auto text-center pt-4">
            <p className="text-[11px] text-gray-400">
               🔒 Frisch nach Hause • Verschlüsselt & DSGVO-konform
            </p>
         </div>
      </div>
   );
}
