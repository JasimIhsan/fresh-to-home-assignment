"use client";

import { useLanguage } from "@/context/LanguageContext";
import { productService } from "@/services";
import { Product } from "@/types";
import Link from "next/link";
import { useMemo } from "react";

interface PdpRelatedProductsProps {
  currentProductId: string;
  currentCategory: string;
}

export function PdpRelatedProducts({
  currentProductId,
  currentCategory,
}: PdpRelatedProductsProps) {
  const { t } = useLanguage();

  const related = useMemo(
    () => productService.getRelated(currentProductId, currentCategory),
    [currentProductId, currentCategory]
  );

  if (related.length === 0) return null;

  return (
    <section aria-label={t("productDetail.relatedTitle")} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold tracking-tight text-gray-900">
          {t("productDetail.relatedTitle")}
        </h3>
        <Link
          href="/catalog"
          className="text-primary text-xs font-semibold transition-colors hover:text-purple-700"
        >
          {t("productDetail.relatedViewAll")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-200 hover:border-gray-200 hover:shadow-md"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-black/60 px-2 py-1 text-[11px] font-bold text-white">
              {t("productDetail.outOfStockOverlay")}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="group-hover:text-primary line-clamp-2 text-xs leading-tight font-bold text-gray-800 transition-colors">
          {product.name}
        </p>
        <span className="text-primary mt-auto text-sm font-black tabular-nums">
          {product.pricePerKg.toFixed(2).replace(".", ",")} €{" "}
          <span className="text-[10px] font-medium text-gray-400">
            {t("catalog.perKg")}
          </span>
        </span>
      </div>
    </Link>
  );
}
