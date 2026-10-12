import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseEnv } from "./env";

/**
 * Browser Supabase client. Sessions live in cookies (not localStorage) so
 * Server Components and Server Actions can read the same session.
 */
export const supabase: SupabaseClient<Database> | null = supabaseEnv
  ? createBrowserClient<Database>(supabaseEnv.url, supabaseEnv.key)
  : null;
