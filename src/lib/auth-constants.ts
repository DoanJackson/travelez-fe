// src/lib/auth-constants.ts
// Edge-safe: no imports, no browser APIs — safe for proxy.ts and cookie.ts

/**
 * Cookie key names shared between:
 *  - src/lib/cookie.ts     (browser / client components)
 *  - src/proxy.ts           (Next.js Edge Runtime)
 */
export const AUTH_COOKIE_KEYS = {
  TOKEN: "tz_token",
  USER_ID: "tz_user_id",
  ROLE: "tz_role",
} as const;
