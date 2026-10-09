"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product, ProductStatus } from "@/types";
import { Calendar, ChevronRight, Edit2, ExternalLink, Eye, Info, Layers, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";

export interface AdminProductSidebarProps {
   product: Product;
   currentStatus: ProductStatus;
   stockLevel: number;
   onStatusChange: (st: ProductStatus) => void;
   onOpenStockModal: () => void;
   onOpenDeleteModal: () => void;
}

export function AdminProductSidebar({
   product,
   currentStatus,
   stockLevel,
   onStatusChange,
   onOpenStockModal,
   onOpenDeleteModal,
}: AdminProductSidebarProps) {
   const { t } = useLanguage();

   return (
      <div className="space-y-6">
         {/* Quick Actions Panel */}
         <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
               <Sparkles size={16} className="text-primary" />
               <span>{t("admin.quickActions")}</span>
            </h3>

            <div className="space-y-2.5">
               <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors border border-slate-100 cursor-pointer"
               >
                  <div className="flex items-center gap-2.5">
                     <Edit2 size={15} className="text-primary" />
                     <span>{t("admin.editProductDetails")}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
               </Link>

               <button
                  type="button"
                  onClick={onOpenStockModal}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors border border-slate-100 cursor-pointer"
               >
                  <div className="flex items-center gap-2.5">
                     <Layers size={15} className="text-emerald-600" />
                     <span>{t("admin.quickAdjustStock")}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{stockLevel} kg</span>
               </button>

               <Link
                  href={`/catalog/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50/60 hover:bg-purple-100 text-primary text-xs font-bold transition-colors border border-purple-100 cursor-pointer"
               >
                  <div className="flex items-center gap-2.5">
                     <ExternalLink size={15} />
                     <span>{t("admin.viewOnLiveStore")}</span>
                  </div>
                  <Eye size={14} className="text-primary/70" />
               </Link>

               <button
                  type="button"
                  onClick={onOpenDeleteModal}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors border border-red-100 cursor-pointer"
               >
                  <div className="flex items-center gap-2.5">
                     <Trash2 size={15} />
                     <span>{t("admin.deleteProduct")}</span>
                  </div>
               </button>
            </div>
         </div>

         {/* Status & Lifecycle Controller */}
         <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
               <ShieldCheck size={16} className="text-primary" />
               <span>{t("admin.statusVisibility")}</span>
            </h3>

            <div className="space-y-3">
               <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                     Lifecycle Status
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                     {(["draft", "active", "archived"] as ProductStatus[]).map((st) => (
                        <button
                           key={st}
                           type="button"
                           onClick={() => onStatusChange(st)}
                           className={`py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                              currentStatus === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                           }`}
                        >
                           {st}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-500 font-medium">Storefront Visibility</span>
                     <span className={`font-bold ${product.isAvailable ? "text-emerald-600" : "text-slate-400"}`}>
                        {product.isAvailable ? t("admin.visibilityPublic") : t("admin.visibilityHidden")}
                     </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-500 font-medium">Catalog Indexing</span>
                     <span className="font-mono text-slate-700">Enabled</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Auditing & Metadata Card */}
         <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
               <Calendar size={16} className="text-slate-400" />
               <span>{t("admin.auditMetadata")}</span>
            </h3>

            <div className="space-y-3 text-xs">
               <div className="flex items-start justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">{t("admin.createdAt")}</span>
                  <span className="font-mono text-slate-700 font-medium text-right">
                     {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "2026-08-12"}
                  </span>
               </div>

               <div className="flex items-start justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">{t("admin.updatedAt")}</span>
                  <span className="font-mono text-slate-700 font-medium text-right">
                     {product.updatedAt ? new Date(product.updatedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "Today, 10:30"}
                  </span>
               </div>

               <div className="flex items-start justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">{t("admin.createdBy")}</span>
                  <span className="font-medium text-slate-700 text-right">{product.createdBy || "admin@freshtohome.de"}</span>
               </div>

               <div className="flex items-start justify-between py-1">
                  <span className="text-slate-400">{t("admin.updatedBy")}</span>
                  <span className="font-medium text-slate-700 text-right">{product.updatedBy || "admin@freshtohome.de"}</span>
               </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
               <Info size={13} className="shrink-0" />
               <span>{t("admin.internalNotice")} • Strict Role Guard</span>
            </div>
         </div>
      </div>
   );
}
