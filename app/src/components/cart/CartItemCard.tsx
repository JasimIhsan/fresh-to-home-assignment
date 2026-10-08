"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface CartItemCardProps {
   product: Product;
   weightKg: number;
   onUpdateWeight: (newWeight: number) => void;
   onRemove: () => void;
}

export function CartItemCard({ product, weightKg, onUpdateWeight, onRemove }: CartItemCardProps) {
   const { t } = useLanguage();
   const lineTotal = (product.pricePerKg * weightKg).toFixed(2).replace(".", ",");
   const step = 0.5;

   return (
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
         {/* Product Info & Thumbnail */}
         <div className="flex items-center gap-4 min-w-0">
            <Link
               href={`/catalog/${product.id}`}
               className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 shadow-xs group"
            >
               <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               />
            </Link>

            <div className="min-w-0">
               <Link
                  href={`/catalog/${product.id}`}
                  className="font-black text-gray-900 hover:text-primary transition-colors text-base block truncate"
               >
                  {product.name}
               </Link>
               <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-semibold text-primary/80 uppercase tracking-wider text-[10px]">
                     {product.category}
                  </span>{" "}
                  • {product.pricePerKg.toFixed(2).replace(".", ",")} {t("catalog.perKg")}
               </p>
               <span className="text-base sm:text-lg font-black text-primary block mt-1 tabular-nums">
                  {lineTotal} €
               </span>
            </div>
         </div>

         {/* Quantity Stepper & Remove Action */}
         <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
            {/* Weight Stepper Pill */}
            <div className="flex items-center bg-purple-50/80 border border-purple-100 rounded-2xl p-1 shadow-xs">
               <button
                  type="button"
                  onClick={() => weightKg > step && onUpdateWeight(weightKg - step)}
                  disabled={weightKg <= step}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-white/80 active:scale-90 text-primary flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  aria-label="Decrease weight"
               >
                  <Minus size={15} strokeWidth={2.5} />
               </button>

               <span className="font-extrabold text-xs sm:text-sm text-primary min-w-16 text-center tabular-nums px-1">
                  {weightKg.toFixed(1).replace(".", ",")} kg
               </span>

               <button
                  type="button"
                  onClick={() => onUpdateWeight(weightKg + step)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-white/80 active:scale-90 text-primary flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  aria-label="Increase weight"
               >
                  <Plus size={15} strokeWidth={2.5} />
               </button>
            </div>

            {/* Trash Delete Button */}
            <button
               type="button"
               onClick={onRemove}
               className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center cursor-pointer active:scale-90"
               title={t("cart.remove")}
               aria-label={t("cart.remove")}
            >
               <Trash2 size={16} />
            </button>
         </div>
      </div>
   );
}
