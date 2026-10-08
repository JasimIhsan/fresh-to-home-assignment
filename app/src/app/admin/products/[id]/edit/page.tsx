"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, AlertCircle } from "lucide-react";
import { getProductById, saveProduct, deleteProduct } from "@/lib/store";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { t } = useLanguage();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Rind");
  const [pricePerKg, setPricePerKg] = useState("");
  const [stockKg, setStockKg] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [origin, setOrigin] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [touched, setTouched] = useState<{
    name?: boolean;
    pricePerKg?: boolean;
    stockKg?: boolean;
    origin?: boolean;
  }>({});

  const getNameError = () => {
    if (!name.trim()) return t("validation.productNameRequired");
    return "";
  };

  const getPriceError = () => {
    const val = parseFloat(pricePerKg);
    if (!pricePerKg.trim() || isNaN(val) || val <= 0) {
      return t("validation.priceRequired");
    }
    return "";
  };

  const getStockError = () => {
    const val = parseFloat(stockKg);
    if (!stockKg.trim() || isNaN(val) || val < 0) {
      return t("validation.stockRequired");
    }
    return "";
  };

  const getOriginError = () => {
    if (!origin.trim()) return t("validation.originRequired");
    return "";
  };

  const nameError = touched.name ? getNameError() : "";
  const priceError = touched.pricePerKg ? getPriceError() : "";
  const stockError = touched.stockKg ? getStockError() : "";
  const originError = touched.origin ? getOriginError() : "";

  useEffect(() => {
    const found = getProductById(id);
    if (found) {
      setProduct(found);
      setName(found.name);
      setCategory(found.category || "Rind");
      setPricePerKg(found.pricePerKg.toString());
      setStockKg((found.stockKg ?? 50).toString());
      setIsAvailable(found.isAvailable);
      setOrigin(found.origin || "");
      setImageUrl(found.imageUrl);
      setDescription(found.description);
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setTouched({
      name: true,
      pricePerKg: true,
      stockKg: true,
      origin: true,
    });

    const nErr = getNameError();
    const pErr = getPriceError();
    const sErr = getStockError();
    const oErr = getOriginError();

    if (nErr || pErr || sErr || oErr) {
      return;
    }

    setSaving(true);
    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      category,
      pricePerKg: parseFloat(pricePerKg) || product.pricePerKg,
      stockKg: parseFloat(stockKg) || 0,
      isAvailable,
      origin: origin.trim(),
      imageUrl,
      description,
    };

    saveProduct(updatedProduct);
    setTimeout(() => {
      setSaving(false);
      router.push(`/admin/products/${id}`);
    }, 400);
  };

  const handleDelete = () => {
    if (confirm(t("admin.deleteConfirm"))) {
      deleteProduct(id);
      router.push("/admin/products");
    }
  };

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle size={48} className="mx-auto text-gray-400" />
        <h2 className="text-xl font-bold text-gray-800">{t("catalog.noResults")}</h2>
        <Link
          href="/admin/products"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm"
        >
          {t("productDetail.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/products/${id}`}
            className="p-2 bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {t("admin.editProduct")}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">ID: {product.id}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <Trash2 size={15} />
          <span>{t("admin.deleteProduct")}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t("admin.productName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!touched.name) setTouched(prev => ({ ...prev, name: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${
                nameError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
              }`}
              aria-invalid={!!nameError}
            />
            {nameError && (
              <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{nameError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t("admin.category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
            >
              {["Rind", "Geflügel", "Lamm", "Fisch", "Feinkost"].map(cat => (
                <option key={cat} value={cat}>{t(`categories.${cat}`) !== `categories.${cat}` ? t(`categories.${cat}`) : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price, Stock & Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t("admin.pricePerKg")}
            </label>
            <input
              type="number"
              step="0.1"
              value={pricePerKg}
              onChange={(e) => {
                setPricePerKg(e.target.value);
                if (!touched.pricePerKg) setTouched(prev => ({ ...prev, pricePerKg: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, pricePerKg: true }))}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${
                priceError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
              }`}
              aria-invalid={!!priceError}
            />
            {priceError && (
              <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{priceError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t("admin.stockKg")}
            </label>
            <input
              type="number"
              step="1"
              value={stockKg}
              onChange={(e) => {
                setStockKg(e.target.value);
                if (!touched.stockKg) setTouched(prev => ({ ...prev, stockKg: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, stockKg: true }))}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${
                stockError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
              }`}
              aria-invalid={!!stockError}
            />
            {stockError && (
              <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{stockError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t("admin.origin")}
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                if (!touched.origin) setTouched(prev => ({ ...prev, origin: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, origin: true }))}
              placeholder="Deutschland"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${
                originError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
              }`}
              aria-invalid={!!originError}
            />
            {originError && (
              <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-fadeIn">{originError}</p>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            {t("admin.imageUrl")}
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            {t("admin.description")}
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("admin.descriptionPlaceholder")}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
          />
        </div>

        {/* Availability Toggle */}
        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-gray-800 block">
              {t("admin.isAvailable")}
            </span>
            <span className="text-xs text-gray-500">
              {t("admin.availableDesc")}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href={`/admin/products/${id}`}
            className="px-6 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
          >
            {t("admin.cancel")}
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? t("admin.savingProduct") : t("admin.saveProduct")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
