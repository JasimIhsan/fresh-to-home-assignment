"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { buildCatalogHref, CATALOG_QUERY_MAX_LENGTH } from "./catalog-url";

const DEBOUNCE_MS = 300;

/**
 * Uncontrolled search input synced to the `q` URL param. Typing is debounced
 * and the navigation runs in a transition so the input never blocks.
 */
export function useCatalogSearch(query: string, category: string) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasValue, setHasValue] = useState(query.length > 0);
  const [isPending, startTransition] = useTransition();

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const navigate = (value: string) => {
    startTransition(() => {
      router.replace(buildCatalogHref({ query: value, category }), {
        scroll: false,
      });
    });
  };

  const onChange = (value: string) => {
    setHasValue(value.length > 0);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => navigate(value.slice(0, CATALOG_QUERY_MAX_LENGTH)),
      DEBOUNCE_MS
    );
  };

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (inputRef.current) inputRef.current.value = "";
    setHasValue(false);
    navigate("");
  };

  return {
    inputRef,
    hasValue,
    isPending,
    onChange,
    clear,
    maxLength: CATALOG_QUERY_MAX_LENGTH,
  };
}
