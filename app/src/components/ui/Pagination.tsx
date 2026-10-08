"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
}: PaginationProps) => {
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
   const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
   const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

   return (
      <nav
         role="navigation"
         aria-label="Pagination Navigation"
         className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border ${className}`}
      >
         {/* Status Text / Info */}
         <div className="text-xs sm:text-sm text-muted-foreground font-medium order-2 sm:order-1">
            {showItemCount && startItem && endItem && totalItems ? (
               isDe ? (
                  <span>
                     Zeige <strong className="text-foreground font-bold">{startItem}–{endItem}</strong> von{" "}
                     <strong className="text-foreground font-bold">{totalItems}</strong> Einträgen
                  </span>
               ) : (
                  <span>
                     Showing <strong className="text-foreground font-bold">{startItem}–{endItem}</strong> of{" "}
                     <strong className="text-foreground font-bold">{totalItems}</strong> items
                  </span>
               )
            ) : isDe ? (
               <span>
                  Seite <strong className="text-foreground font-bold">{currentPage}</strong> von{" "}
                  <strong className="text-foreground font-bold">{totalPages}</strong>
               </span>
            ) : (
               <span>
                  Page <strong className="text-foreground font-bold">{currentPage}</strong> of{" "}
                  <strong className="text-foreground font-bold">{totalPages}</strong>
               </span>
            )}
         </div>

         {/* Navigation Controls */}
         <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
            {/* Quick jump to first page on multi-page lists */}
            {showFirstLast && totalPages > 4 && (
               <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 sm:p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer hidden md:flex items-center justify-center"
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
               className="flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl border border-border bg-card text-card-foreground text-xs sm:text-sm font-semibold hover:bg-accent hover:border-border/80 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs active:scale-95"
               aria-label="Previous page"
            >
               <ChevronLeft size={16} />
               <span className="hidden xs:inline">{prevLabel}</span>
            </button>

            {/* Numeric Page Buttons */}
            <div className="flex items-center gap-1">
               {pages.map((page, index) => {
                  if (page === "...") {
                     return (
                        <span
                           key={`ellipsis-${index}`}
                           className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-xs font-bold text-muted-foreground select-none"
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
                        className={`w-8 sm:w-9 h-8 sm:h-9 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                           isActive
                              ? "bg-primary text-white shadow-xs scale-105"
                              : "bg-card text-foreground hover:bg-accent hover:text-foreground border border-border/70"
                        }`}
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
               className="flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl border border-border bg-card text-card-foreground text-xs sm:text-sm font-semibold hover:bg-accent hover:border-border/80 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs active:scale-95"
               aria-label="Next page"
            >
               <span className="hidden xs:inline">{nextLabel}</span>
               <ChevronRight size={16} />
            </button>

            {/* Quick jump to last page on multi-page lists */}
            {showFirstLast && totalPages > 4 && (
               <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 sm:p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer hidden md:flex items-center justify-center"
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
