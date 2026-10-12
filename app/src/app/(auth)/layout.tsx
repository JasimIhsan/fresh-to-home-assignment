import type { ReactNode } from "react";

// Guest-only access is enforced by the proxy (src/proxy.ts), which
// redirects signed-in users away before these routes render.
export default function AuthLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return children;
}
