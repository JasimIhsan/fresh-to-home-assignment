import "server-only";

import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export interface SessionUser {
  readonly id: string;
  readonly email: string | null;
  readonly name: string;
  readonly role: "customer" | "admin";
}

/**
 * The verified current user, or null. `getUser()` validates the token with
 * the auth server; deduped per request via React.cache.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { user } = data;
  const metaName: unknown = user.user_metadata?.name;
  return {
    id: user.id,
    email: user.email ?? null,
    name:
      typeof metaName === "string" && metaName
        ? metaName
        : (user.email?.split("@")[0] ?? ""),
    // app_metadata is only writable with the service role, so it is trusted.
    role: user.app_metadata?.role === "admin" ? "admin" : "customer",
  };
});

export async function requireUser(
  redirectTo = "/catalog"
): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  return user;
}

export async function requireAdmin(
  redirectTo = "/admin"
): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    redirect(`/admin/login?redirect=${encodeURIComponent(redirectTo)}`);
  }
  return user;
}
