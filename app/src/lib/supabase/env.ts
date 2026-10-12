const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Supabase project credentials, or null when the env is not configured. */
export const supabaseEnv: {
  readonly url: string;
  readonly key: string;
} | null = url && publishableKey ? { url, key: publishableKey } : null;

export function requireSupabaseEnv(): {
  readonly url: string;
  readonly key: string;
} {
  if (!supabaseEnv) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }
  return supabaseEnv;
}
