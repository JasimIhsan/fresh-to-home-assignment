const TRANSLATED_AUTH_ERRORS: ReadonlySet<string> = new Set([
  "user_already_exists",
  "rate_limited",
  "invalid_otp",
  "weak_password",
  "invalid_email",
  "network_error",
  "signup_disabled",
]);

/** i18n key for an `AuthErrorCode` returned by an auth Server Action. */
export function authErrorKey(code: string): string {
  return TRANSLATED_AUTH_ERRORS.has(code)
    ? `authErrors.${code}`
    : "authErrors.unknown";
}
