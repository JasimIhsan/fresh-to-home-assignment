"use client";

import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut, onAuthStateChanged, updateProfile, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "customer" | "admin";

export interface UserMetadata {
   name: string;
   role: UserRole;
}

export function isAdminEmail(email?: string | null): boolean {
   if (!email) return false;
   const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
   const adminList = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

   const cleanEmail = email.trim().toLowerCase();
   return (
      adminList.includes(cleanEmail) ||
      cleanEmail === "admin@freshtohome.com" ||
      cleanEmail.startsWith("admin@")
   );
}

export function parseUserMetadata(displayName?: string | null, email?: string | null): UserMetadata {
   const fallbackRole: UserRole = isAdminEmail(email) ? "admin" : "customer";
   if (!displayName) {
      return {
         name: email ? email.split("@")[0] : "",
         role: fallbackRole,
      };
   }

   try {
      const parsed = JSON.parse(displayName);
      if (parsed && typeof parsed === "object") {
         const parsedRole: UserRole =
            parsed.role === "admin" || parsed.role === "customer"
               ? parsed.role
               : fallbackRole;
         return {
            name: typeof parsed.name === "string" ? parsed.name : "",
            role: parsedRole,
         };
      }
   } catch {
      // If displayName was stored as raw role string e.g. "admin" or "customer"
      if (displayName === "admin" || displayName === "customer") {
         return {
            name: email ? email.split("@")[0] : "",
            role: displayName as UserRole,
         };
      }
   }

   return {
      name: displayName,
      role: fallbackRole,
   };
}

interface AdminSession {
   username: string;
   email: string;
   role: "admin";
   loggedInAt: string;
}

const ADMIN_STORAGE_KEY = "fth_admin_session";

interface AuthContextType {
   user: User | null;
   userName: string;
   role: UserRole;
   isAdmin: boolean;
   isCustomer: boolean;
   loading: boolean;
   isAuthenticated: boolean;
   adminSession: AdminSession | null;
   loginAdmin: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
   toggleRole: () => Promise<void>;
   setRole: (role: UserRole) => Promise<void>;
   signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
   const [userName, setUserName] = useState<string>("");
   const [role, setRoleState] = useState<UserRole>("customer");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // 1. Check local admin session first
      try {
         const rawAdmin = typeof window !== "undefined" ? localStorage.getItem(ADMIN_STORAGE_KEY) : null;
         if (rawAdmin) {
            const parsed: AdminSession = JSON.parse(rawAdmin);
            setAdminSession(parsed);
            setRoleState("admin");
            setUserName(parsed.username || "Admin");
            setLoading(false);
         }
      } catch (e) {
         console.warn("Failed to parse admin session", e);
      }

      if (!auth) {
         setLoading(false);
         return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         setUser(currentUser);
         // If there is an active admin session, prioritize admin
         const existingAdmin = typeof window !== "undefined" ? localStorage.getItem(ADMIN_STORAGE_KEY) : null;
         if (existingAdmin) {
            try {
               const parsed: AdminSession = JSON.parse(existingAdmin);
               setAdminSession(parsed);
               setRoleState("admin");
               setUserName(parsed.username || "Admin");
               setLoading(false);
               return;
            } catch {
               // proceed to firebase user
            }
         }

         if (currentUser) {
            try {
               const tokenResult = await currentUser.getIdTokenResult();
               const isClaimAdmin =
                  tokenResult.claims.admin === true ||
                  tokenResult.claims.role === "admin";

               const meta = parseUserMetadata(currentUser.displayName, currentUser.email);

               if (isClaimAdmin) {
                  setRoleState("admin");
               } else {
                  setRoleState(meta.role);
               }
               setUserName(meta.name || currentUser.displayName || currentUser.email?.split("@")[0] || "");
            } catch (err) {
               console.error("Error checking token claims or metadata:", err);
               const meta = parseUserMetadata(currentUser.displayName, currentUser.email);
               setRoleState(meta.role);
               setUserName(meta.name || currentUser.displayName || currentUser.email?.split("@")[0] || "");
            }
         } else if (!existingAdmin) {
            setRoleState("customer");
            setUserName("");
         }
         setLoading(false);
      });
      return () => unsubscribe();
   }, []);

   const loginAdmin = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const expectedUsername = (process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin").toLowerCase().trim();
      const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "AdminPassword123!";
      const expectedEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@freshtohome.de").toLowerCase().trim();
      const allowedEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
         .split(",")
         .map((e) => e.trim().toLowerCase())
         .filter(Boolean);

      const cleanInput = identifier.trim().toLowerCase();

      const isValidUser =
         cleanInput === expectedUsername ||
         cleanInput === expectedEmail ||
         allowedEmails.includes(cleanInput);

      const isValidPass = password === expectedPassword;

      if (!isValidUser || !isValidPass) {
         return { success: false, error: "Invalid username or password" };
      }

      const session: AdminSession = {
         username: cleanInput.includes("@") ? cleanInput.split("@")[0] : cleanInput,
         email: cleanInput.includes("@") ? cleanInput : expectedEmail,
         role: "admin",
         loggedInAt: new Date().toISOString(),
      };

      try {
         localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      } catch (err) {
         console.warn("Could not save admin session to localStorage", err);
      }

      setAdminSession(session);
      setRoleState("admin");
      setUserName(session.username);

      return { success: true };
   };

   const setRole = async (newRole: UserRole) => {
      setRoleState(newRole);
      if (user) {
         try {
            const meta = parseUserMetadata(user.displayName, user.email);
            await updateProfile(user, {
               displayName: JSON.stringify({ name: meta.name || userName, role: newRole }),
            });
         } catch (error) {
            console.error("Error updating role in user profile:", error);
         }
      }
   };

   const toggleRole = async () => {
      const nextRole: UserRole = role === "customer" ? "admin" : "customer";
      await setRole(nextRole);
   };

   const signOut = async () => {
      try {
         if (typeof window !== "undefined") {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
         }
         setAdminSession(null);
         if (auth) {
            await firebaseSignOut(auth);
         }
      } catch (error) {
         console.error("Error during signOut:", error);
      } finally {
         setUser(null);
         setUserName("");
         setRoleState("customer");
      }
   };

   const effectiveIsAdmin = role === "admin" || !!adminSession;

   return (
      <AuthContext.Provider
         value={{
            user,
            userName,
            role,
            isAdmin: effectiveIsAdmin,
            isCustomer: !effectiveIsAdmin,
            loading,
            isAuthenticated: !!user || !!adminSession,
            adminSession,
            loginAdmin,
            toggleRole,
            setRole,
            signOut,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => useContext(AuthContext);


