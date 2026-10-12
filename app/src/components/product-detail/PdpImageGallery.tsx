"use client";

import { categoryLabel } from "@/components/catalog/categoryLabel";
import { useLanguage } from "@/context/LanguageContext";
import { isOptimizableImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ChevronLeft, ChevronRight, Expand, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PdpImageGalleryProps {
  readonly product: Readonly<Product>;
}

export function PdpImageGallery({ product }: PdpImageGalleryProps) {
  const { t } = useLanguage();
  const images: readonly string[] =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.imageUrl];

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
  const effectiveTranslateX = isAtBoundary
    ? `-${activeIndex * 100}%`
    : `calc(-${activeIndex * 100}% + ${dragOffset}px)`;

  // Calculate stretch scale factor (max ~1.25x)
  const horizontalStretch = isAtBoundary
    ? 1 + Math.min(Math.abs(dragOffset) / 250, 0.25)
    : 1;

  // For the track:
  // When at first image (activeIndex === 0) pulling left-to-right (dragOffset > 0): pinned at left (0%), stretches to right -> transformOrigin: "0% center"
  // When at last image (activeIndex === images.length - 1) pulling right-to-left (dragOffset < 0): pinned at right border (100%), stretches to left -> transformOrigin: "100% center"
  const stretchOrigin = isOverPullingFirst
    ? "0% center"
    : isOverPullingLast
      ? "100% center"
      : "center";

  return (
    <>
      {/* Hero Image */}
      <div
        className="group relative aspect-4/3 w-full touch-pan-y overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-sm select-none md:aspect-3/4 lg:aspect-square"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {/* Carousel Slider Track */}
        <div
          className={cn(
            "flex h-full w-full",
            isDragging
              ? "transition-none"
              : "transition-transform duration-300 ease-out"
          )}
          style={{
            transform: `translateX(${effectiveTranslateX})`,
          }}
        >
          {images.map((src, i) => {
            const isActive = i === activeIndex;
            const slideScaleX =
              isActive && isAtBoundary ? horizontalStretch : 1;
            const slideOrigin =
              isActive && isOverPullingFirst
                ? "left center"
                : isActive && isOverPullingLast
                  ? "right center"
                  : "center";

            return (
              <div
                key={i}
                className={cn(
                  "relative h-full w-full shrink-0",
                  isDragging
                    ? "transition-none"
                    : "transition-transform duration-300 ease-out"
                )}
                style={{
                  transform: `scaleX(${slideScaleX})`,
                  transformOrigin: slideOrigin,
                }}
              >
                <Image
                  src={src}
                  alt={`${product.name} – ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  priority={i === 0}
                  unoptimized={!isOptimizableImage(src)}
                  className="pointer-events-none object-cover select-none"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-white/50 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md">
          <Tag size={12} className="text-primary" />
          <span className="text-[11px] font-bold tracking-wider text-gray-700 uppercase">
            {categoryLabel(product.category, t)}
          </span>
        </div>

        {/* Out of Stock Badge (only shown when unavailable) */}
        {!product.isAvailable && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-gray-900/90 px-3 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase shadow-md backdrop-blur-sm">
            <span>{t("catalog.outOfStock")}</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {activeIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-150 group-hover:opacity-100 hover:bg-white active:scale-90"
                aria-label={t("productDetail.prevImage")}
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>
            )}
            {activeIndex < images.length - 1 && (
              <button
                onClick={goNext}
                className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-150 group-hover:opacity-100 hover:bg-white active:scale-90"
                aria-label={t("productDetail.nextImage")}
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
            )}
          </>
        )}

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute right-4 bottom-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-150 group-hover:opacity-100 hover:bg-white active:scale-90"
          aria-label={t("productDetail.zoomOpen")}
        >
          <Expand size={15} className="text-gray-700" />
        </button>

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                  i === activeIndex ? "bg-primary w-5" : "w-1.5 bg-white/70"
                )}
                aria-label={t("productDetail.selectImage").replace(
                  "{n}",
                  String(i + 1)
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Rail (Desktop) */}
      {images.length > 1 && (
        <div className="mt-3 hidden gap-2 md:flex">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200",
                i === activeIndex
                  ? "border-primary shadow-primary/20 scale-[1.05] shadow-md"
                  : "border-gray-200 opacity-70 hover:border-gray-300 hover:opacity-100"
              )}
              aria-label={t("productDetail.viewImage").replace(
                "{n}",
                String(i + 1)
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                unoptimized={!isOptimizableImage(src)}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("productDetail.zoomOpen")}
        >
          <button
            className="absolute top-5 right-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setIsZoomed(false)}
            aria-label={t("productDetail.zoomClose")}
          >
            ✕
          </button>
          <div
            className="relative h-full max-h-[90vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={product.name}
              fill
              sizes="100vw"
              unoptimized={!isOptimizableImage(images[activeIndex])}
              className="rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
