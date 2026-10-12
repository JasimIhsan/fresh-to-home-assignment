"use client";

import { WeightStepper } from "@/components/ui/WeightStepper";
import { useLanguage } from "@/context/LanguageContext";
import { isOptimizableImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { Check, Globe, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categoryLabel } from "./categoryLabel";

interface ProductCardProps {
  readonly product: Readonly<Product>;
  readonly currentWeight: number;
  readonly isAdded: boolean;
  readonly isLoggedIn: boolean;
  readonly onWeightChange: (id: string, weight: number) => void;
  readonly onAddToCart: (product: Readonly<Product>) => void;
  readonly isOffline?: boolean;
  /** Eager-load the image (first row of the grid, likely the LCP element). */
  readonly priority?: boolean;
}

export const ProductCard = ({
  product,
  currentWeight,
  isAdded,
  isLoggedIn,
  onWeightChange,
  onAddToCart,
  isOffline = false,
  priority = false,
}: ProductCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card text-card-foreground border-border group flex h-full flex-col rounded-2xl border p-3 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative mb-3 aspect-4/3 w-full overflow-hidden rounded-xl">
        <Link
          href={`/catalog/${product.id}`}
          className="block h-full w-full cursor-pointer"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            unoptimized={!isOptimizableImage(product.imageUrl)}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-2 left-2">
          <span className="bg-background/90 text-foreground border-border/50 rounded border px-2 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm">
            {product.category ? categoryLabel(product.category, t) : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1">
        {product.origin && (
          <p className="text-muted-foreground mb-1 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
            <Globe size={10} /> {product.origin}
          </p>
        )}

        <Link
          href={`/catalog/${product.id}`}
          className="hover:text-primary mb-1 block transition-colors"
        >
          <h3 className="text-foreground line-clamp-2 text-[15px] leading-tight font-bold">
            {product.name}
          </h3>
        </Link>

        <p className="text-muted-foreground mb-3 line-clamp-2 text-[12px]">
          {product.description}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-foreground text-lg font-black">
              {product.pricePerKg.toFixed(2).replace(".", ",")} €
            </span>
            <span className="text-muted-foreground text-xs font-medium">
              / {t("catalog.perKg").replace("/ ", "")}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <WeightStepper
              weight={currentWeight}
              onChange={(w) => onWeightChange(product.id, w)}
            />

            <button
              onClick={() => !isOffline && onAddToCart(product)}
              disabled={isOffline}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all duration-200 active:scale-95",
                isOffline
                  ? "cursor-not-allowed bg-gray-200 text-gray-400 shadow-none"
                  : isAdded
                    ? "cursor-pointer bg-emerald-500 text-white"
                    : "bg-primary hover:bg-primary/90 cursor-pointer text-white"
              )}
              title={
                isOffline
                  ? t("network.cartOfflineBadge")
                  : isLoggedIn
                    ? t("catalog.addToCart")
                    : t("catalog.loginToOrder")
              }
              aria-label={
                isOffline
                  ? t("network.cartOfflineBadge")
                  : isLoggedIn
                    ? t("catalog.addToCart")
                    : t("catalog.loginToOrder")
              }
            >
              {isAdded ? (
                <Check size={18} className="stroke-3" />
              ) : (
                <ShoppingCart size={18} className="stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
