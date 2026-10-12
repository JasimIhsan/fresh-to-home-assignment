"use client";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/product.actions";
import {
  AdminProductFormFields,
  type ProductFormTouched,
  type SampleImageOption,
} from "@/components/admin/AdminProductFormFields";
import { AdminProductFormSidebar } from "@/components/admin/AdminProductFormSidebar";
import { useLanguage } from "@/context/LanguageContext";
import {
  hasErrors,
  productService,
  validateProductForm,
  type ProductFormInput,
} from "@/services";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const SAMPLE_IMAGES: readonly SampleImageOption[] = [
  { label: "Rind / Steak", url: "/images/products/raw_beef_steak.jpg" },
  { label: "Geflügel", url: "/images/products/raw_chicken_breast.jpg" },
  { label: "Lamm", url: "/images/products/raw_lamb_chops.jpg" },
  { label: "Fisch / Lachs", url: "/images/products/raw_salmon_fillet.jpg" },
  { label: "Hackfleisch", url: "/images/products/raw_minced_beef.jpg" },
  { label: "Wurst", url: "/images/products/raw_sausages.jpg" },
  { label: "Feinkost", url: "/images/products/raw_prosciutto.jpg" },
];

const NEW_PRODUCT_DEFAULTS: Readonly<ProductFormInput> = {
  name: "",
  category: "Rind",
  pricePerKg: "24.90",
  stockKg: "50",
  isAvailable: true,
  origin: "Deutschland",
  imageUrl: SAMPLE_IMAGES[0].url,
  description: "",
};

const ALL_TOUCHED: ProductFormTouched = {
  name: true,
  pricePerKg: true,
  stockKg: true,
  origin: true,
};

type AdminProductFormProps =
  | { readonly mode: "create" }
  | {
      readonly mode: "edit";
      readonly productId: string;
      readonly initialValues: Readonly<ProductFormInput>;
    };

/** Create/edit product form; persists through Server Actions. */
export function AdminProductForm(props: AdminProductFormProps) {
  const isEditMode = props.mode === "edit";
  const initialValues =
    props.mode === "edit" ? props.initialValues : NEW_PRODUCT_DEFAULTS;
  const { t } = useLanguage();
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [values, setValues] = useState<ProductFormInput>({ ...initialValues });
  const [touched, setTouched] = useState<ProductFormTouched>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField =
    <K extends keyof ProductFormInput>(key: K) =>
    (value: ProductFormInput[K]) =>
      setValues((prev) => ({ ...prev, [key]: value }));

  const errors = validateProductForm(values);
  const fieldError = (field: keyof ProductFormTouched) => {
    const key = errors[field];
    return touched[field] && key ? t(key) : "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(ALL_TOUCHED);
    if (hasErrors(errors)) return;

    setSubmitError(null);
    const payload = productService.toInput(values);
    startSaving(async () => {
      const result = isEditMode
        ? await updateProduct(props.productId, payload)
        : await createProduct(payload);
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }
      router.push(`/admin/products/${result.data.id}`);
    });
  };

  const handleDelete = () => {
    if (!isEditMode || !confirm(t("admin.deleteConfirm"))) return;
    setSubmitError(null);
    startDeleting(async () => {
      const result = await deleteProduct(props.productId);
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }
      router.push("/admin/products");
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-4">
          <Link
            href={
              isEditMode
                ? `/admin/products/${props.productId}`
                : "/admin/products"
            }
            className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-2.5 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label={t("productDetail.back")}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {isEditMode ? t("admin.editProduct") : t("admin.newProduct")}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              {isEditMode
                ? `ID: ${props.productId}`
                : t("admin.newProductSubtitle")}
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            className="inline-flex cursor-pointer items-center space-x-2 self-start rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 sm:self-auto"
          >
            <Trash2 size={16} />
            <span>{t("admin.deleteProduct")}</span>
          </button>
        )}
      </div>

      {submitError && (
        <p
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {submitError}
        </p>
      )}

      {/* Form Layout */}
      <form
        id="product-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <AdminProductFormFields
            name={values.name}
            setName={setField("name")}
            category={values.category}
            setCategory={setField("category")}
            pricePerKg={values.pricePerKg}
            setPricePerKg={setField("pricePerKg")}
            stockKg={values.stockKg}
            setStockKg={setField("stockKg")}
            origin={values.origin}
            setOrigin={setField("origin")}
            imageUrl={values.imageUrl}
            setImageUrl={setField("imageUrl")}
            description={values.description}
            setDescription={setField("description")}
            isAvailable={values.isAvailable}
            setIsAvailable={setField("isAvailable")}
            nameError={fieldError("name")}
            priceError={fieldError("pricePerKg")}
            stockError={fieldError("stockKg")}
            originError={fieldError("origin")}
            touched={touched}
            setTouched={setTouched}
            sampleImages={SAMPLE_IMAGES}
          />
        </div>

        <AdminProductFormSidebar
          name={values.name}
          category={values.category}
          pricePerKg={values.pricePerKg}
          imageUrl={values.imageUrl}
          saving={isSaving}
          isEditMode={isEditMode}
        />
      </form>
    </div>
  );
}
