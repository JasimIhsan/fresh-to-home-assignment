"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  Trash2,
  Package,
  Layers,
  DollarSign,
  TrendingUp,
  Tag,
  Barcode,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Archive,
  Eye,
  RefreshCw,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Info
} from "lucide-react";
import { getProductById, saveProduct, deleteProduct, updateProductStock, updateProductStatus } from "@/lib/store";
import { Product, ProductStatus } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { t } = useLanguage();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockInput, setStockInput] = useState<string>("");
  const [stockAdjustMode, setStockAdjustMode] = useState<"set" | "add">("set");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string>("");

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  useEffect(() => {
    const found = getProductById(id);
    if (found) {
      setProduct(found);
      setStockInput((found.stockKg ?? 0).toString());
      setSelectedGalleryImage(found.imageUrl);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t("catalog.noResults")}</h2>
        <p className="text-sm text-gray-500">
          The requested product ID <span className="font-mono font-semibold text-gray-700">{id}</span> does not exist in the administrative inventory.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t("productDetail.back")}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Derive administrative and operational metrics
  const retailPrice = product.pricePerKg || 0;
  const wholesaleCost = product.wholesaleCostPerKg ?? (retailPrice * 0.6);
  const grossMargin = retailPrice - wholesaleCost;
  const marginPercentage = retailPrice > 0 ? (grossMargin / retailPrice) * 100 : 0;
  const stockLevel = product.stockKg ?? 0;
  const reservedStock = product.reservedStockKg ?? 0;
  const availableStock = Math.max(0, stockLevel - reservedStock);
  const reorderPoint = product.reorderPointKg ?? 15;
  const isLowStock = stockLevel <= reorderPoint;
  const currentStatus: ProductStatus = product.status || (product.isAvailable ? "active" : "draft");

  const handleStatusChange = (newStatus: ProductStatus) => {
    const updated = updateProductStatus(product.id, newStatus);
    if (updated) {
      setProduct({ ...updated });
      showNotification(`${t("admin.statusUpdatedSuccess")}: ${newStatus.toUpperCase()}`);
    }
  };

  const handleStockAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(stockInput);
    if (isNaN(parsed) || parsed < 0) return;

    const targetStock = stockAdjustMode === "set" ? parsed : (product.stockKg ?? 0) + parsed;
    const updated = updateProductStock(product.id, targetStock);
    if (updated) {
      setProduct({ ...updated });
      setIsStockModalOpen(false);
      showNotification(`${t("admin.stockUpdatedSuccess")}: ${targetStock} kg`);
    }
  };

  const handleDeleteConfirm = () => {
    deleteProduct(product.id);
    setIsDeleteModalOpen(false);
    router.push("/admin/products");
  };

  const gallery = [
    product.imageUrl,
    ...(product.galleryImages || [])
  ].filter((url, idx, self) => url && self.indexOf(url) === idx);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fadeIn">
          <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-sm font-medium">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb & Navigation Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2.5 bg-white hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 transition-colors cursor-pointer"
            title={t("admin.products")}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/admin" className="hover:text-primary transition-colors">
                {t("admin.dashboard")}
              </Link>
              <ChevronRight size={12} />
              <Link href="/admin/products" className="hover:text-primary transition-colors">
                {t("catalog.products")}
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-600 font-mono">{product.sku || product.id}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{product.name}</h1>
              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  currentStatus === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : currentStatus === "draft"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
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
        <div className="flex items-center flex-wrap gap-2.5">
          {/* View on Live Store */}
          <Link
            href={`/catalog/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="Inspect preview in customer catalog"
          >
            <ExternalLink size={15} className="text-slate-500" />
            <span>{t("admin.viewOnLiveStore")}</span>
          </Link>

          {/* Quick Edit */}
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Edit2 size={15} />
            <span>{t("admin.editProductDetails")}</span>
          </Link>

          {/* Delete Action */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-100 cursor-pointer"
            title={t("admin.deleteProduct")}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Main Grid: Operational & Administrative Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Core Info & Media & Inventory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Overview & Media Gallery */}
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

          {/* Section 2: Inventory & Pricing Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">{t("admin.inventoryPricing")}</h2>
                  <p className="text-xs text-slate-500">Stock quotas, cost models & profit margin metrics</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setStockAdjustMode("set");
                  setStockInput(stockLevel.toString());
                  setIsStockModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Layers size={14} />
                <span>{t("admin.quickAdjustStock")}</span>
              </button>
            </div>

            {/* Inventory KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-2xl border ${isLowStock ? "bg-red-50/60 border-red-200" : "bg-slate-50 border-slate-100"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                    {t("admin.inStock")}
                  </span>
                  {isLowStock ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                      Healthy
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${isLowStock ? "text-red-600" : "text-slate-900"}`}>
                    {stockLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kg</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Available for sale: <strong className="text-slate-800">{availableStock} kg</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1.5">
                  {t("admin.reserved")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-600">
                    {reservedStock}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kg</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Committed in active checkout orders
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1.5">
                  {t("admin.reorderPoint")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-700">
                    {reorderPoint}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kg</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Automatic replenishment trigger
                </div>
              </div>
            </div>

            {/* Financial & Margin Card */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-400" />
                  <span className="font-bold text-sm tracking-tight">Financial & Margins Breakdown</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-extrabold">
                  +{marginPercentage.toFixed(1)}% Gross Margin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    {t("admin.wholesalePrice")}
                  </span>
                  <p className="text-lg font-black text-slate-200">
                    {wholesaleCost.toFixed(2).replace(".", ",")} €
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    {t("admin.retailPrice")}
                  </span>
                  <p className="text-lg font-black text-emerald-400">
                    {retailPrice.toFixed(2).replace(".", ",")} €
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    {t("admin.marginPerKg")}
                  </span>
                  <p className="text-lg font-black text-white">
                    +{grossMargin.toFixed(2).replace(".", ",")} € / kg
                  </p>
                </div>
              </div>

              {/* Progress visualizer for profit margin */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Cost Allocation (Wholesale: {(100 - marginPercentage).toFixed(0)}%)</span>
                  <span>Profit Spread ({marginPercentage.toFixed(0)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-slate-500"
                    style={{ width: `${Math.max(5, 100 - marginPercentage)}%` }}
                  />
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${Math.max(5, marginPercentage)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Actions, Status & Visibility, Auditing */}
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
                onClick={() => {
                  setStockAdjustMode("set");
                  setStockInput(stockLevel.toString());
                  setIsStockModalOpen(true);
                }}
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
                onClick={() => setIsDeleteModalOpen(true)}
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
                      onClick={() => handleStatusChange(st)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                        currentStatus === st
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
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
                <span className="font-medium text-slate-700 text-right">
                  {product.createdBy || "admin@freshtohome.de"}
                </span>
              </div>

              <div className="flex items-start justify-between py-1">
                <span className="text-slate-400">{t("admin.updatedBy")}</span>
                <span className="font-medium text-slate-700 text-right">
                  {product.updatedBy || "admin@freshtohome.de"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
              <Info size={13} className="shrink-0" />
              <span>{t("admin.internalNotice")} • Strict Role Guard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stock Adjustment Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <h3 className="font-bold text-base text-slate-900">{t("admin.adjustStockModalTitle")}</h3>
              </div>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setStockAdjustMode("set")}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      stockAdjustMode === "set" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Set Exact Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockAdjustMode("add")}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      stockAdjustMode === "add" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Add / Restock
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {stockAdjustMode === "set" ? t("admin.newStockValue") : "Add Amount (kg)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:outline-hidden"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">kg</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Current stock level: <strong>{stockLevel} kg</strong>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {t("admin.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Apply Stock Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-slate-900">{t("admin.deleteProduct")}</h3>
              <p className="text-xs text-slate-500">
                {t("admin.deleteConfirm")} This will permanently remove <strong className="text-slate-800">{product.name}</strong> from both store catalogs and internal admin inventory.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {t("admin.cancel")}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                {t("admin.deleteProduct")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
