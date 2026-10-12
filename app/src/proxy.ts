import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";

const CUSTOMER_ONLY = ["/checkout", "/orders", "/profile"] as const;
const GUEST_ONLY = ["/login", "/signup", "/forgot-password", "/otp"] as const;

function matches(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Refreshes the Supabase auth cookie and performs optimistic route checks.
 * Authoritative checks live in the DAL (`requireUser` / `requireAdmin`).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!supabaseEnv) return response;

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Revalidates the token with the auth server and rotates it if expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.app_metadata?.role === "admin";
  const { pathname, search } = request.nextUrl;

  const redirectTo = (path: string, withReturn: boolean) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = withReturn
      ? `?redirect=${encodeURIComponent(pathname + search)}`
      : "";
    const redirect = NextResponse.redirect(url);
    // Keep any refreshed session cookies on the redirect.
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    return redirect;
  };

  if (pathname === "/admin/login") {
    return isAdmin ? redirectTo("/admin", false) : response;
  }
  if (matches(pathname, ["/admin"]) && !isAdmin) {
    return redirectTo("/admin/login", true);
  }
  if (matches(pathname, CUSTOMER_ONLY) && !user) {
    return redirectTo("/login", true);
  }
  if (matches(pathname, GUEST_ONLY) && user) {
    return redirectTo(isAdmin ? "/admin" : "/catalog", false);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|images/|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
