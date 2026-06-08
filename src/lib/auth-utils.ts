import { AuthCookies } from "@/lib/cookie";

/**
 * If a response returned 401 (Unauthorized / expired token), clear all auth
 * state and redirect to /login with the current path as returnUrl.
 *
 * Call this before throwing inside any authenticated service function.
 * Do NOT call this on login/register endpoints — 401 there means wrong
 * credentials, not an expired token.
 *
 * Safe in SSR contexts: the redirect only runs when `window` is available.
 */
export function handleUnauthorized(status: number): void {
  if (status !== 401) return;
  if (typeof window !== "undefined") {
    AuthCookies.clear();
    localStorage.removeItem("TRAVELEZ_CURRENT_USER");
    window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
  }
}
