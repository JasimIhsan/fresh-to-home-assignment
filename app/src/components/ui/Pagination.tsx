"use client";

import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  showItemCount?: boolean;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showFirstLast = true,
  showItemCount = false,
  totalItems,
  pageSize,
}: Readonly<PaginationProps>) => {
  const { language } = useLanguage();

  if (totalPages <= 1) return null;

  // Generate visible page numbers with intelligent truncation
  const getPageNumbers = () => {
    const delta = 1; // Number of pages adjacent to current page
    const range: (number | "...")[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  const isDe = language === "de";
  const prevLabel = isDe ? "Zurück" : "Previous";
  const nextLabel = isDe ? "Weiter" : "Next";

  // Calculate item count range if provided
  const startItem =
    totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem =
    totalItems && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        "border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row",
        className
      )}
    >
      {/* Status Text / Info */}
      <div className="text-muted-foreground order-2 text-xs font-medium sm:order-1 sm:text-sm">
        {showItemCount && startItem && endItem && totalItems ? (
          isDe ? (
            <span>
              Zeige{" "}
              <strong className="text-foreground font-bold">
                {startItem}–{endItem}
              </strong>{" "}
              von{" "}
              <strong className="text-foreground font-bold">
                {totalItems}
              </strong>{" "}
              Einträgen
            </span>
          ) : (
            <span>
              Showing{" "}
              <strong className="text-foreground font-bold">
                {startItem}–{endItem}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground font-bold">
                {totalItems}
              </strong>{" "}
              items
            </span>
          )
        ) : isDe ? (
          <span>
            Seite{" "}
            <strong className="text-foreground font-bold">{currentPage}</strong>{" "}
            von{" "}
            <strong className="text-foreground font-bold">{totalPages}</strong>
          </span>
        ) : (
          <span>
            Page{" "}
            <strong className="text-foreground font-bold">{currentPage}</strong>{" "}
            of{" "}
            <strong className="text-foreground font-bold">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="order-1 flex items-center gap-1.5 sm:order-2 sm:gap-2">
        {/* Quick jump to first page on multi-page lists */}
        {showFirstLast && totalPages > 4 && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent hidden cursor-pointer items-center justify-center rounded-xl border p-2 transition-all disabled:pointer-events-none disabled:opacity-30 sm:p-2.5 md:flex"
            title={isDe ? "Erste Seite" : "First Page"}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
        )}

        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="border-border bg-card text-card-foreground hover:bg-accent hover:border-border/80 flex cursor-pointer items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-35 sm:px-3.5 sm:text-sm"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span className="xs:inline hidden">{prevLabel}</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-muted-foreground flex h-8 w-8 items-center justify-center text-xs font-bold select-none sm:h-9 sm:w-9"
                >
                  •••
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-xs font-bold transition-all sm:h-9 sm:w-9 sm:text-sm",
                  isActive
                    ? "bg-primary scale-105 text-white shadow-xs"
                    : "bg-card text-foreground hover:bg-accent hover:text-foreground border-border/70 border"
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="border-border bg-card text-card-foreground hover:bg-accent hover:border-border/80 flex cursor-pointer items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-35 sm:px-3.5 sm:text-sm"
          aria-label="Next page"
        >
          <span className="xs:inline hidden">{nextLabel}</span>
          <ChevronRight size={16} />
        </button>

        {/* Quick jump to last page on multi-page lists */}
        {showFirstLast && totalPages > 4 && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent hidden cursor-pointer items-center justify-center rounded-xl border p-2 transition-all disabled:pointer-events-none disabled:opacity-30 sm:p-2.5 md:flex"
            title={isDe ? "Letzte Seite" : "Last Page"}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        )}
      </div>
    </nav>
  );
};
