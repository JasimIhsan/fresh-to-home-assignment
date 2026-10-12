import { supabase } from "@/lib/supabase/client";
import type { AuthChangeEvent, SupabaseClient } from "@supabase/supabase-js";
import {
  buildAuthError,
  logAuthIssue,
  normalizeAuthError,
} from "./auth-errors";
import type {
  AuthErrorResponse,
  AuthResult,
  AuthSession,
  AuthState,
  AuthUser,
  SignInData,
  UserMetadata,
} from "./auth.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SIGNED_OUT_STATE: AuthState = {
  user: null,
  session: null,
  role: "customer",
  userName: "",
};

function ok<T>(data: T): AuthResult<T> {
  return { data, error: null };
}

function fail(context: string, error: AuthErrorResponse) {
  logAuthIssue(context, error);
  return { data: null, error } as const;
}

/**
 * Browser-side auth flows on Supabase. Sign up and OTP verification run as
 * Server Actions (src/app/actions/auth.actions.ts). Sessions live in cookies so the
 * server (DAL, Server Actions) sees the same user. React state lives in
 * AuthContext; authorization is enforced server-side.
 */
export class AuthService {
  constructor(private readonly client: SupabaseClient | null) {}

  get isConfigured(): boolean {
    return this.client !== null;
  }

  // -------------------------------------------------------------------------
  // Identity rules
  // -------------------------------------------------------------------------

  static parseUserMetadata(user: AuthUser): UserMetadata {
    const fallbackName = user.email ? user.email.split("@")[0] : "";
    // Sign up stores `full_name`; accounts created earlier used `name`.
    const name: unknown =
      user.user_metadata?.full_name ?? user.user_metadata?.name;
    return {
      name: typeof name === "string" && name ? name : fallbackName,
      // app_metadata is only writable with the service role, so it is the
      // sole trusted source for admin privileges. user_metadata is not.
      role: user.app_metadata?.role === "admin" ? "admin" : "customer",
    };
  }

  /** Derives the app's auth state from a Supabase session. */
  resolveState(session: AuthSession | null): AuthState {
    const user = session?.user ?? null;
    if (!user) return { ...SIGNED_OUT_STATE, session };

    const meta = AuthService.parseUserMetadata(user);
    return { user, session, role: meta.role, userName: meta.name };
  }

  private validateCredentials(
    email: string,
    password: string
  ): AuthErrorResponse | null {
    if (!EMAIL_PATTERN.test(email)) {
      return buildAuthError("invalid_email", { field: "email" });
    }
    if (!password) {
      return {
        code: "validation_failed",
        message: "Please enter your password.",
        field: "password",
      };
    }
    return null;
  }

  // -------------------------------------------------------------------------
  // Session
  // -------------------------------------------------------------------------

  async getSession(): Promise<AuthResult<AuthSession | null>> {
    if (!this.client) return ok(null);
    try {
      const { data, error } = await this.client.auth.getSession();
      if (error) return fail("getSession", normalizeAuthError(error));
      return ok(data.session);
    } catch (err) {
      return fail("getSession", normalizeAuthError(err));
    }
  }

  /**
   * Subscribes to Supabase auth changes and returns an unsubscribe function.
   * The callback must stay synchronous — awaiting Supabase calls inside
   * onAuthStateChange can deadlock the auth client.
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: AuthSession | null) => void
  ): () => void {
    if (!this.client) return () => {};
    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  }

  // -------------------------------------------------------------------------
  // Customer auth
  // -------------------------------------------------------------------------

  async signIn(
    email: string,
    password: string
  ): Promise<AuthResult<SignInData>> {
    if (!this.client) return fail("signIn", buildAuthError("not_configured"));

    const cleanEmail = email.trim();
    const invalid = this.validateCredentials(cleanEmail, password);
    if (invalid) return fail("signIn", invalid);

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) return fail("signIn", normalizeAuthError(error));
      return ok({ user: data.user, session: data.session });
    } catch (err) {
      return fail("signIn", normalizeAuthError(err));
    }
  }

  async signOut(): Promise<AuthResult<null>> {
    if (!this.client) return ok(null);

    try {
      const { error } = await this.client.auth.signOut();
      if (!error) return ok(null);
      // Server revocation failed (e.g. offline) — still drop the local
      // session so the user is signed out on this device.
      await this.client.auth.signOut({ scope: "local" }).catch(() => {});
      return fail("signOut", normalizeAuthError(error));
    } catch (err) {
      await this.client.auth.signOut({ scope: "local" }).catch(() => {});
      return fail("signOut", normalizeAuthError(err));
    }
  }

  async requestPasswordReset(
    email: string,
    redirectTo: string
  ): Promise<AuthResult<null>> {
    // Without Supabase there is nothing to send; treat as sent (demo mode)
    if (!this.client) return ok(null);
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );
      if (error) return fail("resetPassword", normalizeAuthError(error));
      return ok(null);
    } catch (err) {
      return fail("resetPassword", normalizeAuthError(err));
    }
  }

  async updatePassword(password: string): Promise<AuthResult<null>> {
    if (!this.client) {
      return fail("updatePassword", buildAuthError("not_configured"));
    }
    try {
      const { error } = await this.client.auth.updateUser({ password });
      if (error) return fail("updatePassword", normalizeAuthError(error));
      return ok(null);
    } catch (err) {
      return fail("updatePassword", normalizeAuthError(err));
    }
  }

  /**
   * Signs in and requires the admin role from app_metadata. A valid
   * non-admin account is signed straight back out.
   */
  async loginAdmin(
    email: string,
    password: string
  ): Promise<AuthResult<SignInData>> {
    const result = await this.signIn(email, password);
    if (result.error) return result;

    if (AuthService.parseUserMetadata(result.data.user).role !== "admin") {
      await this.client?.auth.signOut({ scope: "local" }).catch(() => {});
      return fail(
        "loginAdmin",
        buildAuthError("invalid_credentials", { field: "email" })
      );
    }
    return result;
  }
}

export const authService = new AuthService(supabase);
