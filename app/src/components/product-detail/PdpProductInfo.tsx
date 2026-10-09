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
              className="bg-primary/8 text-primary border-primary/15 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title + Rating */}
      <div>
        <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {product.name}
        </h2>

        <div className="mt-2 flex items-center gap-2">
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
            className="hover:text-primary text-xs font-medium text-gray-400 underline underline-offset-2 transition-colors"
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
          <span className="text-primary text-3xl font-black tabular-nums sm:text-4xl">
            {product.pricePerKg.toFixed(2).replace(".", ",")} €
          </span>
          <span className="ml-1.5 text-sm font-medium text-gray-400">
            {t("catalog.perKg")}
          </span>
        </div>
      </div>

      {/* Ethical Low-Stock Alert */}
      {isLowStock && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-3.5 py-2.5">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
          <p className="text-xs font-semibold text-red-700">
            {t("productDetail.lowStockAlert").replace(
              "{stock}",
              availableStock!.toFixed(1).replace(".", ",")
            )}
          </p>
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
        {product.description}
      </p>

      {/* Detail Badges Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-purple-100/80 bg-purple-50/60 p-3 text-center">
          <MapPin size={18} className="text-primary shrink-0" />
          <span className="text-[10px] leading-none font-semibold tracking-wider text-gray-400 uppercase">
            {t("productDetail.origin")}
          </span>
          <span className="text-xs leading-tight font-bold text-gray-800">
            {product.origin || t("productDetail.defaultOrigin")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-center">
          <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
          <span className="text-[10px] leading-none font-semibold tracking-wider text-emerald-500 uppercase">
            {t("productDetail.qualityLabel")}
          </span>
          <span className="text-xs leading-tight font-bold text-gray-800">
            {t("productDetail.qualityValue")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-center">
          <Truck size={18} className="shrink-0 text-blue-600" />
          <span className="text-[10px] leading-none font-semibold tracking-wider text-blue-500 uppercase">
            {t("productDetail.deliveryLabel")}
          </span>
          <span className="text-xs leading-tight font-bold text-gray-800">
            {t("productDetail.deliveryValue")}
          </span>
        </div>
      </div>
    </div>
  );
}
