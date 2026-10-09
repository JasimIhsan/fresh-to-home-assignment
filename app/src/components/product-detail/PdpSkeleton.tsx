"use client";

/**
 * Skeleton loading state for the Product Detail Page.
 * Prevents layout shift and communicates progress (reduces frustration).
 */
export function PdpSkeleton() {
   return (
      <div className="w-full animate-pulse" aria-busy="true" aria-label="Loading product">
         {/* Mobile header skeleton */}
         <div className="md:hidden bg-white/80 border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
            <div className="flex items-center justify-between">
               <div className="w-11 h-11 bg-gray-100 rounded-2xl" />
               <div className="flex-1 mx-3 space-y-1.5">
                  <div className="h-2.5 bg-gray-100 rounded-full w-16 mx-auto" />
                  <div className="h-3.5 bg-gray-200 rounded-full w-36 mx-auto" />
               </div>
               <div className="w-11 h-11 bg-gray-100 rounded-2xl" />
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
            {/* Breadcrumb skeleton */}
            <div className="hidden md:flex items-center gap-2 mb-8">
               <div className="h-3 bg-gray-100 rounded-full w-16" />
               <div className="h-3 bg-gray-100 rounded-full w-3" />
               <div className="h-3 bg-gray-100 rounded-full w-24" />
               <div className="h-3 bg-gray-100 rounded-full w-3" />
               <div className="h-3 bg-gray-200 rounded-full w-32" />
            </div>

            <div className="md:grid md:grid-cols-[60%_40%] md:gap-12 lg:gap-16">
               {/* Left – Image skeleton */}
               <div className="space-y-3">
                  <div className="w-full aspect-4/3 md:aspect-3/4 lg:aspect-square bg-gray-100 rounded-3xl" />
                  <div className="hidden md:flex gap-2">
                     {[1, 2].map((i) => (
                        <div key={i} className="w-16 h-16 bg-gray-100 rounded-xl" />
                     ))}
                  </div>
               </div>

               {/* Right – Info skeleton */}
               <div className="mt-6 md:mt-0 space-y-5">
                  {/* Tags */}
                  <div className="flex gap-1.5">
                     <div className="h-6 bg-gray-100 rounded-full w-16" />
                     <div className="h-6 bg-gray-100 rounded-full w-20" />
                  </div>

                  {/* Title + Rating */}
                  <div className="space-y-2">
                     <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
                     <div className="h-8 bg-gray-200 rounded-xl w-1/2" />
                     <div className="flex items-center gap-2 mt-2">
                        <div className="h-4 bg-gray-100 rounded-full w-20" />
                        <div className="h-4 bg-gray-100 rounded-full w-24" />
                     </div>
                  </div>

                  {/* Price */}
                  <div className="h-10 bg-gray-200 rounded-xl w-28" />

                  {/* Description */}
                  <div className="space-y-2">
                     <div className="h-3.5 bg-gray-100 rounded-full w-full" />
                     <div className="h-3.5 bg-gray-100 rounded-full w-5/6" />
                     <div className="h-3.5 bg-gray-100 rounded-full w-4/6" />
                  </div>

                  {/* Badges grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
                     ))}
                  </div>

                  {/* Weight selector */}
                  <div className="h-52 bg-gray-100 rounded-3xl" />

                  {/* CTA */}
                  <div className="space-y-3">
                     <div className="h-14 bg-gray-200 rounded-2xl" />
                     <div className="h-11 bg-gray-100 rounded-2xl" />
                  </div>

                  {/* Trust bar */}
                  <div className="grid grid-cols-4 gap-2">
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
