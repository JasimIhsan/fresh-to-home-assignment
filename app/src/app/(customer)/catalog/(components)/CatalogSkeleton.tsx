const CARD_COUNT = 6;

/** Fallback while search params resolve; mirrors the catalog layout. */
export function CatalogSkeleton() {
  return (
    <div aria-busy="true" className="animate-pulse">
      <div className="bg-primary h-44 rounded-b-3xl md:hidden" />
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="hidden justify-between gap-6 md:flex">
          <div className="space-y-3">
            <div className="h-9 w-48 rounded-xl bg-gray-200" />
            <div className="h-4 w-72 rounded-full bg-gray-100" />
          </div>
          <div className="h-10 w-80 rounded-xl bg-gray-100" />
        </div>
        <div className="hidden gap-2 md:flex">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: CARD_COUNT }, (_, i) => (
            <div key={i} className="border-border rounded-2xl border p-3">
              <div className="mb-3 aspect-4/3 rounded-xl bg-gray-100" />
              <div className="space-y-2 px-1">
                <div className="h-4 w-3/4 rounded-full bg-gray-200" />
                <div className="h-3 w-full rounded-full bg-gray-100" />
                <div className="h-10 w-full rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
