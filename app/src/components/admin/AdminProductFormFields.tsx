"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Sparkles } from "lucide-react";

export interface SampleImageOption {
  label: string;
  url: string;
}

export interface AdminProductFormFieldsProps {
  name: string;
  setName: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  pricePerKg: string;
  setPricePerKg: (val: string) => void;
  stockKg: string;
  setStockKg: (val: string) => void;
  origin: string;
  setOrigin: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  isAvailable: boolean;
  setIsAvailable: (val: boolean) => void;
  nameError: string;
  priceError: string;
  stockError: string;
  originError: string;
  touched: {
    name?: boolean;
    pricePerKg?: boolean;
    stockKg?: boolean;
    origin?: boolean;
  };
  setTouched: React.Dispatch<
    React.SetStateAction<{
      name?: boolean;
      pricePerKg?: boolean;
      stockKg?: boolean;
      origin?: boolean;
    }>
  >;
  sampleImages: SampleImageOption[];
}

export function AdminProductFormFields({
  name,
  setName,
  category,
  setCategory,
  pricePerKg,
  setPricePerKg,
  stockKg,
  setStockKg,
  origin,
  setOrigin,
  imageUrl,
  setImageUrl,
  description,
  setDescription,
  isAvailable,
  setIsAvailable,
  nameError,
  priceError,
  stockError,
  originError,
  touched,
  setTouched,
  sampleImages,
}: AdminProductFormFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="border-b border-gray-100 pb-3 text-lg font-bold text-gray-900">
          {t("admin.basicInfo")}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("admin.productName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!touched.name)
                  setTouched((prev) => ({ ...prev, name: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="z.B. Bio Rinderfilet Extra Zart"
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden ${
                nameError
                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                  : "focus:border-primary border-gray-200"
              }`}
              aria-invalid={!!nameError}
            />
            {nameError && (
              <p className="mt-1 ml-1 text-xs font-medium text-red-600">
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("admin.category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium transition-all focus:bg-white focus:outline-hidden"
            >
              <option value="Rind">Rind / Beef</option>
              <option value="Geflügel">Geflügel / Poultry</option>
              <option value="Lamm">Lamm / Lamb</option>
              <option value="Fisch">Fisch & Meeresfrüchte</option>
              <option value="Wurst & Spezialitäten">Wurst & Feinkost</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("admin.origin")}
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                if (!touched.origin)
                  setTouched((prev) => ({ ...prev, origin: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, origin: true }))}
              placeholder="z.B. Deutschland, Bayern"
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden ${
                originError
                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                  : "focus:border-primary border-gray-200"
              }`}
              aria-invalid={!!originError}
            />
            {originError && (
              <p className="mt-1 ml-1 text-xs font-medium text-red-600">
                {originError}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold tracking-wider text-gray-700 uppercase">
            {t("admin.description")}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Geben Sie eine detaillierte Beschreibung der Fleischqualität, Reifung und Zubereitungsempfehlung an..."
            className="focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Pricing and Stock */}
      <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="border-b border-gray-100 pb-3 text-lg font-bold text-gray-900">
          {t("admin.inventoryPricing")}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("admin.pricePerKg")} (€)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.10"
                min="0"
                value={pricePerKg}
                onChange={(e) => {
                  setPricePerKg(e.target.value);
                  if (!touched.pricePerKg)
                    setTouched((prev) => ({ ...prev, pricePerKg: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, pricePerKg: true }))
                }
                className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm font-semibold transition-all focus:bg-white focus:outline-hidden ${
                  priceError
                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                    : "focus:border-primary border-gray-200"
                }`}
                aria-invalid={!!priceError}
              />
              <span className="absolute top-3.5 right-4 text-xs font-bold text-gray-400">
                € / kg
              </span>
            </div>
            {priceError && (
              <p className="mt-1 ml-1 text-xs font-medium text-red-600">
                {priceError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("admin.stockKg")}
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="0"
                value={stockKg}
                onChange={(e) => {
                  setStockKg(e.target.value);
                  if (!touched.stockKg)
                    setTouched((prev) => ({ ...prev, stockKg: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, stockKg: true }))
                }
                className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm font-semibold transition-all focus:bg-white focus:outline-hidden ${
                  stockError
                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                    : "focus:border-primary border-gray-200"
                }`}
                aria-invalid={!!stockError}
              />
              <span className="absolute top-3.5 right-4 text-xs font-bold text-gray-400">
                kg
              </span>
            </div>
            {stockError && (
              <p className="mt-1 ml-1 text-xs font-medium text-red-600">
                {stockError}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="text-primary focus:ring-primary h-5 w-5 rounded-lg border-gray-300"
            />
            <div>
              <span className="block text-sm font-bold text-gray-900">
                {t("admin.activeOnStorefront")}
              </span>
              <span className="text-xs text-gray-400">
                {t("admin.activeOnStorefrontDesc")}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Image Asset Selection */}
      <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-gray-900">
            {t("admin.productImage")}
          </h2>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Sparkles size={13} className="text-primary" />{" "}
            {t("admin.demoPresets")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sampleImages.map((img) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setImageUrl(img.url)}
              className={`cursor-pointer overflow-hidden rounded-2xl border-2 p-2 text-left transition-all ${
                imageUrl === img.url
                  ? "border-primary bg-purple-50/50 shadow-xs"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className="mb-1.5 h-20 w-full rounded-xl object-cover"
              />
              <span className="block truncate text-xs font-bold text-gray-800">
                {img.label}
              </span>
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold tracking-wider text-gray-700 uppercase">
            {t("admin.customImageUrl")}
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/images/products/..."
            className="focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}
