"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthGuard guestOnly>{children}</AuthGuard>;
}
