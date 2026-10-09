"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CartItem } from "@/types";
import { Package } from "lucide-react";
import Link from "next/link";

export interface AdminOrderItemsViewProps {
  items: CartItem[];
  totalAmount: number;
}

export function AdminOrderItemsView({
  items,
  totalAmount,
}: AdminOrderItemsViewProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <h3 className="flex items-center space-x-2 text-base font-bold text-gray-900">
        <Package size={18} className="text-primary" />
        <span>
          {t("orderDetail.itemsTitle")} ({items.length})
        </span>
      </h3>

      <div className="divide-y divide-gray-100">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-3 text-sm"
          >
            <Link
              href={`/admin/products/${item.product.id}`}
              className="group flex cursor-pointer items-center space-x-3"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="group-hover:ring-primary/20 h-12 w-12 rounded-xl object-cover transition-all group-hover:ring-2"
              />
              <div>
                <p className="group-hover:text-primary font-bold text-gray-900 transition-colors">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.weightKg.toFixed(1).replace(".", ",")} kg ×{" "}
                  {item.product.pricePerKg.toFixed(2).replace(".", ",")} € / kg
                </p>
              </div>
            </Link>
            <span className="font-black text-gray-900">
              {(item.weightKg * item.product.pricePerKg)
                .toFixed(2)
                .replace(".", ",")}{" "}
              €
            </span>
          </div>
        ))}
      </div>

      <div className="text-primary flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-black">
        <span>{t("admin.orderTotal")}</span>
        <span>{totalAmount.toFixed(2).replace(".", ",")} €</span>
      </div>
    </div>
  );
}
