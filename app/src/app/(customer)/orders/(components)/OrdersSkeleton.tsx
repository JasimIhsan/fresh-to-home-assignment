export function OrdersSkeleton() {
  return (
    <div className="bg-background min-h-screen pb-20" aria-busy="true">
      <div className="bg-primary h-32 rounded-b-3xl md:h-36 md:rounded-none md:bg-transparent" />
      <div className="mx-auto mt-2 grid max-w-6xl grid-cols-1 gap-4 p-4 sm:p-6 md:mt-4 md:grid-cols-2 md:gap-6 md:p-8 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-3xl border border-gray-100 bg-white shadow-xs"
          />
        ))}
      </div>
    </div>
  );
}
