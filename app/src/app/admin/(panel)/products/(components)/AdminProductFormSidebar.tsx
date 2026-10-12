"use client";

import { useLanguage } from "@/context/LanguageContext";
import { isOptimizableImage } from "@/lib/image";
import { Image as ImageIcon, Save } from "lucide-react";
import Image from "next/image";

export interface AdminProductFormSidebarProps {
  readonly name: string;
  readonly category: string;
  readonly pricePerKg: string;
  readonly imageUrl: string;
  readonly saving: boolean;
  readonly isEditMode?: boolean;
}

/** next/image throws on partial input (e.g. "htt"); only preview usable srcs. */
function isRenderableSrc(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const { protocol } = new URL(src);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export function AdminProductFormSidebar({
  name,
  category,
  pricePerKg,
  imageUrl,
  saving,
  isEditMode = false,
}: AdminProductFormSidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 lg:col-span-1">
      {/* Live Preview Card */}
      <div className="sticky top-24 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
        <h3 className="flex items-center space-x-2 text-base font-bold text-gray-900">
          <ImageIcon size={18} className="text-primary" />
          <span>{t("admin.liveStorePreview")}</span>
        </h3>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-200">
            {isRenderableSrc(imageUrl) ? (
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                sizes="(min-width: 1024px) 320px, 100vw"
                unoptimized={!isOptimizableImage(imageUrl)}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                No Image Selected
              </div>
            )}
            <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-700 backdrop-blur-xs">
              {category}
            </span>
          </div>

          <div className="space-y-2 p-4">
            <h4 className="truncate text-sm font-bold text-gray-900">
              {name || "Neuer Produktname"}
            </h4>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-gray-400">1 kg</span>
              <span className="text-primary text-base font-black">
                {parseFloat(pricePerKg || "0")
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                €
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          form="product-form"
          disabled={saving}
          className="bg-primary shadow-primary/25 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 disabled:opacity-50"
        >
          <Save size={18} />
          <span>
            {saving
              ? t("admin.saving")
              : isEditMode
                ? t("admin.saveChanges")
                : t("admin.createProduct")}
          </span>
        </button>
      </div>
    </div>
  );
}
