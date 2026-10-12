import { PdpAccordion } from "@/components/product-detail/PdpAccordion";
import { PdpBreadcrumb } from "@/components/product-detail/PdpBreadcrumb";
import { PdpFreshnessPromise } from "@/components/product-detail/PdpFreshnessPromise";
import { PdpHeader } from "@/components/product-detail/PdpHeader";
import { PdpImageGallery } from "@/components/product-detail/PdpImageGallery";
import { PdpProductInfo } from "@/components/product-detail/PdpProductInfo";
import {
  PdpAddToCartSlot,
  PdpPurchaseProvider,
  PdpStickyBarSlot,
  PdpWeightSelectorSlot,
} from "@/components/product-detail/PdpPurchaseContext";
import { PdpRelatedProducts } from "@/components/product-detail/PdpRelatedProducts";
import { PdpReviews } from "@/components/product-detail/PdpReviews";
import { PdpTrustBar } from "@/components/product-detail/PdpTrustBar";
import {
  getRelatedProducts,
  getStorefrontProduct,
  getStorefrontProductIds,
} from "@/lib/dal/product.dal";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

/** Prerenders every storefront product; new products render on first visit. */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const ids = await getStorefrontProductIds();
  // Cache Components requires at least one param to validate the route.
  return ids.length > 0 ? ids.map((id) => ({ id })) : [{ id: "__none__" }];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product) return {};
  return {
    title: `${product.name} | Frisch nach Hause`,
    description: product.description,
    openGraph: { images: product.imageUrl ? [product.imageUrl] : [] },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.category);

  return (
    <PdpPurchaseProvider product={product}>
      <div className="w-full bg-[#fafafa]">
        {/* Mobile sticky header */}
        <PdpHeader productName={product.name} category={product.category} />

        <main className="mx-auto max-w-7xl px-4 pt-5 pb-32 sm:px-6 md:pt-10 md:pb-12">
          <PdpBreadcrumb
            category={product.category}
            productName={product.name}
          />

          {/* Mobile: single column. Desktop: 58% gallery + 42% info rail. */}
          <div className="items-start md:grid md:grid-cols-[58%_42%] md:gap-10 lg:gap-14">
            <div className="md:sticky md:top-6">
              <PdpImageGallery product={product} />
              <div className="mt-4 hidden md:block">
                <PdpFreshnessPromise />
              </div>
            </div>

            <div className="mt-5 space-y-5 md:mt-0">
              <PdpProductInfo product={product} />
              <PdpWeightSelectorSlot />

              {/* Desktop CTA; mobile uses the sticky bar */}
              <div className="hidden md:block">
                <PdpAddToCartSlot />
              </div>

              <PdpTrustBar />
              <PdpAccordion product={product} />

              <div className="md:hidden">
                <PdpFreshnessPromise />
              </div>
              <div className="md:hidden">
                <PdpAddToCartSlot />
              </div>

              <PdpReviews />
              <PdpRelatedProducts products={related} />
            </div>
          </div>
        </main>

        {/* Mobile sticky bottom bar (thumb zone) */}
        <PdpStickyBarSlot />
      </div>
    </PdpPurchaseProvider>
  );
}
