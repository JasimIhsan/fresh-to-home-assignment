import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { Suspense, type ReactNode } from "react";

export default function CustomerLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-0 pb-20 md:px-6 md:pb-8 lg:px-8">
        {children}
      </main>
      {/* Reads the pathname (hidden on product pages), so it streams in. */}
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
      <CartDrawer />
    </div>
  );
}
