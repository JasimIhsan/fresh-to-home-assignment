"use client";

import {
  buildCatalogHref,
  type CatalogParams,
} from "@/components/catalog/catalog-url";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface CatalogPagerProps {
  readonly params: CatalogParams;
  readonly totalPages: number;
}

export function CatalogPager({ params, totalPages }: CatalogPagerProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <Pagination
      currentPage={params.page}
      totalPages={totalPages}
      onPageChange={(page) =>
        startTransition(() =>
          router.push(buildCatalogHref({ ...params, page }))
        )
      }
    />
  );
}
