import type { RawSearchParams } from "./(components)/catalog-url";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogSkeleton } from "./(components)/CatalogSkeleton";
import { CatalogView } from "./(components)/CatalogView";

export const metadata: Metadata = {
  title: "Sortiment | Frisch nach Hause",
};

interface CatalogPageProps {
  readonly searchParams: Promise<RawSearchParams>;
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <div className="bg-background text-foreground selection:bg-primary/20 flex min-h-screen flex-col pb-16 font-sans">
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
