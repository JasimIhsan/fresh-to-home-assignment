import { supabaseEnv } from "@/lib/supabase/env";

const supabaseHost = supabaseEnv ? new URL(supabaseEnv.url).hostname : null;

/**
 * Whether next/image may optimize this src. Local assets and Supabase Storage
 * are allowed by `images.remotePatterns`; anything else (e.g. an arbitrary URL
 * typed into the admin form) must render with `unoptimized`.
 */
export function isOptimizableImage(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return supabaseHost !== null && new URL(src).hostname === supabaseHost;
  } catch {
    return false;
  }
}
