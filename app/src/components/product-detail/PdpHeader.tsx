"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface PdpHeaderProps {
   productName: string;
   category: string;
   isLoggedIn: boolean;
}

export function PdpHeader({ productName, category, isLoggedIn }: PdpHeaderProps) {
   const { t } = useLanguage();
   const { totalItemsCount, openCart } = useCart();
   const router = useRouter();

   return (
      <header className="md:hidden bg-primary text-white px-4 py-3.5 rounded-b-3xl shadow-lg sticky top-0 z-50">
         <div className="flex items-center justify-between">
            {/* Back Button – 44×44 touch target */}
            <button
               onClick={() => router.back()}
               className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all duration-150 cursor-pointer"
               aria-label={t("productDetail.back")}
            >
               <ArrowLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Product Title (progressive disclosure – truncated) */}
            <div className="flex-1 mx-3 min-w-0 text-center">
               <p className="text-[11px] font-semibold text-white/70 uppercase tracking-widest truncate">
                  {category}
               </p>
               <h1 className="text-sm font-extrabold text-white tracking-tight truncate leading-tight">
                  {productName}
               </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
               <LanguageSwitcher />
               {isLoggedIn && (
                  <button
                     onClick={openCart}
                     className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-white/15 hover:bg-white/25 text-white active:scale-95 transition-all duration-150 cursor-pointer"
                     aria-label="Cart"
                  >
                     <ShoppingCart size={19} strokeWidth={2.5} />
                     {totalItemsCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md animate-bounce-once">
                           {totalItemsCount}
                        </span>
                     )}
                  </button>
               )}
            </div>
         </div>
      </header>
   );
}
