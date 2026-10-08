"use client";

import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
   return (
      <div className="min-h-screen bg-background flex flex-col relative">
         <Navbar />
         <main className="flex-1 w-full max-w-7xl mx-auto px-0 md:px-6 lg:px-8 pb-24 md:pb-8">{children}</main>
         <CartDrawer />
      </div>
   );
}
