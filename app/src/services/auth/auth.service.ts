import { supabase } from "@/lib/supabase";
import type { AuthChangeEvent, SupabaseClient } from "@supabase/supabase-js";
import {
  buildAuthError,
  logAuthIssue,
  normalizeAuthError,
} from "./auth-errors";
import type {
  AdminSession,
  AuthErrorResponse,
  AuthResult,
  AuthSession,
  AuthState,
  AuthUser,
  SignInData,
  SignUpData,
  SignUpMetadata,
  SignUpOptions,
  UserMetadata,
  UserRole,
} from "./auth.types";

const ADMIN_STORAGE_KEY = "fth_admin_session";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SIGNED_OUT_STATE: AuthState = {
  user: null,
  session: null,
  adminSession: null,
  role: "customer",
  userName: "",
};

function parseEmailList(value: string | undefined): string[] {
  return (value || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function ok<T>(data: T): AuthResult<T> {
  return { data, error: null };
}

function fail(context: string, error: AuthErrorResponse) {
  logAuthIssue(context, error);
  return { data: null, error } as const;
}

/**
 * Business logic for customer (Supabase) and admin (local) authentication.
 * Stateless apart from persisted sessions — React state lives in AuthContext.
 */
export class AuthService {
  constructor(private readonly client: SupabaseClient | null) {}

  get isConfigured(): boolean {
    return this.client !== null;
  }

  // -------------------------------------------------------------------------
  // Identity rules
  // -------------------------------------------------------------------------

  static isAdminEmail(email?: string | null): boolean {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    return (
      parseEmailList(process.env.NEXT_PUBLIC_ADMIN_EMAILS).includes(
        cleanEmail
      ) ||
      cleanEmail === "admin@freshtohome.com" ||
      cleanEmail.startsWith("admin@")
    );
  }

  static parseUserMetadata(user: AuthUser): UserMetadata {
    const fallbackName = user.email ? user.email.split("@")[0] : "";

    // app_metadata can only be set server-side (service role), so it is the
    // trusted source for admin privileges (equivalent of custom claims)
    const appMeta = user.app_metadata ?? {};
    if (appMeta.admin === true || appMeta.role === "admin") {
      return {
        name:
          typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : fallbackName,
        role: "admin",
      };
    }

    const fallbackRole: UserRole = AuthService.isAdminEmail(user.email)
      ? "admin"
      : "customer";
    const meta = user.user_metadata ?? {};
    const parsedRole: UserRole =
      meta.role === "admin" || meta.role === "customer"
        ? meta.role
        : fallbackRole;

    return {
      name:
        typeof meta.name === "string" && meta.name ? meta.name : fallbackName,
      role: parsedRole,
    };
  }

  /**
   * Derives the app's auth state from a Supabase session. An active admin
   * session always wins; `dropCustomerSession` tells the caller a customer
   * session must be signed out to keep the two mutually exclusive.
   */
  resolveState(session: AuthSession | null): {
    state: AuthState;
    dropCustomerSession: boolean;
  } {
    const adminSession = this.getAdminSession();
    if (adminSession) {
      return {
        state: {
          ...SIGNED_OUT_STATE,
          adminSession,
          role: "admin",
          userName: adminSession.username || "Admin",
        },
        dropCustomerSession: !!session?.user,
      };
    }

    const user = session?.user ?? null;
    if (!user) {
      return {
        state: { ...SIGNED_OUT_STATE, session },
        dropCustomerSession: false,
      };
    }

    const meta = AuthService.parseUserMetadata(user);
    return {
      state: {
        user,
        session,
        adminSession: null,
        role: meta.role,
        userName: meta.name,
      },
      dropCustomerSession: false,
    };
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

  /** Drops the customer session on this device only, without a server call. */
  async signOutLocal(): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.auth.signOut({ scope: "local" });
    } catch (err) {
      logAuthIssue("signOut (local)", normalizeAuthError(err));
    }
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

    // Clear any admin session first, otherwise the auth listener would
    // sign this customer straight back out.
    this.clearAdminSession();

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

  async signUp(
    email: string,
    password: string,
    metadata: SignUpMetadata = {},
    options: SignUpOptions = {}
  ): Promise<AuthResult<SignUpData>> {
    if (!this.client) return fail("signUp", buildAuthError("not_configured"));

    const cleanEmail = email.trim();
    const invalid = this.validateCredentials(cleanEmail, password);
    if (invalid) return fail("signUp", invalid);

    this.clearAdminSession();

    try {
      const { data, error } = await this.client.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          // Self-service sign ups are always customers; the role is
          // forced here so callers cannot self-assign admin.
          data: {
            ...metadata,
            name: typeof metadata.name === "string" ? metadata.name.trim() : "",
            role: "customer" satisfies UserRole,
          },
          emailRedirectTo: options.emailRedirectTo,
        },
      });
      if (error) return fail("signUp", normalizeAuthError(error));

      // With "Confirm email" enabled and an already-registered address,
      // Supabase returns an obfuscated user with no identities instead of
      // an error (to prevent email enumeration).
      if (data.user && data.user.identities?.length === 0) {
        return fail(
          "signUp",
          buildAuthError("user_already_exists", { field: "email" })
        );
      }

      return ok({
        user: data.user,
        session: data.session,
        needsEmailConfirmation: !data.session,
      });
    } catch (err) {
      return fail("signUp", normalizeAuthError(err));
    }
  }

  async signOut(): Promise<AuthResult<null>> {
    this.clearAdminSession();
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

  async updateRole(
    user: AuthUser,
    role: UserRole,
    fallbackName: string
  ): Promise<AuthResult<null>> {
    if (!this.client) return ok(null);
    try {
      const meta = AuthService.parseUserMetadata(user);
      const { error } = await this.client.auth.updateUser({
        data: { name: meta.name || fallbackName, role },
      });
      if (error) return fail("setRole", normalizeAuthError(error));
      return ok(null);
    } catch (err) {
      return fail("setRole", normalizeAuthError(err));
    }
  }

  // -------------------------------------------------------------------------
  // Admin auth (local session)
  // -------------------------------------------------------------------------

  getAdminSession(): AdminSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AdminSession) : null;
    } catch {
      return null;
    }
  }

  clearAdminSession(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {
      // storage unavailable (private mode / blocked) — nothing to clear
    }
  }

  /** Demo credentials, also used to prefill the admin login form. */
  getAdminDemoCredentials(): { username: string; password: string } {
    return {
      username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin",
      password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "AdminPassword123!",
    };
  }

  /**
   * Verifies admin credentials and persists a local admin session. Any
   * customer session is signed out first to keep the two mutually exclusive.
   */
  async loginAdmin(
    identifier: string,
    password: string,
    { hasCustomerSession }: { hasCustomerSession: boolean }
  ): Promise<AdminSession | null> {
    const demo = this.getAdminDemoCredentials();
    const expectedUsername = demo.username.toLowerCase().trim();
    const expectedEmail = (
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@freshtohome.de"
    )
      .toLowerCase()
      .trim();
    const allowedEmails = parseEmailList(process.env.NEXT_PUBLIC_ADMIN_EMAILS);

    const cleanInput = identifier.trim().toLowerCase();
    const isValidUser =
      cleanInput === expectedUsername ||
      cleanInput === expectedEmail ||
      allowedEmails.includes(cleanInput);

    if (!isValidUser || password !== demo.password) return null;

    if (this.client && hasCustomerSession) {
      try {
        await this.client.auth.signOut();
      } catch (err) {
        logAuthIssue("signOut (admin login)", normalizeAuthError(err));
      }
    }

    const adminSession: AdminSession = {
      username: cleanInput.includes("@")
        ? cleanInput.split("@")[0]
        : cleanInput,
      email: cleanInput.includes("@") ? cleanInput : expectedEmail,
      role: "admin",
      loggedInAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminSession));
    } catch {
      logAuthIssue("persist admin session", buildAuthError("unknown"));
    }

    return adminSession;
  }
}

export const authService = new AuthService(supabase);
