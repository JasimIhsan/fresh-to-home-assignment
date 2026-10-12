"use client";

import {
  authService,
  SIGNED_OUT_STATE,
  type AuthErrorResponse,
  type AuthResult,
  type AuthSession,
  type AuthState,
  type AuthUser,
  type SignInData,
  type SignUpData,
  type SignUpMetadata,
  type SignUpOptions,
  type UserRole,
} from "@/services/auth";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type {
  AuthErrorCode,
  AuthErrorResponse,
  AuthResult,
  AuthSession,
  AuthUser,
  SignInData,
  SignUpData,
  SignUpMetadata,
  SignUpOptions,
  UserMetadata,
  UserRole,
} from "@/services/auth";

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  /** True until the initial session has been resolved. */
  isLoading: boolean;
  /** @deprecated Use `isLoading`. */
  loading: boolean;
  /** Last error raised by an auth action or session sync. */
  error: AuthErrorResponse | null;
  clearError: () => void;

  userName: string;
  /** UI hint only — the server re-checks the role on every admin read/write. */
  role: UserRole;
  isAdmin: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;

  signIn: (email: string, password: string) => Promise<AuthResult<SignInData>>;
  signUp: (
    email: string,
    password: string,
    metadata?: SignUpMetadata,
    options?: SignUpOptions
  ) => Promise<AuthResult<SignUpData>>;
  signOut: () => Promise<AuthResult<null>>;
  loginAdmin: (
    email: string,
    password: string
  ) => Promise<AuthResult<SignInData>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(SIGNED_OUT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthErrorResponse | null>(null);
  const { user, session, role, userName } = state;

  const clearError = useCallback(() => setError(null), []);

  /** Records a failed result as the context error and passes it through. */
  const track = useCallback(<T,>(result: AuthResult<T>): AuthResult<T> => {
    if (result.error) setError(result.error);
    return result;
  }, []);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;

    // Must stay synchronous — awaiting Supabase calls inside
    // onAuthStateChange can deadlock the auth client.
    const applySession = (nextSession: AuthSession | null) => {
      if (!active) return;
      setState(authService.resolveState(nextSession));
      setIsLoading(false);
    };

    if (!authService.isConfigured) {
      queueMicrotask(() => applySession(null));
      return () => {
        active = false;
      };
    }

    const unsubscribe = authService.onAuthStateChange((event, nextSession) => {
      if (event !== "INITIAL_SESSION") receivedAuthEvent = true;
      applySession(nextSession);
      // Server Components read the session cookie; re-render them when it
      // changes so server-rendered data matches the new identity.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setTimeout(() => router.refresh(), 0);
      }
    });

    authService.getSession().then((result) => {
      // A sign-in/out that landed while this was in flight is newer
      if (!active || receivedAuthEvent) return;
      if (result.error) setError(result.error);
      applySession(result.data);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      return track(await authService.signIn(email, password));
    },
    [track]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      metadata?: SignUpMetadata,
      options?: SignUpOptions
    ) => {
      setError(null);
      return track(
        await authService.signUp(email, password, metadata, options)
      );
    },
    [track]
  );

  const signOut = useCallback(async () => {
    setError(null);
    const result = track(await authService.signOut());
    setState(SIGNED_OUT_STATE);
    return result;
  }, [track]);

  const loginAdmin = useCallback(
    async (email: string, password: string) => {
      setError(null);
      return track(await authService.loginAdmin(email, password));
    },
    [track]
  );

  const isAdmin = role === "admin";

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      isLoading,
      loading: isLoading,
      error,
      clearError,
      userName,
      role,
      isAdmin,
      isCustomer: !isAdmin,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      loginAdmin,
    }),
    [
      user,
      session,
      isLoading,
      error,
      clearError,
      userName,
      role,
      isAdmin,
      signIn,
      signUp,
      signOut,
      loginAdmin,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth() must be used within an <AuthProvider>. Wrap your component tree (e.g. in app/layout.tsx) with <AuthProvider>."
    );
  }
  return context;
}
