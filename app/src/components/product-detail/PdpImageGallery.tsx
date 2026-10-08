"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight, Expand, Tag } from "lucide-react";
import { useState } from "react";

interface PdpImageGalleryProps {
   product: Product;
}

export function PdpImageGallery({ product }: PdpImageGalleryProps) {
   const { t } = useLanguage();
   const images = (product.galleryImages?.length ?? 0) > 0 ? product.galleryImages! : [product.imageUrl];

   const [activeIndex, setActiveIndex] = useState(0);
   const [isZoomed, setIsZoomed] = useState(false);
   const [touchStartX, setTouchStartX] = useState<number | null>(null);
   const [dragOffset, setDragOffset] = useState<number>(0);
   const [isDragging, setIsDragging] = useState(false);

   const minSwipeDistance = 50;

   const goPrev = () => {
      if (activeIndex > 0) {
         setActiveIndex((i) => i - 1);
      }
   };

   const goNext = () => {
      if (activeIndex < images.length - 1) {
         setActiveIndex((i) => i + 1);
      }
   };

   const onTouchStart = (e: React.TouchEvent) => {
      setTouchStartX(e.targetTouches[0].clientX);
      setIsDragging(true);
   };

   const onTouchMove = (e: React.TouchEvent) => {
      if (touchStartX === null) return;
      const currentX = e.targetTouches[0].clientX;
      const diff = currentX - touchStartX;

      const isAtFirst = activeIndex === 0;
      const isAtLast = activeIndex === images.length - 1;

      // When dragging past edges (no previous/next image), apply rubber-band dampening resistance
      if ((isAtFirst && diff > 0) || (isAtLast && diff < 0)) {
         setDragOffset(diff * 0.25);
      } else {
         setDragOffset(diff);
      }
   };

   const onTouchEnd = () => {
      setIsDragging(false);
      if (images.length > 1) {
         if (dragOffset < -minSwipeDistance && activeIndex < images.length - 1) {
            goNext();
         } else if (dragOffset > minSwipeDistance && activeIndex > 0) {
            goPrev();
         }
      }
      setDragOffset(0);
      setTouchStartX(null);
   };

   // Boundary detection
   const isAtFirst = activeIndex === 0;
   const isAtLast = activeIndex === images.length - 1;
   const isOverPullingFirst = isAtFirst && dragOffset > 0;
   const isOverPullingLast = isAtLast && dragOffset < 0;
   const isAtBoundary = isOverPullingFirst || isOverPullingLast;

   // When at boundary, keep track pinned exactly at border (offset = 0) and stretch horizontally instead
   const effectiveTranslateX = isAtBoundary ? `-${activeIndex * 100}%` : `calc(-${activeIndex * 100}% + ${dragOffset}px)`;

   // Calculate stretch scale factor (max ~1.25x)
   const horizontalStretch = isAtBoundary ? 1 + Math.min(Math.abs(dragOffset) / 250, 0.25) : 1;

   // For the track:
   // When at first image (activeIndex === 0) pulling left-to-right (dragOffset > 0): pinned at left (0%), stretches to right -> transformOrigin: "0% center"
   // When at last image (activeIndex === images.length - 1) pulling right-to-left (dragOffset < 0): pinned at right border (100%), stretches to left -> transformOrigin: "100% center"
   const stretchOrigin = isOverPullingFirst ? "0% center" : isOverPullingLast ? "100% center" : "center";

   return (
      <>
         {/* Hero Image */}
         <div className="relative w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group select-none touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}>
            {/* Carousel Slider Track */}
            <div
               className={`flex w-full h-full ${isDragging ? "transition-none" : "transition-transform duration-300 ease-out"}`}
               style={{
                  transform: `translateX(${effectiveTranslateX})`,
               }}
            >
               {images.map((src, i) => {
                  const isActive = i === activeIndex;
                  const slideScaleX = isActive && isAtBoundary ? horizontalStretch : 1;
                  const slideOrigin = isActive && isOverPullingFirst ? "left center" : isActive && isOverPullingLast ? "right center" : "center";

                  return (
                     <div
                        key={i}
                        className={`w-full h-full flex-shrink-0 relative ${isDragging ? "transition-none" : "transition-transform duration-300 ease-out"}`}
                        style={{
                           transform: `scaleX(${slideScaleX})`,
                           transformOrigin: slideOrigin,
                        }}
                     >
                        <img src={src} alt={`${product.name} – ${i + 1}`} className="w-full h-full object-cover pointer-events-none select-none" draggable={false} />
                     </div>
                  );
               })}
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-white/50">
               <Tag size={12} className="text-primary" />
               <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">{t(`categories.${product.category}`) !== `categories.${product.category}` ? t(`categories.${product.category}`) : product.category}</span>
            </div>

            {/* Out of Stock Badge (only shown when unavailable) */}
            {!product.isAvailable && (
               <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md text-[11px] font-bold uppercase tracking-wider bg-gray-900/90 text-white backdrop-blur-sm">
                  <span>{t("catalog.outOfStock")}</span>
               </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
               <>
                  {activeIndex > 0 && (
                     <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-150 active:scale-90 cursor-pointer opacity-0 group-hover:opacity-100" aria-label={t("productDetail.prevImage")}>
                        <ChevronLeft size={18} className="text-gray-700" />
                     </button>
                  )}
                  {activeIndex < images.length - 1 && (
                     <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-150 active:scale-90 cursor-pointer opacity-0 group-hover:opacity-100" aria-label={t("productDetail.nextImage")}>
                        <ChevronRight size={18} className="text-gray-700" />
                     </button>
                  )}
               </>
            )}

            {/* Zoom Button */}
            <button onClick={() => setIsZoomed(true)} className="absolute bottom-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-150 active:scale-90 cursor-pointer opacity-0 group-hover:opacity-100" aria-label={t("productDetail.zoomOpen")}>
               <Expand size={15} className="text-gray-700" />
            </button>

            {/* Pagination Dots */}
            {images.length > 1 && (
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                     <button key={i} onClick={() => setActiveIndex(i)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex ? "w-5 bg-primary" : "w-1.5 bg-white/70"}`} aria-label={t("productDetail.selectImage").replace("{n}", String(i + 1))} />
                  ))}
               </div>
            )}
         </div>

         {/* Thumbnail Rail (Desktop) */}
         {images.length > 1 && (
            <div className="hidden md:flex gap-2 mt-3">
               {images.map((src, i) => (
                  <button
                     key={i}
                     onClick={() => setActiveIndex(i)}
                     className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${i === activeIndex ? "border-primary shadow-md shadow-primary/20 scale-[1.05]" : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"}`}
                     aria-label={t("productDetail.viewImage").replace("{n}", String(i + 1))}
                  >
                     <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
               ))}
            </div>
         )}

         {/* Fullscreen Modal */}
         {isZoomed && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)} role="dialog" aria-modal="true" aria-label={t("productDetail.zoomOpen")}>
               <button className="absolute top-5 right-5 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer" onClick={() => setIsZoomed(false)} aria-label={t("productDetail.zoomClose")}>
                  ✕
               </button>
               <img src={images[activeIndex]} alt={product.name} className="max-w-full max-h-full object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
         )}
      </>
   );
}
