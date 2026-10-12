"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export interface SampleImageOption {
  readonly label: string;
  readonly url: string;
}

export interface ProductFormTouched {
  name?: boolean;
  pricePerKg?: boolean;
  stockKg?: boolean;
  origin?: boolean;
}

const CATEGORY_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "Rind", label: "Rind / Beef" },
  { value: "Geflügel", label: "Geflügel / Poultry" },
  { value: "Lamm", label: "Lamm / Lamb" },
  { value: "Fisch", label: "Fisch & Meeresfrüchte" },
  { value: "Feinkost", label: "Wurst & Feinkost" },
];

const INPUT_BASE =
  "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-hidden";
const INPUT_OK = "focus:border-primary border-gray-200";
const INPUT_ERROR = "border-red-400 bg-red-50/20 focus:border-red-500";

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
  touched: ProductFormTouched;
  setTouched: React.Dispatch<React.SetStateAction<ProductFormTouched>>;
  sampleImages: readonly SampleImageOption[];
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
              maxLength={120}
              className={cn(INPUT_BASE, nameError ? INPUT_ERROR : INPUT_OK)}
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
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              {/* Keep a legacy category selectable instead of silently resetting it */}
              {category &&
                !CATEGORY_OPTIONS.some((opt) => opt.value === category) && (
                  <option value={category}>{category}</option>
                )}
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
              maxLength={120}
              className={cn(INPUT_BASE, originError ? INPUT_ERROR : INPUT_OK)}
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
            maxLength={2000}
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
                max="10000"
                value={pricePerKg}
                onChange={(e) => {
                  setPricePerKg(e.target.value);
                  if (!touched.pricePerKg)
                    setTouched((prev) => ({ ...prev, pricePerKg: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, pricePerKg: true }))
                }
                className={cn(
                  INPUT_BASE,
                  "font-semibold",
                  priceError ? INPUT_ERROR : INPUT_OK
                )}
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
                max="100000"
                value={stockKg}
                onChange={(e) => {
                  setStockKg(e.target.value);
                  if (!touched.stockKg)
                    setTouched((prev) => ({ ...prev, stockKg: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, stockKg: true }))
                }
                className={cn(
                  INPUT_BASE,
                  "font-semibold",
                  stockError ? INPUT_ERROR : INPUT_OK
                )}
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
              aria-pressed={imageUrl === img.url}
              className={cn(
                "cursor-pointer overflow-hidden rounded-2xl border-2 p-2 text-left transition-all",
                imageUrl === img.url
                  ? "border-primary bg-purple-50/50 shadow-xs"
                  : "border-gray-100 hover:border-gray-200"
              )}
            >
              <Image
                src={img.url}
                alt={img.label}
                width={160}
                height={80}
                sizes="(min-width: 640px) 160px, 45vw"
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
            maxLength={500}
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
