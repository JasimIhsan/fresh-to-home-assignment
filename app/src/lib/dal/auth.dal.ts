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
 * the auth server; deduped per request via React.cache. Name and role come
 * from `profiles`, which users cannot change the role of.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { user } = data;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    name: profile?.full_name || (user.email?.split("@")[0] ?? ""),
    role: profile?.role === "admin" ? "admin" : "customer",
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
