"use client";

import { Mail, ShieldCheck } from "lucide-react";

interface ProfileIdentityCardProps {
   displayName: string;
   email?: string | null;
}

export function ProfileIdentityCard({ displayName, email }: ProfileIdentityCardProps) {
   return (
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-purple-950/5 border border-gray-100/90 relative overflow-hidden backdrop-blur-xl">
         {/* Ambient background glow elements */}
         <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
         <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-200/20 rounded-full blur-2xl pointer-events-none" />

         <div className="relative z-10 flex flex-col items-center text-center">
            {/* Monogram Avatar with gradient frame & verification badge */}
            <div className="relative mb-4">
               <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-primary to-purple-500 p-1 shadow-lg shadow-primary/20">
                  <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center">
                     <span className="text-3xl font-black text-primary">
                        {displayName.charAt(0).toUpperCase()}
                     </span>
                  </div>
               </div>
               <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <ShieldCheck size={14} strokeWidth={2.5} />
               </div>
            </div>

            {/* User display name & email */}
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
               {displayName}
            </h2>
            {email && (
               <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 mt-1 font-medium truncate max-w-full">
                  <Mail size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{email}</span>
               </p>
            )}
         </div>
      </div>
   );
}
