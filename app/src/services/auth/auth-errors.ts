import {
  isAuthError,
  isAuthRetryableFetchError,
  isAuthWeakPasswordError,
} from "@supabase/supabase-js";
import type { AuthErrorCode, AuthErrorResponse } from "./auth.types";

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed:
    "Please confirm your email address before signing in. Check your inbox for the confirmation link.",
  user_already_exists:
    "An account with this email already exists. Try signing in instead.",
  rate_limited: "Too many attempts. Please wait a moment and try again.",
  email_limit:
    "We can't send emails right now because of high demand. Please try again later.",
  resend_cooldown:
    "We just sent a code to this email. Please wait a minute before requesting another.",
  weak_password:
    "Your password is too weak. Use at least 8 characters with a mix of letters, numbers and symbols.",
  invalid_email: "Please enter a valid email address.",
  invalid_otp: "This code is invalid or has expired. Request a new one.",
  validation_failed: "Some of the details you entered are invalid.",
  signup_disabled: "New sign ups are currently disabled.",
  network_error:
    "Unable to connect. Please check your internet connection and try again.",
  timeout: "The request timed out. Please try again.",
  service_unavailable:
    "Our authentication service is temporarily unavailable. Please try again shortly.",
  not_configured: "Authentication is not configured.",
  unknown: "Something went wrong. Please try again.",
};

export function buildAuthError(
  code: AuthErrorCode,
  extra: Partial<Omit<AuthErrorResponse, "code" | "message">> = {}
): AuthErrorResponse {
  return { code, message: AUTH_ERROR_MESSAGES[code], ...extra };
}

/**
 * Maps any thrown/returned value from Supabase auth (or fetch) to a safe,
 * user-friendly `AuthErrorResponse`. Raw server messages are never forwarded.
 */
export function normalizeAuthError(err: unknown): AuthErrorResponse {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return buildAuthError("network_error");
  }

  if (isAuthWeakPasswordError(err)) {
    return buildAuthError("weak_password", {
      status: err.status,
      field: "password",
      reasons: [...err.reasons],
    });
  }

  // Thrown by auth-js when fetch fails outright (status 0) or the gateway
  // returns 502/503/504
  if (isAuthRetryableFetchError(err)) {
    return err.status && err.status >= 500
      ? buildAuthError("service_unavailable", { status: err.status })
      : buildAuthError("network_error");
  }

  if (isAuthError(err)) {
    const status = err.status;
    const message = (err.message || "").toLowerCase();

    switch (err.code) {
      case "invalid_credentials":
      case "invalid_grant":
      case "user_not_found":
        return buildAuthError("invalid_credentials", { status });
      case "email_not_confirmed":
        return buildAuthError("email_not_confirmed", {
          status,
          field: "email",
        });
      case "user_already_exists":
      case "email_exists":
      case "identity_already_exists":
        return buildAuthError("user_already_exists", {
          status,
          field: "email",
        });
      case "over_email_send_rate_limit":
        // One code covers two limits: the per-address resend window
        // ("…only request this after 42 seconds") and the project-wide
        // hourly email quota ("email rate limit exceeded").
        return /after \d+ seconds?/.test(message)
          ? buildAuthError("resend_cooldown", { status, field: "email" })
          : buildAuthError("email_limit", { status });
      case "over_request_rate_limit":
      case "over_sms_send_rate_limit":
        return buildAuthError("rate_limited", { status });
      case "weak_password":
        return buildAuthError("weak_password", { status, field: "password" });
      case "otp_expired":
        return buildAuthError("invalid_otp", { status });
      case "email_address_invalid":
      case "email_address_not_authorized":
        return buildAuthError("invalid_email", { status, field: "email" });
      case "validation_failed":
        return message.includes("email")
          ? buildAuthError("invalid_email", { status, field: "email" })
          : message.includes("password")
            ? buildAuthError("validation_failed", { status, field: "password" })
            : buildAuthError("validation_failed", { status });
      case "signup_disabled":
      case "email_provider_disabled":
        return buildAuthError("signup_disabled", { status });
      case "request_timeout":
      case "hook_timeout":
      case "hook_timeout_after_retry":
        return buildAuthError("timeout", { status });
      case "unexpected_failure":
        return buildAuthError("service_unavailable", { status });
    }

    // Older GoTrue versions omit `code`; fall back to status/message
    if (status === 429) return buildAuthError("rate_limited", { status });
    if (status === 408 || status === 504) {
      return buildAuthError("timeout", { status });
    }
    if (status && status >= 500) {
      return buildAuthError("service_unavailable", { status });
    }
    if (message.includes("invalid login credentials")) {
      return buildAuthError("invalid_credentials", { status });
    }
    if (message.includes("already registered")) {
      return buildAuthError("user_already_exists", { status, field: "email" });
    }
    return buildAuthError("unknown", { status });
  }

  if (err instanceof Error) {
    if (err.name === "AbortError" || err.name === "TimeoutError") {
      return buildAuthError("timeout");
    }
    // fetch() rejects with a TypeError on DNS/connection failures
    if (
      err.name === "TypeError" &&
      /fetch|network|load failed/i.test(err.message)
    ) {
      return buildAuthError("network_error");
    }
  }

  return buildAuthError("unknown");
}

/** Dev-only diagnostics that never include credentials or raw payloads. */
export function logAuthIssue(context: string, error: AuthErrorResponse) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[auth] ${context}: ${error.code}${error.status ? ` (${error.status})` : ""}`
    );
  }
}
