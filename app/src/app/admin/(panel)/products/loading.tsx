import { AdminProductsTableSkeleton } from "@/components/admin/AdminProductSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="h-16" />
      <AdminProductsTableSkeleton />
    </div>
  );
}
