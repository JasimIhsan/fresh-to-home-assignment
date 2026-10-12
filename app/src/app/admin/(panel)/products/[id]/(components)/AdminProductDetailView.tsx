"use client";

import {
  adjustProductStock,
  deleteProduct,
  setProductStatus,
} from "@/app/actions/product.actions";
import { AdminProductInventoryPricing } from "./AdminProductInventoryPricing";
import { AdminProductMediaOverview } from "./AdminProductMediaOverview";
import { AdminProductSidebar } from "./AdminProductSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { productService, type StockAdjustMode } from "@/services/index";
import type { Product, ProductStatus } from "@/types/index";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Edit2,
  ExternalLink,
  Trash2,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

// Only needed once an admin opens a dialog; keep it out of the initial bundle.
const AdminProductModals = dynamic(
  () => import("./AdminProductModals").then((m) => m.AdminProductModals),
  { ssr: false }
);

const NOTIFICATION_MS = 3500;

interface Notification {
  readonly message: string;
  readonly type: "success" | "error";
}

export interface AdminProductDetailViewProps {
  readonly product: Readonly<Product>;
}

export function AdminProductDetailView({
  product,
}: AdminProductDetailViewProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockInput, setStockInput] = useState("0");
  const [stockAdjustMode, setStockAdjustMode] =
    useState<StockAdjustMode>("set");
  const [notification, setNotification] = useState<Notification | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(
    product.imageUrl
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const showNotification = (
    message: string,
    type: Notification["type"] = "success"
  ) => {
    setNotification({ message, type });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNotification(null), NOTIFICATION_MS);
  };

  const {
    retailPrice,
    wholesaleCost,
    grossMargin,
    marginPercentage,
    stockLevel,
    reservedStock,
    availableStock,
    reorderPoint,
    isLowStock,
    status: currentStatus,
  } = productService.getMetrics(product);
  const gallery = productService.getGallery(product);

  const openStockModal = () => {
    setStockAdjustMode("set");
    setStockInput(stockLevel.toString());
    setIsStockModalOpen(true);
  };

  const handleStatusChange = (newStatus: ProductStatus) => {
    if (newStatus === currentStatus) return;
    startTransition(async () => {
      const result = await setProductStatus(product.id, newStatus);
      if (!result.success) {
        showNotification(result.error, "error");
        return;
      }
      showNotification(
        `${t("admin.statusUpdatedSuccess")}: ${result.data.status.toUpperCase()}`
      );
      router.refresh();
    });
  };

  const handleStockAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(stockInput);
    if (Number.isNaN(amount) || amount < 0) return;

    startTransition(async () => {
      const result = await adjustProductStock({
        id: product.id,
        amount,
        mode: stockAdjustMode,
      });
      if (!result.success) {
        showNotification(result.error, "error");
        return;
      }
      setIsStockModalOpen(false);
      showNotification(
        `${t("admin.stockUpdatedSuccess")}: ${result.data.stockKg} kg`
      );
      router.refresh();
    });
  };

  const handleDeleteConfirm = () => {
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (!result.success) {
        showNotification(result.error, "error");
        return;
      }
      setIsDeleteModalOpen(false);
      router.push("/admin/products");
    });
  };

  return (
    <div
      className={cn(
        "mx-auto max-w-6xl space-y-6 pb-12",
        isPending && "cursor-wait"
      )}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="animate-fadeIn fixed top-6 right-6 z-50" role="status">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
            {notification.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            ) : (
              <XCircle size={18} className="shrink-0 text-red-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb & Navigation Topbar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100"
            title={t("admin.products")}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link
                href="/admin"
                className="hover:text-primary transition-colors"
              >
                {t("admin.dashboard")}
              </Link>
              <ChevronRight size={12} />
              <Link
                href="/admin/products"
                className="hover:text-primary transition-colors"
              >
                {t("catalog.products")}
              </Link>
              <ChevronRight size={12} />
              <span className="font-mono text-slate-600">
                {product.sku || product.id}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {product.name}
              </h1>
              {/* Status Badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
                  currentStatus === "active" &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700",
                  currentStatus === "draft" &&
                    "border-amber-200 bg-amber-50 text-amber-700",
                  currentStatus === "archived" &&
                    "border-slate-200 bg-slate-100 text-slate-600"
                )}
              >
                {currentStatus === "active" && <CheckCircle2 size={13} />}
                {currentStatus === "draft" && <AlertTriangle size={13} />}
                {currentStatus === "archived" && <Archive size={13} />}
                <span>
                  {currentStatus === "active"
                    ? t("admin.statusActive")
                    : currentStatus === "draft"
                      ? t("admin.statusDraft")
                      : t("admin.statusArchived")}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/catalog/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
            title="Inspect preview in customer catalog"
          >
            <ExternalLink size={15} className="text-slate-500" />
            <span>{t("admin.viewOnLiveStore")}</span>
          </Link>

          <Link
            href={`/admin/products/${product.id}/edit`}
            className="bg-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-purple-700"
          >
            <Edit2 size={15} />
            <span>{t("admin.editProductDetails")}</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="cursor-pointer rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100"
            title={t("admin.deleteProduct")}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminProductMediaOverview
            product={product}
            selectedGalleryImage={selectedGalleryImage}
            setSelectedGalleryImage={setSelectedGalleryImage}
            gallery={gallery}
          />

          <AdminProductInventoryPricing
            stockLevel={stockLevel}
            reservedStock={reservedStock}
            availableStock={availableStock}
            reorderPoint={reorderPoint}
            isLowStock={isLowStock}
            retailPrice={retailPrice}
            wholesaleCost={wholesaleCost}
            grossMargin={grossMargin}
            marginPercentage={marginPercentage}
            onOpenStockModal={openStockModal}
          />
        </div>

        <div className="space-y-6">
          <AdminProductSidebar
            product={product}
            currentStatus={currentStatus}
            stockLevel={stockLevel}
            statusPending={isPending}
            onStatusChange={handleStatusChange}
            onOpenStockModal={openStockModal}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>

      {(isStockModalOpen || isDeleteModalOpen) && (
        <AdminProductModals
          isStockModalOpen={isStockModalOpen}
          setIsStockModalOpen={setIsStockModalOpen}
          stockAdjustMode={stockAdjustMode}
          setStockAdjustMode={setStockAdjustMode}
          stockInput={stockInput}
          setStockInput={setStockInput}
          stockLevel={stockLevel}
          onStockAdjustmentSubmit={handleStockAdjustmentSubmit}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          productName={product.name}
          onDeleteConfirm={handleDeleteConfirm}
          pending={isPending}
        />
      )}
    </div>
  );
}
