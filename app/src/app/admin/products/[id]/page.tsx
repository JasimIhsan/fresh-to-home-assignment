"use client";

import { AdminProductInventoryPricing } from "@/components/admin/AdminProductInventoryPricing";
import { AdminProductMediaOverview } from "@/components/admin/AdminProductMediaOverview";
import { AdminProductModals } from "@/components/admin/AdminProductModals";
import { AdminProductSidebar } from "@/components/admin/AdminProductSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { productService, type StockAdjustMode } from "@/services";
import { Product, ProductStatus } from "@/types";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Edit2,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { t } = useLanguage();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockInput, setStockInput] = useState<string>("0");
  const [stockAdjustMode, setStockAdjustMode] =
    useState<StockAdjustMode>("set");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string>("");

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  useEffect(() => {
    const found = productService.getById(id);
    if (found) {
      setProduct(found);
      setStockInput((found.stockKg ?? 0).toString());
      setSelectedGalleryImage(found.imageUrl);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto my-12 max-w-md space-y-4 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("catalog.noResults")}
        </h2>
        <p className="text-sm text-gray-500">
          The requested product ID{" "}
          <span className="font-mono font-semibold text-gray-700">{id}</span>{" "}
          does not exist in the administrative inventory.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/products"
            className="bg-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
          >
            <ArrowLeft size={16} />
            <span>{t("productDetail.back")}</span>
          </Link>
        </div>
      </div>
    );
  }

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

  const handleStatusChange = (newStatus: ProductStatus) => {
    const updated = productService.setStatus(product.id, newStatus);
    if (updated) {
      setProduct({ ...updated });
      showNotification(
        `${t("admin.statusUpdatedSuccess")}: ${newStatus.toUpperCase()}`
      );
    }
  };

  const handleStockAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = productService.adjustStock(
      product,
      parseFloat(stockInput),
      stockAdjustMode
    );
    if (result) {
      setProduct({ ...result.product });
      setIsStockModalOpen(false);
      showNotification(
        `${t("admin.stockUpdatedSuccess")}: ${result.stockKg} kg`
      );
    }
  };

  const handleDeleteConfirm = () => {
    productService.delete(product.id);
    setIsDeleteModalOpen(false);
    router.push("/admin/products");
  };

  const gallery = productService.getGallery(product);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="animate-fadeIn fixed top-6 right-6 z-50">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
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
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  currentStatus === "active"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : currentStatus === "draft"
                      ? "border border-amber-200 bg-amber-50 text-amber-700"
                      : "border border-slate-200 bg-slate-100 text-slate-600"
                }`}
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
            onOpenStockModal={() => {
              setStockAdjustMode("set");
              setStockInput(stockLevel.toString());
              setIsStockModalOpen(true);
            }}
          />
        </div>

        <div className="space-y-6">
          <AdminProductSidebar
            product={product}
            currentStatus={currentStatus}
            stockLevel={stockLevel}
            onStatusChange={handleStatusChange}
            onOpenStockModal={() => {
              setStockAdjustMode("set");
              setStockInput(stockLevel.toString());
              setIsStockModalOpen(true);
            }}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>

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
      />
    </div>
  );
}
