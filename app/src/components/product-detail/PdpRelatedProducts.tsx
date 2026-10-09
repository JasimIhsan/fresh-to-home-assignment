"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getStoredProducts } from "@/lib/store";
import { Product } from "@/types";
import Link from "next/link";
import { useMemo } from "react";

interface PdpRelatedProductsProps {
   currentProductId: string;
   currentCategory: string;
}

export function PdpRelatedProducts({ currentProductId, currentCategory }: PdpRelatedProductsProps) {
   const { t } = useLanguage();

   const related = useMemo(() => {
      const all = getStoredProducts();
      return all
         .filter(
            (p) => p.id !== currentProductId && p.category === currentCategory && p.isAvailable
         )
         .slice(0, 4);
   }, [currentProductId, currentCategory]);

   if (related.length === 0) return null;

   return (
      <section aria-label={t("productDetail.relatedTitle")} className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
               {t("productDetail.relatedTitle")}
            </h3>
            <Link
               href="/catalog"
               className="text-xs font-semibold text-primary hover:text-purple-700 transition-colors"
            >
               {t("productDetail.relatedViewAll")}
            </Link>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((product) => (
               <RelatedProductCard key={product.id} product={product} />
            ))}
         </div>
      </section>
   );
}

function RelatedProductCard({ product }: { product: Product }) {
   const { t } = useLanguage();

   return (
      <Link
         href={`/catalog/${product.id}`}
         className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden flex flex-col"
      >
         <div className="aspect-4/3 overflow-hidden bg-gray-50 relative">
            <img
               src={product.imageUrl}
               alt={product.name}
               className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
            />
            {!product.isAvailable && (
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-[11px] font-bold bg-black/60 px-2 py-1 rounded-full">
                     {t("productDetail.outOfStockOverlay")}
                  </span>
               </div>
            )}
         </div>
         <div className="p-3 flex-1 flex flex-col gap-1">
            <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
               {product.name}
            </p>
            <span className="mt-auto text-sm font-black text-primary tabular-nums">
               {product.pricePerKg.toFixed(2).replace(".", ",")} €{" "}
               <span className="text-[10px] text-gray-400 font-medium">
                  {t("catalog.perKg")}
               </span>
            </span>
         </div>
      </Link>
   );
}
