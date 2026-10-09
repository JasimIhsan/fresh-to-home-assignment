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
  disabled?: boolean;
}

export function CartItemCard({
  product,
  weightKg,
  onUpdateWeight,
  onRemove,
  disabled = false,
}: CartItemCardProps) {
  const { t } = useLanguage();
  const lineTotal = (product.pricePerKg * weightKg)
    .toFixed(2)
    .replace(".", ",");
  const step = 0.5;

  return (
    <div className="hover:border-primary/20 flex flex-col items-start justify-between gap-4 rounded-3xl border border-gray-100/90 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5">
      {/* Product Info & Thumbnail */}
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href={`/catalog/${product.id}`}
          className="group h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-xs sm:h-20 sm:w-20"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="min-w-0">
          <Link
            href={`/catalog/${product.id}`}
            className="hover:text-primary block truncate text-base font-black text-gray-900 transition-colors"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-gray-500">
            <span className="text-primary/80 text-[10px] font-semibold tracking-wider uppercase">
              {product.category}
            </span>{" "}
            • {product.pricePerKg.toFixed(2).replace(".", ",")}{" "}
            {t("catalog.perKg")}
          </p>
          <span className="text-primary mt-1 block text-base font-black tabular-nums sm:text-lg">
            {lineTotal} €
          </span>
        </div>
      </div>

      {/* Quantity Stepper & Remove Action */}
      <div className="flex w-full shrink-0 items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
        {/* Weight Stepper Pill */}
        <div className="flex items-center rounded-2xl border border-purple-100 bg-purple-50/80 p-1 shadow-xs">
          <button
            type="button"
            onClick={() =>
              !disabled && weightKg > step && onUpdateWeight(weightKg - step)
            }
            disabled={disabled || weightKg <= step}
            className="text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-white shadow-xs transition-all hover:bg-white/80 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease weight"
          >
            <Minus size={15} strokeWidth={2.5} />
          </button>

          <span className="text-primary min-w-16 px-1 text-center text-xs font-extrabold tabular-nums sm:text-sm">
            {weightKg.toFixed(1).replace(".", ",")} kg
          </span>

          <button
            type="button"
            onClick={() => !disabled && onUpdateWeight(weightKg + step)}
            disabled={disabled}
            className="text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-white shadow-xs transition-all hover:bg-white/80 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase weight"
          >
            <Plus size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Trash Delete Button */}
        <button
          type="button"
          onClick={() => !disabled && onRemove()}
          disabled={disabled}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          title={t("cart.remove")}
          aria-label={t("cart.remove")}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
