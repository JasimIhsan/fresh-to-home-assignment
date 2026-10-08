"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { saveProduct } from "@/lib/store";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const SAMPLE_IMAGES = [
  {
    label: "Rind / Steak",
    url: "/images/products/raw_beef_steak.jpg",
  },
  {
    label: "Geflügel",
    url: "/images/products/raw_chicken_breast.jpg",
  },
  {
    label: "Lamm",
    url: "/images/products/raw_lamb_chops.jpg",
  },
  {
    label: "Fisch / Lachs",
    url: "/images/products/raw_salmon_fillet.jpg",
  },
  {
    label: "Hackfleisch",
    url: "/images/products/raw_minced_beef.jpg",
  },
  {
    label: "Wurst",
    url: "/images/products/raw_sausages.jpg",
  },
  {
    label: "Feinkost",
    url: "/images/products/raw_prosciutto.jpg",
  },
];

export default function NewProductPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Rind");
  const [pricePerKg, setPricePerKg] = useState("24.90");
  const [stockKg, setStockKg] = useState("50");
  const [isAvailable, setIsAvailable] = useState(true);
  const [origin, setOrigin] = useState("Deutschland");
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      category,
      pricePerKg: parseFloat(pricePerKg) || 0,
      stockKg: parseFloat(stockKg) || 0,
      isAvailable,
      origin: origin.trim(),
      imageUrl: imageUrl || SAMPLE_IMAGES[0].url,
      description,
    };

    saveProduct(newProduct);
    setTimeout(() => {
      setSaving(false);
      router.push("/admin/products");
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Link
          href="/admin/products"
          className="p-2 bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {t("admin.addProduct")}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {t("admin.productsSubtitle")}
          </p>
        </div>
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
              placeholder="z.B. Bio Rinderfilet"
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
              placeholder="29.90"
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
              placeholder="50"
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

        {/* Image URL & Presets */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            {t("admin.imageUrl")}
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
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

          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-gray-400 font-medium">{t("admin.imagePresets")}</span>
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => setImageUrl(sample.url)}
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-purple-50 hover:text-primary text-[11px] font-semibold text-gray-600 transition-colors"
              >
                {sample.label}
              </button>
            ))}
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
            href="/admin/products"
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
