"use client";

import { WeightStepper } from "@/components/ui/WeightStepper";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { Check, Globe, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
   product: Product;
   currentWeight: number;
   isAdded: boolean;
   isLoggedIn: boolean;
   onWeightChange: (id: string, weight: number) => void;
   onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, currentWeight, isAdded, isLoggedIn, onWeightChange, onAddToCart }: ProductCardProps) => {
   const { t } = useLanguage();

   return (
      <div className="bg-card text-card-foreground rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full group">
         <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-3">
            <Link href={`/catalog/${product.id}`} className="block w-full h-full cursor-pointer">
               <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
            </Link>
            <div className="absolute top-2 left-2">
               <span className="bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm border border-border/50">{product.category ? (t(`categories.${product.category}`) !== `categories.${product.category}` ? t(`categories.${product.category}`) : product.category) : ""}</span>
            </div>
         </div>

         <div className="flex-1 flex flex-col px-1">
            {product.origin && (
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Globe size={10} /> {product.origin}
               </p>
            )}

            <Link href={`/catalog/${product.id}`} className="hover:text-primary transition-colors block mb-1">
               <h3 className="font-bold text-[15px] text-foreground leading-tight line-clamp-2">{product.name}</h3>
            </Link>

            <p className="text-[12px] text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

            <div className="mt-auto flex flex-col gap-2">
               <div className="flex items-baseline gap-1">
                  <span className="font-black text-lg text-foreground">{product.pricePerKg.toFixed(2).replace(".", ",")} €</span>
                  <span className="text-xs text-muted-foreground font-medium">/ {t("catalog.perKg").replace("/ ", "")}</span>
               </div>

               <div className="flex items-center justify-between gap-2 mt-1">
                  <WeightStepper weight={currentWeight} onChange={(w) => onWeightChange(product.id, w)} />

                  <button
                     onClick={() => onAddToCart(product)}
                     className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0 shadow-sm ${isAdded ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary/90"}`}
                     title={isLoggedIn ? t("catalog.addToCart") : t("catalog.loginToOrder")}
                     aria-label={isLoggedIn ? t("catalog.addToCart") : t("catalog.loginToOrder")}
                  >
                     {isAdded ? <Check size={18} className="stroke-3" /> : <ShoppingCart size={18} className="stroke-[2.5]" />}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};
