"use client";

import {
  authService,
  SIGNED_OUT_STATE,
  type AuthResult,
  type AuthSession,
  type AuthState,
  type AuthUser,
  type SignInData,
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

interface AuthContextType {
  user: AuthUser | null;
  /** True until the initial session has been resolved. */
  isLoading: boolean;
  /** UI hint only — the server re-checks the role on every admin read/write. */
  role: UserRole;
  isAdmin: boolean;

  signIn: (email: string, password: string) => Promise<AuthResult<SignInData>>;
  /**
   * Re-reads the session cookie. Call after a Server Action signs the user
   * in (e.g. OTP verification), since that does not emit a browser event.
   */
  syncSession: () => Promise<void>;
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
  const { user, role } = state;

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
      applySession(result.data);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  const signIn = useCallback(
    (email: string, password: string) => authService.signIn(email, password),
    []
  );

  const syncSession = useCallback(async () => {
    const result = await authService.getSession();
    setState(authService.resolveState(result.data));
  }, []);

  const signOut = useCallback(async () => {
    const result = await authService.signOut();
    setState(SIGNED_OUT_STATE);
    return result;
  }, []);

  const loginAdmin = useCallback(
    (email: string, password: string) =>
      authService.loginAdmin(email, password),
    []
  );

  const isAdmin = role === "admin";

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      role,
      isAdmin,
      signIn,
      syncSession,
      signOut,
      loginAdmin,
    }),
    [user, isLoading, role, isAdmin, signIn, syncSession, signOut, loginAdmin]
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
