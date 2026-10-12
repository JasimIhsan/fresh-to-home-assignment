import type { ReactNode } from "react";
import { AdminShell } from "./(components)/AdminShell";

/**
 * Admin chrome. Access is enforced by the proxy (optimistic redirect) and
 * by `requireAdmin` in every admin DAL read and Server Action.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
