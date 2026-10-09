"use client";

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-0 pb-20 md:px-6 md:pb-8 lg:px-8">
        {children}
      </main>
      <MobileBottomNav />
      <CartDrawer />
    </div>
  );
}
