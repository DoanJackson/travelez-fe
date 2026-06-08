"use client"; // js-cookie is browser-only; server reads use getTokenFromRequest()
import Cookies from "js-cookie";

import { AUTH_COOKIE_KEYS } from "./auth-constants";
export { AUTH_COOKIE_KEYS }; // re-export — existing consumers unchanged

// ─── Shared options ────────────────────────────────────────────────────────

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * path and domain must match exactly between set() and clear().
 * Mismatch is the #1 cause of "ghost cookies" that appear removed
 * client-side but are still sent by the browser on every request.
 */
const COOKIE_PATH = "/";
const COOKIE_DOMAIN = IS_PROD
  ? (process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? undefined)
  : undefined;

const BASE_OPTIONS: Cookies.CookieAttributes = {
  // "Lax" allows cookies on cross-site top-level navigations (external links, emails).
  // "Strict" was blocking the cookie from being sent when users followed shared URLs,
  // causing the middleware to find no token and redirect logged-in users to /login.
  sameSite: "Lax",
  secure: IS_PROD, // Secure flag only over HTTPS; disabled on http://localhost
  path: COOKIE_PATH,
  domain: COOKIE_DOMAIN,
};

// ─── Browser-side auth cookie helpers ─────────────────────────────────────

export const AuthCookies = {
  /**
   * Store all three auth values after a successful login.
   * @param rememberMe  true → 7-day persistent cookie; false → session cookie (deleted on browser close)
   */
  set(token: string, userId: number, role: string, rememberMe = true): void {
    const opts: Cookies.CookieAttributes = rememberMe
      ? { ...BASE_OPTIONS, expires: 7 }
      : BASE_OPTIONS; // no `expires` → session cookie

    Cookies.set(AUTH_COOKIE_KEYS.TOKEN, token, opts);
    Cookies.set(AUTH_COOKIE_KEYS.USER_ID, String(userId), opts);
    Cookies.set(AUTH_COOKIE_KEYS.ROLE, role, opts);
  },

  getToken(): string | undefined {
    return Cookies.get(AUTH_COOKIE_KEYS.TOKEN);
  },
  getUserId(): string | undefined {
    return Cookies.get(AUTH_COOKIE_KEYS.USER_ID);
  },
  getRole(): string | undefined {
    return Cookies.get(AUTH_COOKIE_KEYS.ROLE);
  },

  /**
   * Remove all auth cookies.
   * IMPORTANT: path + domain must mirror set() exactly — otherwise the old
   * scoped cookie still exists and is sent by the browser (ghost cookie).
   */
  clear(): void {
    const removeOpts = { path: COOKIE_PATH, domain: COOKIE_DOMAIN };
    Object.values(AUTH_COOKIE_KEYS).forEach((key) =>
      Cookies.remove(key, removeOpts),
    );
  },
};

// ─── Proxy (Edge Runtime Middleware) server util ──────────────────────────

/**
 * Parse the JWT token from an incoming Next.js request in proxy/middleware.
 * Does NOT import js-cookie (browser-only) — safe to use in `src/proxy.ts`.
 *
 * @example
 * // proxy.ts
 * import { getTokenFromRequest } from "@/lib/cookie";
 * export function proxy(request: NextRequest) {
 *   const token = getTokenFromRequest(request);
 *   if (!token) return NextResponse.redirect(new URL("/login", request.url));
 * }
 */
export function getTokenFromRequest(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_KEYS.TOKEN}=([^;]*)`),
  );
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}
