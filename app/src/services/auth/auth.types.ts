import type { Session, User } from "@supabase/supabase-js";

export type UserRole = "customer" | "admin";

export interface UserMetadata {
  name: string;
  role: UserRole;
}

/** The Supabase user object exposed by the auth layer. */
export type AuthUser = User;

/** The Supabase session object exposed by the auth layer. */
export type AuthSession = Session;

/** Extra profile fields stored in `user_metadata` at sign up. */
export interface SignUpMetadata {
  name?: string;
  [key: string]: unknown;
}

export interface SignUpOptions {
  /** URL the email confirmation link redirects back to. */
  emailRedirectTo?: string;
}

/** Normalized, UI-safe auth error categories. */
export type AuthErrorCode =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "user_already_exists"
  | "rate_limited"
  | "weak_password"
  | "invalid_email"
  | "validation_failed"
  | "signup_disabled"
  | "network_error"
  | "timeout"
  | "service_unavailable"
  | "not_configured"
  | "unknown";

/** Error shape returned to consumers. Never contains raw server payloads. */
export interface AuthErrorResponse {
  code: AuthErrorCode;
  /** User-friendly message, safe to render directly. */
  message: string;
  /** HTTP status when the error came from the auth server. */
  status?: number;
  /** Form field the error relates to, for inline field errors. */
  field?: "email" | "password";
  /** For `weak_password`: which password rules failed. */
  reasons?: string[];
}

export type AuthResult<T> =
  { data: T; error: null } | { data: null; error: AuthErrorResponse };

export interface SignInData {
  user: AuthUser;
  session: AuthSession;
}

export interface SignUpData {
  user: AuthUser | null;
  session: AuthSession | null;
  /** True when email confirmation is enabled and no session was issued yet. */
  needsEmailConfirmation: boolean;
}

/** Identity derived from the Supabase session. */
export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  role: UserRole;
  userName: string;
}
