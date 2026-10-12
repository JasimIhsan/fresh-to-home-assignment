/**
 * Skeleton loading state for the Product Detail Page.
 * Prevents layout shift and communicates progress (reduces frustration).
 */
export function PdpSkeleton() {
  return (
    <div
      className="w-full animate-pulse"
      aria-busy="true"
      aria-label="Loading product"
    >
      {/* Mobile header skeleton */}
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="h-11 w-11 rounded-2xl bg-gray-100" />
          <div className="mx-3 flex-1 space-y-1.5">
            <div className="mx-auto h-2.5 w-16 rounded-full bg-gray-100" />
            <div className="mx-auto h-3.5 w-36 rounded-full bg-gray-200" />
          </div>
          <div className="h-11 w-11 rounded-2xl bg-gray-100" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 hidden items-center gap-2 md:flex">
          <div className="h-3 w-16 rounded-full bg-gray-100" />
          <div className="h-3 w-3 rounded-full bg-gray-100" />
          <div className="h-3 w-24 rounded-full bg-gray-100" />
          <div className="h-3 w-3 rounded-full bg-gray-100" />
          <div className="h-3 w-32 rounded-full bg-gray-200" />
        </div>

        <div className="md:grid md:grid-cols-[60%_40%] md:gap-12 lg:gap-16">
          {/* Left – Image skeleton */}
          <div className="space-y-3">
            <div className="aspect-4/3 w-full rounded-3xl bg-gray-100 md:aspect-3/4 lg:aspect-square" />
            <div className="hidden gap-2 md:flex">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 w-16 rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>

          {/* Right – Info skeleton */}
          <div className="mt-6 space-y-5 md:mt-0">
            {/* Tags */}
            <div className="flex gap-1.5">
              <div className="h-6 w-16 rounded-full bg-gray-100" />
              <div className="h-6 w-20 rounded-full bg-gray-100" />
            </div>

            {/* Title + Rating */}
            <div className="space-y-2">
              <div className="h-8 w-3/4 rounded-xl bg-gray-200" />
              <div className="h-8 w-1/2 rounded-xl bg-gray-200" />
              <div className="mt-2 flex items-center gap-2">
                <div className="h-4 w-20 rounded-full bg-gray-100" />
                <div className="h-4 w-24 rounded-full bg-gray-100" />
              </div>
            </div>

            {/* Price */}
            <div className="h-10 w-28 rounded-xl bg-gray-200" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-full bg-gray-100" />
              <div className="h-3.5 w-5/6 rounded-full bg-gray-100" />
              <div className="h-3.5 w-4/6 rounded-full bg-gray-100" />
            </div>

            {/* Badges grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-gray-100" />
              ))}
            </div>

            {/* Weight selector */}
            <div className="h-52 rounded-3xl bg-gray-100" />

            {/* CTA */}
            <div className="space-y-3">
              <div className="h-14 rounded-2xl bg-gray-200" />
              <div className="h-11 rounded-2xl bg-gray-100" />
            </div>

            {/* Trust bar */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
