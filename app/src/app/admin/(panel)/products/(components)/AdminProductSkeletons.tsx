import { cn } from "@/lib/utils";

/** Static loading placeholders for the admin product routes (no client JS). */

function Bar({ className }: { readonly className: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200/70", className)}
    />
  );
}

export function AdminProductsTableSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-xs sm:flex-row sm:p-5">
        <Bar className="h-10 w-full sm:w-80" />
        <div className="flex w-full gap-2 sm:w-auto">
          {Array.from({ length: 4 }, (_, i) => (
            <Bar key={i} className="h-7 w-16" />
          ))}
        </div>
      </div>
      <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Bar className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Bar className="h-4 w-1/3" />
              <Bar className="h-3 w-1/2" />
            </div>
            <Bar className="hidden h-4 w-16 sm:block" />
            <Bar className="hidden h-6 w-20 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12" aria-busy="true">
      <div className="flex items-center gap-3">
        <Bar className="h-10 w-10 rounded-2xl" />
        <div className="space-y-2">
          <Bar className="h-3 w-48" />
          <Bar className="h-7 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Bar className="h-80 w-full rounded-3xl" />
          <Bar className="h-64 w-full rounded-3xl" />
        </div>
        <div className="space-y-6">
          <Bar className="h-56 w-full rounded-3xl" />
          <Bar className="h-48 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export function AdminProductFormSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16" aria-busy="true">
      <div className="flex items-center gap-4">
        <Bar className="h-10 w-10 rounded-2xl" />
        <Bar className="h-8 w-56" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Bar className="h-72 w-full rounded-3xl" />
          <Bar className="h-48 w-full rounded-3xl" />
        </div>
        <Bar className="h-96 w-full rounded-3xl" />
      </div>
    </div>
  );
}
