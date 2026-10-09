"use client";

import { AdminProductInventoryPricing } from "@/components/admin/AdminProductInventoryPricing";
import { AdminProductMediaOverview } from "@/components/admin/AdminProductMediaOverview";
import { AdminProductModals } from "@/components/admin/AdminProductModals";
import { AdminProductSidebar } from "@/components/admin/AdminProductSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { deleteProduct, getProductById, updateProductStatus, updateProductStock } from "@/lib/store";
import { Product, ProductStatus } from "@/types";
import { AlertTriangle, Archive, ArrowLeft, CheckCircle2, ChevronRight, Edit2, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = use(params);
   const { id } = resolvedParams;
   const { t } = useLanguage();
   const router = useRouter();

   const [product, setProduct] = useState<Product | null>(null);
   const [loading, setLoading] = useState(true);
   const [isStockModalOpen, setIsStockModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [stockInput, setStockInput] = useState<string>("0");
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
   const wholesaleCost = product.wholesaleCostPerKg ?? retailPrice * 0.6;
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

   const gallery = [product.imageUrl, ...(product.galleryImages || [])].filter((url, idx, self) => url && self.indexOf(url) === idx);

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

               <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
               >
                  <Edit2 size={15} />
                  <span>{t("admin.editProductDetails")}</span>
               </Link>

               <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-100 cursor-pointer"
                  title={t("admin.deleteProduct")}
               >
                  <Trash2 size={17} />
               </button>
            </div>
         </div>

         {/* Main Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
