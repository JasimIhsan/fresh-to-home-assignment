"use client";

import {
  AdminProductFormFields,
  SampleImageOption,
} from "@/components/admin/AdminProductFormFields";
import { AdminProductFormSidebar } from "@/components/admin/AdminProductFormSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { deleteProduct, getProductById, saveProduct } from "@/lib/store";
import { Product } from "@/types";
import { AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const SAMPLE_IMAGES: SampleImageOption[] = [
  { label: "Rind / Steak", url: "/images/products/raw_beef_steak.jpg" },
  { label: "Geflügel", url: "/images/products/raw_chicken_breast.jpg" },
  { label: "Lamm", url: "/images/products/raw_lamb_chops.jpg" },
  { label: "Fisch / Lachs", url: "/images/products/raw_salmon_fillet.jpg" },
  { label: "Hackfleisch", url: "/images/products/raw_minced_beef.jpg" },
  { label: "Wurst", url: "/images/products/raw_sausages.jpg" },
  { label: "Feinkost", url: "/images/products/raw_prosciutto.jpg" },
];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

    if (nErr || pErr || sErr || oErr) return;

    setSaving(true);
    const updated: Product = {
      ...product,
      name: name.trim(),
      description: description.trim(),
      pricePerKg: parseFloat(pricePerKg) || product.pricePerKg,
      stockKg: parseFloat(stockKg) || 0,
      imageUrl: imageUrl || product.imageUrl,
      isAvailable,
      category,
      origin: origin.trim(),
    };

    saveProduct(updated);
    setTimeout(() => {
      setSaving(false);
      router.push("/admin/products");
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
      <div className="flex min-h-96 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-3xl border border-gray-100 bg-white p-12 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400" />
        <h2 className="text-xl font-bold text-gray-800">
          {t("catalog.noResults")}
        </h2>
        <Link
          href="/admin/products"
          className="bg-primary inline-block rounded-xl px-6 py-3 text-sm font-bold text-white"
        >
          {t("productDetail.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-2.5 text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {t("admin.editProduct")}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              ID: {product.id}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex cursor-pointer items-center space-x-2 self-start rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 sm:self-auto"
        >
          <Trash2 size={16} />
          <span>{t("admin.deleteProduct")}</span>
        </button>
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
          isEditMode={true}
        />
      </form>
    </div>
  );
}
