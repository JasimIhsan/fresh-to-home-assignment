"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { Barcode, Package, Tag } from "lucide-react";
import React from "react";

export interface AdminProductMediaOverviewProps {
   product: Product;
   selectedGalleryImage: string;
   setSelectedGalleryImage: (img: string) => void;
   gallery: string[];
}

export function AdminProductMediaOverview({
   product,
   selectedGalleryImage,
   setSelectedGalleryImage,
   gallery,
}: AdminProductMediaOverviewProps) {
   const { t } = useLanguage();

   return (
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
         <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
               <div className="w-9 h-9 rounded-xl bg-purple-50 text-primary flex items-center justify-center">
                  <Package size={18} />
               </div>
               <div>
                  <h2 className="font-bold text-base text-slate-900">{t("admin.operationalOverview")}</h2>
                  <p className="text-xs text-slate-500">Core administrative identification & media</p>
               </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
               ID: {product.id}
            </span>
         </div>

         {/* Media Gallery Preview */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-5 flex flex-col items-center">
               <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                  <img
                     src={selectedGalleryImage || product.imageUrl}
                     alt={product.name}
                     className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                     Admin Asset
                  </div>
               </div>

               {/* Gallery thumbnails */}
               {gallery.length > 1 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto w-full pb-1">
                     {gallery.map((img, i) => (
                        <button
                           key={i}
                           onClick={() => setSelectedGalleryImage(img)}
                           className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              selectedGalleryImage === img ? "border-primary shadow-xs scale-105" : "border-slate-200 opacity-70 hover:opacity-100"
                           }`}
                        >
                           <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                        </button>
                     ))}
                  </div>
               )}
            </div>

            {/* Identification Badges & Spec Table */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        {t("admin.sku")}
                     </span>
                     <span className="font-mono text-xs font-bold text-slate-800">
                        {product.sku || "SKU-UNASSIGNED"}
                     </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        {t("admin.barcode")}
                     </span>
                     <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800">
                        <Barcode size={14} className="text-slate-500" />
                        <span>{product.barcode || "4260192830000"}</span>
                     </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        {t("admin.category")}
                     </span>
                     <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700">
                        <Tag size={12} className="text-primary" />
                        <span>{product.category || "Uncategorized"}</span>
                     </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        {t("admin.origin")}
                     </span>
                     <span className="text-xs font-bold text-slate-800">
                        {product.origin || "Deutschland"}
                     </span>
                  </div>
               </div>

               {/* Description Box */}
               <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                     {t("admin.description")}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                     {product.description || "No description specified for this product."}
                  </p>
               </div>

               {/* Tags */}
               <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                     {t("admin.tags")}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                     {(product.tags && product.tags.length > 0
                        ? product.tags
                        : ["Frischfleisch", "Zertifiziert", "Kühlkette"]
                     ).map((tg, idx) => (
                        <span
                           key={idx}
                           className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
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
