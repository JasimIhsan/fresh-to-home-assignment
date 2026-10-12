"use client";

import { useLanguage } from "@/context/LanguageContext";
import { isOptimizableImage } from "@/lib/image";
import type { CartItem } from "@/types";
import { Package } from "lucide-react";
import Image from "next/image";
import { formatEuro, formatKg } from "./format";

export interface OrderItemListProps {
  readonly items: readonly CartItem[];
  readonly totalAmount: number;
}

export function OrderItemList({ items, totalAmount }: OrderItemListProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
      <h3 className="flex items-center space-x-2 text-lg font-bold text-gray-900">
        <Package size={20} className="text-primary" />
        <span>{t("orderDetail.itemsTitle")}</span>
      </h3>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between py-3 text-sm"
          >
            <div className="flex items-center space-x-3">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                width={48}
                height={48}
                sizes="48px"
                unoptimized={!isOptimizableImage(item.product.imageUrl)}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatKg(item.weightKg)} kg ×{" "}
                  {formatEuro(item.product.pricePerKg)} € / kg
                </p>
              </div>
            </div>
            <span className="font-bold text-gray-900">
              {formatEuro(item.weightKg * item.product.pricePerKg)} €
            </span>
          </div>
        ))}
      </div>

      <div className="text-primary flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-black">
        <span>{t("orders.total")}</span>
        <span>{formatEuro(totalAmount)} €</span>
      </div>
    </div>
  );
}
