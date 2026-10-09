"use client";

import { AdminProductFormFields, SampleImageOption } from "@/components/admin/AdminProductFormFields";
import { AdminProductFormSidebar } from "@/components/admin/AdminProductFormSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { saveProduct } from "@/lib/store";
import { Product } from "@/types";
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

      if (nErr || pErr || sErr || oErr) return;

      setSaving(true);
      const newProduct: Product = {
         id: `prod_${Date.now()}`,
         name: name.trim(),
         description: description.trim() || "Frisches Qualitätsprodukt aus sorgfältig kontrollierter Aufzucht.",
         pricePerKg: parseFloat(pricePerKg) || 19.9,
         stockKg: parseFloat(stockKg) || 50,
         imageUrl: imageUrl || SAMPLE_IMAGES[0].url,
         isAvailable,
         category,
         origin: origin.trim() || "Deutschland",
      };

      saveProduct(newProduct);
      setTimeout(() => {
         setSaving(false);
         router.push("/admin/products");
      }, 500);
   };

   return (
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
         {/* Header */}
         <div className="flex items-center space-x-4">
            <Link
               href="/admin/products"
               className="p-2.5 bg-white hover:bg-gray-100 rounded-2xl border border-gray-100 text-gray-600 transition-colors cursor-pointer"
            >
               <ArrowLeft size={20} />
            </Link>
            <div>
               <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {t("admin.newProduct")}
               </h1>
               <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{t("admin.newProductSubtitle")}</p>
            </div>
         </div>

         {/* Form Layout */}
         <form id="product-form" onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
