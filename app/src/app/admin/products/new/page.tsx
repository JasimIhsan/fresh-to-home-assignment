"use client";

import {
  AdminProductFormFields,
  SampleImageOption,
} from "@/components/admin/AdminProductFormFields";
import { AdminProductFormSidebar } from "@/components/admin/AdminProductFormSidebar";
import { useLanguage } from "@/context/LanguageContext";
import {
  hasErrors,
  productService,
  validateProductForm,
  type ProductFormInput,
} from "@/services";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SAMPLE_IMAGES: SampleImageOption[] = [
  { label: "Rind / Steak", url: "/images/products/raw_beef_steak.jpg" },
  { label: "Geflügel", url: "/images/products/raw_chicken_breast.jpg" },
  { label: "Lamm", url: "/images/products/raw_lamb_chops.jpg" },
  { label: "Fisch / Lachs", url: "/images/products/raw_salmon_fillet.jpg" },
  { label: "Hackfleisch", url: "/images/products/raw_minced_beef.jpg" },
  { label: "Wurst", url: "/images/products/raw_sausages.jpg" },
  { label: "Feinkost", url: "/images/products/raw_prosciutto.jpg" },
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

  const formInput: ProductFormInput = {
    name,
    category,
    pricePerKg,
    stockKg,
    isAvailable,
    origin,
    imageUrl,
    description,
  };
  const errors = validateProductForm(formInput);
  const fieldError = (field: keyof typeof touched) => {
    const key = errors[field];
    return touched[field] && key ? t(key) : "";
  };
  const nameError = fieldError("name");
  const priceError = fieldError("pricePerKg");
  const stockError = fieldError("stockKg");
  const originError = fieldError("origin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      pricePerKg: true,
      stockKg: true,
      origin: true,
    });

    if (hasErrors(errors)) return;

    setSaving(true);
    productService.create(formInput, SAMPLE_IMAGES[0].url);
    setTimeout(() => {
      setSaving(false);
      router.push("/admin/products");
    }, 500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/products"
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-2.5 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {t("admin.newProduct")}
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            {t("admin.newProductSubtitle")}
          </p>
        </div>
      </div>

      {/* Form Layout */}
      <form
        id="product-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <AdminProductFormFields
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
            pricePerKg={pricePerKg}
            setPricePerKg={setPricePerKg}
            stockKg={stockKg}
            setStockKg={setStockKg}
            origin={origin}
            setOrigin={setOrigin}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            description={description}
            setDescription={setDescription}
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
            nameError={nameError}
            priceError={priceError}
            stockError={stockError}
            originError={originError}
            touched={touched}
            setTouched={setTouched}
            sampleImages={SAMPLE_IMAGES}
          />
        </div>

        <AdminProductFormSidebar
          name={name}
          category={category}
          pricePerKg={pricePerKg}
          imageUrl={imageUrl}
          saving={saving}
          isEditMode={false}
        />
      </form>
    </div>
  );
}
