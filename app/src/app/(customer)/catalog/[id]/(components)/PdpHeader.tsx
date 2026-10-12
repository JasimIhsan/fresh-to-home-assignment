"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface PdpHeaderProps {
  readonly productName: string;
  readonly category: string;
}

export function PdpHeader({ productName, category }: PdpHeaderProps) {
  const isLoggedIn = !!useAuth().user;
  const { t } = useLanguage();
  const { totalItemsCount, openCart } = useCart();
  const router = useRouter();

  return (
    <header className="bg-primary sticky top-0 z-50 rounded-b-3xl px-4 py-3.5 text-white shadow-lg md:hidden">
      <div className="flex items-center justify-between">
        {/* Back Button – 44×44 touch target */}
        <button
          onClick={() => router.back()}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-white/15 text-white transition-all duration-150 hover:bg-white/25 active:scale-95"
          aria-label={t("productDetail.back")}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* Product Title (progressive disclosure – truncated) */}
        <div className="mx-3 min-w-0 flex-1 text-center">
          <p className="truncate text-[11px] font-semibold tracking-widest text-white/70 uppercase">
            {category}
          </p>
          <h1 className="truncate text-sm leading-tight font-extrabold tracking-tight text-white">
            {productName}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={openCart}
              className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-white/15 text-white transition-all duration-150 hover:bg-white/25 active:scale-95"
              aria-label="Cart"
            >
              <ShoppingCart size={19} strokeWidth={2.5} />
              {totalItemsCount > 0 && (
                <span className="bg-secondary animate-bounce-once absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-black text-white shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>
          ) : (
            <div className="h-11 w-11" />
          )}
        </div>
      </div>
    </header>
  );
}
