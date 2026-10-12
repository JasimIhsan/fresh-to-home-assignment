"use client";

import { useLanguage } from "@/context/LanguageContext";

export function CatalogHeading() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-foreground text-3xl font-extrabold tracking-tight md:text-4xl">
        {t("catalog.products")}
      </h1>
      <p className="text-muted-foreground mt-2 font-medium">
        {t("catalog.heroSubtitle")}
      </p>
    </div>
  );
}
