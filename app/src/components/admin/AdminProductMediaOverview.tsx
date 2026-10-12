"use client";

import { useLanguage } from "@/context/LanguageContext";
import { isOptimizableImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { Barcode, Package, Tag } from "lucide-react";
import Image from "next/image";

export interface AdminProductMediaOverviewProps {
  readonly product: Readonly<Product>;
  readonly selectedGalleryImage: string;
  readonly setSelectedGalleryImage: (img: string) => void;
  readonly gallery: readonly string[];
}

export function AdminProductMediaOverview({
  product,
  selectedGalleryImage,
  setSelectedGalleryImage,
  gallery,
}: AdminProductMediaOverviewProps) {
  const { t } = useLanguage();
  const mainImage = selectedGalleryImage || product.imageUrl;

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-7">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="text-primary flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">
            <Package size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t("admin.operationalOverview")}
            </h2>
            <p className="text-xs text-slate-500">
              Core administrative identification & media
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">
          ID: {product.id}
        </span>
      </div>

      {/* Media Gallery Preview */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="flex flex-col items-center md:col-span-5">
          <div className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 40vw, 100vw"
                unoptimized={!isOptimizableImage(mainImage)}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute top-2 right-2 rounded-md bg-slate-900/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
              Admin Asset
            </div>
          </div>

          {/* Gallery thumbnails */}
          {gallery.length > 1 && (
            <div className="mt-3 flex w-full items-center gap-2 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedGalleryImage(img)}
                  aria-pressed={selectedGalleryImage === img}
                  className={cn(
                    "h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
                    selectedGalleryImage === img
                      ? "border-primary scale-105 shadow-xs"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    width={56}
                    height={56}
                    sizes="56px"
                    unoptimized={!isOptimizableImage(img)}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Identification Badges & Spec Table */}
        <div className="flex flex-col justify-between space-y-4 md:col-span-7">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="mb-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {t("admin.sku")}
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">
                {product.sku || "SKU-UNASSIGNED"}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="mb-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {t("admin.barcode")}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800">
                <Barcode size={14} className="text-slate-500" />
                <span>{product.barcode || "4260192830000"}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="mb-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {t("admin.category")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                <Tag size={12} className="text-primary" />
                <span>{product.category || "Uncategorized"}</span>
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="mb-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {t("admin.origin")}
              </span>
              <span className="text-xs font-bold text-slate-800">
                {product.origin || "Deutschland"}
              </span>
            </div>
          </div>

          {/* Description Box */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {t("admin.description")}
            </span>
            <p className="text-xs leading-relaxed text-slate-600">
              {product.description ||
                "No description specified for this product."}
            </p>
          </div>

          {/* Tags */}
          <div>
            <span className="mb-2 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {t("admin.tags")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(product.tags && product.tags.length > 0
                ? product.tags
                : ["Frischfleisch", "Zertifiziert", "Kühlkette"]
              ).map((tg) => (
                <span
                  key={tg}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  #{tg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
