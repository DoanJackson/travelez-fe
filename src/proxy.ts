// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_KEYS } from "@/lib/auth-constants"; // edge-safe — no js-cookie

// ─── Route classification ──────────────────────────────────────────────────

/**
 * Routes that require a valid tz_token cookie.
 * Unauthenticated visitors are redirected to /login.
 */
const PROTECTED_ROUTES = ["/my-itineraries", "/profile", "/messages"];

/**
 * Routes that authenticated users should not see.
 * Visitors with a token are redirected to /.
 * NOTE: /callback is intentionally excluded — OAuth handshake must always reach it.
 */
const AUTH_ROUTES = ["/login", "/register"];

const ADMIN_ROUTES = ["/admin"];
const ADMIN_LOGIN_ROUTES = ["/system"];

// ─── Helpers ───────────────────────────────────────────────────────────────

function isMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

// ─── Proxy (Next.js 16+ Edge Runtime) ──────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // XỬ LÝ UI ROUTES (AUTHENTICATION GUARD)
  // Use NextRequest.cookies (Edge-native API) — no js-cookie import needed
  const token = request.cookies.get(AUTH_COOKIE_KEYS.TOKEN)?.value;

  const role = request.cookies.get("tz_role")?.value;

  if (isMatch(pathname, ADMIN_ROUTES)) {
    if (!token || role !== "ADMIN") {
      // Nếu không phải admin hoặc chưa login, tống về trang chủ một cách im lặng
      return NextResponse.redirect(new URL("/system", request.url));
    }
  }

  if (isMatch(pathname, ADMIN_LOGIN_ROUTES) && token) {
    if (role === "ADMIN") {
      // Đã là Admin thì đẩy thẳng vào trong, không cho login lại
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      // User thường lỡ tay lọt vào /system nhưng đã có token -> trả về trang chủ
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Rule 1: Protected route + no token → redirect to /login
  if (isMatch(pathname, PROTECTED_ROUTES) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Rule 2: Auth route + has token → redirect to home
  if (isMatch(pathname, AUTH_ROUTES) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────
// Surgical — only intercepts the routes that need guarding OR proxying.

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/system",
    "/my-itineraries",
    "/messages",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
