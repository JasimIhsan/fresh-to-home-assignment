import { cn } from "@/lib/utils";

function Block({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("animate-pulse rounded-3xl bg-gray-100", className)} />
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Block key={i} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Block className="h-80 lg:col-span-8" />
        <Block className="h-80 lg:col-span-4" />
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6 }: Readonly<{ rows?: number }>) {
  return (
    <div
      className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs"
      aria-busy="true"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}

export function AdminFilterSkeleton() {
  return <Block className="h-20" />;
}

export function AdminBadgeSkeleton() {
  return (
    <div className="h-9 w-32 animate-pulse self-start rounded-2xl bg-gray-100 sm:self-auto" />
  );
}

export function AdminOrderDetailSkeleton() {
  return (
    <div className="w-full space-y-6 pb-16" aria-busy="true">
      <Block className="h-14 w-72" />
      <Block className="h-28" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Block className="h-44" />
        <Block className="h-44" />
      </div>
      <Block className="h-64" />
    </div>
  );
}
