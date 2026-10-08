"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { MapPin, ShieldCheck, Star, Truck } from "lucide-react";

interface PdpProductInfoProps {
   product: Product;
}

const MOCK_RATING = 4.8;
const MOCK_REVIEW_COUNT = 127;

export function PdpProductInfo({ product }: PdpProductInfoProps) {
   const { t } = useLanguage();

   const availableStock =
      product.stockKg != null
         ? product.stockKg - (product.reservedStockKg ?? 0)
         : null;
   const isLowStock =
      availableStock !== null && availableStock > 0 && availableStock <= 5;

   return (
      <div className="space-y-5">
         {/* Tags */}
         {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
               {product.tags.map((tag) => (
                  <span
                     key={tag}
                     className="px-2.5 py-0.5 text-[11px] font-semibold bg-primary/8 text-primary rounded-full border border-primary/15"
                  >
                     {tag}
                  </span>
               ))}
            </div>
         )}

         {/* Title + Rating */}
         <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
               {product.name}
            </h2>

            <div className="flex items-center gap-2 mt-2">
               <div
                  className="flex items-center gap-0.5"
                  aria-label={`Rating: ${MOCK_RATING} out of 5`}
               >
                  {[1, 2, 3, 4, 5].map((star) => (
                     <Star
                        key={star}
                        size={14}
                        className={
                           star <= Math.round(MOCK_RATING)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                        }
                     />
                  ))}
               </div>
               <span className="text-sm font-bold text-gray-800">{MOCK_RATING}</span>
               <a
                  href="#reviews"
                  className="text-xs text-gray-400 hover:text-primary transition-colors font-medium underline underline-offset-2"
               >
                  (
                  {t("productDetail.ratingsCount").replace(
                     "{count}",
                     String(MOCK_REVIEW_COUNT)
                  )}
                  )
               </a>
            </div>
         </div>

         {/* Price */}
         <div className="flex items-end gap-3">
            <div>
               <span className="text-3xl sm:text-4xl font-black text-primary tabular-nums">
                  {product.pricePerKg.toFixed(2).replace(".", ",")} €
               </span>
               <span className="text-sm text-gray-400 font-medium ml-1.5">
                  {t("catalog.perKg")}
               </span>
            </div>
         </div>

         {/* Ethical Low-Stock Alert */}
         {isLowStock && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-2xl">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
               <p className="text-xs font-semibold text-red-700">
                  {t("productDetail.lowStockAlert").replace(
                     "{stock}",
                     availableStock!.toFixed(1).replace(".", ",")
                  )}
               </p>
            </div>
         )}

         {/* Description */}
         <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {product.description}
         </p>

         {/* Detail Badges Grid */}
         <div className="grid grid-cols-3 gap-2.5">
            <div className="flex flex-col items-center gap-1.5 p-3 bg-purple-50/60 rounded-2xl border border-purple-100/80 text-center">
               <MapPin size={18} className="text-primary shrink-0" />
               <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider leading-none">
                  {t("productDetail.origin")}
               </span>
               <span className="text-xs font-bold text-gray-800 leading-tight">
                  {product.origin || t("productDetail.defaultOrigin")}
               </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
               <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
               <span className="text-[10px] text-emerald-500 uppercase font-semibold tracking-wider leading-none">
                  {t("productDetail.qualityLabel")}
               </span>
               <span className="text-xs font-bold text-gray-800 leading-tight">
                  {t("productDetail.qualityValue")}
               </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
               <Truck size={18} className="text-blue-600 shrink-0" />
               <span className="text-[10px] text-blue-500 uppercase font-semibold tracking-wider leading-none">
                  {t("productDetail.deliveryLabel")}
               </span>
               <span className="text-xs font-bold text-gray-800 leading-tight">
                  {t("productDetail.deliveryValue")}
               </span>
            </div>
         </div>
      </div>
   );
}
