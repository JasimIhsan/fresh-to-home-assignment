import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { requireSupabaseEnv } from "./env";

/**
 * Request-scoped client acting as the signed-in user (RLS applies). Reads
 * cookies, so callers render dynamically and must sit behind <Suspense>.
 */
export async function createSessionClient(): Promise<SupabaseClient<Database>> {
  const { url, key } = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The proxy refreshes the session cookie instead.
        }
      },
    },
  });
}

let publicClient: SupabaseClient<Database> | null = null;

/**
 * Cookieless anonymous client for `'use cache'` scopes, which cannot read
 * cookies. RLS limits it to public storefront data.
 */
export function getPublicClient(): SupabaseClient<Database> {
  if (!publicClient) {
    const { url, key } = requireSupabaseEnv();
    publicClient = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return publicClient;
}
