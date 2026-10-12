const MAX_REDIRECT_LENGTH = 512;

/**
 * Returns `value` only when it is a same-origin path ("/foo"), rejecting
 * protocol-relative ("//evil.com") and backslash tricks; otherwise `fallback`.
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback: string
): string {
  if (!value || value.length > MAX_REDIRECT_LENGTH) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;
  return value;
}
