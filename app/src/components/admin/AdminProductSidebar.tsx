"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product, ProductStatus } from "@/types";
import {
  Calendar,
  ChevronRight,
  Edit2,
  ExternalLink,
  Eye,
  Info,
  Layers,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
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
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
          <Sparkles size={16} className="text-primary" />
          <span>{t("admin.quickActions")}</span>
        </h3>

        <div className="space-y-2.5">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100"
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
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100"
          >
            <div className="flex items-center gap-2.5">
              <Layers size={15} className="text-emerald-600" />
              <span>{t("admin.quickAdjustStock")}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              {stockLevel} kg
            </span>
          </button>

          <Link
            href={`/catalog/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex w-full cursor-pointer items-center justify-between rounded-xl border border-purple-100 bg-purple-50/60 p-3 text-xs font-bold transition-colors hover:bg-purple-100"
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
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 size={15} />
              <span>{t("admin.deleteProduct")}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Status & Lifecycle Controller */}
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
          <ShieldCheck size={16} className="text-primary" />
          <span>{t("admin.statusVisibility")}</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Lifecycle Status
            </label>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1">
              {(["draft", "active", "archived"] as ProductStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onStatusChange(st)}
                    className={`cursor-pointer rounded-lg py-1.5 text-xs font-bold capitalize transition-all ${
                      currentStatus === st
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Storefront Visibility
              </span>
              <span
                className={`font-bold ${product.isAvailable ? "text-emerald-600" : "text-slate-400"}`}
              >
                {product.isAvailable
                  ? t("admin.visibilityPublic")
                  : t("admin.visibilityHidden")}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Catalog Indexing
              </span>
              <span className="font-mono text-slate-700">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auditing & Metadata Card */}
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
          <Calendar size={16} className="text-slate-400" />
          <span>{t("admin.auditMetadata")}</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-start justify-between border-b border-slate-50 py-1">
            <span className="text-slate-400">{t("admin.createdAt")}</span>
            <span className="text-right font-mono font-medium text-slate-700">
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : "2026-08-12"}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-50 py-1">
            <span className="text-slate-400">{t("admin.updatedAt")}</span>
            <span className="text-right font-mono font-medium text-slate-700">
              {product.updatedAt
                ? new Date(product.updatedAt).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : "Today, 10:30"}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-50 py-1">
            <span className="text-slate-400">{t("admin.createdBy")}</span>
            <span className="text-right font-medium text-slate-700">
              {product.createdBy || "admin@freshtohome.de"}
            </span>
          </div>

          <div className="flex items-start justify-between py-1">
            <span className="text-slate-400">{t("admin.updatedBy")}</span>
            <span className="text-right font-medium text-slate-700">
              {product.updatedBy || "admin@freshtohome.de"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          <Info size={13} className="shrink-0" />
          <span>{t("admin.internalNotice")} • Strict Role Guard</span>
        </div>
      </div>
    </div>
  );
}
