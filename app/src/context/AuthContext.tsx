"use client";

import {
  authService,
  SIGNED_OUT_STATE,
  type AdminSession,
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
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type {
  AdminSession,
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
  role: UserRole;
  isAdmin: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;
  adminSession: AdminSession | null;

  signIn: (email: string, password: string) => Promise<AuthResult<SignInData>>;
  signUp: (
    email: string,
    password: string,
    metadata?: SignUpMetadata,
    options?: SignUpOptions
  ) => Promise<AuthResult<SignUpData>>;
  signOut: () => Promise<AuthResult<null>>;

  loginAdmin: (
    identifier: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  toggleRole: () => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(SIGNED_OUT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthErrorResponse | null>(null);
  const { user, session, adminSession, role, userName } = state;

  const clearError = useCallback(() => setError(null), []);

  /** Records a failed result as the context error and passes it through. */
  const track = useCallback(<T,>(result: AuthResult<T>): AuthResult<T> => {
    if (result.error) setError(result.error);
    return result;
  }, []);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;

    // Must stay synchronous — see authService.onAuthStateChange
    const applySession = (nextSession: AuthSession | null) => {
      if (!active) return;
      const { state: nextState, dropCustomerSession } =
        authService.resolveState(nextSession);
      if (dropCustomerSession) {
        setTimeout(() => void authService.signOutLocal(), 0);
      }
      setState(nextState);
      setIsLoading(false);
    };

    if (!authService.isConfigured) {
      // No Supabase: only a local admin session can exist
      queueMicrotask(() => applySession(null));
      return () => {
        active = false;
      };
    }

    const unsubscribe = authService.onAuthStateChange((event, nextSession) => {
      if (event !== "INITIAL_SESSION") receivedAuthEvent = true;
      applySession(nextSession);
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
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      const result = track(await authService.signIn(email, password));
      // The service clears any admin session before signing in
      const nextAdmin = authService.getAdminSession();
      setState((s) => ({ ...s, adminSession: nextAdmin }));
      return result;
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
      const result = track(
        await authService.signUp(email, password, metadata, options)
      );
      const nextAdmin = authService.getAdminSession();
      setState((s) => ({ ...s, adminSession: nextAdmin }));
      return result;
    },
    [track]
  );

  const signOut = useCallback(async () => {
    setError(null);
    setState((s) => ({ ...s, adminSession: null }));
    const result = track(await authService.signOut());
    setState(SIGNED_OUT_STATE);
    return result;
  }, [track]);

  const loginAdmin = useCallback(
    async (identifier: string, password: string) => {
      const nextAdmin = await authService.loginAdmin(identifier, password, {
        hasCustomerSession: !!user,
      });
      if (!nextAdmin) {
        return { success: false, error: "Invalid username or password" };
      }
      setState({
        ...SIGNED_OUT_STATE,
        adminSession: nextAdmin,
        role: "admin",
        userName: nextAdmin.username,
      });
      return { success: true };
    },
    [user]
  );

  const setRole = useCallback(
    async (newRole: UserRole) => {
      setState((s) => ({ ...s, role: newRole }));
      if (user) await authService.updateRole(user, newRole, userName);
    },
    [user, userName]
  );

  const toggleRole = useCallback(async () => {
    await setRole(role === "customer" ? "admin" : "customer");
  }, [role, setRole]);

  const effectiveIsAdmin = role === "admin" || !!adminSession;

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
      isAdmin: effectiveIsAdmin,
      isCustomer: !effectiveIsAdmin,
      isAuthenticated: !!user || !!adminSession,
      adminSession,
      signIn,
      signUp,
      signOut,
      loginAdmin,
      toggleRole,
      setRole,
    }),
    [
      user,
      session,
      isLoading,
      error,
      clearError,
      userName,
      role,
      effectiveIsAdmin,
      adminSession,
      signIn,
      signUp,
      signOut,
      loginAdmin,
      toggleRole,
      setRole,
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
